import type React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Texas Traffic Crash Dashboard",
  description:
    "Analyze traffic crash data across Texas counties from 2017-2024",
  openGraph: {
    title: "Texas Traffic Crash Dashboard",
    description:
      "Analyze traffic crash data across Texas counties from 2017-2024",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1689,
        height: 987,
        alt: "Texas Traffic Crash Dashboard",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
