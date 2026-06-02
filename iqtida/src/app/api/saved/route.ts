import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function getVisitorId() {
  const cookieStore = await cookies();
  let visitorId = cookieStore.get("visitor-id")?.value;
  if (!visitorId) {
    visitorId = "default-guest-id";
  }
  return visitorId;
}

export async function GET() {
  try {
    const userId = await getVisitorId();
    
    // Check if the user exists in database first
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return NextResponse.json({ items: [] });
    }

    const items = await prisma.savedItem.findMany({
      where: { userId },
      include: {
        sunnahPractice: true,
        hadith: true,
        answer: true,
      },
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getVisitorId();
    
    // Ensure the user exists in database (only when writing)
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@guest.iqtida.app`,
        name: "زائر اقتداء",
        role: "USER",
      },
    });

    const body = await req.json();
    const { type, sunnahPracticeId, hadithId, answerId } = body;

    // Check if it already exists
    const existing = await prisma.savedItem.findFirst({
      where: {
        userId,
        type,
        sunnahPracticeId: sunnahPracticeId || null,
        hadithId: hadithId || null,
        answerId: answerId || null,
      },
    });

    if (existing) {
      // If it exists, delete it (toggle off)
      await prisma.savedItem.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ saved: false });
    } else {
      // Create new saved item
      await prisma.savedItem.create({
        data: {
          userId,
          type,
          sunnahPracticeId: sunnahPracticeId || undefined,
          hadithId: hadithId || undefined,
          answerId: answerId || undefined,
        },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
