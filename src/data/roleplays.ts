import type { Roleplay } from "@/types";

// Speaking Lab roleplays (PRD section 13.6)
export const roleplays: Roleplay[] = [
  {
    id: "r1",
    title: "Kenalan dengan Teman Baru",
    scenario: "Kamu bertemu seseorang di kelas bahasa dan saling memperkenalkan diri.",
    level: "A1.1",
    emoji: "🤝",
    turns: [
      { speaker: "ai", text: "Hallo! Wie heißt du?", translation: "Halo! Siapa namamu?" },
      { speaker: "user", text: "Hallo! Ich heiße ...", translation: "Halo! Nama saya ..." },
      { speaker: "ai", text: "Woher kommst du?", translation: "Dari mana asalmu?" },
      { speaker: "user", text: "Ich komme aus Indonesien.", translation: "Saya dari Indonesia." },
      { speaker: "ai", text: "Schön, dich kennenzulernen!", translation: "Senang berkenalan denganmu!" },
    ],
  },
  {
    id: "r2",
    title: "Pesan Kopi di Kafe",
    scenario: "Kamu memesan minuman di sebuah kafe di Berlin.",
    level: "A1.1",
    emoji: "☕",
    turns: [
      { speaker: "ai", text: "Guten Tag! Was möchten Sie?", translation: "Selamat siang! Anda mau pesan apa?" },
      { speaker: "user", text: "Ich möchte einen Kaffee, bitte.", translation: "Saya mau satu kopi, tolong." },
      { speaker: "ai", text: "Mit Milch?", translation: "Dengan susu?" },
      { speaker: "user", text: "Ja, bitte. Danke!", translation: "Ya, tolong. Terima kasih!" },
    ],
  },
  {
    id: "r3",
    title: "Tanya Arah",
    scenario: "Kamu tersesat dan bertanya arah ke stasiun.",
    level: "A1.2",
    emoji: "🧭",
    turns: [
      { speaker: "ai", text: "Kann ich dir helfen?", translation: "Bisa saya bantu?" },
      { speaker: "user", text: "Wo ist der Bahnhof?", translation: "Di mana stasiunnya?" },
      { speaker: "ai", text: "Geh geradeaus, dann links.", translation: "Jalan lurus, lalu belok kiri." },
      { speaker: "user", text: "Vielen Dank!", translation: "Terima kasih banyak!" },
    ],
  },
  {
    id: "r4",
    title: "Membeli Tiket",
    scenario: "Kamu membeli tiket kereta di loket stasiun.",
    level: "A1.2",
    emoji: "🎫",
    turns: [
      { speaker: "ai", text: "Wohin möchten Sie fahren?", translation: "Anda mau pergi ke mana?" },
      { speaker: "user", text: "Nach Berlin, bitte.", translation: "Ke Berlin, tolong." },
      { speaker: "ai", text: "Einfach oder hin und zurück?", translation: "Sekali jalan atau pulang-pergi?" },
      { speaker: "user", text: "Hin und zurück, bitte.", translation: "Pulang-pergi, tolong." },
    ],
  },
  {
    id: "r5",
    title: "Tanya Harga",
    scenario: "Kamu menanyakan harga barang di toko.",
    level: "A1.2",
    emoji: "💶",
    turns: [
      { speaker: "ai", text: "Kann ich Ihnen helfen?", translation: "Bisa saya bantu?" },
      { speaker: "user", text: "Was kostet das?", translation: "Berapa harganya?" },
      { speaker: "ai", text: "Das kostet drei Euro.", translation: "Harganya tiga euro." },
      { speaker: "user", text: "Gut, ich nehme das.", translation: "Baik, saya ambil ini." },
    ],
  },
];
