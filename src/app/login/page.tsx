"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, UserRound, ShieldCheck, ArrowLeft } from "lucide-react";
import { useAppStore, useHydrated } from "@/lib/store";
import { Logo } from "@/components/ui/logo";
import { CTAButton } from "@/components/ui/cta-button";
import { LanguagePostcard } from "@/components/ui/language-postcard";

export default function LoginPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const profile = useAppStore((s) => s.profile);
  const answers = useAppStore((s) => s.onboarding);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const finishIntro = useAppStore((s) => s.finishIntro);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  function guest() {
    if (!hydrated || busy) return;
    setBusy(true);
    finishIntro();
    if (!profile) completeOnboarding({ name: name.trim() || answers.name || "Teman", goal: answers.goal || "Belajar hal baru", startLevel: "A1.1", weakSkill: "Belum tahu", learningStyle: "Campuran", createdAt: new Date().toISOString() });
    router.replace("/dashboard");
  }
  return <main className="entry-page">
    <aside className="entry-editorial"><div className="editorial-brand"><Logo className="h-12 w-12" /><b>Deutsch 30</b></div><div><span className="eyebrow">WILLKOMMEN ZURÜCK</span><h2>Perjalanan hebat,<br />dimulai dari halo.</h2><p>Ruang kecil untuk mimpi besarmu.<br />Bahasa Jerman, satu hari pada satu waktu.</p><LanguagePostcard /></div><span className="editorial-foot">Belajar dengan ritmemu sendiri.</span></aside>
    <div className="entry-panel login-panel">
      <header className="entry-header"><Link href="/onboarding" aria-label="Kembali ke onboarding" className="back-control"><ArrowLeft size={20} /></Link><span className="text-sm text-muted">Deutsch 30</span></header>
      <div className="login-content"><Logo className="login-logo" /><span className="eyebrow">RUANG BELAJARMU MENUNGGU</span><h1>Hallo, kamu.<br /><span>Senang bertemu lagi.</span></h1><p className="entry-description">Satu langkah lebih dekat ke bahasa Jerman.</p>
        <div className="account-option"><ShieldCheck size={21} /><div><b>Masuk dengan akun</b><p>Login akun belum tersedia. Kamu tetap bisa mulai dan menyimpan progres di perangkat ini.</p></div><span className="soon-badge">Segera</span></div>
        <div className="entry-divider"><span>mulai belajar sekarang</span></div>
        <form onSubmit={(e) => { e.preventDefault(); guest(); }}>
          {!profile && <div className="name-field"><label htmlFor="guest-name">Boleh kenalan? <span>Opsional</span></label><div><UserRound size={18} /><input id="guest-name" autoComplete="given-name" maxLength={40} placeholder="Nama panggilanmu" value={name} onChange={(e) => setName(e.target.value)} /></div></div>}
          <CTAButton type="submit" size="lg" className="w-full" disabled={!hydrated || busy}>{busy ? "Menyiapkan ruangmu…" : profile ? `Lanjut sebagai ${profile.name}` : "Lanjut sebagai guest"}<ArrowRight size={18} /></CTAButton>
        </form>
        <p className="guest-note"><ShieldCheck size={15} />Tanpa akun. Progres tersimpan di browser ini.</p>
      </div>
      <footer className="login-footer">Langkah pertama tidak harus besar.<br /><b>Yang penting, mulai.</b></footer>
    </div>
  </main>;
}
