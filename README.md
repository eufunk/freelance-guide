# freelance-guide

Eine Plattform, die angehende IT-Freelancer Schritt für Schritt beim Aufbau ihrer Skills, ihres Portfolios und ihres Freelance-Business begleitet – bis zum ersten Kunden.

The product spec, decisions and phase plan are in [guide/ToDo.docx](guide/ToDo.docx).

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript (strict)
- [Supabase](https://supabase.com): Postgres + Auth, project in the EU region (Frankfurt)
- Tailwind CSS 4 + [shadcn/ui](https://ui.shadcn.com) (Base UI)
- Zod for validation (environment, content, forms)
- Vitest + Testing Library for unit tests, Playwright for end-to-end tests

## Getting started

Requirements: Node.js 24+.

```bash
npm install
cp .env.example .env.local   # then fill in the Supabase values
npm run dev                  # http://localhost:3000
```

Pages that don't use Supabase work without a configured `.env.local`. Anything that talks to
Supabase throws a clear error naming the missing variables.

### Supabase

Create a project at [supabase.com](https://supabase.com) in the region **Central EU (Frankfurt)**
and copy the project URL and the publishable key into `.env.local`.

The CLI configuration and database migrations live in [supabase/](supabase/). The CLI runs via npx:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase migration new <name>   # create a migration
npx supabase db push                # apply migrations to the linked project
```

A local Supabase stack (`npx supabase start`) additionally needs Docker.

## Scripts

| Script                  | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| `npm run dev`           | Start the dev server                            |
| `npm run build`         | Production build                                |
| `npm run start`         | Serve the production build                      |
| `npm run lint`          | ESLint                                          |
| `npm run typecheck`     | TypeScript check                                |
| `npm run format`        | Format all files with Prettier                  |
| `npm run format:check`  | Check formatting                                |
| `npm test`              | Unit tests (Vitest)                             |
| `npm run test:watch`    | Unit tests in watch mode                        |
| `npm run test:e2e`      | End-to-end tests (Playwright, mobile + desktop) |
| `npm run content:check` | Validate all content (runs before every build)  |

Before the first E2E run: `npx playwright install chromium`.

## Project structure

```
app/                 Routes and pages (App Router)
components/ui/       Base UI components (shadcn/ui)
components/layout/   Header, bottom navigation, footer, page container
content/             Roadmap, tasks, templates, legal articles (from Phase 2)
lib/                 Business logic as pure functions + tests
lib/supabase/        Supabase clients (browser and server)
supabase/            Supabase CLI config and migrations
e2e/                 Playwright tests
guide/               Product spec and TODO
```

### Conventions

- The app is **German only**. Code, comments and commit messages are in English.
- Business logic goes into `lib/` as pure functions with unit tests. Components stay thin.
- Educational content goes into `content/`, never directly into components.
- **Mobile first:** design for 375 px first. Touch targets are at least 44 px high (the default
  button and input sizes already are).
- Add UI components with `npx shadcn@latest add <component>`, then adjust sizes for touch if needed.

### Editing content

All content lives as TypeScript files in [content/](content/):

| File                                                       | Content                                    |
| ---------------------------------------------------------- | ------------------------------------------ |
| [content/roadmap.ts](content/roadmap.ts)                   | Roadmap stages and their tasks             |
| [content/tools.ts](content/tools.ts)                       | Tools that stages can link to              |
| [content/onboarding-rules.ts](content/onboarding-rules.ts) | Which stages onboarding proposes as done   |
| [content/templates.ts](content/templates.ts)               | Templates (from Phase 9)                   |
| [content/legal-articles.ts](content/legal-articles.ts)     | Germany-specific legal/tax info (Phase 10) |

The schemas are in [lib/content/schema.ts](lib/content/schema.ts); the app reads content only
through [lib/content/index.ts](lib/content/index.ts).

- **Order** of stages and tasks is the order in the file. There is no `order` field.
- **IDs** are kebab-case and stored in the database with the user's progress. Never rename or
  reuse an ID once deployed; add a new one instead. `content/content.test.ts` fails if a task ID
  disappears.
- **Validation:** `npm run content:check` checks all content: the shape, unique IDs, and
  references (tools, templates, onboarding rules, template placeholders, legal sources and dates).
  It runs automatically before every build, so invalid content never ships.

## Git workflow

- `main` is always deployable. Don't commit to it directly.
- Create a branch per change: `feature/<short-name>`, `fix/<short-name>` or `content/<short-name>`.
- Open a pull request against `main`. CI runs lint, formatting, type check, unit tests, build and
  E2E tests ([.github/workflows/ci.yml](.github/workflows/ci.yml)).
- Merge once CI is green, then delete the branch.

## Hosting

Not decided yet: Vercel with the function region `fra1`, or an alternative hosted in the EU.
Whichever it is, it needs a data processing agreement (see Phase 11 in the TODO).
