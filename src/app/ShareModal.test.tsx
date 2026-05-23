import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShareModal from "@/app/ShareModal";

vi.mock("@/lib/export", () => ({
  generateExport: vi.fn().mockResolvedValue("mocked-encoded-string"),
  decodeExport: vi.fn(),
  mergeImport: vi.fn(),
}));

import { generateExport, decodeExport, mergeImport } from "@/lib/export";

Object.assign(navigator, {
  clipboard: { writeText: vi.fn() },
});

describe("ShareModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders both tabs and close button", () => {
    render(<ShareModal onClose={vi.fn()} />);

    expect(screen.getByText("Compartir datos")).toBeDefined();
    expect(screen.getByText("Exportar")).toBeDefined();
    expect(screen.getByText("Importar")).toBeDefined();
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    render(<ShareModal onClose={onClose} />);

    const closeBtn = screen.getByRole("button", { name: "" });
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("generates export and shows encoded text", async () => {
    render(<ShareModal onClose={vi.fn()} />);

    await waitFor(() => {
      const textarea = screen.getByDisplayValue("mocked-encoded-string");
      expect(textarea).toBeDefined();
    });
  });

  it("copies encoded text to clipboard", async () => {
    render(<ShareModal onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("Copiar al portapapeles")).toBeDefined();
    });

    await userEvent.click(screen.getByText("Copiar al portapapeles"));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("mocked-encoded-string");
    expect(screen.getByText("Copiado ✓")).toBeDefined();
  });

  it("switches to import tab and shows textarea", async () => {
    render(<ShareModal onClose={vi.fn()} />);

    await userEvent.click(screen.getByText("Importar"));

    expect(screen.getByPlaceholderText("Pega el texto aquí...")).toBeDefined();
    expect(screen.getByText("Importar datos")).toBeDefined();
  });

  it("shows error when decodeExport throws", async () => {
    vi.mocked(decodeExport).mockImplementation(() => {
      throw new Error("Formato inválido");
    });

    render(<ShareModal onClose={vi.fn()} />);

    await userEvent.click(screen.getByText("Importar"));

    const textarea = screen.getByPlaceholderText("Pega el texto aquí...");
    await userEvent.type(textarea, "invalid-data");
    await userEvent.click(screen.getByText("Importar datos"));

    await waitFor(() => {
      expect(screen.getByText("Formato inválido")).toBeDefined();
    });
  });

  it("shows success message after importing valid data", async () => {
    vi.mocked(decodeExport).mockReturnValue({
      version: 1,
      exportedAt: new Date().toISOString(),
      records: [{ date: "2026-05-01", systolic: 120, diastolic: 80, pulse: 72, pillTaken: true, notes: undefined, createdAt: "", updatedAt: "" }],
      appointments: [],
    });
    vi.mocked(mergeImport).mockResolvedValue({
      recordsImported: 1,
      appointmentsImported: 0,
      appointmentsSkipped: 0,
    });

    render(<ShareModal onClose={vi.fn()} />);

    await userEvent.click(screen.getByText("Importar"));

    const textarea = screen.getByPlaceholderText("Pega el texto aquí...");
    await userEvent.type(textarea, "valid-encoded-data");
    await userEvent.click(screen.getByText("Importar datos"));

    await waitFor(() => {
      expect(screen.getByText("Importados: 1 registros, 0 citas")).toBeDefined();
    });

    expect(mergeImport).toHaveBeenCalledOnce();
  });

  it("shows duplicate appointments info", async () => {
    vi.mocked(decodeExport).mockReturnValue({
      version: 1,
      exportedAt: new Date().toISOString(),
      records: [],
      appointments: [{ date: "2026-05-01", place: "Matrona", notes: undefined, createdAt: "", updatedAt: "" }],
    });
    vi.mocked(mergeImport).mockResolvedValue({
      recordsImported: 0,
      appointmentsImported: 0,
      appointmentsSkipped: 1,
    });

    render(<ShareModal onClose={vi.fn()} />);

    await userEvent.click(screen.getByText("Importar"));

    const textarea = screen.getByPlaceholderText("Pega el texto aquí...");
    await userEvent.type(textarea, "data");
    await userEvent.click(screen.getByText("Importar datos"));

    await waitFor(() => {
      expect(screen.getByText(/1 citas omitidas por duplicado/)).toBeDefined();
    });
  });
});
