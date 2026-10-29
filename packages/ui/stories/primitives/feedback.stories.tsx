import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "@fleet-platform/ui/components/button";
import { EmptyState } from "@fleet-platform/ui/backend/feedback/EmptyState";
import { ErrorMessage } from "@fleet-platform/ui/backend/feedback/ErrorMessage";
import { LoadingMessage } from "@fleet-platform/ui/backend/feedback/LoadingMessage";
import { SuccessMessage } from "@fleet-platform/ui/backend/feedback/SuccessMessage";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

const addTrip = fn();

const meta = {
  title: "Primitives/Feedback messages",
  component: EmptyState,
  args: { children: "Ten zestaw nie ma jeszcze kursów. Wpisz pierwszy kurs, żeby policzyć wycenę." },
  argTypes: { action: { control: false } },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const allMessages = <div className="grid gap-between">
    <LoadingMessage>Liczenie wyceny…</LoadingMessage>
    <SuccessMessage>Kurs przyjęty. Zestaw 01 będzie wolny w Płocku 30.10.2026 o 14:00.</SuccessMessage>
    <ErrorMessage>Nie udało się zapisać kursu. Wpisane dane są w formularzu; sprawdź połączenie i zapisz ponownie.</ErrorMessage>
    <EmptyState action={<Button variant="secondary">Wpisz kurs</Button>}>Ten zestaw nie ma jeszcze kursów. Wpisz pierwszy kurs, żeby policzyć wycenę.</EmptyState>
  </div>;
const emptyWithAction = <EmptyState action={<Button variant="secondary" onClick={addTrip}>Wpisz kurs</Button>}>Ten zestaw nie ma jeszcze kursów. Wpisz pierwszy kurs, żeby policzyć wycenę.</EmptyState>;

export const AllMessages: Story = { name: "All four messages", render: () => allMessages };
export const EmptyWithAction: Story = { name: "Empty state with an action", render: () => emptyWithAction };

export const LongTextNarrow: Story = {
  name: "Long text at 320 px",
  render: () => <div className="grid w-80 gap-between">
    <ErrorMessage>Nie udało się pobrać kursu NBP dla waluty frachtu. Wycena pokazuje koszty bez wyniku; spróbuj ponownie za kilka minut.</ErrorMessage>
    <EmptyState>Brak historii cen na tej trasie. To nie blokuje wyceny; policz ją z bieżących kosztów.</EmptyState>
  </div>,
};

export const Roles: Story = {
  name: "Test: roles and the empty-state action",
  render: () => <>{allMessages}{emptyWithAction}</>,
  play: async ({ canvasElement }) => {
    addTrip.mockClear();
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent("Nie udało się zapisać kursu.");
    await expect(canvas.getAllByRole("status")).toHaveLength(4);
    await expect(canvas.getByRole("alert").querySelector("svg")).not.toBeNull();
    await userEvent.click(canvas.getAllByRole("button", { name: "Wpisz kurs" })[1]!);
    await expect(addTrip).toHaveBeenCalledTimes(1);
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
