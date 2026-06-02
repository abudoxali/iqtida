"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, Sparkles, Clock, Heart, Award, ShieldAlert, 
  MapPin, HelpCircle, ChevronLeft, Calendar, UserCheck, Star 
} from "lucide-react";
import { GENERAL_DISCLAIMER } from "@/lib/constants";

// --- SEERAH DATA ---
const TIMELINE_EVENTS = [
  {
    year: "570 م",
    title: "المولد والنشأة الشريفة",
    location: "مكة المكرمة",
    description: "وُلِد النبي ﷺ يتيماً في شعب بني هاشم بمكة، في عام الفيل. مات أبوه عبد الله قبل مولده، ثم توفيت أمه آمنة بنت وهب وهو في السادسة من عمره، فكفله جده عبد المطلب ثم عمه أبو طالب.",
    icon: Calendar,
    details: "اشتهر ﷺ في شبابه بالصدق والأمانة حتى لقبه قومه بـ 'الصادق الأمين'، وعمل برعي الغنم ثم بالتجارة، وتزوج السيدة خديجة بنت خويلد رضي الله عنها وهو في الخامسة والعشرين من عمره."
  },
  {
    year: "610 م",
    title: "نزول الوحي والبعثة النبوية",
    location: "غار حراء - مكة",
    description: "نزل عليه الوحي بواسطة أمين الوحي جبريل عليه السلام وهو يتعبد في غار حراء في رمضان، وكان أول ما نزل عليه: 'اقرأ باسم ربك الذي خلق'.",
    icon: Sparkles,
    details: "بدأت الدعوة سراً لمدة ثلاث سنوات أسلم فيها الرعيل الأول (خديجة، وأبو بكر، وعلي رضي الله عنهم)، ثم جاء الأمر الإلهي بالجهر بالدعوة، فلقي النبي ﷺ وأصحابه الأذى الشديد من قريش وصبروا على ذلك."
  },
  {
    year: "622 م",
    title: "الهجرة النبوية المباركة",
    location: "من مكة إلى المدينة المنورة",
    description: "بعد اشتداد الأذى ومبايعة الأنصار في بيعتي العقبة، أذن الله للنبي ﷺ بالهجرة إلى يثرب (المدينة المنورة)، حيث هاجر مع صاحبه أبي بكر الصديق ودخلها وسط استقبال حافل.",
    icon: MapPin,
    details: "أسست الهجرة لعهد جديد؛ حيث آخى النبي ﷺ بين المهاجرين والأنصار، وكتب وثيقة المدينة المنورة لتنظيم العلاقة بين مختلف الطوائف، وبنى المسجد النبوي الشريف ليكون مركزاً للدولة الجديدة."
  },
  {
    year: "624 - 630 م",
    title: "الغزوات وبناء الدولة الإسلامية",
    location: "الجزيرة العربية",
    description: "قاد النبي ﷺ المسلمين في الدفاع عن وطنهم ودينهم الجديد في غزوات كبرى كـ غزوة بدر الكبرى (2 هـ)، وغزوة أحد (3 هـ)، وغزوة الأحزاب (5 هـ).",
    icon: Award,
    details: "تُوِّجت هذه المرحلة بصلح الحديبية (6 هـ) الذي مهد الطريق لنشر الإسلام عالمياً، ثم فتح مكة الأعظم (8 هـ) حيث دخلها النبي ﷺ متواضعاً عافياً عن خصومه قائلاً لهم: 'اذهبوا فأنتم الطلقاء'، مطهراً الكعبة المشرفة من الأصنام."
  },
  {
    year: "632 م",
    title: "حجة الوداع والوفاة",
    location: "عرفات والمدينة المنورة",
    description: "أدى النبي ﷺ حجة الوداع في العام العاشر للهجرة، وألقى خطبته الشهيرة المقررة لحقوق الإنسان والدماء والأعراض، وتوفي في المدينة المنورة في 12 ربيع الأول سنة 11 هـ.",
    icon: Heart,
    details: "توفي النبي ﷺ في حجرة السيدة عائشة رضي الله عنها ودفن فيها، بعد أن بلغ الرسالة، وأدى الأمانة، ونصح الأمة، وتركنا على المحجة البيضاء ليلها كنهارها لا يزيغ عنها إلا هالك."
  }
];

