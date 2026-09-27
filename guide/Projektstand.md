# Projektstand und Übergabe

**Stand:** 27.09.2026 · Phase 9 auf `main` gemergt · GitHub-Prüfung grün

Diese Datei fasst alles zusammen, was man braucht, um in einem neuen Chat nahtlos weiterzuarbeiten. Einstieg für einen neuen Chat:

> Lies `guide/Projektstand.md`, dann `guide/Umsetzungsfortschritt.md`, und mach mit Phase 10 weiter.

Ausführliche Berichte zu jeder Phase stehen in [Umsetzungsfortschritt.md](Umsetzungsfortschritt.md), der Plan und alle Grundsatzentscheidungen in [ToDo.docx](ToDo.docx) (Abschnitte „Decisions“ und „Development Rules“).

---

## 1. Das Produkt

**Freelance Guide:** eine Web-App, die deutschsprachige IT-Einsteiger Schritt für Schritt zum ersten Freelance-Kunden führt. Kernfrage jeder Seite: „Was soll ich als Nächstes tun?“ Erst Deutschland, nur Deutsch.

## 2. Stand der Phasen

| Phase | Inhalt                            | Status        |
| ----- | --------------------------------- | ------------- |
| 1     | Project Setup                     | ✅ Fertig     |
| 2     | Content Architecture              | ✅ Fertig     |
| 3     | Authentication & Persistence      | ✅ Fertig     |
| 4     | Product Structure & Legal Pages   | ✅ Fertig     |
| 5     | Onboarding                        | ✅ Fertig     |
| 6     | Roadmap & Task System             | ✅ Fertig     |
| 7     | Dashboard                         | ✅ Fertig     |
| 8     | Tools                             | ✅ Fertig     |
| 9     | Templates (Vorlagen)              | ✅ Fertig     |
| 10    | German Freelancer Basics          | ⏳ Als Nächstes |
| 11    | Privacy & Product Metric Tracking | Offen         |

**Tests aktuell:** 184 Unit-Tests, 24 Datenbanktests (pgTAP), 106 End-to-End-Tests (Playwright, Handy + Desktop). Alles grün, lokal und auf GitHub.

## 3. Was die App heute kann

- **Startseite** mit „So funktioniert's“; Registrierung, E-Mail-Bestätigung, Login, Logout, Passwort vergessen (deutsche E-Mails)
- **Onboarding** in 5 Schritten → persönlicher Startpunkt; vorab abgehakte Stufen lassen sich abwählen; über „Profil“ wiederholbar
- **Roadmap** mit 15 Stufen und 48 Aufgaben (Entwurf); Aufgaben starten / erledigen / wieder öffnen
- **Dashboard** mit nächster Aufgabe als Hauptaktion, Fortschritt, „Danach“, „Zuletzt erledigt“, passenden Tools
- **Tools:** Stundensatz-Rechner (speicherbar), Projektpreis-Rechner, Startklar-Check
- **Vorlagen:** 8 Vorlagen unter `/wissen/vorlagen`, jede mit eigener Seite zum Bearbeiten und Kopieren im Browser (nichts wird gespeichert); Name, Skills, Erfahrung und Stundensatz werden aus dem Profil eingesetzt; an den passenden Stufen und im Dashboard verlinkt
- **Wissen:** Übersicht mit Vorlagen und Platzhalter für Deutschland-Grundlagen (Phase 10)
- **Profil:** Konto, Angaben ändern, Passwort ändern, Konto löschen (beides mit aktuellem Passwort)
- **Impressum / Datenschutz:** mit Platzhaltern bzw. als Entwurf; ein Check verhindert eine Veröffentlichung in diesem Zustand

## 4. Technik

- **Next.js 16** (App Router, Turbopack) + TypeScript strict, React 19
- **Supabase** (Postgres + Auth) – lokal in WSL, siehe Abschnitt 5
- **Tailwind CSS 4 + shadcn/ui** (Base UI); Buttons und Eingaben mind. 44 px hoch
- **Zod 4** für Validierung (Content, Formulare, Umgebungsvariablen)
- **Vitest** (Unit), **pgTAP** (Datenbank), **Playwright** (E2E)
- **CI:** GitHub Actions (`.github/workflows/ci.yml`): Lint, Format, Typecheck, Unit, Supabase-Start, DB-Tests, Build, E2E; bei Fehlern werden Playwright-Ergebnisse als Artefakt gespeichert

### Wichtige Orte im Code

