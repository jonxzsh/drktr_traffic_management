"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  TRPCClientError,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import SuperJSON from "superjson";

import { useToast } from "@/components/ui/use-toast";
import { type AppRouter } from "@/server/api/root";
import { useRouter } from "next/navigation";

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (val, err) => {
              if (typeof window === "undefined") return true;
              if (!(err instanceof TRPCClientError)) return true;
              if (err.data?.code === "UNAUTHORIZED") {
                toast({
                  title: "An error occurred",
                  description: err
                    .toString()
                    .replaceAll("TRPCClientError: ", ""),
                  variant: "destructive",
                });
                router.push("/auth/login");
                return false;
              } else {
                toast({
                  title: "An error occurred",
                  description: err
                    .toString()
                    .replaceAll("TRPCClientError: ", ""),
                  variant: "destructive",
                });
                return true;
              }
            },
          },
          mutations: {
            retry: (val, err) => {
              if (typeof window === "undefined") return false;
              if (!(err instanceof TRPCClientError)) return false;
              if (err.data?.code === "UNAUTHORIZED") {
                toast({
                  title: "An error occurred",
                  description: err
                    .toString()
                    .replaceAll("TRPCClientError: ", ""),
                  variant: "destructive",
                });
                router.push("/auth/login");
                return false;
              } else {
                console.log("toost");
                toast({
                  title: "An error occurred",
                  description: err
                    .toString()
                    .replaceAll("TRPCClientError: ", ""),
                  variant: "destructive",
                });
                return false;
              }
            },
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
