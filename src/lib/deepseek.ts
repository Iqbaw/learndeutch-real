// ============================================================
// DeepSeek (V4) server-side client.
//
// This module is SERVER ONLY — it is imported exclusively from
// Next.js API routes (src/app/api/**). The API key is read from
// the environment and never reaches the browser.
//
// DeepSeek exposes an OpenAI-compatible Chat Completions API and
// supports strict JSON output, which we rely on for generating
// structured placement questions and lessons.
//
// NOTE: only import this from server code (API routes under
// src/app/api/**). It reads process.env.DEEPSEEK_API_KEY which is
// never exposed to the client.
// ============================================================

const DEFAULT_BASE_URL = "https://api.deepseek.com";
const DEFAULT_MODEL = "deepseek-v4-flash";

export function isAIEnabled(): boolean {
  return Boolean(process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY.trim());
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatJSONOptions {
  /** Lower = more deterministic. Placement scoring uses low temp, creative lessons use higher. */
  temperature?: number;
  /** Max tokens for the completion. */
  maxTokens?: number;
  /** Abort the request after this many ms. */
  timeoutMs?: number;
}

export class DeepSeekError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "DeepSeekError";
    this.status = status;
  }
}

/**
 * Call DeepSeek and parse the model's reply as JSON.
 *
 * Uses response_format: json_object so the model is forced to emit a single
 * valid JSON object. Throws DeepSeekError on transport / parse failures so
 * callers can fall back to static content.
 */
export async function chatJSON<T = unknown>(
  messages: ChatMessage[],
  options: ChatJSONOptions = {}
): Promise<T> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    throw new DeepSeekError("DEEPSEEK_API_KEY is not configured");
  }

  const baseUrl = (process.env.DEEPSEEK_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(/\/$/, "");
  const model = process.env.DEEPSEEK_MODEL?.trim() || DEFAULT_MODEL;
  const { temperature = 0.4, maxTokens = 2400, timeoutMs = 30_000 } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
        stream: false,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    const reason = err instanceof Error ? err.message : "network error";
    throw new DeepSeekError(`DeepSeek request failed: ${reason}`);
  }
  clearTimeout(timeout);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new DeepSeekError(
      `DeepSeek API error (${response.status}): ${text.slice(0, 300)}`,
      response.status
    );
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new DeepSeekError("DeepSeek returned an empty response");
  }

  try {
    return JSON.parse(content) as T;
  } catch {
    // Best-effort: extract the first {...} block if the model wrapped it.
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        /* fall through */
      }
    }
    throw new DeepSeekError("Failed to parse DeepSeek JSON response");
  }
}
