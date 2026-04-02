"use client";

import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import BackToTop from "@/components/BackToTop";
import SkipLink from "@/components/SkipLink";

/**
 * PAGE PRINCIPALE DU PORTFOLIO
 * Orchestration des sections modulaires.
 */
export default function Home() {
  return (
    <>
      <SkipLink />
      <main>
        <Navbar />

        <Hero />
        <div className="sep" />

        <About />
        <div className="sep" />

        <Skills />
        <div className="sep" />

        <Projects />
        <div className="sep" />

        <Experience />
        <div className="sep" />

        <Contact />
        <div className="sep" />

        <Footer />
      </main>
      <BackToTop />
    </>
  );
}