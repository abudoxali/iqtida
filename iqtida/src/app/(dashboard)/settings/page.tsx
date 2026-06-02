"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Settings,
  Trash2, User, Mail, Check, Info, AlertTriangle,
  RefreshCw, Sparkles, Loader2, AlertCircle
} from "lucide-react";
import { BackButton } from "@/components/layout/back-button";
import { DISCLAIMER } from "@/lib/constants";

export default function SettingsPage() {
  const { data: session } = useSession();

  const [resetConfirm, setResetConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    completedToday: 0,
    totalApplied: 0,
    savedCount: 0,
    totalSunnahs: 20
  });



  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        // Fetch progress stats
        const progressRes = await fetch("/api/progress");
        const progressData = await progressRes.json();

        // Fetch dashboard statistics
        const dashboardRes = await fetch("/api/dashboard");
        const dashboardData = await dashboardRes.json();

        if (progressData && !progressData.error && dashboardData && !dashboardData.error) {
          setStats({
            completedToday: dashboardData.completedToday,
            totalApplied: dashboardData.totalApplied,
            savedCount: dashboardData.savedCount,
            totalSunnahs: dashboardData.todaySunnahs || 20
          });
        }
      } catch (err) {
        setError("حدث خطأ أثناء تحميل إعدادات التطبيق.");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const handleReset = async () => {
    // Clear user reflections stored in localStorage
    localStorage.removeItem("iqtidaa_reflections");
    setResetConfirm(true);
    setTimeout(() => setResetConfirm(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">جاري تحميل الإعدادات...</p>
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
    <div className="space-y-6 max-w-3xl mx-auto" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <BackButton href="/dashboard" />
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-accent" />
          الإعدادات
        </h1>
        <p className="text-sm text-muted-foreground/60">خصص تجربتك الفردية وتفضيلات المظهر في تطبيق اقتداء</p>
      </motion.div>





      {/* Statistics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3 border-b gold-border">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-accent" />
              أرقام إنجازاتك
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-xl bg-secondary/50 border border-border/50">
                <p className="text-2xl font-bold text-accent">{stats.totalApplied}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">سنن مطبّقة كلياً</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/50 border border-border/50">
                <p className="text-2xl font-bold text-red-500">{stats.savedCount}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">مفضلة ومحفوظة</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/50 border border-border/50">
                <p className="text-2xl font-bold text-emerald-500">{stats.completedToday}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">أنجزت اليوم</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/50 border border-border/50">
                <p className="text-2xl font-bold text-amber-500">{stats.totalSunnahs}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">سنن التطبيق المتاحة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reset Reflections */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="glass-card border-border/50 border-destructive/20">
          <CardHeader className="pb-3 border-b gold-border">
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <RefreshCw className="h-5 w-5" />
              إعادة تعيين خواطر المداومة
            </CardTitle>
            <CardDescription className="text-xs">
              مسح جميع التأملات والخواطر المدونة محلياً بجهازك
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {resetConfirm ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm">
                <Check className="h-5 w-5" />
                تم مسح الخواطر والبيانات المحلية بنجاح
              </div>
            ) : (
              <Button variant="destructive" size="sm" className="gap-2 rounded-xl" onClick={handleReset}>
                <Trash2 className="h-4 w-4" />
                إعادة تعيين البيانات المحلية
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* About */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3 border-b gold-border">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5 text-accent" />
              حول مشروع اقتداء / اقتداء
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-sm text-muted-foreground/75 leading-relaxed">
            <p>
              تطبيق <strong className="text-foreground">اقتداء</strong> هو رفيق إيماني وسلوكي يومي للمسلم المعاصر، مصمم لمساعدته على تطبيق السنن القولية والفعلية الثابتة عن نبينا محمد ﷺ خطوة بخطوة بطرق عملية وميسرة تناسب الحياة العصرية.
            </p>
            <p>
              يخضع كامل محتوى التطبيق لعملية تدقيق ومراجعة شرعية صارمة لضمان صحة الأسانيد وجودة الشروحات وصحتها الشرعية، تجنباً للأحاديث الضعيفة والموضوعة التي تنتشر دون تمحيص.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/40 border-t gold-border pt-3">
              <span>رقم الإصدار الحالي: 1.0.0 (إنتاج)</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* General Disclaimer */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card className="glass-card border-amber-500/20 bg-amber-50/30 dark:bg-amber-500/5">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-500" />
              <p className="text-xs leading-relaxed text-amber-700/80 dark:text-amber-300/70">
                {DISCLAIMER} المحتوى الشرعي المسجل يخضع للمراجعة والتحقق، ولا يمثل فتوى شخصية بأي حال من الأحوال.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
