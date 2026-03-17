# DERA Technical Stack Reference

---

# How to Use This Document

This document is a reference catalog for the **Analyst AI**.

When starting a new project, the Analyst AI presents the options from each category
to the stakeholder and collects decisions. The AI may suggest options based on
project context, team experience, and known constraints, but the stakeholder
always makes the final decision.

Once decisions are made, they are recorded in the project's own `tech-stack.md` file,
which the Builder AI uses as the source of truth for all code generation.

**Rule:**
> The Analyst AI presents and suggests. The stakeholder decides. The Builder AI executes.

---

# Multi-Provider Strategy

For production systems, critical infrastructure categories (cloud, database, notifications)
should consider a multi-provider approach:

- **Primary provider**: handles all normal operations
- **Backup provider**: ready for disaster recovery or failover
- **Abstraction layer**: code should use adapters so switching providers requires
  minimal code changes

The stakeholder defines the primary and backup providers per category during
the tech stack decision session.

---

# 1. Frontend

## Frameworks

| Option | Description | Best for |
|--------|-------------|----------|
| React | Component-based UI library, largest ecosystem | SPAs, complex UIs, large teams |
| Vue | Progressive framework, gentle learning curve | Medium complexity, smaller teams |
| Angular | Full opinionated framework | Enterprise, Java-like structure |
| Svelte | Compiler-based, minimal runtime | Performance-critical, smaller apps |
| SolidJS | React-like syntax, fine-grained reactivity | High performance SPAs |

## Meta-Frameworks (with SSR/SSG)

| Option | Base | Description |
|--------|------|-------------|
| Next.js | React | SSR, SSG, App Router, full-stack |
| Nuxt | Vue | SSR, SSG, file-based routing |
| SvelteKit | Svelte | SSR, SSG, adapter-based deployment |
| Remix | React | Full-stack, web standards focused |

## Component Libraries

### React
| Option | Style | Description |
|--------|-------|-------------|
| shadcn/ui | Tailwind | Unstyled components, copy-paste approach |
| Material UI | Material Design | Google Material, comprehensive |
| Ant Design | Ant Design | Enterprise-grade, data-heavy UIs |
| Chakra UI | Custom | Accessible, themeable |
| Mantine | Custom | Full-featured, hooks included |

### Vue
| Option | Style | Description |
|--------|-------|-------------|
| Vuetify | Material Design | Comprehensive, long-standing |
| PrimeVue | Custom | 90+ components, enterprise-ready |
| Quasar | Custom | Framework + CLI + deployment targets |
| Naive UI | Custom | TypeScript-first, modern |

## CSS

| Option | Description |
|--------|-------------|
| Tailwind CSS | Utility-first, works with any framework |
| CSS Modules | Scoped CSS per component |
| styled-components | CSS-in-JS for React |
| UnoCSS | Atomic CSS engine, Tailwind-compatible |

---

# 2. Backend

## Languages and Frameworks

### C# / .NET
| Option | Description | Best for |
|--------|-------------|----------|
| ASP.NET Core | Full MVC + API framework | Enterprise, complex apps |
| Minimal APIs | Lightweight API routing | Microservices, simple APIs |
| FastEndpoints | REPR pattern, performance | High-throughput APIs |

### JavaScript / TypeScript
| Option | Description | Best for |
|--------|-------------|----------|
| Express | Minimal, flexible, huge ecosystem | General purpose |
| Fastify | High performance, schema validation | Performance-critical |
| Hono | Ultra-lightweight, edge-compatible | Edge functions, minimal APIs |
| NestJS | Angular-inspired, opinionated | Large apps, enterprise structure |
| Elysia | Bun-native, type-safe | Bun runtime, modern TS |

### Go
| Option | Description | Best for |
|--------|-------------|----------|
| Gin | Fast HTTP framework | General APIs |
| Echo | Minimalist, extensible | Clean APIs |
| Fiber | Express-inspired | JS developers moving to Go |
| Chi | Lightweight router | Stdlib-compatible, minimal |

### Rust
| Option | Description | Best for |
|--------|-------------|----------|
| Axum | Tokio-based, modular | Async, modern Rust |
| Actix-web | Actor model, very fast | High performance |
| Warp | Filter-based, functional | Composable APIs |

---

# 3. Databases

## Relational

