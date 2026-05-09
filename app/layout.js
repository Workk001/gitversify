import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "GitVersify",
  description: "AI-powered changelog generator for GitHub releases.",
  openGraph: {
    title: "GitVersify",
    description: "Turn GitHub commits into release notes and publish them back to GitHub.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
