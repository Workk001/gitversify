import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="app-page">
      <section className="shell legal-shell not-found-shell">
        <p className="eyebrow">404</p>
        <h1>This release route does not exist.</h1>
        <p className="section-copy">
          Return to the product entry point and connect GitHub to start a real
          release flow.
        </p>
        <Link className="button button-primary" href="/">
          <span>Back home</span>
          <span className="button-mark">-&gt;</span>
        </Link>
      </section>
    </main>
  );
}
