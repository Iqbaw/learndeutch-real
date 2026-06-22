import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <Logo className="h-10 w-10" />
              <span className="font-heading text-base font-extrabold text-ink">
                Deutsch Lernen in 30 Tagen
              </span>
            </div>
            <p className="mt-3 text-sm text-muted">
              30 hari per level. Terstruktur, terukur, dan realistis. Belajar bahasa
              Jerman dengan pola, bukan hafalan buta.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterCol
              title="Produk"
              links={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Roadmap 30 Hari", href: "/roadmap" },
                { label: "Grammar Map", href: "/grammar" },
                { label: "Mock Test", href: "/mock-test" },
              ]}
            />
            <FooterCol
              title="Belajar"
              links={[
                { label: "Belajar Hari Ini", href: "/lesson" },
                { label: "Speaking Lab", href: "/speaking" },
                { label: "Vocabulary", href: "/vocabulary" },
                { label: "Statistik", href: "/statistics" },
              ]}
            />
            <FooterCol
              title="Mulai"
              links={[
                { label: "Onboarding", href: "/onboarding" },
                { label: "Cek Level Saya", href: "/onboarding" },
                { label: "Settings", href: "/settings" },
              ]}
            />
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted">
          <p>
            © {new Date().getFullYear()} Deutsch Lernen in 30 Tagen. Program belajar internal.
            Untuk kebutuhan resmi visa, studi, atau kerja, gunakan ujian resmi yang diakui
            (Goethe/telc).
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="font-heading text-sm font-bold text-ink">{title}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-muted transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
