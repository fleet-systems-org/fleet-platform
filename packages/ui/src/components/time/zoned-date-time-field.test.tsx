// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Field } from "../field";
import { ZonedDateTimeField, type ZonedDateTimeLabels } from "./zoned-date-time-field";

afterEach(cleanup);

const labels: ZonedDateTimeLabels = {
  date: "Data",
  dateFormat: "DD.MM.RRRR",
  time: "Godzina",
  timeFormat: "GG:MM",
  occurrence: "Ta godzina wystąpi dwa razy. Którą wybierasz?",
  earlier: "przed cofnięciem zegara",
  later: "po cofnięciu zegara",
};
const describedBy = (element: HTMLElement) => element.getAttribute("aria-describedby")!.split(" ").map(id => document.getElementById(id)!.textContent);

function loading(props: Partial<React.ComponentProps<typeof ZonedDateTimeField>> = {}, error?: string) {
  const onZonedChange = vi.fn();
  render(<>
    <Field label="Załadunek" hint="Kiedy auto ma być załadowane" error={error} required>
      <ZonedDateTimeField timeZone="Europe/Warsaw" zoneLabel="Czas warszawski" labels={labels} onZonedChange={onZonedChange} {...props} />
    </Field>
    <button type="button">Dalej</button>
  </>);
  const date = screen.getByLabelText("Załadunek Data") as HTMLInputElement;
  const time = screen.getByLabelText("Załadunek Godzina") as HTMLInputElement;
  const leave = (from: HTMLElement) => fireEvent.blur(from, { relatedTarget: screen.getByRole("button", { name: "Dalej" }) });
  return { onZonedChange, date, time, leave };
}

it("is a group named by the Field, with a date and a time box described by the hint and the zone", () => {
  const { date, time } = loading();
  expect(screen.getByRole("group", { name: "Załadunek" })).toBeTruthy();
  expect(date.type).toBe("text");
  expect(time.type).toBe("text");
  expect(date.placeholder).toBe("DD.MM.RRRR");
  expect(time.placeholder).toBe("GG:MM");
  expect(date.required && time.required).toBe(true);
  expect(describedBy(date)).toEqual(["Kiedy auto ma być załadowane", "Czas warszawski"]);
  expect(describedBy(time)).toEqual(["Kiedy auto ma być załadowane", "Czas warszawski"]);
  expect(date.hasAttribute("aria-invalid")).toBe(false);
  // The Field's label points at the date box.
  expect(document.querySelector(`label[for="${date.id}"]`)!.textContent).toBe("Załadunek");
});

it("marks both boxes invalid when the Field has an error", () => {
  const { date, time } = loading({}, "Ta godzina nie istnieje.");
  expect(date.getAttribute("aria-invalid")).toBe("true");
  expect(time.getAttribute("aria-invalid")).toBe("true");
});

it("resolves the local time to an exact instant when the dispatcher leaves the field, not between its boxes", () => {
  const { onZonedChange, date, time, leave } = loading();
  fireEvent.change(date, { target: { value: "12.11.2026" } });
  fireEvent.blur(date, { relatedTarget: time });
  expect(onZonedChange).not.toHaveBeenCalled();
  fireEvent.change(time, { target: { value: "09:30" } });
  leave(time);
  expect(onZonedChange).toHaveBeenLastCalledWith({ ok: true, date: "2026-11-12", time: "09:30", timeZone: "Europe/Warsaw", offset: "+01:00", instant: "2026-11-12T08:30:00.000Z" });
});

it("names what is missing", () => {
  const { onZonedChange, date, time, leave } = loading();
  leave(date);
  expect(onZonedChange).toHaveBeenLastCalledWith({ ok: false, reason: "empty" });
  fireEvent.change(time, { target: { value: "09:30" } });
  leave(time);
  expect(onZonedChange).toHaveBeenLastCalledWith({ ok: false, reason: "missingDate" });
  fireEvent.change(time, { target: { value: "" } });
  fireEvent.change(date, { target: { value: "12.11.2026" } });
  leave(date);
  expect(onZonedChange).toHaveBeenLastCalledWith({ ok: false, reason: "missingTime" });
});

