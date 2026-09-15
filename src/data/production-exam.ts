import type { LessonStep } from "@/types";
import { learningTrack } from "./daily-missions";

export function productionExam(goal: string): LessonStep[] {
  const context = {
    study: "teman kursus",
    career: "rekan kerja",
    daily: "teman perjalanan",
    general: "teman baru",
  }[learningTrack(goal)];
  return [
    { type: "writing", title: "Menulis pesan perubahan janji", assessment: "open",
      prompt: `Tulis pesan kepada ${context} bernama Alex. Kamu tidak bisa datang hari ini. Usulkan besok pukul 10.00 di kafe, minta konfirmasi, lalu tutup dengan salam.`,
      expected: "Hallo Alex! Ich kann heute nicht kommen. Treffen wir uns morgen um 10 Uhr im Café? Passt das? Viele Grüße, Rani",
      criteria: ["Menyapa Alex dan menutup dengan salam.", "Menjelaskan tidak bisa datang hari ini.", "Mengusulkan besok pukul 10.00 di kafe.", "Meminta konfirmasi dengan kalimat yang dapat dipahami."] },
    { type: "speaking", title: "Perkenalan dengan informasi sendiri", assessment: "open",
      prompt: `Kamu bertemu ${context} baru. Sapa, sebut nama, asal, dan satu aktivitas sehari-hari. Lalu tanyakan asalnya. Gunakan informasi sendiri atau rekaan.`,
      expected: "Hallo! Ich heiße Rani. Ich komme aus Indonesien. Jeden Tag lerne ich Deutsch. Woher kommst du?",
      criteria: ["Menyapa dan menyebut nama serta asal.", "Menceritakan satu aktivitas sehari-hari.", "Menanyakan asal lawan bicara."] },
    { type: "speaking", title: "Menanggapi perubahan situasi", assessment: "open",
      prompt: "Kamu memesan teh, tetapi pelayan mengatakan: Wir haben keinen Tee. Möchten Sie einen Kaffee oder ein Wasser? Pilih satu pengganti, lalu tanyakan harganya dengan sopan.",
      expected: "Dann möchte ich ein Wasser, bitte. Was kostet das?",
      criteria: ["Memilih kopi atau air sebagai pengganti teh.", "Menanyakan harga.", "Respons sopan dan dapat dipahami."] },
  ];
}
