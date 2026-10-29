// Local wall-clock time in an IANA zone resolved to an exact instant (TIME-1). Uses Intl only; no time library.

/** How a local date and time exist in a zone: once, twice when the clock goes back, or never when it goes forward. */
export type LocalResolution =
  | { kind: "unique"; offset: string }
  | { kind: "ambiguous"; offsets: [earlier: string, later: string] }
  | { kind: "nonexistent" }

const minute = 60_000
const day = 86_400_000

/** Offset of the zone from UTC at an instant, in minutes. */
function offsetMinutes(timeZone: string, epoch: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric",
  }).formatToParts(epoch)
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find(p => p.type === type)!.value)
  return (Date.UTC(part("year"), part("month") - 1, part("day"), part("hour"), part("minute")) - epoch) / minute
}

/** "+01:00" for 60 minutes, "-03:30" for -210. */
function formatOffset(minutes: number): string {
  const abs = Math.abs(minutes)
  return `${minutes < 0 ? "-" : "+"}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`
}

/** Local wall time as if it were UTC, in milliseconds. */
function wallClock(date: string, time: string): number {
  const [year, month, dayOfMonth] = date.split("-").map(Number)
  const [hour, minutes] = time.split(":").map(Number)
  return Date.UTC(year!, month! - 1, dayOfMonth, hour, minutes)
}

/**
 * Finds the offsets at which `date` ("2027-10-31") and `time` ("02:30") exist in `timeZone`. A zone changes its
 * offset at most once within a day either side, so the offsets a day before and after are the only candidates;
 * a candidate is real when the zone has that offset at the instant it gives. Two real offsets are listed earlier
 * instant first.
 */
export function resolveLocalDateTime(date: string, time: string, timeZone: string): LocalResolution {
  const wall = wallClock(date, time)
  const candidates = [...new Set([offsetMinutes(timeZone, wall - day), offsetMinutes(timeZone, wall + day)])]
  const offsets = candidates.filter(offset => offsetMinutes(timeZone, wall - offset * minute) === offset).sort((a, b) => b - a)
  if (offsets.length === 0) return { kind: "nonexistent" }
  if (offsets.length === 1) return { kind: "unique", offset: formatOffset(offsets[0]!) }
  return { kind: "ambiguous", offsets: [formatOffset(offsets[0]!), formatOffset(offsets[1]!)] }
}

/** The exact UTC instant of a local date and time at an offset, as ISO 8601 ("2026-11-12T08:30:00.000Z"). */
export function toInstant(date: string, time: string, offset: string): string {
  const sign = offset.startsWith("-") ? -1 : 1
  const [hours, minutes] = offset.slice(1).split(":").map(Number)
  return new Date(wallClock(date, time) - sign * (hours! * 60 + minutes!) * minute).toISOString()
}
