# fleet-platform — Engineering Standards and Design Patterns

Status: **approved engineering standard; infrastructure adoption implemented and verified; feature-specific requirements apply during feature implementation**. Research and adoption date: 2026-10-19. Approval: the owner explicitly requested implementation in this thread. Shared API/UI foundations are implemented by explicit owner request ahead of the first domain feature. Feature-dependent capabilities remain pending approved requirements.

This document defines mandatory engineering conventions for the existing stack. Every new feature must comply fully with its applicable requirements. It does not approve candidate domain models, financial policies or authentication choices. Existing requirements in AGENTS.md remain binding; process rules remain there. This specification introduces no decision-register machinery or tests of agent compliance. The undated filename is explicitly requested by the owner and remains the stable reference for future features.

## 1. Product direction and scope

fleet-platform is a micro-ERP for trading and transport companies, delivered one useful capability at a time. The first capability helps a dispatcher decide whether to accept a trip, then compares the accepted plan with post-trip evidence for each revenue/cost component; management receives a monthly summary. Every figure must explain its certainty and origin. A configurable cargo type is the initial operating context, not the product's architecture.

The current release direction includes manual order entry, email extraction followed by dispatcher confirmation, entry of multiple trips, pre-acceptance profitability, empty-distance visibility, automatic GPS/card/invoice evidence, post-trip comparison and monthly reporting. Exact cost components, editable assumptions, allocation methods and the order-to-trip relationship remain subject to requirements analysis. Discovery records are owner hypotheses, not completed user interviews.

Later capabilities can include another cargo workflow, messaging, fuel reconciliation, financial control and document processing. Automatic WhatsApp ingestion, fleet planning, live trip intervention and a driver application are not silently included in the first release. A port for a future channel is not a commitment to implement its integration now.

**Origin and reason — Product idea and discovery:** preserve the decision-before/learning-after loop while preventing the wider system vision from expanding the first implementation unnoticed.

## 2. Research basis and authority

Source labels used in the decision notes below:

| Label | Material examined | How it is used |
| --- | --- | --- |
| Product | Current README, AGENTS Stack, manifests and scripts; the owner's internal notes on the first module's scope. | Current product intent and fixed stack override older examples. |
| Discovery | The owner's internal discovery notes: product vision, release MoSCoW, current-state journey, dispatcher/management VPCs, decisions and TMS benchmarks. | Candidate vocabulary, evidence gaps and release boundaries; no claim that customer demand or benchmark capabilities were newly validated. |
| Trainers | Training reference for engineering standards. | Structure: conventions, reusable API/UI, security, review, adding a concept and incremental adoption. Its application-specific concepts and screens are excluded. |
| Open Mercato | MIT source cloned outside this repository, revision `4374c48def1654927805c4b760f0e7f8648280f2`; links below pin the examined implementation. | Tenant scoping, explicit concept boundaries, CRUD/UI reuse, validation, typed events and a worked reference example; not a dependency or a scaffold to copy wholesale. |
| Legacy architecture | Architecture map, glossary, principles, decisions and lessons from legacy systems of the first customer. | Data ownership, evidence semantics, source boundaries, avoiding vacuous tests and checking claimed guarantees against code. Old technology choices and process gates do not transfer. |
| Legacy operations | Read-only snapshot of legacy systems of the first customer: descriptions, pricing/plan-version/reconciliation modules, fuel-card readers, GPS/invoice adapters, office and dispatch UI helpers, document/messaging modules and available tests under the legacy specifications directory. | Failure modes and portable concepts, not code, constants or customer configuration. This snapshot has no independent Git metadata, and its specifications directory contains tests but no Markdown specifications; a complete historical specification review is therefore not claimed. |

Internal sources are described only by their purpose, without repository paths, revisions or fingerprints. No customer names, identifiers, source rows or operational amounts are reproduced.

Open Mercato reference points:

