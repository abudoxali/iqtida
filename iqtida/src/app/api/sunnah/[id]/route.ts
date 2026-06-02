import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const sunnah = await prisma.sunnahPractice.findUnique({
      where: { id },
      include: {
        hadith: true,
        userProgresses: { take: 10, orderBy: { createdAt: "desc" } },
      },
    });

    if (!sunnah) {
      return NextResponse.json({ error: "السنة غير موجودة" }, { status: 404 });
    }

    const related = await prisma.sunnahPractice.findMany({
      where: {
        dayMoment: sunnah.dayMoment,
        id: { not: id },
        published: true,
      },
      take: 5,
    });

    return NextResponse.json({ sunnah, related });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
