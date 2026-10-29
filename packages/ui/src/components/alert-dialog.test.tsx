// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";

afterEach(cleanup);

function DiscardDraft({ onDiscard }: { onDiscard: () => void }) {
  return <AlertDialog>
    <AlertDialogTrigger>Usuń szkic</AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Usunąć szkic kursu?</AlertDialogTitle>
        <AlertDialogDescription>Szkic nie był przyjęty. Po usunięciu nie da się go przywrócić.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Zostaw szkic</AlertDialogCancel>
        <AlertDialogAction onClick={onDiscard}>Usuń szkic</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
}

it("asks before an irreversible action, focuses the safe answer and has no corner button", () => {
  const onDiscard = vi.fn();
  render(<DiscardDraft onDiscard={onDiscard} />);
  fireEvent.click(screen.getByRole("button", { name: "Usuń szkic" }));
  const dialog = screen.getByRole("alertdialog", { name: "Usunąć szkic kursu?" });
  expect(document.getElementById(dialog.getAttribute("aria-describedby")!)!.textContent).toContain("nie da się go przywrócić");
  expect(screen.queryByRole("button", { name: "Zamknij" })).toBeNull();
  const cancel = screen.getByRole("button", { name: "Zostaw szkic" });
  expect(cancel.dataset.variant).toBe("secondary");
  expect(document.activeElement).toBe(cancel);
  const action = screen.getAllByRole("button", { name: "Usuń szkic" }).find(button => button.dataset.slot === "alert-dialog-action")!;
  expect(action.dataset.variant).toBe("primary");
  fireEvent.click(action);
  expect(onDiscard).toHaveBeenCalledOnce();
  expect(screen.queryByRole("alertdialog")).toBeNull();
});
