"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, AlertTriangle, Lightbulb, BookOpen,
  Quote, Loader2, Send, MessageSquare, Bot, User,
  ShieldCheck, AlertCircle, RefreshCw, CheckCircle2
} from "lucide-react";
import { DISCLAIMER } from "@/lib/constants";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  data?: {
    answerType: string;
    shortAnswer: string;
    detailedAnswer: string;
    explanation?: string;
    practicalApplication?: string;
    warning?: string;
    hadith?: {
      arabicText: string;
      sourceBook: string;
      grade: string;
      gradingSource?: string;
    };
  };
  submitted?: boolean;
}

const suggestions = [
  "هل كان النبي ﷺ ينام على جنبه الأيمن؟",
  "كيف كان النبي ﷺ يتعامل مع الغضب؟",
  "هل دعاء المذاكرة ثابت عن النبي ﷺ؟",
  "ما حكم التسمية قبل الطعام؟",
  "هل صلاة الضحى سنة؟",
  "هل كان النبي ﷺ يسلم على الأطفال؟"
];

function AskPageContent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async (q?: string) => {
    const question = (q || input).trim();
    if (!question || loading) return;

    const msgId = crypto.randomUUID();
    const userMsg: ChatMessage = {
      id: msgId,
      role: "user",
      content: question,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      if (res.ok && data.answer) {
        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer.shortAnswer,
          data: data.answer,
          submitted: !data.found, // If not found in DB, it was submitted as unanswered question
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: data.error || "عذراً، حدث خطأ أثناء المعالجة. يرجى المحاولة مرة أخرى.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="h-6 w-6 text-accent" />
          اسأل عن السنة
        </h1>
        <p className="text-sm text-muted-foreground/70 mt-1">
          اسأل عن أي سنة نبوية أو موقف في حياتك لتعرف ما ثبت وصحّ عن النبي ﷺ
        </p>
      </motion.div>

      {/* Chat Messages */}
      <div
        ref={scrollRef}
        className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-none"
      >
        {messages.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-base font-medium text-muted-foreground mb-2">
                  اسأل عن أي سنة نبوية
                </h3>
                <p className="text-sm text-muted-foreground/60 max-w-md">
                  اكتب سؤالك وسأبحث في المصادر الشرعية وقاعدة البيانات عن إجابة بدليلها
                </p>
              </CardContent>
            </Card>

            {/* Suggested Questions */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-secondary/50 px-3.5 py-1.5 text-xs transition-all duration-200 hover:border-accent/30 hover:bg-accent/5 hover:text-accent cursor-pointer text-right"
                >
                  <Sparkles className="h-3 w-3 text-accent" />
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                msg.role === "user" ? "gold-gradient text-white" : "bg-accent/10 text-accent"
              }`}>
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`flex-1 min-w-0 ${msg.role === "user" ? "text-left" : ""}`}>
                <div className={`rounded-2xl p-4 ${
                  msg.role === "user"
                    ? "gold-gradient text-white"
                    : "glass-card border border-border/50"
                }`}>
                  {msg.role === "assistant" && msg.data ? (
                    <div className="space-y-3">
                      {/* Short Answer */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
                        <p className="font-semibold text-foreground">{msg.data.shortAnswer}</p>
                        
                        <Badge variant="outline" className={`text-[10px] ${
                          msg.data.answerType === "YES_PROVEN" ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/5" :
                          msg.data.answerType === "HASAN_CHAIN" ? "text-green-500 border-green-500/30 bg-green-500/5" :
                          msg.data.answerType === "NOT_IN_DB" ? "text-amber-500 border-amber-500/30 bg-amber-500/5" :
                          "text-muted-foreground border-border/50"
                        }`}>
                          {msg.data.answerType === "YES_PROVEN" ? "ثابت وصحيح" :
                           msg.data.answerType === "HASAN_CHAIN" ? "حسن" :
                           msg.data.answerType === "NOT_IN_DB" ? "قيد المراجعة" : "أدب عام"}
                        </Badge>
                      </div>

                      {/* Detailed Answer */}
                      {msg.data.detailedAnswer && (
                        <p className="text-sm leading-relaxed text-muted-foreground">{msg.data.detailedAnswer}</p>
                      )}

                      {/* Hadith */}
                      {msg.data.hadith && (
                        <div className="flex items-start gap-2 pt-2 border-t gold-border mt-2">
                          <Quote className="h-4 w-4 shrink-0 mt-0.5 text-accent/70" />
                          <div className="space-y-1">
                            <p className="text-sm font-arabic font-medium leading-relaxed text-foreground/90">{msg.data.hadith.arabicText}</p>
                            <p className="text-xs text-muted-foreground/60">📖 {msg.data.hadith.sourceBook} {msg.data.hadith.grade && `| الدرجة: ${msg.data.hadith.grade === "SAHIH" ? "صحيح" : "حسن"}`}</p>
                          </div>
                        </div>
                      )}

                      {/* Explanation */}
                      {msg.data.explanation && (
                        <div className="flex items-start gap-2 pt-1">
                          <Lightbulb className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                          <p className="text-sm text-muted-foreground">{msg.data.explanation}</p>
                        </div>
                      )}

                      {/* Practical Application */}
                      {msg.data.practicalApplication && (
                        <div className="flex items-start gap-2 pt-1">
                          <BookOpen className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
                          <p className="text-sm text-muted-foreground">{msg.data.practicalApplication}</p>
                        </div>
                      )}

                      {/* Warning */}
                      {msg.data.warning && (
                        <div className="flex items-start gap-2 pt-1 p-3 rounded-xl bg-destructive/5 border border-destructive/20">
                          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-destructive" />
                          <p className="text-sm text-destructive/90">{msg.data.warning}</p>
                        </div>
                      )}

                      {/* Unanswered Question Saved Badge */}
                      {msg.submitted && (
                        <div className="flex items-center gap-1.5 pt-2 border-t gold-border text-amber-600 dark:text-amber-400 text-xs">
                          <CheckCircle2 className="h-4 w-4" />
                          تم إرسال هذا السؤال للمراجعة من قبل لجنة التدقيق والبحث.
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}

        {/* Loading */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Bot className="h-4 w-4" />
            </div>
            <div className="glass-card border-border/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري البحث في المصادر الشرعية وقاعدة البيانات...
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Disclaimer */}
      {messages.length > 0 && !loading && (
        <p className="text-[10px] text-muted-foreground/40 text-center">{DISCLAIMER}</p>
      )}

      {/* Input Form */}
      <div className="sticky bottom-0 pt-2 bg-background">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="مثال: هل كان النبي ﷺ ينام بعد العصر؟"
              className="w-full h-12 pr-4 pl-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm text-sm focus:outline-none focus:border-accent/30 focus:ring-1 focus:ring-accent/30 transition-all text-right"
              disabled={loading}
              dir="rtl"
            />
          </div>
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12 gold-gradient text-white rounded-xl shadow-sm shrink-0"
            disabled={loading || !input.trim()}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AskPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">جاري تحميل صفحة السؤال والبحث...</p>
        </div>
      </div>
    }>
      <AskPageContent />
    </Suspense>
  );
}
