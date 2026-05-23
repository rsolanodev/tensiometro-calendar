import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getRecordByDate, getAllRecords } from "@/lib/db";
import RegisterForm from "@/app/RegisterForm";

describe("RegisterForm integration with IndexedDB", () => {
  beforeEach(async () => {
    const { clearDB } = await import("@/lib/db");
    await clearDB();
  });

  it("persists record in IndexedDB when saved with valid data", async () => {
    const onSave = async (data: Parameters<typeof import("@/lib/db")["saveRecord"]>[0]) => {
      const { saveRecord } = await import("@/lib/db");
      await saveRecord(data);
    };

    render(
      <RegisterForm
        onSave={onSave}
        onCancel={vi.fn()}
        initialSystolic={118}
        initialDiastolic={76}
        initialPulse={72}
      />
    );

    await userEvent.click(screen.getByText("Pastilla tomada"));
    await userEvent.click(screen.getByText("Guardar"));

    await waitFor(async () => {
      const all = await getAllRecords();
      expect(all).toHaveLength(1);
      expect(all[0].systolic).toBe(118);
      expect(all[0].diastolic).toBe(76);
      expect(all[0].pulse).toBe(72);
      expect(all[0].pillTaken).toBe(true);
    });
  });

  it("persists record with notes in IndexedDB", async () => {
    const onSave = async (data: Parameters<typeof import("@/lib/db")["saveRecord"]>[0]) => {
      const { saveRecord } = await import("@/lib/db");
      await saveRecord(data);
    };

    render(
      <RegisterForm
        onSave={onSave}
        onCancel={vi.fn()}
        initialSystolic={120}
        initialDiastolic={80}
        initialPulse={75}
      />
    );

    const textarea = screen.getByPlaceholderText(/cómo te sientes/i);
    await userEvent.type(textarea, "Me siento genial");
    await userEvent.click(screen.getByText("Guardar"));

    await waitFor(async () => {
      const all = await getAllRecords();
      expect(all).toHaveLength(1);
      expect(all[0].notes).toBe("Me siento genial");
    });
  });

  it("shows error message when onSave throws", async () => {
    const onSave = async () => {
      throw new Error("DB error");
    };

    render(
      <RegisterForm
        onSave={onSave}
        onCancel={vi.fn()}
        initialSystolic={118}
        initialDiastolic={76}
        initialPulse={72}
      />
    );

    await userEvent.click(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(screen.getByText("Error al guardar. Inténtalo de nuevo.")).toBeDefined();
    });
  });

  it("upserts existing date record via onSave", async () => {
    const { saveRecord, getRecordByDate } = await import("@/lib/db");

    const onSave = async (data: Parameters<typeof import("@/lib/db")["saveRecord"]>[0]) => {
      await saveRecord(data);
    };

    render(
      <RegisterForm
        onSave={onSave}
        onCancel={vi.fn()}
        initialSystolic={118}
        initialDiastolic={76}
        initialPulse={72}
      />
    );

    await userEvent.click(screen.getByText("Guardar"));

    await waitFor(async () => {
      const all = await getAllRecords();
      expect(all).toHaveLength(1);
    });

    const savedDate = (await getAllRecords())[0].date;

    cleanup();

    render(
      <RegisterForm
        onSave={onSave}
        onCancel={vi.fn()}
        initialDate={savedDate}
        initialSystolic={130}
        initialDiastolic={80}
        initialPulse={72}
      />
    );

    await userEvent.click(screen.getByText("Guardar"));

    await waitFor(async () => {
      const all = await getAllRecords();
      expect(all).toHaveLength(1);
      const rec = await getRecordByDate(savedDate);
      expect(rec?.systolic).toBe(130);
    });
  });
});
