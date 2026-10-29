import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";
import { Field } from "@fleet-platform/ui/components/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@fleet-platform/ui/components/select";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";
import { waitForFocusReturn } from "../../.storybook/overlay";

const currencies = ["EUR", "PLN", "CZK"] as const;

const meta = {
  title: "Primitives/Select",
  component: Select,
  args: { onValueChange: fn(), disabled: false },
  argTypes: { value: { control: false }, children: { control: false } },
  decorators: [Story => <div className="max-w-measure"><Story /></div>],
  render: args => <Field label="Waluta frachtu" hint="Waluta z umowy z klientem" required>
    <Select {...args}>
      <SelectTrigger><SelectValue placeholder="Wybierz walutę" /></SelectTrigger>
      <SelectContent>{currencies.map(currency => <SelectItem key={currency} value={currency}>{currency}</SelectItem>)}</SelectContent>
    </Select>
  </Field>,
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => <div className="flex flex-col items-start gap-between">
    <Field label="Zestaw" required>
      <Select defaultValue="z01"><SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="z01">Zestaw 01</SelectItem><SelectItem value="z02">Zestaw 02</SelectItem></SelectContent>
      </Select>
    </Field>
    <div className="w-40">
      <Select defaultValue="10"><SelectTrigger size="compact" aria-label="Wierszy na stronie"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="10">10 wierszy</SelectItem><SelectItem value="25">25 wierszy</SelectItem></SelectContent>
      </Select>
    </div>
  </div>,
};

export const Groups: Story = {
  name: "Open list with groups",
  parameters: {
    docs: { story: { inline: false, iframeHeight: 260 } },
    // Exception: while the list is open, Radix hides the rest of the page with aria-hidden and traps focus in the list,
    // so the hidden trigger cannot receive focus. axe cannot see the trap in a static open state (aria-hidden-focus).
    a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } },
  },
  render: () => <Field label="Waluta frachtu" required>
    <Select defaultOpen defaultValue="EUR">
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectGroup><SelectLabel>Najczęstsze</SelectLabel><SelectItem value="EUR">EUR</SelectItem><SelectItem value="PLN">PLN</SelectItem></SelectGroup>
        <SelectSeparator />
        <SelectGroup><SelectLabel>Pozostałe</SelectLabel><SelectItem value="CZK">CZK</SelectItem><SelectItem value="HUF" disabled>HUF (brak kursu NBP)</SelectItem></SelectGroup>
      </SelectContent>
    </Select>
  </Field>,
};

const option = <SelectContent>{currencies.map(currency => <SelectItem key={currency} value={currency}>{currency}</SelectItem>)}</SelectContent>;

/** Hover and focus are frozen previews with the same declarations as the real states. */
export const States: Story = {
  render: () => <div className="grid gap-between">
    <Field label="Domyślne, bez wyboru" required><Select><SelectTrigger><SelectValue placeholder="Wybierz walutę" /></SelectTrigger>{option}</Select></Field>
    <Field label="Wybrane" required><Select defaultValue="EUR"><SelectTrigger><SelectValue /></SelectTrigger>{option}</Select></Field>
    <Field label="Najechanie (podgląd)" required><Select defaultValue="EUR"><SelectTrigger data-preview-state="hover"><SelectValue /></SelectTrigger>{option}</Select></Field>
    <Field label="Fokus (podgląd)" required><Select defaultValue="EUR"><SelectTrigger data-preview-state="focus"><SelectValue /></SelectTrigger>{option}</Select></Field>
    <Field label="Błąd" error="Wybierz walutę frachtu. Bez niej nie da się przeliczyć wyniku na EUR." required><Select><SelectTrigger><SelectValue placeholder="Wybierz walutę" /></SelectTrigger>{option}</Select></Field>
    <Field label="Zablokowane" hint="Dostępne po wpisaniu kwoty frachtu" required><Select disabled><SelectTrigger><SelectValue placeholder="Wybierz walutę" /></SelectTrigger>{option}</Select></Field>
  </div>,
};

export const LongValueNarrow: Story = {
  name: "Long value at 320 px",
  render: () => <div className="w-80"><Field label="Miejsce rozładunku" required>
    <Select defaultValue="b"><SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent><SelectItem value="b">Kędzierzyn-Koźle, strefa przemysłowa, brama nr 4 od strony bocznicy</SelectItem></SelectContent>
    </Select>
  </Field></div>,
};

export const ClickAndKeyboard: Story = {
  name: "Test: click and keyboard",
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole("combobox", { name: "Waluta frachtu" });
    await expect(trigger).toHaveAttribute("aria-required", "true");
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("option", { name: "PLN" }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith("PLN");
    await expect(trigger).toHaveTextContent("PLN");
    // Radix returns focus to the trigger after the list closes, in a timeout; wait for it, or that late focus
    // would pull focus out of the list opened next.
    await waitForFocusReturn(trigger);
    await userEvent.keyboard("{Enter}");
    // The list fades in over 110 ms (Q5b) and then moves focus to the chosen option; wait for that before using the arrows.
    const list = await screen.findByRole("listbox");
    await waitFor(() => expect(list).toBeVisible());
    await waitFor(() => expect(screen.getByRole("option", { name: "PLN" })).toHaveFocus());
    // Radix moves focus after an arrow key in a timeout, so Enter waits until the next option has focus.
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => expect(screen.getByRole("option", { name: "CZK" })).toHaveFocus());
    await userEvent.keyboard("{Enter}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("CZK");
    await waitForFocusReturn(trigger);
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
