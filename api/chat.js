export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed.' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return response.status(500).json({ error: 'GEMINI_API_KEY is not configured in Vercel.' })
  }

  const { messages } = request.body || {}
  if (!Array.isArray(messages) || messages.length === 0) {
    return response.status(400).json({ error: 'A question is required.' })
  }

  const contents = messages
    .filter((message) => message?.text && (message.role === 'user' || message.role === 'assistant'))
    .slice(-12)
    .map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.text }],
    }))

  try {
    const geminiResponse = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: 'You are ChatPilot, a precise and encouraging learning assistant. Answer the user directly, explain unfamiliar ideas clearly, and use Google Search grounding when the question needs current or factual web information. Do not claim you searched if you did not. Use short paragraphs and simple markdown when helpful.' }],
          },
          contents,
          tools: [{ googleSearch: {} }],
generationConfig: { maxOutputTokens: 1200 },        }),
      },
    )

    const data = await geminiResponse.json()
    if (!geminiResponse.ok) {
      return response.status(geminiResponse.status).json({ error: data.error?.message || 'The AI service could not answer.' })
    }

    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim()
    if (!text) return response.status(502).json({ error: 'The AI service returned an empty answer.' })

    return response.status(200).json({ text })
  } catch {
    return response.status(500).json({ error: 'The AI service is temporarily unavailable.' })
  }
}
