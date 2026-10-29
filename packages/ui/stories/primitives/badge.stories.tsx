import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconCircleCheck, IconCircleDashed, IconCircleOff } from "@tabler/icons-react";
import { expect, within } from "storybook/test";
import { Badge } from "@fleet-platform/ui/components/badge";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  args: { children: "Szacunek", variant: "estimate" },
  argTypes: { variant: { control: "inline-radio", options: ["neutral", "estimate", "loss"] } },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => <div className="flex flex-wrap items-center gap-group">
    <Badge>Plan</Badge>
    <Badge variant="estimate">Szacunek</Badge>
    <Badge variant="loss">Strata</Badge>
  </div>,
};

/** Fleet (Phase 2): three distinct words and icons; missing telematics evidence never gives a green badge. */
export const KilometreCheck: Story = {
  name: "Kilometre check statuses",
  render: () => <div className="flex flex-wrap items-center gap-group">
    <Badge><IconCircleCheck aria-hidden />Zgodne</Badge>
    <Badge><IconCircleDashed aria-hidden />Niezweryfikowane</Badge>
    <Badge><IconCircleOff aria-hidden />Brak danych</Badge>
  </div>,
};

/** A badge sits next to the value it qualifies, in the same row. */
export const NextToValue: Story = {
  name: "Next to a value",
  render: () => <dl className="grid w-fit grid-cols-2 items-center gap-x-between gap-y-group">
    <dt className="text-label">Paliwo</dt><dd className="flex items-center gap-group"><span className="text-number">18,00 EUR</span><Badge variant="estimate">Szacunek</Badge></dd>
    <dt className="text-label">Wynik kursu</dt><dd className="flex items-center gap-group"><span className="text-number text-loss">−12,40 EUR</span><Badge variant="loss">Strata</Badge></dd>
  </dl>,
};

export const LongTextNarrow: Story = {
  name: "Long text at 320 px",
  render: () => <div className="w-80"><Badge variant="estimate">Szacunek: cena z biuletynu Komisji Europejskiej sprzed 9 dni</Badge></div>,
};

export const WordsNotColour: Story = {
  name: "Test: statuses differ by word and icon",
  render: KilometreCheck.render,
  play: async ({ canvasElement }) => {
    const badges = [...canvasElement.querySelectorAll<HTMLElement>("[data-slot=badge]")];
    await expect(badges.map(badge => badge.textContent)).toEqual(["Zgodne", "Niezweryfikowane", "Brak danych"]);
    await expect(new Set(badges.map(badge => badge.querySelector("svg")!.getAttribute("class"))).size).toBe(3);
    await expect(new Set(badges.map(badge => getComputedStyle(badge).backgroundColor)).size).toBe(1);
    await expect(within(canvasElement).getByText("Zgodne")).toBeVisible();
  },
};

export const TokenColours: Story = {
  name: "Test: text colour comes from the variant",
  render: Variants.render,
  play: async ({ canvasElement }) => {
    const colour = (text: string) => getComputedStyle(within(canvasElement).getByText(text)).color;
    const token = (name: string) => {
      const probe = canvasElement.ownerDocument.createElement("span");
      probe.style.color = `var(${name})`;
      canvasElement.append(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return value;
    };
    // The text role (text-label) carries a muted colour; the variant colour must win over it.
    await expect(colour("Strata")).toBe(token("--status-loss-text"));
    await expect(colour("Szacunek")).toBe(token("--badge-estimate-text"));
    await expect(colour("Plan")).toBe(token("--text-default"));
  },
};

export const TextSpacing: Story = {
  name: "Test: text spacing (WCAG 1.4.12)",
  render: LongTextNarrow.render,
  play: async ({ canvasElement }) => {
    applyTextSpacing(canvasElement);
    await expect(findTextSpacingFailures(canvasElement)).toEqual([]);
  },
};
