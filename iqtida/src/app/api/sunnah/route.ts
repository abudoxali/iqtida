import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const category = searchParams.get("category");
    const dayMoment = searchParams.get("dayMoment");
    const search = searchParams.get("search");

    if (id) {
      const sunnah = await prisma.sunnahPractice.findUnique({
        where: { id },
        include: { hadith: true },
      });
      return NextResponse.json({ sunnah });
    }

    const where: Record<string, unknown> = {
      reviewStatus: "PUBLISHED",
    };

    if (category) where.category = category;
    if (dayMoment) where.dayMoment = dayMoment;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const sunnahs = await prisma.sunnahPractice.findMany({
      where: where as any,
      include: { hadith: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ sunnahs });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ في جلب السنن" }, { status: 500 });
  }
}
