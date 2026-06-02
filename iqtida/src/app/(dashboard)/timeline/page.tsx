"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2, Eye, Sun, Moon, Home, Coffee, Users, Briefcase,
  Sunrise, Sparkles, Clock, Heart, BookmarkCheck, Loader2, AlertCircle,
  SlidersHorizontal, ChevronDown, Check
} from "lucide-react";
import { BackButton } from "@/components/layout/back-button";
import Link from "next/link";

const timeSlots = [
  { key: "WAKE_UP", label: "عند الاستيقاظ", icon: Sunrise, desc: "سنن الاستيقاظ وبداية اليوم" },
  { key: "MORNING", label: "الصباح", icon: Sun, desc: "أذكار الصباح وصلاة الضحى" },
  { key: "WUDHU_PRAYER", label: "الوضوء والصلاة", icon: Clock, desc: "سنن الطهارة والمساجد والصلوات" },
  { key: "FOOD_DRINK", label: "الطعام والشراب", icon: Coffee, desc: "آداب التسمية والأكل والحمد" },
  { key: "INTERACTION", label: "التعامل والأخلاق", icon: Users, desc: "السلام والبشاشة ومكارم الأخلاق" },
  { key: "WORK_STUDY", label: "العمل والدراسة", icon: Briefcase, desc: "الإخلاص والأمانة والسعي والذكر" },
  { key: "LEAVING_HOME", label: "الخروج والدخول", icon: Home, desc: "أذكار الدخول والخروج من المنزل" },
  { key: "EVENING", label: "المساء", icon: Moon, desc: "أذكار المساء وحفظ الله" },
  { key: "BEFORE_SLEEP", label: "قبل النوم", icon: Moon, desc: "سنن النوم والاستعداد له" },
  { key: "NIGHT_WAKE", label: "قيام الليل", icon: Moon, desc: "صلاة الليل والتهجد والوتر" },
];

const categoryFilters = [
  { key: "ALL", label: "جميع الأقسام" },
  { key: "WORSHIP", label: "عبادة" },
  { key: "HABIT", label: "عادة" },
  { key: "MANNERS", label: "أدب" },
  { key: "REMEMBRANCE", label: "ذكر" },
  { key: "TRANSACTION", label: "معاملة" },
];

const difficultyFilters = [
  { key: "ALL", label: "جميع الصعوبات" },
  { key: "easy", label: "سهل" },
  { key: "medium", label: "متوسط" },
  { key: "hard", label: "صعب" },
];

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

