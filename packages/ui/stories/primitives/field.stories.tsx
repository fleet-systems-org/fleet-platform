import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Field } from "@fleet-platform/ui/components/field";
import { Input } from "@fleet-platform/ui/components/input";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

const meta = {
  title: "Primitives/Field",
  component: Field,
  args: { label: "Fracht (EUR)", hint: "Kwota netto uzgodniona z klientem, np. 1850,00", required: true, children: <Input inputMode="decimal" /> },
  argTypes: { children: { control: false }, error: { control: "text" }, optionalText: { control: "text" } },
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => <div className="grid max-w-measure gap-between">
    <Field label="Fracht (EUR)" required><Input inputMode="decimal" /></Field>
    <Field label="Fracht (EUR)" hint="Kwota netto, np. 1850,00" required><Input inputMode="decimal" defaultValue="1850,00" /></Field>
    <Field label="Fracht (EUR)" hint="Kwota netto, np. 1850,00" error="Nie rozpoznano kwoty. Wpisz ją cyframi, np. 1850,00 lub 1 850,00." required><Input inputMode="decimal" defaultValue="1.850,00" /></Field>
    <Field label="Numer zlecenia" optionalText="opcjonalne"><Input /></Field>
    <Field label="Miejsce rozładunku" hint="Ustalone przez poprzedni kurs" required><Input readOnly defaultValue="Poznań" /></Field>
    <Field label="Kwota mycia (EUR)" hint="Dostępne po wybraniu „Nasze mycie”" required><Input disabled inputMode="decimal" /></Field>
  </div>,
};

export const LongTextNarrow: Story = {
  name: "Long text at 320 px",
  render: () => <div className="w-80">
    <Field label="Powód przyjęcia ładunku mimo ujemnego wyniku kursu" hint="Krótko, jednym zdaniem: dlaczego firma przyjmuje ten kurs ze stratą" error="Podaj powód. Bez niego nie można przyjąć kursu ze stratą." required><Input /></Field>
  </div>,
};

function ValidatedFreight() {
  const [error, setError] = useState<string>();
  return <Field label="Fracht (EUR)" hint="Kwota netto, np. 1850,00" error={error} required>
    <Input inputMode="decimal" onBlur={event => setError(/^\d[\d ]*(,\d{1,2})?$/.test(event.target.value) ? undefined : "Nie rozpoznano kwoty. Wpisz ją cyframi, np. 1850,00.")} />
  </Field>;
}

export const ValidationOnBlur: Story = {
  name: "Test: validation after leaving the field",
  render: () => <ValidatedFreight />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Fracht (EUR)");
    await expect(input).toHaveAttribute("required");
    await userEvent.type(input, "abc");
    await userEvent.tab();
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAccessibleDescription("Kwota netto, np. 1850,00 Nie rozpoznano kwoty. Wpisz ją cyframi, np. 1850,00.");
    await userEvent.clear(input);
    await userEvent.type(input, "1850,00");
    await userEvent.tab();
    await expect(input).not.toHaveAttribute("aria-invalid");
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
