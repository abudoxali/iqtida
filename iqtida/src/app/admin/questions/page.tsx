"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BackButton } from "@/components/layout/back-button";
import {
  Search,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Loader2,
  AlertCircle,
  Edit2,
  FileText,
  User
} from "lucide-react";

interface UnansweredQuestion {
  id: string;
  question: string;
  status: string;
  adminNotes?: string;
  suggestedSources?: string;
  createdAt: string;
  askedByUser?: {
    name?: string;
    email?: string;
  };
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "قيد المراجعة", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  ANSWERED: { label: "تمت الإجابة", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  IGNORED: { label: "تم التجاهل", color: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  NEEDS_SCHOLAR: { label: "بحاجة لمراجعة شرعية", color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<UnansweredQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeQuestion, setActiveQuestion] = useState<UnansweredQuestion | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/questions");
        const data = await res.json();
        if (res.ok && !data.error) {
          setQuestions(data.questions || []);
        } else {
          setError(data.error || "فشل تحميل الأسئلة. تأكد من امتلاكك الصلاحيات.");
        }
      } catch (err) {
        setError("حدث خطأ في الاتصال بالشبكة لطلب الأسئلة.");
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/questions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, adminNotes }),
      });
      const data = await res.json();
      if (res.ok && data.question) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: newStatus, adminNotes } : q))
        );
        setActiveQuestion(null);
        setAdminNotes("");
      } else {
        alert(data.error || "فشل تحديث حالة السؤال.");
      }
    } catch {
      alert("حدث خطأ أثناء إرسال طلب التعديل.");
    } finally {
      setUpdating(false);
    }
  };

  const filtered = useMemo(() => {
    return questions.filter((q) =>
      q.question.includes(search)
    );
  }, [questions, search]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">جاري تحميل الأسئلة الواردة للتدقيق...</p>
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
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <BackButton href="/admin" />
        <h1 className="text-2xl font-bold">مراجعة أسئلة المستخدمين</h1>
        <p className="text-sm text-muted-foreground mt-1">
          مراجعة الأسئلة التي لم يعثر المستخدمون على إجاباتها بقاعدة البيانات
        </p>
      </motion.div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ابحث في الأسئلة المعلقة..."
          className="pr-10 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Questions List */}
        <div className="md:col-span-2 space-y-3">
          <Card className="glass-card border-border/50">
            <CardContent className="p-0 divide-y divide-border/50">
              {filtered.map((q, i) => (
                <div
                  key={q.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 transition-colors ${
                    activeQuestion?.id === q.id ? "bg-accent/5" : "hover:bg-secondary/20"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm mb-1.5 leading-relaxed">{q.question}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(q.createdAt).toLocaleDateString("ar-SA")}
                      </span>
                      {q.askedByUser && (
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {q.askedByUser.name || q.askedByUser.email}
                        </span>
                      )}
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-2 py-0 ${statusConfig[q.status]?.color || "bg-secondary text-muted-foreground"}`}
                      >
                        {statusConfig[q.status]?.label || q.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0 self-end sm:self-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1 border-accent/20 text-accent"
                      onClick={() => {
                        setActiveQuestion(q);
                        setAdminNotes(q.adminNotes || "");
                      }}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      مراجعة وإجراء
                    </Button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground text-sm">لا توجد أسئلة واردة حالياً</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Panel */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {activeQuestion ? (
              <motion.div
                key="action-active"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="border gold-border bg-white/80 dark:bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-3 border-b gold-border">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <FileText className="h-4.5 w-4.5 text-accent" />
                      إجراء المراجعة الشرعية
                    </CardTitle>
                    <CardDescription className="text-[10px] leading-relaxed mt-1">
                      {activeQuestion.question}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground">ملاحظات داخلية ومصادر مسندة</label>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="دون هنا أحكام المحدثين أو رقم الحديث والمصدر للرجوع إليه عند صياغة الجواب النهائي..."
                        className="min-h-32 text-xs rounded-xl"
                      />
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <Button
                        size="sm"
                        className="w-full bg-emerald-500 text-white hover:bg-emerald-600 gap-1.5"
                        disabled={updating}
                        onClick={() => handleUpdateStatus(activeQuestion.id, "ANSWERED")}
                      >
                        {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        تمت صياغة الجواب ونشره
                      </Button>
                      
                      <Button
                        size="sm"
                        className="w-full bg-red-500 text-white hover:bg-red-600 gap-1.5"
                        disabled={updating}
                        onClick={() => handleUpdateStatus(activeQuestion.id, "NEEDS_SCHOLAR")}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        تحتاج إحالة للعلماء
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full gap-1.5"
                        disabled={updating}
                        onClick={() => handleUpdateStatus(activeQuestion.id, "IGNORED")}
                      >
                        <XCircle className="h-4 w-4" />
                        تجاهل / مكرر
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full mt-2"
                        onClick={() => {
                          setActiveQuestion(null);
                          setAdminNotes("");
                        }}
                      >
                        إلغاء الإجراء
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="action-idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border border-dashed border-border/60 bg-transparent py-12 text-center text-muted-foreground/60 text-xs">
                  <CardContent>
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                    حدد سؤالاً من القائمة الجانبية لاتخاذ الإجراء الشرعي المناسب.
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
