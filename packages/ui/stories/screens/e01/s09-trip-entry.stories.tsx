import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Alert } from "@fleet-platform/ui/components/alert";
import { Field } from "@fleet-platform/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@fleet-platform/ui/components/radio-group";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@fleet-platform/ui/components/alert-dialog";
import { FreightAndWash, places, StopFields, TripEntry } from "./parts";

// s09 trip entry. States that wait for open screen-map gaps are not drawn: s09.8 the list of freight currencies (L30),
// s09.10 the wording for two weekends (L21), s09.15 the version conflict message (L10), s09.16 a session ending
// during entry (L11).

const meta = {
  title: "Screens/E01/s09 Trip entry",
  component: TripEntry,
  parameters: { layout: "fullscreen" },
  args: { open: 2 },
} satisfies Meta<typeof TripEntry>;
export default meta;
type Story = StoryObj<typeof meta>;

const stops = (loading: Parameters<typeof StopFields>[0], unloading: Parameters<typeof StopFields>[0]) =>
  <div className="flex flex-col gap-section md:flex-row"><StopFields {...loading} /><StopFields {...unloading} /></div>;

/** s09.1 The vehicle is chosen; places and times are open, the route waits beside them. */
export const Default: Story = { name: "s09.1 Places and times" };

/** s09.2 The wash question has no default answer (R09). */
export const WashQuestion: Story = { name: "s09.2 Wash without a default", args: { open: 3 } };

/** s09.3 "Nasze mycie" without amount or date names both; the time of the wash is optional (L24). */
export const WashMissing: Story = {
  name: "s09.3 Wash amount and date missing",
  args: { open: 3, freight: <FreightAndWash wash="ours" washErrors={{ amount: "Wpisz kwotę mycia.", date: "Wpisz datę mycia." }} /> },
};

/** s09.4 A missing loading time keeps the trip unsaved and names the field. */
export const TimeMissing: Story = {
  name: "s09.4 Loading time missing",
  args: {
    stops: stops({ title: "Załadunek", place: places.b, timeError: "Wpisz datę i godzinę załadunku." },
      { title: "Rozładunek", place: places.c, time: { date: "2026-11-12", time: "13:00" } }),
  },
};

/** s09.5 Unloading before loading is an error on the unloading time. */
export const UnloadingFirst: Story = {
  name: "s09.5 Unloading before loading",
  args: {
    stops: stops({ title: "Załadunek", place: places.b, time: { date: "2026-11-12", time: "12:00" } },
      { title: "Rozładunek", place: places.c, time: { date: "2026-11-12", time: "11:30" }, timeError: "Rozładunek nie może być przed załadunkiem (12.11.2026, 12:00)." }),
  },
};

/** s09.6 A time repeated when the clock goes back needs a choice of occurrence (TIME-1); the dates come from the zone database. */
export const ClockChange: Story = {
  name: "s09.6 Clock change",
  args: {
    stops: stops({ title: "Załadunek", place: places.b, time: { date: "2027-10-31", time: "02:30" } },
      { title: "Rozładunek", place: places.c, time: { date: "2027-10-31", time: "09:00" } }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getAllByRole("textbox", { name: /Godzina/ })[0]!);
    await userEvent.tab();
    await expect(await canvas.findByRole("radiogroup", { name: /dwa razy/ })).toBeVisible();
  },
};

/** s09.7 Without freight the trip can be saved; the quote then shows costs without a result (D55). */
export const NoFreight: Story = {
  name: "s09.7 No freight",
  args: { open: 3, freight: <FreightAndWash freight="" freightHint="Bez frachtu wycena pokaże same koszty, bez wyniku." wash="none" /> },
};

/** s09.9 The trip covers a weekend: one required case, no default (WKD-1). */
export const Weekend: Story = {
  name: "s09.9 Weekend question",
  args: {
    open: 3,
    freight: <FreightAndWash wash="none" extra={<Field label="Co kierowca robi w weekend?" hint="Kurs obejmuje sobotę lub niedzielę; zapytaj kierowcę" required>
      <RadioGroup>
        <RadioGroupItem value="homePoland" label="Wraca do domu w Polsce" hint="Bez kosztu pracy za weekend; koszt pojazdu liczy się dalej" />
        <RadioGroupItem value="restAbroad" label="Odpoczywa za granicą" hint="Stała kwota za każdy dzień weekendu, którego dotyka kurs" />
        <RadioGroupItem value="drivingOn" label="Jedzie dalej" hint="Zwykły koszt pracy za cały czas kursu" />
      </RadioGroup>
    </Field>} />,
  },
};

/** s09.11 A field changed after the quote: the data stay, the quote is stale and cannot be accepted. */
export const StaleQuote: Story = {
  name: "s09.11 Changed after the quote",
  args: { open: 3, notice: <Alert title="Wycena jest nieaktualna">Zmieniono dane kursu. Policz wycenę ponownie, zanim go przyjmiesz.</Alert> },
};

/** s09.12 Sending: the form is busy and cannot be sent twice. */
export const Sending: Story = {
  name: "s09.12 Sending",
  args: { open: 3, freight: <fieldset disabled aria-busy className="contents"><FreightAndWash wash="none" /></fieldset>, notice: <p role="status" className="text-meta">Zapisuję kurs…</p> },
};

/** s09.13 A save error names what failed and moves focus to the first invalid field. */
export const SaveError: Story = {
  name: "s09.13 Save error",
  args: {
    notice: <Alert variant="error" title="Nie zapisano kursu">Popraw zaznaczone pole i zapisz ponownie.</Alert>,
    stops: stops({ title: "Załadunek", place: places.b, timeError: "Wpisz datę i godzinę załadunku." },
      { title: "Rozładunek", place: places.c, time: { date: "2026-11-12", time: "13:00" } }),
  },
  play: async ({ canvasElement }) => {
    const first = within(canvasElement).getAllByRole("textbox", { name: /Data/ })[0]!;
    first.focus();
    await expect(first).toHaveFocus();
  },
};

/** s09.14 Leaving with unsaved changes asks before the entry is discarded. */
export const LeaveUnsaved: Story = {
  name: "s09.14 Leaving with unsaved changes",
  args: {
    overlay: <AlertDialog defaultOpen><AlertDialogContent>
      <AlertDialogHeader><AlertDialogTitle>Wyjść bez zapisu?</AlertDialogTitle>
        <AlertDialogDescription>Wpisane dane kursu nie są zapisane i znikną.</AlertDialogDescription></AlertDialogHeader>
      <AlertDialogFooter><AlertDialogCancel>Zostań przy wpisie</AlertDialogCancel><AlertDialogAction>Wyjdź bez zapisu</AlertDialogAction></AlertDialogFooter>
    </AlertDialogContent></AlertDialog>,
  },
};

export const Checks: Story = {
  name: "Test: one open step, collapsed steps with Zmień",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Zmień: Auto" })).toBeVisible();
    await expect(canvas.queryByRole("button", { name: "Zmień: Fracht i mycie" })).toBeNull();
    await expect(canvas.getByRole("list", { name: "Postęp wyceny" }).querySelector("[aria-current=step]")).toHaveTextContent("Miejsca i czasy");
    await expect(canvas.getByRole("complementary", { name: "Trasa kursu" })).toBeVisible();
  },
};
