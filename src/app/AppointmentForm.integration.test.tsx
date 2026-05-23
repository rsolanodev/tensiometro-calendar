import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getAppointmentsByDate, getAllAppointments } from "@/lib/db";
import AppointmentForm from "@/app/AppointmentForm";

describe("AppointmentForm integration with IndexedDB", () => {
  beforeEach(async () => {
    const { clearDB } = await import("@/lib/db");
    await clearDB();
  });

  it("persists appointment in IndexedDB when saved", async () => {
    const onSave = async (data: Parameters<typeof import("@/lib/db")["addAppointment"]>[0]) => {
      const { addAppointment } = await import("@/lib/db");
      await addAppointment(data);
    };

    render(<AppointmentForm onSave={onSave} onCancel={vi.fn()} />);

    await userEvent.click(screen.getByText("Hospital La Fe"));
    const textarea = screen.getByPlaceholderText(/motivo/i);
    await userEvent.type(textarea, "Revisión trimestral");
    await userEvent.click(screen.getByText("Guardar"));

    await waitFor(async () => {
      const all = await getAllAppointments();
      expect(all).toHaveLength(1);
      expect(all[0].place).toBe("Hospital La Fe");
      expect(all[0].notes).toBe("Revisión trimestral");
    });
  });

  it("persists appointment with different place and date", async () => {
    const onSave = async (data: Parameters<typeof import("@/lib/db")["addAppointment"]>[0]) => {
      const { addAppointment } = await import("@/lib/db");
      await addAppointment(data);
    };

    render(<AppointmentForm onSave={onSave} onCancel={vi.fn()} />);

    await userEvent.click(screen.getByText("Centro de Salud"));
    await userEvent.click(screen.getByText("Guardar"));

    await waitFor(async () => {
      const all = await getAllAppointments();
      expect(all).toHaveLength(1);
      expect(all[0].place).toBe("Centro de Salud");
    });
  });

  it("shows error message when onSave throws", async () => {
    const onSave = async () => {
      throw new Error("DB error");
    };

    render(<AppointmentForm onSave={onSave} onCancel={vi.fn()} />);

    await userEvent.click(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(screen.getByText("Error al guardar. Inténtalo de nuevo.")).toBeDefined();
    });
  });
});
