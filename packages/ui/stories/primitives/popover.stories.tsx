import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { Badge } from "@fleet-platform/ui/components/badge";
import { Button } from "@fleet-platform/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@fleet-platform/ui/components/popover";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";
import { waitForFocusReturn } from "../../.storybook/overlay";

/** Synthetic example of value details (EV-4): whole kilometres on screen, the exact value only here (R11). */
function DistanceDetails({ open }: { open?: boolean }) {
  return <Popover defaultOpen={open}>
    <PopoverTrigger asChild><Button variant="text" className="text-number">1 235 km</Button></PopoverTrigger>
    <PopoverContent aria-label="Szczegóły: dystans kursu">
      <dl className="grid gap-group">
        <div className="grid gap-tight"><dt className="text-label">Dokładna wartość</dt><dd className="text-number">1 234,567 km</dd></div>
        <div className="grid gap-tight"><dt className="text-label">Źródło</dt><dd className="text-table">Trasa wyznaczona przez dostawcę map, 28.10.2026</dd></div>
        <div className="grid gap-tight"><dt className="text-label">Podział na kraje</dt><dd className="text-table">Polska 412,300 km, Niemcy 822,267 km</dd></div>
      </dl>
    </PopoverContent>
  </Popover>;
}

const meta = {
  title: "Primitives/Popover",
  component: Popover,
  argTypes: { open: { control: false }, children: { control: false } },
  render: () => <DistanceDetails />,
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Open: Story = {
  name: "Open: details of a value",
  parameters: { docs: { story: { inline: false, iframeHeight: 260 } } },
  render: () => <DistanceDetails open />,
};

export const Estimate: Story = {
  name: "Open: details of an estimate",
  parameters: { docs: { story: { inline: false, iframeHeight: 260 } } },
  render: () => <Popover defaultOpen>
    <PopoverTrigger asChild><Button variant="text" className="text-number">1 840,00 EUR</Button></PopoverTrigger>
    <PopoverContent aria-label="Szczegóły: koszt paliwa">
      <div className="grid gap-group">
        <Badge variant="estimate">Szacunek</Badge>
        <p className="text-body">Brak tankowań w Niemczech z ostatnich 14 dni. Cena paliwa pochodzi z tygodniowego biuletynu cen paliw Komisji Europejskiej z 27.10.2026, przeliczona na netto.</p>
      </div>
    </PopoverContent>
  </Popover>,
};

export const Keyboard: Story = {
  name: "Test: click and keyboard",
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "1 235 km" });
    await userEvent.click(trigger);
    const panel = await screen.findByRole("dialog", { name: "Szczegóły: dystans kursu" });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toHaveClass("shadow-overlay");
    // Overlays fade in over motion-overlay, 110 ms (Q5b, T7).
    await expect(getComputedStyle(panel).animationDuration).toBe("0.11s");
    await waitFor(() => expect(within(panel).getByText("1 234,567 km")).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitForFocusReturn(trigger);
    await userEvent.keyboard("{Enter}");
    await screen.findByRole("dialog");
    await userEvent.click(canvasElement);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  },
};

export const TextSpacing: Story = {
  name: "Test: text spacing (WCAG 1.4.12)",
  parameters: Open.parameters,
  render: Open.render,
  play: async () => {
    const panel = await screen.findByRole("dialog");
    applyTextSpacing(panel);
    await expect(findTextSpacingFailures(panel)).toEqual([]);
  },
};
