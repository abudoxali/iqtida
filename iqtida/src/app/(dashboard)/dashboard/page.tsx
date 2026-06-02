"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock, Search, BookOpen, Flame, Sparkles, ArrowLeft,
  Sun, Moon, Sunrise, Coffee, Users, Briefcase, Home,
  Heart, CheckCircle2, Star, Loader2, AlertCircle, BookmarkCheck,
  TrendingUp, Library, HelpCircle, Check, Quote
} from "lucide-react";
import Link from "next/link";
import { GENERAL_DISCLAIMER } from "@/lib/constants";

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
  { id: "WORSHIP", label: "عبادة", description: "السنن التعبدية والصلوات", icon: BookOpen },
  { id: "HABIT", label: "عادة", description: "العادات والآداب النبوية اليومية", icon: Clock },
  { id: "MANNERS", label: "أدب", description: "مكارم الأخلاق وحسن المعاملة", icon: Users },
  { id: "REMEMBRANCE", label: "أذكار", description: "الأذكار اليومية والأدعية الثابتة", icon: Sparkles },
  { id: "TRANSACTION", label: "معاملة", description: "سنن البيع والتعامل والحقوق", icon: Briefcase },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const catFilter = searchParams.get("cat");

  const [stats, setStats] = useState<any>({
    greeting: "أهلاً بك يا زائر",
    hijriDate: "",
    gregorianDate: "",
    completionPercentage: 0,
    todaySunnahs: 0,
    completedToday: 0,
    streak: 0,
    savedCount: 0,
    totalApplied: 0,
  });

  const [sunnahs, setSunnahs] = useState<SunnahItem[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(catFilter);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const hour = today.getHours();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // 1. Fetch dashboard stats
        const statsRes = await fetch("/api/dashboard");
        const statsData = await statsRes.json();
        if (statsData && !statsData.error) {
          setStats(statsData);
        }

        // 2. Fetch sunnah practices
        const sunnahsRes = await fetch("/api/sunnah");
        const sunnahsData = await sunnahsRes.json();
        if (sunnahsData.sunnahs) {
          setSunnahs(sunnahsData.sunnahs);
        }

        // 3. Fetch completed progress
        const progressRes = await fetch("/api/progress");
        const progressData = await progressRes.json();
        if (progressData.weekProgress) {
          const todayStr = new Date().toISOString().slice(0, 10);
          const todayCompleted = progressData.weekProgress
            .filter((p: any) => p.date.startsWith(todayStr) && p.completed)
            .map((p: any) => p.sunnahPracticeId);
          setCompleted(todayCompleted);
        }

        // 4. Fetch saved items
        const savedRes = await fetch("/api/saved");
        const savedData = await savedRes.json();
        if (savedData.items) {
          setSaved(savedData.items.map((i: any) => i.sunnahPracticeId).filter(Boolean));
        }
      } catch (err) {
        setError("فشل في تحميل بيانات لوحة التحكم، يرجى المحاولة لاحقاً.");
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

    // Optimistically update local stats
    const newCompletedToday = isDone ? Math.max(0, stats.completedToday - 1) : stats.completedToday + 1;
    const newTotalApplied = isDone ? Math.max(0, stats.totalApplied - 1) : stats.totalApplied + 1;
    const newPercent = stats.todaySunnahs > 0 ? Math.round((newCompletedToday / stats.todaySunnahs) * 100) : 0;

    setStats((prev: any) => ({
      ...prev,
      completedToday: newCompletedToday,
      totalApplied: newTotalApplied,
      completionPercentage: newPercent,
    }));

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sunnahPracticeId: id, completed: !isDone }),
      });
    } catch {
      // Revert if error
      setCompleted(completed);
    }
  };

  const toggleSave = async (id: string) => {
    const isSaved = saved.includes(id);
    const updated = isSaved ? saved.filter((s) => s !== id) : [...saved, id];
    setSaved(updated);

    // Optimistically update savedCount
    const newSavedCount = isSaved ? Math.max(0, stats.savedCount - 1) : stats.savedCount + 1;
    setStats((prev: any) => ({
      ...prev,
      savedCount: newSavedCount,
    }));

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

  const currentTimeSunnahs = useMemo(() => {
    if (hour < 6) return sunnahs.filter((s) => s.dayMoment === "BEFORE_SLEEP" || s.dayMoment === "NIGHT_WAKE");
    if (hour < 9) return sunnahs.filter((s) => s.dayMoment === "WAKE_UP" || s.dayMoment === "MORNING" || s.dayMoment === "WUDHU_PRAYER");
    if (hour < 12) return sunnahs.filter((s) => s.dayMoment === "MORNING" || s.dayMoment === "WUDHU_PRAYER");
    if (hour < 15) return sunnahs.filter((s) => s.dayMoment === "FOOD_DRINK" || s.dayMoment === "INTERACTION" || s.dayMoment === "WORK_STUDY");
    if (hour < 18) return sunnahs.filter((s) => s.dayMoment === "EVENING" || s.dayMoment === "FOOD_DRINK" || s.dayMoment === "LEAVING_HOME");
    if (hour < 21) return sunnahs.filter((s) => s.dayMoment === "EVENING" || s.dayMoment === "INTERACTION");
    return sunnahs.filter((s) => s.dayMoment === "BEFORE_SLEEP");
  }, [hour, sunnahs]);

  const filteredSunnahs = useMemo(() => {
    if (!selectedCategory) return currentTimeSunnahs.slice(0, 4);
    return sunnahs.filter((s) => s.category === selectedCategory);
  }, [selectedCategory, currentTimeSunnahs, sunnahs]);

  const quickActions = [
    { href: "/seerah", label: "السيرة والشمائل", icon: Sparkles, desc: "سيرة وشمائل النبي ﷺ" },
    { href: "/today", label: "يومي على السنة", icon: Clock, desc: "سنن يومك مرتبة" },
    { href: "/ask", label: "اسأل عن السنة", icon: Search, desc: "هل كان النبي ﷺ؟" },
    { href: "/library", label: "أقسام السنة", icon: BookOpen, desc: "جميع السنن والشروح" },
  ];

  const getTimeLabel = () => {
    if (hour < 6) return "قيام الليل والتهجد";
    if (hour < 9) return "الاستيقاظ والصباح";
    if (hour < 12) return "الضحى والعبادة";
    if (hour < 15) return "الطعام والتعامل";
    if (hour < 18) return "العصر والمساء";
    if (hour < 21) return "أذكار المساء";
    return "قبل النوم";
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">جاري تحميل لوحة التحكم الفاخرة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-12 text-center" dir="rtl">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-bold">خطأ في تحميل البيانات</h3>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
        <Button className="mt-4 gold-gradient text-white shadow-md rounded-xl" onClick={() => window.location.reload()}>إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">
      {/* Dynamic Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border gold-border p-6 bg-gradient-to-l from-emerald-950/20 via-transparent to-transparent backdrop-blur-sm"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent animate-pulse" />
              {stats.greeting || "أهلاً بك يا زائر"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground/60">
              {stats.gregorianDate || today.toLocaleDateString("ar-SA", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
          <Link
            href="/seerah"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl gold-gradient text-white text-sm font-bold shadow-md hover:gold-glow transition-all"
          >
            <Star className="h-4 w-4 fill-white" />
            السيرة النبوية والشمائل
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      {/* Quick Navigation Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="group border gold-border bg-white/70 dark:bg-card/45 backdrop-blur-sm transition-all duration-300 hover:gold-shadow hover:-translate-y-0.5 cursor-pointer h-full">
              <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl gold-gradient-soft dark:bg-accent/10 group-hover:scale-105 transition-transform">
                  <action.icon className="h-5 w-5 text-accent" />
                </div>
                <span className="text-sm font-bold">{action.label}</span>
                <span className="text-[11px] text-muted-foreground/60 line-clamp-1">{action.desc}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </motion.div>

      {/* 3-Column Premium Responsive Layout */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* Columns 1 & 2: Primary Content Area (col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Sunnah Now */}
          {!selectedCategory && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border gold-border bg-white/70 dark:bg-card/45 backdrop-blur-sm">
                <CardHeader className="pb-3 border-b gold-border bg-accent/5">
                  <CardTitle className="flex items-center gap-2 text-base font-bold text-accent">
                    <Clock className="h-5 w-5" />
                    سنة الآن | {getTimeLabel()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  {currentTimeSunnahs.length > 0 ? (
                    <div className="space-y-4">
                      {currentTimeSunnahs.slice(0, 3).map((item) => (
                        <div key={item.id} className="rounded-xl border gold-border p-4 bg-emerald-500/[0.02] dark:bg-accent/[0.02] hover:gold-shadow transition-all duration-300">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="emerald-badge text-[10px] px-2 py-0.5 font-bold">
                                  {item.evidenceStatus === "SAHIH" ? "ثابت وصحيح" : "حسن"}
                                </Badge>
                                <Badge variant="secondary" className="text-[10px] bg-secondary/80 text-muted-foreground">{item.difficulty === "easy" ? "سهل" : item.difficulty === "medium" ? "متوسط" : "صعب"}</Badge>
                                {item.estimatedTime && (
                                  <span className="text-[10px] text-muted-foreground/60">⏱️ {item.estimatedTime}</span>
                                )}
                              </div>
                              <h3 className="font-bold text-sm sm:text-base">{item.title}</h3>
                              <p className="text-xs sm:text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">{item.description}</p>
                              
                              {item.hadith && (
                                <p className="text-[11px] text-muted-foreground/50 italic font-medium">📖 المصدر: {item.hadith.sourceBook}</p>
                              )}
                              
                              <div className="flex gap-2 pt-2">
                                <Button
                                  size="sm"
                                  className={`text-xs gap-1 h-8 rounded-lg ${completed.includes(item.id) ? "bg-emerald-500 text-white hover:bg-emerald-600" : "gold-gradient text-white shadow-sm hover:gold-glow"}`}
                                  onClick={() => toggleComplete(item.id)}
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  {completed.includes(item.id) ? "✓ طبّقت" : "طبّقت"}
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs h-8 border-accent/20 text-accent rounded-lg" asChild>
                                  <Link href={`/library/${item.id}`}>
                                    عرض التفاصيل والشرح
                                  </Link>
                                </Button>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleSave(item.id)}
                              className={`shrink-0 p-1.5 rounded-lg transition-colors ${saved.includes(item.id) ? "text-red-500 bg-red-500/10" : "text-muted-foreground/30 hover:text-red-400 hover:bg-secondary/40"}`}
                            >
                              <Heart className={`h-4.5 w-4.5 ${saved.includes(item.id) ? "fill-red-500" : ""}`} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="text-center pt-2">
                        <Button variant="link" className="text-accent text-xs font-bold" asChild>
                          <Link href="/today">
                            تصفح جدول يومك بالكامل
                            <ArrowLeft className="mr-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-muted-foreground/60 text-center py-8">
                      لا توجد سنن محددة لهذا الوقت الشريف. تصفح جميع السنن في المكتبة.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Section: Categories */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="border gold-border bg-white/70 dark:bg-card/45 backdrop-blur-sm">
              <CardHeader className="pb-3 border-b gold-border bg-accent/5">
                <CardTitle className="flex items-center gap-2 text-base font-bold text-accent">
                  <BookOpen className="h-5 w-5" />
                  {selectedCategory ? `قسم: ${SUNNAH_CATEGORIES.find(c => c.id === selectedCategory)?.label || selectedCategory}` : "أقسام السنن المتاحة"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                {selectedCategory ? (
                  <div className="space-y-3">
                    {filteredSunnahs.map((item) => (
                      <SunnahCardItem
                        key={item.id}
                        item={item}
                        completed={completed.includes(item.id)}
                        saved={saved.includes(item.id)}
                        onToggle={toggleComplete}
                        onSave={toggleSave}
                      />
                    ))}
                    <div className="text-center pt-3">
                      <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSelectedCategory(null)}>
                        العودة لعرض جميع الأقسام
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {SUNNAH_CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className="group flex items-center gap-3 rounded-xl border gold-border bg-white/50 dark:bg-card/25 p-4 transition-all duration-200 hover:gold-shadow hover:-translate-y-0.5 text-right cursor-pointer"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gold-gradient-soft dark:bg-accent/10">
                            <Icon className="h-5 w-5 text-accent" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-sm group-hover:text-accent transition-colors">{cat.label}</h4>
                            <p className="text-[11px] text-muted-foreground/60 truncate">{cat.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Column 3: Sidebar Analytics & Daily Inspiration (col-span-1) */}
        <div className="space-y-6">
          
          {/* Today Achievement Circular Progress */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border gold-border bg-white/70 dark:bg-card/45 backdrop-blur-sm">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">إنجازك اليوم بالسنة</span>
                  <span className="text-sm font-bold text-accent">{stats.completionPercentage || 0}%</span>
                </div>
                <Progress value={stats.completionPercentage || 0} className="h-2.5 bg-amber-100 dark:bg-secondary rounded-full [&>div]:gold-gradient [&>div]:rounded-full" />
                <p className="text-[11px] text-muted-foreground/50">
                  لقد طبّقت اليوم {stats.completedToday || 0} سنة من أصل {stats.todaySunnahs || 0} سنة مقترحة.
                </p>
                
                <div className="flex items-center gap-3 pt-2 border-t gold-border mt-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl gold-gradient text-white shadow-sm">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-accent">{stats.totalApplied || 0}</p>
                    <p className="text-[10px] text-muted-foreground/60 leading-none">مجموع التطبيقات الكلية للسنن</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* New Section: Hadith of the Day (Daily Spiritual Inspiration) */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card className="border-2 border-accent bg-emerald-500/[0.02] dark:bg-accent/[0.02] backdrop-blur-sm relative overflow-hidden">
              <div className="absolute -top-3 -left-3 opacity-5 text-accent">
                <Quote className="h-16 w-16" />
              </div>
              <CardHeader className="pb-2 border-b gold-border bg-accent/5">
                <CardTitle className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-accent">
                  <Star className="h-4 w-4 fill-accent" />
                  الحديث الشريف اليومي
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-xs sm:text-sm leading-relaxed text-foreground font-semibold text-center" style={{ lineHeight: 2 }}>
                  «مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ»
                </p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground/50 border-t gold-border pt-2.5">
                  <span>صحيح مسلم</span>
                  <Badge variant="outline" className="text-[9px] px-1.5 border-emerald-500/30 text-emerald-500 font-bold bg-emerald-500/5">ثابت وصحيح</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Interactive Search */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border gold-border bg-white/70 dark:bg-card/45">
              <CardContent className="p-5 space-y-3">
                <h3 className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-foreground">
                  <Search className="h-4 w-4 text-accent" />
                  هل ثبت عن النبي ﷺ؟
                </h3>
                <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                  اكتب أي عبارة أو سؤال لتبحث في قاعدة البيانات الفقهية والمراجعة لدينا للتأكد من السنة الصحيحة.
                </p>
                <Button className="w-full gold-gradient text-white shadow-sm text-xs rounded-xl" asChild>
                  <Link href="/ask">
                    <Search className="h-3.5 w-3.5 ml-1 inline" />
                    ابحث الآن في الأسئلة
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Navigation Links */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <Card className="border gold-border bg-white/70 dark:bg-card/45">
              <CardContent className="p-4">
                <h3 className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-foreground mb-3">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  روابط سريعة للتنقل
                </h3>
                <div className="space-y-2.5">
                  {[
                    { href: "/seerah", label: "السيرة العطرة والشمائل النبوية", icon: Sparkles },
                    { href: "/timeline", label: "الجدول الزمني ليومك بالسنة", icon: Clock },
                    { href: "/sources", label: "مكتبة المصادر والكتب المعتمدة", icon: Library },
                  ].map((link) => (
                    <Link key={link.href} href={link.href} className="flex items-center gap-2 text-xs text-muted-foreground/75 hover:text-accent font-semibold transition-colors py-0.5">
                      <link.icon className="h-3.5 w-3.5 text-accent/70" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-[10px] text-muted-foreground/40 text-center pt-4">
        {GENERAL_DISCLAIMER}
      </motion.p>
    </div>
  );
}

function SunnahCardItem({
  item,
  completed,
  saved,
  onToggle,
  onSave
}: {
  item: SunnahItem;
  completed: boolean;
  saved: boolean;
  onToggle: (id: string) => void;
  onSave: (id: string) => void;
}) {
  return (
    <div className={`rounded-xl border p-4 transition-all duration-200 ${completed ? "border-emerald-300/40 bg-emerald-500/[0.02] dark:bg-emerald-500/5" : "border gold-border bg-white/50 dark:bg-card/25 hover:gold-shadow"}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge variant="outline" className="emerald-badge text-[9px] px-1.5 py-0 font-bold">{item.evidenceStatus === "SAHIH" ? "ثابت وصحيح" : "حسن"}</Badge>
            <Badge variant="secondary" className="text-[9px] bg-secondary/80 text-muted-foreground">{item.difficulty === "easy" ? "سهل" : "متوسط"}</Badge>
            {item.estimatedTime && (
              <span className="text-[9px] text-muted-foreground/50">{item.estimatedTime}</span>
            )}
          </div>
          <h4 className="font-bold text-sm">{item.title}</h4>
          <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
        </div>
        <button
          onClick={() => onSave(item.id)}
          className={`shrink-0 p-1.5 rounded-lg transition-colors ${saved ? "text-red-500 bg-red-500/5" : "text-muted-foreground/30 hover:text-red-400"}`}
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-red-500" : ""}`} />
        </button>
      </div>
      <div className="flex gap-2 mt-2">
        <Button size="sm" variant={completed ? "default" : "outline"}
          className={`h-8 text-xs gap-1 rounded-lg ${completed ? "bg-emerald-500 text-white" : "border-emerald-300/40 text-emerald-700 dark:text-emerald-400"}`}
          onClick={() => onToggle(item.id)}>
          <CheckCircle2 className="h-3.5 w-3.5" />
          {completed ? "✓ طبّقت" : "طبّقت"}
        </Button>
        <Button size="sm" variant="ghost" className="h-8 text-xs text-accent" asChild>
          <Link href={`/library/${item.id}`}>عرض الشرح الكامل</Link>
        </Button>
      </div>
    </div>
  );
}
