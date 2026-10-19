import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { messages } from "@/messages/pl";
import RootLayout, { metadata } from "./layout";

it("wraps pages in a Polish document with project metadata", () => {
  expect(renderToStaticMarkup(<RootLayout><p>Synthetic page</p></RootLayout>))
    .toBe('<html lang="pl"><head></head><body><p>Synthetic page</p></body></html>');
  expect(metadata).toEqual({ title: "fleet-platform", description: messages.description });
});
