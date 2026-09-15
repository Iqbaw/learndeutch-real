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
  Check,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { HeroMockup } from "@/components/marketing/hero-mockup";
import { FAQ } from "@/components/marketing/faq";
import { EntryGate } from "@/components/entry-gate";
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
    <>
      {/* Mobile: swipeable slide deck (no vertical scroll) */}
      <div className="md:hidden">
        <EntryGate />
      </div>

      {/* Desktop / tablet: full vertical marketing page */}
      <div className="hidden min-h-screen bg-bg md:block">
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
              <span className="text-primary">lewat Sprint 30 Hari</span>, dari Nol sampai Berani Mencoba.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Materi terstruktur, latihan speaking, dan misi nyata yang disesuaikan dengan
              tujuan kuliah, karier/Ausbildung, atau kebutuhan sehari-hari.
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
              Sprint belajar 30 hari. Terstruktur, terukur, dan realistis.
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
              { t: "Tidak tahu apa yang benar-benar bisa dilakukan", d: "Materi selesai, tetapi belum pernah mencoba pesan, percakapan, atau tugas baru tanpa menyalin contoh." },
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
            { icon: Mic, t: "Latihan speaking", d: "Roleplay situasi nyata dengan transkrip untuk meninjau isi dan urutan kata." },
            { icon: Sparkles, t: "AI correction", d: "Kesalahan dijelaskan dengan bahasa Indonesia yang ramah." },
            { icon: BarChart3, t: "Bukti belajar", d: "Bedakan sesi selesai, tugas terpenuhi, dan kemampuan yang masih bertahan setelah jeda." },
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
            eyebrow="Sprint Belajar 30 Hari"
            title="Dari A1 sampai C2, belajar bertahap lewat sprint 30 hari"
            description="Tiga puluh hari adalah satu siklus latihan. Lanjutkan atau ulangi berdasarkan hasil tugas, bukan kalender semata."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {levels.map((lvl) => (
              <div key={lvl.id} className="card-base flex flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-3xl font-extrabold text-primary">{lvl.id}</span>
                  <span className="rounded-full bg-elevated px-2.5 py-1 text-xs font-bold text-muted">
                    {lvl.durationDays} sesi
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
            description="Satu paket lengkap sekitar 45–60 menit. Jika target harianmu lebih singkat, lanjutkan dari langkah terakhir pada sesi berikutnya."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dailyFlow.map((f) => (
              <div key={f.step} className="card-base p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-heading text-sm font-extrabold text-onprimary">
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
                Urutannya perlu diperbaiki. Dalam bahasa Jerman, kalau kalimat diawali waktu seperti
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
            title="Lihat bukti latihanmu, bukan sekadar jumlah hari"
            description="Pisahkan akurasi soal, misi yang memenuhi kriteria, dan uji ulang setelah jeda. Pelafalan tidak dinilai dari teks transkrip."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="card-base p-5">
              <p className="text-sm text-muted">Sesi selesai</p>
              <p className="font-heading text-3xl font-extrabold text-ink">12</p>
              <p className="text-sm text-muted">Belum otomatis berarti dikuasai</p>
            </div>
            <div className="card-base p-5">
              <p className="text-sm text-muted">Misi mandiri</p>
              <p className="font-heading text-3xl font-extrabold text-ink">9 / 12</p>
              <p className="text-sm text-muted">Memenuhi kriteria tugas teks</p>
            </div>
            <div className="card-base p-5">
              <p className="text-sm text-muted">Uji ulang setelah jeda</p>
              <p className="font-heading text-3xl font-extrabold text-ink">5</p>
              <p className="text-sm text-muted">Berhasil pada situasi yang berbeda</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning evidence */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeader
          eyebrow="Bukti Belajar"
          title="Setiap kemajuan punya dasar yang bisa diperiksa"
          align="center"
          className="mx-auto items-center"
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { title: "Respons asli", text: "Draf dan jawaban misi tersimpan agar pengguna bisa melihat apa yang benar-benar pernah ia hasilkan." },
            { title: "Kriteria tugas", text: "Misi dinilai dari informasi dan struktur yang diminta. Contoh bukan satu-satunya jawaban yang diterima." },
            { title: "Uji ulang setelah jeda", text: "Keberhasilan hari ini dipisahkan dari kemampuan memakai pola yang sama lagi pada situasi baru." },
          ].map((t) => (
            <article key={t.title} className="card-base p-5">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-heading font-bold text-ink">{t.title}</h3>
              <p className="mt-2 text-sm text-muted">{t.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Current access */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeader
            eyebrow="Akses Saat Ini"
            title="Coba sprint A1 lengkap tanpa pembayaran"
            align="center"
            className="mx-auto items-center"
          />
          <div className="card-base mx-auto mt-8 max-w-xl p-6">
            <h3 className="font-heading text-xl font-extrabold text-ink">Sprint A1</h3>
            <p className="mt-1 text-sm text-muted">Mulai dari nol dan buktikan hasil lewat misi, bukan janji level instan.</p>
            <p className="mt-4 font-heading text-3xl font-extrabold text-ink">Rp0</p>
            <ul className="mt-4 space-y-2 text-sm text-ink/90">
              {["30 sesi A1 bawaan", "Misi untuk 4 tujuan belajar", "Listening, writing, speaking dengan transkrip, dan review berjarak"].map((f) => (
                <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0 text-success" /> {f}</li>
              ))}
            </ul>
            <CTAButton href="/onboarding" className="mt-5 w-full">Mulai sprint A1</CTAButton>
          </div>
          <p className="mt-4 text-center text-xs text-muted">Harga paket lanjutan belum ditetapkan. Halaman ini tidak memproses pembayaran.</p>
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
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-onprimary">
            Mulai hari pertamamu dalam bahasa Jerman
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-onprimary/80">
            Setiap hari tahu harus belajar apa. Grammar dibuat visual dan masuk akal.
            Sprint belajar 30 hari — terukur, realistis, dan konsisten.
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
    </>
  );
}
