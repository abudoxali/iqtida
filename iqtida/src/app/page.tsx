"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  BookOpen, Search, Clock, Sparkles, TrendingUp,
  ArrowLeft, CheckCircle2, Star, Heart,
} from "lucide-react";
import Link from "next/link";
import { SUNNAH_CATEGORIES } from "@/lib/sunnah-data";


const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
const stagger = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

export default function LandingPage() {


  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Top Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 border-b gold-border bg-white/90 dark:bg-background/90 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold gold-text">اقتداء</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button size="sm" className="gold-gradient text-white shadow-md gold-shadow hover:gold-glow transition-all rounded-xl" asChild>
              <Link href="/dashboard">دخول التطبيق</Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* === HERO === */}
      <section className="relative overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
        <div className="absolute inset-0 islamic-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp}>
              <Badge variant="outline" className="mb-6 border-accent/30 text-accent bg-accent/5 px-5 py-2 text-sm rounded-full">
                <Sparkles className="h-4 w-4 ml-2 inline" />
                اتبع هدي النبي ﷺ في يومك خطوة بخطوة
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeUp} className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="gold-text">اقتداء</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mb-3 text-lg text-muted-foreground sm:text-xl font-medium">
              يومك على هدي النبي ﷺ
            </motion.p>

            <motion.p variants={fadeUp} className="mx-auto mb-10 max-w-xl text-sm text-muted-foreground/70 leading-relaxed">
              تعرّف على ما ثبت عن رسول الله ﷺ في مواقف يومك،
              وطبّق السنن الصحيحة خطوة بخطوة مع الدليل والمصدر.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto gap-2 gold-gradient text-white shadow-lg gold-shadow hover:gold-glow transition-all text-base px-8 py-6" asChild>
                <Link href="/dashboard">
                  ابدأ يومك على السنة
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-accent/30 text-accent hover:bg-accent/5 text-base px-8 py-6" asChild>
                <Link href="/ask">
                  <Search className="h-5 w-5" />
                  اسأل عن السنة
                </Link>
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              {["مصادر موثقة", "درجات ثبوت", "تطبيق عملي", "خطوة بخطوة"].map((text) => (
                <span key={text} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {text}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* === CATEGORIES === */}
      <section className="py-20 bg-gradient-to-b from-amber-50/40 to-white dark:from-secondary/20 dark:to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-12 text-center"
          >
            <motion.h2 variants={fadeUp} className="mb-4 text-3xl font-bold">
              أقسام <span className="gold-text">السنة</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground/70 max-w-lg mx-auto">
              اختر القسم الذي تريد لترى السنن الثابتة مع الأدلة
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {SUNNAH_CATEGORIES.slice(0, 8).map((cat) => (
              <motion.div key={cat.id} variants={fadeUp}>
                <Link href={`/dashboard?cat=${cat.id}`}>
                  <Card className="group h-full border gold-border bg-white/80 dark:bg-card/60 backdrop-blur-sm transition-all duration-300 hover:gold-shadow hover:-translate-y-1 cursor-pointer">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl gold-gradient-soft dark:bg-accent/10">
                        <Sparkles className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="mb-1 text-base font-bold">{cat.label}</h3>
                      <p className="text-xs text-muted-foreground/70 line-clamp-2">{cat.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 text-center">
            <Button variant="outline" className="border-accent/30 text-accent" asChild>
              <Link href="/dashboard">
                عرض جميع الأقسام
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-16 text-center"
          >
            <motion.h2 variants={fadeUp} className="mb-4 text-3xl font-bold">
              كيف يعمل <span className="gold-text">اقتداء</span>؟
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid gap-6 md:grid-cols-3"
          >
            {[
              { icon: Clock, title: "اختر وقتك", desc: "اختر الوقت الحالي من يومك: استيقاظ، طعام، نوم، وغيرها" },
              { icon: BookOpen, title: "تعرف على السنة", desc: "شاهد ما ثبت عن النبي ﷺ في هذا الموقف مع الدليل والمصدر" },
              { icon: Heart, title: "طبّق واحتسب", desc: "طبّق السنة خطوة بخطوة، واحتسب الأجر، وسجّل تقدمك" },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeUp}>
                <Card className="group h-full border gold-border bg-white/80 dark:bg-card/60 backdrop-blur-sm transition-all duration-300 hover:gold-shadow hover:-translate-y-1">
                  <CardContent className="flex flex-col items-center p-8 text-center">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl gold-gradient-soft dark:bg-accent/10">
                      <item.icon className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="mb-3 text-lg font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground/70 leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === QURAN === */}
      <section className="py-24 bg-gradient-to-b from-amber-50/30 to-white dark:from-secondary/10 dark:to-background">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full gold-gradient text-white mb-6 shadow-lg">
                <Star className="h-6 w-6" />
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl leading-[2] text-foreground/85 font-bold" style={{ lineHeight: 2 }}>
                لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ
              </p>
              <p className="mt-4 text-muted-foreground/60">سورة الأحزاب: ٢١</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* === FEATURES === */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-16 text-center"
          >
            <motion.h2 variants={fadeUp} className="mb-4 text-3xl font-bold">
              ميزات <span className="gold-text">التطبيق</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { icon: Clock, title: "الجدول الزمني", desc: "سنن يومك من الاستيقاظ إلى النوم مرتبة ومنظمة" },
              { icon: Search, title: "اسأل عن السنة", desc: "هل كان النبي ﷺ يفعل كذا؟ جواب بدقيق ومصدر" },
              { icon: BookOpen, title: "مكتبة السنن", desc: "مكتبة متكاملة للسنن الثابتة مع أدلتها وشروحها" },
              { icon: TrendingUp, title: "تقدّمك", desc: "تتبع رحلتك في تطبيق السنة يوماً بعد يوم" },
              { icon: Sparkles, title: "سنن مهجورة", desc: "أحْيِ سنناً يغفل عنها الكثيرون في زمن الغفلة" },
              { icon: Heart, title: "المفضلة", desc: "احفظ السنن التي تهمك لترجع إليها لاحقاً" },
            ].map((feat) => (
              <motion.div key={feat.title} variants={fadeUp}>
                <Card className="group h-full border gold-border bg-white/70 dark:bg-card/40 backdrop-blur-sm transition-all duration-300 hover:gold-shadow hover:-translate-y-0.5 cursor-default">
                  <CardContent className="flex items-start gap-5 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gold-gradient-soft dark:bg-accent/10">
                      <feat.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base">{feat.title}</h3>
                      <p className="text-sm text-muted-foreground/70 leading-relaxed">{feat.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === DISCLAIMER === */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-2xl border gold-border bg-gradient-to-br from-amber-50/80 to-white dark:from-amber-500/5 dark:to-background p-6 sm:p-8 text-center">
            <p className="text-sm leading-relaxed text-amber-700/80 dark:text-amber-300/70 max-w-lg mx-auto">
              <strong className="text-amber-800 dark:text-amber-300">تنبيه مهم:</strong> هذا التطبيق يعتمد على المصادر المتاحة في قاعدة بياناته.
              جميع الإجابات تعليمية وليست فتاوى شخصية. لا يُغني عن سؤال أهل العلم في المسائل الخاصة.
            </p>
          </div>
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="mb-4 text-3xl font-bold">
              ابدأ رحلتك مع <span className="gold-text">السنة</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-8 text-muted-foreground/70">
              اجعل كل يومك على هدي النبي ﷺ
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button size="lg" className="gap-2 gold-gradient text-white shadow-lg gold-shadow hover:gold-glow transition-all px-10 py-6 text-base" asChild>
                <Link href="/dashboard">
                  ابدأ الآن
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="border-t gold-border py-12">
        <div className="mx-auto max-w-7xl px-4 text-center space-y-4">
          <div className="text-2xl font-bold gold-text">اقتداء</div>
          <p className="text-sm text-muted-foreground/60">يومك على هدي النبي ﷺ</p>
          <div className="flex justify-center gap-8 text-sm text-muted-foreground/50">
            <Link href="/dashboard" className="hover:text-accent transition-colors">الرئيسية</Link>
            <Link href="/timeline" className="hover:text-accent transition-colors">يومي على السنة</Link>
            <Link href="/ask" className="hover:text-accent transition-colors">اسأل عن السنة</Link>
            <Link href="/library" className="hover:text-accent transition-colors">أقسام السنة</Link>
            <Link href="/sources" className="hover:text-accent transition-colors">المصادر</Link>
          </div>
          <p className="text-xs text-muted-foreground/40 pt-4">
            نسأل الله أن يرزقنا الإخلاص والاتباع
          </p>
        </div>
      </footer>
    </div>
  );
}
