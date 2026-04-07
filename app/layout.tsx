import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/app/context/AuthContext";

export const metadata: Metadata = {
  title: "Finanzas PRO",
  description: "Gestión financiera personal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased noise-overlay">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}