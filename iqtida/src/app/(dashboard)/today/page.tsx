"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2, Eye, Sun, Moon, Home, Coffee, Users, Briefcase,
  Sunrise, Sparkles, Clock, Heart, BookmarkCheck, Loader2, AlertCircle,
  ChevronDown, ChevronUp, Star, Award, ShieldAlert
} from "lucide-react";
import { BackButton } from "@/components/layout/back-button";
import Link from "next/link";
import { GENERAL_DISCLAIMER } from "@/lib/constants";

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

interface SunnahItem {
  id: string;
  title: string;
  description: string;
  category: string;
  dayMoment: string;
  evidenceStatus: string;
  difficulty: string;
  estimatedTime: string;
  practicalSteps?: string;
  commonMistakes?: string;
  hadith?: {
    id: string;
    arabicText: string;
    sourceBook: string;
    grade: string;
  };
}

export default function TodayPage() {
  const [sunnahs, setSunnahs] = useState<SunnahItem[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMoment, setActiveMoment] = useState<string | null>(null);
  
  // Track which Sunnah card details are expanded
  const [expandedSunnah, setExpandedSunnah] = useState<string | null>(null);

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
        setError("فشل في تحميل البيانات، يرجى إعادة المحاولة.");
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

  const groupedSunnahs = useMemo(() => {
    const groups: Record<string, SunnahItem[]> = {};
    timeSlots.forEach((slot) => {
      groups[slot.key] = sunnahs.filter((s) => s.dayMoment === slot.key);
    });
    return groups;
  }, [sunnahs]);

  const todayCount = completed.length;
  const totalCount = sunnahs.length;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent" />
          <p className="text-muted-foreground">جاري تحميل جدول السنن الفاخر اليومي...</p>
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
        <Button className="mt-4 gold-gradient text-white rounded-xl" onClick={() => window.location.reload()}>إعادة تحميل</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      {/* Title block */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <BackButton href="/dashboard" />
        <div className="flex items-center justify-between flex-wrap gap-4 mt-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Clock className="h-6 w-6 text-accent" />
              يومي على السنة المطهرة
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground/60">
              جدول السنن النبوية المأثورة مقسمة زمنياً ومفصلة بخطوات عملية ودلائلها
            </p>
          </div>
          <Card className="border gold-border px-4 py-2 bg-emerald-500/[0.02] dark:bg-accent/[0.02] flex items-center gap-2">
            <BookmarkCheck className="h-5 w-5 text-emerald-500 animate-bounce" />
            <div>
              <p className="text-base font-bold text-accent">{todayCount} / {totalCount}</p>
              <p className="text-[10px] text-muted-foreground/50 leading-none">مجموع سنن اليوم</p>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Quick chip links */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.05 }}
      >
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
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                  isActive
                    ? "gold-gradient text-white border-accent shadow-md shadow-amber-500/10"
                    : "bg-white/60 dark:bg-card/45 border gold-border text-muted-foreground/70 hover:border-accent/40"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {slot.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Structured Time slots */}
      <div className="space-y-6">
        {timeSlots.map((slot, idx) => {
          if (activeMoment && activeMoment !== slot.key) return null;
          const sunnahList = groupedSunnahs[slot.key];
          if (!sunnahList || sunnahList.length === 0) return null;
          const Icon = slot.icon;
          const momentCompleted = sunnahList.filter((s) => completed.includes(s.id)).length;

          return (
            <motion.div
              key={slot.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card className="border gold-border bg-white/70 dark:bg-card/45 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b gold-border bg-accent/5 pb-3.5">
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl gold-gradient text-white shadow-sm">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1">
                      <span className="text-foreground text-sm sm:text-base">{slot.label}</span>
                      <span className="block text-[11px] text-muted-foreground/50 font-normal leading-normal">{slot.desc}</span>
                    </div>
                    <Badge variant="outline" className="gold-border text-accent font-bold text-xs px-2 py-0.5 bg-accent/5">
                      {momentCompleted} / {sunnahList.length} سنن
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="grid gap-4 grid-cols-1">
                    {sunnahList.map((sunnah) => {
                      const isCompleted = completed.includes(sunnah.id);
                      const isSaved = saved.includes(sunnah.id);
                      const isExpanded = expandedSunnah === sunnah.id;

                      return (
                        <div
                          key={sunnah.id}
                          className={`rounded-xl border transition-all duration-300 ${
                            isCompleted
                              ? "border-emerald-300/40 bg-emerald-500/[0.01] dark:bg-emerald-500/5"
                              : "border gold-border bg-white/50 dark:bg-card/25 hover:gold-shadow"
                          }`}
                        >
                          {/* Upper Card Header Details */}
                          <div className="p-4 flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setExpandedSunnah(isExpanded ? null : sunnah.id)}>
                              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                <Badge variant="outline" className="emerald-badge text-[9px] font-bold px-1.5 py-0">
                                  {sunnah.evidenceStatus === "SAHIH" ? "ثابت وصحيح" : "حسن"}
                                </Badge>
                                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-secondary/80 text-muted-foreground">
                                  {sunnah.difficulty === "easy" ? "سهل" : "متوسط"}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground/60">⏱️ {sunnah.estimatedTime}</span>
                              </div>
                              <h4 className="font-bold text-sm sm:text-base text-foreground group-hover:text-accent transition-colors">
                                {sunnah.title}
                              </h4>
                              <p className="text-xs sm:text-sm text-muted-foreground/75 mt-1 line-clamp-2 leading-relaxed">
                                {sunnah.description}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2 shrink-0 self-start">
                              <button
                                onClick={() => toggleSave(sunnah.id)}
                                className={`p-1.5 rounded-lg transition-colors ${isSaved ? "text-red-500 bg-red-500/5" : "text-muted-foreground/30 hover:text-red-400"}`}
                              >
                                <Heart className={`h-4.5 w-4.5 ${isSaved ? "fill-red-500" : ""}`} />
                              </button>
                              <button
                                onClick={() => setExpandedSunnah(isExpanded ? null : sunnah.id)}
                                className="p-1.5 rounded-lg text-muted-foreground/40 hover:bg-secondary/40 transition-colors"
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Accordion Expand Details */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden border-t gold-border bg-secondary/5 dark:bg-card/20"
                              >
                                <div className="p-5 space-y-4 text-xs sm:text-sm leading-relaxed border-b gold-border">
                                  {/* Practical Steps */}
                                  {sunnah.practicalSteps && (
                                    <div className="space-y-1">
                                      <h5 className="font-bold text-accent flex items-center gap-1.5">
                                        <Star className="h-3.5 w-3.5 fill-accent" />
                                        خطوات التطبيق العملي للسنّة:
                                      </h5>
                                      <p className="text-xs sm:text-sm text-foreground/80 bg-white/40 dark:bg-card/20 rounded-xl p-3 border gold-border">{sunnah.practicalSteps}</p>
                                    </div>
                                  )}

                                  {/* Common Mistakes */}
                                  {sunnah.commonMistakes && (
                                    <div className="space-y-1">
                                      <h5 className="font-bold text-red-500 dark:text-red-400 flex items-center gap-1.5">
                                        <ShieldAlert className="h-3.5 w-3.5" />
                                        أخطاء يقع فيها البعض:
                                      </h5>
                                      <p className="text-xs sm:text-sm text-red-700/80 dark:text-red-300/70 bg-red-500/[0.03] rounded-xl p-3 border border-red-500/15">{sunnah.commonMistakes}</p>
                                    </div>
                                  )}

                                  {/* Authentic Hadith Section */}
                                  {sunnah.hadith && (
                                    <div className="space-y-1.5">
                                      <h5 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                                        <Award className="h-3.5 w-3.5" />
                                        نصّ الحديث الشريف والدليل الشرعي:
                                      </h5>
                                      <div className="rounded-xl border-2 border-accent bg-emerald-500/[0.02] dark:bg-accent/[0.02] p-4 text-center leading-[2] text-foreground font-semibold">
                                        « {sunnah.hadith.arabicText} »
                                        
                                        <div className="flex items-center justify-between text-[10px] text-muted-foreground/50 border-t gold-border pt-2 mt-3 font-normal leading-normal">
                                          <span>📖 المصدر: {sunnah.hadith.sourceBook}</span>
                                          <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-500 bg-emerald-500/5 px-1.5 py-0">{sunnah.hadith.grade}</Badge>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Quick Bottom Action Bars */}
                          <div className="px-4 py-3 flex gap-2 justify-end border-t gold-border/40">
                            <Button
                              size="sm"
                              variant={isCompleted ? "default" : "outline"}
                              className={`h-8 text-xs gap-1 rounded-lg ${
                                isCompleted
                                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                  : "border-emerald-300/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/5"
                              }`}
                              onClick={() => toggleComplete(sunnah.id)}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {isCompleted ? "✓ طبّقت السنّة" : "طبّقت السنّة"}
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 text-xs text-accent rounded-lg" asChild>
                              <Link href={`/library/${sunnah.id}`}>شرح تفصيلي</Link>
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
    </div>
  );
}
