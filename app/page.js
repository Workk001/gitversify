import Link from "next/link";

export default function Home() {
  return (
    <main id="main-content" className="landing-page">
      <nav className="shell nav brutal-nav">
        <Link className="brand" href="/">
          <span className="brand-mark">G</span>
          GitVersify
        </Link>
        <div className="nav-coordinates">RELEASE OPS / GITHUB / AI DRAFT</div>
        <a className="nav-link" href="/api/auth/github">
          Connect GitHub
        </a>
      </nav>

      <section className="shell hero">
        <div className="hero-copy">
          <p className="eyebrow">Stop translating commits by hand</p>
          <h1>Release notes for teams that already shipped.</h1>
          <p className="hero-text">
            GitVersify reads the messy commit trail, extracts the useful change
            story, and publishes a GitHub release after your final edit.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="/api/auth/github">
              <span>Connect GitHub</span>
              <span className="button-mark">-&gt;</span>
            </a>
            <span className="microcopy">OAuth only. No repository cloning.</span>
          </div>
        </div>

        <div className="hero-artifact" aria-label="GitVersify release workflow preview">
          <div
            className="artifact-image"
            role="img"
            aria-label="Abstract release operations workspace"
          />
          <div className="artifact-terminal">
            <div className="terminal-line">
              <span>INPUT</span>
              <strong>30 commits since v1.8.0</strong>
            </div>
            <div className="terminal-line">
              <span>FILTER</span>
              <strong>wip, test, merge branch removed</strong>
            </div>
            <div className="terminal-line active">
              <span>OUTPUT</span>
              <strong>customer-ready changelog</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee-band" aria-hidden="true">
        <div className="marquee-track">
          <span>CONNECT GITHUB</span>
          <span>SELECT RANGE</span>
          <span>GENERATE DRAFT</span>
          <span>EDIT LANGUAGE</span>
          <span>PUBLISH RELEASE</span>
          <span>CONNECT GITHUB</span>
          <span>SELECT RANGE</span>
          <span>GENERATE DRAFT</span>
        </div>
      </div>

      <section className="shell problem-section reveal-block">
        <div className="section-kicker">
          <p className="eyebrow">The product gap</p>
          <h2>
            Commits are written for builders. Releases are read by everyone
            else.
          </h2>
        </div>

        <div className="problem-grid">
          <article className="problem-item">
            <span className="problem-index">01</span>
            <h3>Raw commits hide the customer-facing value.</h3>
            <p>
              GitVersify filters the noise and rewrites technical changes into
              clear product language.
            </p>
          </article>
          <article className="problem-item featured">
            <span className="problem-index">02</span>
            <h3>Release notes take focus from shipping.</h3>
            <p>
              The app turns a manual writing task into a guided flow: connect,
              choose, generate, edit, publish.
            </p>
          </article>
          <article className="problem-item">
            <span className="problem-index">03</span>
            <h3>Publishing is disconnected from the draft.</h3>
            <p>
              The final note goes straight back to GitHub as a release, keeping
              the source and announcement together.
            </p>
          </article>
        </div>
      </section>

      <section className="shell bento-section reveal-block">
        <article className="bento-card bento-wide">
          <p className="eyebrow">Before GitVersify</p>
          <h3>Release day becomes a writing task nobody planned for.</h3>
          <p>
            Teams scan commit logs, decode developer shorthand, paste drafts
            into docs, and still publish notes that miss the actual user value.
          </p>
        </article>
        <article className="bento-card bento-image" aria-label="Release workspace visual" />
        <article className="bento-card">
          <p className="metric">30</p>
          <p>recent commits converted into one structured draft.</p>
        </article>
        <article className="bento-card inverted">
          <p className="metric">4</p>
          <p>steps from GitHub login to published release.</p>
        </article>
        <article className="bento-card">
          <p className="metric">1</p>
          <p>place to generate, edit, and publish.</p>
        </article>
      </section>

      <section className="shell flow-section reveal-block">
        <div className="section-kicker compact">
          <p className="eyebrow">Use flow</p>
          <h2>One path from repository noise to published release.</h2>
        </div>
        <div className="flow-track">
          <div><span>1</span>Connect GitHub</div>
          <div><span>2</span>Pick a repo</div>
          <div><span>3</span>Select release range</div>
          <div><span>4</span>Generate and edit</div>
          <div><span>5</span>Publish release</div>
        </div>
      </section>

      <section className="shell action-section">
        <h2>Make the changelog the last mile, not the slowest mile.</h2>
        <a className="button button-primary" href="/api/auth/github">
          <span>Start with GitHub</span>
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
