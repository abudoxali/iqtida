"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart, Quote, Lightbulb,
  ListChecks, AlertTriangle, BookOpen, CheckCircle2, Loader2, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/components/layout/back-button";
import { DISCLAIMER } from "@/lib/constants";

interface SunnahDetail {
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
  isWorship: boolean;
  isHabit: boolean;
  hadith?: {
    id: string;
    arabicText: string;
    sourceBook: string;
    hadithNumber?: string;
    grade: string;
    gradingSource?: string;
    explanation?: string;
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  WORSHIP: "عبادة",
  HABIT: "عادة",
  MANNERS: "أدب",
  REMEMBRANCE: "أذكار",
  TRANSACTION: "معاملة",
};

export default function LibraryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [detail, setDetail] = useState<SunnahDetail | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        // Fetch Sunnah detail
        const detailRes = await fetch(`/api/sunnah?id=${id}`);
        const detailData = await detailRes.json();
        if (detailData.sunnah) {
          setDetail(detailData.sunnah);
        } else {
          setError("لم يتم العثور على هذه السنة في قاعدة البيانات.");
        }

        // Fetch user progress
        const progressRes = await fetch("/api/progress");
        const progressData = await progressRes.json();
        if (progressData.weekProgress) {
          const todayStr = new Date().toISOString().slice(0, 10);
          const todayCompleted = progressData.weekProgress
            .filter((p: any) => p.date.startsWith(todayStr) && p.completed)
            .map((p: any) => p.sunnahPracticeId);
          setCompleted(todayCompleted);
        }

        // Fetch user favorites
        const savedRes = await fetch("/api/saved");
        const savedData = await savedRes.json();
        if (savedData.items) {
          setFavorites(savedData.items.map((i: any) => i.sunnahPracticeId).filter(Boolean));
        }
      } catch (err) {
        setError("حدث خطأ أثناء تحميل تفاصيل السنة.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const toggleComplete = async () => {
    if (!detail) return;
    const isDone = completed.includes(detail.id);
    const updated = isDone ? completed.filter((c) => c !== detail.id) : [...completed, detail.id];
    setCompleted(updated);

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sunnahPracticeId: detail.id, completed: !isDone }),
      });
    } catch {
      setCompleted(completed);
    }
  };

  const toggleFavorite = async () => {
    if (!detail) return;
    const isFavorite = favorites.includes(detail.id);
    const updated = isFavorite ? favorites.filter((fav) => fav !== detail.id) : [...favorites, detail.id];
    setFavorites(updated);

    try {
      await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "SUNNAH", sunnahPracticeId: detail.id }),
      });
    } catch {
      setFavorites(favorites);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">جاري تحميل تفاصيل السنة...</p>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto" dir="rtl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle className="h-16 w-16 text-destructive mb-4" />
              <h2 className="text-xl font-bold text-muted-foreground mb-2">تنبيه</h2>
              <p className="text-sm text-muted-foreground/60 max-w-md mb-6">{error || "لم نجد هذه السنة في قاعدة البيانات."}</p>
              <Button variant="secondary" onClick={() => router.push("/library")}>
                العودة إلى المكتبة
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const isCompleted = completed.includes(detail.id);
  const isFavorite = favorites.includes(detail.id);
  const catLabel = CATEGORY_LABELS[detail.category] || detail.category;

  // Split practical steps if stored as a string or list
  const stepsList = detail.practicalSteps
    ? detail.practicalSteps.split("\n").map(s => s.replace(/^\d+[\.\-]\s*/, "").trim()).filter(Boolean)
    : [];

  const mistakesList = detail.commonMistakes
    ? detail.commonMistakes.split("\n").map(s => s.replace(/^\-?\s*/, "").trim()).filter(Boolean)
    : [];

  return (
    <div className="space-y-6 max-w-3xl mx-auto" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <BackButton href="/library" />
      </motion.div>

      {/* Header Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="emerald-badge">
                    {detail.evidenceStatus === "SAHIH" ? "ثابت وصحيح" : "حسن"}
                  </Badge>
                  <Badge variant="secondary">{catLabel}</Badge>
                  <Badge variant="outline" className="border-accent/30 text-accent">
                    {detail.difficulty === "easy" ? "سهل التطبيق" : "متوسط الصعوبة"}
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold">{detail.title}</h1>
                <p className="text-sm text-muted-foreground/70 leading-relaxed">{detail.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t gold-border mt-4">
              <Button
                size="sm"
                className={`gap-1.5 ${isCompleted ? "bg-emerald-500 text-white" : "gold-gradient text-white"}`}
                onClick={toggleComplete}
              >
                <CheckCircle2 className="h-4 w-4" />
                {isCompleted ? "✓ طبّقت السنة اليوم" : "طبّقتها اليوم"}
              </Button>
              <Button
                size="sm"
                variant={isFavorite ? "default" : "secondary"}
                className={`gap-1.5 ${isFavorite ? "bg-red-500 text-white hover:bg-red-600" : ""}`}
                onClick={toggleFavorite}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-white" : ""}`} />
                {isFavorite ? "تم الحفظ بالمفضلة" : "أضف للمفضلة"}
              </Button>
              {detail.estimatedTime && (
                <span className="text-xs text-muted-foreground/50 flex items-center gap-1 mr-auto self-center">
                  الوقت التقريبي: {detail.estimatedTime}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Evidence/Hadith */}
      {detail.hadith && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Quote className="h-5 w-5 shrink-0 mt-1 text-accent" />
                <div className="space-y-3 flex-1">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-accent" />
                    الدليل من السنة النبوية
                  </h2>
                  <p className="text-base font-arabic font-medium leading-loose text-foreground/90 p-4 bg-amber-50/20 dark:bg-card/20 border gold-border rounded-xl">
                    {detail.hadith.arabicText}
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    المصدر: <span className="font-semibold text-foreground">{detail.hadith.sourceBook}</span> {detail.hadith.hadithNumber ? `— رقم: ${detail.hadith.hadithNumber}` : ""} {detail.hadith.gradingSource && `| تحقيق: ${detail.hadith.gradingSource}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Explanation */}
      {detail.hadith?.explanation && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="glass-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 shrink-0 mt-0.5 text-amber-400" />
                <div className="space-y-3">
                  <h2 className="font-semibold text-lg">الشرح الفقهي والمبسط</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{detail.hadith.explanation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Practical Steps */}
      {stepsList.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card border-border/50 border-accent/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <ListChecks className="h-5 w-5 shrink-0 mt-0.5 text-accent" />
                <div className="space-y-3 w-full">
                  <h2 className="font-semibold text-lg">خطوات التطبيق العملي</h2>
                  <ol className="space-y-3">
                    {stepsList.map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                          {i + 1}
                        </span>
                        <span className="self-center leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Common Mistakes */}
      {mistakesList.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="glass-card border-destructive/20 bg-destructive/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-destructive" />
                <div className="space-y-3 w-full">
                  <h2 className="font-semibold text-lg text-destructive">تنبيهات وأخطاء شائعة تجنبها</h2>
                  <ul className="space-y-2">
                    {mistakesList.map((mistake, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-xs text-destructive">!</span>
                        <span className="self-center leading-relaxed">{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Footer Disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-muted-foreground/50 text-center px-4"
      >
        {DISCLAIMER}
      </motion.p>
    </div>
  );
}
