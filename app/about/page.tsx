"use client";

import Link from "next/link";
import DonationBanner from "@/components/DonationBanner";

export default function AboutPage() {
  return (
    <div className="about-page">
      <header className="about-topnav">
        <Link href="/" className="shell-back">← Back to platform</Link>
      </header>

      <main className="about-body">
        <section className="about-hero">
          <div className="about-avatar">TW</div>
          <h1 className="about-name">Ties Waenink</h1>
          <p className="about-tagline">Creator of this platform · Data lover from the Netherlands 🇳🇱</p>
        </section>

        <section className="about-section">
          <h2 className="about-section-title">Background</h2>
          <p className="about-text">
            I studied <strong>Economics &amp; Business Economics</strong> at the{" "}
            <strong>University of Groningen</strong>, where I first got pulled into the world of
            data — mostly through econometrics courses that made statistics feel genuinely useful
            rather than abstract.
          </p>
          <p className="about-text">
            Now I&apos;m doing a master&apos;s in <strong>Marketing Analytics &amp; Data Science</strong>,
            also at Groningen. It sits right at the intersection of consumer behaviour and machine
            learning — which turns out to be exactly where I want to be.
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-section-title">Why I built this</h2>
          <p className="about-text">
            I love two things in equal measure: understanding how things work, and figuring out
            why they break. Data science is great for both — a model either predicts well or it
            doesn&apos;t, and the gap between those two states is always interesting to debug.
          </p>
          <p className="about-text">
            Most learning resources I found were either too shallow (blog posts that stop at
            &ldquo;here&apos;s the sklearn API&rdquo;) or too dense (academic papers where the
            notation outruns the intuition). I wanted something in between: rigorous enough to
            actually teach the math, interactive enough to keep you engaged. So I built it.
          </p>
          <p className="about-text">
            The platform covers everything from linear algebra and probability through
            transformers and recommender systems, with coding exercises that run in-browser.
            My goal is that you walk away able to implement things from scratch — not just
            call <code>.fit()</code>.
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-section-title">The Dutch easter egg</h2>
          <p className="about-text">
            If you make it to the Phase 6 capstone, you&apos;ll find a k-means clustering
            exercise using the coordinates of Dutch cities — Amsterdam, Rotterdam, Groningen,
            Eindhoven, and Maastricht. It&apos;s a small nod to home buried in the last exercise.{" "}
            <em>Gefeliciteerd als je er bent gekomen.</em>
          </p>
        </section>

        {/* TODO: Replace tikkieUrl and stripeUrl with real links once set up */}
        <DonationBanner context="platform" />
      </main>
    </div>
  );
}
