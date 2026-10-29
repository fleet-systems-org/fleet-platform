// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, it, vi } from "vitest";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";

beforeAll(() => {
  // jsdom has no layout APIs; the Radix popper measures the menu when open.
  globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
});
afterEach(cleanup);

it("lists the trip actions with a group label, a separator and a disabled action with its reason", () => {
  const onCorrect = vi.fn();
  render(<DropdownMenu open>
    <DropdownMenuTrigger>Akcje kursu</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <DropdownMenuLabel>Kurs przyjęty</DropdownMenuLabel>
        <DropdownMenuItem onSelect={onCorrect}>Popraw</DropdownMenuItem>
        <DropdownMenuItem>Anuluj kurs</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled>Usuń szkic (tylko przed przyjęciem)</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>);
  const menu = screen.getByRole("menu");
  // Row actions sit at the right end of a table row, so the menu lines up with the trigger's right edge.
  expect(menu.dataset.align).toBe("end");
  expect(menu.className).toContain("shadow-overlay");
  expect(screen.getByText("Kurs przyjęty").dataset.slot).toBe("dropdown-menu-label");
  expect(screen.getByRole("separator")).toBeTruthy();
  expect(screen.getByRole("menuitem", { name: "Usuń szkic (tylko przed przyjęciem)" }).getAttribute("aria-disabled")).toBe("true");
  fireEvent.click(screen.getByRole("menuitem", { name: "Popraw" }));
  expect(onCorrect).toHaveBeenCalledOnce();
});
