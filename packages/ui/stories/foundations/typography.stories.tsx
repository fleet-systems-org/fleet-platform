import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { TextSpacingSample } from "../../.storybook/blocks/tokens";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

const meta = { title: "Foundations/Typography", component: TextSpacingSample } satisfies Meta<typeof TextSpacingSample>;
export default meta;
type Story = StoryObj<typeof meta>;

/** WCAG 1.4.12: with the user's text spacing applied, no text is clipped or leaves its container (320 px). */
export const TextSpacing: Story = {
  name: "Text spacing (WCAG 1.4.12)",
  play: async ({ canvasElement }) => {
    // N2b: verify the rendered roles, including the unchanged heading hierarchy.
    for (const [role, weight] of [
      ["body", "500"], ["table", "500"], ["label", "500"],
      ["meta", "500"], ["number", "500"],
      ["page-title", "600"], ["section-title", "600"],
    ]) {
      const sample = canvasElement.querySelector(`.text-${role}`);
      await expect(sample).not.toBeNull();
      await expect(getComputedStyle(sample as Element).fontWeight).toBe(weight);
    }
    const remove = applyTextSpacing(canvasElement);
    const message = canvasElement.querySelector("p.text-body");
    await expect(message).not.toBeNull();
    await expect(getComputedStyle(message as Element).letterSpacing).toBe("1.68px");
    await expect(findTextSpacingFailures(canvasElement)).toEqual([]);
    remove();
  },
};
