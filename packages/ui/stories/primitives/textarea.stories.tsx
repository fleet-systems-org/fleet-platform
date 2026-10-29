import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Field } from "@fleet-platform/ui/components/field";
import { Textarea } from "@fleet-platform/ui/components/textarea";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

const meta = {
  title: "Primitives/Textarea",
  component: Textarea,
  args: { "aria-label": "Powód korekty" },
  decorators: [Story => <div className="max-w-measure"><Story /></div>],
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => <div className="grid gap-between">
    <Field label="Powód przyjęcia ze stratą" hint="Jedno zdanie" required><Textarea /></Field>
    <Field label="Powód korekty" required><Textarea defaultValue="Klient przesunął rozładunek o jeden dzień." /></Field>
    <Field label="Powód korekty" error="Podaj powód korekty. Bez niego nie można zapisać zmiany." required><Textarea /></Field>
    <Field label="Uwagi" optionalText="opcjonalne"><Textarea disabled /></Field>
  </div>,
};

export const LongTextNarrow: Story = {
  name: "Long text at 320 px",
  render: () => <div className="w-80"><Field label="Powód anulowania" required><Textarea defaultValue="Klient wycofał zlecenie po potwierdzeniu, bo towar nie był gotowy do załadunku w uzgodnionym dniu, a nowego terminu jeszcze nie podał." /></Field></div>,
};

export const Typing: Story = {
  name: "Test: typing several lines",
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole("textbox", { name: "Powód korekty" });
    await userEvent.type(textarea, "Zmiana daty.{Enter}Klient potwierdził telefonicznie.");
    await expect(textarea).toHaveValue("Zmiana daty.\nKlient potwierdził telefonicznie.");
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
