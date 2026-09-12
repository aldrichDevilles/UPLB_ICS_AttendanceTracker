"use client";
import { useCallback, useEffect, useState } from "react";
import { localDb } from "@/lib/localDb";

export default function SyncStatus() {
  const [pending, setPending] = useState(0);
  const sync = useCallback(async () => {
    const records = await localDb.records.where("syncStatus").equals("pending").toArray();
    setPending(records.length);
    if (!navigator.onLine || records.length === 0) return;
    try {
      const response = await fetch("/api/sync", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(records) });
      if (!response.ok) return;
      const { acceptedIds } = await response.json() as { acceptedIds: number[] };
      await localDb.records.bulkDelete(acceptedIds);
      setPending(await localDb.records.where("syncStatus").equals("pending").count());
    } catch { /* retain records for the next online event */ }
  }, []);
  useEffect(() => { void sync(); window.addEventListener("online", sync); const timer = window.setInterval(() => void sync(), 30_000); return () => { window.removeEventListener("online", sync); window.clearInterval(timer); }; }, [sync]);
  return <p className="badge" aria-live="polite">{pending ? `${pending} check-in${pending === 1 ? "" : "s"} waiting to sync` : "All check-ins synced"}</p>;
}
