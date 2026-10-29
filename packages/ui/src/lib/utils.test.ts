import { expect, it } from "vitest";
import { cn } from "./utils";

it("joins conditional classes and lets later Tailwind utilities win", () => {
  expect(cn("px-2 text-body", false, undefined, { hidden: false, block: true }, "px-4")).toBe("text-body block px-4");
});

it("keeps a text role next to a colour and replaces one role with another", () => {
  expect(cn("text-body", "text-error")).toBe("text-body text-error");
  expect(cn("text-body", "text-meta")).toBe("text-meta");
});