const SHAMAIL_DATA = {
  physical: [
    { title: "الوجه واللون", text: "كان ﷺ أزهر اللون (أبيض مُشرَب بحمرة)، وجهه مستدير كالشمس والقمر، يتلألأ نوراً وضياءً." },
    { title: "القامة والجسم", text: "كان ﷺ مربوع القامة (متوسط الطول لا بالطويل البائن ولا بالقصير)، ضخم الكفين والقدمين، عريض الكتفين." },
    { title: "العينان والشعر", text: "كان ﷺ أدعج العينين (شديد سواد العين مع بياضها)، طويل الأهداب، أسود الشعر شديد الجمال يبلغ شحمة أذنيه." },
    { title: "خاتم النبوة", text: "كان بين كتفيه خاتم النبوة، وهو قطعة لحم بارزة عليها شعر كبيضة الحمامة، تدل على بعثته ورسالته." }
  ],
  moral: [
    { title: "الرحمة واللين", text: "كان ﷺ أرحم الناس بالخلق، رفيقاً بالصغير والضعيف والحيوان، وصدق الله فيه: 'وما أرسلناك إلا رحمة للعالمين'." },
    { title: "التواضع الشديد", text: "كان ﷺ يخصف نعله، ويرقع ثوبه، ويخدم أهله، ويجالس الفقراء والمساكين ويجيب دعوتهم ويمشي في حاجتهم." },
    { title: "الجود والكرم", text: "كان ﷺ أجود الناس بالخير، يعطي عطاء من لا يخشى الفقر، ولا يُسأل شيئاً على الإسلام إلا أعطاه." },
    { title: "الحلم والصبر", text: "كان ﷺ لا يجزئ بالسيئة السيئة، ولكن يعفو ويصفح، ولا ينتقم لنفسه قط إلا أن تُنتهك حرمة من حرمات الله." }
  ],
  family: [
    { title: "النسب الشريف", text: "هو محمد بن عبد الله بن عبد المطلب بن هاشم بن عبد مناف، من قبيلة قريش العربية العريقة التي ينتهي نسبها لسيدنا إسماعيل بن إبراهيم عليهما السلام." },
    { title: "زوجاته ﷺ", text: "تزوج خديجة بنت خويلد (الأولى وأم أولاده عدا إبراهيم)، وسودة، وعائشة (البكر الوحيدة)، وحفصة، وزينب بنت خزيمة، وأم سلمة، وزينب بنت جحش، وجويرية، وأم حبيبة، وصفية، وميمونة رضي الله عنهن." },
    { title: "أولاده ﷺ", text: "أولاده الذكور: القاسم، عبد الله (الطيب الطاهر)، وإبراهيم. والإناث: فاطمة الزهراء (سيدة نساء أهل الجنة)، وزينب، ورقية، وأم كلثوم رضي الله عنهن. وكل أولاده توفوا في حياته إلا السيدة فاطمة توفيت بعده بـ 6 أشهر." }
  ]
};

const DAY_ROUTINE = [
  { time: "قبل الفجر (السَّحر)", activity: "التهجد ومناجاة الله", desc: "كان النبي ﷺ يستيقظ في الثلث الأخير من الليل، يستاك بمطهر الفم الشريف، ويتوضأ ثم يصلي طويلاً متهجداً لله تعالى، يقرأ في صلاته آيات القرآن ويتفكر في خلق السماوات والأرض، ويوتر قبل الفجر ثم يوقظ أهله." },
  { time: "الفجر والذكر", activity: "صلاة الفجر وجلسة الشروق", desc: "يصلي ركعتي الفجر الخفيفتين في بيته، ثم يخرج للمسجد النبوي ليؤم المسلمين في الفجر. بعد الصلاة كان ﷺ يستقبل المصلين ويجلس في مكانه يذكر الله ويدعو ويسبح حتى تطلع الشمس حسناء، ويتحدث مع أصحابه ويداعبهم ويسأل عن أحوالهم." },
  { time: "الضحى (الصباح)", activity: "صلاة الضحى وقضاء مصالح المسلمين", desc: "كان ﷺ يصلي صلاة الضحى ركعتين أو أربعاً أو يزيد، ثم يقف على أحوال المسلمين، يجيب سائلهم، ويحكم بينهم بالعدل، ويتفقد الفقراء وأهل الصفة، ويمشي في السوق يرشد التجار وينشر الرحمة والبركة في مجالسهم الشريفة." },
  { time: "الظهر والعصر (الظهيرة)", activity: "القيلولة وتفقد زوجاته", desc: "يقيل ﷺ قيلولة خفيفة استعانة على قيام الليل، ثم يصلي الظهر بالناس. بعد الظهر يدور على حجرات نسائه ﷺ كلهن واحدة واحدة يسأل عن أحوالهن، ويؤنسهن، ويصلي العصر بالناس ثم يجتمع مع نسائه في بيت من تكون نوبتها لتبادل الأحاديث وحل شؤون العائلة." },
  { time: "المغرب والعشاء (المساء)", activity: "التعليم العائلي والسمر الإيماني", desc: "يصلي المغرب ثم يتعشى مع أهله، ثم يؤدي صلاة العشاء بالناس في المسجد. بعد العشاء كان يكره النوم قبلها والحديث بعدها إلا في مصلحة المسلمين، فيسامر أصحابه الكبار كأبي بكر وعمر في شؤون الأمة، ثم يأوي لفراشه الشريف طاهراً متوضأً تالياً لأذكار النوم." }
];

