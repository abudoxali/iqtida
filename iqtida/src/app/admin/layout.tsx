"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS, DISCLAIMER } from "@/lib/constants";
import {
  LayoutDashboard,
  BookOpen,
  ListChecks,
  MessageSquare,
  Library,
  X,
  Menu,
  Shield,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  BookOpen,
  ListChecks,
  MessageSquare,
  Library,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen" dir="rtl">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: sidebarOpen ? 0 : "100%" }}
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 border-l border-border",
          "bg-background/95 backdrop-blur-xl lg:sticky lg:block lg:translate-x-0",
          "transition-transform duration-300 ease-in-out"
        )}
        dir="rtl"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-6">
            <Link href="/admin" className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <span className="font-bold text-xl text-accent">الإدارة</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <ScrollArea className="flex-1 px-3">
            <nav className="space-y-1">
              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = iconMap[item.icon];
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-6 px-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg border border-border/50 px-4 py-2.5 text-xs text-muted-foreground transition-colors hover:border-accent/30 hover:text-accent"
              >
                <LayoutDashboard className="h-4 w-4" />
                العودة للتطبيق
              </Link>
            </div>
          </ScrollArea>
          <div className="border-t border-border p-4">
            <p className="text-xs text-muted-foreground text-center">
              {DISCLAIMER}
            </p>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Admin topbar */}
        <header className="flex h-14 items-center gap-4 border-b border-border bg-background/50 backdrop-blur-xl px-4 md:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 mr-auto">
            <Shield className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold text-accent hidden sm:inline">
              لوحة الإدارة
            </span>
          </div>
          <Link
            href="/dashboard"
            className="text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            العودة للتطبيق
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
