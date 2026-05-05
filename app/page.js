import Link from "next/link";

const flowSteps = [
  "Connect GitHub",
  "Choose a repository",
  "Select the release range",
  "Generate and edit notes",
  "Publish the release",
];

export default function Home() {
  return (
    <main id="main-content" className="landing-page">
      <nav className="shell nav brutal-nav">
        <Link className="brand" href="/">
          <span className="brand-mark">G</span>
          GitVersify
        </Link>
        <div className="nav-coordinates">clear release notes from real commits</div>
        <a className="nav-link" href="/api/auth/github">
          Connect GitHub
        </a>
      </nav>

      <section className="shell hero simple-hero">
        <div className="hero-copy">
          <p className="eyebrow">AI changelogs for GitHub releases</p>
          <h1>Turn commits into release notes users can understand.</h1>
          <p className="hero-text">
            Pick a repo, choose the release range, generate a clean draft, edit
            it, and publish back to GitHub.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="/api/auth/github">
              <span>Start with GitHub</span>
              <span className="button-mark">-&gt;</span>
            </a>
            <span className="microcopy">No repo cloning. OAuth access only.</span>
          </div>
        </div>

        <aside className="release-console" aria-label="Simple product flow">
          {flowSteps.map((step, index) => (
            <div className="console-step" key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </aside>
      </section>

      <section className="shell compare-section reveal-block">
        <article className="compare-panel before-panel">
          <p className="eyebrow">Before</p>
          <h2>Manual release notes slow the team down.</h2>
          <ul>
            <li>Read raw commit history</li>
            <li>Rewrite technical messages</li>
            <li>Sort fixes and improvements by hand</li>
            <li>Copy the final draft into GitHub</li>
          </ul>
        </article>

        <article className="compare-panel after-panel">
          <p className="eyebrow">After</p>
          <h2>GitVersify keeps the release flow in one place.</h2>
          <ul>
            <li>Select the repository and range</li>
            <li>Generate user-facing notes</li>
            <li>Edit the draft in the app</li>
            <li>Publish a GitHub release</li>
          </ul>
        </article>
      </section>

      <section className="shell flow-section reveal-block">
        <div className="section-kicker compact">
          <p className="eyebrow">How it works</p>
          <h2>Five steps. No extra workspace.</h2>
        </div>
        <div className="flow-track compact-flow">
          {flowSteps.map((step, index) => (
            <div key={step}>
              <span>{index + 1}</span>
              {step}
            </div>
          ))}
        </div>
      </section>

      <section className="shell action-section reveal-block">
        <h2>Ready to turn your next commit range into a release?</h2>
        <a className="button button-primary" href="/api/auth/github">
          <span>Connect GitHub</span>
          <span className="button-mark">-&gt;</span>
        </a>
      </section>

      <footer className="shell footer">
        <Link className="brand" href="/">
          <span className="brand-mark">G</span>
          GitVersify
        </Link>
        <div className="footer-links">
          <a href="/api/auth/github">Connect GitHub</a>
          <a href="mailto:support@gitversify.dev">Support</a>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </footer>
    </main>
  );
}
