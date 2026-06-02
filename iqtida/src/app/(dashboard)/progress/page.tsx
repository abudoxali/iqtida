"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROGRESS_LEVELS } from "@/lib/constants";
import {
  TrendingUp,
  Flame,
  BookmarkCheck,
  Bookmark,
  CalendarCheck,
  Target,
  Send,
  Star,
  Trophy,
  Loader2,
  AlertCircle
} from "lucide-react";
import { BackButton } from "@/components/layout/back-button";
import Link from "next/link";

const daysOfWeek = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    completedToday: 0,
    totalApplied: 0,
    savedCount: 0,
    streak: 0,
    todaySunnahs: 0,
    completionPercentage: 0,
  });

  const [weeklyProgress, setWeeklyProgress] = useState<any[]>([]);
  const [reflection, setReflection] = useState("");
  const [reflections, setReflections] = useState<string[]>([]);

  useEffect(() => {
    // Load reflections from localStorage for user convenience
    const saved = localStorage.getItem("iqtidaa_reflections");
    if (saved) {
      try { setReflections(JSON.parse(saved)); } catch {}
    }

    async function loadProgress() {
      try {
        setLoading(true);
        // 1. Fetch dashboard stats
        const dashboardRes = await fetch("/api/dashboard");
        const dashboardData = await dashboardRes.json();

        // 2. Fetch detailed progress
        const progressRes = await fetch("/api/progress");
        const progressData = await progressRes.json();

        if (dashboardData && !dashboardData.error && progressData && !progressData.error) {
          setStats({
            completedToday: dashboardData.completedToday,
            totalApplied: dashboardData.totalApplied,
            savedCount: dashboardData.savedCount,
            streak: dashboardData.streak,
            todaySunnahs: dashboardData.todaySunnahs,
            completionPercentage: dashboardData.completionPercentage,
          });
          setWeeklyProgress(progressData.weekProgress || []);
        }
      } catch (err) {
        setError("فشل في تحميل بيانات تقدّمي اليومي.");
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, []);

  const weeklyData = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0]; // Saturday to Friday
    weeklyProgress.forEach((item) => {
      if (item.completed) {
        const d = new Date(item.date);
        const day = d.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
        // Map day to Saturday index: Saturday(6) -> 0, Sunday(0) -> 1, ..., Friday(5) -> 6
        const mappedIndex = (day + 1) % 7;
        counts[mappedIndex] += 1;
      }
    });
    return counts;
  }, [weeklyProgress]);

  const maxWeekly = useMemo(() => {
    return Math.max(...weeklyData, 1);
  }, [weeklyData]);

  const currentLevel = useMemo(() => {
    return PROGRESS_LEVELS.slice().reverse().find((l) => stats.totalApplied >= l.min) ?? PROGRESS_LEVELS[0];
  }, [stats.totalApplied]);

  const submitReflection = () => {
    if (!reflection.trim()) return;
    const updated = [reflection.trim(), ...reflections];
    setReflections(updated);
    localStorage.setItem("iqtidaa_reflections", JSON.stringify(updated));
    setReflection("");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">جاري تحميل إحصاءات تقدّمك...</p>
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
    <div className="space-y-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <BackButton href="/dashboard" />
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-accent" />
          مستوى تقدّمي الشرعي
        </h1>
        <p className="text-sm text-muted-foreground">
          تابع تقدّمك الأسبوعي في إحياء السنن النبوية الشريفة واحرص على المداومة
        </p>
      </motion.div>

      {stats.totalApplied === 0 && stats.savedCount === 0 && weeklyProgress.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Trophy className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-bold text-muted-foreground mb-2">
                لا يوجد تقدّم مسجل بعد
              </h2>
              <p className="text-sm text-muted-foreground/60 max-w-md mb-6 leading-relaxed">
                ابدأ بتطبيق السنن اليومية في حياتك وسجّل تطبيقك من لوحة التحكم أو جدول اليوم لترى إحصاءات تقدّمك هنا.
              </p>
              <Button variant="outline" className="border-accent text-accent hover:bg-accent/5" asChild>
                <Link href="/today">
                  <CalendarCheck className="ml-2 h-4 w-4" />
                  تصفح سنن اليوم لتطبيقها
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
              <Card className="glass-card border-border/50">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                    <BookmarkCheck className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.completedToday}</p>
                    <p className="text-[10px] text-muted-foreground">طبقت اليوم</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-border/50">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                    <CalendarCheck className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{weeklyProgress.filter(p => p.completed).length}</p>
                    <p className="text-[10px] text-muted-foreground">هذا الأسبوع</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-border/50 col-span-2 sm:col-span-1">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                    <Star className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalApplied}</p>
                    <p className="text-[10px] text-muted-foreground">إجمالي التطبيقات</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-border/50">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                    <Bookmark className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.savedCount}</p>
                    <p className="text-[10px] text-muted-foreground">سنن محفوظة</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-border/50">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                    <Flame className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.streak}</p>
                    <p className="text-[10px] text-muted-foreground">أيام المداومة متتالية</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Completion Chart */}
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3 border-b gold-border">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <CalendarCheck className="h-4 w-4 text-accent" />
                  مؤشر النشاط والتطبيق الأسبوعي
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-end justify-between gap-4 h-36">
                  {weeklyData.map((count, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                      <span className="text-[10px] text-muted-foreground/75 font-semibold">{count}</span>
                      <div
                        className="w-full rounded-t-lg bg-accent/20 transition-all duration-500 relative group overflow-hidden"
                        style={{
                          height: `${(count / maxWeekly) * 100}%`,
                          minHeight: count > 0 ? "8px" : "2px",
                        }}
                      >
                        <div className="absolute inset-0 gold-gradient opacity-80" />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{daysOfWeek[i]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reflection Diary */}
            <Card className="glass-card border-border/50 border-accent/10">
              <CardHeader className="pb-3 border-b gold-border">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Send className="h-4 w-4 text-accent" />
                  دفتر التأملات والخواطر الإيمانية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <p className="text-xs text-muted-foreground">
                  دوّن خاطرة، سنة تأثرت بتطبيقها اليوم، أو فكرة تود الالتزام بها:
                </p>
                <div className="flex gap-2">
                  <Input
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="مثال: شعرت براحة عظيمة بعد الالتزام بسنة الوضوء قبل النوم اليوم..."
                    className="flex-1 rounded-xl"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitReflection();
                    }}
                  />
                  <Button className="gold-gradient text-white rounded-xl" onClick={submitReflection} disabled={!reflection.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {reflections.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {reflections.map((r, i) => (
                      <div key={i} className="rounded-xl bg-secondary/30 border border-border/50 p-3 text-xs text-muted-foreground leading-relaxed">
                        {r}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Sidebar - Level & Circle Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Circle Progress Percentage */}
            <Card className="glass-card border-border/50">
              <CardContent className="flex flex-col items-center py-8 text-center justify-center">
                <div className="relative mb-4">
                  <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r="52"
                      fill="none"
                      stroke="hsl(var(--accent))"
                      strokeWidth="8"
                      strokeDasharray={`${(stats.completionPercentage / 100) * 327} 327`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{stats.completionPercentage}%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">معدل الإنجاز وتطبيق سنن اليوم</p>
              </CardContent>
            </Card>

            {/* Progress Level Leveling */}
            <Card className="glass-card border-border/50">
              <CardContent className="p-5 text-center">
                <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">مرتبة الاقتداء الحالية</p>
                <p className="text-xl font-bold text-accent">{currentLevel.label}</p>
                <div className="mt-4 space-y-2 border-t gold-border pt-4 text-right">
                  {PROGRESS_LEVELS.map((level, i) => {
                    const isUnlocked = stats.totalApplied >= level.min;
                    const isCurrent = currentLevel.label === level.label;
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className={`h-2.5 w-2.5 rounded-full ${
                          isCurrent ? "bg-accent shadow-sm" : isUnlocked ? "bg-emerald-500" : "bg-secondary"
                        }`} />
                        <span className={isUnlocked ? "text-foreground font-semibold" : "text-muted-foreground/50"}>
                          {level.label} ({level.min}+ سنة)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Target Recommendation */}
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">الهدف التالي</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {stats.totalApplied < 10
                    ? "حافظ على تطبيق السنن يومياً لتصل إلى مرتبة (مواظب). تطبيق سنن يسيرة بانتظام أفضل عند الله من كثرتها مع الانقطاع."
                    : "مرتبتك ممتازة! احرص على المداومة على السنن الرواتب وسنّة الوضوء قبل النوم لتعلو مرتبة اقتدائك أكثر."}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