| Option | Description | Best for |
|--------|-------------|----------|
| PostgreSQL | Most feature-rich open source RDBMS | General purpose, complex queries, JSON support |
| MySQL | Widely supported, performant reads | Web apps, high read workloads |
| MariaDB | MySQL-compatible, community-driven | MySQL alternative, open source preference |
| Microsoft SQL Server | Enterprise RDBMS | Windows/.NET ecosystems, enterprise |
| SQLite | Embedded, file-based | Local dev, small apps, testing |

## Document

| Option | Description | Best for |
|--------|-------------|----------|
| MongoDB | BSON documents, flexible schema | Variable structure, rapid iteration |
| CouchDB | HTTP API, multi-master replication | Offline-first, sync scenarios |

## Key-Value and Cache

| Option | Description | Best for |
|--------|-------------|----------|
| Redis | In-memory, pub/sub, data structures | Cache, sessions, message broker |
| DynamoDB | AWS managed, serverless-friendly | AWS workloads, massive scale |

## Search

| Option | Description | Best for |
|--------|-------------|----------|
| Elasticsearch | Full-text search, analytics | Complex search, log analysis |
| Meilisearch | Fast, typo-tolerant | Product search, simple setup |
| Algolia | Managed search SaaS | Instant search, no infra management |

## Time Series

| Option | Description | Best for |
|--------|-------------|----------|
| TimescaleDB | PostgreSQL extension | Time-series on existing Postgres |
| InfluxDB | Purpose-built time-series | Metrics, IoT, monitoring data |

**Multi-provider note:**
Different entities in a DERA system may use different databases.
Example: domain data in PostgreSQL, search index in Meilisearch, sessions in Redis.

---

# 4. Message Queue / Event Bus

Required when DERA events need async processing or cross-service communication.
Optional for simple single-service deployments.

## Self-Hosted

| Option | Description | Best for |
|--------|-------------|----------|
| RabbitMQ | AMQP protocol, flexible routing | General async messaging |
| Apache Kafka | High-throughput, event log | Event streaming, audit trails |
| Redis Pub/Sub | Simple, already in stack | Low-complexity async events |
| NATS | Lightweight, cloud-native | Microservices, high volume |

## Cloud-Managed

| Option | Provider | Description |
|--------|----------|-------------|
| SQS / SNS | AWS | Queue + fan-out pub/sub |
| Service Bus | Azure | Enterprise messaging, topics |
| Pub/Sub | GCP | Scalable async messaging |

---

# 5. Cache

| Option | Description | Best for |
|--------|-------------|----------|
| Redis | In-memory, rich data types, persistent | General cache, sessions, pub/sub |
| Memcached | Simple key-value, multi-threaded | Pure cache, simplicity |
| CDN cache | Edge caching (Cloudflare, CloudFront) | Static assets, API responses |
| In-process | Application-level memory cache | Single-instance, low latency |

---

# 6. Authentication and Authorization

## Standards
- JWT (JSON Web Tokens)
- OAuth 2.0
- OpenID Connect (OIDC)
- SAML 2.0 (enterprise SSO)

## Managed Services

| Option | Description | Best for |
|--------|-------------|----------|
| Auth0 | Fully managed, feature-rich | Quick setup, social login |
| Clerk | Modern dev experience, embeddable UI | SaaS apps, startups |
| Firebase Auth | Google-managed, mobile-friendly | Mobile apps, Firebase ecosystem |
| AWS Cognito | AWS-integrated | AWS workloads |
| Azure AD B2C | Microsoft-integrated | Enterprise, Microsoft ecosystem |

## Self-Hosted

| Option | Description | Best for |
|--------|-------------|----------|
| Keycloak | Full IAM platform | Enterprise, full control |
| Ory Hydra | OAuth2/OIDC server only | Custom auth flows |
| Authentik | Modern self-hosted IAM | Developer-friendly Keycloak alternative |

**DERA note:**
Actor permissions defined in `actors.dera` must map to the chosen auth system's
role and permission model. The Analyst AI aligns both during spec creation.

---

# 7. ORM and Data Access

### C#
| Option | Description |
|--------|-------------|
| Entity Framework Core | Full ORM, migrations, LINQ |
| Dapper | Micro-ORM, raw SQL with mapping |

### JavaScript / TypeScript
| Option | Description |
|--------|-------------|
| Prisma | Type-safe ORM, schema-first, migrations |
| Drizzle ORM | Lightweight, SQL-like syntax, type-safe |
| TypeORM | Decorator-based, Active Record or Data Mapper |
| Sequelize | Mature ORM, multi-dialect |
| Knex | SQL query builder, no ORM overhead |

