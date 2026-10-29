// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { CrudForm } from "./CrudForm";
import type { ApiResult } from "../api/apiCall";

afterEach(cleanup);
const schema = z.strictObject({ amount: z.string().regex(/^\d+\.\d{2}$/) });
const messages = { submit: "Save", cancel: "Cancel", pending: "Saving", success: "Saved", translate: (key: string) => key };
function setup(onSubmit = vi.fn(async (): Promise<ApiResult<unknown>> => ({ ok: true, data: null }))) {
  const onCancel = vi.fn(); const confirmDiscard = vi.fn(() => false);
  const view = render(<CrudForm schema={schema} fields={[{ name: "amount", label: "Amount", inputMode: "decimal" }]}
    initialValues={{ amount: "1.00" }} onSubmit={onSubmit} onCancel={onCancel} confirmDiscard={confirmDiscard} messages={messages} />);
  return { ...view, onSubmit, onCancel, confirmDiscard };
}

describe("CrudForm", () => {
  it("validates before submit and preserves an exact decimal string", async () => {
    const { onSubmit } = setup();
    fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "invalid" } });
    fireEvent.click(screen.getByText("Save"));
    await screen.findByText("validation.invalid"); expect(onSubmit).not.toHaveBeenCalled();
    const amount = screen.getByLabelText("Amount");
    expect(amount.getAttribute("aria-invalid")).toBe("true");
    // Focus moves to the invalid field in a passive effect. Editing before that effect runs lets it discard the edit.
    await waitFor(() => expect(document.activeElement).toBe(amount));
    fireEvent.change(amount, { target: { value: "12345678901234567890.12" } });
    fireEvent.click(screen.getByText("Save"));
    await screen.findByText("Saved");
    expect(onSubmit).toHaveBeenCalledWith({ amount: "12345678901234567890.12" });
  });
  it("shows server field errors and retains unsaved input", async () => {
    setup(vi.fn(async () => ({ ok: false, error: { code: "VALIDATION_ERROR", messageKey: "api.validation", fieldErrors: { "body.amount": ["validation.server"] } } })));
    fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "2.00" } });
    fireEvent.click(screen.getByText("Save"));
    await screen.findByText("validation.server");
    expect((screen.getByLabelText("Amount") as HTMLInputElement).value).toBe("2.00");
    const describedBy = screen.getByLabelText("Amount").getAttribute("aria-describedby");
    expect(document.getElementById(describedBy!)?.textContent).toBe("validation.server");
  });
  it("prevents duplicate submit and cancellation while pending", async () => {
    let resolve!: (value: ApiResult<unknown>) => void;
    const onSubmit = vi.fn(() => new Promise<ApiResult<unknown>>(done => { resolve = done; }));
    const { container, onCancel } = setup(onSubmit);
    fireEvent.submit(container.querySelector("form")!); fireEvent.submit(container.querySelector("form")!);
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    fireEvent.keyDown(screen.getByLabelText("Amount"), { key: "Escape" }); expect(onCancel).not.toHaveBeenCalled();
    await act(async () => resolve({ ok: true, data: null }));
    await screen.findByText("Saved");
  });
  it("supports Ctrl/Command+Enter and guards Escape against discarding edits", async () => {
    const { onSubmit, onCancel, confirmDiscard } = setup();
    fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "2.00" } });
    fireEvent.keyDown(screen.getByLabelText("Amount"), { key: "Escape" });
    expect(confirmDiscard).toHaveBeenCalledOnce(); expect(onCancel).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByLabelText("Amount"), { key: "Enter", ctrlKey: true });
    await screen.findByText("Saved"); expect(onSubmit).toHaveBeenCalledOnce();
    fireEvent.keyDown(screen.getByLabelText("Amount"), { key: "Escape" }); expect(onCancel).toHaveBeenCalledOnce();
    fireEvent.keyDown(screen.getByLabelText("Amount"), { key: "Enter", metaKey: true });
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(2));
  });
  it("protects dirty input on browser unload and clears the guard after save", async () => {
    setup();
    fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "2.00" } });
    const dirtyUnload = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(dirtyUnload); expect(dirtyUnload.defaultPrevented).toBe(true);
    fireEvent.click(screen.getByText("Save")); await screen.findByText("Saved");
    // The guard is removed in a passive effect cleanup, which can still be pending when "Saved" is already on screen.
    await waitFor(() => {
      const savedUnload = new Event("beforeunload", { cancelable: true });
      window.dispatchEvent(savedUnload); expect(savedUnload.defaultPrevented).toBe(false);
    });
  });
  it("reports form-level schema issues without calling the server", async () => {
    const onSubmit = vi.fn(async (): Promise<ApiResult<unknown>> => ({ ok: true, data: null }));
    render(<CrudForm schema={schema.refine(() => false)} fields={[{ name: "amount", label: "Amount" }]} initialValues={{ amount: "1.00" }}
      onSubmit={onSubmit} onCancel={vi.fn()} confirmDiscard={() => false} messages={messages} />);
    fireEvent.click(screen.getByText("Save"));
    await screen.findByText("api.validation"); expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Amount").getAttribute("aria-invalid")).toBe("false");
  });
  it("shows a server failure without field errors", async () => {
    setup(vi.fn(async () => ({ ok: false, error: { code: "CONFLICT", messageKey: "api.conflict" } })));
    fireEvent.click(screen.getByText("Save"));
    await screen.findByText("api.conflict");
    expect(screen.getByLabelText("Amount").getAttribute("aria-invalid")).toBe("false");
  });
  it("renders textarea and email fields and starts missing values empty", () => {
    render(<CrudForm schema={z.strictObject({ note: z.string(), contact: z.string() })} initialValues={{}}
      fields={[{ name: "note", label: "Note", type: "textarea" }, { name: "contact", label: "Contact", type: "email", required: true }]}
      onSubmit={vi.fn()} onCancel={vi.fn()} confirmDiscard={() => false} messages={messages} />);
    const note = screen.getByLabelText("Note"); const contact = screen.getByLabelText("Contact") as HTMLInputElement;
    expect(note.tagName).toBe("TEXTAREA"); expect((note as HTMLTextAreaElement).value).toBe("");
    expect(contact.type).toBe("email"); expect(contact.required).toBe(true); expect(contact.value).toBe("");
  });
  it("ignores unrelated keys and leaves nested overlays in control of their keyboard", async () => {
    const { container, onSubmit, onCancel } = setup();
    fireEvent.keyDown(screen.getByLabelText("Amount"), { key: "a" });
    fireEvent.keyDown(screen.getByLabelText("Amount"), { key: "Enter" });
    const overlay = document.createElement("div"); overlay.setAttribute("role", "dialog");
    const overlayInput = document.createElement("input"); overlay.append(overlayInput);
    container.querySelector("fieldset")!.append(overlay);
    fireEvent.keyDown(overlayInput, { key: "Escape" }); fireEvent.keyDown(overlayInput, { key: "Enter", ctrlKey: true });
    await act(async () => {});
    expect(onCancel).not.toHaveBeenCalled(); expect(onSubmit).not.toHaveBeenCalled();
  });
  it("still handles shortcuts when the whole form is rendered inside a dialog", () => {
    const onCancel = vi.fn();
    render(<div role="dialog"><CrudForm schema={schema} fields={[{ name: "amount", label: "Amount" }]} initialValues={{ amount: "1.00" }}
      onSubmit={vi.fn()} onCancel={onCancel} confirmDiscard={() => false} messages={messages} /></div>);
    fireEvent.keyDown(screen.getByLabelText("Amount"), { key: "Escape" });
    expect(onCancel).toHaveBeenCalledOnce();
  });
  it("turns thrown submit failures into shared feedback", async () => {
    setup(vi.fn(async () => { throw new Error("private detail"); }));
    fireEvent.click(screen.getByText("Save"));
    await screen.findByText("api.network"); expect(screen.queryByText("private detail")).toBeNull();
  });
});
