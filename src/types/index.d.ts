export type GpsStatus = "success" | "timeout" | "denied";

export interface OfflineScan {
  id?: number;
  studentId: string;
  qrToken: string;
  scannedAt: number;
  lat: number | null;
  lng: number | null;
  gpsStatus: GpsStatus;
  syncStatus: "pending";
}

export interface QrClaims { courseId: string; sessionId: string; iat: number; exp: number }
