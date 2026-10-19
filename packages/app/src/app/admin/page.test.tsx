// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { messages } from "@/messages/pl";
import AdminPage from "./page";

afterEach(cleanup);
it("shows the placeholder panel and links back to the home page", () => {
  render(<AdminPage />);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(messages.adminTitle);
  for (const text of [messages.status, messages.adminDescription, messages.adminBody]) expect(screen.getByText(text)).toBeTruthy();
  expect(screen.getByRole("link", { name: messages.back }).getAttribute("href")).toBe("/");
});
