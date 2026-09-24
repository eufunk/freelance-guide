# Umsetzungsfortschritt

Stand der Umsetzung der Phasen aus der [ToDo-Liste](ToDo.docx). Pro abgeschlossener Phase kommt unten ein Abschnitt dazu.

## Übersicht

| Phase | Inhalt                            | Status        | Abgeschlossen |
| ----- | --------------------------------- | ------------- | ------------- |
| 1     | Project Setup                     | ✅ Fertig     | 24.09.2026    |
| 2     | Content Architecture              | ✅ Fertig     | 24.09.2026    |
| 3     | Authentication & Persistence      | ⏳ Als Nächstes |               |
| 4     | Product Structure & Legal Pages   | Offen         |               |
| 5     | Onboarding                        | Offen         |               |
| 6     | Roadmap & Task System             | Offen         |               |
| 7     | Dashboard                         | Offen         |               |
| 8     | Tools                             | Offen         |               |
| 9     | Templates                         | Offen         |               |
| 10    | German Freelancer Basics          | Offen         |               |
| 11    | Privacy & Product Metric Tracking | Offen         |               |

## Offene Punkte

Diese Punkte gehören zu keiner bestimmten Phase.

| Punkt                       | Wer         | Bis wann                              | Pflicht? |
| --------------------------- | ----------- | ------------------------------------- | -------- |
| Roadmap-Texte durchsehen    | Eugenia     | Vor dem Livegang                      | Ja       |
| Supabase-Projekt anlegen    | Eugenia     | Vor Phase 3 (Login)                   | Ja       |
| Hosting festlegen           | Eugenia     | Bevor die App online geht (Ende MVP)  | Ja       |
| Docker installieren         | –           | –                                     | Nein     |
| Projekt aus OneDrive lösen  | Eugenia     | Nur falls der Rechner langsam wird    | Nein     |

### Roadmap-Texte durchsehen

- [ ] Die Texte der 15 Stufen und ihrer Tasks in [content/roadmap.ts](../content/roadmap.ts) lesen und korrigieren.

**Warum:** Die Texte sind ein erster Entwurf aus Phase 2. Sie sind das, was Nutzer später als Anleitung lesen, und sollten deshalb fachlich geprüft sein. Ändern lassen sich Titel und Beschreibungen jederzeit. Nur die IDs (`id: "..."`) dürfen nach dem Livegang nicht mehr geändert werden, weil der gespeicherte Fortschritt der Nutzer daran hängt.

**Offene Stilfrage:** Die Texte verwenden „Kunden“ und „Freelancer“ in der männlichen Grundform. Wo es leicht ging, sind sie neutral formuliert („Ansprechperson“). Falls die App durchgehend gendern soll, müsste das vor der Durchsicht entschieden werden.

### Supabase-Projekt anlegen

- [ ] Projekt anlegen und die zwei Werte an Claude geben oder selbst in `.env.local` eintragen.

**Was ist das:** Supabase stellt die Datenbank und den Login bereit. Dort werden die Nutzerkonten gespeichert, außerdem die Onboarding-Antworten und der Fortschritt bei den Tasks.

**Warum selbst:** Das Projekt läuft unter dem eigenen Konto. Die Daten sollen dem Konto gehören, unter dem die App betrieben wird, und ein Konto lässt sich nicht stellvertretend anlegen.

**So geht es** (ca. 10 Minuten, kostenlos):