export default function SeerahPage() {
  const [selectedEvent, setSelectedEvent] = useState<typeof TIMELINE_EVENTS[0] | null>(null);

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir="rtl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        className="text-center md:text-right space-y-2"
      >
        <div className="flex items-center justify-center md:justify-start gap-2 text-accent">
          <BookOpen className="h-6 w-6" />
          <h1 className="text-3xl font-bold text-foreground">السيرة النبوية والشمائل</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          نستعرض هنا صفحات عطرة من حياة المصطفى ونبي الرحمة محمد ﷺ، وسيرته المباركة التي أسست حضارة الإسلام، وشمائله الخَلْقية والخُلُقية الشريفة لتكون هداية ونوراً في حياتنا اليومية.
        </p>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-xl mx-auto md:mx-0 border gold-border rounded-xl p-1 bg-white/50 dark:bg-card/30 backdrop-blur-sm">
          <TabsTrigger value="timeline" className="rounded-lg py-2.5 text-sm font-bold transition-all data-[state=active]:gold-gradient data-[state=active]:text-white">
            السيرة العطرة
          </TabsTrigger>
          <TabsTrigger value="qualities" className="rounded-lg py-2.5 text-sm font-bold transition-all data-[state=active]:gold-gradient data-[state=active]:text-white">
            الشمائل الشريفة
          </TabsTrigger>
          <TabsTrigger value="routine" className="rounded-lg py-2.5 text-sm font-bold transition-all data-[state=active]:gold-gradient data-[state=active]:text-white">
            يوم في حياته ﷺ
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Timeline */}
        <TabsContent value="timeline" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Timeline Left: Steps */}
            <div className="md:col-span-2 space-y-4 relative pr-4 md:pr-6 before:absolute before:right-6 before:md:right-8 before:top-2 before:bottom-2 before:w-[2px] before:bg-accent/15">
              {TIMELINE_EVENTS.map((event, idx) => {
                const Icon = event.icon;
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    {/* Circle Node */}
                    <div className="absolute -right-6 md:-right-8 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-background border-2 border-accent/40 group-hover:border-accent transition-colors z-10">
                      <div className="h-2.5 w-2.5 rounded-full bg-accent/40 group-hover:bg-accent transition-all" />
                    </div>

                    <Card className="border gold-border bg-white/80 dark:bg-card/50 backdrop-blur-sm transition-all duration-300 hover:gold-shadow group-hover:-translate-y-0.5">
                      <CardContent className="p-5 flex gap-4 items-start">
                        <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gold-gradient-soft dark:bg-accent/10">
                          <Icon className="h-5 w-5 text-accent" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className="gold-gradient text-white text-[10px] px-2 py-0.5">{event.year}</Badge>
                            <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          </div>
                          <h3 className="font-bold text-base group-hover:text-accent transition-colors">{event.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">{event.description}</p>
                          
                          <div className="flex items-center gap-1 text-[11px] text-accent/80 font-semibold pt-1">
                            <span>عرض التفاصيل التاريخية</span>
                            <ChevronLeft className="h-3 w-3" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Timeline Right: Detail Card */}
            <div>
              <AnimatePresence mode="wait">
                {selectedEvent ? (
                  <motion.div
                    key={selectedEvent.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="border-2 border-accent bg-emerald-50/20 dark:bg-accent/5 backdrop-blur-sm sticky top-24">
                      <CardHeader className="border-b gold-border">
                        <div className="flex items-center justify-between">
                          <Badge className="gold-gradient text-white">{selectedEvent.year}</Badge>
                          <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-accent" />
                            {selectedEvent.location}
                          </span>
                        </div>
                        <CardTitle className="text-lg font-bold text-accent pt-2">{selectedEvent.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-muted-foreground/50">خلاصة المحطة التاريخية:</h4>
                          <p className="text-sm text-foreground/90 leading-relaxed font-medium">{selectedEvent.description}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-accent/50">تفاصيل شريفة وعِبر مستفادة:</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed bg-white/40 dark:bg-card/20 rounded-xl p-4 border gold-border">{selectedEvent.details}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="h-full hidden md:flex flex-col items-center justify-center text-center p-8 border-2 border-dashed gold-border rounded-2xl bg-white/20 dark:bg-card/10 backdrop-blur-sm sticky top-24 min-h-[400px]">
                    <div className="h-12 w-12 rounded-full gold-gradient-soft flex items-center justify-center mb-3">
                      <HelpCircle className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-bold text-sm">تفاصيل أحداث السيرة</h3>
                    <p className="text-xs text-muted-foreground max-w-xs mt-1">اضغط على أي مرحلة من مراحل السيرة النبوية على اليمين لقراءة التفاصيل التاريخية الكاملة والعِبر الإسلامية المستفادة منها.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Qualities */}
        <TabsContent value="qualities" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* 1. Physical */}
            <Card className="border gold-border bg-white/80 dark:bg-card/50 backdrop-blur-sm">
              <CardHeader className="border-b gold-border bg-accent/5">
                <CardTitle className="flex items-center gap-2 text-base font-bold text-accent">
                  <Star className="h-5 w-5 fill-accent" />
                  وصفه الخَلْقي ﷺ
                </CardTitle>
                <CardDescription className="text-xs">جمال هيئته النبوية المباركة</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {SHAMAIL_DATA.physical.map((item, idx) => (
                  <div key={idx} className="space-y-1 pb-3 last:pb-0 border-b gold-border last:border-b-0">
                    <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md">{item.title}</span>
                    <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pt-1">{item.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 2. Moral */}
            <Card className="border-2 border-accent bg-emerald-50/10 dark:bg-card/60 backdrop-blur-sm">
              <CardHeader className="border-b gold-border bg-accent/5">
                <CardTitle className="flex items-center gap-2 text-base font-bold text-accent">
                  <Heart className="h-5 w-5 fill-accent text-accent" />
                  وصفه الخُلُقي ﷺ
                </CardTitle>
                <CardDescription className="text-xs">عظمة أخلاقه ورحمته بالخلق</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {SHAMAIL_DATA.moral.map((item, idx) => (
                  <div key={idx} className="space-y-1 pb-3 last:pb-0 border-b gold-border last:border-b-0">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">{item.title}</span>
                    <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pt-1">{item.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 3. Family */}
            <Card className="border gold-border bg-white/80 dark:bg-card/50 backdrop-blur-sm">
              <CardHeader className="border-b gold-border bg-accent/5">
                <CardTitle className="flex items-center gap-2 text-base font-bold text-accent">
                  <UserCheck className="h-5 w-5" />
                  نسبه الشريف وأهله
                </CardTitle>
                <CardDescription className="text-xs">شجرة عائلته الكريمة وأمهات المؤمنين</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {SHAMAIL_DATA.family.map((item, idx) => (
                  <div key={idx} className="space-y-1 pb-3 last:pb-0 border-b gold-border last:border-b-0">
                    <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md">{item.title}</span>
                    <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pt-1">{item.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Routine */}
        <TabsContent value="routine" className="mt-6 space-y-4">
          <Card className="border gold-border bg-white/80 dark:bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b gold-border bg-accent/5">
              <div className="flex items-center gap-2 text-accent">
                <Clock className="h-5 w-5" />
                <CardTitle className="text-lg font-bold">جدول يوم النبي محمد ﷺ</CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm leading-relaxed">
                من خلال تتبع السنة النبوية، قسّم العلماء يوم النبي ﷺ إلى محطات إيمانية وتربوية واجتماعية، لنرى كيف كان ﷺ يوازن بين طاعة ربه، وقيادة أمته، وتفقد عائلته.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {DAY_ROUTINE.map((item, idx) => (
                <div key={idx} className="flex gap-4 md:gap-6 items-start pb-5 border-b gold-border last:border-b-0 last:pb-0">
                  {/* Left Column: Time badge */}
                  <div className="w-24 md:w-32 shrink-0">
                    <Badge variant="outline" className="gold-border text-accent font-bold text-xs sm:text-sm w-full text-center justify-center py-1 bg-accent/5">
                      {item.time}
                    </Badge>
                  </div>

                  {/* Right Column: Content */}
                  <div className="flex-1 space-y-1 min-w-0">
                    <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      {item.activity}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Disclaimer */}
      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.6 }}
        className="text-xs text-muted-foreground/40 text-center pt-4"
      >
        {GENERAL_DISCLAIMER}
      </motion.p>
    </div>
  );
}
