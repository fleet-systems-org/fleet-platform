import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { AppFrame } from "@fleet-platform/ui/components/layout/app-frame";
import { StepBar } from "@fleet-platform/ui/components/layout/step-bar";
import { RouteStops } from "@fleet-platform/ui/components/trips/route-stops";
import { Button } from "@fleet-platform/ui/components/button";
import { Card, CardTitle } from "@fleet-platform/ui/components/card";
import { dispatcherNavigation, quoteSteps } from "../product/labels";
import { tripStops } from "../trips/route-stops.stories";

const account = <><p className="text-meta wrap-anywhere">dyspozytor@firma-demo.example</p><Button variant="secondary">Wyloguj</Button></>;

const meta = {
  title: "Product/Layout/App frame",
  component: AppFrame,
  parameters: { layout: "fullscreen" },
  args: { ...dispatcherNavigation, account, children: <h1 className="text-page-title">Kursy aut</h1> },
} satisfies Meta<typeof AppFrame>;
export default meta;
type Story = StoryObj<typeof meta>;

/** A work screen at full width: navigation, later phases and the account in the left panel (N7d). */
export const WorkScreen: Story = {
  name: "Work screen",
  args: { items: [{ href: "#nowa-wycena", label: "Nowa wycena" }, { href: "#kursy", label: "Kursy aut", current: true }] },
};

/** Entry, route and quote share this frame: centred content, the same step bar and a 360 px panel (N7c). */
export const QuoteEntry: Story = {
  name: "Quote entry",
  args: {
    width: "centred",
    steps: <StepBar label="Postęp wyceny" steps={quoteSteps} current={1} doneText="gotowe" />,
    panel: <Card><CardTitle>Trasa kursu</CardTitle><RouteStops label="Trasa kursu" timeZone="Warszawa" stops={tripStops} /></Card>,
    panelLabel: "Trasa kursu",
    children: <div className="flex flex-col gap-between"><h1 className="text-page-title">Nowa wycena</h1><Card><CardTitle>Miejsca i czasy</CardTitle><p className="text-body">Treść kroku składa strona z pól wyboru miejsca i czasu.</p></Card></div>,
  },
};

export const Landmarks: Story = {
  name: "Test: navigation from the page, landmarks and later entries",
  args: QuoteEntry.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole("navigation", { name: "Nawigacja" });
    await expect(within(navigation).getAllByRole("link").map(link => link.textContent)).toEqual(["Nowa wycena", "Kursy aut"]);
    await expect(within(navigation).getByRole("link", { name: "Nowa wycena" })).toHaveAttribute("aria-current", "page");
    // "Flota" exists only as a muted later entry, not as a link.
    await expect(within(navigation).queryByRole("link", { name: "Flota" })).toBeNull();
    await expect(within(navigation).getByText("Flota")).toBeVisible();
    await expect(within(navigation).getByRole("button", { name: "Wyloguj" })).toBeVisible();
    await expect(canvas.getByRole("main")).toContainElement(canvas.getByRole("complementary", { name: "Trasa kursu" }));
    await expect(canvas.queryByRole("banner")).toBeNull();
  },
};
