import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "صباح الخير" : hour < 17 ? "نهارك مبارك" : "مساء الخير";

    const todaySunnahs = await prisma.sunnahPractice.count({
      where: { published: true },
    });

    // Check if the user exists in database first
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streak: true },
    });

    if (!user) {
      // Return 0 metrics instantly for new visitors without executing write/upsert database locks
      return NextResponse.json({
        greeting: `${greeting}، زائر اقتداء`,
        hijriDate: "",
        gregorianDate: new Date().toLocaleDateString("ar-SA", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
        }),
        completionPercentage: 0,
        todaySunnahs,
        completedToday: 0,
        streak: 0,
        savedCount: 0,
        totalApplied: 0,
      });
    }

    const completedToday = await prisma.userProgress.count({
      where: { userId, date: { gte: today }, completed: true },
    });

    const totalApplied = await prisma.userProgress.count({
      where: { userId },
    });

    const savedCount = await prisma.savedItem.count({
      where: { userId },
    });

    return NextResponse.json({
      greeting: `${greeting}، زائر اقتداء`,
      hijriDate: "",
      gregorianDate: new Date().toLocaleDateString("ar-SA", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      }),
      completionPercentage: todaySunnahs > 0 ? Math.round((completedToday / todaySunnahs) * 100) : 0,
      todaySunnahs,
      completedToday,
      streak: user.streak || 0,
      savedCount,
      totalApplied,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
