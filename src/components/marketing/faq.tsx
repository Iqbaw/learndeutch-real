"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Apakah benar bisa fasih bahasa Jerman dalam 30 hari?",
    a: "Tidak. Konsep kami jujur: 30 hari adalah sprint intensif untuk satu level CEFR. Jadi A1 butuh 30 hari, A2 butuh 30 hari, dan seterusnya. Hasil akhir tergantung konsistensi, durasi belajar, dan hasil test.",
  },
  {
    q: "Saya benar-benar nol, apakah cocok?",
    a: "Sangat cocok. Kami mulai dari bunyi huruf dan kalimat paling dasar, dijelaskan dalam bahasa Indonesia yang mudah, dengan pola dulu baru istilah grammar.",
  },
  {
    q: "Apa itu German King Method?",
    a: "Metode cepat berbasis pola: Sentence Lego, Verb Position Radar, Der Die Das Memory System, Case Compass, Redemittel Bank, dan Error Notebook. Tujuannya membuat grammar terasa masuk akal, bukan menakutkan.",
  },
  {
    q: "Apakah ada latihan speaking?",
    a: "Ya. Speaking Lab menyediakan roleplay situasi nyata dengan feedback pengucapan, kelancaran, dan koreksi grammar yang ramah — bukan sekadar 'benar/salah'.",
  },
  {
    q: "Bagaimana saya tahu level asli saya?",
    a: "Statistik kami mengukur 8 skill terpisah dan membedakan level aktif (bicara/menulis) dengan level pasif (membaca/mendengar), lengkap dengan confidence score.",
  },
  {
    q: "Apakah sertifikatnya resmi seperti Goethe/telc?",
    a: "Tidak. Sertifikat kami menunjukkan penyelesaian program internal. Untuk kebutuhan resmi visa, studi, atau kerja, gunakan ujian resmi yang diakui.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left focusable"
              aria-expanded={isOpen}
            >
              <span className="font-heading font-bold text-ink">{f.q}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-muted transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen && (
              <p className="px-5 pb-4 text-sm leading-relaxed text-muted animate-fade-up">
                {f.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
