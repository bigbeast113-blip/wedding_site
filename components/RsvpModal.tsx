"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { couple, rsvp } from "@/content/wedding";
import Burst from "./Burst";

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

/** Find the party (household) a typed name belongs to. */
function findParty(name: string): { members: string[] } | null {
  const n = norm(name);
  if (!n) return null;
  if (!rsvp.parties.length) return { members: [name.trim()] }; // open RSVP
  return (
    rsvp.parties.find((p) =>
      p.members.some((m) => {
        const mn = norm(m);
        return mn === n || mn.includes(n) || n.includes(mn);
      })
    ) ?? null
  );
}

type Step = "quiz" | "search" | "respond" | "done";

export default function RsvpModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("quiz");
  const [query, setQuery] = useState("");
  const [party, setParty] = useState<{ members: string[] } | null>(null);
  const [answers, setAnswers] = useState<Record<string, "yes" | "no">>({});
  const [quiz, setQuiz] = useState<string[]>(() => rsvp.quiz.map(() => ""));
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  function reset() {
    setStep("quiz");
    setQuery("");
    setParty(null);
    setAnswers({});
    setQuiz(rsvp.quiz.map(() => ""));
    setError(null);
  }

  function handleClose() {
    onClose();
    // reset after the close animation
    window.setTimeout(reset, 350);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const found = findParty(query);
    if (!found) {
      setError(
        "We couldn't find that name on the guest list. Please enter it as it appears on your invitation, or reach out to us."
      );
      return;
    }
    setParty(found);
    setAnswers({});
    setStep("respond");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!party) return;
    setError(null);

    if (party.members.some((m) => !answers[m])) {
      setError("Please choose a response for each guest.");
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = (fd.get("email") as string) || "";
    const dietary = (fd.get("dietary") as string) || "";
    const song = (fd.get("song") as string) || "";
    const message = (fd.get("message") as string) || "";
    const submittedAt = new Date().toISOString();
    const quizQuestions = rsvp.quiz.map((item) => item.q);
    const quizAns = rsvp.quiz.map((_, i) => (quiz[i] ? quiz[i].trim() : ""));

    if (rsvp.endpoint) {
      try {
        setSending(true);
        // Everything in one request; the Apps Script splits it across tabs.
        await fetch(rsvp.endpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            submittedAt,
            partyName: party.members.join(" & "),
            email,
            dietary,
            song,
            message,
            guests: party.members.map((name) => ({
              name,
              attending: answers[name] === "yes" ? "Yes" : "No",
            })),
            questions: quizQuestions,
            answers: quizAns,
          }),
        });
      } catch {
        /* fire-and-forget */
      } finally {
        setSending(false);
      }
    }

    setStep("done");
  }

  const attendingCount = party
    ? party.members.filter((m) => answers[m] === "yes").length
    : 0;

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
                  Enter your full name as it appears on your invitation to find your party.
                </p>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="First and last name"
                  className="mt-4 w-full rounded-lg border border-ink/15 bg-white/60 px-3 py-2.5 text-sm text-ink outline-none focus:border-rust"
                />
                {error && (
                  <p className="mt-3 rounded-lg bg-rust/10 px-3 py-2 text-sm text-rust-dark">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  className="mt-5 w-full rounded-full bg-rust px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rust-dark"
                >
                  Find my invitation
                </button>
              </form>
            )}

            {/* STEP 2 — respond for each member of the party */}
            {step === "respond" && party && (
              <form onSubmit={handleSubmit} className="mt-4">
                <p className="text-sm text-stone">
                  We found your party. Please respond for each guest.
                </p>

                <div className="mt-4 space-y-3">
                  {party.members.map((name) => (
                    <div
                      key={name}
                      className="rounded-xl border border-ink/10 bg-white/50 p-3"
                    >
                      <p className="font-serif text-lg text-ink">{name}</p>
                      <div className="mt-2 flex gap-2">
                        {(["yes", "no"] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setAnswers((a) => ({ ...a, [name]: opt }))}
                            className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                              answers[name] === opt
                                ? "border-rust bg-rust text-white"
                                : "border-ink/15 text-stone hover:border-rust"
                            }`}
                          >
                            {opt === "yes" ? "Joyfully accepts" : "Regretfully declines"}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-4">
                  <Field label="Email" name="email" type="email" required />
                  {attendingCount > 0 && (
                    <>
                      <Field label="Dietary restrictions (optional)" name="dietary" />
                      <Field label="Song request (optional)" name="song" />
                    </>
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
                  <p className="mt-3 rounded-lg bg-rust/10 px-3 py-2 text-sm text-rust-dark">
                    {error}
                  </p>
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
                    ? `We can't wait to celebrate with ${
                        attendingCount === 1 ? "you" : "your party"
                      }! Your response has been recorded.`
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
