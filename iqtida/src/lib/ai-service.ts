interface AiAnswer {
  shortAnswer: string;
  hadithText: string;
  source: string;
  authenticity: string;
  explanation: string;
  practicalApplication: string;
  warning: string | null;
}

const localKnowledgeBase: Record<string, AiAnswer> = {
  "النوم على الشق الأيمن": {
    shortAnswer: "نعم، ثبت عن النبي ﷺ النوم على الشق الأيمن",
    hadithText: "عن البراء بن عازب رضي الله عنه قال: قال النبي ﷺ: «إذا أتيت مضجعك فتوضأ وضوءك للصلاة، ثم اضطجع على شقك الأيمن»",
    source: "متفق عليه: البخاري (247)، مسلم (2710)",
    authenticity: "صحيح",
    explanation: "ثبت عن النبي ﷺ أنه كان ينام على شقه الأيمن مستقبلًا القبلة. وهذه من السنن الثابتة في النوم.",
    practicalApplication: "عند النوم، استلق على جانبك الأيمن وضع خدك على يدك اليمنى، ويمكنك قراءة أذكار النوم.",
    warning: "هذه سنة مؤكدة وليست واجبة، فلا إثم على من نام على جنبه الأيسر أو ظهره.",
  },
  "دعاء الاستيقاظ": {
    shortAnswer: "نعم، كان النبي ﷺ يقول عند الاستيقاظ: الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور",
    hadithText: "عن حذيفة بن اليمان رضي الله عنه قال: كان النبي ﷺ إذا استيقظ من الليل قال: «الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور»",
    source: "صحيح البخاري (6312)",
    authenticity: "صحيح",
    explanation: "هذا الذكر من الأذكار الثابتة عن النبي ﷺ عند الاستيقاظ من النوم. يذكر العبد نعمة الله عليه بإعادة الحياة.",
    practicalApplication: "عند الاستيقاظ مباشرة، قبل أي شيء، قل: «الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور».",
    warning: null,
  },
  "دعاء المذاكرة": {
    shortAnswer: "لم يثبت عن النبي ﷺ دعاء مخصوص للمذاكرة أو الدراسة",
    hadithText: "",
    source: "",
    authenticity: "لم يثبت",
    explanation: "لم يثبت عن النبي ﷺ دعاء مخصوص قبل المذاكرة أو الدراسة. ما يتداول من أدعية مخصوصة للدراسة ليست من السنة الثابتة.",
    practicalApplication: "يمكن الدعاء قبل المذاكرة بأدعية عامة مثل: «رب زدني علما»، «اللهم انفعني بما علمتني وعلمني ما ينفعني».",
    warning: "الأدعية المشهورة المنتشرة على الإنترنت مثل 'دعاء المذاكرة' لم تثبت عن النبي ﷺ، والأفضل الالتزام بالأدعية الثابتة.",
  },
  "علاج الغضب": {
    shortAnswer: "نعم، كان النبي ﷺ يوصي بالاستعاذة والسكوت عند الغضب",
    hadithText: "عن سليمان بن صرد رضي الله عنه قال: قال النبي ﷺ: «إني لأعلم كلمة لو قالها لذهب عنه ما يجد: أعوذ بالله من الشيطان الرجيم»",
    source: "متفق عليه: البخاري (3282)، مسلم (2610)",
    authenticity: "صحيح",
    explanation: "كان النبي ﷺ يوصي عند الغضب بثلاثة أمور: التعوذ بالله من الشيطان، السكوت، وتغيير الوضع.",
    practicalApplication: "عند الغضب: 1) قل «أعوذ بالله من الشيطان الرجيم»، 2) اسكت، 3) إن كنت واقفًا فاجلس، 4) توضأ.",
    warning: "الغضب من الشيطان، والاستعاذة بالله هي أكبر سلاح. لا تتخذ قرارات وأنت غضبان.",
  },
  "التسمية قبل الطعام": {
    shortAnswer: "نعم، التسمية قبل الطعام ثابتة عن النبي ﷺ",
    hadithText: "عن عمر بن أبي سلمة رضي الله عنه قال: قال النبي ﷺ: «يا غلام، سم الله، وكل بيمينك، وكل مما يليك»",
    source: "متفق عليه: البخاري (5376)، مسلم (2022)",
    authenticity: "صحيح",
    explanation: "التسمية قبل الطعام من آداب الأكل الثابتة. فيها طرد للشيطان وبركة في الطعام.",
    practicalApplication: "قل «بسم الله» قبل البدء بالطعام. إن نسيت في أوله فقل «بسم الله أوله وآخره».",
    warning: null,
  },
  "صلاة الضحى": {
    shortAnswer: "نعم، صلاة الضحى سنة مؤكدة عن النبي ﷺ",
    hadithText: "عن أبي هريرة رضي الله عنه قال: أوصاني خليلي ﷺ بثلاث: صيام ثلاثة أيام من كل شهر، وركعتي الضحى، وأن أوتر قبل أن أنام",
    source: "متفق عليه: البخاري (1981)، مسلم (721)",
    authenticity: "صحيح",
    explanation: "صلاة الضحى من السنن المؤكدة. أقلها ركعتان وأكثرها ثمان. وقتها بعد ارتفاع الشمس قيد رمح.",
    practicalApplication: "صل ركعتين بعد شروق الشمس بحوالي 15-20 دقيقة. هي صدقة عن كل مفصل في جسمك.",
    warning: null,
  },
  "السلام على الأطفال": {
    shortAnswer: "نعم، كان النبي ﷺ يسلم على الصبيان",
    hadithText: "عن أنس بن مالك رضي الله عنه أنه مر على صبيان فسلم عليهم وقال: كان النبي ﷺ يفعله",
    source: "متفق عليه: البخاري (6247)، مسلم (2168)",
    authenticity: "صحيح",
    explanation: "السلام على الصبيان من تواضع النبي ﷺ، ومن السنن المهجورة.",
    practicalApplication: "إذا مررت بأطفال فسلم عليهم، علمهم السنة وعودهم عليها.",
    warning: null,
  },
};

