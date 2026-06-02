"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, Search, Heart, Eye, SlidersHorizontal, X, Loader2, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/components/layout/back-button";
import { normalizeArabic } from "@/lib/utils";

interface SunnahItem {
  id: string;
  title: string;
  description: string;
  category: string;
  dayMoment: string;
  evidenceStatus: string;
  difficulty: string;
  estimatedTime?: string;
  practicalSteps?: string;
  commonMistakes?: string;
  hadith?: {
    id: string;
    arabicText: string;
    sourceBook: string;
    grade: string;
  };
}

const SUNNAH_CATEGORIES = [
  { id: "WORSHIP", label: "عبادة" },
  { id: "HABIT", label: "عادة" },
  { id: "MANNERS", label: "أدب" },
  { id: "REMEMBRANCE", label: "أذكار" },
  { id: "TRANSACTION", label: "معاملة" },
];

export default function LibraryPage() {
  const [sunnahs, setSunnahs] = useState<SunnahItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load Sunnahs
        const sunnahsRes = await fetch("/api/sunnah");
        const sunnahsData = await sunnahsRes.json();
        if (sunnahsData.sunnahs) {
          setSunnahs(sunnahsData.sunnahs);
        }

        // Load saved items
        const savedRes = await fetch("/api/saved");
        const savedData = await savedRes.json();
        if (savedData.items) {
          setFavorites(savedData.items.map((i: any) => i.sunnahPracticeId).filter(Boolean));
        }
      } catch (err) {
        setError("فشل في تحميل المكتبة، يرجى المحاولة لاحقاً.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const toggleFavorite = async (id: string) => {
    const isFavorite = favorites.includes(id);
    const updated = isFavorite ? favorites.filter((fav) => fav !== id) : [...favorites, id];
    setFavorites(updated);

    try {
      await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "SUNNAH", sunnahPracticeId: id }),
      });
    } catch {
      setFavorites(favorites);
    }
  };

  const filtered = useMemo(() => {
    return sunnahs.filter((s) => {
      const matchesSearch = !searchQuery.trim() ||
        normalizeArabic(s.title).includes(normalizeArabic(searchQuery.trim())) ||
        normalizeArabic(s.description || "").includes(normalizeArabic(searchQuery.trim()));
      const matchesCategory = categoryFilter === "all" || s.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === "all" || s.difficulty === difficultyFilter;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [sunnahs, searchQuery, categoryFilter, difficultyFilter]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">جاري تحميل مكتبة السنن...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-12 text-center" dir="rtl">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-bold">خطأ في الاتصال</h3>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
        <Button className="mt-4 gold-gradient text-white" onClick={() => window.location.reload()}>إعادة تحميل</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <BackButton href="/dashboard" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-accent" />
              أقسام السنة
            </h1>
            <p className="text-sm text-muted-foreground/60">تصفح جميع السنن الثابتة والواردة عن النبي ﷺ في مختلف مواقف الحياة</p>
          </div>
          <span className="text-sm text-muted-foreground/60 border gold-border px-3 py-1.5 rounded-xl bg-white/60 dark:bg-card/50">{sunnahs.length} سنة</span>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في السنن..."
                className="h-11 pr-11 rounded-xl border-border/50 bg-background/50 text-right"
                dir="rtl"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 shrink-0 ${
                    categoryFilter === "all"
                      ? "border-accent/30 bg-accent/10 text-accent"
                      : "border-border/50 bg-secondary/50 text-muted-foreground hover:border-accent/30 hover:text-accent"
                  }`}
                >
                  الكل
                </button>
                {SUNNAH_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 shrink-0 ${
                      categoryFilter === cat.id
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-border/50 bg-secondary/50 text-muted-foreground hover:border-accent/30 hover:text-accent"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`shrink-0 rounded-full border p-1.5 transition-all duration-200 ${
                  showFilters || difficultyFilter !== "all"
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-border/50 text-muted-foreground"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      { value: "all", label: "الكل" },
                      { value: "easy", label: "سهل" },
                      { value: "medium", label: "متوسط" },
                      { value: "hard", label: "صعب" },
                    ].map((ef) => (
                      <button
                        key={ef.value}
                        onClick={() => setDifficultyFilter(ef.value)}
                        className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                          difficultyFilter === ef.value
                            ? "border-accent/30 bg-accent/10 text-accent"
                            : "border-border/50 bg-secondary/50 text-muted-foreground hover:border-accent/30"
                        }`}
                      >
                        {ef.label}
                      </button>
                    ))}
                    {difficultyFilter !== "all" && (
                      <button
                        onClick={() => setDifficultyFilter("all")}
                        className="flex items-center gap-1 whitespace-nowrap rounded-full border border-destructive/30 px-3 py-1.5 text-xs text-destructive"
                      >
                        <X className="h-3 w-3" />
                        إلغاء التصفية
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">لا توجد نتائج</h3>
                <p className="text-sm text-muted-foreground/60 max-w-md mb-6">
                  لم نجد أي سنة تطابق بحثك. جرب تغيير كلمات البحث أو إزالة التصفية.
                </p>
                <Button variant="secondary" onClick={() => { setSearchQuery(""); setCategoryFilter("all"); setDifficultyFilter("all"); }}>
                  إعادة تعيين الفلاتر
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((sunnah, idx) => {
              const isFavorite = favorites.includes(sunnah.id);
              return (
                <motion.div key={sunnah.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}>
                  <Card className={`glass-card border-border/50 h-full transition-all duration-200 hover:border-accent/30 hover:shadow-[0_0_20px_-5px] hover:shadow-accent/10 ${isFavorite ? "border-red-200 dark:border-red-900/30" : ""}`}>
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-sm leading-tight">{sunnah.title}</h3>
                        <button
                          onClick={() => toggleFavorite(sunnah.id)}
                          className={`shrink-0 p-1 rounded-lg transition-colors ${isFavorite ? "text-red-500" : "text-muted-foreground/30 hover:text-red-400"}`}
                        >
                          <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500" : ""}`} />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{sunnah.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <Badge variant="outline" className="emerald-badge text-[10px]">{sunnah.evidenceStatus === "SAHIH" ? "ثابت وصحيح" : "حسن"}</Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          {sunnah.difficulty === "easy" ? "سهل" : "متوسط"}
                        </Badge>
                        {sunnah.estimatedTime && (
                          <span className="text-[10px] text-muted-foreground/40">{sunnah.estimatedTime}</span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <Button size="sm" variant="ghost" className="h-8 text-xs flex-1" asChild>
                          <Link href={`/library/${sunnah.id}`}>
                            <Eye className="h-3.5 w-3.5 ml-1" />
                            عرض التفاصيل والخطوات
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
