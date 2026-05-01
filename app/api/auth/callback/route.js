import { cookies } from 'next/headers'

export async function GET(request) {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')

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

    const cookieStore = await cookies()
    cookieStore.set('github_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
    })

    // Build a clean redirect URL with no query params
    const cleanRedirect = `${url.protocol}//${url.host}/dashboard`
    return Response.redirect(cleanRedirect, 302)
}