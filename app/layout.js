import "./globals.css";

export const metadata = {
  title: "shiplog",
  description: "Generate and publish GitHub changelogs from recent commits.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