### Go
| Option | Description |
|--------|-------------|
| GORM | Full ORM, popular, Rails-like |
| sqlx | Stdlib extension, raw SQL with struct scanning |
| sqlc | Generates Go code from SQL queries |
| Ent | Graph-based entity framework |

### Rust
| Option | Description |
|--------|-------------|
| SQLx | Async, compile-time checked queries |
| Diesel | ORM, schema-first, sync |
| SeaORM | Async ORM, derive-based |

---

# 8. Testing

### JavaScript / TypeScript
| Option | Type | Description |
|--------|------|-------------|
| Vitest | Unit / Integration | Fast, Vite-native, Jest-compatible API |
| Jest | Unit / Integration | Most widely used JS test runner |
| Playwright | E2E | Cross-browser, modern |
| Cypress | E2E | Developer-friendly, browser testing |
| Supertest | API | HTTP assertions for Node.js APIs |

### C#
| Option | Type | Description |
|--------|------|-------------|
| xUnit | Unit / Integration | Modern, extensible, most recommended |
| NUnit | Unit / Integration | Mature, feature-rich |
| MSTest | Unit | Built-in Microsoft test framework |
| SpecFlow | BDD | Gherkin-based, acceptance tests |

### Go
| Option | Type | Description |
|--------|------|-------------|
| testing (stdlib) | Unit | Built-in, no dependencies |
| Testify | Unit / Integration | Assertions, mocks, suites |
| Ginkgo + Gomega | BDD | Behavior-driven test suite |

### Rust
| Option | Type | Description |
|--------|------|-------------|
| Built-in #[test] | Unit | Native Rust test framework |
| tokio-test | Async | Testing async Tokio code |
| Mockall | Mocking | Procedural macro-based mocks |

---

# 9. Notifications

## Email

| Provider | Description | Best for |
|----------|-------------|----------|
| SendGrid | Transactional + marketing, Twilio-owned | High volume, analytics |
| Resend | Developer-focused, modern API | Developer experience |
| Mailgun | API-first, EU data centers | Technical teams |
| AWS SES | AWS-integrated, low cost at scale | AWS workloads, cost optimization |
| Postmark | Deliverability-focused, transactional only | Critical transactional email |
| Brevo (Sendinblue) | Marketing + transactional | Budget-conscious, EU-based |

## SMS

| Provider | Description | Best for |
|----------|-------------|----------|
| Twilio | Industry standard, global coverage | General SMS, most features |
| Vonage (Nexmo) | Global, programmable communications | Multi-channel |
| AWS SNS | AWS-integrated, pub/sub + SMS | AWS workloads |
| MessageBird | European-focused | EU compliance |
| Telnyx | Cost-effective, direct carrier | Cost optimization |

## Mobile Push Notifications

| Provider | Description | Platform |
|----------|-------------|----------|
| Firebase FCM | Google, free | Android + iOS via APNs bridge |
| Apple APNs | Apple, direct | iOS, iPadOS, macOS |
| OneSignal | Multi-platform aggregator | All platforms + web |
| Expo Push | Expo-managed | React Native |

## Web Push

| Option | Description |
|--------|-------------|
| Web Push API | Browser standard, no third party |
| Pusher Beams | Managed web + mobile push |

## In-App / Real-Time

| Option | Description |
|--------|-------------|
| WebSockets (native) | Full-duplex, requires server support |
| Socket.io | WebSockets + fallback, rooms support |
| Pusher Channels | Managed WebSockets |
| Ably | Managed real-time messaging |

## Messaging Apps

| Provider | Description |
|----------|-------------|
| Twilio WhatsApp | WhatsApp Business API via Twilio |
| Meta Business API | Direct WhatsApp Business integration |

**Multi-provider note:**
Critical notifications (e.g., password reset, alerts) should have a primary and
backup provider. Example: Resend as primary, SendGrid as backup for email.

---

# 10. File Storage

## Cloud Object Storage

| Provider | Description | Compatible with |
|----------|-------------|-----------------|
| AWS S3 | Industry standard | S3 API (universal) |
| Azure Blob Storage | Microsoft ecosystem | Azure SDK |
| Google Cloud Storage | GCP ecosystem | GCS SDK, S3-compatible |
| Cloudflare R2 | S3-compatible, no egress fees | S3 API |

