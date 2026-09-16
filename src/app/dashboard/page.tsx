"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Flame, Trophy, Mic, RefreshCw, ChevronRight, Clock, Check, Sparkles, Map, ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { useAppStore } from "@/lib/store";
import { getLessonForLevel } from "@/data/lessons";
import { daysForLevel } from "@/data/levels";
import { buildReviewQueue } from "@/lib/derive";
import { CTAButton } from "@/components/ui/cta-button";

export default function DashboardPage() {
  const profile = useAppStore((s) => s.profile);
  const currentDay = useAppStore((s) => s.currentDay);
  const completedDays = useAppStore((s) => s.completedDays);
  const streak = useAppStore((s) => s.streak);
  const xp = useAppStore((s) => s.xp);
  const vocabStatus = useAppStore((s) => s.vocabStatus);
  const activeLevel = useAppStore((s) => s.activeLevel);
  const dailyTarget = useAppStore((s) => s.dailyTargetMinutes);
  const lesson = getLessonForLevel(activeLevel, currentDay, profile?.goal ?? "");
  const dayMeta = daysForLevel(activeLevel).find((d) => d.day === currentDay);
  const reviewDue = buildReviewQueue(vocabStatus).length;
  const progress = Math.min(100, Math.round(completedDays.length / 30 * 100));
  const firstDay = Math.min(24, Math.max(1, currentDay - 2));

  return <AppGuard><AppShell title="Ruang belajarmu" subtitle="Sedikit setiap hari, semakin percaya diri.">
    <div className="learning-home">
      <section className="home-greeting"><div><span className="eyebrow">DEIN TÄGLICHER FORTSCHRITT</span><h1>Hallo, {profile?.name || "Teman"}<span className="greeting-dot">.</span></h1><p>{completedDays.length ? "Senang melihatmu kembali. Kita lanjut, yuk." : "Hari yang baik untuk memulai sesuatu yang baru."}</p></div><Link className="level-token" href="/roadmap"><span>MATERI AKTIF</span><b>{activeLevel}</b><ArrowUpRight size={16} /></Link></section>
      <div className="home-layout"><div className="home-main">
        <section className="daily-lesson"><div className="lesson-card-top"><span className="lesson-tag"><span /> PELAJARAN HARI INI</span><span>{String(currentDay).padStart(2, "0")} / 30</span></div><div className="lesson-card-body"><div><h2>{lesson?.title || dayMeta?.theme || `Petualangan hari ${currentDay}`}</h2><p>{lesson?.goal[0] || `Bangun kemampuan bahasa Jermanmu di level ${activeLevel}.`}</p></div><div className="lesson-letter" aria-hidden="true">{currentDay === 1 ? "Aa" : activeLevel}<span>✦</span></div></div><div className="lesson-meta"><span><Clock size={15} /> {lesson?.estimatedMinutes || dailyTarget} menit</span><span><BookOpen size={15} /> {lesson?.subLevel || dayMeta?.subLevel || activeLevel}</span></div><CTAButton href="/lesson" size="lg" className="lesson-start">{completedDays.length ? "Lanjutkan belajar" : "Mulai pelajaran pertama"}<ArrowRight size={19} /></CTAButton></section>
        <div className="home-stats"><Link href="/statistics"><span className="stat-symbol streak-symbol"><Flame size={21} /></span><span><b>{streak} hari</b><small>Streak belajar</small></span></Link><Link href="/statistics"><span className="stat-symbol xp-symbol"><Trophy size={21} /></span><span><b>{xp.toLocaleString("id-ID")} XP</b><small>Total pencapaian</small></span></Link><Link href="/roadmap"><span className="stat-symbol progress-symbol"><Check size={21} /></span><span><b>{completedDays.length}<em> / 30</em></b><small>Hari selesai</small></span></Link></div>
        <section className="practice-section"><div className="section-line"><h2>Sedikit latihan lagi?</h2><Link href="/library">Lihat semua <ArrowUpRight size={15} /></Link></div><div className="practice-grid"><Link href="/speaking" className="practice-card speaking-card"><span className="practice-icon"><Mic size={22} /></span><ArrowUpRight className="practice-arrow" size={18} /><h3>Berani bicara</h3><p>Latihan percakapan nyata</p><span className="practice-caption">SPEAKING LAB</span></Link><Link href={reviewDue ? "/review" : "/vocabulary"} className="practice-card review-card"><span className="practice-icon"><RefreshCw size={22} /></span><ArrowUpRight className="practice-arrow" size={18} /><h3>{reviewDue ? `${reviewDue} kata menunggu` : "Tambah kosakata"}</h3><p>{reviewDue ? "Jaga kata-katamu tetap ingat" : "Kenalan dengan kata baru"}</p><span className="practice-caption">{reviewDue ? "DAILY REVIEW" : "WORTSCHATZ"}</span></Link></div></section>
      </div><aside className="home-aside"><section className="journey-panel"><div className="section-line"><h2>Perjalananmu</h2><Map size={18} /></div><div className="journey-title"><span>Sprint {activeLevel}</span><b>{progress}%</b></div><div className="journey-track" role="progressbar" aria-label="Progres sprint" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div><div className="journey-days">{Array.from({ length: 7 }, (_, i) => firstDay + i).map((day) => <span key={day} className={completedDays.includes(day) ? "day-done" : day === currentDay ? "day-current" : ""} aria-label={`Hari ${day}${completedDays.includes(day) ? " selesai" : day === currentDay ? " saat ini" : ""}`}>{completedDays.includes(day) ? <Check size={15} /> : day}</span>)}</div><p>{completedDays.length === 0 ? "Satu pelajaran pertama. Awal dari kebiasaan baru." : `${completedDays.length} hari sudah kamu lalui. Teruskan langkahmu.`}</p><Link href="/roadmap" className="journey-link">Buka peta belajar <ChevronRight size={17} /></Link></section><section className="daily-note"><span className="eyebrow"><Sparkles size={15} /> KLEINE ERINNERUNG</span><p>“Übung macht<br />den Meister.”</p><span>Latihan membuatmu semakin mahir.</span><div>Tak perlu terburu-buru.<br />{dailyTarget} menit hari ini sudah berarti.</div></section><Link href="/placement" className="placement-link"><span><b>Sudah pernah belajar Jerman?</b><small>Temukan titik mulai yang pas.</small></span><ArrowUpRight size={20} /></Link></aside></div>
    </div>
  </AppShell></AppGuard>;
}
