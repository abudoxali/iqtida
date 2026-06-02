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
import { BackButton } from "@/components/layout/back-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Search,
  Plus,
  Pencil,
  Trash2,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";
import { HADITH_GRADE_LABELS } from "@/lib/constants";

interface Hadith {
  id: string;
  arabicText: string;
  sourceBook?: string;
  sourceChapter?: string;
  hadithNumber?: string;
  grade: string;
  gradingSource?: string;
  explanation?: string;
  reviewStatus: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "مسودة", color: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  PENDING_REVIEW: { label: "قيد المراجعة", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  APPROVED: { label: "مقبول", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  PUBLISHED: { label: "منشور علناً", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  ARCHIVED: { label: "مؤرشف", color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export default function AdminHadithPage() {
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingHadith, setEditingHadith] = useState<Hadith | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadHadiths() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/hadith");
      const data = await res.json();
      if (res.ok && !data.error) {
        setHadiths(data.hadiths || []);
      } else {
        setError(data.error || "فشل تحميل الأحاديث.");
      }
    } catch {
      setError("حدث خطأ في الاتصال بالشبكة.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHadiths();
  }, []);

  const filtered = hadiths.filter((h) =>
    h.arabicText.includes(searchQuery) ||
    h.sourceBook?.includes(searchQuery) ||
    h.gradingSource?.includes(searchQuery)
  );

  const openAdd = () => {
    setEditingHadith({
      id: "",
      arabicText: "",
      sourceBook: "",
      sourceChapter: "",
      hadithNumber: "",
      grade: "SAHIH",
      gradingSource: "صحيح البخاري",
      explanation: "",
      reviewStatus: "DRAFT",
    });
    setIsDialogOpen(true);
  };

  const openEdit = (hadith: Hadith) => {
    setEditingHadith({ ...hadith });
    setIsDialogOpen(true);
  };

  const deleteHadith = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الحديث كلياً؟")) return;
    try {
      const res = await fetch("/api/admin/hadith", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setHadiths((prev) => prev.filter((h) => h.id !== id));
      } else {
        alert("فشل حذف الحديث.");
      }
    } catch {
      alert("حدث خطأ أثناء الحذف.");
    }
  };

  const saveHadith = async () => {
    if (!editingHadith) return;
    setSaving(true);
    try {
      const isEdit = !!editingHadith.id;
      const url = "/api/admin/hadith";
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit ? editingHadith : {
        arabicText: editingHadith.arabicText,
        sourceBook: editingHadith.sourceBook,
        sourceChapter: editingHadith.sourceChapter,
        hadithNumber: editingHadith.hadithNumber,
        grade: editingHadith.grade,
        gradingSource: editingHadith.gradingSource,
        explanation: editingHadith.explanation,
        reviewStatus: editingHadith.reviewStatus,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok && data.hadith) {
        if (isEdit) {
          setHadiths((prev) => prev.map((h) => (h.id === data.hadith.id ? data.hadith : h)));
        } else {
          setHadiths((prev) => [data.hadith, ...prev]);
        }
        setIsDialogOpen(false);
        setEditingHadith(null);
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
          <p className="text-muted-foreground">جاري تحميل سجل الأحاديث الشريفة...</p>
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
            <BookOpen className="h-6 w-6 text-accent" />
            إدارة الأحاديث الشريفة
          </h1>
          <p className="text-sm text-muted-foreground">
            إضافة وتعديل وضبط أسانيد الأحاديث النبوية بقاعدة البيانات
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gold-gradient text-white shadow-md rounded-xl" onClick={openAdd}>
              <Plus className="h-4 w-4" />
              إضافة حديث مسند
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] text-right" dir="rtl">
            <DialogHeader className="text-right">
              <DialogTitle>
                {editingHadith?.id ? "تعديل الحديث الشريف" : "إدخال حديث مسند جديد"}
              </DialogTitle>
              <DialogDescription>
                أدخل متن الحديث ومصدره ودرجة صحته بدقة متناهية
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-right">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">نص الحديث (العربي)</Label>
                <textarea
                  value={editingHadith?.arabicText ?? ""}
                  onChange={(e) =>
                    setEditingHadith((prev) =>
                      prev ? { ...prev, arabicText: e.target.value } : null
                    )
                  }
                  className="flex h-24 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-right font-arabic"
                  dir="rtl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground">كتاب الحديث المصدر</Label>
                  <Input
                    value={editingHadith?.sourceBook ?? ""}
                    onChange={(e) =>
                      setEditingHadith((prev) =>
                        prev ? { ...prev, sourceBook: e.target.value } : null
                      )
                    }
                    placeholder="مثال: صحيح البخاري"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground">الباب / الفصل</Label>
                  <Input
                    value={editingHadith?.sourceChapter ?? ""}
                    onChange={(e) =>
                      setEditingHadith((prev) =>
                        prev ? { ...prev, sourceChapter: e.target.value } : null
                      )
                    }
                    placeholder="مثال: كتاب الصلاة"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground">رقم الحديث</Label>
                  <Input
                    value={editingHadith?.hadithNumber ?? ""}
                    onChange={(e) =>
                      setEditingHadith((prev) =>
                        prev ? { ...prev, hadithNumber: e.target.value } : null
                      )
                    }
                    placeholder="مثال: 5376"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground">مصدر تخريج الحديث</Label>
                  <Input
                    value={editingHadith?.gradingSource ?? ""}
                    onChange={(e) =>
                      setEditingHadith((prev) =>
                        prev ? { ...prev, gradingSource: e.target.value } : null
                      )
                    }
                    placeholder="مثال: الألباني، متفق عليه"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground">درجة الصحة</Label>
                  <Select
                    value={editingHadith?.grade ?? "SAHIH"}
                    onValueChange={(value) =>
                      setEditingHadith((prev) =>
                        prev ? { ...prev, grade: value } : null
                      )
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(HADITH_GRADE_LABELS).map(([key, val]) => (
                        <SelectItem key={key} value={key}>
                          {val.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground">حالة المراجعة والنشر</Label>
                  <Select
                    value={editingHadith?.reviewStatus ?? "DRAFT"}
                    onValueChange={(value) =>
                      setEditingHadith((prev) =>
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
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">شرح وتوضيح الحديث</Label>
                <textarea
                  value={editingHadith?.explanation ?? ""}
                  onChange={(e) =>
                    setEditingHadith((prev) =>
                      prev ? { ...prev, explanation: e.target.value } : null
                    )
                  }
                  className="flex h-20 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-right"
                  placeholder="اكتب توضيح مبسط فقهي للحديث..."
                  dir="rtl"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" className="rounded-xl" onClick={() => setIsDialogOpen(false)}>
                إلغاء
              </Button>
              <Button className="gold-gradient text-white rounded-xl" onClick={saveHadith} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "حفظ الحديث"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search */}
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
                placeholder="ابحث في الأحاديث..."
                className="h-11 pr-11 rounded-xl border-border/50 bg-background/50"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Hadith Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="glass-card border-border/50">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/20">
                  <th className="text-right p-4 font-semibold text-muted-foreground">نص الحديث</th>
                  <th className="text-right p-4 font-semibold text-muted-foreground">الكتاب المصدر</th>
                  <th className="text-right p-4 font-semibold text-muted-foreground">رقم الحديث</th>
                  <th className="text-right p-4 font-semibold text-muted-foreground">الدرجة</th>
                  <th className="text-right p-4 font-semibold text-muted-foreground">حالة النشر</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((hadith, idx) => {
                  const gradeInfo = HADITH_GRADE_LABELS[hadith.grade as keyof typeof HADITH_GRADE_LABELS] || HADITH_GRADE_LABELS.UNVERIFIED;
                  const statusInfo = statusConfig[hadith.reviewStatus] || statusConfig.DRAFT;
                  return (
                    <motion.tr
                      key={hadith.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="p-4 max-w-[300px]">
                        <p className="truncate font-medium font-arabic text-base text-foreground/90">{hadith.arabicText}</p>
                        {hadith.sourceChapter && (
                          <p className="text-xs text-muted-foreground mt-0.5">{hadith.sourceChapter}</p>
                        )}
                      </td>
                      <td className="p-4 text-sm font-semibold text-muted-foreground/80">{hadith.sourceBook || "غير محدد"}</td>
                      <td className="p-4 text-sm text-muted-foreground">{hadith.hadithNumber || "-"}</td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={`text-[11px] ${gradeInfo.color} border-current/20`}
                        >
                          {gradeInfo.label}
                        </Badge>
                      </td>
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
                            onClick={() => openEdit(hadith)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/5"
                            onClick={() => deleteHadith(hadith.id)}
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
                <BookOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  لا توجد نتائج مطابقة
                </h3>
                <p className="text-sm text-muted-foreground/60">
                  لم نجد أي حديث يطابق معايير بحثك
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
