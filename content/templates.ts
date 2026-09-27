import type { TemplateInput } from "@/lib/content/schema";

// Templates users edit in the browser and copy. Nothing is saved.
//
// Placeholders in {{double braces}} are filled from the profile (see
// templatePlaceholders in lib/content/schema.ts). Gaps the user fills in by hand
// are written in [square brackets]; the editor counts both as open.
// Messages to clients use "Sie"; tips address the user with "du".
//
// Order within the file is the order on the overview page.
export const templates = [
  {
    id: "freelancer-profile",
    title: "Freelancer-Profil",
    category: "Profil & Portfolio",
    kind: "template",
    description: "Ein kurzer Profiltext für LinkedIn und Freelancer-Plattformen.",
    tips: [
      "Schreib aus Sicht deiner Kunden: Welches Problem löst du für sie?",
      "Ein konkretes Ergebnis mit Zahl überzeugt mehr als eine lange Liste von Skills.",
      "Hat eine Plattform ein Zeichenlimit, reichen die ersten beiden Absätze.",
    ],
    body: `{{name}} – Freelance [Rolle, z. B. Frontend-Entwicklung] mit Schwerpunkt {{mainSkill}}

Ich unterstütze [Zielkunden, z. B. kleine Unternehmen und Agenturen] dabei, [Ergebnis, z. B. schnelle und barrierearme Websites umzusetzen].

Was ich mitbringe:
• {{yearsOfExperience}} Berufserfahrung mit {{mainSkill}}
• Weitere Kenntnisse: {{additionalSkills}}
• [Ein konkretes Ergebnis, z. B. „Ladezeit eines Onlineshops halbiert“]

Typische Projekte:
• [Projektart 1]
• [Projektart 2]

So arbeite ich: [1–2 Sätze, z. B. „Ich stimme mich eng mit Ihnen ab und zeige regelmäßig Zwischenstände.“]

Verfügbar ab [Datum] für [Umfang, z. B. 20 Stunden pro Woche], remote oder in [Ort].
Kontakt: [E-Mail-Adresse oder Link]`,
  },
  {
    id: "portfolio-structure",
    title: "Portfolio-Struktur",
    category: "Profil & Portfolio",
    kind: "example",
    description: "So beschreibst du ein Projekt als überzeugendes Fallbeispiel.",
    tips: [
      "Übernimm die Gliederung und ersetze den Inhalt durch dein eigenes Projekt.",
      "Die Zahlen im Beispiel sind erfunden. Nenne nur echte Ergebnisse – lieber vorsichtig („rund“) als geschönt.",
      "Bei Projekten aus einem Job: Frag vorher, ob du sie zeigen darfst, und lass vertrauliche Namen weg.",
    ],
    body: `Projekt: Online-Terminbuchung für eine Physiotherapie-Praxis
Zeitraum: 6 Wochen, rund 80 Stunden

Ausgangslage
Die Praxis vergab Termine nur per Telefon. Das Team verbrachte täglich rund zwei Stunden am Telefon, und viele Anrufe blieben unbeantwortet.

Meine Rolle
Konzeption und Umsetzung einer Online-Buchung, die sich in die bestehende Website einfügt.

Vorgehen
• Anforderungen in zwei Gesprächen mit der Praxisleitung geklärt
• Ablauf der Buchung als klickbaren Entwurf abgestimmt
• Buchung umgesetzt und an den vorhandenen Kalender angebunden
• Übergabe mit einer kurzen Anleitung für das Team

Ergebnis
• Rund 60 % der Termine werden inzwischen online gebucht
• Deutlich weniger Anrufe am Vormittag

Technologien
{{mainSkill}}, {{additionalSkills}}

Stimme aus dem Projekt
„[Kurzes Zitat aus dem Feedback, falls vorhanden]“`,
  },
  {
    id: "client-outreach",
    title: "Kundenanfrage",
    category: "Kundengewinnung",
    kind: "template",
    description: "Eine persönliche Erstnachricht an potenzielle Kunden.",
    tips: [
      "Schreib jede Anfrage einzeln: Ein Satz, der nur zu diesem Unternehmen passt, macht den Unterschied.",
      "Halte die Nachricht kurz und biete einen kleinen nächsten Schritt an, zum Beispiel ein 15-Minuten-Gespräch.",
      "Unaufgeforderte Werbe-E-Mails sind in Deutschland auch an Unternehmen meist nicht erlaubt. Schreib deshalb vor allem Menschen aus deinem Netzwerk an, Kontakte, an die du empfohlen wurdest, oder Unternehmen, die ein Projekt ausgeschrieben haben.",
    ],
    body: `Betreff: [Konkreter Anlass, z. B. Ihre Ausschreibung für eine neue Website]

Guten Tag [Name der Ansprechperson],

[Persönlicher Bezug: Woher kennt ihr euch, wer hat dich empfohlen oder worauf antwortest du?]

Ich bin {{name}}, freiberuflich im Bereich {{mainSkill}} tätig, und unterstütze [Zielkunden] bei [Leistung]. [Ein Satz zu einem passenden Ergebnis, z. B. „Für eine Praxis habe ich zuletzt eine Online-Terminbuchung umgesetzt.“]

Bei Ihnen könnte ich mir vorstellen, [konkreter Vorschlag, wie du helfen kannst].

Hätten Sie Interesse an einem kurzen Gespräch von 15 Minuten? Ich richte mich gern nach Ihrem Kalender.

Viele Grüße
{{name}}
[Telefonnummer] · [Link zum Portfolio]`,
  },
  {
    id: "follow-up-message",
    title: "Nachfass-Nachricht",
    category: "Kundengewinnung",
    kind: "template",
    description: "Freundlich nachfragen, wenn auf deine Anfrage keine Antwort kommt.",
    tips: [
      "Frag nach etwa einer Woche nach – einmal, höchstens zweimal.",
      "Antworte direkt auf deine erste Nachricht, damit der Verlauf sichtbar bleibt.",
      "Bleib freundlich und ohne Vorwurf: Keine Antwort heißt meist nur, dass keine Zeit war.",
    ],
    body: `Betreff: Re: [Betreff deiner ersten Nachricht]

Guten Tag [Name der Ansprechperson],

vor [einer Woche] hatte ich Ihnen wegen [Thema] geschrieben. Ich wollte kurz nachfragen, ob das Thema für Sie gerade aktuell ist.

[Optional: ein neuer, hilfreicher Gedanke, z. B. „Mir ist noch aufgefallen, dass …“]

Falls es gerade nicht passt, ist das völlig in Ordnung – eine kurze Rückmeldung hilft mir trotzdem weiter.

Viele Grüße
{{name}}`,
  },
  {
    id: "project-brief",
    title: "Projekt-Briefing",
    category: "Angebot & Auftrag",
    kind: "template",
    description: "Anforderungen nach dem Erstgespräch zusammenfassen und bestätigen lassen.",
    tips: [
      "Nutze die Gliederung als Leitfaden für das Erstgespräch und fülle sie danach aus.",
      "„Nicht enthalten“ ist genauso wichtig wie „Enthalten“: So vermeidest du Missverständnisse über den Umfang.",
      "Lass dir das Briefing bestätigen, bevor du das Angebot schreibst.",
    ],
    body: `Projekt-Briefing: [Projektname]
Stand: [Datum]

Auftraggeber: [Firma], Ansprechperson: [Name]
Erstellt von: {{name}}

1. Ausgangslage
[Was ist heute das Problem? Warum soll das Projekt jetzt starten?]

2. Ziel
[Woran erkennen wir am Ende, dass das Projekt erfolgreich war?]

3. Umfang
Enthalten:
• [Leistung 1]
• [Leistung 2]
Nicht enthalten:
• [z. B. Texte, Fotos, Hosting]

4. Was ich von Ihnen brauche
• [z. B. Zugänge, Inhalte, eine feste Ansprechperson für Rückfragen]

5. Zeitplan
Start: [Datum] · Zwischenstand: [Datum] · Fertigstellung: [Datum]

6. Budget
[Rahmen, falls bekannt]

7. Offene Fragen
• [Frage 1]

Bitte prüfen Sie, ob ich alles richtig verstanden habe. Auf dieser Grundlage erstelle ich Ihnen ein Angebot.`,
  },
  {
    id: "project-proposal",
    title: "Projektangebot",
    category: "Angebot & Auftrag",
    kind: "template",
    description: "Ein klar gegliedertes Angebot mit Leistungen, Preis und Zeitplan.",
    tips: [
      "Den Preis berechnest du mit dem Projektpreis-Rechner – inklusive Puffer.",
      "Beschreibe die Leistungen als Ergebnisse, die dein Kunde versteht, nicht als Liste von Technologien.",
      "Nutzt du die Kleinunternehmerregelung, entfallen die Zeilen zur Umsatzsteuer. Stattdessen steht dort ein Hinweis, dass keine Umsatzsteuer berechnet wird.",
      "Nimmt dein Kunde das Angebot an, ist es verbindlich. Punkte wie Nutzungsrechte und Haftung regelst du zusätzlich in einem Vertrag.",
    ],
    body: `Angebot Nr. [Nummer]
[Datum]

{{name}}
[Anschrift]
[E-Mail-Adresse] · [Telefonnummer]

An: [Firma], [Name der Ansprechperson], [Anschrift]

Angebot: [Projektname]

Guten Tag [Name der Ansprechperson],

vielen Dank für das Gespräch am [Datum]. Wie besprochen biete ich Ihnen folgende Leistungen an.

Ausgangslage und Ziel
[1–2 Sätze aus dem Briefing]

Leistungen
1. [Arbeitspaket] – [Anzahl] Stunden
2. [Arbeitspaket] – [Anzahl] Stunden
3. Abstimmung und Projektmanagement – [Anzahl] Stunden

Nicht enthalten: [z. B. Hosting, Texte, Lizenzen]

Preis
[Stunden gesamt] Stunden × {{hourlyRate}} = [Betrag] € netto
zzgl. 19 % Umsatzsteuer: [Betrag] €
Gesamt: [Betrag] € brutto

Zeitplan
Start: [Datum], Fertigstellung voraussichtlich am [Datum]

Zahlungsbedingungen
[z. B. 30 % bei Auftrag, der Rest nach Abnahme, jeweils zahlbar innerhalb von 14 Tagen]

Dieses Angebot gilt bis zum [Datum]. Wünsche außerhalb des beschriebenen Umfangs stimme ich vorher mit Ihnen ab und berechne sie nach Aufwand mit {{hourlyRate}} pro Stunde (netto).

Ich freue mich auf Ihre Rückmeldung.

Viele Grüße
{{name}}`,
  },
  {
    id: "invoice-example",
    title: "Rechnungsbeispiel",
    category: "Abrechnung",
    kind: "legal-sample",
    description: "Welche Angaben eine Rechnung in Deutschland in der Regel enthält.",
    disclaimer:
      "Dieses Muster ist nicht rechtlich geprüft und keine individuelle Rechts- oder Steuerberatung. Es zeigt die Angaben, die eine Rechnung in Deutschland nach § 14 Umsatzsteuergesetz üblicherweise enthalten muss. Was in deinem Fall gilt, klärst du am besten mit einer Steuerberatung oder deinem Finanzamt.",
    tips: [
      "Rechnungsnummern müssen fortlaufend und eindeutig sein, zum Beispiel 2026-001, 2026-002.",
      "Nutzt du die Kleinunternehmerregelung, weist du keine Umsatzsteuer aus. Statt der Umsatzsteuer-Zeilen steht dann ein Hinweis wie „Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.“",
      "Rechnungen an Unternehmen müssen in Deutschland schrittweise als E-Rechnung verschickt werden (zum Beispiel im Format XRechnung oder ZUGFeRD); ein einfaches PDF reicht dafür dann nicht mehr. Ab wann das für dich gilt, klärst du mit deiner Steuerberatung.",
    ],
    body: `{{name}}
[Straße und Hausnummer]
[PLZ und Ort]

An
[Firma]
[Name der Ansprechperson]
[Straße und Hausnummer]
[PLZ und Ort]

Rechnung

Rechnungsnummer: [z. B. 2026-001]
Rechnungsdatum: [Datum]
Leistungszeitraum: [z. B. 01.10.2026 bis 31.10.2026]
Steuernummer: [Steuernummer oder USt-IdNr.]

Guten Tag [Name der Ansprechperson],

für meine Leistungen im Projekt [Projektname] berechne ich Ihnen:

1. [Leistung, z. B. Umsetzung der Online-Terminbuchung]
   [Anzahl] Stunden × {{hourlyRate}} = [Betrag] €
2. [Leistung]
   [Anzahl] Stunden × {{hourlyRate}} = [Betrag] €

Nettobetrag: [Betrag] €
zzgl. 19 % Umsatzsteuer: [Betrag] €
Rechnungsbetrag: [Betrag] €

Bitte überweisen Sie den Rechnungsbetrag bis zum [Datum] auf folgendes Konto:
Kontoinhaber: {{name}}
IBAN: [IBAN]
Bank: [Name der Bank]

Vielen Dank für die gute Zusammenarbeit.

{{name}}`,
  },
  {
    id: "testimonial-request",
    title: "Bitte um Referenz",
    category: "Nach dem Projekt",
    kind: "template",
    description: "Zufriedene Kunden um eine kurze Referenz bitten.",
    tips: [
      "Frag kurz nach Projektende, solange die Zusammenarbeit noch frisch ist.",
      "Hol dir die Erlaubnis zur Veröffentlichung schriftlich. Die Nachricht fragt deshalb ausdrücklich danach.",
      "Hat dein Kunde wenig Zeit, kannst du einen Entwurf anbieten, den er anpasst und freigibt.",
    ],
    body: `Betreff: Kurze Bitte: Ihr Feedback zu [Projektname]

Guten Tag [Name der Ansprechperson],

vielen Dank noch einmal für die gute Zusammenarbeit bei [Projektname]. [Ein Satz dazu, was das Projekt erreicht hat oder was dir besonders gefallen hat.]

Ich baue gerade meine Selbstständigkeit im Bereich {{mainSkill}} auf und würde mich sehr über eine kurze Referenz freuen. Zwei bis drei Sätze reichen völlig, zum Beispiel zu diesen Fragen:

• Was war die Ausgangslage vor dem Projekt?
• Wie haben Sie die Zusammenarbeit erlebt?
• Was hat sich durch das Ergebnis verbessert?

Darf ich Ihre Referenz mit Ihrem Namen, Ihrer Position und dem Firmennamen auf meiner Website und in meinen Profilen veröffentlichen? Wenn Ihnen etwas davon lieber anonym ist, sagen Sie mir einfach Bescheid.

Vielen Dank und viele Grüße
{{name}}`,
  },
] satisfies TemplateInput[];
