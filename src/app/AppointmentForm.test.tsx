import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppointmentForm from "@/app/AppointmentForm";

describe("AppointmentForm", () => {
  it("renders all form fields", () => {
    render(<AppointmentForm onSave={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByText("Nueva cita")).toBeDefined();
    expect(screen.getByText("Fecha")).toBeDefined();
    expect(screen.getByText("Lugar")).toBeDefined();
    expect(screen.getByText("Notas")).toBeDefined();
    expect(screen.getByText("Guardar")).toBeDefined();
    expect(screen.getByText("Cancelar")).toBeDefined();
  });

  it("renders all place options", () => {
    render(<AppointmentForm onSave={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByText("Matrona")).toBeDefined();
    expect(screen.getByText("Centro de Salud")).toBeDefined();
    expect(screen.getByText("Hospital General")).toBeDefined();
    expect(screen.getByText("Hospital 9 de Octubre")).toBeDefined();
    expect(screen.getByText("Hospital La Fe")).toBeDefined();
  });

  it("calls onCancel when Cancelar is clicked", async () => {
    const onCancel = vi.fn();
    render(<AppointmentForm onSave={vi.fn()} onCancel={onCancel} />);

    await userEvent.click(screen.getByText("Cancelar"));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("calls onSave with correct data on valid submit", async () => {
    const onSave = vi.fn();
    render(<AppointmentForm onSave={onSave} onCancel={vi.fn()} />);

    await userEvent.click(screen.getByText("Guardar"));

    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        place: "Matrona",
        notes: undefined,
      })
    );
  });

  it("selects a different place and submits", async () => {
    const onSave = vi.fn();
    render(<AppointmentForm onSave={onSave} onCancel={vi.fn()} />);

    await userEvent.click(screen.getByText("Hospital La Fe"));
    await userEvent.click(screen.getByText("Guardar"));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ place: "Hospital La Fe" })
    );
  });

  it("includes notes when provided", async () => {
    const onSave = vi.fn();
    render(<AppointmentForm onSave={onSave} onCancel={vi.fn()} />);

    const textarea = screen.getByPlaceholderText(/motivo/i);
    await userEvent.type(textarea, "Revisión trimestral");
    await userEvent.click(screen.getByText("Guardar"));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ notes: "Revisión trimestral" })
    );
  });
});
