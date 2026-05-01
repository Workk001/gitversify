export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      padding: '40px',
    }}>

      <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-1px' }}>
        shiplog
      </h1>

      <p style={{ fontSize: '18px', color: '#888', textAlign: 'center', maxWidth: '420px', lineHeight: '1.6' }}>
        Connect your GitHub. Every release tag automatically becomes a human-readable changelog.
      </p>

      <a href="/api/auth/github" style={{
        background: '#fff',
        color: '#000',
        padding: '12px 28px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '15px',
        textDecoration: 'none',
      }}>
        Login with GitHub
      </a>

      <p style={{ fontSize: '13px', color: '#555' }}>
        Free for 3 repos. No credit card needed.
      </p>

    </main>
  )
}