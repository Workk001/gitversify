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
        <main style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            color: '#ededed',
            fontFamily: 'sans-serif',
            padding: '40px',
            maxWidth: '800px',
        }}>
            <a href="/dashboard" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← Back</a>

            <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '20px 0 8px' }}>{owner}/{repo}</h1>

            {/* Base release selector */}
            <div style={{ marginBottom: '28px' }}>
                <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '8px' }}>
                    Generate changelog since:
                </label>
                <select
                    value={baseTag}
                    onChange={e => handleBaseTagChange(e.target.value)}
                    style={{
                        background: '#111',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#ededed',
                        fontSize: '14px',
                        minWidth: '200px',
                    }}
                >
                    <option value="">All commits (no previous release)</option>
                    {hasReleases && releases.map(r => (
                        <option key={r.id} value={r.tag_name}>{r.tag_name}</option>
                    ))}
                </select>
            </div>

            {/* Commits list */}
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>
                {loadingCommits ? 'Loading commits...' : `${activeCommits.length} commits`}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
                {activeCommits.map(commit => (
                    <div key={commit.sha} style={{
                        background: '#111',
                        border: '1px solid #222',
                        borderRadius: '8px',
                        padding: '14px 18px',
                    }}>
                        <div style={{ fontSize: '14px', marginBottom: '6px' }}>
                            {(commit.commit?.message || '').split('\n')[0]}
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <span style={{ color: '#888', fontSize: '12px' }}>{commit.commit?.author?.name}</span>
                            <span style={{ color: '#555', fontSize: '12px', fontFamily: 'monospace' }}>{commit.sha?.slice(0, 7)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Generate */}
            {!changelog && (
                <button
                    onClick={generateChangelog}
                    disabled={loading || loadingCommits || activeCommits.length === 0}
                    style={{
                        background: loading ? '#333' : '#fff',
                        color: loading ? '#888' : '#000',
                        padding: '12px 28px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '15px',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Generating...' : 'Generate Changelog →'}
                </button>
            )}

            {error && <p style={{ color: '#f87171', margin: '16px 0' }}>{error}</p>}

            {/* Changelog editor */}
            {changelog && !published && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Generated Changelog</h2>
                        <button
                            onClick={generateChangelog}
                            disabled={loading}
                            style={{
                                background: 'transparent',
                                color: '#888',
                                border: '1px solid #333',
                                padding: '6px 14px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                cursor: 'pointer',
                            }}
                        >
                            {loading ? 'Regenerating...' : 'Regenerate'}
                        </button>
                    </div>

                    <textarea
                        value={editedChangelog}
                        onChange={e => setEditedChangelog(e.target.value)}
                        style={{
                            width: '100%',
                            minHeight: '280px',
                            background: '#111',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            padding: '20px',
                            color: '#ededed',
                            fontSize: '14px',
                            lineHeight: '1.8',
                            fontFamily: 'sans-serif',
                            resize: 'vertical',
                            marginBottom: '20px',
                        }}
                    />

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={tagName}
                            onChange={e => setTagName(e.target.value)}
                            placeholder="v2.0.0"
                            style={{
                                background: '#111',
                                border: '1px solid #333',
                                borderRadius: '8px',
                                padding: '12px 16px',
                                color: '#ededed',
                                fontSize: '14px',
                                width: '140px',
                            }}
                        />
                        <button
                            onClick={publishRelease}
                            disabled={publishing || !tagName}
                            style={{
                                background: publishing || !tagName ? '#333' : '#238636',
                                color: publishing || !tagName ? '#888' : '#fff',
                                padding: '12px 28px',
                                borderRadius: '8px',
                                fontWeight: '600',
                                fontSize: '15px',
                                border: 'none',
                                cursor: publishing || !tagName ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {publishing ? 'Publishing...' : 'Publish to GitHub →'}
                        </button>
                    </div>
                    <p style={{ color: '#555', fontSize: '13px', marginTop: '10px' }}>
                        Enter a new version tag — must be different from previous releases.
                    </p>
                </div>
            )}

            {/* Success */}
            {published && (
                <div style={{
                    background: '#0d2818',
                    border: '1px solid #238636',
                    borderRadius: '12px',
                    padding: '28px',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎉</div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Release published!</h2>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>Your changelog is now live on GitHub.</p>
                    <a
                    href={published}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        background: '#238636',
                        color: '#fff',
                        padding: '10px 24px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '14px',
                    }}
          >
                    View on GitHub →
                </a>
        </div>
    )
}
    </main >
  )
}