import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
    const { commits, repoName } = await request.json()

    const commitText = commits
        .map(c => `- ${c.message}`)
        .join('\n')

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `You are a changelog writer for software projects.

Given these git commits from the repo "${repoName}", write a clean, human-readable changelog.

Rules:
- Group entries under "## What's New", "## Improvements", or "## Bug Fixes"
- Only include sections that have entries
- Write in plain English — no technical jargon, no file names, no function names
- Skip meaningless commits like "wip", "fix", "test", "merge branch", "initial commit"
- Each entry starts with a bullet point (•)
- Be concise but descriptive — one clear sentence per entry
- Write for users, not developers

Commits:
${commitText}

Write only the changelog. No intro, no explanation, just the changelog sections.`

    const result = await model.generateContent(prompt)
    const changelog = result.response.text()

    return Response.json({ changelog })
}