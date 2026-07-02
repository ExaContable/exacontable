import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/carrito/", "/checkout/", "/mis-pedidos/"],
      },
    ],
    sitemap: "https://exacontable.com/sitemap.xml",
  };
}
