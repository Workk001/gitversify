import { cookies } from 'next/headers'

export async function GET(request) {
    const code = new URL(request.url).searchParams.get('code')

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        }),
    })

    const tokenData = await tokenRes.json()
    const accessToken = tokenData.access_token

    // Store token in a secure cookie instead of the URL
    const cookieStore = await cookies()
    cookieStore.set('github_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
    })

    return Response.redirect(new URL('/dashboard', request.url))
}