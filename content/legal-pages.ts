// Texts for the imprint (Impressum) and the privacy policy (Datenschutzerklärung).
//
// Placeholders are written as [[PLATZHALTER: ...]]. They are highlighted on the
// page, and content/release.test.ts fails a build for a public site URL while
// any placeholder is left or the privacy policy is still a draft.

/** Operator of the site. Shown in the imprint and as controller in the privacy policy. */
export const siteOperator = {
  name: "[[PLATZHALTER: Vor- und Nachname]]",
  street: "[[PLATZHALTER: Straße und Hausnummer]]",
  postalCodeAndCity: "[[PLATZHALTER: PLZ und Ort]]",
  email: "[[PLATZHALTER: E-Mail-Adresse]]",
};

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  /** Renders the site operator's address block. */
  showOperator?: boolean;
};

export const privacyPolicy = {
  /**
   * DRAFT written by Claude from what the app actually processes (Phase 4).
   * Must be reviewed – by an expert or against a privacy policy generator –
   * and completed before the site goes live. Then set to false.
   */
  draft: true,
  lastUpdated: "2026-09-24",
  sections: [
    {
      heading: "Überblick",
      paragraphs: [
        "Diese Datenschutzerklärung informiert dich darüber, welche personenbezogenen Daten der Freelance Guide verarbeitet, wofür und auf welcher Rechtsgrundlage.",
      ],
    },
    {
      heading: "Verantwortlicher",
      paragraphs: ["Verantwortlich für die Datenverarbeitung ist:"],
      showOperator: true,
    },
    {
      heading: "Welche Daten wir verarbeiten",
      list: [
        "Kontodaten: deine E-Mail-Adresse und dein Passwort. Das Passwort speichern wir nur verschlüsselt (als Hash), niemand kann es im Klartext lesen.",
        "Angaben aus dem Onboarding: Name, Land, Erfahrung, Skills, ob du ein Portfolio oder Freelance-Erfahrung hast, dein Ziel, deine verfügbaren Stunden pro Woche und dein gewünschter Starttermin.",
        "Dein Fortschritt: welche Aufgaben du begonnen oder erledigt hast und wann.",
        "Rechner-Ergebnisse: die Eingaben und das Ergebnis deiner letzten Berechnung, wenn du sie speicherst.",
        "Technische Daten: Beim Aufruf der Seiten verarbeitet der Hosting-Anbieter technisch notwendige Daten wie IP-Adresse, Zeitpunkt und aufgerufene Adresse (Server-Logfiles).",
      ],
    },
    {
      heading: "Zwecke und Rechtsgrundlagen",
      list: [
        "Dein Konto und die Funktionen des Guides (Fortschritt speichern, persönlicher Startpunkt, Empfehlungen): Art. 6 Abs. 1 lit. b DSGVO, weil wir die Daten für die Nutzung des Guides brauchen.",
        "E-Mails zur Bestätigung deiner Adresse und zum Zurücksetzen deines Passworts: Art. 6 Abs. 1 lit. b DSGVO.",
        "Sicherer und stabiler Betrieb (Server-Logfiles, Schutz vor Missbrauch): Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse ist ein sicherer Betrieb der Website.",
      ],
      paragraphs: [
        "Wir verwenden deine Daten nicht für Werbung und geben sie nicht zu Werbezwecken an Dritte weiter.",
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "Wir setzen nur Cookies, die für die Anmeldung technisch notwendig sind. Sie speichern, dass du angemeldet bist. Rechtsgrundlage ist § 25 Abs. 2 Nr. 2 TDDDG; dafür ist keine Einwilligung nötig. Wir verwenden keine Tracking- oder Werbe-Cookies.",
      ],
    },
    {
      heading: "Dienstleister",
      paragraphs: [
        "Für den Betrieb setzen wir Dienstleister ein, die deine Daten in unserem Auftrag und nach unseren Weisungen verarbeiten (Auftragsverarbeitung nach Art. 28 DSGVO):",
      ],
      list: [
        "Supabase Inc. (USA) für Datenbank und Anmeldung. Die Daten werden in einem Rechenzentrum in Frankfurt am Main gespeichert. Mit Supabase besteht ein Vertrag zur Auftragsverarbeitung. Weil Supabase ein US-Unternehmen ist, ist ein Zugriff aus den USA nicht ausgeschlossen; die Übermittlung ist durch Standardvertragsklauseln der EU-Kommission abgesichert. [[PLATZHALTER: vor dem Livegang prüfen, ob Supabase unter dem EU-US Data Privacy Framework zertifiziert ist, und ggf. ergänzen]]",
        "[[PLATZHALTER: Hosting-Anbieter mit Sitz und Serverstandort]]",
        "[[PLATZHALTER: Dienst für den Versand der Bestätigungs-E-Mails mit Sitz]]",
      ],
    },
    {
      heading: "Schriftarten",
      paragraphs: [
        "Die Schriftarten liegen auf unserem eigenen Server. Beim Aufruf der Seiten wird keine Verbindung zu Google oder anderen Schriftarten-Anbietern hergestellt.",
      ],
    },
    {
      heading: "Wie lange wir deine Daten speichern",
      paragraphs: [
        "Wir speichern deine Daten, solange dein Konto besteht. Du kannst dein Konto jederzeit unter „Profil“ löschen. Dabei werden alle deine Daten gelöscht; aus Sicherungskopien werden sie nach spätestens [[PLATZHALTER: Anzahl]] Tagen entfernt.",
        "Server-Logfiles werden nach [[PLATZHALTER: Anzahl]] Tagen gelöscht.",
      ],
    },
    {
      heading: "Deine Rechte",
      paragraphs: [
        "Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Schreib uns dazu an die oben genannte E-Mail-Adresse.",
        "Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO), zum Beispiel bei der Behörde deines Bundeslandes.",
      ],
    },
    {
      heading: "Pflichtangaben und automatisierte Entscheidungen",
      paragraphs: [
        "Für ein Konto brauchen wir deine E-Mail-Adresse und ein Passwort. Die Angaben im Onboarding helfen dem Guide, dir einen passenden Startpunkt zu empfehlen.",
        "Diese Empfehlungen werden aus deinen Angaben berechnet, haben aber keine rechtliche Wirkung für dich. Eine automatisierte Entscheidung im Sinne von Art. 22 DSGVO findet nicht statt.",
      ],
    },
  ] satisfies LegalSection[],
};

export const imprint = {
  sections: [
    {
      heading: "Angaben gemäß § 5 DDG",
      showOperator: true,
    },
    {
      heading: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
      showOperator: true,
    },
    {
      heading: "Hinweis zu den Inhalten",
      paragraphs: [
        "Die Informationen im Freelance Guide, insbesondere zu Steuern, Versicherungen und Recht, sind allgemeine Informationen. Sie ersetzen keine individuelle Rechts- oder Steuerberatung.",
      ],
    },
  ] satisfies LegalSection[],
};
