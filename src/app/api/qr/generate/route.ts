import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signQrToken } from "@/lib/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  const user = await getServerSession(authOptions);
  if (user?.user.role !== "lecturer") return NextResponse.json({ error: "Lecturer sign-in required" }, { status: 401 });
  const sessionId = request.nextUrl.searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  const session = await db.session.findUnique({ where: { id: sessionId }, select: { courseId: true } });
  if (!session) return NextResponse.json({ error: "Unknown session" }, { status: 404 });
  return NextResponse.json({ token: signQrToken(session.courseId, sessionId), expiresIn: 300 });
}
