"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Splash from "@/components/Splash";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import PhotoScatter from "@/components/PhotoScatter";
import Story from "@/components/Story";
import DateReveal from "@/components/DateReveal";
import Countdown from "@/components/Countdown";
import Details from "@/components/Details";
import Vision from "@/components/Vision";
import Faq from "@/components/Faq";
import Closing from "@/components/Closing";
import RsvpModal from "@/components/RsvpModal";

// Persists across client-side navigation so returning from /wedding-party
// doesn't replay the entrance splash.
let enteredOnce = false;

export default function Page() {
  const [entered, setEntered] = useState(enteredOnce);
  const [rsvpOpen, setRsvpOpen] = useState(false);

  function handleEnter() {
    enteredOnce = true;
    setEntered(true);
  }

  // Lock body scroll until the visitor "enters".
  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  return (
    <>
      <AnimatePresence>
        {!entered && <Splash onEnter={handleEnter} />}
      </AnimatePresence>

      <AnimatePresence>
        {entered && (
          <motion.main
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <Nav onRsvp={() => setRsvpOpen(true)} />
            <Hero />
            <PhotoScatter />
            <Story />
            <DateReveal />
            <Countdown />
            <Details />
            <Vision />
            <Faq />
            <Closing onRsvp={() => setRsvpOpen(true)} />
          </motion.main>
        )}
      </AnimatePresence>

      <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
    </>
  );
}
