import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import RepoClient from './RepoClient'

async function getCommits(token, owner, repo) {
    const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=30`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
            },
        }
    )
    return res.json()
}

async function getReleases(token, owner, repo) {
    const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/releases?per_page=10`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
            },
        }
    )
    return res.json()
}

async function getCommitsSince(token, owner, repo, baseTag) {
    const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/compare/${baseTag}...HEAD`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
            },
        }
    )
    const data = await res.json()
    return data.commits || []
}

export default async function RepoPage({ searchParams }) {
    const cookieStore = await cookies()
    const token = cookieStore.get('github_token')?.value

    if (!token) redirect('/')

    const params = await searchParams
    const owner = params.owner
    const repo = params.repo

    const [commits, releases] = await Promise.all([
        getCommits(token, owner, repo),
        getReleases(token, owner, repo),
    ])

    return (
        <RepoClient
            commits={commits}
            releases={releases}
            owner={owner}
            repo={repo}
            token={token}
        />
    )
}