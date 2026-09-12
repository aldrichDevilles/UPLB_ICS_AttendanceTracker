"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { localDb } from "@/lib/localDb";
import SyncStatus from "@/components/SyncStatus";
import type { GpsStatus } from "@/types";
const QrScanner = dynamic(() => import("@/components/QrScanner"), { ssr: false, loading: () => <p>Starting camera…</p> });

function locate(): Promise<{ lat: number | null; lng: number | null; gpsStatus: GpsStatus }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve({ lat: null, lng: null, gpsStatus: "denied" });
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude, gpsStatus: "success" }),
      (error) => resolve({ lat: null, lng: null, gpsStatus: error.code === error.TIMEOUT ? "timeout" : "denied" }),
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
    );
  });
}

export default function ScanPage() {
  const [studentId, setStudentId] = useState("");
  const [message, setMessage] = useState("Point your camera at the lecturer’s QR code.");
  const [privateWarning, setPrivateWarning] = useState(false);
  useEffect(() => { void navigator.storage?.estimate?.().then(({ quota }) => setPrivateWarning(Boolean(quota && quota < 120_000_000))).catch(() => undefined); }, []);
  const onScan = useCallback(async (qrToken: string) => {
    if (!studentId.trim()) { setMessage("Enter your student ID before scanning."); return; }
    setMessage("Saving your check-in securely on this device…");
    const position = await locate();
    await localDb.records.add({ studentId: studentId.trim(), qrToken, scannedAt: Date.now(), ...position, syncStatus: "pending" });
    setMessage("✓ Check-in saved. It will upload automatically when you are online.");
  }, [studentId]);
  return <main><h1>Check in</h1>{privateWarning && <p className="warning">Private/incognito browsing can clear offline check-ins when this session closes. Use a normal browser window if possible.</p>}<div className="card"><label htmlFor="student">Student ID</label><input id="student" value={studentId} onChange={(e) => setStudentId(e.target.value)} autoComplete="username" placeholder="e.g. S12345678" /><QrScanner onScan={onScan} /><p className={message.startsWith("✓") ? "success" : ""} aria-live="polite">{message}</p></div><SyncStatus /></main>;
}
