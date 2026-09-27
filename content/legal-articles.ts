import type { LegalArticleInput } from "@/lib/content/schema";

// Germany basics. General information only – never advice for an individual case
// (Rechtsdienstleistungsgesetz). Every article needs official sources and the date
// it was last checked against them (lastVerified). A content test fails once an
// article is older than 12 months; going live needs expertReviewed: true.
//
// Numbers and their unit (25.000 €, § 19) are joined by a non-breaking space.
// Body: Markdown (## headings, lists, **bold**, links). The page adds the summary,
// the sources, the date and the disclaimer automatically.
//
// Order within the file is the order on the overview page.

const VERIFIED = "2026-09-27";

export const legalArticles = [
  {
    id: "freelancer-or-trade",
    title: "Freiberufler oder Gewerbe?",
    category: "Anmeldung und Status",
    summary:
      "Ob du freiberuflich oder gewerblich tätig bist, entscheidet über Gewerbeanmeldung, Gewerbesteuer und IHK-Mitgliedschaft. In der IT hängt es von deiner Tätigkeit und Qualifikation ab – verbindlich entscheidet das Finanzamt.",
    body: `## Worum es geht

Das Steuerrecht unterscheidet zwei Arten der Selbstständigkeit:

- **Freie Berufe** sind in § 18 Einkommensteuergesetz aufgezählt, zum Beispiel Ingenieure, Architekten oder Steuerberater, dazu „ähnliche Berufe“. IT-Berufe stehen nicht ausdrücklich in dieser Liste.
- **Gewerbe** ist grundsätzlich jede andere selbstständige, auf Gewinn ausgerichtete Tätigkeit.

## Was das für IT-Freelancer bedeutet

Softwareentwicklung und IT-Beratung können freiberuflich sein, wenn sie einem Ingenieurberuf ähnlich sind. Laut Existenzgründungsportal des Bundes kommt es dabei unter anderem an auf:

- ein passendes Hochschulstudium (zum Beispiel Informatik) **oder** nachweisbar vergleichbares Wissen,
- eine Tätigkeit, die inhaltlich einer Ingenieurtätigkeit entspricht,
- eigenverantwortliches Arbeiten ohne fachliche Weisungen des Kunden.

Ob das bei dir zutrifft, ist eine Frage des Einzelfalls. **Verbindlich entscheidet das Finanzamt.** Gewerbeamt und Finanzamt können dieselbe Tätigkeit unterschiedlich einordnen.

## Die wichtigsten Unterschiede

**Freie Berufe**

- Anmeldung nur beim Finanzamt
- keine Gewerbesteuer
- keine IHK-Mitgliedschaft

**Gewerbe**

- Anmeldung beim Gewerbeamt, das auch das Finanzamt informiert
- Gewerbesteuer, für Einzelunternehmen mit einem Freibetrag von 24.500 € Gewinn pro Jahr
- automatische Mitgliedschaft in der IHK

Für beide gilt: Einkommensteuer fällt an, Umsatzsteuer in der Regel auch (außer mit der Kleinunternehmerregelung).

## Typische nächste Schritte

- Beschreibe deine Tätigkeit so konkret wie möglich, bevor du dich anmeldest.
- Im Fragebogen zur steuerlichen Erfassung gibst du an, wie du deine Tätigkeit einordnest. Das Finanzamt prüft das.
- Bei Unsicherheit helfen eine Steuerberatung oder die Gründungsberatung deiner IHK.`,
    sources: [
      {
        title: "§ 18 EStG – Selbständige Arbeit (gesetze-im-internet.de)",
        url: "https://www.gesetze-im-internet.de/estg/__18.html",
      },
      {
        title:
          "Existenzgründungsportal des Bundes: Software-Entwickler und IT-Berater – freiberufliche oder gewerbliche Tätigkeit?",
        url: "https://www.existenzgruendungsportal.de/Redaktion/DE/BMWK-Infopool/Antworten/Gruendungsplanung/Freie-Berufe/beratende-Taetig/Software-Entwickler-und-IT-Berater-freiberufliche-oder-gewerbliche-Taetigkeit.html",
      },
      {
        title: "§ 11 GewStG – Steuermesszahl und Freibetrag (gesetze-im-internet.de)",
        url: "https://www.gesetze-im-internet.de/gewstg/__11.html",
      },
    ],
    lastVerified: VERIFIED,
    expertReviewed: false,
  },
  {
    id: "registration",
    title: "Anmeldung der Selbstständigkeit",
    category: "Anmeldung und Status",
    summary:
      "Freiberufler melden sich nur beim Finanzamt an. Wer ein Gewerbe betreibt, meldet es beim Gewerbeamt an – gleichzeitig mit dem Start. Die Meldung ans Finanzamt ist in beiden Fällen innerhalb eines Monats fällig.",
    body: `## Freie Berufe

Freiberufler brauchen **keine Gewerbeanmeldung**. Die erste Anlaufstelle ist das Finanzamt: Innerhalb eines Monats nach dem Start füllst du online den Fragebogen zur steuerlichen Erfassung aus (siehe Artikel „Finanzamt“).

## Gewerbe

Wer ein Gewerbe betreibt, muss es **gleichzeitig mit dem Beginn** beim Gewerbeamt der Stadt oder Gemeinde anmelden (§ 14 Gewerbeordnung). Viele Kommunen bieten das online an; es kostet eine Gebühr, deren Höhe je nach Ort unterschiedlich ist.

Das Gewerbeamt informiert danach unter anderem das Finanzamt und die IHK. Den Fragebogen zur steuerlichen Erfassung musst du trotzdem selbst ausfüllen.

## Weitere Stellen

- **Krankenkasse:** Teile ihr mit, dass du selbstständig bist. Das verändert deine Beiträge (siehe Artikel „Krankenversicherung“).
- **Arbeitgeber:** Startest du nebenberuflich, kann dein Arbeitsvertrag verlangen, dass du die Nebentätigkeit anzeigst oder genehmigen lässt.
- **Agentur für Arbeit:** Wenn du Arbeitslosengeld beziehst, sprich die Gründung vorher mit ihr ab.

## Typische nächste Schritte

- Kläre zuerst, ob deine Tätigkeit freiberuflich oder gewerblich ist.
- Lege dir ein ELSTER-Konto an. Die Registrierung dauert einige Tage, weil Zugangsdaten per Post kommen.
- Halte ein Startdatum fest: Ab dann laufen die Fristen.`,
    sources: [
      {
        title: "Existenzgründungsportal des Bundes: Als Freiberuflerin oder Freiberufler anmelden",
        url: "https://www.existenzgruendungsportal.de/Redaktion/DE/So-gehts/Unternehmensanmeldung/als-freiberuflerin-und-freiberufler-anmelden",
      },
      {
        title: "§ 14 GewO – Anzeigepflicht (gesetze-im-internet.de)",
        url: "https://www.gesetze-im-internet.de/gewo/__14.html",
      },
      {
        title: "§ 138 AO – Anzeigen über die Erwerbstätigkeit (gesetze-im-internet.de)",
        url: "https://www.gesetze-im-internet.de/ao_1977/__138.html",
      },
    ],
    lastVerified: VERIFIED,
    expertReviewed: false,
  },
  {
    id: "tax-office",
    title: "Finanzamt: Fragebogen zur steuerlichen Erfassung",
    category: "Anmeldung und Status",
    summary:
      "Innerhalb eines Monats nach dem Start meldest du dich mit dem Fragebogen zur steuerlichen Erfassung über ELSTER beim Finanzamt an. Danach bekommst du deine Steuernummer.",
    body: `## Was der Fragebogen ist

Mit dem Fragebogen zur steuerlichen Erfassung teilst du dem Finanzamt mit, dass du selbstständig arbeitest. Für Freiberufler und Einzelunternehmen gibt es dafür ein eigenes Formular bei ELSTER. Die Meldung ist **innerhalb eines Monats** nach dem Start fällig und muss grundsätzlich **elektronisch** übermittelt werden (§ 138 Abgabenordnung).

## Was du angeben musst

- persönliche Daten und Bankverbindung
- deine Tätigkeit und wann du begonnen hast
- ob du freiberuflich oder gewerblich tätig bist
- deinen **geschätzten Umsatz und Gewinn** für das erste und das zweite Jahr
- ob du die Kleinunternehmerregelung nutzen möchtest
- wie du deinen Gewinn ermittelst (bei den meisten Freelancern: Einnahmenüberschussrechnung)

Die Schätzungen dürfen grob sein. Das Finanzamt setzt danach aber oft **Vorauszahlungen** für die Einkommensteuer fest. Eine zu hohe Schätzung bedeutet hohe Vorauszahlungen, eine zu niedrige später eine Nachzahlung.

## Danach

Das Finanzamt prüft die Angaben und schickt dir deine **Steuernummer** per Post. Sie gehört auf jede Rechnung (siehe Artikel „Rechnungen“). Wer Umsatzsteuer ausweist, gibt je nach Höhe der Steuer monatlich oder vierteljährlich eine Umsatzsteuer-Voranmeldung ab.

## Typische nächste Schritte

- ELSTER-Konto anlegen, falls noch nicht vorhanden.
- Umsatz und Kosten für die ersten beiden Jahre realistisch schätzen – der Stundensatz-Rechner hilft dabei.
- Bei der Frage Kleinunternehmer ja oder nein: erst den Artikel „Kleinunternehmerregelung“ lesen.`,
    sources: [
      {
        title: "ELSTER: Fragebogen zur steuerlichen Erfassung für Einzelunternehmen",
        url: "https://www.elster.de/eportal/formulare-leistungen/alleformulare/fseeun",
      },
      {
        title: "ELSTER: Unternehmen gegründet oder selbständig gemacht?",
        url: "https://www.elster.de/elsterweb/infoseite/unternehmensgruendung",
      },
      {
        title: "§ 138 AO – Anzeigen über die Erwerbstätigkeit (gesetze-im-internet.de)",
        url: "https://www.gesetze-im-internet.de/ao_1977/__138.html",
      },
    ],
    lastVerified: VERIFIED,
    expertReviewed: false,
  },
  {
    id: "small-business-scheme",
    title: "Kleinunternehmerregelung",
    category: "Steuern und Rechnungen",
    summary:
      "Mit der Kleinunternehmerregelung berechnest du keine Umsatzsteuer. Seit 2025 gilt sie, wenn dein Umsatz im Vorjahr höchstens 25.000 € betrug und im laufenden Jahr 100.000 € nicht überschreitet. Im Gründungsjahr liegt die Grenze bei 25.000 €.",
    body: `## So funktioniert die Regelung

Als Kleinunternehmer (§ 19 Umsatzsteuergesetz) stellst du Rechnungen **ohne Umsatzsteuer** aus und gibst in der Regel keine Umsatzsteuer-Voranmeldungen ab. Dafür kannst du dir auch keine Vorsteuer vom Finanzamt erstatten lassen, zum Beispiel für einen neuen Laptop.

## Die Grenzen seit 2025

- **Vorjahr:** Gesamtumsatz höchstens **25.000 €**
- **Laufendes Jahr:** Gesamtumsatz höchstens **100.000 €**

Die Grenze im laufenden Jahr wirkt sofort: Wird sie überschritten, entfällt die Regelung schon für den Umsatz, mit dem sie überschritten wird, und für alle folgenden.

**Im Jahr der Gründung** gilt laut Bundesfinanzministerium für das laufende Jahr die Grenze von **25.000 €**, nicht 100.000 €. Sie wird nicht auf ein volles Jahr hochgerechnet.

Bis 2024 galten andere Grenzen – ältere Artikel im Internet sind hier oft veraltet.

## Für wen sie sich eignen kann

- **Eher passend:** Kunden sind Privatpersonen oder Organisationen, die sich die Umsatzsteuer nicht erstatten lassen können. Für sie ist dein Angebot ohne Umsatzsteuer günstiger.
- **Eher weniger wichtig:** Kunden sind Unternehmen. Sie können sich die Umsatzsteuer in der Regel vom Finanzamt zurückholen, für sie macht sie also keinen Preisunterschied.

## Auf die Regelung verzichten

Du kannst freiwillig auf die Kleinunternehmerregelung verzichten. Dieser Verzicht bindet dich aber **mindestens fünf Kalenderjahre**.

## Auf der Rechnung

Als Kleinunternehmer weist du keine Umsatzsteuer aus und gibst einen Hinweis auf die Steuerbefreiung an, zum Beispiel „Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.“ E-Rechnungen musst du nicht ausstellen, aber empfangen können.

## Typische nächste Schritte

- Schätze deinen Umsatz. Mit einem Stundensatz von 60 € sind 25.000 € schon nach gut 400 abgerechneten Stunden erreicht – im Gründungsjahr endet die Regelung dann.
- Kläre, ob deine Kunden eher Unternehmen oder Privatpersonen sind.
- Triff die Entscheidung im Fragebogen zur steuerlichen Erfassung, bei Unsicherheit mit einer Steuerberatung.`,
    sources: [
      {
        title: "§ 19 UStG – Besteuerung der Kleinunternehmer (gesetze-im-internet.de)",
        url: "https://www.gesetze-im-internet.de/ustg_1980/__19.html",
      },
      {
        title:
          "Bundesfinanzministerium: Schreiben zur Sonderregelung für Kleinunternehmer vom 18.03.2025 (PDF)",
        url: "https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Umsatzsteuer/Umsatzsteuer-Anwendungserlass/2025-03-18-sonderregelung-kleinunternehmer.pdf?__blob=publicationFile&v=3",
      },
      {
        title: "Bundesfinanzministerium: Fragen und Antworten zur E-Rechnung",
        url: "https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html",
      },
    ],
    lastVerified: VERIFIED,
    expertReviewed: false,
  },
  {
    id: "vat",
    title: "Umsatzsteuer",
    category: "Steuern und Rechnungen",
    summary:
      "Ohne Kleinunternehmerregelung schlägst du auf deine Preise in der Regel 19 % Umsatzsteuer auf, meldest sie regelmäßig ans Finanzamt und führst sie ab. Umsatzsteuer, die du selbst bezahlst, kannst du gegenrechnen.",
    body: `## Das Prinzip

Die Umsatzsteuer (auch Mehrwertsteuer) zahlt am Ende der Endverbraucher. Du als Unternehmer sammelst sie ein und gibst sie ans Finanzamt weiter:

1. Du stellst deinem Kunden deinen **Nettopreis plus Umsatzsteuer** in Rechnung.
2. Die Umsatzsteuer, die du selbst für berufliche Einkäufe zahlst (**Vorsteuer**), ziehst du davon ab.
3. Die Differenz zahlst du ans Finanzamt.

Der allgemeine Steuersatz beträgt **19 %**, für bestimmte Leistungen gibt es ermäßigte 7 %. IT-Dienstleistungen fallen in der Regel unter 19 %.

## Voranmeldung

Die Umsatzsteuer meldest du über ELSTER in einer **Umsatzsteuer-Voranmeldung**, je nach Höhe der Steuer monatlich oder vierteljährlich. Welcher Zeitraum für dich gilt, teilt dir das Finanzamt mit. Die Zahlung ist am **10. Tag nach Ablauf des Zeitraums** fällig. Nach Jahresende folgt die Umsatzsteuererklärung.

## Worauf du achten solltest

- **Rechne in Nettopreisen:** Dein Stundensatz aus dem Rechner ist ein Nettobetrag. Die Umsatzsteuer gehört nicht dir – lege sie bis zur Zahlung zur Seite.
- **Kunden im Ausland:** Bei Leistungen an Unternehmen im Ausland gelten oft besondere Regeln (zum Beispiel, dass der Kunde die Steuer schuldet). Das solltest du vorher klären.
- **Fristen einhalten:** Bei verspäteten Meldungen oder Zahlungen können Zuschläge anfallen.

## Typische nächste Schritte

- Entscheide, ob du die Kleinunternehmerregelung nutzen willst.
- Führe ein separates Konto oder eine Rücklage für die Umsatzsteuer.
- Trage die Termine für die Voranmeldungen in deinen Kalender ein.`,
    sources: [
      {
        title: "§ 12 UStG – Steuersätze (gesetze-im-internet.de)",
        url: "https://www.gesetze-im-internet.de/ustg_1980/__12.html",
      },
      {
        title: "§ 18 UStG – Besteuerungsverfahren (gesetze-im-internet.de)",
        url: "https://www.gesetze-im-internet.de/ustg_1980/__18.html",
      },
    ],
    lastVerified: VERIFIED,
    expertReviewed: false,
  },
  {
    id: "invoices",
    title: "Rechnungen und E-Rechnung",
    category: "Steuern und Rechnungen",
    summary:
      "Eine Rechnung muss bestimmte Pflichtangaben enthalten. Rechnungen an Unternehmen in Deutschland werden schrittweise zur E-Rechnung: Empfangen können musst du sie seit 2025, ausstellen je nach Umsatz ab 2027 oder 2028.",
    body: `## Pflichtangaben

Nach § 14 Umsatzsteuergesetz enthält eine Rechnung unter anderem:

- vollständigen Namen und Anschrift von dir und deinem Kunden
- deine Steuernummer oder Umsatzsteuer-Identifikationsnummer
- Rechnungsdatum und eine **fortlaufende, eindeutige Rechnungsnummer**
- Art und Umfang der Leistung
- den Zeitpunkt oder Zeitraum der Leistung
- den Nettobetrag, den Steuersatz und den Steuerbetrag – oder einen Hinweis auf die Steuerbefreiung, etwa als Kleinunternehmer

Rechnungen an Unternehmen musst du **innerhalb von sechs Monaten** nach der Leistung ausstellen. Ein Muster findest du bei den Vorlagen.

## E-Rechnung

Eine E-Rechnung ist eine Rechnung in einem **strukturierten elektronischen Format**, das Programme automatisch auslesen können, zum Beispiel XRechnung oder ZUGFeRD. Ein einfaches PDF ist **keine** E-Rechnung.

Für Rechnungen zwischen Unternehmen in Deutschland gilt:

- **Seit 1. Januar 2025** müssen alle Unternehmen E-Rechnungen **empfangen** können. Dafür reicht ein E-Mail-Postfach.
- **Bis Ende 2026** dürfen alle stattdessen noch Papier- oder (mit Zustimmung des Kunden) PDF-Rechnungen verschicken.
- **Bis Ende 2027** gilt das weiter, wenn dein Umsatz im Vorjahr höchstens 800.000 € betrug.
- **Danach** ist die E-Rechnung zwischen Unternehmen Pflicht.

**Ausgenommen** sind unter anderem Kleinunternehmer, Rechnungen bis 250 € (brutto) und Rechnungen an Privatpersonen.

## Aufbewahren

Rechnungen gehören zu deiner Buchhaltung und müssen mehrere Jahre aufbewahrt werden – E-Rechnungen im Originalformat.

## Typische nächste Schritte

- Lege ein Nummernsystem fest, zum Beispiel 2026-001.
- Prüfe, ob dein Buchhaltungs- oder Rechnungsprogramm E-Rechnungen erstellen und lesen kann.
- Bewahre alle Rechnungen geordnet auf.`,
    sources: [
      {
        title: "§ 14 UStG – Ausstellung von Rechnungen (gesetze-im-internet.de)",
        url: "https://www.gesetze-im-internet.de/ustg_1980/__14.html",
      },
      {
        title: "Bundesfinanzministerium: Fragen und Antworten zur E-Rechnung",
        url: "https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html",
      },
    ],
    lastVerified: VERIFIED,
    expertReviewed: false,
  },
  {
    id: "health-insurance",
    title: "Krankenversicherung",
    category: "Absicherung",
    summary:
      "Auch als Freelancer brauchst du eine Krankenversicherung – gesetzlich (meist freiwillig) oder privat. In der gesetzlichen Versicherung richtet sich der Beitrag nach deinem Einkommen, mindestens aber nach 1.318,33 € im Monat (2026).",
    body: `## Gesetzlich oder privat

In Deutschland gilt eine Pflicht zur Krankenversicherung. Selbstständige sind in der Regel **nicht automatisch** gesetzlich pflichtversichert, sondern

- **freiwillig gesetzlich versichert**, meist bei ihrer bisherigen Krankenkasse, oder
- **privat versichert**.

Der Wechsel in die private Versicherung ist oft schwer umkehrbar. Lass dich dazu unabhängig beraten, bevor du dich entscheidest.

## So berechnet sich der Beitrag (gesetzlich, 2026)

- **Krankenversicherung:** 14,6 % (mit Krankengeld) bzw. 14,0 % (ohne Krankengeld) plus Zusatzbeitrag deiner Kasse, durchschnittlich 2,9 %
- **Pflegeversicherung:** 3,6 %, für Kinderlose 0,6 % mehr
- **Mindestens** auf Einnahmen von **1.318,33 €** im Monat, höchstens auf 5.812,50 €

Als Selbstständiger zahlst du den Beitrag **allein**, einen Arbeitgeberanteil gibt es nicht. Beim Mindesteinkommen sind das mit dem durchschnittlichen Zusatzbeitrag zusammen **rund 270 bis 290 € im Monat**, je nach Krankengeld-Wahl und ob du Kinder hast.

## Vorläufig und endgültig

Die Krankenkasse setzt deinen Beitrag zunächst **vorläufig** fest – am Anfang nach deinem geschätzten Einkommen, später nach dem letzten Steuerbescheid. Liegt der Steuerbescheid für das Jahr vor, wird der Beitrag **endgültig** berechnet. Das kann zu Nachzahlungen oder Erstattungen führen.

Weist du dein Einkommen auf Anforderung nicht innerhalb von drei Jahren nach, setzt die Kasse den Höchstbeitrag an.

## Krankengeld

Mit dem ermäßigten Beitragssatz hast du keinen Anspruch auf Krankengeld. Überlege, wie du längere Krankheit überbrücken würdest: etwa über den allgemeinen Beitragssatz mit Krankengeld, einen Wahltarif deiner Kasse oder eine private Zusatzversicherung.

## Typische nächste Schritte

- Informiere deine Krankenkasse über den Start der Selbstständigkeit.
- Rechne den Beitrag in deinen Stundensatz ein (der Rechner hat dafür ein eigenes Feld).
- Lege Geld für mögliche Nachzahlungen zurück.`,
    sources: [
      {
        title: "Bundesgesundheitsministerium: Beiträge der gesetzlichen Krankenversicherung",
        url: "https://www.bundesgesundheitsministerium.de/beitraege",
      },
      {
        title: "GKV-Spitzenverband: Rechengrößen und Grenzwerte 2026 (PDF)",
        url: "https://www.gkv-spitzenverband.de/media/dokumente/presse/zahlen_und_grafiken/20260101_Faktenblatt_Rechengroessen_Beitragsrecht.pdf",
      },
      {
        title:
          "§ 240 SGB V – Beitragspflichtige Einnahmen freiwilliger Mitglieder (gesetze-im-internet.de)",
        url: "https://www.gesetze-im-internet.de/sgb_5/__240.html",
      },
    ],
    lastVerified: VERIFIED,
    expertReviewed: false,
  },
  {
    id: "retirement",
    title: "Altersvorsorge",
    category: "Absicherung",
    summary:
      "Die meisten Selbstständigen müssen nicht in die gesetzliche Rentenversicherung einzahlen – vorsorgen sollten sie trotzdem. Ausnahmen gibt es, etwa wenn du dauerhaft im Wesentlichen nur für einen Kunden arbeitest.",
    body: `## Keine allgemeine Pflicht – bisher

Für die meisten selbstständigen IT-Fachleute besteht derzeit **keine Pflicht** zur gesetzlichen Rentenversicherung. Wer nicht vorsorgt, hat im Alter aber oft nur eine sehr kleine Rente.

Die Rentenkommission der Bundesregierung hat 2026 empfohlen, neue Selbstständige künftig verpflichtend in die gesetzliche Rentenversicherung einzubeziehen. **Beschlossen ist das noch nicht** – verfolge die Entwicklung.

## Wann doch Rentenversicherungspflicht besteht

Nach § 2 SGB VI sind bestimmte Selbstständige pflichtversichert. Für IT-Freelancer wichtig:

- Wer **keine eigenen versicherungspflichtigen Angestellten** hat und **auf Dauer im Wesentlichen nur für einen Auftraggeber** arbeitet.
- Wer als **Lehrkraft oder Dozent** selbstständig tätig ist, zum Beispiel mit Schulungen, und keine versicherungspflichtigen Angestellten hat.

Der Beitragssatz beträgt 2026 **18,6 %**. Die Pflicht musst du selbst bei der Deutschen Rentenversicherung melden.

## Freiwillig vorsorgen

- **Gesetzliche Rentenversicherung freiwillig:** Du kannst freiwillige Beiträge zahlen oder innerhalb von **fünf Jahren** nach dem Start die Pflichtversicherung beantragen.
- **Geförderte private Vorsorge:** Ab dem **1. Januar 2027** können auch Selbstständige die staatlich geförderte private Altersvorsorge nutzen (Reform der privaten Altersvorsorge 2026).
- **Weitere Wege:** zum Beispiel die Basisrente oder eigene Geldanlagen. Welcher Weg passt, hängt von deiner Situation ab – eine unabhängige Beratung hilft.

## Typische nächste Schritte

- Prüfe, ob du absehbar überwiegend für einen Kunden arbeiten wirst.
- Plane einen festen Betrag für die Altersvorsorge ein (der Stundensatz-Rechner hat dafür ein Feld).
- Lass dir von der Deutschen Rentenversicherung deine bisherigen Ansprüche zeigen.`,
    sources: [
      {
        title: "§ 2 SGB VI – Versicherungspflicht selbständig Tätiger (gesetze-im-internet.de)",
        url: "https://www.gesetze-im-internet.de/sgb_6/__2.html",
      },
      {
        title: "§ 4 SGB VI – Versicherungspflicht auf Antrag (gesetze-im-internet.de)",
        url: "https://www.gesetze-im-internet.de/sgb_6/__4.html",
      },
      {
        title: "Bundesregierung: Fragen und Antworten zur Reform der privaten Altersvorsorge",
        url: "https://www.bundesregierung.de/breg-de/aktuelles/reform-private-altersvorsorge-2400072",
      },
      {
        title: "Bundesministerium für Arbeit und Soziales: Rentenkommission 2026",
        url: "https://www.bmas.de/DE/Soziales/Rente-und-Altersvorsorge/Rentenreform-2025/Rentenkommission-2026/rentenkommission-2026.html",
      },
    ],
    lastVerified: VERIFIED,
    expertReviewed: false,
  },
  {
    id: "false-self-employment",
    title: "Scheinselbstständigkeit",
    category: "Anmeldung und Status",
    summary:
      "Arbeitest du wie ein Angestellter – nach Weisungen und eingebunden in die Organisation des Kunden –, kann rechtlich eine Beschäftigung vorliegen. Dann drohen vor allem dem Auftraggeber Nachzahlungen. Klarheit schafft das Statusfeststellungsverfahren.",
    body: `## Worum es geht

Entscheidend ist nicht, wie ein Vertrag heißt, sondern wie die Zusammenarbeit **tatsächlich** aussieht. Nach § 7 SGB IV sind Anhaltspunkte für eine abhängige Beschäftigung:

- eine Tätigkeit **nach Weisungen** (was, wann, wo, wie),
- die **Eingliederung in die Arbeitsorganisation** des Auftraggebers.

Stellt sich später heraus, dass eine Beschäftigung vorlag, müssen Sozialversicherungsbeiträge nachgezahlt werden – oft für mehrere Jahre. Deshalb achten viele Unternehmen genau darauf.

## Typische Warnzeichen

- feste Arbeitszeiten und Anwesenheitspflicht wie bei Angestellten
- Einbindung in Teamstrukturen, Urlaubsplanung oder Dienstpläne des Kunden
- keine eigene Entscheidung, wie du die Aufgabe löst
- Abrechnung nur nach Zeit, ohne eigenes unternehmerisches Risiko
- dauerhaft nur ein Auftraggeber

Einzelne Punkte entscheiden nicht allein. Es kommt auf das **Gesamtbild** an.

## Was für Selbstständigkeit spricht

- du arbeitest für mehrere Kunden
- du entscheidest selbst über Arbeitszeit, Ort und Vorgehen
- du lieferst ein vereinbartes Ergebnis
- du trittst am Markt auf, etwa mit Website, Portfolio und eigenen Angeboten

## Statusfeststellungsverfahren

Bei der **Clearingstelle der Deutschen Rentenversicherung** können du oder dein Auftraggeber verbindlich klären lassen, ob du selbstständig oder beschäftigt bist. Das Verfahren dauert laut Rentenversicherung durchschnittlich drei Monate. Mit einer **Prognoseentscheidung** ist das auch schon vor Beginn eines Auftrags möglich, wenn der Vertrag bereits schriftlich vorliegt.

Unabhängig davon: Arbeitest du auf Dauer im Wesentlichen nur für einen Auftraggeber, kann eine eigene Rentenversicherungspflicht bestehen (siehe Artikel „Altersvorsorge“).

## Typische nächste Schritte

- Achte bei Verträgen darauf, dass Ergebnis, Freiheit bei der Umsetzung und eigene Arbeitsmittel klar beschrieben sind.
- Baue mehrere Kunden auf, statt dauerhaft von einem abzuhängen.
- Bei langen Einsätzen bei einem Kunden: Statusfeststellung erwägen.`,
    sources: [
      {
        title: "§ 7 SGB IV – Beschäftigung (gesetze-im-internet.de)",
        url: "https://www.gesetze-im-internet.de/sgb_4/__7.html",
      },
      {
        title: "Deutsche Rentenversicherung: Das Statusfeststellungsverfahren",
        url: "https://www.deutsche-rentenversicherung.de/DRV/DE/Rente/Arbeitnehmer-und-Selbststaendige/03_Selbststaendige/statusfeststellungsverfahren.html",
      },
      {
        title: "Deutsche Rentenversicherung: Clearingstelle",
        url: "https://www.deutsche-rentenversicherung.de/DRV/DE/Rente/Arbeitnehmer-und-Selbststaendige/03_Selbststaendige/clearingstelle-drv-bund.html",
      },
    ],
    lastVerified: VERIFIED,
    expertReviewed: false,
  },
] satisfies LegalArticleInput[];
