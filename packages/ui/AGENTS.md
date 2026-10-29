# UI agent rules

These rules cover design-system components, their Storybook stories and tokens; use the [design decisions](../../.ai/specs/design-system-decisions.md) and [stage progress](POSTEP.md).

## Always

- Before changing a component, story or token, read the relevant entries in the design decisions and the current stage progress.
- Reuse an existing component or primitive before proposing a new one.
- Update the corresponding Storybook story with every component change.
- Use tokens for colours, spacing, typography, radii and shadows.
- Record new approved visual decisions in the design decisions and stage progress in POSTEP.md; keep proposals distinct from approvals.
- Keep money and fuel quantities as exact decimal strings at UI boundaries, never JavaScript `number`, as required by the [root instructions](../../AGENTS.md).

## Ask First

Obtain the owner's approval before:

- Changing the appearance or API of an existing component or primitive.
- Adding a component, adding a token or changing a token.
- Changing default interaction patterns, including dialogs, focus and navigation.

## Never

- While working on a prototype or mockup (`prototypes/`, `.ai/prototypes/`), do not change `packages/ui/src`, `packages/ui/stories` or `packages/app`. Compose current components; record a missing capability as `DS GAP` in the prototype's POSTEP.md and as a proposal for approval.
- Do not bypass a component by styling its internals with CSS.
- Do not add visual values outside the tokens.
- Do not invent an appearance without a source in the design decisions or an approved reference.

## Validation Commands

```sh
pnpm lint:tokens
pnpm test:storybook
pnpm build-storybook
pnpm --filter @fleet-platform/ui typecheck
pnpm test:coverage
```
