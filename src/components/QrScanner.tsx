"use client";
import { useEffect, useId, useRef } from "react";

export default function QrScanner({ onScan }: { onScan: (token: string) => void }) {
  const id = useId().replace(/:/g, "");
  const scannerRef = useRef<{ clear: () => Promise<void> } | null>(null);
  const locked = useRef(false);
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { Html5QrcodeScanner } = await import("html5-qrcode");
      if (cancelled) return;
      const scanner = new Html5QrcodeScanner(id, { fps: 10, qrbox: { width: 240, height: 240 } }, false);
      scannerRef.current = scanner;
      scanner.render((decodedText) => { if (!locked.current) { locked.current = true; onScan(decodedText); } }, () => undefined);
    })();
    return () => { cancelled = true; const scanner = scannerRef.current; if (scanner) void scanner.clear().catch(() => undefined); };
  }, [id, onScan]);
  return <div id={id} aria-label="QR code camera scanner" />;
}
