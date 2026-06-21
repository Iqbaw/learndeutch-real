# Deutsch Lernen in 30 Tagen 🇩🇪

Website belajar bahasa Jerman **30 hari per level** untuk orang Indonesia, dari nol sampai percaya diri. Menggabungkan kurikulum CEFR, AI tutor, latihan speaking, grammar visual, dan statistik kemampuan yang jujur — dibangun berdasarkan PRD di repository ini (`prd website ini.md`).

> **30 hari per level. Terstruktur, terukur, dan realistis.**
> Bukan janji "fasih instan". Setiap level besar CEFR (A1–C2) dikerjakan dalam sprint 30 hari, dibagi menjadi dua sublevel (mis. A1.1 dan A1.2).

---

## ✨ Fitur Utama

| Halaman | Deskripsi |
| --- | --- |
| **Landing** (`/`) | Hero, problem/solution, 30-day level system, German King Method, daily flow, AI tutor preview, statistik, testimoni, pricing, FAQ. |
| **Onboarding** (`/onboarding`) | Konsultasi 5 pertanyaan → Personal German Roadmap. |
| **Dashboard** (`/dashboard`) | Today's Mission, CEFR Skill Radar, 30-Day Map, Weakness Box, Review Queue, AI Coach, streak. |
| **Belajar Hari Ini** (`/lesson`) | Lesson player step-by-step: story → pattern → contoh → drill → listening → speaking → writing → mistake → victory. |
| **Roadmap** (`/roadmap`) | Peta 30 hari A1 + overview semua level A1–C2. |
| **Review** (`/review`) | Spaced repetition: pilih arti, ketik arti, pilih artikel, susun & perbaiki kalimat. |
| **Speaking Lab** (`/speaking`) | Roleplay situasi nyata dengan feedback pengucapan, kelancaran, dan grammar. |
| **Vocabulary** (`/vocabulary`) | Kamus pribadi 50+ kata dengan artikel, plural, contoh, status hafalan. |
| **Grammar Map** (`/grammar`) | Topik grammar A1 visual dengan rumus, contoh benar/salah, mnemonic, mastery. |
| **Error Notebook** (`/errors`) | Kesalahan otomatis terkategori dengan status (baru salah → aman → kambuh). |
| **Statistics** (`/statistics`) | CEFR skill report, level aktif vs pasif, confidence, vocabulary & grammar mastery, weekly report. |
| **Mock Test** (`/mock-test`) | Simulasi ujian A1 (6 bagian) dengan score per skill dan rekomendasi. |
| **Settings** (`/settings`) | Tema light/dark/system, target harian, kecepatan audio, bahasa penjelasan. |

## 🧠 German King Method

Sentence Lego · Verb Position Radar · Der Die Das Memory System · Case Compass · Redemittel Bank · Error Notebook.

## 🛠️ Tech Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (design token light/dark via CSS variables)
- **Framer Motion** (animasi halus)
- **Zustand** (state ringan, persisted)
- **Recharts** (skill radar & weekly chart)
- **next-themes** (light/dark/system mode)
- **lucide-react** (ikon)
- Font: **Manrope** (heading), **Atkinson Hyperlegible** (body), **JetBrains Mono** (rumus)
- PWA-ready (`manifest.webmanifest`)

## 📂 Struktur Proyek

```
src/
  app/                 # Route App Router (landing + 12 halaman aplikasi)
  components/
    layout/            # AppShell, Sidebar, MobileBottomNav, Topbar
    ui/                # CTAButton, ProgressRing, LevelBadge, dll.
    cards/             # StatCard, VocabularyCard, GrammarCard, ErrorCard, ...
    learning/          # LessonPlayer, DayMap, MissionCard, ExerciseCard, TokenSentence
    stats/             # SkillRadar, WeeklyChart
    marketing/         # Nav, Footer, HeroMockup, FAQ
  data/                # Data dummy terstruktur (levels, lessons, vocabulary, ...)
  services/            # Abstraksi AI (tutor, writing, speaking, placement)
  lib/                 # store (zustand) + utils
  types/               # Tipe domain
```

## 🚀 Menjalankan Proyek

Prasyarat: **Node.js 18+**.

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev
# buka http://localhost:3000

# 3. Build produksi
npm run build
npm run start

# Lint & typecheck
npm run lint
npm run typecheck
```

## 🔌 Integrasi AI dengan DeepSeek (V4)

Aplikasi ini mendukung **AI nyata** lewat DeepSeek untuk dua fitur utama:

- **Tes penempatan adaptif** (`/onboarding`) — soal dibuat dinamis oleh AI pada tingkat
  kesulitan yang menyesuaikan jawabanmu (Computerized Adaptive Testing), mencakup tata
  bahasa, kosakata, membaca, dan komunikasi, lalu menghasilkan estimasi level + tingkat
  keyakinan + rincian per keterampilan.
- **Pelajaran dipersonalisasi** (`/lesson`) — materi harian disusun khusus berdasarkan
  level, tujuan, gaya belajar, kelemahan, dan kesalahan terakhir pelajar.

### Cara mengaktifkan

```bash
# Salin contoh env lalu isi API key DeepSeek-mu
cp .env.example .env.local
```

Isi `.env.local`:

```
DEEPSEEK_API_KEY=sk-...              # wajib untuk mengaktifkan fitur AI
DEEPSEEK_MODEL=deepseek-v4-flash     # atau deepseek-v4-pro untuk kualitas tertinggi
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

Dapatkan API key di [platform.deepseek.com](https://platform.deepseek.com/).

### Arsitektur & keamanan

- API key **hanya** dibaca di server (route `src/app/api/placement` dan `src/app/api/lesson`)
  melalui `src/lib/deepseek.ts`, sehingga tidak pernah terekspos ke browser.
- Mesin adaptif (`src/lib/placement-engine.ts`) bersifat deterministik dan berjalan di
  klien; DeepSeek hanya membuat *isi* soal pada tingkat yang diminta mesin.
- **Fallback otomatis**: tanpa `DEEPSEEK_API_KEY` (atau saat permintaan gagal), tes
  penempatan memakai bank soal statis (`src/data/placement-bank.ts`) dan pelajaran memakai
  materi bawaan, sehingga aplikasi selalu berjalan.

> Catatan model: nama `deepseek-chat` / `deepseek-reasoner` masih bisa dipakai untuk
> kompatibilitas, tetapi nama resmi V4 adalah `deepseek-v4-flash` dan `deepseek-v4-pro`.

## ⚠️ Catatan Sertifikat

Sertifikat internal **tidak setara** dengan sertifikat resmi Goethe/telc. Untuk kebutuhan resmi visa, studi, atau kerja, gunakan ujian resmi yang diakui.

---

Dibangun sebagai produk belajar yang terasa nyata: edukatif, premium, mobile-first, dengan light/dark mode dan data dummy berkualitas.
