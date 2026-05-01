import { cookies } from 'next/headers'

export async function GET(request) {
    const cookieStore = await cookies()
    const token = cookieStore.get('github_token')?.value

    if (!token) return Response.json({ error: 'Not authenticated' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const owner = searchParams.get('owner')
    const repo = searchParams.get('repo')
    const base = searchParams.get('base')

    const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/compare/${base}...HEAD`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
            },
        }
    )

    const data = await res.json()
    return Response.json({ commits: data.commits || [] })
}