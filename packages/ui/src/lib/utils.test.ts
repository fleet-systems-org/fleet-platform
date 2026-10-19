import { expect, it } from "vitest";
import { cn } from "./utils";

it("joins conditional classes and lets later Tailwind utilities win", () => {
  expect(cn("px-2 text-sm", false, undefined, { hidden: false, block: true }, "px-4")).toBe("text-sm block px-4");
});
