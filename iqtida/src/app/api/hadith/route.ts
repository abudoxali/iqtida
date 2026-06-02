import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizeArabic } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const grade = searchParams.get("grade");

    const where: Record<string, unknown> = {};

    if (search) {
      const normalized = normalizeArabic(search);
      where.OR = [
        { arabicText: { contains: normalized } },
        { tags: { contains: normalized } },
        { sourceBook: { contains: normalized } },
      ];
    }

    if (grade) where.grade = grade;

    const hadiths = await prisma.hadith.findMany({
      where: where as any,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ hadiths });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
