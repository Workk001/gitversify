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
        <main className="app-page">
            <section className="shell dashboard-shell">
                <header className="dashboard-header">
                    <a className="brand" href="/dashboard">
                        <span className="brand-mark">S</span>
                        shiplog
                    </a>

                    <div className="user-pill">
                        {/* GitHub avatars are already optimized and sized by GitHub. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={user.avatar_url}
                            alt={user.login}
                            className="avatar"
                        />
                        <div>
                            <div className="user-name">{user.name || user.login}</div>
                            <div className="muted">@{user.login}</div>
                        </div>
                    </div>
                </header>

                <div className="section-heading">
                    <p className="eyebrow">Connected workspace</p>
                    <h1>Your repositories</h1>
                    <p className="section-copy">
                        Pick a repository to generate release notes from its recent commits.
                    </p>
                </div>

                <div className="repo-list">
                    {repos.map(repo => (
                        <a
                            key={repo.id}
                            href={`/dashboard/repo?owner=${repo.owner.login}&repo=${repo.name}`}
                            className="repo-row"
                        >
                            <div>
                                <div className="repo-title">{repo.name}</div>
                                <div className="repo-description">
                                    {repo.description || 'No description provided'}
                                </div>
                            </div>
                            <span className="row-arrow">-&gt;</span>
                        </a>
                    ))}
                    {repos.length === 0 && (
                        <div className="empty-state">
                            <h2>No repositories found</h2>
                            <p>GitHub did not return any repositories for this account.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
