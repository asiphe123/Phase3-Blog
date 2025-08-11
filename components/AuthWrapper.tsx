'use client';

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import AuthHeader from "@/components/AuthHeader";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthHeader />
      {children}
    </SessionProvider>
  );
}