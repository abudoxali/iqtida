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
      return NextResponse.json({ weekProgress: [] });
    }

    // Get user's completed progress items for the last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const progress = await prisma.userProgress.findMany({
      where: {
        userId,
        date: { gte: lastWeek },
        completed: true,
      },
      select: {
        date: true,
        completed: true,
        sunnahPracticeId: true,
      },
    });

    return NextResponse.json({
      weekProgress: progress,
    });
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
    const { sunnahPracticeId, completed } = body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (completed) {
      // Save/Upsert completed progress
      await prisma.userProgress.upsert({
        where: {
          userId_sunnahPracticeId_date: {
            userId,
            sunnahPracticeId,
            date: today,
          },
        },
        update: {
          completed: true,
        },
        create: {
          userId,
          sunnahPracticeId,
          date: today,
          completed: true,
        },
      });
      
      // Update user streak if they completed a sunnah today
      await prisma.user.update({
        where: { id: userId },
        data: {
          streak: { increment: 1 },
          lastActiveDate: new Date(),
        },
      });
    } else {
      // Remove completed progress
      await prisma.userProgress.deleteMany({
        where: {
          userId,
          sunnahPracticeId,
          date: today,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
