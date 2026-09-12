import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { distanceMetres } from "@/lib/geo";
import { verifyOfflineQrToken } from "@/lib/jwt";
import type { OfflineScan } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export const dynamic = "force-dynamic";
const validGps = new Set(["success", "timeout", "denied"]);

export async function POST(request: NextRequest) {
  const user = await getServerSession(authOptions);
  if (!user?.user.id || user.user.role !== "student") return NextResponse.json({ error: "Student sign-in required" }, { status: 401 });
  let scans: OfflineScan[];
  try { scans = await request.json(); } catch { return NextResponse.json({ error: "Expected a JSON array" }, { status: 400 }); }
  if (!Array.isArray(scans) || scans.length > 100) return NextResponse.json({ error: "Submit 1-100 scan records" }, { status: 400 });
  const acceptedIds: number[] = []; const rejected: { id?: number; reason: string }[] = [];
  for (const scan of scans) {
    try {
      if (!scan.qrToken || !Number.isFinite(scan.scannedAt) || !validGps.has(scan.gpsStatus) || typeof scan.id !== "number") throw new Error("Malformed record");
      const claims = verifyOfflineQrToken(scan.qrToken);
      const session = await db.session.findUnique({ where: { id: claims.sessionId } });
      if (!session || session.courseId !== claims.courseId) throw new Error("Unknown session");
      const hasCoordinates = scan.lat !== null && scan.lng !== null && Number.isFinite(scan.lat) && Number.isFinite(scan.lng);
      const isVerified = hasCoordinates && distanceMetres(scan.lat!, scan.lng!, session.classroomLat, session.classroomLng) <= 50;
      await db.attendance.upsert({ where: { studentId_sessionId: { studentId: user.user.id, sessionId: session.id } }, create: { studentId: user.user.id, sessionId: session.id, scannedAt: new Date(scan.scannedAt), lat: scan.lat, lng: scan.lng, gpsStatus: scan.gpsStatus, isVerified }, update: {} });
      acceptedIds.push(scan.id);
    } catch (error) { rejected.push({ id: scan.id, reason: error instanceof Error ? error.message : "Invalid record" }); }
  }
  return NextResponse.json({ acceptedIds, rejected });
}
