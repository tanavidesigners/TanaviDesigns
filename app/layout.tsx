import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tanavibydeepika.com"),
  title: { default: "Tanavi by Deepika — Indian Designer Clothing", template: "%s | Tanavi by Deepika" },
  description: "Thoughtfully made Indian clothing in small, considered editions. Sarees, kurta sets, co-ords and occasion wear, crafted slowly.",
  openGraph: {
    title: "Tanavi by Deepika",
    description: "A softer way to dress. Small-batch Indian clothing, made with care.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Tanavi by Deepika — A softer way to dress" }],
  },
  twitter: { card: "summary_large_image", title: "Tanavi by Deepika", description: "A softer way to dress.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
