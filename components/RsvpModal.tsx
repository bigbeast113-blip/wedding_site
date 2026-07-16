"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { couple, rsvp } from "@/content/wedding";
import Burst from "./Burst";
import { useDialog } from "@/lib/useDialog";

// A household from the guest sheet: a main invitee + an optional plus-one.
//   plus === ""      -> no plus-one (solo)
//   plus === "Guest" -> an un-named plus-one; the guest types the name (stored
//                       in `guestName`, written back to the sheet's 3rd column)
//   plus === "<name>"-> a named plus-one (fixed)
type Household = { name: string; plus: string; guestName: string };

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
const isGuest = (plus: string) => norm(plus) === "guest";

/** Does a household match a typed query? Matches Name, a named Plus-one, or a typed guest. */
function matches(h: Household, q: string): boolean {
  const n = norm(q);
  if (!n) return false;
  return (
    norm(h.name).includes(n) ||
    (!!h.plus && !isGuest(h.plus) && norm(h.plus).includes(n)) ||
    (!!h.guestName && norm(h.guestName).includes(n))
  );
}

/** How a household reads in the search list — shows both names so duplicates differ. */
function householdLabel(h: Household): string {
  if (!h.plus) return h.name;
  if (isGuest(h.plus)) return h.guestName ? `${h.name} & ${h.guestName}` : `${h.name}  ·  +1 guest`;
  return `${h.name} & ${h.plus}`;
}

/** Pull the live guest list (Name | Plus one | Guest name) from the public Google Sheet. */
async function fetchHouseholds(): Promise<Household[]> {
  const { id, tab } = rsvp.guestSheet;
  if (!id) return [];
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&headers=1${
    tab ? `&sheet=${encodeURIComponent(tab)}` : ""
  }`;
  const text = await (await fetch(url)).text();
  const json = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1));
  const rows: { c: ({ v: unknown } | null)[] }[] = json.table?.rows ?? [];
  const cell = (row: { c: ({ v: unknown } | null)[] }, i: number) =>
    row.c?.[i]?.v != null ? String(row.c[i]!.v).trim() : "";
  return rows
    .map((row) => ({ name: cell(row, 0), plus: cell(row, 1), guestName: cell(row, 2) }))
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
  // Whether the guest list has settled (fetched, or confirmed there's no sheet).
  // Distinguishes "still loading" from "truly empty" so we don't drop a guest's
  // household by treating an in-flight fetch as a walk-in.
  const [loaded, setLoaded] = useState(false);

  // Load the live guest list when the modal opens.
  useEffect(() => {
    if (!open) return;
    if (!rsvp.guestSheet.id) {
      setLoaded(true); // no sheet configured -> walk-in RSVP
      return;
    }
    let cancelled = false;
    fetchHouseholds()
      .then((list) => {
        if (!cancelled && list.length) setHouseholds(list);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    return households.filter((h) => matches(h, query)).slice(0, 8);
  }, [households, query]);

  const hasPlus = !!household && household.plus !== "";
  const guestSlot = !!household && isGuest(household.plus);

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

  useDialog(open, handleClose); // lock background scroll + close on Escape

  function selectHousehold(h: Household) {
    setHousehold(h);
    setMainStatus(null);
    setPlusStatus(null);
    setPlusName(isGuest(h.plus) ? h.guestName : ""); // pre-fill a previously-typed guest
    setError(null);
    setStep("respond");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!loaded) return; // guest list still loading — don't fabricate a walk-in
    // No live list (sheet empty/unreachable) -> open RSVP with the typed name.
    if (!households.length) {
      if (!query.trim()) return;
      selectHousehold({ name: query.trim(), plus: "", guestName: "" });
      return;
    }
    if (results.length) {
      // Enter should prefer an exact name match, not just the first row that
      // contains the query as a substring (avoids opening the wrong invitation).
      const n = norm(query);
      const exact = results.find(
        (h) =>
          norm(h.name) === n ||
          (!!h.plus && !isGuest(h.plus) && norm(h.plus) === n) ||
          (!!h.guestName && norm(h.guestName) === n)
      );
      selectHousehold(exact ?? results[0]);
    }
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
    if (guestSlot && plusStatus === "yes" && !plusName.trim()) {
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

    const plusDisplay = guestSlot ? plusName.trim() || "Guest" : household.plus;
    const guests = [{ name: household.name, attending: mainStatus === "yes" ? "Yes" : "No" }];
    if (hasPlus) {
      guests.push({ name: plusDisplay, attending: plusStatus === "yes" ? "Yes" : "No" });
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
        // For a "Guest" slot, save the typed name back to the sheet (column C) so
        // it's remembered and can be updated on a return visit.
        if (guestSlot && plusName.trim() && norm(plusName) !== norm(household.guestName)) {
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
          className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto overscroll-contain bg-black/50 p-4 backdrop-blur-sm sm:items-center sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="RSVP"
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

            {/* STEP 1 — find your invitation (live type-ahead) */}
            {step === "search" && (
              <form onSubmit={handleSearch} className="mt-4">
                <p className="text-sm text-stone">
                  Start typing your name, then pick your invitation from the list.
                </p>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Your name"
                  className="mt-4 w-full rounded-lg border border-ink/15 bg-white/60 px-3 py-2.5 text-sm text-ink outline-none focus:border-rust"
                />

                {!loaded ? (
                  <p className="mt-4 rounded-lg bg-white/50 px-3 py-2.5 text-sm text-stone">
                    Loading the guest list…
                  </p>
                ) : households.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {results.map((h, i) => (
                      <button
                        key={`${h.name}-${i}`}
                        type="button"
                        onClick={() => selectHousehold(h)}
                        className="flex w-full items-center justify-between rounded-lg border border-ink/15 bg-white/60 px-4 py-3 text-left text-sm text-ink transition-colors hover:border-rust hover:bg-rust/5"
                      >
                        <span className="font-serif">{householdLabel(h)}</span>
                        <span className="text-rust">→</span>
                      </button>
                    ))}
                    {query.trim().length >= 2 && results.length === 0 && (
                      <p className="rounded-lg bg-rust/10 px-3 py-2 text-sm text-rust-dark">
                        We couldn&apos;t find that name. Try the name on your invitation, or reach
                        out to us.
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="mt-5 w-full rounded-full bg-rust px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rust-dark"
                  >
                    Continue
                  </button>
                )}
                {error && (
                  <p className="mt-3 rounded-lg bg-rust/10 px-3 py-2 text-sm text-rust-dark">{error}</p>
                )}
              </form>
            )}

            {/* STEP 2 — respond */}
            {step === "respond" && household && (
              <form onSubmit={handleSubmit} className="mt-4">
                <p className="text-sm text-stone">Please let us know if you can make it.</p>

                <div className="mt-4 space-y-3">
                  {/* main invitee — always a fixed name */}
                  <GuestCard title={household.name} status={mainStatus} onPick={setMainStatus} />

                  {/* named plus-one — also fixed */}
                  {hasPlus && !guestSlot && (
                    <GuestCard title={household.plus} status={plusStatus} onPick={setPlusStatus} />
                  )}

                  {/* "Guest" plus-one — type the name */}
                  {guestSlot && (
                    <div className="rounded-xl border border-ink/10 bg-white/50 p-3">
                      <label className="mb-1.5 block text-xs uppercase tracking-wide text-stone">
                        Your plus-one
                      </label>
                      <input
                        value={plusName}
                        onChange={(e) => setPlusName(e.target.value)}
                        placeholder="Your guest's name"
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
