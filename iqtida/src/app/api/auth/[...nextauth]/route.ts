import { handlers } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const mockSession = {
  user: {
    id: "default-guest-id",
    name: "زائر اقتداء",
    email: "guest@iqtida.app",
    role: "ADMIN",
    image: null,
  },
  expires: "2099-01-01T00:00:00.000Z",
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  if (url.pathname.endsWith("/session")) {
    return NextResponse.json(mockSession);
  }
  return handlers.GET(req);
}

export async function POST(req: NextRequest) {
  return handlers.POST(req);
}

