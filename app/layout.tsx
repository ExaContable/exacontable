import type { Metadata } from "next";
import { Sora, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { FloatingCart } from "@/components/layout/FloatingCart";
import { Providers } from "@/components/layout/Providers";

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

const siteUrl = "https://exacontable.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EXA Contable - Sistema contable y financiero para empresas de Ecuador",
    template: "%s | EXA Contable",
  },
  description:
    "Sistema contable con facturacion electronica SRI, control de inventario, compras, ventas y reportes financieros. Mas de 500 empresas ecuatorianas confian en EXA. Prueba gratis 15 dias.",
  keywords: [
    "sistema contable ecuador",
    "facturacion electronica sri",
    "software contable ecuatoriano",
    "contabilidad en la nube",
    "control de inventario ecuador",
    "reportes financieros",
    "exa contable",
    "pymes ecuador",
  ],
  openGraph: {
    type: "website",
    locale: "es_EC",
    url: siteUrl,
    siteName: "EXA Contable",
    title: "EXA Contable - Sistema contable y financiero para empresas de Ecuador",
    description:
      "Facturacion electronica SRI, control de inventario, compras, ventas y reportes financieros en un solo lugar. Prueba gratis 15 dias.",
    images: [
      {
        url: "/hero-dashboard.png",
        width: 1200,
        height: 800,
        alt: "EXA Contable Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EXA Contable - Sistema contable para empresas ecuatorianas",
    description:
      "Facturacion electronica SRI, inventario y reportes financieros. Mas de 500 empresas confian en EXA.",
    images: ["/hero-dashboard.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EXA Contable",
    url: siteUrl,
    logo: `${siteUrl}/logo-exa.png`,
    description:
      "Sistema contable y financiero con facturacion electronica SRI para empresas ecuatorianas.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+593-97-883-5575",
      contactType: "customer service",
      email: "info@exacontable.com",
      availableLanguage: ["Spanish"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Machala",
      addressRegion: "El Oro",
      addressCountry: "EC",
    },
    sameAs: [
      "https://instagram.com/exacontable",
      "https://wa.me/593978835575",
    ],
  };

  return (
    <html
      lang="es"
      className={`${sora.variable} ${outfit.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <link rel="llms-txt" href="/llms.txt" />
        <link rel="llms-full-txt" href="/llms-full.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-body">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <FloatingCart />
        </Providers>
      </body>
    </html>
  );
}
