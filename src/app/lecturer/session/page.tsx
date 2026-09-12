"use client";
import { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function LecturerSessionPage() {
  const [sessionId, setSessionId] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    if (!sessionId) return;
    try {
      const response = await fetch(`/api/qr/generate?sessionId=${encodeURIComponent(sessionId)}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Could not generate QR code. Check the session ID.");
      const data = await response.json() as { token: string };
      setToken(data.token); setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not generate QR code"); }
  }, [sessionId]);
  useEffect(() => { if (!sessionId) return; void refresh(); const interval = window.setInterval(() => void refresh(), 270_000); return () => window.clearInterval(interval); }, [sessionId, refresh]);
  return <main><h1>Attendance session</h1><div className="card"><label htmlFor="session">Session ID</label><input id="session" value={sessionId} onChange={(e) => setSessionId(e.target.value)} placeholder="UUID from the class session" /><button onClick={() => void refresh()}>Display QR code</button></div>{error && <p className="warning">{error}</p>}{token && <div className="card"><p>QR refreshes every 4½ minutes.</p><QRCodeSVG value={token} size={300} level="M" includeMargin /><p className="warning">Do not share this code outside the classroom.</p></div>}</main>;
}
