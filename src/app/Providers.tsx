"use client";

import { SessionProvider } from "next-auth/react";
import React, { FC, ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
  children: ReactNode;
}

const AuthProviders: FC<ProvidersProps> = ({ children }) => {
  return (
    <SessionProvider>
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </SessionProvider>
  );
};

export default AuthProviders;
