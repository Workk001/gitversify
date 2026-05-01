'use client'

import { useState } from 'react'

export default function RepoClient({ commits, releases, owner, repo, token }) {
    const hasReleases = releases && releases.length > 0
    const [baseTag, setBaseTag] = useState(hasReleases ? releases[0].tag_name : '')
    const [activeCommits, setActiveCommits] = useState(commits)
    const [loadingCommits, setLoadingCommits] = useState(false)
    const [changelog, setChangelog] = useState(null)
    const [loading, setLoading] = useState(false)
    const [publishing, setPublishing] = useState(false)
    const [published, setPublished] = useState(null)
    const [error, setError] = useState(null)
    const [tagName, setTagName] = useState('')
    const [editedChangelog, setEditedChangelog] = useState(null)

    async function handleBaseTagChange(newTag) {
        setBaseTag(newTag)
        setChangelog(null)
        setPublished(null)

        if (!newTag) {
            setActiveCommits(commits)
            return
        }

        setLoadingCommits(true)
        try {
            const res = await fetch(
                `/api/commits?owner=${owner}&repo=${repo}&base=${newTag}`
            )
            const data = await res.json()
            setActiveCommits(data.commits)
        } catch (e) {
            setError('Could not fetch commits for that tag.')
        } finally {
            setLoadingCommits(false)
        }
    }

    async function generateChangelog() {
        setLoading(true)
        setError(null)
        setPublished(null)

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commits: activeCommits.map(c => ({
                        message: (c.commit?.message || c.message || '').split('\n')[0],
                        sha: c.sha?.slice(0, 7) || '',
                    })),
                    repoName: `${owner}/${repo}`,
                }),
            })

            const data = await res.json()
            setChangelog(data.changelog)
            setEditedChangelog(data.changelog)
        } catch (err) {
            setError('Something went wrong generating. Try again.')
        } finally {
            setLoading(false)
        }
    }

    async function publishRelease() {
        setPublishing(true)
        setError(null)

        try {
            const res = await fetch('/api/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ owner, repo, tagName, changelog: editedChangelog }),
            })

            const data = await res.json()

            if (data.error) {
                setError(`GitHub error: ${data.error}`)
            } else {
                setPublished(data.url)
            }
        } catch (err) {
            setError('Something went wrong publishing. Try again.')
        } finally {
            setPublishing(false)
        }
    }

    return (
        <main className="app-page">
            <section className="shell repo-shell">
                <a href="/dashboard" className="back-link">&lt;- Back to repositories</a>

                <header className="repo-header">
                    <div>
                        <p className="eyebrow">Release workspace</p>
                        <h1>{owner}/{repo}</h1>
                    </div>
                    <div className="status-pill">
                        {loadingCommits ? 'Syncing commits' : `${activeCommits.length} commits ready`}
                    </div>
                </header>

                <div className="workspace-grid">
                    <section className="tool-panel">
                        <div className="field-group">
                            <label htmlFor="base-tag">Generate changelog since</label>
                            <select
                                id="base-tag"
                                value={baseTag}
                                onChange={e => handleBaseTagChange(e.target.value)}
                                className="input-control"
                            >
                                <option value="">All commits (no previous release)</option>
                                {hasReleases && releases.map(r => (
                                    <option key={r.id} value={r.tag_name}>{r.tag_name}</option>
                                ))}
                            </select>
                        </div>

                        {!changelog && (
                            <button
                                onClick={generateChangelog}
                                disabled={loading || loadingCommits || activeCommits.length === 0}
                                className="button button-primary full-width"
                            >
                                {loading ? 'Generating...' : 'Generate changelog ->'}
                            </button>
                        )}

                        {error && <p className="error-message">{error}</p>}
                    </section>

                    <section className="commit-panel">
                        <div className="panel-heading">
                            <div>
                                <h2>Recent commits</h2>
                                <p>{loadingCommits ? 'Loading commits...' : `${activeCommits.length} selected for generation`}</p>
                            </div>
                        </div>

                        <div className="commit-list">
                            {activeCommits.map(commit => (
                                <div key={commit.sha} className="commit-row">
                                    <div className="commit-message">
                                        {(commit.commit?.message || '').split('\n')[0]}
                                    </div>
                                    <div className="commit-meta">
                                        <span>{commit.commit?.author?.name}</span>
                                        <code>{commit.sha?.slice(0, 7)}</code>
                                    </div>
                                </div>
                            ))}
                            {activeCommits.length === 0 && (
                                <div className="empty-state compact">
                                    <h2>No commits to show</h2>
                                    <p>Choose another release range or repository.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {changelog && !published && (
                    <section className="editor-panel">
                        <div className="panel-heading editor-heading">
                            <div>
                                <h2>Generated changelog</h2>
                                <p>Review the draft, make edits, then publish it as a release.</p>
                            </div>
                            <button
                                onClick={generateChangelog}
                                disabled={loading}
                                className="button button-secondary"
                            >
                                {loading ? 'Regenerating...' : 'Regenerate'}
                            </button>
                        </div>

                        <textarea
                            value={editedChangelog}
                            onChange={e => setEditedChangelog(e.target.value)}
                            className="changelog-editor"
                        />

                        <div className="publish-row">
                            <input
                                type="text"
                                value={tagName}
                                onChange={e => setTagName(e.target.value)}
                                placeholder="v2.0.0"
                                className="input-control tag-input"
                            />
                            <button
                                onClick={publishRelease}
                                disabled={publishing || !tagName}
                                className="button button-success"
                            >
                                {publishing ? 'Publishing...' : 'Publish to GitHub ->'}
                            </button>
                        </div>
                        <p className="helper-text">
                            Enter a new version tag. It must be different from previous releases.
                        </p>
                    </section>
                )}

                {published && (
                    <section className="success-panel">
                        <div className="success-icon">OK</div>
                        <h2>Release published</h2>
                        <p>Your changelog is now live on GitHub.</p>
                        <a
                            href={published}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button button-success"
                        >
                            View on GitHub -&gt;
                        </a>
                    </section>
                )}
            </section>
        </main>
    )
}
