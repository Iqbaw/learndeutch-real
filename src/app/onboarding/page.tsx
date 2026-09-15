"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, GraduationCap, Briefcase, Plane, Heart, Clock } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { CTAButton } from "@/components/ui/cta-button";
import { LanguagePostcard } from "@/components/ui/language-postcard";
import { useAppStore, useHydrated } from "@/lib/store";
import { learningGoals } from "@/data/daily-missions";

const goals = [
  { label: learningGoals[0], detail: "Siap untuk babak baru", icon: GraduationCap },
  { label: learningGoals[1], detail: "Buka lebih banyak kesempatan", icon: Briefcase },
  { label: learningGoals[2], detail: "Lebih percaya diri ngobrol", icon: Plane },
  { label: learningGoals[3], detail: "Mulai dari rasa penasaran", icon: Heart },
];

export default function OnboardingPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const profile = useAppStore((s) => s.profile);
  const answers = useAppStore((s) => s.onboarding);
  const setAnswer = useAppStore((s) => s.setOnboardingAnswer);
  const finishIntro = useAppStore((s) => s.finishIntro);
  const setDailyTarget = useAppStore((s) => s.setDailyTarget);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduced = useReducedMotion();
  useEffect(() => { if (hydrated && profile) router.replace("/dashboard"); }, [hydrated, profile, router]);
  function next() {
    setDirection(1);
    if (step < 2) setStep(step + 1);
    else { setDailyTarget(Number(answers.dailyTime || "15")); finishIntro(); router.push("/login"); }
  }
  return <main className="entry-page">
    <aside className="entry-editorial"><div className="editorial-brand"><Logo className="h-12 w-12" /><b>Deutsch 30</b></div><div><span className="eyebrow">DEIN NEUES KAPITEL</span><h2>Langkah kecil.<br />Dunia yang lebih luas.</h2><p>Bahasa baru, kesempatan baru.<br />Mulai perjalananmu ke bahasa Jerman.</p><LanguagePostcard /></div><span className="editorial-foot">Dibuat untuk cara belajarmu.</span></aside>
    <div className="entry-panel onboarding-panel">
      <header className="entry-header"><div className="flex items-center gap-2"><Logo className="h-9 w-9" /><b className="font-heading text-sm">Deutsch 30</b></div><Link href="/login" className="entry-text-link">Sudah punya akun?</Link></header>
      <div className="onboarding-progress" aria-label={`Langkah ${step + 1} dari 3`}>{[0, 1, 2].map((i) => <span key={i} className={i <= step ? "is-done" : ""} />)}</div>
      <div className="onboarding-content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.section key={step} initial={{ opacity: 0, x: reduced ? 0 : direction * 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : direction * -16 }} transition={{ duration: reduced ? 0 : 0.25 }}>
            {step === 0 ? <><LanguagePostcard /><span className="eyebrow">HALLO, MASA DEPANMU</span><h1>Bahasa Jerman.<br /><span>Sedikit setiap hari.</span></h1><p className="entry-description">Dari kata pertama sampai percakapan nyata. Kita mulai pelan-pelan, bareng.</p><div className="onboarding-promise"><span><Check size={15} /> Sprint belajar 30 hari</span><span><Check size={15} /> Dari nol juga bisa</span></div></> : step === 1 ? <><span className="step-icon"><Plane /></span><span className="eyebrow">01 / TUJUANMU</span><h1>Apa yang membawamu<br />ke bahasa Jerman?</h1><p className="entry-description">Biar perjalanan belajarmu terasa lebih dekat dengan tujuanmu.</p><div className="goal-options">{goals.map(({ label, detail, icon: Icon }) => <button key={label} type="button" aria-pressed={answers.goal === label} className={`choice-row ${answers.goal === label ? "is-selected" : ""}`} onClick={() => setAnswer("goal", label)}><span className="choice-icon"><Icon size={21} /></span><span><b>{label}</b><small>{detail}</small></span><span className="choice-check">{answers.goal === label && <Check size={15} />}</span></button>)}</div></> : <><span className="step-icon"><Clock /></span><span className="eyebrow">02 / RITMEMU</span><h1>Luangkan waktu kecil.<br />Bangun kebiasaan besar.</h1><p className="entry-description">Berapa menit yang nyaman untukmu? Nanti bisa diubah kapan saja.</p><div className="time-options">{[{ time: "10", label: "Santai" }, { time: "15", label: "Konsisten" }, { time: "30", label: "Lebih intens" }].map(({ time, label }) => <button key={time} type="button" aria-pressed={(answers.dailyTime || "15") === time} className={`time-choice ${(answers.dailyTime || "15") === time ? "is-selected" : ""}`} onClick={() => setAnswer("dailyTime", time)}><b>{time}</b><span>menit / hari</span><small>{label}</small></button>)}</div><div className="gentle-note"><span>✦</span><p>Tidak perlu langsung sempurna.<br /><b>Cukup hadir lagi besok.</b></p></div></>}
          </motion.section>
        </AnimatePresence>
      </div>
      <footer className="entry-actions"><div className="flex gap-3">{step > 0 && <button type="button" aria-label="Kembali ke langkah sebelumnya" className="back-control" onClick={() => { setDirection(-1); setStep(step - 1); }}><ArrowLeft size={20} /></button>}<CTAButton onClick={next} size="lg" className="flex-1" disabled={step === 1 && !answers.goal}>{step === 0 ? "Mulai perjalananmu" : step === 2 ? "Simpan & lanjutkan" : "Lanjutkan"}<ArrowRight size={18} /></CTAButton></div><p>{step === 0 ? "Kenalan sebentar, lalu langsung belajar." : `${step + 1} dari 3 · Dirancang sesuai dirimu`}</p></footer>
    </div>
  </main>;
}
