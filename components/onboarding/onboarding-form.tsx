"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";

import { FormField } from "@/components/auth/form-field";
import { RadioCards } from "@/components/onboarding/radio-cards";
import { Button } from "@/components/ui/button";
import type { OnboardingRules } from "@/lib/content/schema";
import { goals } from "@/lib/content/schema";
import { saveOnboarding } from "@/lib/onboarding/actions";
import { initialOnboardingFormState } from "@/lib/onboarding/form-state";
import {
  countries,
  countryLabels,
  firstStepWithError,
  goalLabels,
  onboardingSteps,
  validateStep,
  type OnboardingField,
  type OnboardingInput,
} from "@/lib/onboarding/schema";
import { proposeDoneStages } from "@/lib/onboarding/starting-point";
import { currentStage } from "@/lib/progress/roadmap-progress";

export type OnboardingStage = { id: string; title: string; order: number; tasks: { id: string }[] };

type OnboardingFormProps = {
  initialValues: OnboardingInput;
  stages: OnboardingStage[];
  rules: OnboardingRules;
  /** Tasks the user completed themselves; they count for the starting point. */
  userCompletedTaskIds: string[];
  skillSuggestions: string[];
  submitLabel: string;
};

type Errors = Partial<Record<OnboardingField, string[]>>;

const yesNoOptions = [
  { value: "yes", label: "Ja" },
  { value: "no", label: "Nein" },
];

const LAST_STEP = onboardingSteps.length - 1;

