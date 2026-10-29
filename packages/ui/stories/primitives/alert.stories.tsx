import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Alert } from "@fleet-platform/ui/components/alert";
import { Button } from "@fleet-platform/ui/components/button";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

const recalculate = fn();

const meta = {
  title: "Primitives/Alert",
  component: Alert,
  args: { title: "Wycena jest nieaktualna", children: "Zmieniłeś dane kursu po policzeniu. Policz wycenę ponownie, zanim przyjmiesz ładunek.", variant: "neutral" },
  argTypes: { variant: { control: "inline-radio", options: ["neutral", "error"] }, action: { control: false } },
  decorators: [Story => <div className="max-w-measure"><Story /></div>],
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => <div className="grid gap-between">
    <Alert title="Zapytaj o weekend">Kurs obejmuje sobotę lub niedzielę. Zapytaj kierowcę, co robi w weekend, i wybierz odpowiedź; bez niej wycena jest niepełna.</Alert>
    <Alert title="Brak ceny frachtu">Koszty są policzone, wynik nie. Wpisz fracht uzgodniony z klientem.</Alert>
    <Alert variant="error" title="Nie udało się zapisać kursu">Wpisane dane są w formularzu. Sprawdź połączenie i zapisz ponownie.</Alert>
  </div>,
};

export const WithAction: Story = {
  name: "With an action",
  render: () => <Alert title="Wycena jest nieaktualna" action={<Button variant="secondary" onClick={recalculate}>Policz ponownie</Button>}>
    Zmieniłeś dane kursu po policzeniu. Policz wycenę ponownie, zanim przyjmiesz ładunek.
  </Alert>,
};

export const LongTextNarrow: Story = {
  name: "Long text at 320 px",
  render: () => <div className="w-80"><Alert variant="error" title="Nie udało się pobrać trasy od dostawcy map">Kilometry i podział na kraje są niedostępne, więc wycena nie zostanie policzona. Spróbuj ponownie za kilka minut.</Alert></div>,
};

export const ActionAndRole: Story = {
  name: "Test: role and action",
  render: WithAction.render,
  play: async ({ canvasElement }) => {
    recalculate.mockClear();
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("Wycena jest nieaktualna");
    await userEvent.click(canvas.getByRole("button", { name: "Policz ponownie" }));
    await expect(recalculate).toHaveBeenCalledTimes(1);
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
