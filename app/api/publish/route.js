import { cookies } from 'next/headers'

export async function POST(request) {
    const cookieStore = await cookies()
    const token = cookieStore.get('github_token')?.value

    if (!token) {
        return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { owner, repo, tagName, changelog } = await request.json()

    const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/releases`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tag_name: tagName,
                name: tagName,
                body: changelog,
                draft: false,
                prerelease: false,
            }),
        }
    )

    const data = await res.json()

    if (!res.ok) {
        return Response.json({ error: data.message }, { status: res.status })
    }

    return Response.json({ url: data.html_url })
}