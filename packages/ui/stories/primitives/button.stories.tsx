import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconX } from "@tabler/icons-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "@fleet-platform/ui/components/button";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

const meta = {
  title: "Primitives/Button",
  component: Button,
  args: { children: "Policz wycenę", onClick: fn() },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "text"] },
    size: { control: "inline-radio", options: ["default", "compact", "icon", "icon-compact"] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => <div className="flex flex-wrap items-center gap-group">
    <Button>Policz wycenę</Button>
    <Button variant="secondary">Zapisz jako wariant</Button>
    <Button variant="text">Pokaż źródła</Button>
  </div>,
};

export const Sizes: Story = {
  render: () => <div className="flex flex-wrap items-center gap-group">
    <Button>Przyjmij ładunek</Button>
    <Button size="compact" variant="secondary">Popraw</Button>
    <Button size="icon" variant="secondary" aria-label="Zamknij"><IconX aria-hidden /></Button>
    <Button size="icon-compact" variant="text" aria-label="Usuń filtr: Zestaw 03"><IconX aria-hidden /></Button>
  </div>,
};

const states = [
  { name: "Default", props: {} },
  { name: "Hover", props: { "data-preview-state": "hover" } },
  { name: "Focus", props: { "data-preview-state": "focus" } },
  { name: "Pressed", props: { "data-preview-state": "active" } },
  { name: "Disabled, with reason", props: { disabled: true, "aria-describedby": "powod-blokady" } },
  { name: "Saving", props: { disabled: true, "aria-busy": true }, label: "Zapisywanie…" },
] as const;

/** Hover, focus and pressed are frozen previews with the same declarations as the real states. */
export const States: Story = {
  render: () => <div className="flex flex-col gap-between">
    <table className="border-collapse text-table">
      <thead><tr><th scope="col" className="px-group text-left text-body-strong">State</th>{(["primary", "secondary", "text"] as const).map(v => <th key={v} scope="col" className="px-group text-left text-body-strong">{v}</th>)}</tr></thead>
      <tbody>{states.map(state => <tr key={state.name}>
        <th scope="row" className="px-group py-group text-left text-table">{state.name}</th>
        {(["primary", "secondary", "text"] as const).map(variant => <td key={variant} className="px-group py-group">
          <Button variant={variant} {...state.props}>{"label" in state ? state.label : "Przyjmij ładunek"}</Button>
        </td>)}
      </tr>)}</tbody>
    </table>
    <p id="powod-blokady" className="max-w-measure text-meta">Przyjęcie jest niedostępne: wycena jest nieaktualna. Policz ją ponownie.</p>
  </div>,
};

export const LongLabelNarrow: Story = {
  name: "Long label at 320 px",
  render: () => <div className="flex w-80 flex-col items-start gap-group">
    <Button>Przyjmij ładunek mimo straty i zapisz powód</Button>
    <Button variant="secondary">Porównaj warianty kursu dla tego samego zestawu</Button>
  </div>,
};

export const ClickAndKeyboard: Story = {
  name: "Test: click and keyboard",
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Policz wycenę" });
    await userEvent.click(button);
    button.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    await expect(args.onClick).toHaveBeenCalledTimes(3);
    await expect(button).toHaveAttribute("type", "button");
  },
};

export const DisabledDoesNothing: Story = {
  name: "Test: disabled does not act",
  args: { disabled: true, children: "Przyjmij ładunek" },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Przyjmij ładunek" });
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const TextSpacing: Story = {
  name: "Test: text spacing (WCAG 1.4.12)",
  render: LongLabelNarrow.render,
  play: async ({ canvasElement }) => {
    applyTextSpacing(canvasElement);
    await expect(findTextSpacingFailures(canvasElement)).toEqual([]);
  },
};
