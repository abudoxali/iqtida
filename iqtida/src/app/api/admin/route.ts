import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "REVIEWER")) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const totalHadiths = await prisma.hadith.count();
    const totalSunnahs = await prisma.sunnahPractice.count();
    const totalUsers = await prisma.user.count();
    
    const pendingHadiths = await prisma.hadith.count({ where: { reviewStatus: "PENDING_REVIEW" } });
    const pendingSunnahs = await prisma.sunnahPractice.count({ where: { reviewStatus: "PENDING_REVIEW" } });
    const pendingQas = await prisma.questionAnswer.count({ where: { reviewStatus: "PENDING_REVIEW" } });
    
    const unansweredQuestions = await prisma.unansweredQuestion.count({
      where: { status: "PENDING" },
    });

    const recentAuditLogs = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      totalHadiths,
      totalSunnahs,
      totalUsers,
      pendingReviews: pendingHadiths + pendingSunnahs + pendingQas,
      unansweredQuestions,
      recentAuditLogs,
    });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ أثناء جلب إحصائيات الإدارة" }, { status: 500 });
  }
}
