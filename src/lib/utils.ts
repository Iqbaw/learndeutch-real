/**
 * Lightweight className combiner (no extra deps).
 * Filters out falsy values and joins the rest with a space.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Clamp a number between min and max. */
export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

/** Format minutes into a friendly Indonesian duration label. */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} menit`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} jam` : `${h} jam ${m} menit`;
}

/**
 * Fold German umlauts/ß to a canonical form so answers typed without the
 * special characters still count as correct. Both "schön", "schoen" and
 * "schon" → "schon"; "über", "ueber", "uber" → "uber"; "Straße"/"strasse" → "strase".
 * Lowercases the input.
 */
export function foldGerman(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/ae/g, "a")
    .replace(/oe/g, "o")
    .replace(/ue/g, "u")
    .replace(/ss/g, "s");
}

/** Normalize a German phrase for forgiving comparison (umlauts + punctuation + spacing). */
export function normalizeAnswer(s: string): string {
  return foldGerman(s)
    .replace(/[.,!?;:"'„""()\-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
