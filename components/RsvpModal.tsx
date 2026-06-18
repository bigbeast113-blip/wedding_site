"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { couple, rsvp } from "@/content/wedding";
import Burst from "./Burst";

// A household from the guest sheet: a main invitee + an optional plus-one.
// plus === ""      -> no plus-one (solo)
// plus === "Guest" -> an un-named plus-one the guest fills in
// plus === "<name>"-> a named plus-one
type Household = { name: string; plus: string };

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
const looseMatch = (a: string, b: string) => {
  const x = norm(a), y = norm(b);
  return !!x && !!y && (x === y || x.includes(y) || y.includes(x));
};

/** Find a household by a typed name — matches the Name OR a named Plus-one. */
function findHousehold(list: Household[], q: string): Household | null {
  if (!norm(q)) return null;
  if (!list.length) return { name: q.trim(), plus: "" }; // open RSVP (no sheet)
  return (
    list.find(
      (h) =>
        looseMatch(h.name, q) ||
        (h.plus && norm(h.plus) !== "guest" && looseMatch(h.plus, q))
    ) ?? null
  );
}

/** Pull the live guest list (Name | Plus one) from the public Google Sheet. */
async function fetchHouseholds(): Promise<Household[]> {
  const { id, tab } = rsvp.guestSheet;
  if (!id) return [];
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&headers=1${
    tab ? `&sheet=${encodeURIComponent(tab)}` : ""
  }`;
  const text = await (await fetch(url)).text();
  const json = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1));
  const rows: { c: ({ v: unknown } | null)[] }[] = json.table?.rows ?? [];
  return rows
    .map((row) => ({
      name: row.c?.[0]?.v != null ? String(row.c[0]!.v).trim() : "",
      plus: row.c?.[1]?.v != null ? String(row.c[1]!.v).trim() : "",
    }))
    // Keep real guests only; drop a stray header row if gviz includes it.
    .filter((h) => h.name && norm(h.name) !== "name");
}

type Step = "quiz" | "search" | "respond" | "done";
type YesNo = "yes" | "no" | null;

export default function RsvpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>("quiz");
  const [query, setQuery] = useState("");
  const [households, setHouseholds] = useState<Household[]>([]);
  const [household, setHousehold] = useState<Household | null>(null);

  const [mainStatus, setMainStatus] = useState<YesNo>(null);
  const [plusStatus, setPlusStatus] = useState<YesNo>(null);
  const [plusName, setPlusName] = useState("");

  const [quiz, setQuiz] = useState<string[]>(() => rsvp.quiz.map(() => ""));
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Load the live guest list when the modal opens.
  useEffect(() => {
    if (!open || !rsvp.guestSheet.id) return;
    let cancelled = false;
    fetchHouseholds()
      .then((list) => {
        if (!cancelled && list.length) setHouseholds(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open]);

  const hasPlus = !!household && household.plus !== "";
  const isGuestSlot = !!household && norm(household.plus) === "guest";

  function reset() {
    setStep("quiz");
    setQuery("");
    setHousehold(null);
    setMainStatus(null);
    setPlusStatus(null);
    setPlusName("");
    setQuiz(rsvp.quiz.map(() => ""));
    setError(null);
  }

  function handleClose() {
    onClose();
    window.setTimeout(reset, 350);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const found = findHousehold(households, query);
    if (!found) {
      setError(
        "We couldn't find that name on the guest list. Please enter it as it appears on your invitation, or reach out to us."
      );
      return;
    }
    setHousehold(found);
    setMainStatus(null);
    setPlusStatus(null);
    // Pre-fill a named plus-one (so they can update it); blank for a "Guest" slot.
    setPlusName(norm(found.plus) === "guest" ? "" : found.plus);
    setStep("respond");
  }

  const attendingCount =
    (mainStatus === "yes" ? 1 : 0) + (hasPlus && plusStatus === "yes" ? 1 : 0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!household) return;
    setError(null);

    if (!mainStatus) {
      setError("Please choose a response for each guest.");
      return;
    }
    if (hasPlus && !plusStatus) {
      setError("Please respond for your plus-one (or you can decline for them).");
      return;
    }
    if (hasPlus && plusStatus === "yes" && !plusName.trim()) {
      setError("Please add your guest's name, or decline the plus-one.");
      return;
    }

    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") as string) || "";
    const dietary = (fd.get("dietary") as string) || "";
    const message = (fd.get("message") as string) || "";
    const submittedAt = new Date().toISOString();
    const quizQuestions = rsvp.quiz.map((item) => item.q);
    const quizAns = rsvp.quiz.map((_, i) => (quiz[i] ? quiz[i].trim() : ""));

    const guests = [{ name: household.name, attending: mainStatus === "yes" ? "Yes" : "No" }];
    if (hasPlus) {
      guests.push({
        name: plusName.trim() || "Guest",
        attending: plusStatus === "yes" ? "Yes" : "No",
      });
    }

    if (rsvp.endpoint) {
      try {
        setSending(true);
        // RSVP + quiz in one request (the script splits into RSVPs / Trivia tabs).
        await fetch(rsvp.endpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            submittedAt,
            partyName: guests.map((g) => g.name).join(" & "),
            email,
            dietary,
            message,
            guests,
            questions: quizQuestions,
            answers: quizAns,
          }),
        });
        // If they named/changed their plus-one, save it back to the guest sheet.
        if (hasPlus && plusName.trim() && norm(plusName) !== norm(household.plus)) {
          await fetch(rsvp.endpoint, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
              kind: "plusone",
              name: household.name,
              plusOne: plusName.trim(),
            }),
          });
        }
      } catch {
        /* fire-and-forget */
      } finally {
        setSending(false);
      }
    }

    setStep("done");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm sm:items-center sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative w-full max-w-lg rounded-2xl bg-paper p-6 shadow-2xl sm:p-10"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-2xl text-stone transition-colors hover:bg-black/5 hover:text-ink"
              aria-label="Close"
            >
              ×
            </button>

            <p className="text-xs uppercase tracking-[0.3em] text-rust">{couple.monogram}</p>
            <h2 className="display mt-1 text-5xl text-ink">
              {step === "quiz" ? "a little quiz" : "rsvp"}
            </h2>

            {/* STEP 0 — optional trivia */}
            {step === "quiz" && (
              <div className="mt-4">
                <p className="text-sm text-stone">
                  Optional, but we&apos;d love it — a quick &ldquo;how well do you know us&rdquo;
                  before you RSVP. No wrong answers!
                </p>
                <div className="mt-4 max-h-[50vh] space-y-4 overflow-y-auto pr-1">
                  {rsvp.quiz.map((item, i) => (
                    <div key={i}>
                      <label className="mb-1.5 block text-sm font-medium text-ink">
                        {i + 1}. {item.q}
                      </label>
                      {item.options ? (
                        <div className="flex flex-wrap gap-2">
                          {item.options.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() =>
                                setQuiz((prev) => {
                                  const next = [...prev];
                                  next[i] = next[i] === opt ? "" : opt;
                                  return next;
                                })
                              }
                              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                                quiz[i] === opt
                                  ? "border-rust bg-rust text-white"
                                  : "border-ink/15 text-stone hover:border-rust"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <textarea
                          value={quiz[i] ?? ""}
                          onChange={(e) =>
                            setQuiz((prev) => {
                              const next = [...prev];
                              next[i] = e.target.value;
                              return next;
                            })
                          }
                          rows={2}
                          className="w-full rounded-lg border border-ink/15 bg-white/60 px-3 py-2 text-sm text-ink outline-none focus:border-rust"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("search")}
                    className="flex-1 rounded-full bg-rust px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rust-dark"
                  >
                    Continue to RSVP →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuiz(rsvp.quiz.map(() => ""));
                      setStep("search");
                    }}
                    className="text-sm text-stone underline underline-offset-4 transition-colors hover:text-ink"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1 — find your invitation */}
            {step === "search" && (
              <form onSubmit={handleSearch} className="mt-4">
                <p className="text-sm text-stone">
                  Enter your name as it appears on your invitation to find your RSVP.
                </p>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="First and last name"
                  className="mt-4 w-full rounded-lg border border-ink/15 bg-white/60 px-3 py-2.5 text-sm text-ink outline-none focus:border-rust"
                />
                {error && (
                  <p className="mt-3 rounded-lg bg-rust/10 px-3 py-2 text-sm text-rust-dark">{error}</p>
                )}
                <button
                  type="submit"
                  className="mt-5 w-full rounded-full bg-rust px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rust-dark"
                >
                  Find my invitation
                </button>
              </form>
            )}

            {/* STEP 2 — respond */}
            {step === "respond" && household && (
              <form onSubmit={handleSubmit} className="mt-4">
                <p className="text-sm text-stone">Please let us know if you can make it.</p>

                <div className="mt-4 space-y-3">
                  {/* main invitee */}
                  <GuestCard
                    title={household.name}
                    status={mainStatus}
                    onPick={setMainStatus}
                  />

                  {/* plus-one (named or "Guest") */}
                  {hasPlus && (
                    <div className="rounded-xl border border-ink/10 bg-white/50 p-3">
                      <label className="mb-1.5 block text-xs uppercase tracking-wide text-stone">
                        {isGuestSlot ? "Your plus-one" : "Plus-one (edit to update)"}
                      </label>
                      <input
                        value={plusName}
                        onChange={(e) => setPlusName(e.target.value)}
                        placeholder="Plus-one's name"
                        className="mb-2 w-full rounded-lg border border-ink/15 bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-rust"
                      />
                      <div className="flex gap-2">
                        {(["yes", "no"] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setPlusStatus(opt)}
                            className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                              plusStatus === opt
                                ? "border-rust bg-rust text-white"
                                : "border-ink/15 text-stone hover:border-rust"
                            }`}
                          >
                            {opt === "yes" ? "Joyfully accepts" : "Regretfully declines"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 space-y-4">
                  <Field label="Email" name="email" type="email" required />
                  {attendingCount > 0 && (
                    <Field label="Dietary restrictions (optional)" name="dietary" />
                  )}
                  <div>
                    <label className="mb-1.5 block text-sm text-ink">
                      Note to the couple (optional)
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      className="w-full rounded-lg border border-ink/15 bg-white/60 px-3 py-2 text-sm text-ink outline-none focus:border-rust"
                    />
                  </div>
                </div>

                {error && (
                  <p className="mt-3 rounded-lg bg-rust/10 px-3 py-2 text-sm text-rust-dark">{error}</p>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("search");
                      setError(null);
                    }}
                    className="rounded-full border border-ink/15 px-5 py-3 text-sm text-stone transition-colors hover:border-ink hover:text-ink"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 rounded-full bg-rust px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rust-dark disabled:opacity-40"
                  >
                    {sending ? "Sending…" : "Submit RSVP"}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3 — confirmation */}
            {step === "done" && (
              <div className="py-8 text-center">
                {attendingCount > 0 && <Burst />}
                <h3 className="display text-4xl text-ink">thank you</h3>
                <p className="mt-4 text-stone">
                  {attendingCount > 0
                    ? `We can't wait to celebrate with ${attendingCount === 1 ? "you" : "you both"}! Your response has been recorded.`
                    : "Thank you for letting us know — you'll be missed!"}
                </p>
                <button
                  onClick={handleClose}
                  className="mt-8 rounded-full bg-rust px-6 py-2.5 text-sm font-medium text-white hover:bg-rust-dark"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GuestCard({
  title,
  status,
  onPick,
}: {
  title: string;
  status: YesNo;
  onPick: (s: "yes" | "no") => void;
}) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white/50 p-3">
      <p className="font-serif text-lg text-ink">{title}</p>
      <div className="mt-2 flex gap-2">
        {(["yes", "no"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onPick(opt)}
            className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              status === opt
                ? "border-rust bg-rust text-white"
                : "border-ink/15 text-stone hover:border-rust"
            }`}
          >
            {opt === "yes" ? "Joyfully accepts" : "Regretfully declines"}
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-ink">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-ink/15 bg-white/60 px-3 py-2 text-sm text-ink outline-none focus:border-rust"
      />
    </div>
  );
}
