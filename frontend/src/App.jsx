import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Learning from "./components/Learning";
import Testimonials from "./components/Testimonials";
import Stats from "./components/Stats";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import ScrollProgress from "./components/ScrollProgress";
import Reveal from "./components/Reveal";
import Background3D from "./components/Background3D";
import RecruiterCopilot from "./components/RecruiterCopilot";

import { PortfolioProvider, usePortfolio } from "./data/PortfolioContext";

function MainContent() {
  const { profileData } = usePortfolio();

  return (
    <>
      {/* 3D Animated Background */}
      <Background3D />

      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Navigation Bar */}
      <Navbar />

      {/* AI Recruiter Co-Pilot Floating Widget */}
      <RecruiterCopilot />

      {/* Page Sections */}
      <main>
        <Reveal>
          <section id="home" className="section">
            <Hero />
          </section>
        </Reveal>

        <Reveal>
          <section id="about" className="section">
            <About />
          </section>
        </Reveal>

        <Reveal>
          <section id="skills" className="section">
            <Skills />
          </section>
        </Reveal>

        <Reveal>
          <section id="experience" className="section">
            <Experience />
          </section>
        </Reveal>

        <Reveal>
          <section id="projects" className="section">
            <Projects />
          </section>
        </Reveal>

        <Reveal>
          <section id="learning" className="section">
            <Learning />
          </section>
        </Reveal>

        <Reveal>
          <section id="testimonials" className="section">
            <Testimonials />
          </section>
        </Reveal>

        <Reveal>
          <section id="stats" className="section">
            <Stats />
          </section>
        </Reveal>

        <Reveal>
          <section id="contact" className="section">
            <Contact />
          </section>
        </Reveal>
      </main>

      {/* Footer */}
      <Footer name={profileData.name} />
    </>
  );
}

function App() {
  return (
    <PortfolioProvider>
      <MainContent />
    </PortfolioProvider>
  );
}

export default App;
