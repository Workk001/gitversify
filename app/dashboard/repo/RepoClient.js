'use client'

import { useEffect, useRef, useState } from 'react'

export default function RepoClient({ commits, releases, owner, repo }) {
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
    const draftPanelRef = useRef(null)

    useEffect(() => {
        if (!changelog || published) return

        const frame = requestAnimationFrame(() => {
            draftPanelRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
            draftPanelRef.current?.focus({ preventScroll: true })
        })

        return () => cancelAnimationFrame(frame)
    }, [changelog, published])

    async function handleBaseTagChange(newTag) {
        setBaseTag(newTag)
        setChangelog(null)
        setPublished(null)
        setError(null)

        if (!newTag) {
            setActiveCommits(commits)
            return
        }

        setLoadingCommits(true)
        try {
            const params = new URLSearchParams({ owner, repo, base: newTag })
            const res = await fetch(`/api/commits?${params}`)
            const data = await res.json()

            if (!res.ok || data.error) {
                setActiveCommits([])
                setError(data.error || 'Could not fetch commits for that tag.')
                return
            }

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

            if (!res.ok || data.error) {
                setError(data.error || 'Could not generate the changelog.')
                return
            }

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
        const cleanTagName = tagName.trim()

        try {
            const res = await fetch('/api/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ owner, repo, tagName: cleanTagName, changelog: editedChangelog }),
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
        <main id="main-content" className="app-page">
            <section className="shell repo-shell">
                <a href="/dashboard" className="back-link">&lt;- Back to repositories</a>

                <header className="repo-header">
                    <div>
                        <p className="eyebrow">Step 2</p>
                        <h1>{owner}/{repo}</h1>
                        <p className="section-copy">
                            Choose the commit range, generate the draft, review the
                            wording, then publish the release.
                        </p>
                    </div>
                    <div className="status-pill">
                        {loadingCommits ? 'Syncing commits' : `${activeCommits.length} commits ready`}
                    </div>
                </header>

                <div className="release-steps brutal-card" aria-label="Release generation steps">
                    <div className="step is-complete"><span>1</span>Repo</div>
                    <div className="step is-active"><span>2</span>Range</div>
                    <div className={`step ${changelog ? 'is-complete' : ''}`}><span>3</span>Draft</div>
                    <div className={`step ${published ? 'is-complete' : ''}`}><span>4</span>Publish</div>
                </div>

                <div className="workspace-grid">
                    <section className="tool-panel brutal-card">
                        <div className="panel-heading stacked">
                            <div>
                                <h2>Release range</h2>
                                <p>Choose what commits GitVersify should read.</p>
                            </div>
                        </div>

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
                                {loading ? 'Writing draft...' : 'Generate draft ->'}
                            </button>
                        )}

                        {error && <p className="error-message">{error}</p>}
                    </section>

                    <section className="commit-panel brutal-card">
                        <div className="panel-heading">
                            <div>
                                <h2>Change set</h2>
                                <p>{loadingCommits ? 'Loading commits...' : `${activeCommits.length} commits selected`}</p>
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
                    <section
                        ref={draftPanelRef}
                        tabIndex={-1}
                        className="editor-panel brutal-card"
                    >
                        <div className="panel-heading editor-heading">
                            <div>
                                <h2>Release draft</h2>
                                <p>Edit the language before publishing.</p>
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
                                disabled={publishing || !tagName.trim()}
                                className="button button-success"
                            >
                                {publishing ? 'Publishing...' : 'Publish release ->'}
                            </button>
                        </div>
                        <p className="helper-text">
                            Enter a new version tag. It must be different from previous releases.
                        </p>
                    </section>
                )}

                {published && (
                    <section className="success-panel brutal-card">
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
