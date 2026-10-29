import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { StepBar } from "@fleet-platform/ui/components/layout/step-bar";
import { quoteSteps } from "../product/labels";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

const meta = {
  title: "Product/Layout/Step bar",
  component: StepBar,
  args: { label: "Postęp wyceny", steps: quoteSteps, current: 1, doneText: "gotowe" },
  argTypes: { current: { control: { type: "range", min: 0, max: 3 } } },
} satisfies Meta<typeof StepBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Each position of the quote entry form, from the first step to the quote (N7a). */
export const Progress: Story = {
  render: args => <div className="flex flex-col gap-section">{quoteSteps.map((step, index) => <StepBar key={step} {...args} current={index} />)}</div>,
};

export const States: Story = {
  name: "Test: done, current and waiting steps",
  args: { current: 2 },
  play: async ({ canvasElement }) => {
    const steps = within(canvasElement).getAllByRole("listitem");
    await expect(steps.map(step => step.getAttribute("data-state"))).toEqual(["done", "done", "current", "waiting"]);
    await expect(steps[2]).toHaveAttribute("aria-current", "step");
    await expect(within(steps[0]!).getByText("— gotowe", { exact: false })).toBeInTheDocument();
    // The current and completed circles are filled with the action colour; a waiting circle is only outlined.
    const circle = (index: number) => getComputedStyle(steps[index]!.querySelector("[aria-hidden] > span:nth-child(2)")!).backgroundColor;
    await expect(circle(0)).toBe(circle(2));
    await expect(circle(3)).not.toBe(circle(2));
  },
};

export const TextSpacing: Story = {
  name: "Test: text spacing (WCAG 1.4.12)",
  render: args => <div className="w-80"><StepBar {...args} /></div>,
  play: async ({ canvasElement }) => {
    applyTextSpacing(canvasElement);
    await expect(findTextSpacingFailures(canvasElement)).toEqual([]);
  },
};
