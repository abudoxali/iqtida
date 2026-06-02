"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, Shield, CheckCircle2, AlertTriangle,
  Library, Quote,
} from "lucide-react";
import { BackButton } from "@/components/layout/back-button";

const sources = [
  {
    name: "صحيح البخاري",
    author: "الإمام محمد بن إسماعيل البخاري",
    description: "أصح كتاب بعد كتاب الله تعالى. جمع الإمام البخاري فيه الأحاديث الصحيحة على ترتيب أبواب الفقه.",
    hadithCount: "أكثر من 7000 حديث",
    grade: "صحيح",
    icon: "📖",
  },
  {
    name: "صحيح مسلم",
    author: "الإمام مسلم بن الحجاج النيسابوري",
    description: "أحد الصحيحين، جمع فيه الإمام مسلم الأحاديث الصحيحة واهتم بترتيبها وجودة أسانيدها.",
    hadithCount: "أكثر من 4000 حديث",
    grade: "صحيح",
    icon: "📖",
  },
  {
    name: "سنن أبي داود",
    author: "الإمام أبو داود سليمان بن الأشعث السجستاني",
    description: "جمع الأحاديث في الأحكام الفقهية، واهتم بالأحاديث التي استدل بها الفقهاء.",
    hadithCount: "أكثر من 4800 حديث",
    grade: "متنوع",
    icon: "📚",
  },
  {
    name: "جامع الترمذي",
    author: "الإمام محمد بن عيسى الترمذي",
    description: "جامع بين الرواية والدراية، ويذكر بعد كل حديث درجة صحته من الصحة والحسن والضعف.",
    hadithCount: "أكثر من 3900 حديث",
    grade: "متنوع",
    icon: "📚",
  },
  {
    name: "سنن النسائي",
    author: "الإمام أحمد بن شعيب النسائي",
    description: "يتميز بالتمييز بين الرواة وذكر العلل، وهو من أدق السنن في التصحيح.",
    hadithCount: "أكثر من 5700 حديث",
    grade: "متنوع",
    icon: "📚",
  },
  {
    name: "سنن ابن ماجه",
    author: "الإمام محمد بن يزيد ابن ماجه القزويني",
    description: "آخر كتب السنن الستة، يحتوي على أحاديث في الأحكام والزهد والفضائل.",
    hadithCount: "أكثر من 4300 حديث",
    grade: "متنوع",
    icon: "📚",
  },
  {
    name: "رياض الصالحين",
    author: "الإمام يحيى بن شرف النووي",
    description: "من أشهر كتب الحديث الموضوعية، جمع فيه الأحاديث الصحيحة في الترغيب والترهيب والآداب والأخلاق.",
    hadithCount: "أكثر من 1800 حديث",
    grade: "صحيح وحسن",
    icon: "📗",
  },
  {
    name: "الأذكار",
    author: "الإمام يحيى بن شرف النووي",
    description: "جمع الأذكار والأدعية الثابتة عن النبي ﷺ في مختلف المناسبات والأوقات.",
    hadithCount: "مئات الأذكار",
    grade: "صحيح وحسن",
    icon: "📗",
  },
];

const otherSources = [
  "مسند الإمام أحمد",
  "صحيح ابن حبان",
  "المستدرك على الصحيحين للحاكم",
  "سنن البيهقي",
  "مصنف ابن أبي شيبة",
  "الكتب الستة وغيرها من دواوين السنة",
];

export default function SourcesPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <BackButton href="/dashboard" />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Library className="h-6 w-6 text-accent" />
            المصادر
          </h1>
          <p className="text-sm text-muted-foreground/60">
            يعتمد تطبيق اقتداء على المصادر التالية في نقل الأحاديث والسنن
          </p>
        </div>
      </motion.div>

      {/* Main Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-2"
      >
        {sources.map((source, idx) => (
          <motion.div
            key={source.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
          >
            <Card className="glass-card border-border/50 h-full transition-all duration-200 hover:border-accent/30 hover:shadow-[0_0_20px_-5px] hover:shadow-accent/10">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gold-gradient-soft dark:bg-accent/10 text-2xl">
                    {source.icon}
                  </div>
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm">{source.name}</h3>
                      <Badge variant="outline" className="emerald-badge text-[10px]">
                        {source.grade}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground/70 line-clamp-2">{source.author}</p>
                    <p className="text-xs text-muted-foreground/60 leading-relaxed">{source.description}</p>
                    <p className="text-[10px] text-muted-foreground/40">{source.hadithCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Other Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 shrink-0 mt-0.5 text-accent" />
              <div className="space-y-3">
                <h2 className="font-semibold">مصادر أخرى</h2>
                <p className="text-sm text-muted-foreground/70">
                  بالإضافة إلى المصادر الرئيسية، يعتمد التطبيق على:
                </p>
                <div className="flex flex-wrap gap-2">
                  {otherSources.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* How we use sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 shrink-0 mt-0.5 text-accent" />
              <div className="space-y-3">
                <h2 className="font-semibold">كيف نستخدم المصادر؟</h2>
                <ul className="space-y-2 text-sm text-muted-foreground/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                    <span>نعتمد على الأحاديث الصحيحة والحسنة فقط في المحتوى الرئيسي</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                    <span>نذكر درجة الحديث (صحيح، حسن، ضعيف) عند كل سنة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                    <span>نذكر المصدر ورقم الحديث إن أمكن</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                    <span>لا ننسب للنبي ﷺ ما لم يثبت عنه</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass-card border-amber-500/20 bg-amber-50/30 dark:bg-amber-500/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-500" />
              <div className="space-y-2">
                <h2 className="font-semibold text-amber-700 dark:text-amber-400">تنبيه مهم</h2>
                <p className="text-sm text-muted-foreground/70 leading-relaxed">
                  هذا التطبيق تعليمي يهدف إلى نشر العلم الشرعي الموثوق. جميع المعلومات مبنية على
                  المصادر المتاحة في قاعدة البيانات، ولا يُغني عن سؤال أهل العلم الموثوقين في
                  المسائل الفقهية المعقدة والشخصية. إذا وجدت خطأً في أي معلومة، نرجو إبلاغنا
                  لتصحيحه.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Verse */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="text-center py-6"
      >
        <Quote className="h-8 w-8 text-accent/30 mx-auto mb-3" />
        <p className="text-lg sm:text-xl leading-[2] text-foreground/80 font-bold">
          ﴿ فَلِلَّهِ الْحَمْدُ رَبِّ السَّمَاوَاتِ وَرَبِّ الْأَرْضِ رَبِّ الْعَالَمِينَ ﴾
        </p>
        <p className="text-xs text-muted-foreground/50 mt-2">سورة الجاثية: ٣٦</p>
      </motion.div>
    </div>
  );
}
