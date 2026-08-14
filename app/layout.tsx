import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema de Riego Inteligente | U. E. Fiscal Samborondón",
  description:
    "Proyecto educativo de agricultura de precisión con automatización por microzonas y energía solar.",
  metadataBase: new URL("https://sistema-riego-inteligente.example"),
  openGraph: {
    title: "Sistema de Riego Inteligente",
    description:
      "De un prototipo solar de 2 m² a una visión de agricultura de precisión a escala de campo.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "es_EC",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
