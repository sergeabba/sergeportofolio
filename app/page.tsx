"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import TechTicker from "@/components/TechTicker";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import CTABanner from "@/components/sections/CTABanner";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import BackToTop from "@/components/BackToTop";
import SkipLink from "@/components/SkipLink";
import Preloader from "@/components/Preloader";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const handleDone = useCallback(() => setLoaded(true), []);

  return (
    <>
      <Preloader name="Mbaitadjim" subName="Abba Serge" onDone={handleDone} />
      <AnimatePresence>
        {loaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <SkipLink />
            <main>
              <Navbar />
              <Hero />
              <TechTicker />
              <div className="section-sep" />
              <About />
              <div className="section-sep" />
              <Skills />
              <div className="section-sep" />
              <Projects />
              <div className="section-sep" />
              <Experience />
              <CTABanner />
              <Contact />
              <Footer />
            </main>
            <BackToTop />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
