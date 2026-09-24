import {
  LayoutDashboard,
  BookOpen,
  Map,
  RefreshCw,
  Mic,
  Library,
  Network,
  NotebookPen,
  NotebookText,
  BarChart3,
  ClipboardCheck,
  GraduationCap,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// Desktop sidebar (PRD section 15.5)
export const sidebarNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Belajar Hari Ini", href: "/lesson", icon: BookOpen },
  { label: "Kursus B1–C2", href: "/course", icon: GraduationCap },
  { label: "Latihan Ujian", href: "/exam", icon: ClipboardCheck },
  { label: "Roadmap 30 Hari", href: "/roadmap", icon: Map },
  { label: "Review", href: "/review", icon: RefreshCw },
  { label: "Speaking Lab", href: "/speaking", icon: Mic },
  { label: "Vocabulary", href: "/vocabulary", icon: Library },
  { label: "Grammar Map", href: "/grammar", icon: Network },
  { label: "Error Notebook", href: "/errors", icon: NotebookPen },
  { label: "Catatan", href: "/notes", icon: NotebookText },
  { label: "Statistics", href: "/statistics", icon: BarChart3 },
  { label: "Mock Test A1", href: "/mock-test", icon: ClipboardCheck },
  { label: "Settings", href: "/settings", icon: Settings },
];

const navItems = (paths: string[]) => paths.map((path) => sidebarNav.find((item) => item.href === path)!);

export const primarySidebarNav = navItems(["/dashboard", "/lesson", "/course", "/exam"]);
export const sidebarGroups = [
  { id: "practice", label: "Latihan mandiri", description: "Bicara, kosakata & tata bahasa", icon: BookOpen,
    items: navItems(["/review", "/speaking", "/vocabulary", "/grammar", "/mock-test"]) },
  { id: "journey", label: "Perjalanan belajar", description: "Roadmap, progres & catatan", icon: Map,
    items: navItems(["/roadmap", "/statistics", "/errors", "/notes"]) },
];

// Mobile bottom navigation (PRD section 15.5)
export const bottomNav: NavItem[] = [
  { label: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { label: "Jelajahi", href: "/library", icon: Library },
  { label: "Bicara", href: "/speaking", icon: Mic },
  { label: "Progres", href: "/statistics", icon: BarChart3 },
  { label: "Profil", href: "/settings", icon: Settings },
];
