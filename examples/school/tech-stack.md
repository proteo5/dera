# School System — Tech Stack

Decided:     2024-03-16
Stakeholder: [school system stakeholder]

---

## Frontend
  Framework:          React
  Meta-framework:     Next.js
  Component library:  shadcn/ui
  CSS:                Tailwind CSS

## Backend
  Language:           TypeScript
  Framework:          Fastify
  Runtime:            Node.js

## Database
  Primary:            PostgreSQL
  Search:             none
  Cache:              Redis

## Message Queue
  Broker:             none
  Reason:             Single-service deployment, events are synchronous.
                      Will revisit if async notifications volume grows.

## Authentication
  Strategy:           JWT + OAuth2
  Provider:           Auth0

## ORM / Data Access
  Library:            Prisma

## Notifications
  Email:              primary: Resend     backup: SendGrid
  SMS:                none
  Push:               none

## File Storage
  Primary:            AWS S3
  Backup:             Cloudflare R2
  CDN:                Cloudflare

## API Style
  External API:       REST
  Internal services:  REST

## Containerization
  Runtime:            Docker
  Orchestration:      Docker Compose (development), AWS ECS (production)
  Local dev:          Docker Compose

## CI/CD
  Pipeline:           GitHub Actions

## Observability
  Platform:           Datadog
  Tracing:            Datadog APM (uses DERA TraceId as trace context)
  Error tracking:     Sentry

## Feature Flags
  Provider:           Unleash (self-hosted)

## Cloud
  Primary:            AWS
  Backup:             Azure (database replica for disaster recovery)
  Edge:               Cloudflare (CDN, DNS, DDoS protection)
