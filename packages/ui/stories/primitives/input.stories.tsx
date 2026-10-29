import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Field } from "@fleet-platform/ui/components/field";
import { Input } from "@fleet-platform/ui/components/input";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

const meta = {
  title: "Primitives/Input",
  component: Input,
  args: { "aria-label": "Miejsce załadunku", placeholder: "np. Płock" },
  decorators: [Story => <div className="max-w-measure"><Story /></div>],
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Types: Story = {
  render: () => <div className="grid gap-between">
    <Field label="Miejsce załadunku" required><Input placeholder="np. Płock" /></Field>
    <Field label="Fracht (EUR)" hint="Kwota netto, np. 1850,00" required><Input inputMode="decimal" /></Field>
    <Field label="Dojazd (km)" hint="Liczba całkowita" required><Input inputMode="numeric" defaultValue="120" /></Field>
  </div>,
};

export const States: Story = {
  render: () => <div className="grid gap-between">
    <Field label="Domyślne" required><Input /></Field>
    <Field label="Wpisana wartość" required><Input defaultValue="Płock" /></Field>
    <Field label="Fokus (podgląd)" required><Input data-preview-state="focus" defaultValue="Płock" /></Field>
    <Field label="Błąd" error="Wybierz miejsce z listy albo wpisz pełną nazwę miejscowości." required><Input defaultValue="Pł" /></Field>
    <Field label="Tylko do odczytu" hint="Wynika z poprzedniego kursu" required><Input readOnly defaultValue="Poznań" /></Field>
    <Field label="Zablokowane" hint="Dostępne po wybraniu „Nasze mycie”" required><Input disabled /></Field>
  </div>,
};

export const LongValueNarrow: Story = {
  name: "Long value at 320 px",
  render: () => <div className="w-80"><Field label="Miejsce rozładunku" required><Input defaultValue="Kędzierzyn-Koźle, strefa przemysłowa, brama nr 4 od strony bocznicy" /></Field></div>,
};

export const Typing: Story = {
  name: "Test: typing keeps the value",
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox", { name: "Miejsce załadunku" });
    await userEvent.type(input, "Płock");
    await expect(input).toHaveValue("Płock");
  },
};

export const TextSpacing: Story = {
  name: "Test: text spacing (WCAG 1.4.12)",
  render: LongValueNarrow.render,
  play: async ({ canvasElement }) => {
    applyTextSpacing(canvasElement);
    await expect(findTextSpacingFailures(canvasElement)).toEqual([]);
  },
};
