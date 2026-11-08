import type { ReactNode } from "react";
import { Alert } from "@fleet-platform/ui/components/alert";
import { LoadingMessage } from "@fleet-platform/ui/backend/feedback/LoadingMessage";
import { ErrorMessage } from "@fleet-platform/ui/backend/feedback/ErrorMessage";
import { EmptyState } from "@fleet-platform/ui/backend/feedback/EmptyState";
import { findState } from "./states";

/** Whether the selected state replaces the screen's content instead of adding a message above it. */
export const replacesContent = (stateId: string) => ["loading", "failed", "empty"].includes(findState(stateId)?.kind ?? "");

/** The product message of a selected state, composed only from design-system feedback components. */
export function StateNotice({ stateId, action }: { stateId: string; action?: ReactNode }) {
  const state = findState(stateId);
  if (!state?.text) return null;
  switch (state.kind) {
    case "loading": return <LoadingMessage>{state.text}</LoadingMessage>;
    case "failed": return <ErrorMessage>{state.text}</ErrorMessage>;
    case "empty": return <EmptyState action={action}>{state.text}</EmptyState>;
    case "error": return <Alert variant="error" title={state.text} />;
    case "info": return <Alert variant="neutral" title={`Uwaga · ${state.text}`} />;
    default: return null;
  }
}
