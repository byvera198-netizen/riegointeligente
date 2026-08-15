import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3001";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "Sistema de riego inteligente 1.0";
  const description = "Control autónomo y supervisión remota del Sistema de riego inteligente 1.0 de la Unidad Educativa Fiscal Samborondón.";
  return {
    title,
    description,
    metadataBase: new URL(origin),
    icons: { icon: "/logo-uef-samborondon.jpeg", shortcut: "/logo-uef-samborondon.jpeg" },
    openGraph: { title, description, type: "website", locale: "es_EC", images: [{ url: `${origin}/og.png`, width: 1680, height: 945, alt: "Sistema de riego inteligente 1.0 de la Unidad Educativa Fiscal Samborondón" }] },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og.png`] },
  };
}

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
