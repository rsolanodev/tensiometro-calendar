"use client";

import { useState, useEffect, useRef } from "react";
import { generateExport, decodeExport, mergeImport } from "@/lib/export";

type Props = {
  onClose: () => void;
};

export default function ShareModal({ onClose }: Props) {
  const [tab, setTab] = useState<"export" | "import">("export");
  const [encoded, setEncoded] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyFallback, setCopyFallback] = useState(false);
  const [importText, setImportText] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    generateExport()
      .then(setEncoded)
      .finally(() => setLoading(false));
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(encoded);
      setCopied(true);
      setCopyFallback(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      if (textareaRef.current) {
        textareaRef.current.select();
        textareaRef.current.focus();
        setCopyFallback(true);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          setCopyFallback(false);
        }, 3000);
      }
    }
  }

  async function handleImport() {
    setImportResult("");
    setImporting(true);
    try {
      const data = decodeExport(importText.trim());
      const result = await mergeImport(data);
      setImportResult(
        `Importados: ${result.recordsImported} registros, ${result.appointmentsImported} citas. Datos locales reemplazados.`
      );
    } catch (e) {
      setImportResult(e instanceof Error ? e.message : "Error al importar");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30">
      <div className="card-surface w-full sm:max-w-md rounded-b-none sm:rounded-b-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-lg">
          <h2 className="text-headline-sm">Compartir datos</h2>
          <button
            type="button"
            onClick={onClose}
            className="size-9 flex items-center justify-center rounded-full bg-surface-variant text-text-secondary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex gap-sm mb-lg">
          <button
            type="button"
            onClick={() => setTab("export")}
            className={`flex-1 py-sm rounded-full text-label-sm font-medium transition-colors ${
              tab === "export"
                ? "bg-primary text-surface"
                : "bg-surface-variant text-text-secondary"
            }`}
          >
            Exportar
          </button>
          <button
            type="button"
            onClick={() => setTab("import")}
            className={`flex-1 py-sm rounded-full text-label-sm font-medium transition-colors ${
              tab === "import"
                ? "bg-primary text-surface"
                : "bg-surface-variant text-text-secondary"
            }`}
          >
            Importar
          </button>
        </div>

        {tab === "export" && (
          <div className="space-y-md">
            <p className="text-body-sm text-text-secondary">
              Copia este texto y compártelo para transferir todos los datos a otro dispositivo.
            </p>
            {loading ? (
              <div className="h-24 rounded-md bg-surface-variant animate-pulse" />
            ) : (
              <>
                <textarea
                  ref={textareaRef}
                  readOnly
                  value={encoded}
                  rows={5}
                  className="w-full rounded-md border border-border-subtle bg-surface px-md py-sm text-body-sm text-text-primary outline-none focus:border-primary resize-none font-mono"
                />
                {copyFallback && (
                  <p className="text-label-sm text-text-secondary text-center">
                    Selecciona todo el texto manualmente y pulsa Ctrl+C / Cmd+C
                  </p>
                )}
              </>
            )}
            <button
              type="button"
              onClick={handleCopy}
              disabled={loading}
              className="btn-primary w-full"
            >
              {copyFallback ? "Seleccionado — pulsa Ctrl+C" : copied ? "Copiado ✓" : "Copiar al portapapeles"}
            </button>
          </div>
        )}

        {tab === "import" && (
          <div className="space-y-md">
            <p className="text-body-sm text-text-secondary">
              Pega aquí el texto compartido desde el otro dispositivo.
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Pega el texto aquí..."
              rows={5}
              className="w-full rounded-md border border-border-subtle bg-surface px-md py-sm text-body-md text-text-primary outline-none focus:border-primary resize-none font-mono"
            />
            <button
              type="button"
              onClick={handleImport}
              disabled={importing || !importText.trim()}
              className="btn-primary w-full disabled:opacity-50"
            >
              {importing ? "Importando…" : "Importar datos"}
            </button>
            {importResult && (
              <p
                className={`text-label-sm text-center ${
                  importResult.startsWith("Importados")
                    ? "text-success"
                    : "text-primary"
                }`}
              >
                {importResult}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
