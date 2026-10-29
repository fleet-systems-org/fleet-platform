// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";

afterEach(cleanup);

function CancelTrip({ showCloseButton }: { showCloseButton?: boolean }) {
  return <Dialog>
    <DialogTrigger>Anuluj kurs</DialogTrigger>
    <DialogContent showCloseButton={showCloseButton}>
      <DialogHeader>
        <DialogTitle>Anulować przyjęty kurs?</DialogTitle>
        <DialogDescription>Dowody kursu zostaną zachowane.</DialogDescription>
      </DialogHeader>
      <DialogFooter><DialogClose>Wróć</DialogClose></DialogFooter>
    </DialogContent>
  </Dialog>;
}

it("opens a named, described modal dialog inside a scrolling overlay and closes it from the corner button", () => {
  render(<CancelTrip />);
  fireEvent.click(screen.getByRole("button", { name: "Anuluj kurs" }));
  const dialog = screen.getByRole("dialog", { name: "Anulować przyjęty kurs?" });
  expect(document.getElementById(dialog.getAttribute("aria-describedby")!)!.textContent).toBe("Dowody kursu zostaną zachowane.");
  expect(dialog.parentElement!.dataset.slot).toBe("dialog-overlay");
  expect(dialog.className).toContain("shadow-overlay");
  expect(dialog.parentElement!.className).toContain("animate-overlay-in");
  fireEvent.click(screen.getByRole("button", { name: "Zamknij" }));
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("can leave out the corner button and still closes from the footer", () => {
  render(<CancelTrip showCloseButton={false} />);
  fireEvent.click(screen.getByRole("button", { name: "Anuluj kurs" }));
  expect(screen.queryByRole("button", { name: "Zamknij" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Wróć" }));
  expect(screen.queryByRole("dialog")).toBeNull();
});
