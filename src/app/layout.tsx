import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mamun Command Center",
  description: "Personal Productivity, CV Management, Quiz Engine, and AI Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