## Self-Hosted

| Option | Description |
|--------|-------------|
| MinIO | S3-compatible, open source | On-premise, S3 API |
| SeaweedFS | Distributed, high performance | Large-scale self-hosted |

## Media-Specific

| Option | Description | Best for |
|--------|-------------|----------|
| Cloudinary | Image and video management, CDN, transforms | Media-heavy apps |
| Uploadcare | Upload widget + CDN | File upload UX |

## CDN

| Option | Description |
|--------|-------------|
| Cloudflare | Global CDN, DDoS protection, edge computing |
| AWS CloudFront | S3-integrated, AWS ecosystem |
| Azure CDN | Blob Storage-integrated |
| Fastly | Programmable CDN, edge logic |

---

# 11. API Style

| Style | Description | Best for |
|-------|-------------|----------|
| REST | Standard HTTP, stateless, resource-based | Most APIs, broad compatibility |
| GraphQL | Client-defined queries, single endpoint | Complex data, mobile clients |
| gRPC | Protocol Buffers, bi-directional streaming | Inter-service, high performance |
| WebSockets | Full-duplex, persistent connection | Real-time, bidirectional |
| Server-Sent Events | Server-to-client streaming | Live updates, feeds |
| tRPC | End-to-end type safety, TypeScript only | Full-stack TypeScript monorepos |

**DERA note:**
DERA is transport-independent. The same event spec can be exposed via REST,
gRPC, or a message queue without changing the domain logic.

---

# 12. Containerization and Orchestration

## Containerization

| Option | Description |
|--------|-------------|
| Docker | Standard container runtime |
| Podman | Daemonless Docker-compatible alternative |

## Local Development

| Option | Description |
|--------|-------------|
| Docker Compose | Multi-container local environments |
| Devcontainers | VS Code / IDE-integrated container environments |

## Orchestration

| Option | Description | Best for |
|--------|-------------|----------|
| Kubernetes (K8s) | Standard container orchestration | Large scale, full control |
| Docker Swarm | Simple clustering, Docker-native | Small to medium scale |

## Managed Kubernetes

| Provider | Option |
|----------|--------|
| AWS | EKS (Elastic Kubernetes Service) |
| Azure | AKS (Azure Kubernetes Service) |
| GCP | GKE (Google Kubernetes Engine) |

## Simplified PaaS (no Kubernetes management)

| Option | Description |
|--------|-------------|
| Railway | Simple deploys, Dockerfile support |
| Render | Auto-deploys, managed databases |
| Fly.io | Edge deployment, Dockerfile-based |
| Heroku | Classic PaaS, buildpack or Docker |

---

# 13. CI/CD

| Option | Description | Best for |
|--------|-------------|----------|
| GitHub Actions | YAML-based, GitHub-integrated | GitHub repositories |
| GitLab CI/CD | Built-in GitLab pipelines | GitLab repositories |
| Jenkins | Self-hosted, highly configurable | Complex pipelines, full control |
| CircleCI | Cloud CI, fast, orb ecosystem | Multi-language projects |
| Azure DevOps | Microsoft-integrated, boards + pipelines | Microsoft ecosystem |
| AWS CodePipeline | AWS-native CI/CD | AWS workloads |
| ArgoCD | GitOps for Kubernetes | K8s deployments, GitOps pattern |
| Tekton | Kubernetes-native pipelines | Cloud-native CI/CD |

