import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main id="main-content" className="app-page">
      <section className="shell legal-shell">
        <Link className="back-link" href="/">
          &lt;- Back to GitVersify
        </Link>
        <p className="eyebrow">Privacy</p>
        <h1>GitVersify keeps the release workflow narrow.</h1>
        <div className="legal-panel brutal-card">
          <p>
            GitVersify uses GitHub OAuth to read repository metadata, commits,
            releases, and to publish releases when you ask it to.
          </p>
          <p>
            The app does not clone repositories. Changelog generation sends the
            selected commit messages to the configured AI provider so a release
            draft can be written.
          </p>
          <p>
            Authentication is stored in an HTTP-only cookie for the active app
            session. Remove the GitHub OAuth grant from your GitHub account to
            revoke access.
          </p>
        </div>
      </section>
    </main>
  );
}
