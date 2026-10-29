import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Field } from "@fleet-platform/ui/components/field";
import { ZonedDateTimeField, type ZonedDateTimeResult } from "@fleet-platform/ui/components/time/zoned-date-time-field";
import { zonedDateTimeLabels as labels } from "../product/labels";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

// Messages the application maps from the field's reasons (TIME-1).
const messages: Record<Exclude<ZonedDateTimeResult, { ok: true }>["reason"], string> = {
  empty: "Wpisz datę i godzinę załadunku.",
  missingDate: "Wybierz datę załadunku.",
  missingTime: "Wpisz godzinę załadunku.",
  invalidDate: "Nie rozpoznano daty. Wpisz ją jako dzień.miesiąc.rok, np. 12.11.2026.",
  invalidTime: "Nie rozpoznano godziny. Wpisz ją w formacie 24-godzinnym, np. 09:30.",
  nonexistent: "Tej godziny nie ma: tej nocy zegar przesuwa się do przodu. Wpisz godzinę sprzed zmiany albo po niej.",
  ambiguous: "Wybierz, o którą z dwóch godzin chodzi.",
};

/** Validates when the dispatcher leaves the field and shows the instant that would be sent. */
function Loading({ date = "", time = "" }: { date?: string; time?: string }) {
  const [result, setResult] = useState<ZonedDateTimeResult | null>(null);
  return <div className="grid max-w-measure gap-group">
    <Field label="Załadunek" hint="Dokładna data i godzina u klienta" error={result && !result.ok ? messages[result.reason] : undefined} required>
      <ZonedDateTimeField timeZone="Europe/Warsaw" zoneLabel="Czas warszawski" labels={labels} defaultDate={date} defaultTime={time} onZonedChange={setResult} />
    </Field>
    <output className="text-meta">{result?.ok && result.time ? `Wysłana chwila: "${result.instant}", strefa ${result.timeZone}, przesunięcie ${result.offset}` : "Nic nie zostanie wysłane"}</output>
  </div>;
}

const meta = {
  title: "Product/Time/Zoned date-time field",
  component: ZonedDateTimeField,
  args: { timeZone: "Europe/Warsaw", zoneLabel: "Czas warszawski", labels, timeOptional: false, disabled: false, defaultDate: "2026-11-12", defaultTime: "09:30" },
  argTypes: { timeZone: { control: "select", options: ["Europe/Warsaw", "Europe/London", "Europe/Lisbon"] } },
  decorators: [Story => <div className="max-w-measure"><Story /></div>],
  render: args => <Field label="Załadunek" hint="Dokładna data i godzina u klienta" required><ZonedDateTimeField key={`${args.timeZone}${args.defaultDate}${args.defaultTime}`} {...args} /></Field>,
} satisfies Meta<typeof ZonedDateTimeField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => <div className="grid gap-between">
    <Field label="Pusty" required><ZonedDateTimeField timeZone="Europe/Warsaw" zoneLabel="Czas warszawski" labels={labels} /></Field>
    <Field label="Wpisany" required><ZonedDateTimeField timeZone="Europe/Warsaw" zoneLabel="Czas warszawski" labels={labels} defaultDate="2026-11-12" defaultTime="09:30" /></Field>
    <Field label="Błąd" error={messages.invalidDate} required><ZonedDateTimeField timeZone="Europe/Warsaw" zoneLabel="Czas warszawski" labels={labels} defaultDate="2027-02-31" defaultTime="09:30" /></Field>
    <Field label="Zablokowany" hint="Dostępne po wybraniu auta" required><ZonedDateTimeField timeZone="Europe/Warsaw" zoneLabel="Czas warszawski" labels={labels} disabled /></Field>
  </div>,
};

/** The wash has a mandatory date and an optional time (D63); a date alone gives no instant. */
export const OptionalTime: Story = {
  name: "Date with optional time (wash)",
  render: () => <Field label="Data mycia" hint="Godzina nie jest wymagana" required>
    <ZonedDateTimeField timeZone="Europe/Warsaw" zoneLabel="Czas warszawski" labels={labels} timeOptional defaultDate="2026-11-13" />
  </Field>,
};

/** 28.03.2027: the clock goes from 02:00 to 03:00, so 02:30 does not exist and is rejected (TIME-1). */
export const ClockForward: Story = {
  name: "Clock goes forward: time rejected",
  render: () => <Loading date="2027-03-28" time="02:30" />,
};

/** 31.10.2027: the clock goes from 03:00 back to 02:00, so 02:30 happens twice and the dispatcher chooses (TIME-1). */
export const ClockBack: Story = {
  name: "Clock goes back: choose the occurrence",
  render: () => <Loading date="2027-10-31" time="02:30" />,
};

export const Typing: Story = {
  name: "Test: Polish entry, errors and the sent instant",
  render: () => <Loading />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const date = canvas.getByLabelText("Załadunek Data");
    const time = canvas.getByLabelText("Załadunek Godzina");
    await expect(canvas.getByRole("group", { name: "Załadunek" })).toBeVisible();
    await expect(date).toHaveAccessibleDescription(expect.stringContaining("Czas warszawski"));
    // Moving from the date to the time does not check yet; leaving the field does.
    await userEvent.type(date, "12.11.2026");
    await userEvent.click(time);
    await expect(date).not.toHaveAttribute("aria-invalid");
    await userEvent.tab();
    await expect(canvas.getByText(messages.missingTime)).toBeVisible();
    // A 12-hour time is not recognized; the text stays as typed.
    await userEvent.type(time, "9:30 PM");
    await userEvent.tab();
    await expect(canvas.getByText(messages.invalidTime)).toBeVisible();
    await expect(time).toHaveValue("9:30 PM");
    await userEvent.clear(time);
    await userEvent.type(time, "09:30");
    await userEvent.tab();
    await expect(time).not.toHaveAttribute("aria-invalid");
    await expect(canvas.getByText('Wysłana chwila: "2026-11-12T08:30:00.000Z", strefa Europe/Warsaw, przesunięcie +01:00')).toBeVisible();
  },
};

export const Occurrence: Story = {
  name: "Test: clock forward and clock back",
  render: () => <div className="grid gap-between"><Loading date="2027-03-28" time="02:30" /><Loading date="2027-10-31" time="02:30" /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [skipped, repeated] = canvas.getAllByLabelText("Załadunek Godzina");
    await userEvent.click(skipped!);
    await userEvent.tab();
    await expect(canvas.getByText(messages.nonexistent)).toBeVisible();
    await userEvent.click(repeated!);
    await userEvent.tab();
    await expect(canvas.getByText(messages.ambiguous)).toBeVisible();
    await userEvent.click(canvas.getByRole("radio", { name: "02:30 po cofnięciu zegara" }));
    await expect(canvas.getByText('Wysłana chwila: "2027-10-31T01:30:00.000Z", strefa Europe/Warsaw, przesunięcie +01:00')).toBeVisible();
    await expect(canvas.queryByText(messages.ambiguous)).toBeNull();
  },
};

export const TextSpacing: Story = {
  name: "Test: text spacing (WCAG 1.4.12)",
  render: () => <div className="w-80"><Loading date="2027-10-31" time="02:30" /></div>,
  play: async ({ canvasElement }) => {
    const time = within(canvasElement).getByLabelText("Załadunek Godzina");
    await userEvent.click(time);
    await userEvent.tab();
    applyTextSpacing(canvasElement);
    await expect(findTextSpacingFailures(canvasElement)).toEqual([]);
  },
};
