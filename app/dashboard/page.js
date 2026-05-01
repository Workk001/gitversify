import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function getGithubUser(token) {
    const res = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
        },
    })
    return res.json()
}

async function getGithubRepos(token) {
    const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=20', {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
        },
    })
    return res.json()
}

export default async function Dashboard() {
    const cookieStore = await cookies()
    const token = cookieStore.get('github_token')?.value

    if (!token) redirect('/')

    const user = await getGithubUser(token)
    const repos = await getGithubRepos(token)

    return (
        <main style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            color: '#ededed',
            fontFamily: 'sans-serif',
            padding: '40px',
        }}>

            {/* User profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                <img
                    src={user.avatar_url}
                    alt={user.login}
                    style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                />
                <div>
                    <div style={{ fontWeight: '600', fontSize: '16px' }}>{user.name}</div>
                    <div style={{ color: '#888', fontSize: '14px' }}>@{user.login}</div>
                </div>
            </div>

            {/* Repos list */}
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
                Your Repositories
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '600px' }}>
                {repos.map(repo => (
                    <a
                    key = { repo.id }
            href = {`/dashboard/repo?owner=${repo.owner.login}&repo=${repo.name}`}
                style={{
                    background: '#111',
                    border: '1px solid #222',
                    borderRadius: '8px',
                    padding: '16px 20px',
                    textDecoration: 'none',
                    color: '#ededed',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
          >
                <div>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>{repo.name}</div>
                    <div style={{ color: '#888', fontSize: '13px' }}>
                        {repo.description || 'No description'}
                    </div>
                </div>
                <div style={{ color: '#555', fontSize: '13px' }}>→</div>
            </a>
        ))}
        </div>

    </main >
  )
}