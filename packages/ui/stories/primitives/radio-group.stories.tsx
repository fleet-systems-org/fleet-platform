import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@fleet-platform/ui/components/button";
import { Field } from "@fleet-platform/ui/components/field";
import { Input } from "@fleet-platform/ui/components/input";
import { RadioGroup, RadioGroupItem } from "@fleet-platform/ui/components/radio-group";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

const meta = {
  title: "Primitives/Radio group",
  component: RadioGroup,
  args: { onValueChange: fn(), disabled: false },
  argTypes: { value: { control: false }, children: { control: false } },
  render: args => <Field label="Mycie cysterny" required>
    <RadioGroup {...args}>
      <RadioGroupItem value="none" label="Bez mycia" />
      <RadioGroupItem value="ours" label="Nasze mycie" hint="Koszt przewoźnika; wpisz kwotę i datę mycia" />
    </RadioGroup>
  </Field>,
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const weekendQuestion = <Field label="Co kierowca robi w weekend?" hint="Kurs obejmuje sobotę lub niedzielę; zapytaj kierowcę" required>
  <RadioGroup>
    <RadioGroupItem value="homePoland" label="Wraca do domu w Polsce" hint="Bez kosztu pracy za weekend; koszt pojazdu liczy się dalej" />
    <RadioGroupItem value="restAbroad" label="Odpoczywa za granicą" hint="Stała kwota za każdy dzień weekendu, którego dotyka kurs" />
    <RadioGroupItem value="drivingOn" label="Jedzie dalej" hint="Zwykły koszt pracy za cały czas kursu" />
  </RadioGroup>
</Field>;

/** WKD-1: one choice for every weekend in the quote; no default. Option names follow R13 (proposal wording). */
export const Weekend: Story = {
  name: "Weekend case (three options)",
  render: () => weekendQuestion,
};

/** Hover and focus are frozen previews with the same declarations as the real states. */
export const States: Story = {
  render: () => <div className="grid gap-between">
    <Field label="Bez wyboru (domyślne)" required><RadioGroup><RadioGroupItem value="none" label="Bez mycia" /><RadioGroupItem value="ours" label="Nasze mycie" /></RadioGroup></Field>
    <Field label="Wybrane" required><RadioGroup defaultValue="ours"><RadioGroupItem value="none" label="Bez mycia" /><RadioGroupItem value="ours" label="Nasze mycie" /></RadioGroup></Field>
    <Field label="Najechanie i fokus (podgląd)" required><RadioGroup><RadioGroupItem value="none" label="Bez mycia" data-preview-state="hover" /><RadioGroupItem value="ours" label="Nasze mycie" data-preview-state="focus" /></RadioGroup></Field>
    <Field label="Błąd" error="Wybierz „Bez mycia” albo „Nasze mycie”. Bez odpowiedzi wycena nie zostanie policzona." required><RadioGroup><RadioGroupItem value="none" label="Bez mycia" /><RadioGroupItem value="ours" label="Nasze mycie" /></RadioGroup></Field>
    <Field label="Zablokowane" hint="Kurs jest przyjęty; zmiana wymaga korekty z powodem" required><RadioGroup disabled defaultValue="none"><RadioGroupItem value="none" label="Bez mycia" /><RadioGroupItem value="ours" label="Nasze mycie" /></RadioGroup></Field>
  </div>,
};

export const LongTextNarrow: Story = {
  name: "Long text at 320 px",
  render: () => <div className="w-80">{weekendQuestion}</div>,
};

const onQuote = fn();

function WashQuestion() {
  const [wash, setWash] = useState<string>();
  const [error, setError] = useState<string>();
  return <form className="flex max-w-measure flex-col gap-between" onSubmit={event => { event.preventDefault(); if (!wash) setError("Wybierz „Bez mycia” albo „Nasze mycie”. Bez odpowiedzi wycena nie zostanie policzona."); else onQuote(); }}>
    <Field label="Mycie cysterny" error={error} required>
      <RadioGroup value={wash} onValueChange={value => { setWash(value); setError(undefined); }}>
        <RadioGroupItem value="none" label="Bez mycia" />
        <RadioGroupItem value="ours" label="Nasze mycie" hint="Koszt przewoźnika; wpisz kwotę i datę mycia" />
      </RadioGroup>
    </Field>
    {wash === "ours" ? <Field label="Kwota mycia (EUR)" hint="Kwota netto, np. 5,00" required><Input inputMode="decimal" /></Field> : null}
    <div><Button type="submit">Policz wycenę</Button></div>
  </form>;
}

export const WashKeyboardAndValidation: Story = {
  name: "Test: wash answer, keyboard and validation",
  render: () => <WashQuestion />,
  play: async ({ canvasElement }) => {
    onQuote.mockClear();
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Policz wycenę" }));
    const group = canvas.getByRole("radiogroup", { name: "Mycie cysterny" });
    await expect(group).toHaveAttribute("aria-invalid", "true");
    await expect(onQuote).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByText("Nasze mycie"));
    await expect(canvas.getByRole("radio", { name: "Nasze mycie" })).toBeChecked();
    await expect(group).not.toHaveAttribute("aria-invalid");
    await expect(canvas.getByLabelText("Kwota mycia (EUR)")).toBeVisible();
    canvas.getByRole("radio", { name: "Nasze mycie" }).focus();
    // Radix moves focus on the next tick; hold the key as a person does, so the move also checks the option.
    await userEvent.keyboard("{ArrowUp>}");
    await waitFor(() => expect(canvas.getByRole("radio", { name: "Bez mycia" })).toBeChecked());
    await userEvent.keyboard("{/ArrowUp}");
    await expect(canvas.queryByLabelText("Kwota mycia (EUR)")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Policz wycenę" }));
    await expect(onQuote).toHaveBeenCalledTimes(1);
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
