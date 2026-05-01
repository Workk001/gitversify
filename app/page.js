import Link from "next/link";

export default function Home() {
  return (
    <main className="landing-page">
      <nav className="shell nav">
        <Link className="brand" href="/">
          <span className="brand-mark">G</span>
          GitVersify
        </Link>
        <a className="nav-link" href="/api/auth/github">
          Connect GitHub
        </a>
      </nav>

      <section className="shell hero">
        <div className="hero-copy">
          <p className="eyebrow">AI-powered changelogs for GitHub</p>
          <h1>Turn messy commits into clean release notes.</h1>
          <p className="hero-text">
            GitVersify reads your commits since the last release, writes a clean
            grouped changelog, and publishes it directly to GitHub.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="/api/auth/github">
              Login with GitHub
            </a>
            <span className="microcopy">
              Free for 3 repos. No credit card needed.
            </span>
          </div>
        </div>

        <div className="hero-panel" aria-label="Changelog preview">
          <div className="panel-topbar">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="preview-card">
            <p className="preview-label">GitVersify preview</p>
            <h2>What&apos;s New</h2>
            <ul>
              <li>Added repository-based release generation.</li>
              <li>Improved changelog wording for non-technical readers.</li>
              <li>Fixed missing context in generated release notes.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
