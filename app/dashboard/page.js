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
        <main id="main-content" className="app-page">
            <section className="shell dashboard-shell">
                <header className="dashboard-header">
                    <a className="brand" href="/dashboard">
                        <span className="brand-mark">G</span>
                        GitVersify
                    </a>
                    <div className="nav-coordinates">CONNECTED WORKSPACE</div>

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

                <div className="dashboard-intro">
                    <div className="section-heading">
                        <p className="eyebrow">Pick the source of truth</p>
                        <h1>Choose the repository. The release story starts there.</h1>
                        <p className="section-copy">
                            Start with a repository. GitVersify will read recent commits,
                            compare them against your releases, and prepare the next changelog.
                        </p>
                    </div>

                    <div className="workflow-card brutal-card" aria-label="Release workflow">
                        <p className="workflow-label">Release machine</p>
                        <ol>
                            <li><span>1</span>Repository</li>
                            <li><span>2</span>Release range</li>
                            <li><span>3</span>Changelog draft</li>
                            <li><span>4</span>GitHub release</li>
                        </ol>
                    </div>
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
                            <span className="repo-action">Prepare release</span>
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
