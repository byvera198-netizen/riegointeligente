import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://sistema-riego-inteligente-samborondon.eemite.chatgpt.site";

export const metadata: Metadata = {
  title: "Sistema de Riego Inteligente | Unidad Educativa Fiscal Samborondón",
  description: "Proyecto completo de agricultura de precisión: riego autónomo por zonas, energía solar, sensores, control ESP32 y supervisión web.",
  metadataBase: new URL(siteUrl),
  keywords: ["riego inteligente", "agricultura de precisión", "energía solar", "ESP32", "Unidad Educativa Fiscal Samborondón"],
  openGraph: {
    title: "Sistema de Riego Inteligente",
    description: "Tecnología autónoma, sostenible y conectada para optimizar el uso del agua y monitorear cultivos en tiempo real.",
    url: siteUrl,
    siteName: "Sistema de Riego Inteligente",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Sistema de Riego Inteligente de la Unidad Educativa Fiscal Samborondón" }],
    locale: "es_EC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistema de Riego Inteligente",
    description: "Agricultura de precisión con energía solar y control autónomo.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/logo-institucion.jpeg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
