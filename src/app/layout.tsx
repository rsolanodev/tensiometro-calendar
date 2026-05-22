import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Materna - Calendario de Tensión",
  description:
    "Registra y visualiza tu tensión arterial y medicación diaria durante el embarazo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col pb-[72px]">{children}</body>
    </html>
  );
}
