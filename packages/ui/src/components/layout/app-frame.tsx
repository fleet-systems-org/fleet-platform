// The frame every screen shares (N7c, N7d): navigation in a left panel, never in a top bar, with the account and sign-out
// at its foot; the content, and on entry, route and quote the step bar and a 360 px panel on the right.
import * as React from "react"
import { cn } from "@fleet-platform/ui/lib/utils"

/** One navigation entry. The page passes only the entries the user may open (L12); the frame holds no fixed list. */
export type AppFrameItem = {
  href: string
  label: string
  /** The entry of the current screen. */
  current?: boolean
}

function AppFrame({
  navigationLabel,
  items,
  later,
  account,
  steps,
  panel,
  panelLabel,
  width = "full",
  className,
  children,
}: {
  /** Accessible name of the navigation, for example "Nawigacja". */
  navigationLabel: string
  items: AppFrameItem[]
  /** Entries of later phases, shown muted and not as links until they exist (N7d). */
  later?: { label: string; items: string[] }
  /** Account name and sign-out at the foot of the navigation (N7d replaces the top bar of L22). */
  account?: React.ReactNode
  /** The step bar above the content on entry, route and quote (N7c). */
  steps?: React.ReactNode
  /** The 360 px panel on the right (N7c); below the content under 1280 px. */
  panel?: React.ReactNode
  /** Accessible name of the panel, for example "Podsumowanie wyceny". Required with `panel`. */
  panelLabel?: string
  /** `centred` for entry, route and quote (N7c); `full` keeps the whole width for work screens such as the fleet. */
  width?: "full" | "centred"
  className?: string
  children: React.ReactNode
}) {
  return (
    <div data-slot="app-frame" className={cn("flex min-h-svh flex-col bg-page text-default md:flex-row", className)}>
      <nav
        aria-label={navigationLabel}
        className="flex shrink-0 flex-col gap-between border-b border-divider bg-panel p-panel md:w-frame-navigation md:border-r md:border-b-0"
      >
        <ul className="flex flex-col gap-tight">
          {items.map(item => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={cn(
                  "flex min-h-control items-center rounded-control px-group text-body text-default hover:bg-page",
                  item.current && "bg-page text-body-strong",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        {later && (
          <div className="flex flex-col gap-tight">
            <p className="px-group text-label">{later.label}</p>
            <ul className="flex flex-col gap-tight">
              {later.items.map(label => <li key={label} className="flex min-h-control items-center px-group text-body text-muted">{label}</li>)}
            </ul>
          </div>
        )}
        {account && <div className="flex flex-col gap-group border-t border-divider pt-panel md:mt-auto">{account}</div>}
      </nav>
      <main className="min-w-0 flex-1 p-section">
        <div className={cn("flex flex-col gap-between", width === "centred" && "mx-auto max-w-frame-content")}>
          {steps}
          <div className="flex flex-col gap-between xl:flex-row xl:items-start">
            <div className="min-w-0 flex-1">{children}</div>
            {panel && <aside aria-label={panelLabel} className="shrink-0 xl:w-frame-panel">{panel}</aside>}
          </div>
        </div>
      </main>
    </div>
  )
}

export { AppFrame }
