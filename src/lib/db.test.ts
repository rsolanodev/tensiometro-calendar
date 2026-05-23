import { describe, it, expect, beforeEach } from "vitest";
import {
  addRecord,
  saveRecord,
  getRecordByDate,
  getAllRecords,
  getRecordsInRange,
  updateRecord,
  deleteRecord,
} from "./db";

const baseRecord = {
  date: "2026-05-22",
  systolic: 118,
  diastolic: 76,
  pulse: 72,
  pillTaken: true,
};

beforeEach(async () => {
  const existing = await getAllRecords();
  for (const r of existing) {
    if (r.id !== undefined) await deleteRecord(r.id);
  }
});

describe("db", () => {
  it("adds a record and returns an id", async () => {
    const id = await addRecord(baseRecord);
    expect(id).toBeGreaterThan(0);
  });

  it("retrieves a record by date", async () => {
    await addRecord(baseRecord);
    const record = await getRecordByDate("2026-05-22");
    expect(record).toBeDefined();
    expect(record!.systolic).toBe(118);
    expect(record!.diastolic).toBe(76);
    expect(record!.pulse).toBe(72);
    expect(record!.pillTaken).toBe(true);
  });

  it("returns undefined for a non-existent date", async () => {
    const record = await getRecordByDate("2026-01-01");
    expect(record).toBeUndefined();
  });

  it("retrieves all records ordered by date desc", async () => {
    await addRecord({ ...baseRecord, date: "2026-05-21" });
    await addRecord({ ...baseRecord, date: "2026-05-22" });
    await addRecord({ ...baseRecord, date: "2026-05-23" });

    const records = await getAllRecords();
    expect(records).toHaveLength(3);
    expect(records[0].date).toBe("2026-05-23");
    expect(records[2].date).toBe("2026-05-21");
  });

  it("retrieves records in a date range", async () => {
    await addRecord({ ...baseRecord, date: "2026-05-20" });
    await addRecord({ ...baseRecord, date: "2026-05-22" });
    await addRecord({ ...baseRecord, date: "2026-05-25" });

    const records = await getRecordsInRange("2026-05-21", "2026-05-24");
    expect(records).toHaveLength(1);
    expect(records[0].date).toBe("2026-05-22");
  });

  it("updates an existing record", async () => {
    const id = await addRecord(baseRecord);
    const record = await getRecordByDate("2026-05-22");

    await updateRecord({ ...record!, systolic: 130 });

    const updated = await getRecordByDate("2026-05-22");
    expect(updated!.systolic).toBe(130);
  });

  it("deletes a record", async () => {
    await addRecord(baseRecord);
    const record = await getRecordByDate("2026-05-22");
    await deleteRecord(record!.id!);

    const deleted = await getRecordByDate("2026-05-22");
    expect(deleted).toBeUndefined();
  });

  it("saveRecord adds a new record if date does not exist", async () => {
    const id = await saveRecord(baseRecord);
    expect(id).toBeGreaterThan(0);

    const record = await getRecordByDate("2026-05-22");
    expect(record).toBeDefined();
    expect(record!.systolic).toBe(118);
  });

  it("saveRecord updates existing record if date already exists", async () => {
    await addRecord(baseRecord);

    const id = await saveRecord({
      ...baseRecord,
      systolic: 130,
    });

    const record = await getRecordByDate("2026-05-22");
    expect(record).toBeDefined();
    expect(record!.systolic).toBe(130);
    expect(record!.diastolic).toBe(76);
  });
});
