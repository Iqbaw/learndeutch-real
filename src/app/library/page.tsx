"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { sidebarNav } from "@/components/layout/nav-config";
const descriptions: Record<string, string> = {
  "/lesson": "Satu langkah baru hari ini", "/roadmap": "Lihat perjalanan 30 harimu", "/review": "Buat kata baru tetap melekat", "/speaking": "Latihan percakapan nyata", "/vocabulary": "Bangun koleksi kosakatamu", "/grammar": "Pahami pola, bukan menghafal", "/errors": "Belajar dari kesalahanmu", "/notes": "Simpan hal yang ingin diingat", "/statistics": "Kenali perkembanganmu", "/mock-test": "Coba simulasi ujian bahasa",
};
export default function LibraryPage() {
  return <AppGuard><AppShell title="Jelajahi" subtitle="Semua yang kamu butuhkan untuk melangkah maju."><div className="library-heading"><span className="eyebrow">DEIN LERNRAUM</span><h1>Mau latihan apa?</h1><p>Pilih satu. Mulai dari yang membuatmu penasaran.</p></div><div className="library-grid">{sidebarNav.filter((item) => descriptions[item.href]).map(({ href, label, icon: Icon }, i) => <Link key={href} href={href} className="library-row"><span className={`library-icon tone-${i % 3}`}><Icon size={23} /></span><span><b>{label}</b><small>{descriptions[href]}</small></span><ArrowUpRight size={18} /></Link>)}</div></AppShell></AppGuard>;
}
