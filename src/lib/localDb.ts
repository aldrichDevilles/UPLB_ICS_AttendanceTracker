import Dexie, { type Table } from "dexie";
import type { OfflineScan } from "@/types";

class AttendanceLocalDb extends Dexie {
  records!: Table<OfflineScan, number>;
  constructor() {
    super("icsAttendance");
    this.version(1).stores({ records: "++id, studentId, syncStatus" });
  }
}
export const localDb = new AttendanceLocalDb();
