import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconDots } from "@tabler/icons-react";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@fleet-platform/ui/components/alert-dialog";
import { Button } from "@fleet-platform/ui/components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@fleet-platform/ui/components/dropdown-menu";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

const correct = fn();
const cancel = fn();

function RowActions({ open }: { open?: boolean }) {
  return <DropdownMenu defaultOpen={open}>
    <DropdownMenuTrigger asChild><Button variant="secondary" size="icon" aria-label="Akcje kursu ZS 01"><IconDots aria-hidden /></Button></DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <DropdownMenuLabel>Kurs przyjęty</DropdownMenuLabel>
        <DropdownMenuItem onSelect={correct}>Popraw</DropdownMenuItem>
        <DropdownMenuItem onSelect={cancel}>Anuluj kurs</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled>Usuń szkic (tylko przed przyjęciem)</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;
}

const meta = {
  title: "Primitives/Dropdown menu",
  component: DropdownMenu,
  argTypes: { open: { control: false }, children: { control: false } },
  render: () => <div className="flex justify-end"><RowActions /></div>,
} satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Open: Story = {
  name: "Open: actions of an accepted trip",
  parameters: {
    docs: { story: { inline: false, iframeHeight: 240 } },
    // Same focus-trap exception as Select (aria-hidden-focus): the open menu hides and locks the page.
    a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } },
  },
  render: () => <div className="flex justify-end"><RowActions open /></div>,
};

/** A menu item that needs confirmation closes the menu and opens an alert dialog; focus returns to the menu button. */
export const OpensConfirmation: Story = {
  name: "Menu item opens a confirmation",
  render: function Render() {
    const [confirming, setConfirming] = useState(false);
    const menuButton = useRef<HTMLButtonElement>(null);
    return <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button ref={menuButton} variant="secondary" size="icon" aria-label="Akcje szkicu ZS 02"><IconDots aria-hidden /></Button></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Policz wycenę ponownie</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setConfirming(true)}>Usuń szkic…</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        {/* The dialog has no trigger of its own, so it returns focus to the menu button by hand. */}
        <AlertDialogContent onCloseAutoFocus={event => { event.preventDefault(); menuButton.current?.focus(); }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć szkic kursu?</AlertDialogTitle>
            <AlertDialogDescription>Szkic nie był przyjęty, więc zniknie razem z wyceną. Tego nie da się cofnąć.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Zostaw szkic</AlertDialogCancel><AlertDialogAction>Usuń szkic</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
  },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Akcje szkicu ZS 02" });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("menuitem", { name: "Usuń szkic…" }));
    const dialog = await screen.findByRole("alertdialog", { name: "Usunąć szkic kursu?" });
    await expect(screen.queryByRole("menu")).toBeNull();
    await userEvent.click(within(dialog).getByRole("button", { name: "Zostaw szkic" }));
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Keyboard: Story = {
  name: "Test: click and keyboard",
  play: async ({ canvasElement }) => {
    correct.mockClear();
    cancel.mockClear();
    const trigger = within(canvasElement).getByRole("button", { name: "Akcje kursu ZS 01" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const menu = await screen.findByRole("menu");
    await expect(menu).toHaveClass("shadow-overlay");
    await expect(screen.getByRole("menuitem", { name: "Popraw" })).toHaveFocus();
    // The arrows skip the disabled item and stop at the last enabled one (no wrap).
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    await expect(screen.getByRole("menuitem", { name: "Anuluj kurs" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(cancel).toHaveBeenCalledOnce();
    await waitFor(() => expect(trigger).toHaveFocus());
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("menuitem", { name: "Popraw" }));
    await expect(correct).toHaveBeenCalledOnce();
    await userEvent.click(trigger);
    await screen.findByRole("menu");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const TextSpacing: Story = {
  name: "Test: text spacing (WCAG 1.4.12)",
  parameters: Open.parameters,
  render: Open.render,
  play: async () => {
    const menu = await screen.findByRole("menu");
    applyTextSpacing(menu);
    await expect(findTextSpacingFailures(menu)).toEqual([]);
  },
};
