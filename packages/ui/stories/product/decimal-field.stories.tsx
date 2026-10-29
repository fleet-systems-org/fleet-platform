import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Field } from "@fleet-platform/ui/components/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@fleet-platform/ui/components/select";
import { DecimalField } from "@fleet-platform/ui/components/values/decimal-field";
import { decimalScales, type DecimalInputResult, type DecimalKind } from "@fleet-platform/ui/lib/decimal";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

// Messages the application maps from the field's reasons; the scale comes from the kind of value (FIN-3).
const messages: Record<Exclude<DecimalInputResult, { ok: true }>["reason"], string> = {
  empty: "Wpisz fracht uzgodniony z klientem.",
  format: "Nie rozpoznano kwoty. Wpisz ją cyframi, np. 1850,00.",
  negative: "Kwota nie może być ujemna. Wpisz ją bez minusa.",
  scale: "Kwota w EUR może mieć najwyżej 2 miejsca po przecinku. Popraw ją; wpisana wartość nie jest zaokrąglana.",
};

/** EUR amounts have 2 decimals; an amount in another source currency keeps its scale (owner decision 2026-10-29). */
const amountKind = (currency: string): DecimalKind => currency === "EUR" ? "eurAmount" : "amount";

/** Validates when the dispatcher leaves the field and shows the decimal string that would be sent. */
function FreightAmount({ initial = "", currency = "EUR" }: { initial?: string; currency?: string }) {
  const [text, setText] = useState(initial);
  const [result, setResult] = useState<DecimalInputResult | null>(null);
  return <div className="grid max-w-measure gap-group">
    <Field label="Fracht" hint="Kwota netto uzgodniona z klientem, np. 1850,00" error={result && !result.ok ? messages[result.reason] : undefined} required>
      <DecimalField kind={amountKind(currency)} unit={currency} value={text} onChange={event => setText(event.target.value)} onDecimalChange={setResult} />
    </Field>
    <output className="text-meta">{result?.ok ? `Wysłana wartość: "${result.value}"` : "Nic nie zostanie wysłane"}</output>
  </div>;
}

const meta = {
  title: "Product/Values/Decimal field",
  component: DecimalField,
  args: { kind: "eurAmount", unit: "EUR", disabled: false, placeholder: "" },
  argTypes: { kind: { control: "select", options: Object.keys(decimalScales) } },
  decorators: [Story => <div className="max-w-measure"><Story /></div>],
  render: args => <Field label="Kwota mycia" hint="Kwota netto za mycie po rozładunku" required><DecimalField {...args} /></Field>,
} satisfies Meta<typeof DecimalField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** MoneyInput: an amount with its source currency (E01). The unit follows the chosen currency. */
export const WithCurrency: Story = {
  name: "Amount with currency",
  render: function Render() {
    const [currency, setCurrency] = useState("EUR");
    return <div className="grid grid-cols-2 items-start gap-between">
      <Field label="Fracht" required><DecimalField kind={amountKind(currency)} unit={currency} defaultValue="1850,00" /></Field>
      <Field label="Waluta frachtu" required>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="EUR">EUR</SelectItem><SelectItem value="PLN">PLN</SelectItem></SelectContent>
        </Select>
      </Field>
    </div>;
  },
};

export const States: Story = {
  render: () => <div className="grid gap-between">
    <Field label="Pusty" required><DecimalField kind="eurAmount" unit="EUR" /></Field>
    <Field label="Wpisany" required><DecimalField kind="eurAmount" unit="EUR" defaultValue="1850,00" /></Field>
    <Field label="Błąd" error={messages.format} required><DecimalField kind="eurAmount" unit="EUR" defaultValue="18 5o,00" /></Field>
    <Field label="Zablokowany" hint="Dostępne po wybraniu „Nasze mycie”" required><DecimalField kind="eurAmount" unit="EUR" disabled /></Field>
  </div>,
};

/** Allowed decimal places by kind of value (FIN-3). Units are examples; the feature defines each field. */
export const Kinds: Story = {
  name: "Kinds and their decimal places",
  render: () => <div className="grid gap-between">
    <Field label="Kwota w EUR" hint="eurAmount: najwyżej 2 miejsca" required><DecimalField kind="eurAmount" unit="EUR" defaultValue="1850,00" /></Field>
    <Field label="Kwota w innej walucie" hint="amount: skala jak w dokumencie źródłowym" required><DecimalField kind="amount" unit="PLN" defaultValue="7850,00" /></Field>
    <Field label="Cena paliwa" hint="unitPrice: najwyżej 6 miejsc" required><DecimalField kind="unitPrice" unit="EUR/l" defaultValue="1,512340" /></Field>
    <Field label="Litry" hint="litres: najwyżej 3 miejsca" required><DecimalField kind="litres" unit="l" defaultValue="412,300" /></Field>
  </div>,
};

export const Validation: Story = {
  name: "Validation on leaving the field",
  render: () => <FreightAmount />,
};

export const Typing: Story = {
  name: "Test: comma, errors and the sent string",
  render: () => <FreightAmount />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Fracht" });
    await expect(input).toHaveAttribute("inputmode", "decimal");
    // Leaving the empty required field says what to enter.
    await userEvent.click(input);
    await userEvent.tab();
    await expect(input).toHaveAccessibleDescription(expect.stringContaining(messages.empty));
    // Too many decimals is rejected, never rounded (FIN-4).
    await userEvent.type(input, "1 850,005");
    await userEvent.tab();
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByText(messages.scale)).toBeVisible();
    await expect(canvas.getByRole("status", { hidden: true }).textContent ?? "").not.toContain("1850.01");
    // The Polish comma and the space are normalized as text; the sent value is a decimal string.
    await userEvent.clear(input);
    await userEvent.type(input, "1 850,5");
    await userEvent.tab();
    await expect(input).not.toHaveAttribute("aria-invalid");
    await expect(canvas.getByText('Wysłana wartość: "1850.5"')).toBeVisible();
    await expect(input).toHaveValue("1 850,5");
  },
};

export const TextSpacing: Story = {
  name: "Test: text spacing (WCAG 1.4.12)",
  render: () => <div className="w-80"><FreightAmount initial="1 850,005" /></div>,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox", { name: "Fracht" });
    input.focus();
    await userEvent.tab();
    applyTextSpacing(canvasElement);
    await expect(findTextSpacingFailures(canvasElement)).toEqual([]);
  },
};
