"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Apakah benar bisa fasih bahasa Jerman dalam 30 hari?",
    a: "Tidak. Konsep kami jujur: 30 hari adalah satu sprint latihan. Pencapaian level tergantung bekal awal, waktu belajar, dan kemampuan yang dibuktikan lewat tugas serta evaluasi. Satu level dapat memerlukan beberapa sprint.",
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
    a: "Ya. Speaking Lab menyediakan roleplay situasi nyata dan mencocokkan transkrip dengan contoh. Isi respons dapat ditinjau, tetapi pelafalan dan kelancaran audio memerlukan penilaian audio atau pengajar.",
  },
  {
    q: "Bagaimana saya tahu kemampuan saya berkembang?",
    a: "Lihat tiga bukti secara terpisah: akurasi soal, misi mandiri yang memenuhi kriteria, dan keberhasilan pada situasi baru setelah jeda. Tes penempatan memberi perkiraan awal; hasil internal bukan sertifikat CEFR.",
  },
  {
    q: "Apakah sertifikatnya resmi seperti Goethe/telc?",
    a: "Tidak. Aplikasi mencatat penyelesaian dan hasil latihan internal, bukan menerbitkan sertifikat kemampuan. Untuk kebutuhan resmi visa, studi, atau kerja, gunakan ujian resmi yang diakui.",
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