| Pfad                        | Inhalt                                                                                        |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| `content/`                  | Alle Inhalte (Roadmap, Tools, Onboarding-Regeln, Checkliste, Rechner-Annahmen, Rechtstexte)    |
| `lib/content/`              | Schemas, Validierung, Ladefunktionen (`getRoadmap()`, `getTask()` …)                           |
| `lib/auth/`                 | DAL (`requireUser`, `getCurrentUser`), Server-Aktionen, Validierung, Pfadregeln                 |
| `lib/db/`                   | Datenzugriff (Profil, Task-Fortschritt, Rechner-Ergebnisse), generierte Typen                  |
| `lib/progress/`             | Reine Fortschrittslogik (aktuelle Stufe, nächste Aufgabe, Dashboard)                           |
| `lib/onboarding/`, `lib/tools/`, `lib/templates/` | Reine, getestete Logik für Onboarding, Rechner und Vorlagen (Platzhalter) |
| `supabase/migrations/`      | Datenbankschema (3 Migrationen)                                                               |
| `supabase/tests/database/`  | pgTAP-Tests (RLS, Constraints, Konto löschen)                                                 |
| `e2e/`                      | Playwright-Tests; `e2e/helpers/` für Registrierung, Mailpit, Onboarding                        |
| `scripts/db.mjs`            | Start/Stopp der lokalen Datenbank über WSL                                                    |

### Datenbank

- `profiles` (Onboarding-Antworten, `onboarding_completed_at`), `task_progress` (Status je Aufgabe, `source`: `user` oder `onboarding`), `calculator_results` (letztes Ergebnis je Rechner)
- Row Level Security: jeder sieht nur eigene Zeilen; `anon` hat keinen Zugriff
- Konto löschen über `delete_own_account()`; alle Daten werden per `on delete cascade` mitgelöscht
- **Noch nicht angelegt:** Tabelle `events` (Phase 11)

## 5. Lokale Umgebung (Besonderheiten dieses Rechners)

- **Windows 11 auf ARM64**, Projekt liegt in **OneDrive** (kann den Build gelegentlich mit `EPERM` stören → Build einfach wiederholen)
- **Docker Desktop funktioniert hier nicht** (braucht `wsl --mount`, auf ARM64 erst ab Windows-Build 27653). Stattdessen: **Docker Engine + Supabase-CLI 2.118.0 direkt in WSL-Ubuntu**
- **Ports:**
  - App: **http://localhost:3200** (`npm run dev`) – Port 3000 belegt eine andere App (`software-developer-portfolio`)
  - E2E-Testserver: 3100
  - Supabase API 54321, **Studio http://127.0.0.1:54323**, **Mailpit http://127.0.0.1:54324** (alle E-Mails landen dort)
- **Datenbank-Befehle:**

| Befehl               | Zweck                                                   |
| -------------------- | ------------------------------------------------------- |
| `npm run db:start`   | Starten (hält WSL wach, bis `db:stop`)                   |
| `npm run db:stop`    | Stoppen, Daten bleiben                                  |
| `npm run db:migrate` | **Neue Migrationen einspielen, Daten bleiben**           |
| `npm run db:reset`   | Alles zurücksetzen – **löscht alle Daten**, nur bewusst |
| `npm run db:test`    | pgTAP-Tests                                             |
| `npm run db:types`   | TypeScript-Typen nach einer Migration neu erzeugen      |

- Nach einem Windows-Neustart: `npm run db:start`, dann `npm run dev`
- **Linux-Testkopie:** In WSL liegen Node.js 24 (`/opt`) und eine Projektkopie `/root/fg-ci`, um Handy-Tests wie auf GitHub unter Linux nachzustellen (Linux bricht Schriften anders um als Windows)

## 6. Arbeitsweise (so wurde bisher gearbeitet)

