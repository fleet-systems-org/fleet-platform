import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@fleet-platform/ui/components/alert-dialog";
import { Button } from "@fleet-platform/ui/components/button";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

const discard = fn();

function DiscardDraftContent() {
  return <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Usunąć szkic kursu?</AlertDialogTitle>
      <AlertDialogDescription>Szkic nie był przyjęty, więc zniknie razem z wyceną. Tego nie da się cofnąć.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Zostaw szkic</AlertDialogCancel>
      <AlertDialogAction onClick={discard}>Usuń szkic</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>;
}

const meta = {
  title: "Primitives/Alert dialog",
  component: AlertDialog,
  argTypes: { open: { control: false }, children: { control: false } },
  render: args => <AlertDialog {...args}>
    <AlertDialogTrigger asChild><Button variant="secondary">Usuń szkic</Button></AlertDialogTrigger>
    <DiscardDraftContent />
  </AlertDialog>,
} satisfies Meta<typeof AlertDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Open: Story = {
  name: "Open: discard a draft",
  parameters: {
    docs: { story: { inline: false, iframeHeight: 300 } },
    // Same focus-trap exception as Dialog and Select (aria-hidden-focus).
    a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } },
  },
  render: () => <AlertDialog defaultOpen><DiscardDraftContent /></AlertDialog>,
};

export const Keyboard: Story = {
  name: "Test: Enter keeps the draft",
  play: async ({ canvasElement }) => {
    discard.mockClear();
    const trigger = within(canvasElement).getByRole("button", { name: "Usuń szkic" });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("alertdialog", { name: "Usunąć szkic kursu?" });
    // Focus starts on the safe answer, so a quick Enter never deletes anything.
    await expect(within(dialog).getByRole("button", { name: "Zostaw szkic" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    await expect(discard).not.toHaveBeenCalled();
    await expect(trigger).toHaveFocus();
    // A click outside does not close it: the dispatcher must answer.
    await userEvent.click(trigger);
    const reopened = await screen.findByRole("alertdialog");
    await userEvent.click(document.body, { pointerEventsCheck: 0 });
    await expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    await userEvent.click(within(reopened).getByRole("button", { name: "Usuń szkic" }));
    await expect(discard).toHaveBeenCalledOnce();
  },
};

export const TextSpacing: Story = {
  name: "Test: text spacing (WCAG 1.4.12)",
  parameters: Open.parameters,
  render: Open.render,
  play: async () => {
    const dialog = await screen.findByRole("alertdialog");
    applyTextSpacing(dialog);
    await expect(findTextSpacingFailures(dialog)).toEqual([]);
  },
};
