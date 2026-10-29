import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { EvidenceBadge } from "@fleet-platform/ui/components/values/evidence-badge";
import { evidenceBadgeLabels as labels } from "./labels";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

const meta = {
  title: "Product/Values/Evidence badge",
  component: EvidenceBadge,
  args: { labels, state: "known", certainty: "estimated" },
  argTypes: {
    phase: { control: "select", options: [undefined, "plan", "actual"] },
    state: { control: "select", options: ["known", "missing", "conflicting"] },
    certainty: { control: "select", options: [undefined, "certain", "estimated"] },
  },
} satisfies Meta<typeof EvidenceBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Every state with its words; a certain known value has no badge (P4). */
export const States: Story = {
  render: () => <dl className="grid w-fit grid-cols-2 items-center gap-x-between gap-y-group">
    <dt className="text-label">Pewne</dt><dd className="text-meta">(bez odznaki)<EvidenceBadge certainty="certain" labels={labels} /></dd>
    <dt className="text-label">Szacunek</dt><dd><EvidenceBadge certainty="estimated" labels={labels} /></dd>
    <dt className="text-label">Brak</dt><dd><EvidenceBadge state="missing" labels={labels} /></dd>
    <dt className="text-label">Sprzeczne</dt><dd><EvidenceBadge state="conflicting" labels={labels} /></dd>
    <dt className="text-label">Plan</dt><dd><EvidenceBadge phase="plan" labels={labels} /></dd>
  </dl>,
};

/** History beside a quote: an invoice row is an estimate, an entered-trip row is a plan (spec: History, EV-2). Numbers are synthetic. */
export const HistoryRows: Story = {
  name: "History rows",
  render: () => <table className="w-full max-w-measure text-table">
    <thead><tr className="border-b border-divider text-left"><th className="py-tight">Trasa</th><th>Data</th><th className="text-right">Cena</th><th className="pl-group">Pewność</th></tr></thead>
    <tbody>
      <tr className="border-b border-divider"><td className="py-tight">Miasto A → Miasto B</td><td>02.10.2026</td><td className="text-right text-number">1 850,00 EUR</td><td className="pl-group"><EvidenceBadge phase="actual" certainty="estimated" labels={labels} /></td></tr>
      <tr className="border-b border-divider"><td className="py-tight">Miasto A → Miasto B</td><td>21.10.2026</td><td className="text-right text-number">1 900,00 EUR</td><td className="pl-group"><EvidenceBadge phase="plan" labels={labels} /></td></tr>
    </tbody>
  </table>,
};

export const Words: Story = {
  name: "Test: words, no green, icons only beside words",
  render: States.render,
  play: async ({ canvasElement }) => {
    const badges = [...canvasElement.querySelectorAll<HTMLElement>("[data-slot=badge]")];
    await expect(badges.map(badge => badge.textContent)).toEqual(["Szacunek", "Brak danych", "Sprzeczne dane", "Plan"]);
    // Missing and conflicting share the neutral look of unchecked states and differ by word and icon.
    await expect(getComputedStyle(badges[1]!).backgroundColor).toBe(getComputedStyle(badges[3]!).backgroundColor);
    await expect(badges[1]!.querySelector("svg")!.getAttribute("class")).not.toBe(badges[2]!.querySelector("svg")!.getAttribute("class"));
    await expect(within(canvasElement).getByText("Brak danych")).toBeVisible();
  },
};

export const TextSpacing: Story = {
  name: "Test: text spacing (WCAG 1.4.12)",
  render: () => <div className="w-80"><EvidenceBadge phase="plan" state="conflicting" labels={labels} /></div>,
  play: async ({ canvasElement }) => {
    applyTextSpacing(canvasElement);
    await expect(findTextSpacingFailures(canvasElement)).toEqual([]);
  },
};
