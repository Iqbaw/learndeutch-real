import Link from "next/link";
import { CTAButton } from "@/components/ui/cta-button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
      <p className="font-mono text-sm font-bold text-primary">404</p>
      <h1 className="mt-2 font-heading text-3xl font-extrabold text-ink">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 max-w-sm text-muted">
        Sepertinya kamu tersesat. Tenang, bahkan di Jerman pun kita bisa tanya arah:
        <span className="font-bold text-ink"> &ldquo;Wo ist der Bahnhof?&rdquo;</span>
      </p>
      <div className="mt-6 flex gap-3">
        <CTAButton href="/dashboard">Ke Dashboard</CTAButton>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-xl border border-border bg-card px-5 font-heading font-bold text-ink hover:bg-elevated focusable"
        >
          Ke Beranda
        </Link>
      </div>
    </div>
  );
}
