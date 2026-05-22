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

  it("shows validation errors for empty fields", async () => {
    render(<RegisterForm onSave={vi.fn()} onCancel={vi.fn()} />);

    await userEvent.click(screen.getByText("Guardar"));

    expect(screen.getByText("Valor entre 60 y 250")).toBeDefined();
    expect(screen.getByText("Valor entre 30 y 150")).toBeDefined();
    expect(screen.getByText("Valor entre 30 y 220")).toBeDefined();
  });

  it("shows validation for out-of-range systolic", async () => {
    render(<RegisterForm onSave={vi.fn()} onCancel={vi.fn()} />);

    const sysInput = screen.getByPlaceholderText("120");
    await userEvent.type(sysInput, "10");
    await userEvent.click(screen.getByText("Guardar"));

    expect(screen.getByText("Valor entre 60 y 250")).toBeDefined();
  });

  it("calls onSave with correct data on valid submit", async () => {
    const onSave = vi.fn();
    render(<RegisterForm onSave={onSave} onCancel={vi.fn()} />);

    const sysInput = screen.getByPlaceholderText("120");
    const diaInput = screen.getByPlaceholderText("80");
    const pulseInput = screen.getByPlaceholderText("72");

    await userEvent.type(sysInput, "118");
    await userEvent.type(diaInput, "76");
    await userEvent.type(pulseInput, "72");
    await userEvent.click(screen.getByText("Guardar"));

    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        systolic: 118,
        diastolic: 76,
        pulse: 72,
        pillTaken: false,
      })
    );
  });

  it("includes pillTaken true when toggle is clicked", async () => {
    const onSave = vi.fn();
    render(<RegisterForm onSave={onSave} onCancel={vi.fn()} />);

    await userEvent.type(screen.getByPlaceholderText("120"), "118");
    await userEvent.type(screen.getByPlaceholderText("80"), "76");
    await userEvent.type(screen.getByPlaceholderText("72"), "72");
    await userEvent.click(screen.getByText("Pastilla tomada"));
    await userEvent.click(screen.getByText("Guardar"));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ pillTaken: true })
    );
  });

  it("includes notes when provided", async () => {
    const onSave = vi.fn();
    render(<RegisterForm onSave={onSave} onCancel={vi.fn()} />);

    await userEvent.type(screen.getByPlaceholderText("120"), "118");
    await userEvent.type(screen.getByPlaceholderText("80"), "76");
    await userEvent.type(screen.getByPlaceholderText("72"), "72");

    const textarea = screen.getByPlaceholderText(
      /cómo te sientes/i
    );
    await userEvent.type(textarea, "Me siento bien");
    await userEvent.click(screen.getByText("Guardar"));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ notes: "Me siento bien" })
    );
  });
});
