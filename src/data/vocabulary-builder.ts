import type { CEFRLevel, VocabularyItem } from "@/types";

/** Compact, original vocabulary entries. Rows: German | Indonesian | German example | Indonesian example | optional plural. */
export function vocabularyGroup(level: CEFRLevel, category: string, emoji: string, rows: string): VocabularyItem[] {
  return rows.trim().split("\n").map((line) => {
    const [german, indonesian, exampleA1, exampleTranslation, plural] = line.trim().split("|").map((part) => part.trim());
    if (!german || !indonesian || !exampleA1 || !exampleTranslation) {
      throw new Error(`Incomplete vocabulary entry: ${line}`);
    }
    const article = /^(der|die|das)\s/.exec(german)?.[1] as VocabularyItem["article"];
    const slug = german.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return {
      id: `core-${level.toLowerCase().replace(".", "")}-${slug}`,
      german, indonesian, exampleA1, exampleTranslation,
      ...(article ? { article } : {}),
      ...(plural ? { plural } : {}),
      level, category, emoji,
    };
  });
}