- **Kommunikation mit Eugenia auf Deutsch**, verständlich, ohne unnötigen Fachjargon. Code, Kommentare und Commit-Nachrichten auf Englisch; die App ist komplett deutsch.
- **Pro Phase ein Branch** `feature/phase-N-<name>` (Korrekturen: `fix/<name>`). Nach Fertigstellung: Bericht im Chat + Abschnitt in `Umsetzungsfortschritt.md`, dann **auf Nachfrage** committen, pushen, mit `--no-ff` nach `main` mergen, Branch lokal und remote löschen.
- **Kein `gh` CLI installiert:** Pull Requests gibt es nicht; die GitHub-Prüfung wird über die öffentliche API beobachtet (`/repos/eufunk/freelance-guide/actions/runs?head_sha=…`). Nach jedem Merge das Ergebnis abwarten und melden.
- **Vor jedem Commit:** `npm run format`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run db:test`, `npm run build` und `CI=1 npx playwright test --retries=0`
- **Offene Produktfragen** mit Optionen und Empfehlung fragen, nicht selbst entscheiden
- **Ehrlich berichten:** eigene Fehler benennen (z. B. versehentliches `db:reset`), Abweichungen vom Plan im Fortschrittsdokument festhalten
- **Mobile first:** neue Seiten auf 375 px prüfen (Screenshots per temporärem Playwright-Skript)
- **Texte neutral formulieren** (z. B. „Ansprechperson“, „in der Selbstständigkeit“), kein Gendersternchen, solange die Stilfrage offen ist

### Stolperfallen

- **Next.js 16 weicht vom Gewohnten ab:** vor neuem Code die Doku in `node_modules/next/dist/docs/` lesen (steht auch in `AGENTS.md`). Beispiele: `proxy.ts` statt Middleware, `retry` statt `reset` in `error.tsx`, `refresh()` aus `next/cache` nach Server-Aktionen, `PageProps<"/pfad">` mit Promise-`params`.
- **Shell:** Lange Bash-Befehle mit Heredocs und Anführungszeichen brechen oft ab („unexpected EOF“). Dateien besser mit dem Editor-Werkzeug schreiben bzw. Python-Skripte als Datei ablegen.
- **Python unter Windows** schreibt CRLF, wenn nicht `newline=""` gesetzt ist; das Repo nutzt LF (`.gitattributes`).
- **React-Formulare:** Buttons, die zwischen `type="button"` und `type="submit"` wechseln, brauchen verschiedene `key`s (sonst sendet ein Klick das Formular ab). Feld-IDs mit `useId()` erzeugen.
- **E2E:** Next.js rendert einen leeren Ansagebereich mit `role="alert"` → Fehlermeldungen mit `.filter({ hasText })` suchen. Neue Nutzer landen nach der Bestätigung im Onboarding (`NEW_USER_START`).

## 7. Offene Punkte

| Punkt                                                                                      | Wer         | Wann                 |
| ------------------------------------------------------------------------------------------ | ----------- | -------------------- |
| Roadmap-Texte (15 Stufen, 48 Aufgaben) fachlich durchsehen                                  | Eugenia     | Vor dem Livegang     |
| Vorlagen-Texte (8 Vorlagen, `content/templates.ts`) durchsehen                              | Eugenia     | Vor dem Livegang     |
| Stufen 8/9 wegen Kaltakquise (§ 7 UWG) ggf. umformulieren (siehe Phase 9 im Fortschritt)     | Eugenia     | Vor dem Livegang     |
| Stilfrage: soll die App gendern? (bisher neutral formuliert)                                | Eugenia     | Vor der Durchsicht   |
| Impressum ausfüllen, Datenschutzerklärung prüfen lassen (`content/legal-pages.ts`)          | Eugenia     | Vor dem Livegang     |
| Rechner-Annahmen prüfen: Versicherung 600 €, Altersvorsorge 400 €, Steuer 30 % (`content/calculator-defaults.ts`) | Eugenia | Vor dem Livegang |
| Hosting festlegen (Empfehlung: Vercel, Region `fra1`)                                       | Eugenia     | Vor dem Livegang     |
| Supabase-Cloud-Projekt in Frankfurt anlegen, eigenen E-Mail-Versand (SMTP) einrichten       | Eugenia     | Vor dem Livegang     |
| GitHub stellt ab 19.10.2026 auf Ubuntu 26 um – ersten Lauf danach prüfen                     | Claude      | Nach dem 19.10.2026  |
| Projekt ggf. aus OneDrive lösen (Geschwindigkeit)                                           | Eugenia     | Optional             |

## 8. Nächster Schritt: Phase 10 – Deutschland-Grundlagen

- **9 Themen:** Freiberufler vs. Gewerbe, Anmeldung, Finanzamt, Kleinunternehmerregelung, Umsatzsteuer, Rechnungen inkl. E-Rechnung, Krankenversicherung, Altersvorsorge, Scheinselbstständigkeit.
- Jeder Artikel mit Quellen und `lastVerified`; der Hinweis „keine Rechts-/Steuerberatung“ wird automatisch angezeigt; die Hilfsfunktion `isVerificationStale()` existiert. Größter Aufwand ist die Recherche.
- **Schon vorbereitet:** `legalArticleSchema` (Quellen und `lastVerified` Pflicht), `content/legal-articles.ts` (leer), `getLegalArticles()`, Seite `/wissen/grundlagen` (Platzhalter).
- Das Rechnungsbeispiel (Phase 9) nennt bei der E-Rechnung bewusst keine Fristen; die gehören in den Artikel zu Rechnungen.
- Vorher mit Eugenia klären: Welche Quellen gelten als verlässlich (z. B. Bundesfinanzministerium, IHK, Deutsche Rentenversicherung), und wie ausführlich sollen die Artikel sein?

### Danach

- **Phase 11 – Datenschutz & Tracking:** Tabelle `events` (onboarding_completed, task_started, task_completed, stage_completed, calculator_used, template_copied), Auswertung per SQL, Datenschutzerklärung ergänzen.
