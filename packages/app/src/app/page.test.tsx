// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { messages } from "@/messages/pl";
import HomePage from "./page";

afterEach(cleanup);
it("presents the project and links to the administration panel", () => {
  render(<HomePage />);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(messages.title);
  expect(screen.getByText(messages.status)).toBeTruthy();
  expect(screen.getByText(messages.introduction)).toBeTruthy();
  expect(screen.getByRole("link", { name: messages.adminLink }).getAttribute("href")).toBe("/admin");
});
