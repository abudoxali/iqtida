"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ADMIN_NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import {
  BookOpen,
  ListChecks,
  MessageSquare,
  Library,
  TrendingUp,
  Users,
  Clock,
  AlertCircle,
  Loader2,
  Lock,
  Plus
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdminStats() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin");
        const data = await res.json();
        if (res.ok && !data.error) {
          setStats(data);
        } else {
          setError(data.error || "فشل تحميل لوحة الإدارة. تأكد من امتلاكك صلاحيات إدارية.");
        }
      } catch (err) {
        setError("حدث خطأ أثناء الاتصال بالنظام لطلب إحصاءات الإدارة.");
      } finally {
        setLoading(false);
      }
    }

    loadAdminStats();
  }, []);

  const statsCards = [
    {
      label: "إجمالي الأحاديث",
      value: stats?.totalHadiths ?? 0,
      change: "مسجلة بقاعدة البيانات",
      icon: BookOpen,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "إجمالي السنن",
      value: stats?.totalSunnahs ?? 0,
      change: "سنة وممارسة معرفة",
      icon: ListChecks,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "بانتظار المراجعة والتدقيق",
      value: stats?.pendingReviews ?? 0,
      change: "مواد تتطلب موافقة بشرية",
      icon: Lock,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "أسئلة معلقة لم يُجب عنها",
      value: stats?.unansweredQuestions ?? 0,
      change: "سؤال مستخدم بانتظار الإجابة",
      icon: MessageSquare,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  const quickActions = ADMIN_NAV_ITEMS.slice(1).map((item) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      BookOpen,
      ListChecks,
      MessageSquare,
      Library,
    };
    const Icon = iconMap[item.icon];
    return { ...item, icon: Icon };
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">جاري تحميل لوحة الإدارة والرقابة الشرعية...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-12 text-center" dir="rtl">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-bold">غير مصرح بالدخول أو خطأ بالنظام</h3>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
        <Button className="mt-4 gold-gradient text-white" onClick={() => window.location.reload()}>إعادة المحاولة</Button>
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
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-accent" />
          نظام الإدارة والرقابة الشرعية
        </h1>
        <p className="text-sm text-muted-foreground">
          إدارة وتدقيق المحتوى وضمان السلامة الدينية والأمنية لتطبيق اقتداء
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statsCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
          >
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground/60">{stat.change}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-border/50 h-full">
            <CardHeader className="border-b gold-border pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Users className="h-5 w-5 text-accent" />
                إجراءات إدارية سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.href} href={action.href}>
                      <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/50 p-4 transition-all duration-200 hover:border-accent/30 hover:bg-accent/5">
                        {Icon && (
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                            <Icon className="h-5 w-5 text-accent" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold">{action.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            تحديث وتحرير ومراجعة محتوى قسم {action.label}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity / Audit Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="glass-card border-border/50 h-full">
            <CardHeader className="border-b gold-border pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Clock className="h-5 w-5 text-accent" />
                سجل النشاط والتدقيق الإداري (Audit Logs)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {stats?.recentAuditLogs && stats.recentAuditLogs.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentAuditLogs.map((activity: any, idx: number) => {
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-xl border border-border/50 bg-secondary/50 p-3 text-right"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                          <Clock className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold text-foreground">{activity.action}</p>
                            <span className="text-[10px] text-muted-foreground/60">{new Date(activity.createdAt).toLocaleTimeString("ar-SA")}</span>
                          </div>
                          <p className="text-xs text-muted-foreground/80 mt-0.5">بواسطة: {activity.user?.name || activity.user?.email || "مدقق"}</p>
                          {activity.details && (
                            <p className="text-[10px] text-muted-foreground/60 truncate mt-1 bg-background/50 p-1.5 rounded">{activity.details}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm flex flex-col items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  لا توجد عمليات تدقيق أو تعديل مسجلة حالياً
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
