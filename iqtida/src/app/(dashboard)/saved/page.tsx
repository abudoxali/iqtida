"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Heart, Eye, Loader2, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { BackButton } from "@/components/layout/back-button";

interface SavedItem {
  id: string;
  type: string;
  sunnahPracticeId?: string;
  sunnahPractice?: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    estimatedTime?: string;
    evidenceStatus: string;
  };
}

export default function SavedPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    async function loadSaved() {
      try {
        setLoading(true);
        const res = await fetch("/api/saved");
        const data = await res.json();
        if (data.items) {
          setItems(data.items.filter((i: any) => i.type === "SUNNAH"));
        }
      } catch (err) {
        setError("فشل في تحميل السنن المحفوظة.");
      } finally {
        setLoading(false);
      }
    }

    loadSaved();
  }, []);

  const removeFavorite = async (id: string, practiceId: string) => {
    // Optimistic UI updates
    setItems((prev) => prev.filter((item) => item.id !== id));

    try {
      await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "SUNNAH", sunnahPracticeId: practiceId }),
      });
    } catch {
      // Re-fetch in case of failure
      const res = await fetch("/api/saved");
      const data = await res.json();
      if (data.items) {
        setItems(data.items.filter((i: any) => i.type === "SUNNAH"));
      }
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const practice = item.sunnahPractice;
      if (!practice) return false;
      if (activeTab === "all") return true;
      return practice.difficulty === activeTab;
    });
  }, [items, activeTab]);

  const tabCounts = useMemo(() => {
    return {
      all: items.length,
      easy: items.filter((i) => i.sunnahPractice?.difficulty === "easy").length,
      medium: items.filter((i) => i.sunnahPractice?.difficulty === "medium").length,
    };
  }, [items]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">جاري تحميل السنن المفضلة...</p>
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
    <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <BackButton href="/dashboard" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500 fill-red-500" />
              المفضلة
            </h1>
            <p className="text-sm text-muted-foreground/60">السنن والأذكار التي حفظتها لتطبيقها والرجوع إليها لاحقاً</p>
          </div>
          {items.length > 0 && (
            <span className="text-sm text-muted-foreground/60 border gold-border px-3 py-1.5 rounded-xl bg-white/60 dark:bg-card/50">
              {items.length} سنة محفوظة
            </span>
          )}
        </div>
      </motion.div>

      {items.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start h-auto gap-1 bg-secondary/50 p-1 rounded-xl overflow-x-auto">
              <TabsTrigger value="all" className="data-[state=active]:bg-background rounded-lg text-xs">
                الكل ({tabCounts.all})
              </TabsTrigger>
              <TabsTrigger value="easy" className="data-[state=active]:bg-background rounded-lg text-xs">
                سهل ({tabCounts.easy})
              </TabsTrigger>
              <TabsTrigger value="medium" className="data-[state=active]:bg-background rounded-lg text-xs">
                متوسط ({tabCounts.medium})
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value={activeTab} className="mt-4 space-y-3">
                  {filteredItems.length === 0 ? (
                    <EmptyState
                      icon={Heart}
                      title="لا توجد سنن في هذه الفئة"
                      description="يمكنك حفظ السنن التي تهمك بالنقر على زر القلب في المكتبة أو جدول اليوم."
                      actionLabel="تصفح المكتبة"
                      actionHref="/library"
                    />
                  ) : (
                    filteredItems.map((item, idx) => {
                      const practice = item.sunnahPractice;
                      if (!practice) return null;
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04 }}
                        >
                          <Card className="glass-card border-border/50 transition-all duration-200 hover:border-accent/20">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <Badge variant="outline" className="emerald-badge text-[10px]">
                                      {practice.evidenceStatus === "SAHIH" ? "ثابت وصحيح" : "حسن"}
                                    </Badge>
                                    <Badge variant="secondary" className="text-[10px]">
                                      {practice.difficulty === "easy" ? "سهل" : "متوسط"}
                                    </Badge>
                                    {practice.estimatedTime && (
                                      <span className="text-[10px] text-muted-foreground/50">{practice.estimatedTime}</span>
                                    )}
                                  </div>
                                  <h3 className="font-semibold text-sm">{practice.title}</h3>
                                  <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">{practice.description}</p>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                                    <Link href={`/library/${practice.id}`}>
                                      <Eye className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-red-400 hover:text-red-500"
                                    onClick={() => removeFavorite(item.id, practice.id)}
                                  >
                                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })
                  )}
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      )}

      {items.length === 0 && (
        <EmptyState
          icon={Heart}
          title="لم تحفظ أي سنة في المفضلة بعد"
          description="تصفح الأقسام واحفظ السنن التي تود تطبيقها والمحافظة عليها بنقر زر القلب."
          actionLabel="تصفح المكتبة"
          actionHref="/library"
        />
      )}
    </div>
  );
}
