export function useApi() {
  const config = useRuntimeConfig()
  const isMock = String((config.public as any).USE_MOCK ?? '1') === '1'
  const apiBase = (config.public as any).API_BASE_URL || 'https://fcmvn.com/api'

  function makeUrl(endpoint: string) {
    if (isMock) return `/mock${endpoint}.json`
    return `/api/fcmvn${endpoint}`
  }

  async function get<T = any>(endpoint: string, opts: any = {}) {
    const url = makeUrl(endpoint)
    const DEBUG = process.dev
    if (DEBUG) console.log('[API][GET]', url, opts)
    const { data, error, pending, status } = await useFetch<T>(url, {
      ...opts,
      key: `GET:${url}`,
      onResponseError({ response }) {
        if (DEBUG) console.error('[API][ERR]', url, {
          statusCode: response?.status,
          statusMessage: response?.statusText,
          data: (response as any)?._data
        })
      }
    })
    return { data, error, pending, status }
  }

  return { get }
}
