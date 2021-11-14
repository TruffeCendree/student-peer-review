export const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

export class HttpError extends Error {
  constructor(message: string, public data: any) {
    super(message)
  }
}

export async function httpGet<T>(url: string): Promise<T> {
  return checkJsonStatus(await fetch(url, { method: 'GET', headers: jsonHeaders }))
}

export async function httpPost<T>(url: string, body: unknown): Promise<T> {
  return checkJsonStatus(await fetch(url, { method: 'POST', headers: jsonHeaders, body: JSON.stringify(body) }))
}

export async function httpPostMultipart<T>(url: string, body: FormData): Promise<T> {
  return checkJsonStatus(await fetch(url, { method: 'POST', headers: { Accept: 'application/json' }, body }))
}

async function checkJsonStatus(response: Response) {
  const json = await response.json()

  if (response.status >= 200 && response.status < 300) return json
  throw new HttpError('HTTP request failed', json)
}