export function OnboardingForm({
  initialValues,
  stages,
  rules,
  userCompletedTaskIds,
  skillSuggestions,
  submitLabel,
}: OnboardingFormProps) {
  const [state, action, pending] = useActionState(saveOnboarding, initialOnboardingFormState);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStepRef = useRef(step);

  const proposedStageIds = useMemo(
    () =>
      values.goal
        ? proposeDoneStages(
            {
              goal: values.goal,
              hasPortfolio: values.hasPortfolio === "yes",
              hasFreelanceExperience: values.hasFreelanceExperience === "yes",
            },
            rules,
            stages,
          )
        : [],
    [values.goal, values.hasPortfolio, values.hasFreelanceExperience, rules, stages],
  );

  // Server-side errors: when a new result arrives, show its errors on the first
  // step that has one (state adjusted during render, as React recommends).
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.status === "error") {
      setErrors(state.fieldErrors as Errors);
      setStep(firstStepWithError(Object.keys(state.fieldErrors)));
    }
  }

  // Move focus to the step heading when the step changes, for keyboard and screen reader users.
  useEffect(() => {
    if (previousStepRef.current !== step) headingRef.current?.focus();
    previousStepRef.current = step;
  }, [step]);

  function set<K extends OnboardingField>(field: K, value: OnboardingInput[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function goTo(nextStep: number) {
    // Entering the summary: propose all suggested stages as done.
    if (nextStep === LAST_STEP) set("confirmedStageIds", proposedStageIds);
    setStep(nextStep);
  }

  function next() {
    const stepErrors = validateStep(step, values);
    if (stepErrors) {
      setErrors(stepErrors);
      return;
    }
    goTo(step + 1);
  }

  const completedTaskIds = new Set(userCompletedTaskIds);
  for (const stage of stages) {
    if (values.confirmedStageIds.includes(stage.id)) {
      for (const task of stage.tasks) completedTaskIds.add(task.id);
    }
  }
  const start = currentStage(stages, completedTaskIds);
  const currentStep = onboardingSteps[step];

  return (
    <form
      action={action}
      noValidate
      onSubmit={(event) => {
        // Enter in a field goes to the next step; only the last step submits.
        if (step < LAST_STEP) {
          event.preventDefault();
          next();
        }
      }}
      className="max-w-xl space-y-8"
    >
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Schritt {step + 1} von {onboardingSteps.length}
        </p>
        <div aria-hidden className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground transition-all"
            style={{ width: `${((step + 1) / onboardingSteps.length) * 100}%` }}
          />
        </div>
        <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold outline-none">
          {currentStep?.title}
        </h2>
      </div>

      {/* All steps stay in the form (hidden), so every answer is submitted at the end. */}
      <div hidden={step !== 0} className="space-y-6">
        <FormField
          name="name"
          label="Wie heißt du?"
          autoComplete="name"
          value={values.name}
          onChange={(event) => set("name", event.target.value)}
          errors={errors.name}
        />
        <RadioCards
          name="country"
          legend="In welchem Land willst du als Freelancer arbeiten?"
          options={countries.map((country) => ({ value: country, label: countryLabels[country] }))}
          value={values.country}
          onChange={(value) => set("country", value as OnboardingInput["country"])}
          errors={errors.country}
          compact
        />
        {values.country && values.country !== "DE" && (
          <p className="rounded-lg bg-muted px-4 py-3 text-sm">
            Gut zu wissen: Die Informationen zu Anmeldung, Steuern und Versicherung beziehen sich
            auf Deutschland. Die übrigen Schritte passen überall.
          </p>
        )}
      </div>

      <div hidden={step !== 1} className="space-y-6">
        <FormField
          name="mainSkill"
          label="Was ist dein Haupt-Skill?"
          hint="Zum Beispiel „Webentwicklung mit React“ oder „Datenanalyse“."
          list="skill-suggestions"
          value={values.mainSkill}
          onChange={(event) => set("mainSkill", event.target.value)}
          errors={errors.mainSkill}
        />
        <datalist id="skill-suggestions">
          {skillSuggestions.map((skill) => (
            <option key={skill} value={skill} />
          ))}
        </datalist>
        <FormField
          name="additionalSkills"
          label="Weitere Skills (optional)"
          hint="Mit Komma getrennt, zum Beispiel „TypeScript, SQL, Figma“."
          value={values.additionalSkills}
          onChange={(event) => set("additionalSkills", event.target.value)}
          errors={errors.additionalSkills}
        />
        <FormField
          name="yearsExperience"
          label="Wie viele Jahre Berufserfahrung hast du in der IT?"
          hint="Studium und Ausbildung zählen nicht mit. Ganz neu? Dann 0."
          type="text"
          inputMode="numeric"
          value={values.yearsExperience}
          onChange={(event) => set("yearsExperience", event.target.value)}
          errors={errors.yearsExperience}
        />
        <RadioCards
          name="hasPortfolio"
          legend="Hast du schon ein Portfolio mit Arbeitsproben?"
          options={yesNoOptions}
          value={values.hasPortfolio}
          onChange={(value) => set("hasPortfolio", value as OnboardingInput["hasPortfolio"])}
          errors={errors.hasPortfolio}
          compact
        />
        <RadioCards
          name="hasFreelanceExperience"
          legend="Hast du schon einmal freiberuflich gearbeitet?"
          options={yesNoOptions}
          value={values.hasFreelanceExperience}
          onChange={(value) =>
            set("hasFreelanceExperience", value as OnboardingInput["hasFreelanceExperience"])
          }
          errors={errors.hasFreelanceExperience}
          compact
        />
      </div>

      <div hidden={step !== 2} className="space-y-6">
        <RadioCards
          name="goal"
          legend="Was möchtest du erreichen?"
          options={goals.map((goal) => ({ value: goal, ...toOption(goalLabels[goal]) }))}
          value={values.goal}
          onChange={(value) => set("goal", value as OnboardingInput["goal"])}
          errors={errors.goal}
        />
      </div>

      <div hidden={step !== 3} className="space-y-6">
        <FormField
          name="hoursPerWeek"
          label="Wie viele Stunden pro Woche kannst du investieren?"
          hint="Für die Vorbereitung und später für Projekte. Eine grobe Schätzung reicht."
          type="text"
          inputMode="numeric"
          value={values.hoursPerWeek}
          onChange={(event) => set("hoursPerWeek", event.target.value)}
          errors={errors.hoursPerWeek}
        />
        <FormField
          name="desiredStartDate"
          label="Wann möchtest du starten? (optional)"
          type="date"
          value={values.desiredStartDate}
          onChange={(event) => set("desiredStartDate", event.target.value)}
          errors={errors.desiredStartDate}
        />
      </div>

      <div hidden={step !== LAST_STEP} className="space-y-6">
        {proposedStageIds.length > 0 ? (
          <fieldset className="space-y-3">
            <legend className="mb-2">
              Diese Schritte hast du wahrscheinlich schon erledigt. Entferne das Häkchen, wenn etwas
              noch fehlt.
            </legend>
            {stages
              .filter((stage) => proposedStageIds.includes(stage.id))
              .map((stage) => (
                <label
                  key={stage.id}
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border p-3 has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
                >
                  <input
                    type="checkbox"
                    name="confirmedStageIds"
                    value={stage.id}
                    checked={values.confirmedStageIds.includes(stage.id)}
                    onChange={(event) =>
                      set(
                        "confirmedStageIds",
                        event.target.checked
                          ? [...values.confirmedStageIds, stage.id]
                          : values.confirmedStageIds.filter((id) => id !== stage.id),
                      )
                    }
                    className="size-5 shrink-0 accent-foreground"
                  />
                  <span>
                    Stufe {stage.order}: {stage.title}
                  </span>
                </label>
              ))}
          </fieldset>
        ) : (
          <p>
            Du startest ganz am Anfang der Roadmap und gehst alle Schritte der Reihe nach durch.
          </p>
        )}
        <div role="status" className="rounded-lg bg-muted px-4 py-3">
          {start ? (
            <>
              <span className="text-sm text-muted-foreground">Dein Startpunkt</span>
              <span className="block font-medium">
                Stufe {start.order}: {start.title}
              </span>
            </>
          ) : (
            <span className="font-medium">Du hast alle Stufen der Roadmap schon erledigt.</span>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        {step > 0 && (
          <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
            Zurück
          </Button>
        )}
        {/* Separate keys: otherwise React turns the clicked "Weiter" button into the
            submit button during the click, and the browser submits the form. */}
        {step < LAST_STEP ? (
          <Button key="next" type="button" onClick={next}>
            Weiter
          </Button>
        ) : (
          <Button key="submit" type="submit" disabled={pending}>
            {pending ? "Wird gespeichert …" : submitLabel}
          </Button>
        )}
      </div>
    </form>
  );
}

function toOption(label: { title: string; description: string }) {
  return { label: label.title, description: label.description };
}