it("rejects text that is not a real date or a 24-hour time, and accepts a date without leading zeros", () => {
  const { onZonedChange, date, time, leave } = loading();
  fireEvent.change(date, { target: { value: "31.02.2027" } });
  fireEvent.change(time, { target: { value: "09:30" } });
  leave(time);
  expect(onZonedChange).toHaveBeenLastCalledWith({ ok: false, reason: "invalidDate" });
  fireEvent.change(date, { target: { value: "2.11.2026" } });
  fireEvent.change(time, { target: { value: "25:00" } });
  leave(time);
  expect(onZonedChange).toHaveBeenLastCalledWith({ ok: false, reason: "invalidTime" });
  fireEvent.change(time, { target: { value: "9:30" } });
  leave(time);
  expect(onZonedChange).toHaveBeenLastCalledWith(expect.objectContaining({ ok: true, date: "2026-11-02", time: "09:30", instant: "2026-11-02T08:30:00.000Z" }));
  expect(date.value).toBe("2.11.2026");
});

it("accepts a date alone when the time is optional, without an instant", () => {
  const { onZonedChange, date, time, leave } = loading({ timeOptional: true, defaultDate: "2026-11-13" });
  expect(date.required).toBe(true);
  expect(time.required).toBe(false);
  expect(date.value).toBe("13.11.2026");
  leave(date);
  expect(onZonedChange).toHaveBeenLastCalledWith({ ok: true, date: "2026-11-13", time: undefined, timeZone: "Europe/Warsaw" });
});

it("rejects a time skipped by the clock going forward (TIME-1)", () => {
  const { onZonedChange, time, leave } = loading({ defaultDate: "2027-03-28", defaultTime: "02:30" });
  leave(time);
  expect(onZonedChange).toHaveBeenLastCalledWith({ ok: false, reason: "nonexistent" });
  expect(screen.queryByRole("radiogroup")).toBeNull();
});

it("asks which occurrence of a repeated time is meant and resolves the chosen one (TIME-1)", () => {
  const { onZonedChange, time, leave } = loading({ defaultDate: "2027-10-31", defaultTime: "02:30" });
  leave(time);
  expect(onZonedChange).toHaveBeenLastCalledWith({ ok: false, reason: "ambiguous", offsets: ["+02:00", "+01:00"] });
  const choice = screen.getByRole("radiogroup", { name: labels.occurrence });
  expect(choice.getAttribute("aria-required")).toBe("true");
  fireEvent.click(screen.getByRole("radio", { name: "02:30 po cofnięciu zegara" }));
  expect(onZonedChange).toHaveBeenLastCalledWith({ ok: true, date: "2027-10-31", time: "02:30", timeZone: "Europe/Warsaw", offset: "+01:00", instant: "2027-10-31T01:30:00.000Z" });
  // Leaving again keeps the choice.
  leave(time);
  expect(onZonedChange).toHaveBeenLastCalledWith(expect.objectContaining({ ok: true, offset: "+01:00" }));
  expect(screen.getByRole("radio", { name: "02:30 przed cofnięciem zegara" })).toBeTruthy();
  // Changing the time drops the choice until the field is checked again.
  fireEvent.change(time, { target: { value: "03:00" } });
  expect(screen.queryByRole("radiogroup")).toBeNull();
  leave(time);
  expect(onZonedChange).toHaveBeenLastCalledWith(expect.objectContaining({ ok: true, offset: "+01:00", instant: "2027-10-31T02:00:00.000Z" }));
});

it("works outside a Field and without a listener", () => {
  render(<ZonedDateTimeField timeZone="Europe/Warsaw" zoneLabel="Czas warszawski" labels={labels} defaultDate="2026-11-12" disabled />);
  const date = screen.getByLabelText("Data") as HTMLInputElement;
  expect(date.disabled).toBe(true);
  expect(date.value).toBe("12.11.2026");
  expect(describedBy(date)).toEqual(["Czas warszawski"]);
  fireEvent.blur(date);
  expect(screen.getByLabelText("Godzina")).toBeTruthy();
});