**DERA note:**
CI/CD pipelines should enforce the DERA versioning flow:
- req/* branches → run tests, deploy to testing environment
- main merges → run tests, assign version, update Production.Manifest
- patch/* branches → run tests, cherry-pick validation, deploy patch

---

# 14. Observability

## Full Platforms

| Option | Description |
|--------|-------------|
| Datadog | APM, logs, metrics, traces, dashboards |
| New Relic | Full-stack observability |
| Dynatrace | AI-powered monitoring |

## Logging

| Option | Description |
|--------|-------------|
| ELK Stack | Elasticsearch + Logstash + Kibana, self-hosted |
| Loki + Grafana | Lightweight log aggregation + visualization |
| Splunk | Enterprise log management |
| AWS CloudWatch | AWS-native logging + metrics |
| Azure Monitor | Azure-native logging |

## Metrics

| Option | Description |
|--------|-------------|
| Prometheus + Grafana | Open source, pull-based metrics |
| InfluxDB + Grafana | Time-series metrics database |

## Distributed Tracing

| Option | Description |
|--------|-------------|
| Jaeger | Open source distributed tracing |
| Zipkin | Lightweight tracing, Twitter origin |
| AWS X-Ray | AWS-native tracing |
| OpenTelemetry | Vendor-neutral instrumentation standard |

**DERA note:**
DERA's `TraceId` and `CorrelationId` fields map directly to distributed tracing
span IDs and trace IDs. The chosen tracing tool should be configured to use
DERA's identifiers as the primary trace context.

## Error Tracking

| Option | Description |
|--------|-------------|
| Sentry | Error tracking + performance, multi-language |
| Rollbar | Real-time error monitoring |
| Bugsnag | Stability monitoring |

---

# 15. Feature Flags

| Option | Type | Description |
|--------|------|-------------|
| LaunchDarkly | Managed SaaS | Enterprise-grade, targeting rules |
| Split.io | Managed SaaS | Feature flags + experimentation |
| Unleash | Open source / managed | Self-hosted option, SDK-based |
| Flagsmith | Open source / managed | Simple, REST API |
| GrowthBook | Open source / managed | Feature flags + A/B testing |
| Environment variables | Custom | Minimal, no dependencies, simple cases |

**DERA note:**
Feature flags control the activation of events or actions in production
without requiring a new deployment. A flagged event that is OFF returns
a standard NoAction response. The flag state is managed in the
Production.Manifest or a dedicated feature flag service.

---

# 16. Cloud Providers

## Primary Providers

| Provider | Description | Strengths |
|----------|-------------|-----------|
| AWS | Amazon Web Services | Largest service catalog, most regions, most third-party integrations |
| Azure | Microsoft Azure | Enterprise, Microsoft ecosystem, hybrid cloud, Active Directory |
| GCP | Google Cloud Platform | Data, ML, Kubernetes (origin), BigQuery |
| Cloudflare | Edge computing + CDN + DNS | Edge functions, global network, cost-effective CDN |
| DigitalOcean | Developer-friendly | Simplicity, predictable pricing, small/medium scale |

## Multi-Provider Strategy

For production systems the stakeholder defines:

```
Primary:   [main provider for all services]
Backup:    [failover provider for critical services]
Edge:      [CDN and edge computing provider]
```

Example configuration:
```
Primary:   AWS         (compute, database, primary storage)
Backup:    Azure       (database replica, disaster recovery)
Edge:      Cloudflare  (CDN, DNS, DDoS protection, edge functions)
```

Critical categories that benefit most from multi-provider:
- Databases: primary + read replicas across providers
- File storage: primary bucket + backup bucket in different provider
- Notifications: primary + fallback email/SMS provider
- DNS: multi-provider DNS for maximum uptime

---

# Project Tech Stack Template

Once the stakeholder has made all decisions, record them in the project's
`tech-stack.md` file. The Builder AI uses this file as the source of truth
for all code generation decisions.

```markdown
# [Project Name] — Tech Stack

Decided: [date]
Stakeholder: [name]

## Frontend
  Framework:          [choice]
  Meta-framework:     [choice or none]
  Component library:  [choice]
  CSS:                [choice]

## Backend
  Language:           [choice]
  Framework:          [choice]
  Runtime:            [choice if applicable]

## Database
  Primary:            [choice]
  Search:             [choice or none]
  Cache:              [choice]

## Message Queue
  Broker:             [choice or none]
  Reason:             [why needed or not needed]

## Authentication
  Strategy:           [JWT / OAuth2 / etc]
  Provider:           [choice]

## ORM / Data Access
  Library:            [choice]

## Notifications
  Email:              primary: [choice]  backup: [choice]
  SMS:                primary: [choice]  backup: [choice or none]
  Push:               [choice or none]

## File Storage
  Primary:            [choice]
  Backup:             [choice or none]
  CDN:                [choice]

## API Style
  External API:       [REST / GraphQL / etc]
  Internal services:  [gRPC / REST / etc]

## Containerization
  Runtime:            [Docker / Podman]
  Orchestration:      [choice]
  Local dev:          [Docker Compose / Devcontainers]

## CI/CD
  Pipeline:           [choice]

## Observability
  Platform:           [choice]
  Tracing:            [choice]
  Error tracking:     [choice]

## Feature Flags
  Provider:           [choice or none]

## Cloud
  Primary:            [choice]
  Backup:             [choice or none]
  Edge:               [choice or none]
```
