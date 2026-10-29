import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "@fleet-platform/ui/components/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@fleet-platform/ui/components/card";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

const meta = { title: "Primitives/Card", component: Card } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <Card className="max-w-measure">
    <CardHeader>
      <CardTitle><h2>Trasa i kilometry</h2></CardTitle>
      <CardDescription>Plan; trasa wyznaczona dla ciężarówki</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex gap-between">
        {[["Dojazd", "120 km"], ["Ładowne", "547 km"], ["Razem", "667 km"]].map(([label, value]) => <div key={label} className="flex flex-col gap-tight"><span className="text-label">{label}</span><span className="text-number">{value}</span></div>)}
      </div>
    </CardContent>
  </Card>,
};

export const WithActionAndFooter: Story = {
  render: () => <Card className="max-w-measure">
    <CardHeader>
      <CardTitle><h2>Wynik kursu</h2></CardTitle>
      <CardDescription>Szacunek; ceny paliwa z 29.10.2026</CardDescription>
      <CardAction><Button variant="text" size="compact">Pokaż źródła</Button></CardAction>
    </CardHeader>
    <CardContent><p>Koszty pokryte frachtem. Następne wolne miejsce: Poznań, 30.10.2026 14:00.</p></CardContent>
    <CardFooter><Button>Przyjmij ładunek</Button><Button variant="secondary">Zapisz jako wariant</Button></CardFooter>
  </Card>,
};

export const LongTitleNarrow: Story = {
  name: "Long title at 320 px",
  render: () => <Card className="w-80">
    <CardHeader>
      <CardTitle><h2>Porównanie wariantów kursu z tego samego miejsca rozładunku</h2></CardTitle>
      <CardDescription>Trzy wycenione wersje robocze dla jednego zestawu</CardDescription>
      <CardAction><Button variant="text" size="compact">Sortuj</Button></CardAction>
    </CardHeader>
    <CardContent><p>Wybierz jeden wariant i przyjmij go; pozostałe zostaną wersjami roboczymi.</p></CardContent>
  </Card>,
};

export const Structure: Story = {
  name: "Test: heading inside the title",
  render: WithActionAndFooter.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 2, name: "Wynik kursu" })).toBeVisible();
    applyTextSpacing(canvasElement);
    await expect(findTextSpacingFailures(canvasElement)).toEqual([]);
  },
};