1. Auf [supabase.com](https://supabase.com) ein Konto erstellen, zum Beispiel mit dem GitHub-Login.
2. Mit „New project“ ein Projekt anlegen:
   - Name: `freelance-guide`
   - Datenbank-Passwort festlegen und sicher aufbewahren
   - Region: **Central EU (Frankfurt)**, wichtig für den Datenschutz
   - Plan: Free
3. In den Projekteinstellungen unter „API“ zwei Werte kopieren: die **Project URL** und den **Publishable key**.
4. Beide Werte in `.env.local` eintragen (Vorlage: [.env.example](../.env.example)) oder an Claude geben.

Der Publishable Key darf weitergegeben werden, er ist für den Browser gedacht. Das Datenbank-Passwort wird nicht weitergegeben.

### Hosting festlegen

- [ ] Anbieter wählen und dort ein Konto anlegen.

**Was ist das:** Momentan läuft die App nur auf dem eigenen Rechner. Damit andere sie im Internet nutzen können, muss sie bei einem Anbieter liegen.

**Warum selbst:** Die Wahl des Anbieters hat Folgen für den Datenschutz. Er muss in der Datenschutzerklärung stehen, und mit ihm braucht es einen Vertrag zur Auftragsverarbeitung.

**Empfehlung:** Vercel, weil es von den Machern von Next.js stammt und die Einrichtung am einfachsten ist. Die Region wird dort auf Frankfurt (`fra1`) gestellt.

### Docker (optional)

Mit Docker ließe sich eine Kopie der Datenbank auf dem eigenen Rechner betreiben, zum Beispiel zum Testen ohne Internet. Ohne Docker wird direkt mit dem Supabase-Projekt gearbeitet. Für dieses Projekt reicht das aus.

### Projekt aus OneDrive lösen (optional)

**Warum:** Der Projektordner enthält den Ordner `node_modules` mit über 40.000 kleinen Dateien, die nur die Programmierwerkzeuge brauchen. OneDrive lädt alle diese Dateien in die Cloud hoch. Das kann den Rechner und die Synchronisation spürbar bremsen.

**Möglichkeiten:**

- So lassen, solange nichts auffällt.
- Das Projekt in einen Ordner außerhalb von OneDrive verschieben, zum Beispiel `C:\Projekte\freelance-guide`. Das ist ohne Risiko, weil der Code über Git und GitHub gesichert ist.

---

## Phase 1 – Project Setup

**Status:** fertig am 24.09.2026, auf `main` gemergt.

Die App ist aufgesetzt, alle automatischen Prüfungen laufen durch und das Layout funktioniert auf Handy und Desktop.

### Testergebnisse

- Lint, Formatierung, Typecheck und Production-Build laufen ohne Fehler.
- 7 Unit-Tests sind grün.
- 10 End-to-End-Tests sind grün, jeweils auf iPhone-SE-Größe und Desktop.
- Das Layout wurde zusätzlich anhand von Screenshots geprüft.

### Was jetzt steht

- **Grundgerüst:** Next.js 16 mit TypeScript im strengen Modus, Supabase-Anbindung für Browser und Server, Prüfung der Umgebungsvariablen und [.env.example](../.env.example). Die Supabase-Konfiguration liegt unter [supabase/](../supabase/).
- **Komponentensystem:** Tailwind und shadcn/ui. Buttons und Eingabefelder sind auf 44 px Höhe vergrößert, damit sie sich auf dem Handy gut antippen lassen.
- **Layout:** Auf dem Handy gibt es eine Navigationsleiste unten mit 5 Einträgen, auf dem Desktop eine Kopfnavigation. Im Footer stehen Impressum und Datenschutz. Die App ist auf Deutsch.
- **Seiten:** Eine Startseite, Fehlerseiten auf Deutsch und Platzhalter für alle Navigationsziele, damit kein Link ins Leere führt.
- **Werkzeuge und Ablauf:** Prettier, ESLint, Vitest, Playwright, ein CI-Workflow für GitHub, eine PR-Vorlage und der Git-Workflow im [README.md](../README.md).

### Abweichungen vom Plan

- **Code-Sprache:** Code, Kommentare und Commit-Nachrichten sind auf Englisch, nur die App selbst ist deutsch. Das steht auch im README.
- **Testport:** Die End-to-End-Tests laufen auf Port 3100, weil auf dem Entwicklungsrechner schon etwas auf Port 3000 läuft. So testen sie nie versehentlich einen fremden Server.
- **Node-Typen:** `@types/node` wurde von Version 20 auf 24 angehoben, sonst ließ sich Vitest nicht installieren.

### Nächster Schritt

Weiter mit **Phase 2: Content Architecture** (Content-Modell).

---

## Phase 2 – Content Architecture

**Status:** fertig am 24.09.2026, auf `main` gemergt.

Alle Inhalte der App liegen jetzt als Dateien im Ordner `content/`, getrennt von der Oberfläche. Sie werden vor jedem Build automatisch geprüft. Fehlerhafte Inhalte brechen den Build ab.

### Testergebnisse

- 31 Unit-Tests sind grün (davon 24 neu für das Content-Modell).
- Typecheck, Lint, Formatierung, Production-Build und die 10 End-to-End-Tests laufen ohne Fehler.
- Absichtlich eingebauter Fehler (zwei Tasks mit derselben ID): Der Build bricht wie gewünscht mit der Meldung `Duplicate task ID "list-skills"` ab.

### Was jetzt steht

- **Content-Modelle** für alle Inhalte aus der ToDo-Liste: Roadmap-Stufe, Task, Ressource, Tool, Vorlage, Rechtsartikel und Onboarding-Regeln.
- **Inhalte:**
  - Alle **15 Roadmap-Stufen** auf Deutsch, mit Erklärung und „Warum wichtig“
  - Ein erster **Entwurf mit 48 Tasks**, jeweils mit Beschreibung und geschätzter Dauer
  - Die **3 Tools** (Stundensatz, Projektpreis, Startklar-Check), damit Stufen darauf verlinken können
  - Die **Onboarding-Regeln** aus der Tabelle in Phase 5 der ToDo-Liste
  - Vorlagen und Rechtsartikel sind noch leer, sie folgen in Phase 9 und 10.
- **Automatische Prüfung** vor jedem Build (`npm run content:check`):
  - Alle Pflichtfelder sind ausgefüllt, unbekannte Felder (z. B. Tippfehler wie `titel`) werden gemeldet.
  - Alle IDs sind eindeutig.
  - Alle Verweise stimmen: Stufen auf Tools und Vorlagen, Onboarding-Regeln auf Stufen.
  - Vorlagen verwenden nur bekannte Platzhalter wie `{{name}}`, rechtliche Muster haben einen Hinweis.
  - Rechtsartikel haben mindestens eine Quelle und ein gültiges Prüfdatum, das nicht in der Zukunft liegt.
  - Ein Test hält alle Task-IDs fest. Wird eine umbenannt oder gelöscht, schlägt er fehl, bevor gespeicherter Fortschritt verloren geht.
- **Ladefunktionen** in `lib/content/`, über die die App die Inhalte liest (z. B. `getRoadmap()`, `getTask(id)`).
- **Hilfsfunktion für Phase 10:** prüft, ob ein Rechtsartikel seit mehr als 12 Monaten nicht mehr geprüft wurde.
- **Zeilenenden:** Eine `.gitattributes` legt einheitliche Zeilenenden fest. Das behebt die Warnung beim Commit von Phase 1.

### Abweichungen vom Plan

- **Kein `order`-Feld:** Die Reihenfolge von Stufen und Tasks ergibt sich aus ihrer Position in der Datei. So kann es keine doppelten oder lückenhaften Nummern geben. Die App bekommt die Nummer trotzdem mitgeliefert.
- **Keine `stageId` in den Tasks:** Tasks stehen direkt in ihrer Stufe, die Zuordnung ergibt sich daraus. Auch sie wird beim Laden ergänzt.
- **Keine Ressourcen-Links:** Die Tasks enthalten noch keine externen Links. Erfundene oder veraltete Links wären schlimmer als keine. Nur `https`-Links sind erlaubt.
- **Tasks im Startklar-Check:** Die Tasks „Vertragsvorlage besorgen“ und „Rechnungsvorlage vorbereiten“ in Stufe 7 sind schon angelegt, damit der Startklar-Check in Phase 8 darauf verweisen kann.

### Nächster Schritt

Weiter mit **Phase 3: Authentication & Persistence**. Dafür wird das Supabase-Projekt gebraucht (siehe Offene Punkte).
