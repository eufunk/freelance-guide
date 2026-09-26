# Umsetzungsfortschritt

Stand der Umsetzung der Phasen aus der [ToDo-Liste](ToDo.docx). Pro abgeschlossener Phase kommt unten ein Abschnitt dazu.

## Übersicht

| Phase | Inhalt                            | Status        | Abgeschlossen |
| ----- | --------------------------------- | ------------- | ------------- |
| 1     | Project Setup                     | ✅ Fertig     | 24.09.2026    |
| 2     | Content Architecture              | ✅ Fertig     | 24.09.2026    |
| 3     | Authentication & Persistence      | ✅ Fertig     | 24.09.2026    |
| 4     | Product Structure & Legal Pages   | ✅ Fertig     | 24.09.2026    |
| 5     | Onboarding                        | ✅ Fertig     | 26.09.2026    |
| 6     | Roadmap & Task System             | ✅ Fertig     | 26.09.2026    |
| 7     | Dashboard                         | ⏳ Als Nächstes |               |
| 8     | Tools                             | Offen         |               |
| 9     | Templates                         | Offen         |               |
| 10    | German Freelancer Basics          | Offen         |               |
| 11    | Privacy & Product Metric Tracking | Offen         |               |

## Offene Punkte

Diese Punkte gehören zu keiner bestimmten Phase.

| Punkt                       | Wer         | Bis wann                              | Pflicht? |
| --------------------------- | ----------- | ------------------------------------- | -------- |
| Roadmap-Texte durchsehen    | Eugenia     | Vor dem Livegang                      | Ja       |
| Supabase-Cloud-Projekt anlegen | Eugenia  | Bevor die App online geht (Ende MVP)  | Ja       |
| Hosting festlegen           | Eugenia     | Bevor die App online geht (Ende MVP)  | Ja       |
| Impressum und Datenschutz fertigstellen | Eugenia | Bevor die App online geht | Ja |
| Projekt aus OneDrive lösen  | Eugenia     | Nur falls der Rechner langsam wird    | Nein     |

### Roadmap-Texte durchsehen

- [ ] Die Texte der 15 Stufen und ihrer Tasks in [content/roadmap.ts](../content/roadmap.ts) lesen und korrigieren.

**Warum:** Die Texte sind ein erster Entwurf aus Phase 2. Sie sind das, was Nutzer später als Anleitung lesen, und sollten deshalb fachlich geprüft sein. Ändern lassen sich Titel und Beschreibungen jederzeit. Nur die IDs (`id: "..."`) dürfen nach dem Livegang nicht mehr geändert werden, weil der gespeicherte Fortschritt der Nutzer daran hängt.

**Offene Stilfrage:** Die Texte verwenden „Kunden“ und „Freelancer“ in der männlichen Grundform. Wo es leicht ging, sind sie neutral formuliert („Ansprechperson“). Falls die App durchgehend gendern soll, müsste das vor der Durchsicht entschieden werden.

### Impressum und Datenschutz fertigstellen

- [ ] Im Impressum Name, Anschrift und E-Mail-Adresse eintragen.
- [ ] Die Datenschutzerklärung prüfen lassen oder mit einem Datenschutz-Generator abgleichen, die markierten Stellen ergänzen (Hosting, E-Mail-Dienst, Speicherfristen) und sie als geprüft markieren.

**Wo:** Beide Texte stehen in [content/legal-pages.ts](../content/legal-pages.ts). Fehlende Stellen sind als `[[PLATZHALTER: …]]` markiert und auf der Seite gelb hervorgehoben.

**Warum:** Ohne vollständiges Impressum und korrekte Datenschutzerklärung darf die App nicht öffentlich betrieben werden. Die Datenschutzerklärung ist ein Entwurf von Claude und keine Rechtsberatung.

**Absicherung:** Ein automatischer Check bricht den Build ab, sobald die App für eine öffentliche Adresse gebaut wird und noch Platzhalter übrig sind oder die Datenschutzerklärung noch als Entwurf markiert ist.

### Supabase-Cloud-Projekt anlegen

