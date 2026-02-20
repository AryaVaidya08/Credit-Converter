import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: "AP Credit Converter",
  description: "This website allows you to understand how many credits you will get for each college based on your AP scores.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Analytics/>
        {children}
      </body>
    </html>
  );
}
