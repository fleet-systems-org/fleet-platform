// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { DataTable } from "./DataTable";

afterEach(cleanup);
const messages = { loading: "Loading", empty: "Empty", previous: "Previous", next: "Next", actions: "Actions", page: (page: number, pages: number) => `${page}/${pages}` };
const row = { id: "synthetic", amount: "12345678901234567890.12" };
const base = { columns: [{ key: "amount", header: "Amount", cell: (r: typeof row) => r.amount }], rows: [row], rowKey: (r: typeof row) => r.id,
  caption: "Synthetic table", page: 1, pageSize: 1, total: 2, onPageChange: vi.fn(), messages };
it("renders configured columns, exact strings, pagination and row actions", () => {
  const action = vi.fn(); render(<DataTable {...base} actions={r => <button onClick={() => action(r.id)}>Inspect</button>} />);
  expect(screen.getByText(row.amount)).toBeTruthy();
  expect((screen.getByText("Previous") as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByText("Next")); expect(base.onPageChange).toHaveBeenCalledWith(2);
  fireEvent.click(screen.getByText("Inspect")); expect(action).toHaveBeenCalledWith(row.id);
});
it("moves to the previous page and reports the total page count", () => {
  const onPageChange = vi.fn(); render(<DataTable {...base} page={2} onPageChange={onPageChange} />);
  expect(screen.getByText("2/2")).toBeTruthy();
  expect((screen.getByText("Next") as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByText("Previous")); expect(onPageChange).toHaveBeenCalledWith(1);
});
it("uses distinct feedback for loading, errors and empty data", () => {
  const { rerender } = render(<DataTable {...base} loading />);
  expect(screen.getByRole("status").textContent).toBe("Loading");
  expect((screen.getByText("Next") as HTMLButtonElement).disabled).toBe(true);
  rerender(<DataTable {...base} error="Failure" />); expect(screen.getByRole("alert").textContent).toBe("Failure");
  rerender(<DataTable {...base} rows={[]} total={0} />); expect(screen.getByRole("status").textContent).toBe("Empty");
  expect((screen.getByText("Next") as HTMLButtonElement).disabled).toBe(true);
});
