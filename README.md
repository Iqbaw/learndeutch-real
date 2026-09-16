# Deutsch Lernen in 30 Tagen 🇩🇪

Website belajar bahasa Jerman **Sprint belajar 30 hari** untuk orang Indonesia, dari nol sampai percaya diri. Menggabungkan kurikulum CEFR, AI tutor, latihan speaking, grammar visual, dan statistik kemampuan yang jujur — dibangun berdasarkan PRD di repository ini (`prd website ini.md`).

> **Sprint belajar 30 hari. Terstruktur, terukur, dan realistis.**
> Bukan janji "fasih instan". Tiga puluh hari adalah satu sprint latihan; pencapaian satu level dapat memerlukan beberapa sprint dan harus dibuktikan melalui tugas yang sesuai.

---

## ✨ Fitur Utama

| Halaman | Deskripsi |
| --- | --- |
| **Landing** (`/`) | Hero, problem/solution, roadmap sprint, metode belajar, alur harian, bukti belajar, akses saat ini, dan FAQ. |
| **Onboarding** (`/onboarding`) | Konsultasi 5 pertanyaan → Personal German Roadmap. |
| **Dashboard** (`/dashboard`) | Misi hari ini, peta 30 sesi, area latihan, antrean review, dan streak. |
| **Belajar Hari Ini** (`/lesson`) | Lesson player A1–C2: story → pattern → contoh → drill → listening → speaking → writing → mistake → victory. Semua level punya versi bawaan; AI hanya variasi opsional. |
| **Roadmap** (`/roadmap`) | Enam peta belajar 30 hari yang ditulis khusus untuk A1, A2, B1, B2, C1, dan C2. |
| **Review** (`/review`) | Spaced repetition: pilih arti, ketik arti, pilih artikel, susun & perbaiki kalimat. |
| **Speaking Lab** (`/speaking`) | Roleplay situasi nyata dengan pencocokan transkrip; penilaian audio tetap memerlukan pengajar atau sistem akustik khusus. |
| **Vocabulary** (`/vocabulary`) | Kamus pribadi 50+ kata dengan artikel, plural, contoh, status hafalan. |
| **Grammar Map** (`/grammar`) | Topik grammar A1 visual dengan rumus, contoh benar/salah, mnemonic, mastery. |
| **Error Notebook** (`/errors`) | Kesalahan otomatis terkategori dengan status (baru salah → aman → kambuh). |
| **Statistics** (`/statistics`) | Akurasi format latihan, sesi selesai, misi yang memenuhi kriteria, uji ulang setelah jeda, vocabulary, dan grammar. |
| **Mock Test** (`/mock-test`) | Latihan internal reading/listening/grammar/vocabulary serta tugas writing dan speaking yang ditinjau terpisah. |
| **Settings** (`/settings`) | Tema light/dark/system, target harian, kecepatan audio, bahasa penjelasan. |

## 🧠 German King Method

Sentence Lego · Verb Position Radar · Der Die Das Memory System · Case Compass · Redemittel Bank · Error Notebook.

## 📚 Cakupan Kurikulum

- **180 sesi harian A1–C2**: 30 sesi per level, termasuk review mingguan, evaluasi sublevel, remedial, simulasi, dan evaluasi akhir sprint.
- **150 pelajaran interaktif A2–C2** tersedia sebagai materi bawaan dan tetap bisa dimainkan tanpa API AI.
- Setiap sesi lanjutan memuat pola, contoh Jerman–Indonesia, tiga latihan terkontrol, listening dengan transkrip tersembunyi, tugas writing, speaking, koreksi kesalahan, dan latihan transfer.
- Misi A2–C2 menyesuaikan konteks tujuan belajar (kuliah, karier/Ausbildung, travel/keseharian, atau umum) tanpa mengubah target grammar utama.
- Materi menyelesaikan satu **sprint latihan**, bukan menyatakan pengguna otomatis menguasai atau tersertifikasi pada level CEFR tersebut.

Silabus dan contoh adalah konten internal produk, bukan silabus resmi atau replika ujian. Rujukan pemeriksaan: [deskriptor CEFR (Council of Europe)](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors), [Konjunktiv dan bentuk pengganti (IDS grammis)](https://grammis.ids-mannheim.de/sgt/2233), serta [verba bantu dan Perfekt Passiv (IDS grammis)](https://grammis.ids-mannheim.de/progr@mm/1695).

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

# Regresi alur belajar dan cakupan 180 hari
npm run test:learning
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

## ⚠️ Catatan Hasil Internal

Aplikasi tidak menerbitkan sertifikat kemampuan. Skor, status kartu, dan penyelesaian sprint adalah hasil latihan internal. Untuk kebutuhan resmi visa, studi, atau kerja, gunakan ujian resmi yang diakui seperti Goethe atau telc.

---

Dibangun sebagai produk belajar yang terasa nyata: edukatif, premium, mobile-first, dengan light/dark mode dan data dummy berkualitas.
