export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface HttpRequest {
  url: string
  method?: HttpMethod
  query?: Record<string, string | number | boolean | undefined>
  body?: unknown
  headers?: Record<string, string>
  credentials?: RequestCredentials
  signal?: AbortSignal
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
    public readonly url: string,
  ) {
    super(`HTTP ${status}: ${body}`)
  }
}

function buildQuery(query?: HttpRequest['query']) {
  if (!query) return ''

  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      params.append(key, String(value))
    }
  }

  const stringParams = params.toString()
  return stringParams ? `?${stringParams}` : ''
}

async function parseResponse<T>(res: Response): Promise<T> {
  return (await res.json()) satisfies T
}

export async function http<T = unknown>(req: HttpRequest): Promise<T> {
  const { url, method = 'GET', query, body, headers, credentials = 'omit', signal } = req

  const finalUrl = url + buildQuery(query)

  const res = await fetch(finalUrl, {
    method,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
    credentials,
    signal,
  })

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '')
    throw new HttpError(res.status, errorBody, finalUrl)
  }

  return await parseResponse<T>(res)
}
