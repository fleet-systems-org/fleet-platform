import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconCircleCheck, IconCircleDashed, IconCircleOff } from "@tabler/icons-react";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Badge } from "@fleet-platform/ui/components/badge";
import { Button } from "@fleet-platform/ui/components/button";
import { DataTable, type DataColumn } from "@fleet-platform/ui/backend/tables/DataTable";
import { applyTextSpacing, findTextSpacingFailures } from "../../.storybook/text-spacing";

type Truck = { id: string; truck: string; freePlace: string; freeAt: string; kilometres: "verified" | "notVerified" | "missing" };

// Synthetic fleet: seven trucks, three per page.
const fleet: Truck[] = [
  { id: "z01", truck: "Zestaw 01", freePlace: "Płock", freeAt: "30.10.2026 14:00", kilometres: "verified" },
  { id: "z02", truck: "Zestaw 02", freePlace: "Poznań", freeAt: "30.10.2026 18:30", kilometres: "notVerified" },
  { id: "z03", truck: "Zestaw 03", freePlace: "Kędzierzyn-Koźle", freeAt: "31.10.2026 07:00", kilometres: "missing" },
  { id: "z04", truck: "Zestaw 04", freePlace: "Płock", freeAt: "31.10.2026 11:15", kilometres: "verified" },
  { id: "z05", truck: "Zestaw 05", freePlace: "Poznań", freeAt: "02.11.2026 06:00", kilometres: "notVerified" },
  { id: "z06", truck: "Zestaw 06", freePlace: "Płock", freeAt: "02.11.2026 09:45", kilometres: "verified" },
  { id: "z07", truck: "Zestaw 07", freePlace: "Poznań", freeAt: "03.11.2026 16:00", kilometres: "missing" },
];

const kilometreBadge = {
  verified: <Badge><IconCircleCheck aria-hidden />Zgodne</Badge>,
  notVerified: <Badge><IconCircleDashed aria-hidden />Niezweryfikowane</Badge>,
  missing: <Badge><IconCircleOff aria-hidden />Brak danych</Badge>,
};

const columns: DataColumn<Truck>[] = [
  { key: "truck", header: "Zestaw", cell: row => row.truck },
  { key: "freePlace", header: "Wolny w", cell: row => row.freePlace },
  { key: "freeAt", header: "Wolny od", cell: row => <span className="text-number">{row.freeAt}</span> },
  { key: "kilometres", header: "Kilometry", cell: row => kilometreBadge[row.kilometres] },
];

const messages = {
  loading: "Wczytywanie floty…",
  empty: "Żaden zestaw nie ma jeszcze kursu. Wpisz pierwszy kurs, a zestaw pojawi się na tej liście.",
  previous: "Poprzednia strona",
  next: "Następna strona",
  actions: "Akcje",
  page: (page: number, pages: number) => `Strona ${page} z ${pages}`,
};

const pageSize = 3;
const base = { columns, rowKey: (row: Truck) => row.id, caption: "Dostępność floty", pageSize, messages };

const meta = {
  title: "Primitives/Data table",
  component: DataTable<Truck>,
  args: { ...base, rows: fleet.slice(0, pageSize), page: 1, total: fleet.length, onPageChange: fn(), loading: false },
  argTypes: { columns: { control: false }, rows: { control: false }, rowKey: { control: false }, messages: { control: false }, actions: { control: false }, error: { control: "text" } },
} satisfies Meta<typeof DataTable<Truck>>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithRowActions: Story = {
  name: "With row actions",
  args: { actions: row => <Button size="compact" variant="text">Pokaż kursy: {row.truck}</Button> },
};

export const Loading: Story = { args: { loading: true } };
export const ErrorState: Story = {
  name: "Error", args: { error: "Nie udało się wczytać floty. Odśwież stronę; wpisane kursy są zapisane." } };
export const Empty: Story = { args: { rows: [], total: 0 } };

export const Narrow: Story = {
  name: "Narrow screen at 320 px",
  decorators: [Story => <div className="w-80"><Story /></div>],
};

function PagedFleet() {
  const [page, setPage] = useState(1);
  return <DataTable {...base} rows={fleet.slice((page - 1) * pageSize, page * pageSize)} page={page} total={fleet.length} onPageChange={setPage} />;
}

export const Paging: Story = {
  name: "Test: paging with the keyboard",
  render: () => <PagedFleet />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Strona 1 z 3")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Poprzednia strona" })).toBeDisabled();
    canvas.getByRole("button", { name: "Następna strona" }).focus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByText("Strona 2 z 3")).toBeVisible();
    await expect(canvas.getByRole("cell", { name: "Zestaw 04" })).toBeVisible();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByText("Strona 3 z 3")).toBeVisible();
    await expect(canvas.getAllByRole("row")).toHaveLength(2);
    await expect(canvas.getByRole("button", { name: "Następna strona" })).toBeDisabled();
  },
};

export const TextSpacing: Story = {
  name: "Test: text spacing (WCAG 1.4.12)",
  decorators: Narrow.decorators,
  play: async ({ canvasElement }) => {
    applyTextSpacing(canvasElement);
    await expect(findTextSpacingFailures(canvasElement)).toEqual([]);
  },
};
