"use client";

import type { ReactNode } from "react";
import { LoadingMessage } from "../feedback/LoadingMessage";
import { ErrorMessage } from "../feedback/ErrorMessage";
import { EmptyState } from "../feedback/EmptyState";

export type DataColumn<T> = { key: string; header: string; cell: (row: T) => ReactNode };
export type DataTableMessages = { loading: string; empty: string; previous: string; next: string; actions: string; page: (page: number, pages: number) => string };

export function DataTable<T>({ columns, rows, rowKey, caption, page, pageSize, total, onPageChange, loading = false, error, actions, messages }: {
  columns: readonly DataColumn<T>[]; rows: readonly T[]; rowKey: (row: T) => string;
  caption: string; page: number; pageSize: number; total: number; onPageChange: (page: number) => void;
  loading?: boolean; error?: string; actions?: (row: T) => ReactNode; messages: DataTableMessages;
}) {
  const pages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  return <section aria-label={caption} aria-busy={loading} className="space-y-3">
    {loading ? <LoadingMessage>{messages.loading}</LoadingMessage>
      : error ? <ErrorMessage>{error}</ErrorMessage>
      : rows.length === 0 ? <EmptyState>{messages.empty}</EmptyState>
      : <div className="overflow-x-auto"><table className="w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead><tr>{columns.map(column => <th key={column.key} scope="col" className="border-b p-2">{column.header}</th>)}{actions && <th scope="col">{messages.actions}</th>}</tr></thead>
        <tbody>{rows.map(row => <tr key={rowKey(row)}>{columns.map(column => <td key={column.key} className="border-b p-2">{column.cell(row)}</td>)}{actions && <td>{actions(row)}</td>}</tr>)}</tbody>
      </table></div>}
    <div className="flex items-center gap-3">
      <button type="button" disabled={loading || page <= 1} onClick={() => onPageChange(page - 1)}>{messages.previous}</button>
      <span>{messages.page(page, pages)}</span>
      <button type="button" disabled={loading || page >= pages} onClick={() => onPageChange(page + 1)}>{messages.next}</button>
    </div>
  </section>;
}
