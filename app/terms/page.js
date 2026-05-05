import Link from "next/link";

export default function TermsPage() {
  return (
    <main id="main-content" className="app-page">
      <section className="shell legal-shell">
        <Link className="back-link" href="/">
          &lt;- Back to GitVersify
        </Link>
        <p className="eyebrow">Terms</p>
        <h1>Review generated release notes before publishing.</h1>
        <div className="legal-panel brutal-card">
          <p>
            GitVersify drafts changelogs from commit history, but you are
            responsible for reviewing the generated content before publishing a
            GitHub release.
          </p>
          <p>
            The app publishes releases only after you choose a repository, enter
            a version tag, and confirm the publish action.
          </p>
          <p>
            Use repository access responsibly and only connect GitHub accounts
            where you have permission to read commits and create releases.
          </p>
        </div>
      </section>
    </main>
  );
}
