import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Compass,
  Blocks,
  Radar,
  Palette,
  Landmark,
  NotebookPen,
  Brain,
  Mic,
  BarChart3,
  CheckCircle2,
  XCircle,
  Quote,
  Check,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { HeroMockup } from "@/components/marketing/hero-mockup";
import { FAQ } from "@/components/marketing/faq";
import { SectionHeader } from "@/components/ui/section-header";
import { CTAButton } from "@/components/ui/cta-button";
import { LevelBadge } from "@/components/ui/level-badge";
import { levels, methodPillars } from "@/data/levels";

const pillarIcons: Record<string, typeof Blocks> = {
  blocks: Blocks,
  radar: Radar,
  palette: Palette,
  compass: Compass,
  landmark: Landmark,
  "notebook-pen": NotebookPen,
};

const dailyFlow = [
  { step: "1", title: "Story Hook", desc: "Cerita pendek yang menarik perhatianmu." },
  { step: "2", title: "Pattern Reveal", desc: "Rumus & pola kalimat dijelaskan visual." },
  { step: "3", title: "Guided Example", desc: "Contoh berwarna: subjek, verb, info." },
  { step: "4", title: "Interactive Drill", desc: "Susun & pilih kalimat sendiri." },
  { step: "5", title: "Listening & Speaking", desc: "Dengar dan ucapkan dengan lantang." },
  { step: "6", title: "Writing Check", desc: "Tulis jawabanmu, dapat koreksi ramah." },
  { step: "7", title: "Mistake Explanation", desc: "AI jelaskan kenapa, bukan cuma salah." },
  { step: "8", title: "Mini Victory", desc: "Ringkasan kemampuan baru hari ini." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Untuk orang Indonesia yang belajar dari nol
            </span>
            <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              Belajar Bahasa Jerman{" "}
              <span className="text-primary">30 Hari per Level</span>, dari Nol sampai Percaya Diri.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Kurikulum terstruktur, AI tutor, latihan speaking, dan statistik CEFR yang
              membantu kamu tahu level asli kemampuanmu — bukan sekadar merasa sudah bisa.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <CTAButton href="/onboarding" size="lg">
                Mulai dari A1.1 <ArrowRight className="h-5 w-5" />
              </CTAButton>
              <CTAButton href="/onboarding" variant="outline" size="lg">
                Cek Level Saya
              </CTAButton>
            </div>
            <p className="mt-5 text-sm font-medium text-muted">
              30 hari per level. Terstruktur, terukur, dan realistis.
            </p>
          </div>
          <div className="lg:pl-6">
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeader
            eyebrow="Kenapa banyak orang menyerah"
            title="Belajar Jerman sering terasa rumit dan tanpa arah"
            description="Tiga masalah paling umum yang membuat pemula Indonesia berhenti di tengah jalan."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { t: "Grammar terasa menakutkan", d: "der/die/das, akusatif, datif, posisi verb — semua datang sekaligus dan bikin cepat takut." },
              { t: "Belajar random bikin cepat lupa", d: "Aplikasi main-main memberi latihan pendek, tapi tidak ada sistem harian yang jelas." },
              { t: "Tidak tahu level asli", d: "Merasa sudah belajar banyak, tapi tidak tahu benar-benar sudah A1, A2, atau B1." },
            ].map((p) => (
              <div key={p.t} className="card-base p-5">
                <XCircle className="h-7 w-7 text-danger" />
                <h3 className="mt-3 font-heading text-lg font-bold text-ink">{p.t}</h3>
                <p className="mt-1 text-sm text-muted">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeader
          eyebrow="Solusi"
          title="Lihat pola → pahami → tirukan → latih → bicara → koreksi → ulangi"
          description="Setiap hari kamu tahu harus belajar apa, kenapa itu penting, dan di mana letak kesalahanmu."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Brain, t: "Rumus cepat", d: "Pola kalimat ala bimbel, bukan tabel grammar yang bikin pusing." },
            { icon: Mic, t: "Latihan speaking", d: "Roleplay situasi nyata dengan feedback pengucapan." },
            { icon: Sparkles, t: "AI correction", d: "Kesalahan dijelaskan dengan bahasa Indonesia yang ramah." },
            { icon: BarChart3, t: "Statistik CEFR", d: "Tahu level aktif & pasif dengan confidence score." },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.t} className="card-base p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-3 font-heading text-lg font-bold text-ink">{s.t}</h3>
                <p className="mt-1 text-sm text-muted">{s.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 30-Day Level System / Roadmap */}
      <section id="roadmap" className="border-y border-border bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeader
            eyebrow="Sistem 30 Hari per Level"
            title="Dari A1 sampai C2, setiap level adalah sprint 30 hari"
            description="Setiap level besar dibagi menjadi dua sublevel. Jujur, terukur, dan tidak ada klaim palsu."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {levels.map((lvl) => (
              <div key={lvl.id} className="card-base flex flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-3xl font-extrabold text-primary">{lvl.id}</span>
                  <span className="rounded-full bg-elevated px-2.5 py-1 text-xs font-bold text-muted">
                    {lvl.durationDays} hari
                  </span>
                </div>
                <h3 className="mt-2 font-heading text-base font-bold text-ink">{lvl.title}</h3>
                <p className="mt-1 flex-1 text-sm text-muted">{lvl.outcome}</p>
                <div className="mt-3 flex gap-2">
                  {lvl.subLevels.map((s) => (
                    <LevelBadge key={s.id} level={s.id} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* German King Method */}
      <section id="method" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeader
          eyebrow="German King Method"
          title="Metode cepat yang membuat grammar Jerman masuk akal"
          description="Enam alat belajar khas yang mengubah aturan rumit menjadi pola yang bisa kamu pegang."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {methodPillars.map((p) => {
            const Icon = pillarIcons[p.icon] ?? Sparkles;
            return (
              <div key={p.title} className="card-base p-5 transition-shadow hover:shadow-glow">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-soft text-secondary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-3 font-heading text-lg font-bold text-ink">{p.title}</h3>
                <p className="mt-1 text-sm text-muted">{p.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Daily Learning Flow */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeader
            eyebrow="Daily Learning Flow"
            title="Satu paket belajar harian, satu layar satu fokus"
            description="Estimasi 35–60 menit per hari. Mode ringan 15 menit, mode intensif 90 menit."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dailyFlow.map((f) => (
              <div key={f.step} className="card-base p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-heading text-sm font-extrabold text-white dark:text-bg">
                  {f.step}
                </span>
                <h3 className="mt-3 font-heading font-bold text-ink">{f.title}</h3>
                <p className="mt-1 text-sm text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tutor Preview */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="AI Tutor"
              title="Kesalahanmu jadi bahan latihan otomatis"
              description="AI menjelaskan kesalahan dengan bahasa Indonesia sederhana, lalu memberi latihan tambahan yang sesuai levelmu."
            />
            <ul className="mt-6 space-y-3">
              {[
                "Penjelasan ramah, bukan sekadar 'salah'.",
                "Latihan tambahan otomatis untuk kelemahanmu.",
                "Dibatasi kurikulum — tidak memberi materi C1 untuk pemula A1.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-ink/90">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-base p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Kamu menulis</p>
            <p className="mt-1 rounded-xl bg-danger/10 px-3 py-2 font-body text-danger line-through decoration-danger/40">
              Heute ich lerne Deutsch.
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted">AI Tutor</p>
            <div className="mt-1 rounded-xl bg-primary-soft/60 px-3 py-3">
              <p className="text-sm text-ink">
                Hampir benar! Dalam bahasa Jerman, kalau kalimat diawali waktu seperti
                “Heute”, kata kerja tetap di posisi kedua.
              </p>
              <p className="mt-2 font-body font-bold text-success">Heute lerne ich Deutsch.</p>
              <p className="mt-2 font-mono text-xs text-muted">
                Heute = posisi 1 · lerne = posisi 2 · ich = posisi 3
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Preview */}
      <section id="stats" className="border-y border-border bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeader
            eyebrow="Statistik Nyata"
            title="Tahu level aslimu, bukan cuma merasa sudah bisa"
            description="Progress berdasarkan kemampuan nyata: listening, reading, speaking, writing, grammar, vocabulary, pronunciation, dan retention."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="card-base p-5">
              <p className="text-sm text-muted">Estimasi Level</p>
              <p className="font-heading text-3xl font-extrabold text-ink">A1.2</p>
              <p className="text-sm text-muted">Confidence 78%</p>
            </div>
            <div className="card-base p-5">
              <p className="text-sm text-muted">Level Aktif vs Pasif</p>
              <p className="font-heading text-3xl font-extrabold text-ink">A1.1 / A2.1</p>
              <p className="text-sm text-muted">Paham bacaan, speaking masih pasif</p>
            </div>
            <div className="card-base p-5">
              <p className="text-sm text-muted">Vocabulary</p>
              <p className="font-heading text-3xl font-extrabold text-ink">412 / 176</p>
              <p className="text-sm text-muted">Pasif dikenal / aktif dipakai</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeader
          eyebrow="Cerita Belajar"
          title="Apa kata pengguna awal kami"
          align="center"
          className="mx-auto items-center"
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { name: "Raka", role: "Calon Ausbildung", text: "Akhirnya paham kenapa verb pindah-pindah. Polanya dijelaskan, bukan disuruh hafal." },
            { name: "Dinda", role: "Pernah belajar A1", text: "Statistiknya jujur. Aku jadi tahu speaking-ku ketinggalan dan harus latihan lebih." },
            { name: "Andi", role: "Persiapan ujian", text: "Mock test dan Error Notebook bikin latihan terasa terarah, tidak random." },
          ].map((t) => (
            <figure key={t.name} className="card-base p-5">
              <Quote className="h-6 w-6 text-primary" />
              <blockquote className="mt-2 text-sm text-ink/90">“{t.text}”</blockquote>
              <figcaption className="mt-3 text-sm">
                <span className="font-heading font-bold text-ink">{t.name}</span>
                <span className="text-muted"> · {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          *Testimoni placeholder untuk ilustrasi produk.
        </p>
      </section>

      {/* Pricing */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeader
            eyebrow="Harga"
            title="Mulai gratis, upgrade kapan saja"
            align="center"
            className="mx-auto items-center"
          />
          <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
            <div className="card-base p-6">
              <h3 className="font-heading text-xl font-extrabold text-ink">Gratis</h3>
              <p className="mt-1 text-sm text-muted">Cocok untuk mencoba A1.1.</p>
              <p className="mt-4 font-heading text-3xl font-extrabold text-ink">Rp0</p>
              <ul className="mt-4 space-y-2 text-sm text-ink/90">
                {["Akses A1.1", "Daily lesson", "Vocabulary & review dasar"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> {f}</li>
                ))}
              </ul>
              <CTAButton href="/onboarding" variant="outline" className="mt-5 w-full">Mulai gratis</CTAButton>
            </div>
            <div className="card-base border-primary/40 p-6 shadow-glow">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl font-extrabold text-ink">Pro</h3>
                <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white dark:text-bg">Populer</span>
              </div>
              <p className="mt-1 text-sm text-muted">Semua level, AI tutor & speaking lab.</p>
              <p className="mt-4 font-heading text-3xl font-extrabold text-ink">Rp99k<span className="text-base font-medium text-muted">/bln</span></p>
              <ul className="mt-4 space-y-2 text-sm text-ink/90">
                {["Semua level A1–C2", "AI tutor & speaking feedback", "Mock test & statistik lengkap"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> {f}</li>
                ))}
              </ul>
              <CTAButton href="/onboarding" className="mt-5 w-full">Coba Pro</CTAButton>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted">*Harga placeholder untuk ilustrasi.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeader
          eyebrow="FAQ"
          title="Pertanyaan yang sering diajukan"
          align="center"
          className="mx-auto items-center"
        />
        <div className="mt-8">
          <FAQ />
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center sm:px-12">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-white dark:text-bg">
            Mulai hari pertamamu dalam bahasa Jerman
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90 dark:text-bg/80">
            Setiap hari tahu harus belajar apa. Grammar dibuat visual dan masuk akal.
            30 hari per level — terukur, realistis, dan konsisten.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/onboarding"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-white px-7 font-heading text-base font-bold text-primary transition-transform hover:scale-[1.02] focusable dark:bg-bg"
            >
              Mulai dari A1.1 <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
