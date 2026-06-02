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
    const hadiths = await prisma.hadith.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ hadiths });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ أثناء جلب الأحاديث" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkModerator())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const hadith = await prisma.hadith.create({ data });

    // Log to AuditLog
    const session = await auth();
    if (session?.user?.id) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "CREATE_HADITH",
          entityType: "HADITH",
          entityId: hadith.id,
          details: `تمت إضافة حديث جديد: ${hadith.arabicText.slice(0, 50)}...`,
        },
      });
    }

    return NextResponse.json({ hadith });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ أثناء الإضافة" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await checkModerator())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const { id, ...data } = await req.json();
    const hadith = await prisma.hadith.update({ where: { id }, data });

    // Log to AuditLog
    const session = await auth();
    if (session?.user?.id) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "UPDATE_HADITH",
          entityType: "HADITH",
          entityId: hadith.id,
          details: `تم تعديل الحديث: ${hadith.arabicText.slice(0, 50)}...`,
        },
      });
    }

    return NextResponse.json({ hadith });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ أثناء التعديل" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await checkModerator())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    await prisma.hadith.delete({ where: { id } });

    // Log to AuditLog
    const session = await auth();
    if (session?.user?.id) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "DELETE_HADITH",
          entityType: "HADITH",
          entityId: id,
          details: "تم حذف الحديث كلياً من قاعدة البيانات.",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ أثناء الحذف" }, { status: 500 });
  }
}
