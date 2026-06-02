"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Shield,
  Quote,
  Lightbulb,
  AlertTriangle,
  Loader2,
  ScrollText,
  BookOpen,
  AlertCircle,
  ShieldQuestion,
  Scale,
  FlaskConical,
} from "lucide-react";
import { DISCLAIMER, HADITH_GRADE_LABELS } from "@/lib/constants";

type GradeKey = keyof typeof HADITH_GRADE_LABELS;

interface HadithData {
  id: string;
  arabicText: string;
  sourceBook: string;
  sourceChapter?: string;
  hadithNumber?: string;
  grade: GradeKey;
  gradingSource?: string;
  explanation?: string;
  notes?: string;
  tags?: string;
}

const exampleQueries = [
  "سم الله وكل بيمينك",
  "تبسمك في وجه أخيك صدقة",
  "أفشوا السلام بينكم",
  "من كظم غيظًا"
];

export default function VerifyPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HadithData[]>([]);
  const [noResult, setNoResult] = useState(false);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setLoading(true);
    setSearched(true);
    setNoResult(false);
    setError(null);
    setResults([]);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      const data = await res.json();

      if (res.ok && data.found) {
        setResults(data.hadiths);
        setNoResult(false);
      } else {
        setResults([]);
        setNoResult(true);
      }
    } catch {
      setError("حدث خطأ أثناء الاتصال بالخادم للتحقق من صحة الحديث.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  const gradeConfig = (grade: GradeKey) => HADITH_GRADE_LABELS[grade] ?? HADITH_GRADE_LABELS.UNVERIFIED;

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-accent" />
          التحقق من صحة حديث
        </h1>
        <p className="text-sm text-muted-foreground">
          أدخل نص الحديث الشريف أو كلمات منه للتحقق من درجة صحته ومصدره المعتمد
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="مثال: يا غلام سم الله..."
                  className="h-14 pr-12 text-lg rounded-xl border-border/50 bg-background/50 text-right"
                  dir="rtl"
                />
              </div>
              <Button type="submit" size="lg" className="w-full gap-2 gold-gradient text-white shadow-md">
                <Shield className="h-5 w-5" />
                تحقق من صحة الحديث
              </Button>
            </form>

            <div className="mt-6 flex flex-wrap gap-2">
              {exampleQueries.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setQuery(q);
                    search(q);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-secondary/50 px-3.5 py-1.5 text-xs transition-all duration-200 hover:border-accent/30 hover:bg-accent/5 hover:text-accent cursor-pointer"
                >
                  <FlaskConical className="h-3 w-3 text-accent" />
                  {q}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence mode="wait">
        {!searched && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="glass-card border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <ShieldQuestion className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  أدخل نص الحديث للتحقق من صحته
                </h3>
                <p className="text-sm text-muted-foreground/60 max-w-md">
                  نميز لك بين الصحيح والضعيف والموضوع بناءً على أحكام أئمة الحديث المعتمدين والمصادر المسندة
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="glass-card border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-accent mb-4" />
                <p className="text-muted-foreground">جاري البحث ومطابقة الحديث في قاعدة البيانات...</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="glass-card border-destructive/20 bg-destructive/5 py-8 text-center text-destructive">
              <CardContent>
                <AlertCircle className="h-10 w-10 mx-auto mb-2 text-destructive" />
                <p className="font-bold">فشل الاتصال</p>
                <p className="text-xs text-muted-foreground mt-1">{error}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {noResult && !loading && !error && (
          <motion.div
            key="no-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="glass-card border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle className="h-16 w-16 text-amber-400/50 mb-4" />
                <h3 className="text-lg font-medium text-amber-500 mb-2">
                  لم نجد هذا النص في قاعدة البيانات الحالية
                </h3>
                <p className="text-sm text-muted-foreground/60 max-w-md leading-relaxed">
                  تأكد من كتابة الكلمات بشكل صحيح أو حاول البحث بعبارة أخصر. تم حفظ طلب المراجعة للتأكد من الحديث وإضافته لاحقاً.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {results.length > 0 && !loading && (
          <div className="space-y-6">
            {results.map((hadith, index) => (
              <motion.div
                key={hadith.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
                className="space-y-4"
              >
                {/* Hadith Container */}
                <Card className="glass-card border-border/50 overflow-hidden">
                  <div className="p-6 border-b gold-border bg-gradient-to-l from-amber-50/50 to-transparent dark:from-accent/5">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl gold-gradient-soft dark:bg-accent/10">
                        <Scale className="h-6 w-6 text-accent" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-muted-foreground">درجة صحة الحديث</p>
                        <Badge
                          variant="outline"
                          className={`text-xs px-3 py-0.5 ${gradeConfig(hadith.grade).color} border-current/30`}
                        >
                          {gradeConfig(hadith.grade).label}
                        </Badge>
                      </div>
                      {hadith.gradingSource && (
                        <div className="mr-auto text-xs text-muted-foreground/70">
                          بناءً على: <span className="font-semibold text-foreground">{hadith.gradingSource}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    {/* Hadith Text */}
                    <div className="flex items-start gap-3">
                      <Quote className="h-5 w-5 shrink-0 mt-1 text-accent" />
                      <div className="space-y-2 flex-1">
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                          <ScrollText className="h-4 w-4 text-accent" />
                          نص الحديث النبوي
                        </h3>
                        <p className="text-base font-arabic font-medium leading-loose text-foreground/90 bg-amber-50/20 dark:bg-card/20 p-4 rounded-xl border gold-border">
                          {hadith.arabicText}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground/60 flex-wrap gap-2 pt-1">
                          <span>كتاب: {hadith.sourceBook || "غير محدد"}</span>
                          {hadith.hadithNumber && (
                            <span>رقم الحديث: {hadith.hadithNumber}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Explanation */}
                    {hadith.explanation && (
                      <div className="flex items-start gap-3 pt-3 border-t gold-border mt-3">
                        <Lightbulb className="h-5 w-5 shrink-0 mt-0.5 text-amber-400" />
                        <div className="space-y-1">
                          <h3 className="font-semibold text-sm">الشرح والتوضيح الفقهي</h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {hadith.explanation}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {hadith.tags && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-2">
                        {hadith.tags.split(",").map((t) => (
                          <Badge key={t} variant="secondary" className="text-[10px] px-2 py-0">
                            #{t.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Disclaimer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-muted-foreground/50 text-center px-4"
            >
              {DISCLAIMER}
            </motion.p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
