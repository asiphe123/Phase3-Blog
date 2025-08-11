import "./globals.css";
import { ReactNode } from "react";
import AuthWrapper from "@/components/AuthWrapper";

export const metadata = {
  title: "My Blog",
  description: "A blog with login, registration, and authentication",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthWrapper>
          <main className="max-w-3xl mx-auto p-4">{children}</main>
        </AuthWrapper>
      </body>
    </html>
  );
}