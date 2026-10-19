import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fleet-platform/ui/styles.css";
import { messages } from "@/messages/pl";

export const metadata: Metadata = {
  title: "fleet-platform",
  description: messages.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="pl"><body>{children}</body></html>;
}
