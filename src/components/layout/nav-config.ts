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
  { label: "Roadmap 30 Hari", href: "/roadmap", icon: Map },
  { label: "Review", href: "/review", icon: RefreshCw },
  { label: "Speaking Lab", href: "/speaking", icon: Mic },
  { label: "Vocabulary", href: "/vocabulary", icon: Library },
  { label: "Grammar Map", href: "/grammar", icon: Network },
  { label: "Error Notebook", href: "/errors", icon: NotebookPen },
  { label: "Catatan", href: "/notes", icon: NotebookText },
  { label: "Statistics", href: "/statistics", icon: BarChart3 },
  { label: "Mock Test", href: "/mock-test", icon: ClipboardCheck },
  { label: "Settings", href: "/settings", icon: Settings },
];

// Mobile bottom navigation (PRD section 15.5)
export const bottomNav: NavItem[] = [
  { label: "Today", href: "/lesson", icon: BookOpen },
  { label: "Review", href: "/review", icon: RefreshCw },
  { label: "Speak", href: "/speaking", icon: Mic },
  { label: "Stats", href: "/statistics", icon: BarChart3 },
  { label: "Profile", href: "/settings", icon: Settings },
];
