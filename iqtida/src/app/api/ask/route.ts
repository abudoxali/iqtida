import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizeArabic } from "@/lib/utils";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question || question.trim().length < 3) {
      return NextResponse.json({ error: "السؤال قصير جداً" }, { status: 400 });
    }

    const normalized = normalizeArabic(question);

    const matches = await prisma.questionAnswer.findMany({
      where: {
        OR: [
          { normalizedQuestion: { contains: normalized } },
          { question: { contains: normalized } },
        ],
      },
      include: { hadith: true },
      take: 5,
    });

    if (matches.length > 0) {
      return NextResponse.json({ answer: matches[0], found: true });
    }

    const sunnahMatches = await prisma.sunnahPractice.findMany({
      where: {
        OR: [
          { title: { contains: normalized } },
          { description: { contains: normalized } },
        ],
        published: true,
      },
      include: { hadith: true },
      take: 3,
    });

    if (sunnahMatches.length > 0) {
      return NextResponse.json({
        answer: {
          answerType: "YES_PROVEN",
          shortAnswer: "نعم، ثبت ذلك في السنة",
          detailedAnswer: sunnahMatches[0].description,
          explanation: sunnahMatches[0].practicalSteps,
          hadith: sunnahMatches[0].hadith,
        },
        found: true,
      });
    }

    const session = await auth();
    await prisma.unansweredQuestion.create({
      data: {
        question,
        askedByUserId: session?.user?.id,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      answer: {
        answerType: "NOT_IN_DB",
        shortAnswer: "لم أجد مصدرًا موثوقًا في قاعدة البيانات الحالية",
        detailedAnswer: "لم أتمكن من العثور على إجابة مؤكدة في قاعدة بيانات التطبيق. تم حفظ سؤالك للمراجعة.",
        explanation: "إذا كان لديك دليل أو مصدر، يمكنك التواصل مع فريق الإعداد.",
      },
      found: false,
    });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ في معالجة السؤال" }, { status: 500 });
  }
}
