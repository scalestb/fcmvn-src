<script setup lang="ts">
import HeaderBanner from '~/components/common/HeaderBanner.vue'
import SectionHeader from '~/components/common/SectionHeader.vue'
import ErrorAlert from '~/components/common/ErrorAlert.vue'
import { useSeo } from '~/composables/useSeo'

const route = useRoute()
const id = computed(() => String(route.params.id || ''))

// ==== API (mock: /mock/posts/:id.json khi USE_MOCK=1; real: /api/fcmvn/posts/:id) ====
const api = useApi()
const endpoint = computed(() => `/posts/${id.value}`)
const { data, error, pending } = await api.get(endpoint.value, { watch: [endpoint] })

// ==== Dữ liệu bài ====
const post = computed<any>(() => data.value || {})
const tags = computed(() => Array.isArray(post.value?.tags) ? post.value.tags : [])
const bannerImg = computed(() => post.value?.image || '')

// ==== Utils ====
function fmtDate(d?: string) {
  try {
    if (!d) return ''
    const date = new Date(d.replace(' ', 'T')) // "YYYY-MM-DD HH:mm:ss" -> pseudo ISO
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).format(date)
  } catch { return d || '' }
}

function firstTextExcerpt(p: any, max = 160) {
  try {
    const t = (p?.content || []).find((b: any) => b?.type === 'text')?.content || ''
    return String(t).replace(/\s+/g, ' ').trim().slice(0, max)
  } catch { return '' }
}

const runtime = useRuntimeConfig()
const appUrl = (runtime.public as any)?.APP_URL || 'http://localhost:2025'
function absUrl(path?: string) {
  try {
    const p = path || route.fullPath || '/'
    return new URL(p, appUrl).toString()
  } catch { return appUrl }
}
function absImage(u?: string) {
  if (!u) return ''
  try {
    // Nếu là /xxx thì build tuyệt đối theo APP_URL
    if (/^https?:\/\//i.test(u)) return u
    return new URL(u, appUrl).toString()
  } catch { return u }
}

// ==== SEO mặc định trước khi có data ====
const pageTitle = ref('Bài viết')
const pageSubtitle = ref('Chi tiết nội dung bài viết')
useSeo().applySeo({
  title: pageTitle.value,
  description: pageSubtitle.value,
  path: route.fullPath
})

// ==== SEO động khi data về ====
watchEffect(() => {
  const p = post.value
  if (!p || !p.title) return

  const desc = firstTextExcerpt(p, 160) || pageSubtitle.value
  const img = absImage(p.image)
  const url = absUrl()

  useSeo().applySeo({
    title: p.title,
    description: desc,
    path: route.fullPath,
    image: img
  })

  // Open Graph bổ sung + Twitter + Article
  useSeoMeta({
    ogType: 'article',
    articlePublishedTime: p.date || undefined,
    twitterCard: 'summary_large_image',
    twitterImage: img || undefined
  })

  // JSON-LD Article
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    description: desc,
    datePublished: p.date || undefined,
    image: img ? [img] : undefined,
    mainEntityOfPage: url
  }
  useHead({
    script: [{
      key: 'ld-article',
      type: 'application/ld+json',
      children: JSON.stringify(ld)
    }]
  })

  // Cập nhật banner title/subtitle hiển thị
  pageTitle.value = p.title
  pageSubtitle.value = desc
})

// ==== Video helpers ====
function isYoutube(url: string) {
  return /youtu\.be|youtube\.com/.test(url || '')
}
const ytEmbed = (url: string) => {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
    }
  } catch {}
  return ''
}
</script>

<template>
  <!-- Banner: lấy ảnh từ post.image (nếu có) -->
  <HeaderBanner
    :title="post?.title || pageTitle"
    :subtitle="pageSubtitle"
    :image="bannerImg || undefined"
    :backgroundCover="!!bannerImg"
  />

  <div>
    <ErrorAlert :error="error" />
    <div v-if="pending">Đang tải...</div>

    <div v-else>
      <!-- Tiêu đề + meta -->
      <div class="mb-3">
        <h1 class="h3 mb-2">{{ post?.title }}</h1>
        <div class="text-muted small d-flex flex-wrap align-items-center gap-2">
          <span v-if="post?.date">🗓️ {{ fmtDate(post.date) }}</span>
          <span v-if="tags?.length">•</span>
          <div v-if="tags?.length" class="d-flex flex-wrap gap-2">
            <span
              v-for="(t, i) in tags"
              :key="i"
              class="badge rounded-pill bg-secondary"
              :title="t.label || t.key"
            >
              {{ t.label || t.key }}
            </span>
          </div>
        </div>
      </div>

      <!-- Nội dung -->
      <div class="card p-3">
        <template v-for="(b, i) in (post?.content || [])" :key="i">
          <!-- title block -->
          <h2 v-if="b.type === 'title'" class="h5 mt-3 mb-2">
            {{ b.content }}
          </h2>

          <!-- text block -->
          <p v-else-if="b.type === 'text'" class="mb-3">
            {{ b.content }}
          </p>

          <!-- image block -->
          <figure v-else-if="b.type === 'image'" class="my-3 content-media">
  <img
    :src="b.content"
    class="img-fluid rounded d-block mx-auto"
    alt=""
    loading="lazy"
    decoding="async"
  />
</figure>

          <!-- video block -->
<div v-else-if="b.type === 'video'" class="my-3">
  <div class="ratio ratio-16x9 content-media">
    <iframe
      v-if="isYoutube(b.content)"
      :src="ytEmbed(b.content)"
      allowfullscreen
      loading="lazy"
      referrerpolicy="no-referrer"
    ></iframe>
    <video v-else :src="b.content" controls class="w-100 d-block mx-auto"></video>
  </div>
</div>

          <!-- redirect (link) block -->
          <div v-else-if="b.type === 'redirect'" class="my-3">
            <a
              :href="(b.content && b.content.url) || '#'"
              target="_blank"
              class="btn btn-sm btn-primary"
            >
              {{ (b.content && b.content.label) || 'Xem liên kết' }}
            </a>
          </div>

          <!-- fallback -->
          <pre v-else class="small text-muted bg-dark p-2 rounded">
Không hỗ trợ block: {{ b.type }}
          </pre>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Giới hạn chiều rộng media và căn giữa */
.content-media{
  width: 100%;
  max-width: 900px;          /* chỉnh theo ý bạn */
  margin-left: auto;
  margin-right: auto;
}

/* Bo góc + block-level để đảm bảo căn giữa */
.content-media img,
.content-media video,
.content-media iframe{
  display: block;
  margin: 0 auto;
  border-radius: .5rem;
}

/* Có thể thu hẹp hơn trên màn nhỏ nếu muốn */
@media (max-width: 576px){
  .content-media{ max-width: 100%; }
}
</style>
