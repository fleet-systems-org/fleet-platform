// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Skeleton } from "./skeleton";

afterEach(cleanup);

it("is a still, decorative placeholder sized by the caller", () => {
  const { container } = render(<Skeleton className="h-row w-40" />);
  const placeholder = container.firstElementChild as HTMLElement;
  expect(placeholder.getAttribute("aria-hidden")).toBe("true");
  expect(placeholder.className).toBe("rounded-control bg-divider h-row w-40");
});
