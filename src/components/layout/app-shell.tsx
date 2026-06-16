import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { Topbar } from "./topbar";

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar title={title} subtitle={subtitle} />
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-12">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
