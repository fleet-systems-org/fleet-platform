import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { LoadingMessage } from "@fleet-platform/ui/backend/feedback/LoadingMessage";
import { Skeleton } from "@fleet-platform/ui/components/skeleton";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

const meta = {
  title: "Primitives/Skeleton",
  component: Skeleton,
  args: { className: "h-row w-40" },
  argTypes: { className: { control: "text" } },
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const parts = ["Koszt", "Fracht", "Wynik"];

/** The result bar while the quote is calculated: real labels stay, only the values wait (R07.1). */
export const ResultBar: Story = {
  name: "Result bar while the quote is calculated",
  render: () => <section aria-labelledby="result-title" aria-busy="true" className="grid max-w-measure gap-group rounded-panel border border-divider bg-panel p-panel">
    <h2 id="result-title" className="text-section-title">Wynik wyceny</h2>
    <div className="grid grid-cols-3 gap-between">
      {parts.map(part => <div key={part} className="grid gap-tight">
        <span className="text-label">{part}</span>
        <Skeleton className="h-row w-full" />
      </div>)}
    </div>
    <LoadingMessage>Liczę wycenę. Wynik pojawi się tutaj, gdy trasa i ceny będą gotowe.</LoadingMessage>
  </section>,
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole("region", { name: "Wynik wyceny" });
    await expect(region).toHaveAttribute("aria-busy", "true");
    await expect(within(region).getByRole("status")).toHaveTextContent("Liczę wycenę.");
    for (const placeholder of canvasElement.querySelectorAll("[data-slot=skeleton]")) {
      await expect(placeholder).toHaveAttribute("aria-hidden", "true");
      // Still: no pulse or shimmer (Q5b).
      await expect(getComputedStyle(placeholder).animationName).toBe("none");
    }
  },
};

export const TextSpacing: Story = {
  name: "Test: text spacing (WCAG 1.4.12)",
  render: () => <div className="w-80">{ResultBar.render!({} as never, {} as never)}</div>,
  play: async ({ canvasElement }) => {
    applyTextSpacing(canvasElement);
    await expect(findTextSpacingFailures(canvasElement)).toEqual([]);
  },
};
