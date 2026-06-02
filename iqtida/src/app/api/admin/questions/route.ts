import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

async function checkModerator() {
  const session = await auth();
  return !!session?.user && (session.user.role === "ADMIN" || session.user.role === "REVIEWER");
}

export async function GET() {
  if (!(await checkModerator())) {
    return NextResponse.json({ error: "غير مصرح بالدخول" }, { status: 401 });
  }
  try {
    const questions = await prisma.unansweredQuestion.findMany({
      include: { askedByUser: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ questions });
  } catch {
    return NextResponse.json({ error: "خطأ في جلب الأسئلة" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await checkModerator())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const { id, status, adminNotes } = await req.json();
    const question = await prisma.unansweredQuestion.update({
      where: { id },
      data: { status, adminNotes },
    });
    
    // Log action to AuditLog
    const session = await auth();
    if (session?.user?.id) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: `UPDATE_QUESTION_STATUS_${status}`,
          entityType: "QUESTION_ANSWER",
          entityId: id,
          details: `تم تعديل حالة السؤال إلى ${status}. ملاحظات: ${adminNotes || ""}`,
        },
      });
    }

    return NextResponse.json({ question });
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء التعديل" }, { status: 500 });
  }
}
