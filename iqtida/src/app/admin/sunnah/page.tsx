"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BackButton } from "@/components/layout/back-button";
import {
  ListChecks,
  Search,
  Plus,
  Pencil,
  Trash2,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";
import { EVIDENCE_STATUS_LABELS, CATEGORY_LABELS, DAY_MOMENTS } from "@/lib/constants";

interface SunnahPractice {
  id: string;
  title: string;
  description: string;
  category: string;
  evidenceStatus: string;
  dayMoment: string;
  difficulty: string;
  estimatedTime?: string;
  hadithId?: string;
  reviewStatus: string;
  practicalSteps?: string;
  commonMistakes?: string;
  hadith?: {
    arabicText: string;
  };
}

interface Hadith {
  id: string;
  arabicText: string;
  sourceBook?: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "مسودة", color: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  PENDING_REVIEW: { label: "قيد المراجعة", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  APPROVED: { label: "مقبول", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  PUBLISHED: { label: "منشور علناً", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  ARCHIVED: { label: "مؤرشف", color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export default function AdminSunnahPage() {
  const [sunnahs, setSunnahs] = useState<SunnahPractice[]>([]);
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSunnah, setEditingSunnah] = useState<SunnahPractice | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      // Fetch Sunnah Practices
      const sunnahRes = await fetch("/api/admin/sunnah");
      const sunnahData = await sunnahRes.json();

      // Fetch Hadiths
      const hadithRes = await fetch("/api/admin/hadith");
      const hadithData = await hadithRes.json();

      if (sunnahRes.ok && !sunnahData.error && hadithRes.ok && !hadithData.error) {
        setSunnahs(sunnahData.sunnahs || []);
        setHadiths(hadithData.hadiths || []);
      } else {
        setError("فشل تحميل البيانات الإدارية.");
      }
    } catch {
      setError("حدث خطأ أثناء تحميل البيانات.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = sunnahs.filter((s) =>
    s.title.includes(searchQuery) || s.description.includes(searchQuery)
  );

  const openAdd = () => {
    setEditingSunnah({
      id: "",
      title: "",
      description: "",
      category: "HABIT",
      evidenceStatus: "SAHIH",
      dayMoment: "MORNING",
      difficulty: "easy",
      estimatedTime: "٥ دقائق",
      hadithId: undefined,
      reviewStatus: "DRAFT",
      practicalSteps: "",
      commonMistakes: "",
    });
    setIsDialogOpen(true);
  };

  const openEdit = (sunnah: SunnahPractice) => {
    setEditingSunnah({
      ...sunnah,
      hadithId: sunnah.hadithId || undefined,
    });
    setIsDialogOpen(true);
  };

  const deleteSunnah = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه السنة كلياً؟")) return;
    try {
      const res = await fetch("/api/admin/sunnah", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setSunnahs((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert("فشل حذف السنة.");
      }
    } catch {
      alert("حدث خطأ أثناء إرسال طلب الحذف.");
    }
  };

  const saveSunnah = async () => {
    if (!editingSunnah) return;
    setSaving(true);
    try {
      const isEdit = !!editingSunnah.id;
      const url = "/api/admin/sunnah";
      const method = isEdit ? "PUT" : "POST";
      
      const body = isEdit ? editingSunnah : {
        title: editingSunnah.title,
        description: editingSunnah.description,
        category: editingSunnah.category,
        evidenceStatus: editingSunnah.evidenceStatus,
        dayMoment: editingSunnah.dayMoment,
        difficulty: editingSunnah.difficulty,
        estimatedTime: editingSunnah.estimatedTime,
        hadithId: editingSunnah.hadithId || null,
        reviewStatus: editingSunnah.reviewStatus,
        practicalSteps: editingSunnah.practicalSteps,
        commonMistakes: editingSunnah.commonMistakes,
        published: editingSunnah.reviewStatus === "PUBLISHED"
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok && data.sunnah) {
        if (isEdit) {
          setSunnahs((prev) => prev.map((s) => (s.id === data.sunnah.id ? data.sunnah : s)));
        } else {
          setSunnahs((prev) => [data.sunnah, ...prev]);
        }
        setIsDialogOpen(false);
        setEditingSunnah(null);
      } else {
        alert(data.error || "حدث خطأ أثناء الحفظ.");
      }
    } catch {
      alert("فشل الاتصال بالخادم لحفظ التغييرات.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">جاري تحميل سجل السنن والممارسات اليومية...</p>
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
        <Button className="mt-4 gold-gradient text-white" onClick={() => window.location.reload()}>إعادة تحميل</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div className="space-y-1">
          <BackButton href="/admin" />
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-accent" />
            إدارة السنن والممارسات اليومية
          </h1>
          <p className="text-sm text-muted-foreground">
            إضافة وتعديل وحذف السنن النبوية المصنفة وربطها بالأدلة والأحاديث
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gold-gradient text-white shadow-md rounded-xl" onClick={openAdd}>
              <Plus className="h-4 w-4" />
              إضافة سنة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] text-right overflow-y-auto max-h-[85vh]" dir="rtl">
            <DialogHeader className="text-right">
              <DialogTitle>
                {editingSunnah?.id ? "تعديل السنة والممارسة" : "إدخال سنة نبوية جديدة"}
              </DialogTitle>
              <DialogDescription>
                أدخل تفاصيل السنة وصنفها زمنياً وفقهياً
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-right">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-muted-foreground">عنوان السنة</Label>
                <Input
                  value={editingSunnah?.title ?? ""}
                  onChange={(e) =>
                    setEditingSunnah((prev) =>
                      prev ? { ...prev, title: e.target.value } : null
                    )
                  }
                  placeholder="مثال: التسمية قبل الطعام"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-muted-foreground">الوصف القصير</Label>
                <textarea
                  value={editingSunnah?.description ?? ""}
                  onChange={(e) =>
                    setEditingSunnah((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    )
                  }
                  className="flex h-16 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-right"
                  placeholder="وصف مختصر لمشروعية وأثر السنة..."
                  dir="rtl"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-muted-foreground">القسم الفقهي</Label>
                  <Select
                    value={editingSunnah?.category ?? "HABIT"}
                    onValueChange={(value) =>
                      setEditingSunnah((prev) =>
                        prev ? { ...prev, category: value } : null
                      )
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-muted-foreground">درجة الدليل</Label>
                  <Select
                    value={editingSunnah?.evidenceStatus ?? "SAHIH"}
                    onValueChange={(value) =>
                      setEditingSunnah((prev) =>
                        prev ? { ...prev, evidenceStatus: value } : null
                      )
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EVIDENCE_STATUS_LABELS).map(([key, val]) => (
                        <SelectItem key={key} value={key}>
                          {val.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-muted-foreground">وقت اليوم المفضل</Label>
                  <Select
                    value={editingSunnah?.dayMoment ?? "MORNING"}
                    onValueChange={(value) =>
                      setEditingSunnah((prev) =>
                        prev ? { ...prev, dayMoment: value } : null
                      )
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DAY_MOMENTS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-muted-foreground">ربط حديث مسند كدليل</Label>
                  <Select
                    value={editingSunnah?.hadithId || "NONE"}
                    onValueChange={(value) =>
                      setEditingSunnah((prev) =>
                        prev ? { ...prev, hadithId: value === "NONE" ? undefined : value } : null
                      )
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="اختر الحديث المسند من قاعدة البيانات..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">بدون دليل مربوط</SelectItem>
                      {hadiths.map((h) => (
                        <SelectItem key={h.id} value={h.id}>
                          {h.arabicText.slice(0, 45)}... ({h.sourceBook})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-muted-foreground">صعوبة التطبيق</Label>
                  <Select
                    value={editingSunnah?.difficulty ?? "easy"}
                    onValueChange={(value) =>
                      setEditingSunnah((prev) =>
                        prev ? { ...prev, difficulty: value } : null
                      )
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">سهل</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="hard">صعب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-muted-foreground">الوقت التقريبي للتطبيق</Label>
                  <Input
                    value={editingSunnah?.estimatedTime ?? ""}
                    onChange={(e) =>
                      setEditingSunnah((prev) =>
                        prev ? { ...prev, estimatedTime: e.target.value } : null
                      )
                    }
                    placeholder="مثال: دقيقة واحدة"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <Label className="text-xs font-bold text-muted-foreground">حالة المراجعة والتدقيق الشرعي</Label>
                  <Select
                    value={editingSunnah?.reviewStatus ?? "DRAFT"}
                    onValueChange={(value) =>
                      setEditingSunnah((prev) =>
                        prev ? { ...prev, reviewStatus: value } : null
                      )
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([key, val]) => (
                        <SelectItem key={key} value={key}>
                          {val.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-muted-foreground">خطوات التطبيق العملي (كل خطوة بسطر منفصل)</Label>
                <textarea
                  value={editingSunnah?.practicalSteps ?? ""}
                  onChange={(e) =>
                    setEditingSunnah((prev) =>
                      prev ? { ...prev, practicalSteps: e.target.value } : null
                    )
                  }
                  className="flex h-20 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-right"
                  placeholder="1. قول بسم الله عند البدء بالوضوء&#10;2. المضمضة والاستنشاق..."
                  dir="rtl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-muted-foreground">تنبيهات وأخطاء شائعة (كل تنبيه بسطر منفصل)</Label>
                <textarea
                  value={editingSunnah?.commonMistakes ?? ""}
                  onChange={(e) =>
                    setEditingSunnah((prev) =>
                      prev ? { ...prev, commonMistakes: e.target.value } : null
                    )
                  }
                  className="flex h-16 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-right"
                  placeholder="النفخ والمضمضة بقوة تضر بالصحة..."
                  dir="rtl"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" className="rounded-xl" onClick={() => setIsDialogOpen(false)}>
                إلغاء
              </Button>
              <Button className="gold-gradient text-white rounded-xl" onClick={saveSunnah} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "حفظ الممارسة اليومية"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في السنن..."
                className="h-11 pr-11 rounded-xl border-border/50 bg-background/50"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="glass-card border-border/50">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/20 font-semibold text-muted-foreground">
                  <th className="text-right p-4">عنوان السنة والممارسة</th>
                  <th className="text-right p-4">القسم فقهياً</th>
                  <th className="text-right p-4">درجة الدليل</th>
                  <th className="text-right p-4">الميقات اليومي</th>
                  <th className="text-right p-4">حالة المراجعة</th>
                  <th className="text-left p-4">إجراءات الإدارة</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sunnah, idx) => {
                  const evidenceInfo = EVIDENCE_STATUS_LABELS[sunnah.evidenceStatus as keyof typeof EVIDENCE_STATUS_LABELS] || { label: sunnah.evidenceStatus, color: "text-muted-foreground" };
                  const categoryLabel = CATEGORY_LABELS[sunnah.category as keyof typeof CATEGORY_LABELS] || sunnah.category;
                  const momentLabel = DAY_MOMENTS[sunnah.dayMoment as keyof typeof DAY_MOMENTS] || sunnah.dayMoment;
                  const statusInfo = statusConfig[sunnah.reviewStatus] || statusConfig.DRAFT;
                  
                  return (
                    <motion.tr
                      key={sunnah.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="p-4 max-w-[280px]">
                        <p className="font-semibold text-sm">{sunnah.title}</p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5 line-clamp-1">{sunnah.description}</p>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="text-[11px]">
                          {categoryLabel}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={`text-[11px] ${evidenceInfo.color} border-current/20`}
                        >
                          {evidenceInfo.label}
                        </Badge>
                      </td>
                      <td className="p-4 text-xs font-semibold text-muted-foreground">{momentLabel}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={`text-[11px] px-2 py-0.5 border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 justify-start">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-accent hover:bg-accent/5"
                            onClick={() => openEdit(sunnah)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/5"
                            onClick={() => deleteSunnah(sunnah.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ListChecks className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  لا توجد ممارسات مطابقة
                </h3>
                <p className="text-sm text-muted-foreground/60">
                  لم نجد أي سنة معرفة تتطابق مع بحثك
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