export function searchLocalKnowledge(query: string): AiAnswer | null {
  const q = query.trim();
  if (!q) return null;

  for (const [key, answer] of Object.entries(localKnowledgeBase)) {
    if (q.includes(key) || key.includes(q)) {
      return answer;
    }
  }

  // Fuzzy match
  for (const [key, answer] of Object.entries(localKnowledgeBase)) {
    const qWords = q.split(/\s+/);
    const keyWords = key.split(/\s+/);
    const matchCount = qWords.filter((w) => keyWords.some((kw) => kw.includes(w) || w.includes(kw))).length;
    if (matchCount >= Math.min(2, keyWords.length)) {
      return answer;
    }
  }

  return null;
}

export function getSuggestedQuestions(): string[] {
  return [
    "كيف كان النبي ﷺ ينام؟",
    "ماذا يقول عند الاستيقاظ؟",
    "هل هناك دعاء للمذاكرة؟",
    "كيف أتعامل مع الغضب؟",
    "ما حكم التسمية قبل الطعام؟",
    "هل صلاة الضحى سنة؟",
    "متى يقال أذكار الصباح؟",
    "ما هي سنن الوضوء؟",
  ];
}

export async function askAi(question: string): Promise<{
  success: boolean;
  data?: AiAnswer;
  error?: string;
}> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

  const result = searchLocalKnowledge(question);
  if (result) {
    return { success: true, data: result };
  }

  return {
    success: true,
    data: {
      shortAnswer: "لا أجد دليلاً صحيحًا واضحًا على هذا الفعل ضمن المصادر المتاحة في التطبيق.",
      hadithText: "",
      source: "",
      authenticity: "غير متوفر",
      explanation: "بعد البحث في قاعدة البيانات المتاحة، لم نجد نصًا أو دليلاً مباشرًا يثبت أو ينفي هذا الفعل عن النبي ﷺ بشكل قاطع.",
      practicalApplication: "يمكنك استشارة أهل العلم الموثوقين في هذا الأمر للحصول على إجابة أدق.",
      warning: "تنبيه مهم: لا تنسب للنبي ﷺ شيئًا لم يثبت عنه. إن لم تجد دليلاً فقل: لا أعلم. ولا تروِ الأحاديث الضعيفة أو الموضوعة.",
    },
  };
}

/**
 * To connect to a real AI API (e.g. OpenAI) later:
 *
 * 1. Create an API route: app/api/ask-ai/route.ts
 * 2. Replace this function with:
 *
 *    const res = await fetch("/api/ask-ai", {
 *      method: "POST",
 *      headers: { "Content-Type": "application/json" },
 *      body: JSON.stringify({
 *        question,
 *        knowledgeBase: localKnowledgeBase, // optional: send local knowledge as context
 *      }),
 *    });
 *    return res.json();
 *
 * 3. The API route would call OpenAI API with a system prompt that
 *    instructs the model to use the provided context and NOT to
 *    fabricate hadiths.
 */
