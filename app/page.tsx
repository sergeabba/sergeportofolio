"use client";

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

export default function Home() {
  return (
    <>
      <SkipLink />
      <main>
        <Navbar />
        <Hero />
        <TechTicker />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <CTABanner />
        <Contact />
        <Footer />
      </main>
      <BackToTop />
    </>
  );
}
