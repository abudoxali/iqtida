import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizeArabic } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length < 3) {
      return NextResponse.json({ error: "النص قصير جداً" }, { status: 400 });
    }

    const normalized = normalizeArabic(text);

    const hadiths = await prisma.hadith.findMany({
      where: {
        OR: [
          { arabicText: { contains: normalized } },
          { tags: { contains: normalized } },
        ],
      },
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    if (hadiths.length === 0) {
      return NextResponse.json({
        found: false,
        message: "لم يتم العثور على نص مطابق في قاعدة البيانات",
      });
    }

    return NextResponse.json({
      found: true,
      hadiths,
    });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
