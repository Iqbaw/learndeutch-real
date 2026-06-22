import { type ReactNode } from "react";

// ============================================================
// FormattedText
//
// Renders the small subset of inline markdown the AI (DeepSeek)
// commonly emits — **bold**, *italic*, and `code` — as real React
// elements. This fixes text that previously showed literal "**"
// markers instead of becoming bold.
//
// It injects NO HTML (only React nodes), so it is XSS-safe.
// Unknown markdown is left as plain text.
// ============================================================

interface Rule {
  re: RegExp;
  wrap: (inner: string, key: string) => ReactNode;
}

const rules: Rule[] = [
  {
    // **bold**
    re: /\*\*(.+?)\*\*/g,
    wrap: (inner, key) => <strong key={key}>{inner}</strong>,
  },
  {
    // `code`
    re: /`([^`]+)`/g,
    wrap: (inner, key) => (
      <code key={key} className="rounded bg-elevated px-1 py-0.5 font-mono text-[0.9em]">
        {inner}
      </code>
    ),
  },
  {
    // *italic* (single asterisks, not part of a ** pair)
    re: /\*(.+?)\*/g,
    wrap: (inner, key) => <em key={key}>{inner}</em>,
  },
];

function applyRule(text: string, ruleIdx: number): ReactNode[] {
  if (ruleIdx >= rules.length) return text ? [text] : [];
  const { re, wrap } = rules[ruleIdx];
  const out: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let k = 0;
  re.lastIndex = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) out.push(...applyRule(text.slice(last, match.index), ruleIdx + 1));
    out.push(wrap(match[1] ?? "", `r${ruleIdx}-${k++}`));
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push(...applyRule(text.slice(last), ruleIdx + 1));
  return out;
}

/** Parse a limited subset of inline markdown into React nodes. */
export function renderInlineMarkdown(text: string): ReactNode[] {
  if (!text) return [];
  return applyRule(text, 0);
}

export function FormattedText({ text, className }: { text: string; className?: string }) {
  return <span className={className}>{renderInlineMarkdown(text)}</span>;
}
