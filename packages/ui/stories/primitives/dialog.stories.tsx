import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@fleet-platform/ui/components/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@fleet-platform/ui/components/dialog";
import { Field } from "@fleet-platform/ui/components/field";
import { Textarea } from "@fleet-platform/ui/components/textarea";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

// While a modal is open, Radix hides the rest of the page with aria-hidden and traps focus in the dialog, so the hidden
// trigger cannot receive focus. axe cannot see the trap in a static open state (aria-hidden-focus); same exception as Select.
const openParameters = {
  docs: { story: { inline: false, iframeHeight: 460 } },
  a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } },
};

function CancelTripContent({ error }: { error?: string }) {
  return <DialogContent>
    <DialogHeader>
      <DialogTitle>Anulować przyjęty kurs?</DialogTitle>
      <DialogDescription>Dowody i przyjęta wycena zostaną zachowane. Nieprzyjęte wyceny następnych kursów tego zestawu staną się nieaktualne.</DialogDescription>
    </DialogHeader>
    <Field label="Powód anulowania" hint="Krótko, np. klient odwołał ładunek" error={error} required>
      <Textarea />
    </Field>
    <DialogFooter>
      <DialogClose asChild><Button variant="secondary">Wróć do kursu</Button></DialogClose>
      <Button>Anuluj kurs</Button>
    </DialogFooter>
  </DialogContent>;
}

const meta = {
  title: "Primitives/Dialog",
  component: Dialog,
  argTypes: { open: { control: false }, children: { control: false } },
  render: args => <Dialog {...args}>
    <DialogTrigger asChild><Button variant="secondary">Anuluj kurs</Button></DialogTrigger>
    <CancelTripContent />
  </Dialog>,
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Open: Story = {
  name: "Open: cancel an accepted trip",
  parameters: openParameters,
  render: () => <Dialog defaultOpen><CancelTripContent /></Dialog>,
};

export const WithError: Story = {
  name: "Open: loss reason with an error",
  parameters: openParameters,
  render: () => <Dialog defaultOpen>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Przyjąć kurs ze stratą?</DialogTitle>
        <DialogDescription>Wynik wyceny jest ujemny. Kurs ze stratą przyjmiesz tylko z krótkim powodem.</DialogDescription>
      </DialogHeader>
      <Field label="Powód przyjęcia straty" error="Wpisz powód przyjęcia straty. Bez niego kursu nie da się przyjąć." required>
        <Textarea />
      </Field>
      <DialogFooter>
        <DialogClose asChild><Button variant="secondary">Wróć do wyceny</Button></DialogClose>
        <Button>Przyjmij kurs</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>,
};

export const Keyboard: Story = {
  name: "Test: focus and keyboard",
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Anuluj kurs" });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Anulować przyjęty kurs?" });
    // Focus starts on the first field, so the dispatcher can type the reason at once.
    await expect(within(dialog).getByRole("textbox", { name: "Powód anulowania" })).toHaveFocus();
    await expect(dialog).toHaveClass("shadow-overlay");
    // Tab stays inside the dialog: reason, back, cancel trip, close, then the reason again.
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await expect(within(dialog).getByRole("button", { name: "Zamknij" })).toHaveFocus();
    await userEvent.tab();
    await expect(within(dialog).getByRole("textbox", { name: "Powód anulowania" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await expect(trigger).toHaveFocus();
    // The dialog fits the viewport with the overlay's 16 px margin on each side.
    await userEvent.click(trigger);
    const reopened = await screen.findByRole("dialog");
    await expect(reopened.getBoundingClientRect().right).toBeLessThanOrEqual(window.innerWidth - 16);
    await userEvent.click(within(reopened).getByRole("button", { name: "Wróć do kursu" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    // A click on the scrim closes it as well.
    await userEvent.click(trigger);
    const scrim = (await screen.findByRole("dialog")).parentElement!;
    await userEvent.click(scrim);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  },
};

export const TextSpacing: Story = {
  name: "Test: text spacing (WCAG 1.4.12)",
  parameters: openParameters,
  render: Open.render,
  play: async () => {
    const dialog = await screen.findByRole("dialog");
    applyTextSpacing(dialog);
    await expect(findTextSpacingFailures(dialog)).toEqual([]);
  },
};
