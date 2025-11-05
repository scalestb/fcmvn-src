export function useSeo () {
  const runtime = useRuntimeConfig()
  const appUrl = (runtime.public as any)?.APP_URL || 'http://localhost:2025'
  function absoluteUrl (path?: string) {
    try {
      const p = path || useRoute().fullPath || '/'
      return new URL(p, appUrl).toString()
    } catch { return appUrl }
  }
  function applySeo (opts: { title: string, description?: string, image?: string, path?: string }) {
    const title = opts.title || 'FCMVN'
    const description = opts.description || 'FCMVN — Prototype'
    const url = absoluteUrl(opts.path)
    const image = opts.image || '/favicon.png'
    useSeoMeta({
      title, description,
      ogTitle: title, ogDescription: description, ogUrl: url, ogImage: image,
      twitterCard: 'summary_large_image', twitterTitle: title, twitterDescription: description, twitterImage: image
    })
    useHead({ link: [{ rel: 'canonical', href: url }] })
  }
  return { applySeo }
}