- [ ] Projekt anlegen und die zwei Werte an Claude geben.

**Erst nötig, wenn die App online gehen soll.** Bis dahin läuft die Datenbank lokal (siehe „Lokale Datenbank“ unten).

**Was ist das:** Supabase stellt die Datenbank und den Login bereit. Dort werden die Nutzerkonten gespeichert, außerdem die Onboarding-Antworten und der Fortschritt bei den Tasks. Lokal läuft dieselbe Software auf dem eigenen Rechner; für die öffentliche App braucht es ein Projekt bei Supabase.

**Warum selbst:** Das Projekt läuft unter dem eigenen Konto. Die Daten sollen dem Konto gehören, unter dem die App betrieben wird, und ein Konto lässt sich nicht stellvertretend anlegen.

**So geht es** (ca. 10 Minuten, kostenlos):

1. Auf [supabase.com](https://supabase.com) ein Konto erstellen, zum Beispiel mit dem GitHub-Login.
2. Mit „New project“ ein Projekt anlegen:
   - Name: `freelance-guide`
   - Datenbank-Passwort festlegen und sicher aufbewahren
   - Region: **Central EU (Frankfurt)**, wichtig für den Datenschutz
   - Plan: Free
3. In den Projekteinstellungen unter „API“ zwei Werte kopieren: die **Project URL** und den **Publishable key**.
4. Beide Werte an Claude geben. Sie kommen später in die Einstellungen des Hosting-Anbieters.

Der Publishable Key darf weitergegeben werden, er ist für den Browser gedacht. Das Datenbank-Passwort wird nicht weitergegeben.

### Hosting festlegen

- [ ] Anbieter wählen und dort ein Konto anlegen.

**Was ist das:** Momentan läuft die App nur auf dem eigenen Rechner. Damit andere sie im Internet nutzen können, muss sie bei einem Anbieter liegen.

**Warum selbst:** Die Wahl des Anbieters hat Folgen für den Datenschutz. Er muss in der Datenschutzerklärung stehen, und mit ihm braucht es einen Vertrag zur Auftragsverarbeitung.

**Empfehlung:** Vercel, weil es von den Machern von Next.js stammt und die Einrichtung am einfachsten ist. Die Region wird dort auf Frankfurt (`fra1`) gestellt.

### Projekt aus OneDrive lösen (optional)

**Warum:** Der Projektordner enthält den Ordner `node_modules` mit über 40.000 kleinen Dateien, die nur die Programmierwerkzeuge brauchen. OneDrive lädt alle diese Dateien in die Cloud hoch. Das kann den Rechner und die Synchronisation spürbar bremsen.

**Möglichkeiten:**

- So lassen, solange nichts auffällt.
- Das Projekt in einen Ordner außerhalb von OneDrive verschieben, zum Beispiel `C:\Projekte\freelance-guide`. Das ist ohne Risiko, weil der Code über Git und GitHub gesichert ist.

---

## Lokale Datenbank (24.09.2026)

**Entscheidung:** Die App läuft vorerst nur lokal. Die Datenbank läuft deshalb auch lokal statt in der Supabase-Cloud. Das Cloud-Projekt wird erst angelegt, bevor die App online geht. Am Code ändert das nichts: Derselbe Stand lässt sich später 1:1 in die Cloud übertragen.

### Warum nicht Docker Desktop

Supabase braucht lokal Docker. Docker Desktop war auf diesem Rechner schon zweimal installiert und wurde wegen Problemen wieder entfernt (zuletzt am 18.08.2026). Die Protokolle von damals zeigen die Ursache:

> „wsl.exe --mount auf ARM64 erfordert Windows 27653 oder höher.“

Der Rechner hat einen ARM-Prozessor und Windows-Build 26200. Docker Desktop konnte seine Daten-Festplatte deshalb nicht einhängen und startete in einer Endlosschleife. Das würde bei einer Neuinstallation wieder passieren, bis Windows auf Build 27653 oder höher ist.

### Lösung: Docker direkt in Ubuntu (WSL)

Docker läuft stattdessen direkt im vorhandenen Ubuntu unter WSL, ohne Docker Desktop. Dafür wird das Einhängen nicht gebraucht.

Eingerichtet wurde:

- **In Ubuntu:** Docker 29.1.3 und die Supabase-CLI 2.117.0. Vorher musste eine ältere, unterbrochene Paketinstallation in Ubuntu abgeschlossen werden (`dpkg --configure -a`).
- **Supabase lokal** mit Datenbank, Login, Admin-Oberfläche und Test-Postfach. Nicht benötigte Dienste (Datei-Speicher, Echtzeit, Serverfunktionen, Log-Analyse) sind abgeschaltet, um Arbeitsspeicher zu sparen.
- **`.env.local`** mit den lokalen Zugangsdaten. Das sind feste Standardwerte jeder lokalen Supabase-Installation und keine Geheimnisse.
- **Start und Stopp per npm-Befehl**, siehe unten. WSL fährt Ubuntu von selbst herunter, wenn gerade niemand damit arbeitet, und damit auch die Datenbank. `npm run db:start` hält Ubuntu deshalb wach, bis `npm run db:stop` aufgerufen wird.

### Benutzung

Im Projektordner in einem Terminal:

| Befehl              | Was passiert                                                              |
| ------------------- | ------------------------------------------------------------------------- |
| `npm run db:start`  | Startet die Datenbank. Beim allerersten Mal dauert es einige Minuten.     |
| `npm run db:stop`   | Stoppt die Datenbank. Die Daten bleiben erhalten.                         |
| `npm run db:status` | Zeigt, ob sie läuft, und die Adressen.                                    |
| `npm run db:reset`  | Setzt die Datenbank auf den Ausgangszustand zurück. **Löscht alle Daten.** |

Nach einem Neustart des Rechners ist die Datenbank aus und muss mit `npm run db:start` wieder gestartet werden.

| Oberfläche      | Adresse                | Wofür                                                  |
| --------------- | ---------------------- | ------------------------------------------------------ |
| Supabase Studio | http://127.0.0.1:54323 | Tabellen und Nutzer ansehen und bearbeiten             |
| Mailpit         | http://127.0.0.1:54324 | E-Mails lesen, die die App verschickt (z. B. Bestätigungen) |

Lokal verschickt die App keine echten E-Mails. Alle Mails landen in Mailpit.

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

Weiter mit **Phase 3: Authentication & Persistence**, mit der lokalen Datenbank.

---

## Phase 3 – Authentication & Persistence

**Status:** fertig am 24.09.2026, auf `main` gemergt. Im Browser getestet: Registrierung, E-Mail-Bestätigung und Anmeldung funktionieren.

Nutzer können sich jetzt registrieren, ihre E-Mail-Adresse bestätigen, sich an- und abmelden und ein vergessenes Passwort zurücksetzen. Die Datenbank hat Tabellen für Profil, Task-Fortschritt und Rechner-Ergebnisse. Jeder Nutzer kann nur seine eigenen Daten sehen.

### Testergebnisse

- 71 Unit-Tests sind grün (davon 40 neu).
- 18 Datenbanktests sind grün. Gegenprobe: Mit einer absichtlich eingebauten Lücke (jeder darf alle Profile lesen) schlägt der passende Test fehl.
- 24 End-to-End-Tests sind grün, auf Handy und Desktop, ohne Wiederholungen. Sie spielen die kompletten Abläufe durch, inklusive der E-Mails aus Mailpit:
  - Registrieren, E-Mail bestätigen, abmelden, wieder anmelden
  - Anmelden ist erst nach der Bestätigung möglich
  - Passwort vergessen und neu setzen
  - Geschützte Seiten leiten zur Anmeldung und danach zurück
  - Ungültige Links und manipulierte Weiterleitungen werden abgefangen
- Lint, Typecheck, Formatierung und Production-Build laufen ohne Fehler.

### Was jetzt steht

- **Seiten:** Registrieren, Anmelden, Passwort vergessen, Neues Passwort. Auf der Startseite führt „Loslegen“ zur Registrierung. Im Header steht für Nicht-Angemeldete „Anmelden“. Abmelden geht über „Profil“.
- **Deutsche E-Mails** für die Bestätigung und das Zurücksetzen des Passworts.
- **Passwortregeln:** mindestens 8 Zeichen, mit Buchstaben und Zahlen.
- **Datenschutz im Formular:** Registrierung und „Passwort vergessen“ antworten gleich, egal ob es die E-Mail-Adresse schon gibt. So lässt sich nicht herausfinden, wer ein Konto hat.
- **Geschützte Seiten:** Dashboard, Roadmap und Profil nur mit Anmeldung. Tools und Vorlagen bleiben ohne Konto nutzbar, damit man die App erst ausprobieren kann.
- **Datenbank:**
  - `profiles`: wird bei der Registrierung automatisch angelegt und im Onboarding (Phase 5) gefüllt
  - `task_progress`: Status jedes Tasks pro Nutzer
  - `calculator_results`: letztes Ergebnis je Rechner
  - Zugriffsregeln: Jeder kann nur seine eigenen Zeilen lesen und ändern. Nicht angemeldete Besucher haben gar keinen Zugriff.
  - Wird ein Konto gelöscht, werden alle zugehörigen Daten automatisch mitgelöscht.
- **Datenzugriff** für die späteren Phasen: Profil lesen und ändern, Task-Status setzen, Rechner-Ergebnis speichern.
- **Automatische Prüfung auf GitHub** startet jetzt eine Supabase-Instanz und führt dort auch die Datenbank- und End-to-End-Tests aus.

### Abweichungen vom Plan

- **Tabelle `events`** (Tracking) ist noch nicht angelegt. Sie gehört laut ToDo-Liste zu Phase 11.
- **Konto löschen:** Die Datenbank ist vorbereitet (alle Daten werden mitgelöscht). Die Funktion in den Einstellungen kommt in Phase 4.
- **Eigener E-Mail-Versand (SMTP):** Lokal nicht nötig, weil alle Mails in Mailpit landen. Wird eingerichtet, wenn die App online geht.
- **Alle Seiten werden pro Anfrage gerendert**, weil der Header den Anmeldestatus prüft. Für diese App ist das kein Nachteil.
- **Eigener Port 3200:** Auf Port 3000 läuft auf diesem Rechner die App `software-developer-portfolio`. Der Freelance Guide läuft deshalb fest auf **http://localhost:3200**. Auch die Links in den Bestätigungsmails zeigen dorthin.

### Nächster Schritt

Weiter mit **Phase 4: Product Structure & Legal Pages**.

---

## Phase 4 – Product Structure & Legal Pages

**Status:** fertig am 24.09.2026, auf `main` gemergt.

### Testergebnisse

- 85 Unit-Tests sind grün (davon 14 neu). 2 weitere Tests (Release-Check) werden lokal wie gewünscht übersprungen.
- 24 Datenbanktests sind grün (davon 6 neu für „Konto löschen“).
- 42 End-to-End-Tests sind grün, auf Handy und Desktop.
- Release-Check geprüft: Ein simulierter Build für eine öffentliche Adresse bricht wie gewünscht ab.
- Lint, Typecheck, Formatierung und Production-Build laufen ohne Fehler.

### Was jetzt steht

- **Navigation:** Dashboard, Roadmap, Tools, **Wissen**, Profil. „Wissen“ ersetzt „Vorlagen“ und enthält zwei Bereiche: Vorlagen (Phase 9) und Deutschland-Grundlagen (Phase 10).
- **Tools:** Die Seite zeigt die drei Tools aus dem Content-Modell an, vorerst als „Bald verfügbar“ (Phase 8).
- **Startseite:** Neuer Abschnitt „So funktioniert's“ mit drei Schritten.
- **Onboarding:** Platzhalterseite, nur mit Anmeldung (Inhalt folgt in Phase 5).
- **Profil:**
  - Konto: E-Mail-Adresse und Abmelden
  - „Angaben ändern“: führt ins Onboarding (Phase 5)
  - Passwort ändern: nur mit dem aktuellen Passwort
  - Konto löschen: nur mit dem aktuellen Passwort. Alle Daten werden sofort mitgelöscht, danach erscheint eine Bestätigungsseite.
- **Impressum und Datenschutzerklärung:** mit Platzhaltern und Entwurf-Hinweis, siehe „Offene Punkte“.
- **`npm run db:migrate`:** wendet neue Datenbank-Migrationen an, ohne vorhandene Daten zu löschen.

### Gefundene und behobene Fehler

- **Doppelte Feld-IDs:** Passwort ändern und Konto löschen hatten beide ein Feld `currentPassword`. Dadurch gab es dieselbe HTML-ID zweimal, und das Passwortfeld im Löschformular war für Screenreader nicht beschriftet. Die Felder haben jetzt eindeutige IDs. Gefunden hat das der End-to-End-Test.

### Hinweise

- **Lokale Testdaten gelöscht:** Beim Einspielen der neuen Migration wurde die lokale Datenbank mit `db:reset` zurückgesetzt. Das eigene Testkonto aus Phase 3 ist dadurch gelöscht und muss neu registriert werden. Neue Migrationen werden ab jetzt mit `npm run db:migrate` eingespielt.
- **OneDrive:** Der Build scheiterte einmal daran, dass OneDrive Dateien im Build-Ordner festhielt; beim zweiten Versuch lief er durch (siehe „Projekt aus OneDrive lösen“).

### Nächster Schritt

Weiter mit **Phase 5: Onboarding**.

---

## Phase 5 – Onboarding

**Status:** fertig am 26.09.2026, auf `main` gemergt.

Neue Nutzer beantworten nach der ersten Anmeldung ein paar Fragen. Daraus berechnet der Guide ihren persönlichen Startpunkt in der Roadmap.

### Testergebnisse

- 109 Unit-Tests sind grün (davon 24 neu für das Onboarding).
- 24 Datenbanktests sind grün.
- 56 End-to-End-Tests sind grün, auf Handy und Desktop (davon 14 neu).
- Datenbank direkt geprüft: Ein Durchlauf mit dem Ziel „erster Kunde“, Portfolio und abgewählter Stufe 3 speichert genau die 10 Tasks der Stufen 1, 2 und 4. Wird das Onboarding danach mit dem Ziel „Freelancer werden“ wiederholt, sind diese Häkchen wieder entfernt.
- Lint, Typecheck, Formatierung und Production-Build laufen ohne Fehler.

### Was jetzt steht

- **Fünf Schritte** mit Fortschrittsanzeige:
  1. Über dich: Name und Land. Bei einem anderen Land als Deutschland erscheint ein Hinweis, dass sich Steuern, Anmeldung und Versicherung auf Deutschland beziehen.
  2. Dein IT-Profil: Haupt-Skill (Freitext mit Vorschlägen), weitere Skills, Jahre Berufserfahrung, Portfolio (Ja/Nein), Freelance-Erfahrung (Ja/Nein)
  3. Dein Ziel: eines der drei Ziele aus der ToDo-Liste
  4. Deine Zeit: Stunden pro Woche und gewünschter Starttermin (optional)
  5. Dein Startpunkt: die vorgeschlagenen, bereits erledigten Stufen zum Abhaken und der daraus folgende Startpunkt
- **Prüfung pro Schritt:** „Weiter“ geht erst, wenn der Schritt vollständig ist. Fehlermeldungen stehen direkt am Feld.
- **Startpunkt-Regeln** wie in der ToDo-Liste (Phase 5). Vorgeschlagene Stufen lassen sich abwählen, der Startpunkt passt sich sofort an.
- **Schutz vor Manipulation:** Als erledigt gespeichert werden nur Stufen, die die Regeln tatsächlich vorschlagen.
- **Neue Nutzer** werden vom Dashboard automatisch ins Onboarding geleitet. Danach begrüßt das Dashboard sie mit Namen.
- **Angaben ändern:** Über „Profil“ lässt sich das Onboarding wiederholen, die bisherigen Antworten sind vorausgefüllt. Selbst abgehakte Aufgaben bleiben erhalten, nur die Häkchen aus dem Onboarding werden neu berechnet.

### Abweichungen vom Plan

- **Kein separates Erfahrungslevel:** Gefragt werden nur die Jahre Berufserfahrung (Entscheidung vom 26.09.2026). Die ungenutzte Datenbank-Spalte `experience_level` wurde entfernt.

### Gefundene und behobene Fehler

- **Übersicht wurde übersprungen:** Beim Klick auf „Weiter“ im vierten Schritt wurde das Formular sofort abgeschickt, ohne dass die Übersicht mit dem Startpunkt erschien. Ursache: React hatte den geklickten Button noch während des Klicks in den Absende-Button umgewandelt. Gefunden hat das der End-to-End-Test.
- **Datenbank-Start:** `npm run db:start` hat den Prozess beendet, der WSL wachhält, wenn die Datenbank gerade noch hochfuhr. Dann schaltete WSL die Datenbank kurz darauf wieder ab. Das Skript wartet jetzt, bis die laufende Datenbank bereit ist.

### Nächster Schritt

Weiter mit **Phase 6: Roadmap & Task System**.

---

## Phase 6 – Roadmap & Task System

**Status:** fertig am 26.09.2026, auf `main` gemergt.

Die Roadmap zeigt jetzt alle 15 Stufen mit dem persönlichen Fortschritt. Aufgaben lassen sich starten, abschließen und wieder öffnen.

### Testergebnisse

- 130 Unit-Tests sind grün (davon 21 neu).
- 24 Datenbanktests sind grün.
- 68 End-to-End-Tests sind grün, auf Handy und Desktop (davon 12 neu), in drei Läufen hintereinander. In einem früheren Lauf ist ein Test mit einer URL-Prüfung einmal fehlgeschlagen; das ließ sich nicht wiederholen. Falls er erneut auftaucht, wird er genauer untersucht.
- Lint, Typecheck, Formatierung und Production-Build laufen ohne Fehler.

### Was jetzt steht

- **Roadmap-Übersicht:** Gesamtfortschritt („19 % geschafft · 9 von 48 Aufgaben erledigt“) und alle 15 Stufen. Erledigte Stufen haben einen grünen Haken, die aktuelle Stufe ist hervorgehoben und zeigt als einzige ihre Kurzbeschreibung (schrittweise Information statt Textwüste).
- **Stufen-Seite:** Erklärung, „Warum das wichtig ist“, alle Aufgaben mit Beschreibung, geschätzter Dauer und Status (Offen / In Arbeit / Erledigt am …), passende Tools und Links zur vorherigen und nächsten Stufe. Ist eine Stufe komplett, erscheint „Stufe erledigt – stark!“ mit einem Button zur nächsten Stufe.
- **Aufgaben:** „Starten“, „Erledigt“ und „Wieder öffnen“. Mehrere Aufgaben können gleichzeitig in Arbeit sein. Auch Häkchen aus dem Onboarding lassen sich wieder öffnen; die Aufgabe gilt danach als eigene.
- **Berechnete Werte** wie in der ToDo-Liste (reine Funktionen, nichts davon wird gespeichert): Stufe erledigt, aktuelle Stufe, Fortschritt in Prozent, nächste Aufgabe und nächste empfohlene Aufgabe. Die letzten beiden nutzt das Dashboard in Phase 7.
- **Unbekannte Stufen** zeigen eine eigene Seite „Stufe nicht gefunden“.

### Abweichungen vom Plan

- **Keine Vorlagen und Links an den Stufen:** Die Stellen dafür sind vorbereitet, die Inhalte folgen mit den Vorlagen (Phase 9). Externe Links gibt es bewusst noch keine (siehe Phase 2).
- **Roadmap ohne Onboarding nutzbar:** Anders als das Dashboard leitet die Roadmap nicht ins Onboarding um. Wer das Onboarding überspringt, startet einfach bei Stufe 1.

### Nächster Schritt

Weiter mit **Phase 7: Dashboard**.