- [Architecture and data/security conventions](https://github.com/open-mercato/open-mercato/blob/4374c48def1654927805c4b760f0e7f8648280f2/AGENTS.md).
- [CRUD factory](https://github.com/open-mercato/open-mercato/blob/4374c48def1654927805c4b760f0e7f8648280f2/packages/shared/src/lib/crud/factory.ts) and [example route](https://github.com/open-mercato/open-mercato/blob/4374c48def1654927805c4b760f0e7f8648280f2/apps/mercato/src/modules/example/api/todos/route.ts).
- [Request-scope regression tests](https://github.com/open-mercato/open-mercato/blob/4374c48def1654927805c4b760f0e7f8648280f2/apps/mercato/src/modules/example/api/__tests__/todos.request-scope.test.ts) and [pre-mutation scope tests](https://github.com/open-mercato/open-mercato/blob/4374c48def1654927805c4b760f0e7f8648280f2/apps/mercato/src/modules/example/commands/__tests__/todos.prepare-scope.test.ts).
- [Example validators](https://github.com/open-mercato/open-mercato/blob/4374c48def1654927805c4b760f0e7f8648280f2/apps/mercato/src/modules/example/data/validators.ts), [events](https://github.com/open-mercato/open-mercato/blob/4374c48def1654927805c4b760f0e7f8648280f2/apps/mercato/src/modules/example/events.ts), [entities/outbox example](https://github.com/open-mercato/open-mercato/blob/4374c48def1654927805c4b760f0e7f8648280f2/apps/mercato/src/modules/example/data/entities.ts) and [reference-module guide](https://github.com/open-mercato/open-mercato/blob/4374c48def1654927805c4b760f0e7f8648280f2/apps/docs/docs/framework/modules/reference-example-module.mdx).
- [UI API helper](https://github.com/open-mercato/open-mercato/blob/4374c48def1654927805c4b760f0e7f8648280f2/packages/ui/src/backend/utils/apiCall.ts) and [example form](https://github.com/open-mercato/open-mercato/blob/4374c48def1654927805c4b760f0e7f8648280f2/apps/mercato/src/modules/example/components/TodoForm.tsx).

Supplementary primary references: [Zod schemas](https://zod.dev/api), [MikroORM transactions/concurrency](https://mikro-orm.io/docs/transactions), [OWASP authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) and [OWASP CSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html). These support implementation details, not new product scope.

**Origin and reason — All sources:** distinguish existing product decisions, proposed adaptations, historical evidence and unverified assumptions so a reference application's design cannot become an accidental requirement.

## 3. Concepts, ownership and modular growth

### Candidate ownership map

The following are **provisional domain concepts, to confirm after requirements analysis**, not approved entities, tables, routes or a backlog to scaffold. They adapt the legacy map's ten departments into business capabilities. A capability can contain several related nouns and can span existing packages without becoming a separate package.

| Concept namespace | Candidate nouns and sole data ownership | Boundary |
| --- | --- | --- |
| `trips` | Transport order, trip, plan revision, quotation, assignment, cost component, trip reconciliation and profitability result. | Owns commercial intent and its comparison with execution; consumes movement, fuel and document evidence rather than creating competing source registers. Order/trip cardinality remains open. |
| `tracking` | Movement observation, haul, stop, place visit and tracking gap. | Owns interpretation of movement evidence, not trip acceptance, monetary value or a claim that unloading occurred. |
| `fuel` | Fuel purchase evidence, reconciled refueling, consumption observation, fuel balance and fuel-cost evidence. | Purchased, refueled and consumed quantities are distinct. Does not own employee assessment or the whole trip result. |
| `finance` | Invoice accounting projection, cost allocation, exchange-rate reference and period summary. | Owns financial reconciliation and later accounting views; consumes versioned trip results. Does not recalculate the same trip formula independently. The first monthly summary can be a projection of trips before finance has standalone features. |
| `people` | Person, driver/office roles and assignment history. | Owns human reference records; authentication credentials and access memberships are separate security concerns. |
| `documents` | Original document, extraction proposal, accepted reading, evidence link and document revision. | Owns document bytes and their interpretation history; receiving a document does not settle a trip or post an invoice automatically. |
| `monitoring` | Source freshness, coverage gap, import failure and operational alert. | Owns system/data-health signals, not rewriting business outcomes or silently repairing source evidence. |
| `counterparties` | Counterparty, customer/supplier/carrier roles and place catalog. | One tenant-local identity with multiple roles; a place is distinct from a registered-office address. No private copies in each capability. |
| `assets` | Vehicle, trailer, device and asset contract/reference data. | Owns fleet registry, not GPS-derived activity or period cost calculations. |
| `forwarding` | Carrier engagement and subcontracted transport assignment. | Refers to counterparties and trips; deferred until an actual forwarding requirement exists. |

Shared registries are shared **by reference**, not by allowing every concept to write them: vehicles belong to assets; people to people; counterparties and places to counterparties; originals to documents. Other concepts call the owner's operation or consume its DTO. Cross-concept references use tenant-qualified IDs; database foreign keys may enforce integrity without exposing cross-concept ORM object graphs or cascading writes. A historical snapshot is allowed when explicitly versioned and linked to its source; it is not another authoritative register.

The legacy four shared parts map to the new packages as follows:

| Shared responsibility | Adaptation here |
| --- | --- |
| Platform foundation | Pure decimal/evidence/contracts in core; persistence/migrations in db; authentication, configuration and DI orchestration in app/server. The old meaning of “Core” is not copied into packages/core. |
| Sources | Provider adapters and ingestion orchestration at server boundaries; persistence adapters in db. Providers do not own business conclusions. |
| UI | One app, shared UI primitives/patterns and translated text; no second interface per division or department. |
| Development conventions | Existing AGENTS instructions and current tooling. No legacy process-test framework, gate registry or agent-exam runtime. |

### Start small, preserve a route to modules

Start with a layered monolith: same-named concept folders only in layers that need them. Create a folder **with its first file**, never an empty tree for all ten capabilities. First implement one approved trip-profitability slice and the minimum shared references it needs. Extraction of another capability later should add its public contracts, implementation and explicit DI bindings, not alter callers to know its storage/provider internals.

Use public concept exports, explicit registration and one data owner now. Consider extracting a package only when an independently maintained capability has real consumers or deployment needs. Do not add a module loader, per-concept bootstrap/ACL manifests, automatic discovery, a plugin marketplace or microservices ahead of that need. Open Mercato is the long-term boundary reference, not the initial runtime.

**Origin and reason — Product, trainers and legacy architecture, informed by Open Mercato:** same-named concept folders keep the first slice small, while explicit ownership and contracts prevent a later cargo workflow or financial capability from forcing a rewrite.

## 4. Company configuration, divisions and cargo types

A tenant is the company boundary; a division is an organizational/reporting attribute **inside** that company. Cargo type is a separate operational attribute. They must not be conflated with each other, an authorization boundary or a provider account.

Store tenant-owned division/cargo definitions and applicable policy parameters as configuration with stable IDs and validity/version information. Names such as granulate and dust are configurable labels, never class names, package names, table variants or branches such as `if (divisionName === ...)`. A new label needs configuration; genuinely new behavior needs an explicitly selected strategy/port implementation with an approved contract, not arbitrary executable code stored in configuration.

Keep nominal vehicle assignment separate from activity attribution for a period. Derive reporting membership from the approved allocation policy and retain its inputs/version; do not assign all historical trips to today's vehicle division. Rules for empty distance, mixed activity, tariffs and cost components remain open until confirmed. Preserve the configuration revision used by each accepted plan and report.

**Origin and reason — Product and legacy glossary/financial lessons:** the next division should reuse the product while historical reports remain reproducible when fleet assignments or company settings change.

## 5. Package boundaries and target layout

Keep the chosen four packages and the existing stack. Proposed dependency direction:

```text
app/server -> core contracts + pure calculations
app/server -> db implementations
app        -> ui
 db        -> core contracts (when needed)
core       -X-> app, db, ui, Next.js, MikroORM, Awilix, provider SDKs
ui         -X-> db, app/server, ORM entities, credentials
```

`core` contains plain types, Zod schemas, ports, deterministic calculations and domain error/result values; it never opens a connection, reads process environment, calls a provider or resolves a container. Pass time, policy, rates and input evidence explicitly. `app/server` orchestrates use cases, transactions and side effects. `db` implements repositories, mappings and migrations. `ui` stays generic; app supplies domain schemas, DTOs and translated labels through props rather than making UI import server/domain implementations.

Target locations, created only when first needed:

| Kind | Location |
| --- | --- |
| Pure concept logic | `packages/core/src/concepts/<concept>/` |
| Shared evidence/decimal/transport contracts | `packages/core/src/contracts/` |
| Input/output validators | `packages/core/src/validators/<concept>/` |
| Repository/provider interfaces | `packages/core/src/ports/<concept>/` |
| Persistence schemas and repositories | `packages/db/src/entities/<concept>/`, `packages/db/src/repositories/<concept>/` |
| Application use cases | `packages/app/src/server/services/<concept>/` |
| HTTP/auth boundary | `packages/app/src/server/http/` |
| External adapters | `packages/app/src/server/adapters/<provider>/` |
| HTTP entry point | `packages/app/src/app/api/<concept>/.../route.ts` |
| Generic panel patterns | `packages/ui/src/backend/{api,forms,tables,feedback}/` |
| Shared concept UI | `packages/ui/src/concepts/<concept>/` |
| Single-page UI | Colocated with the page until a second consumer needs it. |

Existing shadcn primitives stay under `packages/ui/src/components/`, matching current exports and CLI configuration; do not move the existing Card just to match the training tree. A future concept's public index exports contracts/functions deliberately, not every internal file. No service/entity pairing is required for a pure calculation or read projection.

**Origin and reason — Trainers adapted to Product Stack:** reuse the layered convention, but deliberately reject the trainers' `core → db` direction and placement of HTTP/DI inside core because fleet calculations must stay database-independent.

## 6. Naming and code quality

| Element | Convention/example |
| --- | --- |
| Package | Existing `@fleet-platform/app`, `core`, `db`, `ui`. |
| Concept | Stable English noun namespace, normally plural; mass nouns such as `fuel`/`finance` remain singular. Use the ownership map's agreed spelling. |
| Type/entity | Singular PascalCase, e.g. `TripPlan`; explicit plural snake_case table name. |
| File/function | kebab-case files; camelCase functions/variables; descriptive suffixes such as `.schema.ts`, `.port.ts`, `.repository.ts`, `.service.ts`. |
| DB columns | snake_case mapped from camelCase; `tenant_id` in storage, `tenantId` in TypeScript. |
| Component | PascalCase export; retain existing shadcn CLI filenames. |
| Page | Next.js App Router route entry files are named `page.tsx`. Default-export a named PascalCase component ending in `Page`, describing its purpose, e.g. `TripProfitabilityPage`; avoid anonymous exports or the generic component name `Page`. |
| Schema | `tripPlanInputSchema`; derive types with `z.infer`, not a separately maintained input interface. |
| Port/adapter | `TrackingPort`, `InvoiceSourcePort`; adapter names identify the implementation only at the boundary. |
| DI key | camelCase, explicit cradle type and registration. |
| Event | `<concept>.<entity>.<past-action>`, e.g. `trips.plan.accepted`; version in the envelope. |
| Translation | Stable semantic keys such as `trips.profitability.estimated`; English identifiers, Polish displayed text. |

Prefer small functions, composition and explicit typed contracts over base-service hierarchies and generic repository frameworks. Use `unknown` at untrusted boundaries, narrow it through validation, and avoid `any`, unchecked casts and unexplained non-null assertions. Handle missing/error cases explicitly; name policy constants; remove debug output and dead code. Comments explain a non-obvious reason or source assumption. A shared block belongs in one place when its semantics truly match; do not unify distinct costs or observations just because their fields look similar.

**Origin and reason — Trainers and legacy single-owner lessons:** consistent names and small explicit abstractions make new concepts discoverable without creating a generic framework or concealing domain differences.

## 7. Tenant isolation, authorization and request scope

Every company-owned row has a **non-null tenantId/tenant_id**, including children, join rows, configuration, revisions, import batches, evidence, audit records and future durable events. Shared static technical constants are not company records. Do not introduce nullable “global tenant” business rows as a shortcut. The current product needs one company scope; Open Mercato's additional organization hierarchy is not adopted without requirements.

Resolve tenant context from authenticated server-side membership or a verified integration identity. Never trust a tenant ID in a request body, query, browser-selected header or webhook payload. A company switch requires membership validation. Carry an immutable request scope containing the authorized tenant and actor into use cases/repositories; jobs carry a validated scope explicitly. A forked EntityManager isolates ORM state, **not authorization**.

Every company-owned query filters by tenant, including lookup by ID, counts, joins, exports, validation lookups, updates/deletes, pre-update snapshots, background work and report aggregation. Assign tenant IDs on the server. Tenant-qualified uniqueness and composite foreign keys (or equally strong database constraints) prevent cross-tenant references. Never expose a repository operation that accepts only an unscoped business ID. Check permission for the specific operation and record, not just login status.

Use the existing Awilix composition root, shared ORM pool and request-scoped fork. Never cache a current tenant, actor or mutable EntityManager globally. Include tenant and relevant permissions/configuration revision in cache keys; protect document/download references and event audiences with the same scope. RLS may later provide defense in depth, but is not implemented or a substitute for scoped access.

A change touching tenant-owned storage/query/auth scope ships an isolation test with **two synthetic tenants**, proving allowed same-tenant behavior and refused cross-tenant access. Cover affected reads/writes, related IDs, pre-images, exports and aggregates; interleave requests where shared caches/state are involved. Test missing scope and forged scope as refusal cases.

**Origin and reason — Product requirement plus Open Mercato scope regressions:** isolation must hold across every read/write path, including less visible projections and caches, rather than only on the main list endpoint.

## 8. Persistence, migrations and concurrency

MikroORM entities describe storage; map them to explicit DTOs and core inputs rather than serializing entities into UI/API responses. Use explicit entity registration and stable table names compatible with the Next.js bundler. The empty entity list is intentional until an approved feature requires persistence.

Keep migrations in the existing db package and run them explicitly through the repository's CLI. Review generated SQL for tenant constraints, indexes, destructive changes and preservation of historical evidence. Do not run schema synchronization or migrations while rendering, booting the UI or building the app. Build must remain possible without a reachable database. Apply/rollback-or-forward-recovery behavior needs verification on disposable data before a migration changes persisted business information.

Use a transaction for changes that must succeed together: plan acceptance, evidence attachment, revision creation and associated audit/outbox writes. Use a unique constraint for import/idempotency keys and optimistic version checks for concurrent edits; return a conflict rather than overwrite another user's plan. A transaction alone does not prevent a check-then-insert race: add a constraint, conditional update or appropriate lock. Keep network calls outside long-running DB transactions.

Retain accepted plans and source corrections as revisions; cancellation and correction are explicit actions, not silent deletion of financial history. Retention/deletion rules for personal information require a separate approved policy. Store event instants in UTC, business dates as dates and reporting time zones as explicit configuration; use half-open interval boundaries for period calculations.

**Origin and reason — Legacy versioned plans, trainers and MikroORM concurrency guidance:** explain a past decision from what was known then, while preventing double imports, lost edits and accidental schema changes.

## 9. Decimal correctness, evidence and provenance

### Exact numeric representation

Money and fuel quantities use PostgreSQL `numeric` and `decimal.js`, never JavaScript `number` at input, calculation, ORM mapping, aggregation, JSON serialization or display formatting. DTOs carry validated decimal strings. Do not use `parseFloat`, `Number`, unary `+`, `toNumber`, `z.coerce.number()` or numeric form coercion for these fields. Counters, pagination and other non-financial technical integers may use number.

An ORM mapping must explicitly convert decimal strings to/from Decimal without an intermediate number; test this round trip. Specify currency for money and units for quantities. Never add unlike currencies, mix net/gross values or treat an unverified currency label as authoritative. Conversion retains original amount/currency, rate reference, effective date and rule version. The owner approves scale, arithmetic precision, rounding mode and where rounding occurs before calculations ship; do not accept library defaults as a business decision.

**Origin and reason — Product Stack and legacy currency/reconciliation failures:** exact representation is required from import through reporting, and a provider field name does not prove the monetary meaning of its contents.

The shared `decimalStringSchema` is exported through `@fleet-platform/core/contracts/decimal`. It accepts canonical signed decimal strings and preserves every digit, including trailing fractional zeros, without number coercion or arithmetic. It rejects numbers, exponent/comma notation, whitespace and non-finite text. Feature schemas add approved bounds, currency/unit and scale constraints. This lexical contract does not choose a financial precision or rounding policy and is not an ORM mapping.

### Evidence contract

The following is a proposed contract, not an entity schema. Separate three axes: **phase** (plan/actual), **availability** (known/missing/conflicting), and **certainty** (certain/estimated for a known value).

```ts
type Certainty =
  | { kind: "certain"; validationRef: string }
  | { kind: "estimated"; reasonCode: string; methodVersion: string };

type SourceRef = {
  kind: "gps" | "fuel-card" | "invoice" | "manual" | "calculation";
  evidenceId: string;       // tenant-scoped record, never a raw provider payload
  revision: string;
  fieldPath: string;        // which field in that evidence supports this value
  observedAt: string;
  receivedAt: string;
};

type KnownValue = {
  state: "known";
  value: string;            // validated decimal string, not arbitrary text
  unit: string;
  currency?: string;       // required by the money-specific schema
  certainty: Certainty;
  sources: [SourceRef, ...SourceRef[]];
};

type EvidenceValue = KnownValue
  | { state: "missing"; reasonCode: string }
  | { state: "conflicting"; candidates: [KnownValue, KnownValue, ...KnownValue[]] };

type ComponentComparison = {
  tenantId: string;
  componentId: string;
  planRevisionId: string;
  plan: EvidenceValue;
  actual: EvidenceValue;
};
```

A real contract adds metric identity, observation period, source coverage/freshness, calculation/configuration versions and a calculated-as-of timestamp where applicable. Derived values retain references to all effective inputs, including their revisions. Validation must enforce compatible units/currency among candidates and comparisons. A `validationRef` names an actual validation/approval record; sending that field from a client cannot grant certainty.

“Certain” means the particular field has passed the approved evidence rule, not absolute truth. A validated invoice may establish an amount but not its allocation to a trip. GPS may establish a position but not unloading. A card purchase does not establish fuel consumed on a trip. A plan may contain a certain agreed rate; actual cost may still be estimated. Manual confirmation and OCR confidence are not automatic evidence of correctness. Provider-specific source precedence must be explicit and versioned, with ambiguity visible.

Derived figures remain estimated if any required input or allocation is estimated. Missing inputs stay missing; a displayed subtotal or fallback is explicitly partial/estimated, with coverage, and must not become the complete actual result. Contradictory sources remain unresolved rather than being silently averaged. A confirmed zero is a known value; absence is never zero. A percentage variance with a zero/missing denominator is unavailable, not Infinity or zero.

Keep the plan selected at the approved decision checkpoint immutable. Later planning revisions and late invoices produce a new comparison revision, not a rewrite of what the dispatcher knew. The precise checkpoint is an open business decision. Monthly totals identify the included trips, division-allocation policy, cutoff, excluded/unmatched evidence and certainty coverage; prevent shared costs or repeated evidence being counted twice. Historical reports must identify whether they are original or restated.

Show Polish certainty labels and an accessible source/reason detail beside each figure in screens and exports; do not rely on color alone or hide uncertainty in a footer. Measures describe evidence, not accusations about people. Fuel-loss conclusions require independent corroboration under an approved rule; two reads of the same source are not independent.

**Origin and reason — Product's central promise, discovery and legacy evidence principles:** the system must explain both the number and why it deserves trust, without collapsing planned, observed, inferred and missing information into one decimal.

## 10. Ports, adapters and reliable events

Define typed ports for tracking evidence, fuel-card transactions, invoice retrieval, document extraction and messaging. Provider-specific parsing, credentials, pagination, rate limits and retries belong in adapters, not calculations or pages. WhatsApp is a channel adapter, not a domain or the owner of documents/trips. Replacing a card/GPS/invoice provider must not change the caller's business contract.

Normalize units, source identifiers, timestamps and currency semantics at the adapter boundary, retaining a private source reference and parser version. Keep raw evidence outside Git. Deduplicate within tenant + provider account + source identifier/revision; overlapping endpoints and legitimate repeated charges need a documented reconciliation rule, not a blanket DISTINCT. Track coverage separately from last successful download: a recent sync can still be incomplete. Unknown mappings enter a review state instead of silently attaching to a trip.

Adapters own ingestion records, not another concept's tables. The application invokes the relevant owner's operation to accept evidence. Extraction produces a proposal; dispatcher confirmation is required for the initial email-to-order path. Originals, extracted candidates and confirmed values remain distinct. Prefer read-only provider capabilities for ingestion; sending messages or making provider-side changes is a separate explicit use case. Preserve thin legacy adapters behind an API if reused operationally; never share an old database or copy old Python calculations into core.

Declare typed events only when there is a real consumer. Core can return event facts; the application publishes after a successful transaction. Envelopes include event ID, tenant, aggregate/reference ID, schema version, occurrence time and correlation/idempotency references, with minimal payload. Lightweight in-process delivery is suitable only for non-critical notifications that tolerate loss. Before required imports, external sends or financial follow-ups need durable delivery, implement a transactional outbox and idempotent consumer with bounded retries, checkpointing and an operator-visible failure state. Do not claim exactly-once external delivery or build a queue platform speculatively.

**Origin and reason — Trainers' ports, Open Mercato events/outbox and legacy ingestion failures:** normalize provider differences once, preserve ownership and make retries safe without importing an entire module/event runtime.

## 11. Shared API and Zod validation

Every new feature must comply fully (100%) with this document. CRUD API routes must use `makeCrudRoute` exclusively; non-standard business operations must use `apiHandler`. A hand-written CRUD route is rejected in code review.

These shared helpers **are implemented**. The owner explicitly authorized foundational API/UI work before the first domain feature. Each helper has one implementation for all concepts; extend it through typed configuration and composition rather than copying infrastructure into feature folders. Domain schemas and services still require an approved feature.

| Helper | Home and contract |
| --- | --- |
| `apiHandler` | app/server/http: establish authenticated scope, enforce permission, validate inputs, invoke a use case, map typed errors and emit one safe response envelope with correlation ID. |
| `makeCrudRoute` | app/server/http: the single CRUD route builder/model factory, composing a server-registered model descriptor, Zod input/output schemas and a tenant-scoped service into allowed route methods. It delegates the common request lifecycle to `apiHandler` and centrally binds trusted company scope to service calls. No unchecked generic entity name or client-selected filter/tenant. |
| `apiCall` / `apiCallOrThrow` | ui/backend/api: one browser-to-application transport helper, handling aborts, credentials, CSRF headers, HTTP failure and malformed/non-JSON responses; validate through a supplied response parser. |
| Domain Zod schemas | core/validators: shared by server and the app's form composition; infer DTO types with `z.infer`. Server validation remains authoritative. |
| Envelope schema | A framework-free core contract composed by app; UI transport receives the parser through its caller, avoiding UI imports of core internals or duplicate domain schemas. |

For every new feature, `apiCall` is the only browser-side location allowed to call `fetch` for application `/api/*` endpoints. `apiCallOrThrow` delegates to it for callers that need exceptions. Decode JSON defensively in this shared layer and return a typed result; never hide malformed responses with `res.json().catch(...)` or duplicate response decoding in components.

Implemented wire shape: `{ ok: true, data, meta? }` or `{ ok: false, error: { code, messageKey, fieldErrors?, correlationId } }`. Do not expose stack traces, SQL, tokens or raw provider messages. Application/domain errors do not construct HTTP responses; the HTTP boundary maps them consistently. A successful HTTP status with an invalid expected payload is a protocol error, not an empty successful result.

Use explicit Zod input shapes for body, query, parameters, provider payloads and environment settings. Reject unknown mutation fields; never spread a raw body into an ORM entity. Set scope and protected fields server-side. Validate identifiers, date intervals, lengths, sort allowlists and bounded pagination. Decimal schemas accept strings and reject non-finite/invalid values; client input localization must not pass through number. Validate outputs at integration/transport boundaries where shape drift can mislead callers.

Every CRUD API route must be built exclusively with `makeCrudRoute`; route files provide declarative configuration and export its generated handlers. Hand-written CRUD handlers are not allowed, including CRUD disguised as a custom `apiHandler` operation. Authentication, authorization, company-scope enforcement, validation and error mapping have one shared implementation, not copies in each route. Tenant-scoped repositories must still enforce that scope on every query; using the builder does not replace data-layer isolation tests. Non-standard business operations, such as accept-plan, reconcile-evidence and settle, must use `apiHandler` with explicit commands, never arbitrary CRUD status updates. Recompute financial consequences server-side from approved inputs; UI previews are not authoritative. React server components can call authorized server use cases directly without an HTTP loopback. The apiCall rule concerns browser calls to our API, not provider adapters or server-side transport. Preserve the existing minimal health endpoint until an explicit implementation change adopts the shared wrapper.

**Origin and reason — Explicit owner requirement, informed by Trainers and Open Mercato and adapted to the pure-core boundary:** require one CRUD builder and shared request lifecycle so new features cannot diverge in authorization, tenant isolation, validation or error behavior.

### Implemented foundation contracts

- `packages/core/src/contracts/api.ts` exports `apiResultSchema(dataSchema)` and the shared result/error contract. Pass the composed result parser to `apiCall`; UI has only structural transport types and does not import core/domain implementations.
- `packages/app/src/server/http/api-handler.ts` exports `apiHandler`, `ApiHttpError`, JSON/query readers and HTTP dependency types. Server composition must provide `authenticate`, `authorize` and `verifyMutation`; there is no permissive production implementation or client-selected tenant. Scope is validated and frozen per request. All writes require successful mutation verification; production cookie authentication must verify CSRF tokens and trusted origins there. Authentication/session storage remains a separate decision.
- `packages/app/src/server/http/make-crud-route.ts` exports `makeCrudRoute({ model, createSchema, updateSchema, service, dependencies, permissions })`. Use strict Zod object schemas. `model` is a registered name/output schema descriptor, not a new ORM entity. Export the selected generated methods from `collection` (GET/POST) and `item` (GET/PATCH/DELETE); item context carries `params: Promise<{ id: string }>`.
- The builder constructs immutable `{ tenantId }` / `{ tenantId, id }` service filters from authenticated scope, stamps create input, rejects protected ID fields and unknown query/input fields, and rejects foreign-tenant or wrong-ID service results. List pagination accepts bounded `offset` and `limit`; no arbitrary filtering/sorting API exists. Services must apply the supplied predicates atomically in persistence, including totals and mutations; post-result checks cannot undo an unsafe repository write. Record-level business authorization also belongs in the feature's scoped service.
- `apiHandler` centralizes permission checks, input/output validation, safe errors, correlation IDs and no-store responses. Core/application use cases throw the framework-independent `ApplicationError` with a fixed public code; `apiHandler` maps it to HTTP status and translated message keys. `ApiHttpError` remains for transport-boundary failures only. Unexpected failures emit only `INTERNAL_ERROR` and the correlation ID to the server error stream, never exception messages, bodies or request URLs. A forked EntityManager is still required when a future service uses the existing Awilix composition root; these generic helpers do not initialize a database.
- `packages/ui/src/backend/api/apiCall.ts` exports `apiCall` and `apiCallOrThrow`. Calls are restricted to same-origin `/api/` paths, use same-origin credentials, reject redirects, accept an abort signal and optional CSRF token, and validate the whole response envelope. Network, cancellation, protocol and server failures remain distinct. `apiCallOrThrow` delegates to the same transport.
- The synthetic in-memory service in `make-crud-route.test.ts` exercises all CRUD methods and a command with two tenants, plus an end-to-end `apiCall`/envelope/route round trip. It is test-only: no test route, domain entity, production authentication or SQL isolation guarantee is implied.

## 12. Shared UI, translations and feedback

Keep Tailwind and the configured shadcn/ui component system. The following components live centrally in `packages/ui/src/backend/` and serve every concept. The generic form, table and four feedback components are implemented ahead of the first domain consumer by explicit owner request. All applicable screens must compose them rather than implement a local equivalent. The domain-specific value/evidence component remains deferred.

| Shared component | Required reusable behavior |
| --- | --- |
| `forms/CrudForm.tsx` | Schema-driven create/edit forms using the same Zod input schema as the server, supplied by app. Render configured fields, client validation and server-returned `fieldErrors` next to the correct field; handle submit/cancel, pending state, failed submissions and unsaved edits. Standardize Cmd/Ctrl+Enter to submit and Escape to cancel, respecting pending state, focused overlays and unsaved-change protection. |
| `tables/DataTable.tsx` | Column-configured lists with stable row keys, pagination, row actions and shared loading/error/empty states. Use it for ordinary list screens instead of hand-rolling tables and pagination per page. |
| `feedback/LoadingMessage.tsx`, `ErrorMessage.tsx`, `EmptyState.tsx`, `SuccessMessage.tsx` | The shared renderers for loading, errors, empty results and success. Pages and the form/table components compose these instead of inventing their own spinners or feedback markup. Accept translation keys or translated labels and accessible presentation options. |
| Shared value/evidence component | One presentation contract for exact values, currency/unit, certainty, source and missing/conflicting evidence across concepts and reports. Its final name and props follow the first approved profitability feature. |

Feature code supplies schemas, field/column definitions, labels and callbacks; generic components do not import domain services or own business rules. Extend the common implementation with typed props, slots or composition when another concept needs a variation. Do not fork it into concept-specific copies. A bespoke form or table requires a concrete interaction that the shared component cannot reasonably express, documented with the feature; it still uses shared transport, feedback and applicable primitives. A purpose-built plan-versus-actual comparison is a possible example, not a blanket exemption for profitability screens.

Distinguish no results, missing data, source outage, authorization failure and a confirmed zero. Preserve user input on failure, make duplicate submissions safe, and show concurrency conflicts rather than silently refreshing away edits. Keyboard navigation, focus, labels, error associations and mobile layout are part of the shared component contract.

The implemented `CrudForm` supports flat string-valued text/email/textarea fields configured by `fields`, a supplied Zod schema and `initialValues`. `onSubmit` returns the shared result shape; `confirmDiscard` supplies the owner's UI decision for cancelling dirty input. Failed submissions retain input; pending work locks submit/cancel, field errors receive focus, and browser unload warns on dirty state. Application navigation must also consult dirty-state policy when a future screen adds navigation. Remount with a record-specific React `key` when editing another record; initial values are not silently overwritten by background refreshes.

`DataTable` is a controlled paginated view: callers supply the current page's rows, stable `rowKey`, columns, total/page/pageSize and `onPageChange`; optional row actions are rendered by the caller. It never fetches data or contains domain logic. Supply translated labels to form/table/feedback; the application messages module provides the Polish defaults and safe API message translation. Advanced field widgets, sorting, optimistic editing and domain evidence rendering are not implemented.

All product UI text is Polish and lives in translation/message files, including validation, feedback and certainty labels. Extend the current messages module incrementally with semantic keys; do not introduce another i18n framework now. Generic UI receives translations; raw server/provider errors are not user-facing copy. Format exact decimal strings without converting financial values to number; retain currency/unit and certainty in exports as well as screens.

**Origin and reason — Trainers' reusable panel layer, Open Mercato forms, Product evidence semantics and the owner's explicit centralization requirement:** one reusable implementation keeps interactions and evidence meaning consistent as modules are added.

## 13. Minimum security and operational safety

Before real company data is served, authenticate and authorize every non-public route, server action, server-component query, export and document download. Deny on missing/ambiguous scope or authorization errors; UUIDs and hidden buttons do not replace permission checks. Protect cookie-authenticated writes with server-validated CSRF defenses and origin policy; use Secure/HttpOnly/SameSite cookies appropriately, generic authentication errors, throttling and session revocation. Authentication/session technology is not chosen by copying the trainers' JWT defaults.

Use parameterized persistence; never interpolate untrusted SQL, shell commands, sort expressions or paths. Restrict upload size/type, validate actual content, use opaque tenant-scoped document handles and scan untrusted documents before processing. Verify webhook authenticity and replay protection; outbound fetch/download URLs require an allowlist or equivalent SSRF protection. Escape UI text; avoid untrusted HTML.

Secrets stay outside Git and client bundles, including `NEXT_PUBLIC_*`. Logging records safe error codes, correlation IDs and aggregate operational metrics, not customer rows, document bodies, credentials or full URLs containing secrets. Audit accepted financial/evidence changes transactionally with actor/reference IDs and reason; business history is distinct from operational logs. Company data may exist in authorized deployment storage, never in fixtures, source, issues, PRs or run logs. Verify recovery using disposable restore exercises when persistent business data is introduced; a successful backup command alone is not proof of recoverability.

**Origin and reason — Trainers, Open Mercato and legacy document/access incidents, checked against OWASP:** enforce access at server boundaries and retain useful diagnostic evidence without exposing the data the system is supposed to protect.

## 14. Tests, golden cases and verification

Tests verify product behavior and code risks, not adherence to documentation/process. Use synthetic data only, with no copied or transformed customer identifiers/rows. Derive cases from approved contracts and observed failure classes; a fixture must not merely repeat the implementation's mistaken assumption.

- **Pure calculations:** owner-approved synthetic inputs and expected decimal-string outputs, with policy/rounding and evidence versions. Cover missing/conflicting inputs, mixed currencies, zero denominators, partial coverage, period boundaries and aggregation without duplication.
- **Legacy golden cases:** build independent synthetic scenarios, run the old calculation outside this repository where useful, and obtain owner approval of expected results and their explanation. Old output is a comparison, not an oracle: reconcile known defects or changed semantics before approving a fixture. Do not copy legacy code or round-trips through floating point to reproduce its mistakes.
- **Persistence/integration:** disposable PostgreSQL for numeric round trips, tenant isolation, tenant-qualified foreign keys, concurrency, idempotent imports, transactions and migration behavior. Mocks alone do not prove SQL constraints or decimal mapping.
- **Adapters/events:** synthetic provider payloads for duplicate/overlapping pages, partial downloads, unknown units, late corrections, retry/restart and rejected scope; no live provider credentials in routine tests.
- **API/UI:** allowed and denied operations, malformed responses, field errors, decimal formatting, missing-versus-zero display, certainty/source labels, keyboard use and responsive comparison views.

Keep test discovery limited to product package sources, as the existing Vitest configuration does. Extend discovery deliberately if future suites use another location. Assert meaningful non-empty coverage where an empty result would hide an import or selection failure. A behavior-relevant bug fix needs a regression reproducing the failure; broader validation follows the affected boundary, not a fixed ritual.

**Origin and reason — Product golden-case requirement, legacy fixture/source lessons and current test-discovery lesson:** verification must independently demonstrate numeric truth, scope isolation and recovery rather than make the implementation agree with itself.

## 15. Adding a concept: agent implementation recipe

After an approved feature specification exists:

1. Confirm its noun, data owner, tenant scope, consumers and glossary meaning; check for an existing concept before introducing a new one.
2. Define the minimum core input/output schemas, pure function and ports that the feature actually needs. Include certainty/provenance and synthetic acceptance cases where figures are involved.
3. Create each concept folder with its first real file. Add a tenant-owned entity/repository and reviewed migration only if persistence is needed; a pure calculation does not need an entity.
4. Implement orchestration under app/server, inject repository/provider ports through explicit Awilix registration and preserve request-scoped EntityManager isolation.
5. Expose CRUD exclusively through `makeCrudRoute`; expose non-standard business operations through `apiHandler`. Use commands for business transitions; do not let generic CRUD bypass invariants.
6. Compose UI with the shared transport/form/table/feedback patterns and translation keys. Build the first minimal version of a missing helper with this consumer, not an unused general framework.
7. Add relevant calculation, isolation, persistence, adapter and UI checks; run existing repository commands, reporting any checks that cannot run.
8. Make this completed slice a small reference for the next agent: document its public exports, ownership and extension points in its feature specification. Do not add an unrelated demonstration domain or a copy of Open Mercato's example module.

**Origin and reason — Trainers' concept recipe and Open Mercato's worked example:** one real, tested product slice teaches agents the convention more reliably than a speculative scaffolder.

## 16. Technical code-review checklist

- [ ] Every new feature complies fully (100%) with this document.
- [ ] The change implements an approved requirement; candidate concepts and unresolved policies are not treated as confirmed facts.
- [ ] The owner of each changed value is clear; no copied registry, foreign-table write or dependency from core to infrastructure appears.
- [ ] Company-owned rows, reads/writes, related IDs, exports and cache keys are scoped; relevant two-tenant isolation tests cover the change.
- [ ] Money/fuel never pass through number; mapping, units, currency, precision and approved rounding are tested end to end.
- [ ] Plan/actual, certainty and availability remain distinct; the result retains source/configuration/calculation revisions and exposes missing/conflicting inputs.
- [ ] Mutations protect concurrent edits, transactions and retry/idempotency boundaries; original evidence and accepted plan revisions remain explainable.
- [ ] Reject any hand-written CRUD API route: every CRUD route is generated by the single `makeCrudRoute` builder from a registered model, Zod schemas and a service. Non-standard business operations use `apiHandler`; browser API calls use `apiCall`.
- [ ] API/UI reuse the centralized helpers, with no per-page transport/form/table/feedback copies; bespoke interactions have a documented reason. Raw bodies cannot assign protected fields; custom workflows do not bypass authorization.
- [ ] UI text is translated, feedback is accessible and evidence meaning survives display/export.
- [ ] Tests use independent synthetic cases and disposable resources, with no customer data/secrets in code, snapshots, logs or responses.
- [ ] Validation evidence matches the change; unavailable checks and remaining limitations are stated accurately.

**Origin and reason — Trainers' review structure, Open Mercato isolation checks and Product risks:** review concentrates on boundaries that can produce a wrong financial conclusion or expose another company's data, without adding process gates.

## 17. Current tools and commands

The stack is fixed by AGENTS.md. Current baseline: Node.js 24, pnpm 11.10.0, Next.js 16.4.2, React 19.3.1, TypeScript 6.0.3, MikroORM 7.2.5, Awilix, Tailwind, shadcn/ui, PostgreSQL and decimal.js. Preserve the checked-in compatibility pins and lockfile; this specification does not upgrade dependencies. Zod 4.6.7 is installed in core, app and ui. Shared API/UI helpers are implemented; UI interaction tests use Testing Library and jsdom. These additions preserve the selected stack and exact lockfile pins.

| Command from repository root | Existing purpose |
| --- | --- |
| `pnpm install --frozen-lockfile` | Reproduce workspace dependencies. |
| `pnpm dev` | Load root environment and run the app on loopback. |
| `pnpm typecheck` | Generate Next route types and type-check all workspaces. |
| `pnpm lint` | Lint product packages. |
| `pnpm test` | Run Vitest unit suites under `packages/*/src/` and `scripts/`. |
| `pnpm test:coverage` | Run unit suites with the enforced 100% coverage threshold. |
| `pnpm test:integration` | Build, then run integration suites against Testcontainers PostgreSQL and a disposable app instance through agent-browser. |
| `pnpm app:ephemeral` | Start the disposable instance for manual agent-browser checks. |
| `pnpm build` | Production application build, without requiring database connectivity. |
| `pnpm start` | Run the production build with root environment. |
| `pnpm db:check` | Execute a database connectivity query. |
| `pnpm db:debug` | Inspect ORM configuration locally; output needs review before sharing. |
| `pnpm db:migration:create` | Generate a migration after an approved entity change. |
| `pnpm db:migrate` | Apply reviewed migrations to the explicitly configured database. |
| `docker compose up -d --wait postgres` | Start the optional local PostgreSQL service after local environment setup. |

Use the existing environment example for disposable development, never production credentials. A raw MikroORM schema-update command is not the migration workflow. The pull-request CI workflow and integration-test framework are defined in [the CI and testing specification](2026-10-19-pull-request-ci-and-testing.md). Dependency/security inspection such as `pnpm audit` is an available manual investigation, not an existing scripted gate or permission to upgrade the stack. Keep shadcn CLI aliases consistent with the current UI package.

**Origin and reason — Current repository, not trainer commands:** contributors must be able to run what is actually present, and distinguish the skeleton from the standards' future adoption work.

## 18. Adoption order, open decisions and acceptance

The engineering baseline is approved. Continue incrementally: approve the first feature's domain contracts; implement its tenant/auth/data foundation and a pure calculation with golden cases; compose the existing API/UI foundations around that slice and extend them only as needed; then add an evidence adapter and reliable reconciliation. Add events/durable work only at the first requirement that needs them. Each step must remain buildable. The owner authorized both baseline adoption and generic API/UI implementation before domain features; feature-specific domain and policy decisions still require approval.

Decisions still required: order/trip/haul cardinality; exact cost/revenue components; accepted-plan checkpoint; empty-distance and shared-cost allocation; division attribution and reporting cutoff; money/fuel precision and rounding; net/gross and exchange-rate policies; field-specific certainty/validation and conflict precedence; roles and authentication/session design; correction/retention rules; and which integrations ship in the first slice. Legacy thresholds, cost formulas, account settings, cargo labels and personal workflows are not defaults.

This document is acceptable when its ownership map and boundaries support the first module and the next capability without prescribing unvalidated business rules; the evidence contract covers plan/fact, certainty, missing/conflicting values and lineage; isolation and exact arithmetic are explicit and testable; source notes justify the major adaptations; and all referenced current commands exist. Validate each implementation change with checks appropriate to its scope. Adoption of this baseline does not mean every future capability described above already exists.

**Origin and reason — Product's module-by-module direction and trainers' incremental adoption:** agree the engineering baseline now while leaving business semantics to requirements analysis and avoiding premature implementation.

### Adoption record

- Adopted: AGENTS.md requires these standards and the section 16 review checklist; CLAUDE.md continues to import AGENTS.md. README links the baseline, and the existing pages use named `HomePage` and `AdminPage` exports.
- Audited existing foundations: four-package dependency direction, Polish message files, pure core, lazy PostgreSQL pool, per-request EntityManager and explicit migration commands. No business entities or calculations exist.
- Implemented by the subsequent explicit owner request: Zod transport contracts, `makeCrudRoute`, `apiHandler`, `apiCall`/`apiCallOrThrow`, `CrudForm`, `DataTable` and four feedback components. The first approved feature must reuse these foundations. Domain evidence presentation remains deferred.
- Authentication, tenant-owned persistence, evidence rules, provider adapters, financial policies and golden cases await the relevant approved requirements. No speculative concepts, migrations or production integrations were added.
- Verification and execution details: [API/UI foundation run](../runs/2026-10-19-api-ui-foundations.md) and [adoption run](../runs/2026-10-19-engineering-standards-adoption.md). This living standard stays at its stable path; it is not an implemented domain-feature specification.

- Renewed implementation request verified against the existing foundations on 2026-10-19: all four package typechecks, lint, 34 tests and production build passed. Those checks verify the existing foundation subset only, not full implementation of this specification. The owner corrected the completion assessment: the overall standard remains partially implemented; remaining capabilities require implementation and, where explicitly stated, approved feature decisions. See the [verification run](../runs/2026-10-19-engineering-standards-verification.md).

### Infrastructure adoption acceptance (course implementation step)

This step turns the written standard into agent instructions, a concrete package structure and reusable code. It does not implement every future feature governed by the standard. The owner clarified this scope by referring to the Coding Standards lesson on 2026-10-19. Candidate concepts remain provisional, and the existing exclusions of business pages and an event bus remain in effect.

| Adoption requirement | Implementation | Verification |
| --- | --- | --- |
| Agent guidance and one durable standard | AGENTS.md requires this document and its review checklist; CLAUDE.md imports AGENTS.md; README links the standard. | References inspected. |
| Existing layout and dependency direction | Four existing packages retained; HTTP at app/server, pure contracts at core, persistence at db, generic patterns at ui/backend. ESLint rejects forbidden static imports and re-exports across core/db/ui boundaries, including direct relative cross-package paths and forbidden framework/ORM/DI imports. | 50 allowed/refused ESLint probes; package lint and typecheck passed. This is a static import check, not a security sandbox or a dynamic-import resolver. |
| Pure errors and exact transport values | Framework-independent ApplicationError; decimalStringSchema; fixed HTTP error mapping and sanitized unexpected-failure diagnostics. | All five error mappings, matching diagnostic correlation IDs, exact long decimals and invalid-value refusal covered by tests. |
| Reusable server API | apiHandler and makeCrudRoute, validated scope, operation permissions, mutation-verification callback, Zod input/output and safe errors. | Synthetic two-tenant CRUD/command and transport tests. |
| Reusable client/UI | apiCall/apiCallOrThrow, CrudForm, DataTable and shared feedback with supplied Polish messages. | Transport and jsdom interaction tests. |
| Concrete usage reference | Synthetic test composition demonstrates schemas, scoped service, route and browser transport without adding an unapproved domain. | Existing 34-test suite and production build passed during this session. |
| Incremental future adoption | Create concept folders with their first approved feature; reuse the existing helpers and apply the checklist. | No speculative entity, provider adapter, event bus or business page introduced. |

Production authentication, tenant-owned SQL constraints, financial policies, evidence models and integrations are requirements for the relevant future features. Their absence is not an instruction to invent those features during standard adoption. They must not be reported as implemented. See the [course-alignment run](../runs/2026-10-19-engineering-standards-course-alignment.md) for this scope correction and validation.

- Additional implementation completed: pure application-error and decimal-string contracts, their public exports, API mapping and safe diagnostics. Fresh verification: 63 tests in 7 files, all package typechecks, lint and production build passed. See the [contract implementation run](../runs/2026-10-19-engineering-contracts-implementation.md).
