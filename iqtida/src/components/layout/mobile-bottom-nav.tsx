"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Clock, Search, BookOpen, Sparkles } from "lucide-react";

const items = [
  { href: "/dashboard", label: "الرئيسية", icon: Home },
  { href: "/timeline", label: "يومي", icon: Clock },
  { href: "/seerah", label: "السيرة", icon: Sparkles },
  { href: "/ask", label: "اسأل", icon: Search },
  { href: "/library", label: "المكتبة", icon: BookOpen },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg lg:hidden" dir="rtl">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-0",
                isActive
                  ? "text-accent"
                  : "text-muted-foreground/60 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-accent/20")} />
              <span className="text-[10px] font-medium truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
