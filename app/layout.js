import "./globals.css";

export const metadata = {
  title: "GitVersify",
  description: "AI-powered changelog generator for GitHub releases.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
