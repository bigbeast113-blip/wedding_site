"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Splash from "@/components/Splash";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import FlyThrough from "@/components/FlyThrough";
import Story from "@/components/Story";
import DateReveal from "@/components/DateReveal";
import Countdown from "@/components/Countdown";
import Details from "@/components/Details";
import Vision from "@/components/Vision";
import MarqueeBand from "@/components/MarqueeBand";
import Faq from "@/components/Faq";
import Closing from "@/components/Closing";
import Footer from "@/components/Footer";
import RsvpModal from "@/components/RsvpModal";
import ScrollProgress from "@/components/motion/ScrollProgress";
import { lockScroll, unlockScroll } from "@/lib/scroll";

// Persists across client-side navigation so returning from /wedding-party
// doesn't replay the entrance splash.
let enteredOnce = false;

export default function Page() {
  const [entered, setEntered] = useState(enteredOnce);
  const [returning] = useState(enteredOnce);
  const [rsvpOpen, setRsvpOpen] = useState(false);

  function handleEnter() {
    enteredOnce = true;
    setEntered(true);
  }

  // No scrolling until the visitor steps through the portal.
  useEffect(() => {
    if (entered) return;
    lockScroll();
    return () => unlockScroll();
  }, [entered]);

  return (
    <>
      <AnimatePresence>{!entered && <Splash onEnter={handleEnter} />}</AnimatePresence>

      <AnimatePresence>
        {entered && (
          <motion.main initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
            <ScrollProgress />
            <Nav onRsvp={() => setRsvpOpen(true)} />
            <Hero returning={returning} />
            <FlyThrough />
            <Story />
            <DateReveal />
            <Countdown />
            <Details />
            <Vision />
            <MarqueeBand />
            <Faq />
            <Closing onRsvp={() => setRsvpOpen(true)} />
            <Footer />
          </motion.main>
        )}
      </AnimatePresence>

      <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
    </>
  );
}
