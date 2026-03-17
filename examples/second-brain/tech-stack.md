# Second Brain — Tech Stack

Decided:     2026-03-16
Stakeholder: [second brain stakeholder]

---

## Frontend
  Framework:          SvelteKit
  Component library:  shadcn-svelte
  CSS:                Tailwind CSS

## Backend
  Language:           C#
  Framework:          ASP.NET Core Web API
  Runtime:            .NET 8  (LTS)

## Database
  Primary:            PostgreSQL  (via Supabase)
  Full-text search:   PostgreSQL FTS  (tsvector / tsquery / GIN indexes)
                      Built into PostgreSQL — no separate search engine needed.
                      Covers: Task, Note, Activity, CalendarEntry, TaskComment.

## ORM / Data Access
  Library:            Entity Framework Core + Npgsql
  Migrations:         EF Core Migrations
  Note:               EF Core is required for schema migrations used by Deployer AI.
                      Builder AI generates all data access code from the DERA spec.
                      Raw SQL via EF Core's FromSqlRaw is permitted for FTS queries.

## Authentication
  Provider:           Supabase Auth  (JWT + OAuth2)

## AI for Summaries
  Provider:           Anthropic Claude API
  Model:              claude-3-5-haiku  (nightly batch analysis — cost/quality balance)
  Usage:              Summary entity — executive analysis, delayed items,
                      attention items, general recommendations.
                      Reads structured task data + manual note content per period.

## Cache
  Primary:            Redis

## Notifications
  Email:              Resend

## File Storage
  Primary:            Supabase Storage
  CDN:                Cloudflare

## API Style
  External API:       REST
  Internal services:  REST

## Containerization
  Runtime:            Docker
  Local dev:          Docker Compose
  Production:         Docker Compose on Hetzner VPS
  Reverse proxy:      Traefik  (SSL termination via Let's Encrypt + Cloudflare)
  Image registry:     GitHub Container Registry (ghcr.io)

## CI/CD
  Pipeline:           GitHub Actions
  Flow:               build → test → push image to ghcr.io → SSH deploy to Hetzner

## Observability
  Error tracking:     Sentry
  Logging:            Serilog  (structured logging for .NET)
                      Sinks: console (dev), file + Sentry (production)

## Cloud
  Application:        Hetzner Cloud  (VPS — CX22 or CAX31 ARM)
  Database:           Supabase  (PostgreSQL + Auth + Storage)
  Edge / CDN / DNS:   Cloudflare
