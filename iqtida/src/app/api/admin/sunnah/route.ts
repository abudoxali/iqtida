import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

async function checkModerator() {
  const session = await auth();
  return !!session?.user && (session.user.role === "ADMIN" || session.user.role === "REVIEWER");
}

export async function GET() {
  if (!(await checkModerator())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const sunnahs = await prisma.sunnahPractice.findMany({
      include: { hadith: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ sunnahs });
  } catch {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkModerator())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const data = await req.json();
    const sunnah = await prisma.sunnahPractice.create({ data });

    // Log action to AuditLog
    const session = await auth();
    if (session?.user?.id) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "CREATE_SUNNAH",
          entityType: "SUNNAH_PRACTICE",
          entityId: sunnah.id,
          details: `تمت إضافة سنة جديدة: ${sunnah.title}`,
        },
      });
    }

    return NextResponse.json({ sunnah });
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء الإضافة" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await checkModerator())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const { id, ...data } = await req.json();
    const sunnah = await prisma.sunnahPractice.update({ where: { id }, data });

    // Log action to AuditLog
    const session = await auth();
    if (session?.user?.id) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "UPDATE_SUNNAH",
          entityType: "SUNNAH_PRACTICE",
          entityId: sunnah.id,
          details: `تم تعديل السنة: ${sunnah.title}`,
        },
      });
    }

    return NextResponse.json({ sunnah });
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء التحديث" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await checkModerator())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const { id } = await req.json();
    await prisma.sunnahPractice.delete({ where: { id } });

    // Log action to AuditLog
    const session = await auth();
    if (session?.user?.id) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "DELETE_SUNNAH",
          entityType: "SUNNAH_PRACTICE",
          entityId: id,
          details: `تم حذف السنة من قاعدة البيانات.`,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء الحذف" }, { status: 500 });
  }
}
