"use client";

import type { ReactNode } from "react";
import { LoadingMessage } from "../feedback/LoadingMessage";
import { ErrorMessage } from "../feedback/ErrorMessage";
import { EmptyState } from "../feedback/EmptyState";
import { Button } from "../../components/button";

export type DataColumn<T> = { key: string; header: string; cell: (row: T) => ReactNode };
export type DataTableMessages = { loading: string; empty: string; previous: string; next: string; actions: string; page: (page: number, pages: number) => string };

export function DataTable<T>({ columns, rows, rowKey, caption, page, pageSize, total, onPageChange, loading = false, error, actions, messages }: {
  columns: readonly DataColumn<T>[]; rows: readonly T[]; rowKey: (row: T) => string;
  caption: string; page: number; pageSize: number; total: number; onPageChange: (page: number) => void;
  loading?: boolean; error?: string; actions?: (row: T) => ReactNode; messages: DataTableMessages;
}) {
  const pages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  return <section aria-label={caption} aria-busy={loading} className="flex flex-col gap-group">
    {loading ? <LoadingMessage>{messages.loading}</LoadingMessage>
      : error ? <ErrorMessage>{error}</ErrorMessage>
      : rows.length === 0 ? <EmptyState>{messages.empty}</EmptyState>
      : <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={caption}><table className="w-full border-collapse text-left text-table">
        <caption className="sr-only">{caption}</caption>
        <thead><tr>{columns.map(column => <th key={column.key} scope="col" className="h-row border-b border-input px-group text-body-strong">{column.header}</th>)}{actions && <th scope="col" className="h-row border-b border-input px-group text-body-strong">{messages.actions}</th>}</tr></thead>
        <tbody>{rows.map(row => <tr key={rowKey(row)}>{columns.map(column => <td key={column.key} className="h-row border-b border-divider px-group">{column.cell(row)}</td>)}{actions && <td className="h-row border-b border-divider px-group">{actions(row)}</td>}</tr>)}</tbody>
      </table></div>}
    <div className="flex items-center gap-group">
      <Button variant="secondary" disabled={loading || page <= 1} onClick={() => onPageChange(page - 1)}>{messages.previous}</Button>
      <span className="text-body">{messages.page(page, pages)}</span>
      <Button variant="secondary" disabled={loading || page >= pages} onClick={() => onPageChange(page + 1)}>{messages.next}</Button>
    </div>
  </section>;
}