export default function TimelinePage() {
  const [sunnahs, setSunnahs] = useState<SunnahItem[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [activeMoment, setActiveMoment] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
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

        // Load progress & saved items
        const progressRes = await fetch("/api/progress");
        const progressData = await progressRes.json();
        
        if (progressData.weekProgress) {
          const todayStr = new Date().toISOString().slice(0, 10);
          const todayCompleted = progressData.weekProgress
            .filter((p: any) => p.date.startsWith(todayStr) && p.completed)
            .map((p: any) => p.sunnahPracticeId);
          setCompleted(todayCompleted);
        }

        const savedRes = await fetch("/api/saved");
        const savedData = await savedRes.json();
        if (savedData.items) {
          setSaved(savedData.items.map((i: any) => i.sunnahPracticeId).filter(Boolean));
        }
      } catch (err) {
        setError("فشل في تحميل جدول السنن، يرجى المحاولة لاحقاً.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const toggleComplete = async (id: string) => {
    const isDone = completed.includes(id);
    const updated = isDone ? completed.filter((c) => c !== id) : [...completed, id];
    setCompleted(updated);

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sunnahPracticeId: id, completed: !isDone }),
      });
    } catch {
      setCompleted(completed);
    }
  };

  const toggleSave = async (id: string) => {
    const isSaved = saved.includes(id);
    const updated = isSaved ? saved.filter((s) => s !== id) : [...saved, id];
    setSaved(updated);

    try {
      await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "SUNNAH", sunnahPracticeId: id }),
      });
    } catch {
      setSaved(saved);
    }
  };

  // Filter & Group Sunnahs
  const filteredSunnahs = useMemo(() => {
    return sunnahs.filter((s) => {
      const matchCategory = selectedCategory === "ALL" || s.category === selectedCategory;
      const matchDifficulty = selectedDifficulty === "ALL" || s.difficulty === selectedDifficulty;
      return matchCategory && matchDifficulty;
    });
  }, [sunnahs, selectedCategory, selectedDifficulty]);

  const groupedSunnahs = useMemo(() => {
    const groups: Record<string, SunnahItem[]> = {};
    timeSlots.forEach((slot) => {
      groups[slot.key] = filteredSunnahs.filter((s) => s.dayMoment === slot.key);
    });
    return groups;
  }, [filteredSunnahs]);

  const todayCount = completed.length;
  const totalCount = filteredSunnahs.length;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">جاري تحميل يومك على السنة...</p>
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
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <BackButton href="/dashboard" />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">يومي على السنة</h1>
            <p className="text-sm text-muted-foreground/60 mt-1">سنن اليوم مرتبة زمنياً ومصنفة لتيسير تطبيقها</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-9 text-xs gap-1.5 border-accent/20 ${showFilters ? "gold-gradient text-white" : "text-muted-foreground"}`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              تصفية السنن
            </Button>
            <span className="flex items-center gap-1 text-sm text-muted-foreground/60 border gold-border px-3 py-1.5 rounded-xl bg-white/60 dark:bg-card/50">
              <BookmarkCheck className="h-4 w-4 text-emerald-500" />
              المطبّق اليوم:
              <span className="font-bold text-foreground mx-1">{todayCount}</span>
              <span>/ {totalCount}</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border gold-border bg-white/80 dark:bg-card/50 backdrop-blur-sm p-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground">القسم الشرعي</label>
                  <div className="flex flex-wrap gap-1.5">
                    {categoryFilters.map((cat) => (
                      <button
                        key={cat.key}
                        onClick={() => setSelectedCategory(cat.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          selectedCategory === cat.key
                            ? "gold-gradient text-white border-accent"
                            : "bg-white/50 dark:bg-card/25 text-muted-foreground border-border hover:border-accent/30"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground">صعوبة التطبيق</label>
                  <div className="flex flex-wrap gap-1.5">
                    {difficultyFilters.map((diff) => (
                      <button
                        key={diff.key}
                        onClick={() => setSelectedDifficulty(diff.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          selectedDifficulty === diff.key
                            ? "gold-gradient text-white border-accent"
                            : "bg-white/50 dark:bg-card/25 text-muted-foreground border-border hover:border-accent/30"
                        }`}
                      >
                        {diff.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick nav moments chips */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {timeSlots.map((slot) => {
            const Icon = slot.icon;
            const isActive = activeMoment === slot.key;
            const hasItems = (groupedSunnahs[slot.key]?.length || 0) > 0;
            if (!hasItems) return null;
            return (
              <button
                key={slot.key}
                onClick={() => setActiveMoment(activeMoment === slot.key ? null : slot.key)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all border shrink-0 ${
                  isActive
                    ? "gold-gradient text-white border-accent shadow-sm"
                    : "bg-white/60 dark:bg-card/50 border gold-border text-muted-foreground/70 hover:border-accent/30"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {slot.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Timeline List */}
      <div className="space-y-4">
        {timeSlots.map((slot, idx) => {
          if (activeMoment && activeMoment !== slot.key) return null;
          const sunnahList = groupedSunnahs[slot.key];
          if (!sunnahList || sunnahList.length === 0) return null;
          const Icon = slot.icon;
          const momentCompleted = sunnahList.filter((s) => completed.includes(s.id)).length;

          return (
            <motion.div
              key={slot.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card className="border gold-border bg-white/70 dark:bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b gold-border bg-gradient-to-l from-amber-50/50 to-transparent dark:from-accent/5 pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg gold-gradient text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">{slot.label}</div>
                    <span className="text-xs text-muted-foreground/60">
                      {momentCompleted}/{sunnahList.length}
                    </span>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground/50 pr-10">{slot.desc}</p>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {sunnahList.map((sunnah) => {
                      const isCompleted = completed.includes(sunnah.id);
                      const isSaved = saved.includes(sunnah.id);
                      return (
                        <div
                          key={sunnah.id}
                          className={`rounded-xl border p-4 transition-all duration-200 ${
                            isCompleted
                              ? "border-emerald-300/50 bg-emerald-50/50 dark:bg-emerald-500/5"
                              : "border gold-border bg-white/50 dark:bg-card/30 hover:gold-shadow"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                <Badge variant="outline" className="emerald-badge text-[10px] px-2 py-0">
                                  {sunnah.evidenceStatus === "SAHIH" ? "ثابت وصحيح" : "حسن"}
                                </Badge>
                                <Badge variant="secondary" className="text-[10px] px-2 py-0">
                                  {sunnah.difficulty === "easy" ? "سهل" : "متوسط"}
                                </Badge>
                              </div>
                              <h4 className="font-bold text-sm">{sunnah.title}</h4>
                              <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">{sunnah.description}</p>
                              {sunnah.hadith && (
                                <p className="text-[10px] text-muted-foreground/40 mt-1">📖 {sunnah.hadith.sourceBook}</p>
                              )}
                            </div>
                            <button
                              onClick={() => toggleSave(sunnah.id)}
                              className={`shrink-0 p-1 rounded-lg transition-colors ${isSaved ? "text-red-500" : "text-muted-foreground/30 hover:text-red-400"}`}
                            >
                              <Heart className={`h-4 w-4 ${isSaved ? "fill-red-500" : ""}`} />
                            </button>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant={isCompleted ? "default" : "outline"}
                              className={`h-8 text-xs gap-1 ${
                                isCompleted
                                  ? "bg-emerald-500 text-white animate-fade-in"
                                  : "border-emerald-300/50 text-emerald-700 dark:text-emerald-400"
                              }`}
                              onClick={() => toggleComplete(sunnah.id)}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {isCompleted ? "✓ طبّقت" : "طبّقت"}
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 text-xs" asChild>
                              <Link href={`/library/${sunnah.id}`}>
                                <Eye className="h-3.5 w-3.5 ml-1" />
                                التفاصيل
                              </Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSunnahs.length === 0 && (
        <Card className="border gold-border bg-white/70 dark:bg-card/50 backdrop-blur-sm py-12 text-center">
          <CardContent className="flex flex-col items-center justify-center">
            <SlidersHorizontal className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-bold">لا توجد سنن مطابقة</h3>
            <p className="text-sm text-muted-foreground/60 mt-1">يرجى تعديل خيارات التصفية لعرض السنن</p>
            <Button
              variant="outline"
              className="mt-4 border-accent text-accent hover:bg-accent/5"
              onClick={() => {
                setSelectedCategory("ALL");
                setSelectedDifficulty("ALL");
              }}
            >
              إعادة تعيين الفلاتر
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
