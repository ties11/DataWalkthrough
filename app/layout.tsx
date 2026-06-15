import type { Metadata } from "next";
import "./globals.css";
import "./reader.css";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "DataWalkthrough",
  description: "A complete walkthrough of all subjects in data science and machine learning, with hands-on coding examples.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col"><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}