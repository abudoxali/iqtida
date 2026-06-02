"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, DISCLAIMER } from "@/lib/constants";
import {
  LayoutDashboard, Clock, Search, BookOpen,
  Bookmark, TrendingUp, Settings, X, Library, Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Clock, Search, BookOpen,
  Bookmark, TrendingUp, Settings, Library, Sparkles,
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-64 border-l gold-border",
          "bg-white/95 dark:bg-background/95 backdrop-blur-xl lg:sticky lg:top-0 lg:block",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0 shadow-xl" : "translate-x-full lg:translate-x-0"
        )}
        dir="rtl"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between p-5 border-b gold-border">
            <Link href="/dashboard" className="text-xl font-bold gold-text">
              اقتداء
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav */}
          <ScrollArea className="flex-1 px-2 py-4">
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = iconMap[item.icon];
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "gold-gradient text-white shadow-sm"
                        : "text-muted-foreground/70 hover:text-foreground hover:bg-amber-50 dark:hover:bg-secondary/50"
                    )}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="mr-auto w-1.5 h-1.5 rounded-full bg-white/80"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t gold-border p-4">
            <p className="text-[10px] text-muted-foreground/40 text-center leading-relaxed">
              {DISCLAIMER}
            </p>
          </div>
        </div>
      </aside>
    </AnimatePresence>
  );
}
