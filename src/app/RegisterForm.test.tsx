import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "@/app/RegisterForm";

describe("RegisterForm", () => {
  it("renders all form fields", () => {
    render(<RegisterForm onSave={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByText("Nuevo registro")).toBeDefined();
    expect(screen.getByText("Sistólica")).toBeDefined();
    expect(screen.getByText("Diastólica")).toBeDefined();
    expect(screen.getByText("Pulso")).toBeDefined();
    expect(screen.getByText("Pastilla tomada")).toBeDefined();
    expect(screen.getByText("Guardar")).toBeDefined();
    expect(screen.getByText("Cancelar")).toBeDefined();
  });

  it("calls onCancel when Cancelar is clicked", async () => {
    const onCancel = vi.fn();
    render(<RegisterForm onSave={vi.fn()} onCancel={onCancel} />);

    await userEvent.click(screen.getByText("Cancelar"));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("shows validation for invalid systolic value", async () => {
    render(<RegisterForm onSave={vi.fn()} onCancel={vi.fn()} initialSystolic={10} />);

    await userEvent.click(screen.getByText("Guardar"));

    expect(screen.getByText("Valor entre 60 y 250")).toBeDefined();
  });

  it("calls onSave with correct data on valid submit", async () => {
    const onSave = vi.fn();
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

    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        systolic: 118,
        diastolic: 76,
        pulse: 72,
        pillTaken: true,
      })
    );
  });

  it("includes notes when provided", async () => {
    const onSave = vi.fn();
    render(
      <RegisterForm
        onSave={onSave}
        onCancel={vi.fn()}
        initialSystolic={118}
        initialDiastolic={76}
        initialPulse={72}
      />
    );

    const textarea = screen.getByPlaceholderText(/cómo te sientes/i);
    await userEvent.type(textarea, "Me siento bien");
    await userEvent.click(screen.getByText("Guardar"));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ notes: "Me siento bien" })
    );
  });

  it("shows error when onSave throws", async () => {
    const onSave = async () => { throw new Error("fail"); };

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

    expect(await screen.findByText("Error al guardar. Inténtalo de nuevo.")).toBeDefined();
  });
});
