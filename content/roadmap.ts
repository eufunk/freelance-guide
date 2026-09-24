import type { StageInput } from "@/lib/content/schema";

// The freelancer roadmap. Stages and tasks appear in the order of this file.
//
// DRAFT: The texts are a first draft (Phase 2) and still need a content review.
// Legal and tax details belong in the legal articles (Phase 10), not here.
//
// Never rename or reuse an ID once deployed: user progress refers to it.
export const roadmap = [
  {
    id: "define-skills",
    title: "Skills definieren",
    shortExplanation:
      "Verschaffe dir einen ehrlichen Überblick darüber, was du fachlich kannst und worin du besonders stark bist.",
    whyItMatters:
      "Kunden kaufen konkrete Fähigkeiten. Wer seine Stärken kennt, kann sie klar benennen und selbstbewusst verkaufen.",
    tasks: [
      {
        id: "list-skills",
        title: "Deine Skills auflisten",
        description:
          "Schreibe alle Technologien, Methoden und Themen auf, mit denen du schon gearbeitet hast – beruflich, im Studium oder in eigenen Projekten.",
        estimatedMinutes: 30,
      },
      {
        id: "rate-skills",
        title: "Skills nach Erfahrung bewerten",
        description:
          "Markiere für jeden Skill, ob du ihn nur kennst, sicher anwendest oder andere darin beraten könntest. Für Aufträge zählen die letzten beiden Stufen.",
        estimatedMinutes: 20,
      },
      {
        id: "pick-core-skills",
        title: "Deine 2–3 Kernskills auswählen",
        description:
          "Wähle die Skills aus, in denen du am stärksten bist und die dir Spaß machen. Auf sie baust du dein Angebot auf.",
        estimatedMinutes: 15,
      },
    ],
  },
  {
    id: "choose-service",
    title: "Dienstleistung festlegen",
    shortExplanation:
      "Mach aus deinen Skills ein konkretes Angebot, das ein Kunde verstehen und buchen kann.",
    whyItMatters:
      "„Ich kann Webentwicklung“ ist schwer zu kaufen. „Ich baue Onlineshops mit Shopify“ ist ein klares Angebot, nach dem Kunden suchen.",
    tasks: [
      {
        id: "brainstorm-services",
        title: "Mögliche Dienstleistungen sammeln",
        description:
          "Überlege, welche Probleme du mit deinen Kernskills für andere lösen kannst. Sammle mindestens drei Ideen.",
        estimatedMinutes: 30,
      },
      {
        id: "check-demand",
        title: "Nachfrage prüfen",
        description:
          "Suche auf Freelancer-Plattformen und in Jobbörsen nach deinen Ideen. Gibt es Projekte oder Stellen dazu? Notiere, was häufig gesucht wird.",
        estimatedMinutes: 45,
      },
      {
        id: "write-service-statement",
        title: "Dein Angebot in einem Satz formulieren",
        description:
          "Formuliere: „Ich helfe [Zielgruppe] dabei, [Ergebnis] zu erreichen, indem ich [Leistung].“ Diesen Satz nutzt du später für Profil und Anschreiben.",
        estimatedMinutes: 20,
      },
    ],
  },
  {
    id: "define-target-customer",
    title: "Zielkunden bestimmen",
    shortExplanation: "Lege fest, für wen dein Angebot gedacht ist.",
    whyItMatters:
      "Wer alle ansprechen will, erreicht niemanden. Mit einer klaren Zielgruppe findest du Kunden schneller und kannst sie gezielter überzeugen.",
    tasks: [
      {
        id: "describe-ideal-customer",
        title: "Deinen idealen Kunden beschreiben",
        description:
          "Branche, Unternehmensgröße, Ansprechperson: Beschreibe, für wen du am liebsten arbeiten würdest und wem dein Angebot am meisten nützt.",
        estimatedMinutes: 30,
      },
      {
        id: "list-customer-problems",
        title: "Probleme deiner Zielkunden sammeln",
        description:
          "Notiere die drei häufigsten Probleme, die deine Zielkunden haben und die du lösen kannst. Sie sind später der Aufhänger für deine Ansprache.",
        estimatedMinutes: 30,
      },
      {
        id: "find-customer-places",
        title: "Herausfinden, wo deine Zielkunden zu finden sind",
        description:
          "Wo suchen deine Zielkunden nach Freelancern? Zum Beispiel auf Plattformen, bei LinkedIn, in Netzwerken oder über Empfehlungen.",
        estimatedMinutes: 20,
      },
    ],
  },
  {
    id: "build-portfolio",
    title: "Portfolio aufbauen",
    shortExplanation: "Zeige mit konkreten Beispielen, was du kannst.",
    whyItMatters:
      "Ohne Referenzen müssen Kunden dir blind vertrauen. Ein Portfolio macht deine Arbeit sichtbar und senkt das Risiko für sie.",
    tasks: [
      {
        id: "select-projects",
        title: "2–3 passende Projekte auswählen",
        description:
          "Wähle Projekte, die zu deinem Angebot passen – aus dem Job, dem Studium oder eigene Projekte. Kläre bei Arbeitsprojekten vorher, was du zeigen darfst.",
        estimatedMinutes: 30,
      },
      {
        id: "write-case-studies",
        title: "Projekte als Fallbeispiele beschreiben",
        description:
          "Beschreibe für jedes Projekt kurz: Ausgangslage, deine Rolle, dein Vorgehen und das Ergebnis. Zahlen und Screenshots helfen.",
        estimatedMinutes: 90,
      },
      {
        id: "create-sample-project",
        title: "Fehlende Beispiele mit einem eigenen Projekt ergänzen",
        description:
          "Hast du noch keine passenden Projekte? Baue ein kleines Beispielprojekt, das genau dein Angebot zeigt.",
        estimatedMinutes: 480,
      },
      {
        id: "publish-portfolio",
        title: "Portfolio veröffentlichen",
        description:
          "Stelle deine Fallbeispiele online, zum Beispiel auf einer eigenen Website, bei GitHub oder in deinem Plattform-Profil.",
        estimatedMinutes: 120,
      },
    ],
  },
  {
    id: "define-pricing",
    title: "Preise festlegen",
    shortExplanation: "Berechne, was du verlangen musst, und lege deine Preise fest.",
    whyItMatters:
      "Zu niedrige Preise sind der häufigste Fehler am Anfang. Dein Stundensatz muss Steuern, Versicherungen, Urlaub und Leerlaufzeiten mittragen.",
    relatedToolIds: ["hourly-rate", "project-price"],
    tasks: [
      {
        id: "calculate-hourly-rate",
        title: "Deinen Mindest-Stundensatz berechnen",
        description:
          "Berechne mit dem Stundensatz-Rechner, welchen Satz du brauchst, um von deiner Arbeit leben zu können.",
        estimatedMinutes: 20,
      },
      {
        id: "research-market-rates",
        title: "Marktübliche Preise recherchieren",
        description:
          "Recherchiere, was Freelancer mit ähnlichen Skills verlangen, zum Beispiel über Plattformen, Umfragen und Gespräche in der Freelance-Community.",
        estimatedMinutes: 45,
      },
      {
        id: "set-rate",
        title: "Deinen Stundensatz festlegen",
        description:
          "Lege deinen Stundensatz fest. Er sollte nicht unter deinem Mindest-Stundensatz liegen. Überlege außerdem, ob du Pakete zu Festpreisen anbietest.",
        estimatedMinutes: 20,
      },
    ],
  },
  {
    id: "prepare-profile",
    title: "Freelancer-Profil erstellen",
    shortExplanation: "Erstelle ein Profil, das dein Angebot auf einen Blick zeigt.",
    whyItMatters:
      "Dein Profil ist oft der erste Eindruck. Es entscheidet, ob ein Kunde dich kontaktiert oder weiterklickt.",
    tasks: [
      {
        id: "write-profile-text",
        title: "Profiltext schreiben",
        description:
          "Schreibe einen kurzen Text mit deinem Angebot, deinen Kernskills, deiner Erfahrung und einem Hinweis, wie man dich erreicht.",
        estimatedMinutes: 60,
      },
      {
        id: "update-linkedin",
        title: "LinkedIn-Profil anpassen",
        description:
          "Passe Überschrift, Info-Text und Erfahrung an dein Freelance-Angebot an und zeige, dass du für Projekte verfügbar bist.",
        estimatedMinutes: 45,
      },
      {
        id: "create-platform-profile",
        title: "Profil auf einer Freelancer-Plattform anlegen",
        description:
          "Lege ein Profil auf einer Plattform an, auf der deine Zielkunden suchen, und verlinke dort dein Portfolio.",
        estimatedMinutes: 60,
      },
    ],
  },
  {
    id: "business-basics",
    title: "Geschäftliche Grundlagen schaffen",
    shortExplanation: "Kläre die formalen Schritte, die du vor dem ersten Auftrag brauchst.",
    whyItMatters:
      "Wer die Anmeldung und Absicherung von Anfang an richtig macht, vermeidet Nachzahlungen und Ärger mit Behörden.",
    relatedToolIds: ["readiness-checklist"],
    tasks: [
      {
        id: "clarify-business-type",
        title: "Klären, ob du freiberuflich oder gewerblich tätig bist",
        description:
          "Davon hängt ab, ob du ein Gewerbe anmelden musst. Viele IT-Tätigkeiten können freiberuflich sein, aber nicht alle. Im Zweifel hilft das Finanzamt oder eine Steuerberatung.",
        estimatedMinutes: 30,
      },
      {
        id: "register-tax-office",
        title: "Beim Finanzamt anmelden",
        description:
          "Fülle den Fragebogen zur steuerlichen Erfassung über ELSTER aus. Dort entscheidest du auch, ob du die Kleinunternehmerregelung nutzt.",
        estimatedMinutes: 90,
      },
      {
        id: "clarify-insurance",
        title: "Krankenversicherung und Altersvorsorge klären",
        description:
          "Kläre mit deiner Krankenkasse, wie du dich in der Selbstständigkeit versicherst und was es kostet. Plane auch, wie du fürs Alter vorsorgst.",
        estimatedMinutes: 60,
      },
      {
        id: "get-contract-template",
        title: "Vertragsvorlage besorgen",
        description:
          "Besorge eine Vorlage für Projektverträge aus einer verlässlichen Quelle, zum Beispiel von einem Berufsverband oder einer Anwaltskanzlei.",
        estimatedMinutes: 45,
      },
      {
        id: "prepare-invoice-template",
        title: "Rechnungsvorlage vorbereiten",
        description:
          "Bereite eine Rechnungsvorlage mit allen Pflichtangaben vor, damit du beim ersten Auftrag direkt abrechnen kannst.",
        estimatedMinutes: 45,
      },
    ],
  },
  {
    id: "find-clients",
    title: "Potenzielle Kunden finden",
    shortExplanation: "Erstelle eine Liste von Unternehmen und Personen, die du ansprechen willst.",
    whyItMatters:
      "Aufträge kommen selten von allein. Eine Liste konkreter Kontakte macht die Kundensuche planbar.",
    tasks: [
      {
        id: "check-network",
        title: "Dein persönliches Netzwerk durchgehen",
        description:
          "Menschen aus früheren Jobs, dem Studium und deinem Bekanntenkreis: Wer könnte selbst Bedarf haben oder dich weiterempfehlen?",
        estimatedMinutes: 45,
      },
      {
        id: "build-lead-list",
        title: "Eine Liste mit 20 potenziellen Kunden anlegen",
        description:
          "Sammle 20 Unternehmen oder Personen, die zu deinem Zielkunden passen, mit Ansprechperson und Kontaktweg.",
        estimatedMinutes: 120,
      },
      {
        id: "search-project-platforms",
        title: "Passende Projektausschreibungen suchen",
        description:
          "Suche auf Freelancer-Plattformen nach aktuellen Projekten, die zu deinem Angebot passen, und merke dir die vielversprechendsten.",
        estimatedMinutes: 45,
      },
    ],
  },
  {
    id: "contact-clients",
    title: "Potenzielle Kunden ansprechen",
    shortExplanation: "Nimm Kontakt zu den Kunden auf deiner Liste auf.",
    whyItMatters:
      "Die meisten ersten Aufträge entstehen durch direkte Ansprache. Wer regelmäßig Kontakt aufnimmt, bekommt früher Gespräche.",
    tasks: [
      {
        id: "write-outreach-message",
        title: "Eine persönliche Anfrage formulieren",
        description:
          "Schreibe eine kurze Nachricht, die ein konkretes Problem des Kunden anspricht und zeigt, wie du helfen kannst. Keine Massenmail.",
        estimatedMinutes: 45,
      },
      {
        id: "contact-first-leads",
        title: "Die ersten 10 Kontakte anschreiben",
        description:
          "Schreibe die ersten 10 Kontakte von deiner Liste an und passe die Nachricht jeweils an die Person an.",
        estimatedMinutes: 120,
      },
      {
        id: "follow-up",
        title: "Nachfassen",
        description:
          "Hast du nach etwa einer Woche keine Antwort, schicke eine freundliche, kurze Erinnerung. Viele Antworten kommen erst darauf.",
        estimatedMinutes: 30,
      },
    ],
  },
  {
    id: "create-offer",
    title: "Angebot erstellen",
    shortExplanation: "Mach aus einem Kundengespräch ein schriftliches Angebot.",
    whyItMatters:
      "Ein klares Angebot schafft Vertrauen und verhindert Missverständnisse über Umfang, Preis und Termine.",
    relatedToolIds: ["project-price"],
    tasks: [
      {
        id: "clarify-requirements",
        title: "Anforderungen im Gespräch klären",
        description:
          "Frage nach Ziel, Umfang, Zeitrahmen und Budget. Halte fest, was genau geliefert werden soll und was nicht dazugehört.",
        estimatedMinutes: 60,
      },
      {
        id: "estimate-effort",
        title: "Aufwand schätzen",
        description:
          "Zerlege das Projekt in Arbeitsschritte, schätze den Aufwand pro Schritt und berechne den Preis mit dem Projektpreis-Rechner – inklusive Puffer.",
        estimatedMinutes: 60,
      },
      {
        id: "send-offer",
        title: "Angebot schreiben und senden",
        description:
          "Fasse Leistung, Preis, Zeitplan und Zahlungsbedingungen in einem Angebot zusammen und schicke es innerhalb weniger Tage nach dem Gespräch.",
        estimatedMinutes: 90,
      },
    ],
  },
  {
    id: "close-project",
    title: "Ersten Auftrag abschließen",
    shortExplanation: "Mach aus dem Angebot einen verbindlichen Auftrag.",
    whyItMatters:
      "Erst mit einer klaren Vereinbarung ist der Auftrag sicher. Sie schützt dich und deinen Kunden.",
    tasks: [
      {
        id: "handle-feedback",
        title: "Rückfragen zum Angebot beantworten",
        description:
          "Beantworte Fragen zügig. Wenn der Kunde verhandeln will, reduziere lieber den Umfang als deinen Preis.",
        estimatedMinutes: 30,
      },
      {
        id: "sign-contract",
        title: "Vertrag oder schriftliche Beauftragung einholen",
        description:
          "Lass dir den Auftrag schriftlich bestätigen – mit Vertrag oder zumindest einer Bestätigung des Angebots per E-Mail.",
        estimatedMinutes: 30,
      },
      {
        id: "plan-kickoff",
        title: "Projektstart vereinbaren",
        description:
          "Vereinbare Starttermin, Ansprechpersonen und Kommunikationsweg und kläre, welche Zugänge und Informationen du brauchst.",
        estimatedMinutes: 30,
      },
    ],
  },
  {
    id: "deliver-project",
    title: "Projekt umsetzen",
    shortExplanation: "Liefere, was vereinbart ist, und halte deinen Kunden auf dem Laufenden.",
    whyItMatters: "Zufriedene Kunden sind die beste Quelle für Folgeaufträge und Empfehlungen.",
    tasks: [
      {
        id: "plan-milestones",
        title: "Meilensteine planen",
        description:
          "Teile das Projekt in Etappen mit Terminen auf und stimme sie mit dem Kunden ab.",
        estimatedMinutes: 45,
      },
      {
        id: "send-status-updates",
        title: "Regelmäßig Zwischenstände teilen",
        description:
          "Informiere deinen Kunden in festen Abständen über den Fortschritt. Sprich Probleme früh an.",
        estimatedMinutes: 30,
      },
      {
        id: "handle-change-requests",
        title: "Änderungswünsche sauber klären",
        description:
          "Wünscht der Kunde mehr als vereinbart, kläre Aufwand und Preis schriftlich, bevor du loslegst.",
        estimatedMinutes: 30,
      },
      {
        id: "hand-over",
        title: "Ergebnis übergeben und abnehmen lassen",
        description:
          "Übergib das Ergebnis mit einer kurzen Dokumentation und lass dir die Abnahme bestätigen.",
        estimatedMinutes: 60,
      },
    ],
  },
  {
    id: "invoice-client",
    title: "Rechnung stellen",
    shortExplanation: "Rechne deine Arbeit korrekt und pünktlich ab.",
    whyItMatters:
      "Nur eine korrekte Rechnung wird bezahlt – und sie ist die Grundlage für deine Buchhaltung und Steuererklärung.",
    tasks: [
      {
        id: "create-invoice",
        title: "Rechnung erstellen",
        description:
          "Erstelle die Rechnung mit deiner Vorlage und prüfe alle Pflichtangaben, bevor du sie verschickst.",
        estimatedMinutes: 30,
      },
      {
        id: "track-payment",
        title: "Zahlungseingang prüfen",
        description:
          "Prüfe, ob die Zahlung bis zum Zahlungsziel eingegangen ist. Falls nicht, erinnere freundlich per E-Mail.",
        estimatedMinutes: 15,
      },
      {
        id: "file-documents",
        title: "Belege ablegen",
        description:
          "Lege Rechnung und Zahlungsnachweis geordnet ab. Aufbewahrungsfristen gelten auch für Freelancer.",
        estimatedMinutes: 15,
      },
    ],
  },
  {
    id: "collect-testimonial",
    title: "Referenz einholen",
    shortExplanation: "Bitte deinen Kunden um eine Empfehlung.",
    whyItMatters: "Eine echte Kundenstimme überzeugt neue Kunden mehr als jede Selbstbeschreibung.",
    tasks: [
      {
        id: "ask-for-testimonial",
        title: "Um eine Referenz bitten",
        description:
          "Bitte deinen Kunden kurz nach Projektende um zwei, drei Sätze zur Zusammenarbeit. Frage auch, ob du Namen und Firma nennen darfst.",
        estimatedMinutes: 15,
      },
      {
        id: "publish-testimonial",
        title: "Referenz veröffentlichen",
        description:
          "Füge die Referenz in dein Portfolio und deine Profile ein und nimm das Projekt als neues Fallbeispiel auf.",
        estimatedMinutes: 30,
      },
    ],
  },
  {
    id: "improve-repeat",
    title: "Verbessern und wiederholen",
    shortExplanation: "Lerne aus deinem ersten Projekt und gewinne die nächsten Kunden.",
    whyItMatters:
      "Nach dem ersten Auftrag beginnt die eigentliche Arbeit: aus Erfahrungen lernen und dauerhaft genug Aufträge haben.",
    tasks: [
      {
        id: "project-retrospective",
        title: "Projekt auswerten",
        description:
          "Was lief gut, was nicht? Stimmten Schätzung und Preis? Notiere, was du beim nächsten Projekt anders machst.",
        estimatedMinutes: 30,
      },
      {
        id: "review-pricing",
        title: "Preise überprüfen",
        description:
          "Prüfe mit deinen neuen Erfahrungen, ob dein Stundensatz passt, und passe ihn für neue Kunden an.",
        estimatedMinutes: 20,
      },
      {
        id: "plan-acquisition-routine",
        title: "Eine feste Akquise-Routine planen",
        description:
          "Plane feste Zeiten pro Woche für die Kundensuche ein – auch wenn du gerade gut ausgelastet bist.",
        estimatedMinutes: 20,
      },
    ],
  },
] satisfies StageInput[];
