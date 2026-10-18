# fleet-platform

fleet-platform is a micro-ERP for trading and transport companies. Its first module is trip profitability: before accepting an order, the dispatcher sees whether the trip pays; after the trip, planned and actual figures from GPS, fuel cards and invoices appear side by side for every cost component, with every number marked as certain or estimated. Management gets a monthly summary. More modules will follow, one at a time.

## Status

Early stage, built step by step. No code yet; the technology stack will be chosen in the next step. This README will evolve as the project progresses.

## Tools

Claude Code and Codex are the coding agents. Agent instructions will live in AGENTS.md so any agent can follow them. GitHub is the single source of truth for code, issues, pull requests and CI.

## Data

This repository never contains customer data. Tests use synthetic data only.
