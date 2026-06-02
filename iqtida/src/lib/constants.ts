export const APP_NAME = "اقتداء";
export const APP_TAGLINE = "يومك على هدي النبي ﷺ";
export const APP_DESCRIPTION = "تطبيق يساعدك على معرفة ما ثبت عن النبي ﷺ في مواقف يومك، وتطبيق السنن الصحيحة خطوة بخطوة مع الدليل والمصدر.";

export const DAY_MOMENTS = {
  WAKE_UP: "عند الاستيقاظ",
  WUDHU_PRAYER: "الوضوء والصلاة",
  MORNING: "الصباح",
  LEAVING_HOME: "الخروج من المنزل",
  FOOD_DRINK: "الطعام والشراب",
  INTERACTION: "التعامل مع الناس",
  WORK_STUDY: "العمل أو الدراسة",
  ANGER_DISTRESS: "الغضب والضيق",
  EVENING: "المساء",
  BEFORE_SLEEP: "قبل النوم",
  NIGHT_WAKE: "الاستيقاظ أثناء الليل",
} as const;

export const EVIDENCE_STATUS_LABELS = {
  SAHIH: { label: "صحيح", color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-500/10" },
  HASAN: { label: "حسن", color: "text-green-600 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-500/10" },
  DAIF: { label: "ضعيف", color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-500/10" },
  NOT_PROVEN: { label: "لم يثبت", color: "text-red-600 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-500/10" },
  SCHOLARLY_DIFFERENCE: { label: "خلاف فقهي", color: "text-yellow-600 dark:text-yellow-400", bgColor: "bg-yellow-50 dark:bg-yellow-500/10" },
  CUSTOM: { label: "عادة", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-500/10" },
  HABIT: { label: "عادة", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-500/10" },
} as const;

export const CATEGORY_LABELS = {
  WORSHIP: "عبادة",
  HABIT: "عادة",
  MANNERS: "أدب",
  REMEMBRANCE: "ذكر",
  TRANSACTION: "معاملة",
} as const;

export const HADITH_GRADE_LABELS = {
  SAHIH: { label: "صحيح", color: "text-emerald-600 dark:text-emerald-400" },
  HASAN: { label: "حسن", color: "text-green-600 dark:text-green-400" },
  DAIF: { label: "ضعيف", color: "text-amber-600 dark:text-amber-400" },
  MAUDHU: { label: "موضوع", color: "text-red-600 dark:text-red-400" },
  NO_ORIGIN: { label: "لا أصل له", color: "text-red-600 dark:text-red-400" },
  UNVERIFIED: { label: "غير متوفر", color: "text-gray-500 dark:text-gray-400" },
} as const;

export const DIFFICULTY_LABELS = {
  easy: "سهل",
  medium: "متوسط",
  hard: "صعب",
} as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "الرئيسية", icon: "LayoutDashboard" },
  { href: "/seerah", label: "السيرة والشمائل", icon: "Sparkles" },
  { href: "/timeline", label: "يومي على السنة", icon: "Clock" },
  { href: "/ask", label: "اسأل عن السنة", icon: "Search" },
  { href: "/library", label: "أقسام السنة", icon: "BookOpen" },
  { href: "/saved", label: "المفضلة", icon: "Bookmark" },
  { href: "/sources", label: "المصادر", icon: "Library" },
  { href: "/progress", label: "تقدّمي", icon: "TrendingUp" },
  { href: "/settings", label: "الإعدادات", icon: "Settings" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "لوحة الإدارة", icon: "LayoutDashboard" },
  { href: "/admin/hadith", label: "الأحاديث", icon: "BookOpen" },
  { href: "/admin/sunnah", label: "السنن", icon: "ListChecks" },
  { href: "/admin/questions", label: "المراجعة", icon: "MessageSquare" },
  { href: "/admin/sources", label: "المصادر", icon: "Library" },
] as const;

export const DISCLAIMER = "هذه إجابة تعليمية مبنية على المصادر المتاحة داخل التطبيق وليست فتوى شخصية.";
export const GENERAL_DISCLAIMER = "المحتوى مبني على المصادر المتاحة داخل التطبيق، ولا يُغني عن سؤال أهل العلم في المسائل الشخصية.";

export const AI_SYSTEM_PROMPT = `You are an Islamic educational assistant. You must answer only using the provided retrieved sources. Do not use outside memory. If the sources do not contain the answer, say clearly that the app does not currently have verified evidence. Never fabricate hadiths, sources, or grades. Always include a disclaimer.`;

export const PROGRESS_LEVELS = [
  { min: 0, label: "مبتدئ" },
  { min: 10, label: "مواظب" },
  { min: 30, label: "ثابت" },
  { min: 60, label: "حريص" },
  { min: 100, label: "مقتدٍ" },
] as const;
