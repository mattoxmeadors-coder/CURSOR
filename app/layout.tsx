import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "见家长 AI Copilot",
  description:
    "AI-first family visit copilot for preparation, alignment, battle plans, and content automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
