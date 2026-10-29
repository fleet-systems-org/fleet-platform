import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconDots, IconPencil } from "@tabler/icons-react";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@fleet-platform/ui/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@fleet-platform/ui/components/tooltip";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

/** The visible name of an icon button. The button keeps its own aria-label; the tooltip adds nothing new. */
function IconAction({ label, icon, open }: { label: string; icon: React.ReactNode; open?: boolean }) {
  return <Tooltip defaultOpen={open}>
    <TooltipTrigger asChild><Button variant="secondary" size="icon" aria-label={label}>{icon}</Button></TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>;
}

const meta = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  argTypes: { open: { control: false }, children: { control: false } },
  render: () => <div className="flex gap-group">
    <IconAction label="Popraw kurs" icon={<IconPencil aria-hidden />} />
    <IconAction label="Akcje kursu" icon={<IconDots aria-hidden />} />
  </div>,
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Open: Story = {
  name: "Open: name of an icon button",
  parameters: { docs: { story: { inline: false, iframeHeight: 120 } } },
  render: () => <div className="p-section"><IconAction label="Popraw kurs" icon={<IconPencil aria-hidden />} open /></div>,
};

export const HoverFocusEscape: Story = {
  name: "Test: hover, focus and Escape (WCAG 1.4.13)",
  play: async ({ canvasElement }) => {
    const edit = within(canvasElement).getByRole("button", { name: "Popraw kurs" });
    await userEvent.hover(edit);
    await expect(await screen.findByRole("tooltip")).toHaveTextContent("Popraw kurs");
    await userEvent.unhover(edit);
    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
    // Keyboard focus shows the same name; Escape hides it without moving focus.
    await userEvent.tab();
    await expect(edit).toHaveFocus();
    await expect(await screen.findByRole("tooltip")).toHaveTextContent("Popraw kurs");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
    await expect(edit).toHaveFocus();
  },
};

export const TextSpacing: Story = {
  name: "Test: text spacing (WCAG 1.4.12)",
  parameters: Open.parameters,
  render: Open.render,
  play: async () => {
    const tip = await screen.findByRole("tooltip");
    const content = tip.parentElement!;
    applyTextSpacing(content);
    await expect(findTextSpacingFailures(content)).toEqual([]);
  },
};
