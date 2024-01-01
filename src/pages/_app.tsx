import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Analytics } from '@vercel/analytics/react';
import { FlagProvider } from "@unleash/nextjs/client";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <FlagProvider>
        <Component {...pageProps} />
      </FlagProvider>
      <Analytics />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
