export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://credit-converter.vercel.app/sitemap.xml",
  };
}
