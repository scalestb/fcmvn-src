<!-- pages/posts/[id].vue -->
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

// ==== Utils chung ====
function fmtDate(d?: string) {
  try {
    if (!d) return ''
    const date = new Date(d.replace(' ', 'T'))
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
    if (/^https?:\/\//i.test(u)) return u
    return new URL(u, appUrl).toString()
  } catch { return u }
}
function isExternal(link?: string) {
  return !!link && /^(?:https?:)?\/\//i.test(link)
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
  useSeoMeta({
    ogType: 'article',
    articlePublishedTime: p.date || undefined,
    twitterCard: 'summary_large_image',
    twitterImage: img || undefined
  })
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

/* ============================
   FORMATION — sân + toạ độ
   ============================ */
// Toạ độ mặc định (0..100): left/top theo % trên sân
const POS_MAP: Record<string, {x:number,y:number}> = {
  GK:{x:50,y:92},
  SW:{x:50,y:86},
  LB:{x:18,y:78}, LFB:{x:18,y:78},
  'CB-L':{x:42,y:80}, 'CB-R':{x:58,y:80},
  CB:{x:50,y:80},
  RB:{x:82,y:78}, RFB:{x:82,y:78},

  'CDM-L':{x:42,y:60}, 'CDM-R':{x:58,y:60}, CDM:{x:50,y:60},
  'CM-L':{x:45,y:52}, 'CM-R':{x:55,y:52}, CM:{x:50,y:52},
  CAM:{x:50,y:44},

  LW:{x:20,y:46}, LM:{x:25,y:50},
  RW:{x:80,y:46}, RM:{x:75,y:50},

  ST:{x:50,y:22},
}

function expandRoles(positionObj:any){
  // positionObj ví dụ:
  // { GK:{GK:1}, DF:{LB:1,CB:2,RB:1}, MF:{CDM:2,LM:1,CAM:1,RM:1}, FW:{ST:1} }
  const out:string[] = []
  if (!positionObj) return out
  for (const group of ['GK','DF','MF','FW']){
    const roles = positionObj[group] || {}
    for (const role in roles){
      const count = Number(roles[role]) || 0
      for (let i=0;i<count;i++){
        // Đặt nhánh trái/phải nếu có 2 người
        if (role === 'CB' && count >= 2) out.push(i===0?'CB-L':'CB-R')
        else if (role === 'CDM' && count >= 2) out.push(i===0?'CDM-L':'CDM-R')
        else if (role === 'CM' && count >= 2) out.push(i===0?'CM-L':'CM-R')
        else out.push(role)
      }
    }
  }
  return out
}
function getPos(label:string){
  return POS_MAP[label] || POS_MAP[label.replace(/\d+$/,'')] || {x:50,y:50}
}

/* ============================
   TACTIC — UI giống ảnh
   ============================ */
function segCount(val:number, min:number, max:number, steps=4){
  if (max<=min) return 0
  const ratio = (val - min) / (max - min)
  return Math.round(Math.min(Math.max(ratio,0),1) * steps)
}
function optionIndex(options:any[] = [], value:any = null){
  const i = options.findIndex(o => String(o.value) === String(value))
  return i >= 0 ? i : 0
}
</script>

<template>
  <!-- Banner -->
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
              rel="noopener"
            >
              {{ (b.content && b.content.label) || 'Xem liên kết' }}
            </a>
          </div>

          <!-- formation block — SÂN TO, FULL WIDTH -->
          <div v-else-if="b.type === 'formation'" class="formation-block my-4">
            <div class="formation-title">
              Sơ đồ
              <span class="text-accent fw-bold ms-1">
                {{ b.content?.title || '—' }}
              </span>
            </div>

            <div class="formation-wrapper">
              <div class="formation-pitch">
                <div class="pitch">
                  <!-- Vạch sân -->
                  <div class="box box-top"></div>
                  <div class="box box-bottom"></div>
                  <div class="center-line"></div>
                  <div class="center-circle"></div>

                  <!-- Cầu thủ -->
                  <template
                    v-for="(label, idx) in expandRoles(b.content?.position)"
                    :key="idx"
                  >
                    <div
                      class="pos-dot"
                      :style="{ left: getPos(label).x + '%', top: getPos(label).y + '%' }"
                    >
                      {{ label.replace('-L','').replace('-R','') }}
                    </div>
                  </template>

                  <!-- Code sơ đồ ở góc sân -->
                  <div v-if="b.content?.title" class="formation-code-on-pitch">
                    {{ b.content.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- players block — danh sách cầu thủ gợi ý -->
          <div
            v-else-if="b.type === 'players'"
            class="players card my-3 border-subtle"
          >
            <div class="card-body">
              <h3 class="h6 mb-3">
                {{ b.content?.title || 'Danh sách cầu thủ' }}
              </h3>

              <div class="player-grid">
                <component
                  v-for="p in (b.content?.players || [])"
                  :key="p.id || p.link || p.name"
                  :is="isExternal(p.link) ? 'a' : 'NuxtLink'"
                  :href="isExternal(p.link) ? p.link : undefined"
                  :to="!isExternal(p.link) ? p.link : undefined"
                  class="player-card"
                  :target="isExternal(p.link) ? '_blank' : undefined"
                  rel="noopener"
                >
                  <div class="player-img">
                    <img
                      :src="p.image"
                      :alt="p.name"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div class="player-name">
                    <div class="fw-semibold">{{ p.name }}</div>
                    <div class="small text-uppercase">{{ p.position }}</div>
                  </div>
                </component>
              </div>
            </div>
          </div>

          <!-- tactic block — giao diện control giống ảnh -->
          <div v-else-if="b.type === 'tactic'" class="tactic card my-3">
            <div class="card-body">
              <h3 class="h6 mb-3">Thiết lập chiến thuật</h3>

              <div
                v-for="(panel, pi) in b.content?.panel || []"
                :key="pi"
                class="tactic-panel mb-3"
              >
                <button class="tp-head w-100 text-start" type="button" data-bs-toggle="collapse"
                        :data-bs-target="`#tp-${pi}`" aria-expanded="true">
                  <span class="tp-title">{{ panel.title }}</span>
                  <i class="bi bi-chevron-down ms-auto"></i>
                </button>

                <div class="collapse show" :id="`tp-${pi}`">
                  <div class="tp-body">
                    <p v-if="panel.description" class="small text-muted mb-3">{{ panel.description }}</p>

                    <div v-for="(it, ii) in panel.items || []" :key="ii" class="tp-row">
                      <div class="tp-label">{{ it.title }}</div>

                      <!-- slider style phân đoạn -->
                      <div v-if="it.type==='slider'" class="tp-slider">
                        <button type="button" class="tp-round" disabled>−</button>
                        <div class="tp-bar">
                          <span
                            v-for="s in 4"
                            :key="s"
                            class="seg"
                            :class="{ active: s <= segCount(Number(it.value||0), Number(it.min||0), Number(it.max||3), 4) }"
                          />
                        </div>
                        <button type="button" class="tp-round" disabled>+</button>
                      </div>

                      <!-- select style với dots + giá trị -->
                      <div v-else-if="it.type==='select'" class="tp-select">
                        <button type="button" class="tp-round" disabled>‹</button>
                        <div class="tp-value">
                          {{ (it.options || []).find(o=>String(o.value)===String(it.value))?.label || it.value }}
                          <div class="dots">
                            <span
                              v-for="(o, oi) in (it.options || [])"
                              :key="o.value"
                              :class="{ on: oi === optionIndex(it.options, it.value) }"
                            ></span>
                          </div>
                        </div>
                        <button type="button" class="tp-round" disabled>›</button>
                      </div>

                      <!-- fallback text -->
                      <div v-else class="tp-text small text-muted">
                        {{ it.value }}
                      </div>
                    </div>
                  </div>
                </div>
              </div> <!-- /each panel -->
            </div>
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
/* ======= Media max width ======= */
.content-media{ width:100%; max-width: 900px; margin:0 auto; }
.content-media img, .content-media video, .content-media iframe{
  display:block; margin:0 auto; border-radius:.5rem;
}

/* ======= Formation (Pitch) – sân to, full width ======= */
.formation-block{
  width: 100%;
}

/* tiêu đề ngay trên sân */
.formation-title{
  font-size: .95rem;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
  margin-bottom: .75rem;
}

/* khung bọc sân */
.formation-wrapper{
  width: 100%;
  max-width: 720px;         /* kích thước sân tối đa */
  margin: 0 auto;
  border-radius: 1rem;
  padding: 14px 16px 18px;
  background: radial-gradient(circle at top, #166534 0, #052e16 55%, #020617 100%);
  border: 1px solid rgba(255,255,255,.06);
}

/* sân dọc giống hình mẫu */
.formation-pitch{
  width: 100%;
}

.pitch{
  position:relative;
  width:100%;
  aspect-ratio: 3 / 4;      /* sân dọc; y 0..100 của POS_MAP vẫn chuẩn */
  background:
    repeating-linear-gradient(
      180deg,
      rgba(255,255,255,.06) 0 2px,
      transparent 2px 38px
    ),
    linear-gradient(#15803d,#166534);
  border-radius: 18px;
  box-shadow: inset 0 0 0 2px #ffffff40;
  overflow:hidden;
}

/* Đường sân */
.center-line{
  position:absolute; left:50%; top:0; bottom:0; width:2px; background:#fff8;
  transform:translateX(-50%);
}
.center-circle{
  position:absolute; left:50%; top:50%; width:26%; aspect-ratio:1/1;
  border:2px solid #fff8; border-radius:50%; transform:translate(-50%,-50%);
}
.box{ position:absolute; left:12%; width:76%; height:18%; border:2px solid #fff8; }
.box-top{ top:6%; }
.box-bottom{ bottom:6%; }

/* Cầu thủ – vòng tròn lớn, dễ nhìn */
.pos-dot{
  position:absolute;
  transform:translate(-50%,-50%);
  width:52px;
  height:52px;
  border-radius:50%;
  background:#e11d48;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#fff;
  font-weight:700;
  font-size:.82rem;
  box-shadow:0 2px 12px rgba(0,0,0,.35);
  letter-spacing:.2px;
  user-select:none;
}

/* code sơ đồ ở góc sân */
.formation-code-on-pitch{
  position:absolute;
  left:14px;
  bottom:10px;
  font-weight:700;
  font-size:.95rem;
  color:#fff;
  text-shadow:0 0 4px rgba(0,0,0,.7);
}

/* Mobile: co nhỏ nhưng vẫn chiếm full hàng */
@media (max-width: 576px){
  .formation-wrapper{
    max-width:100%;
    padding:10px 10px 12px;
  }
  .pitch{
    border-radius: 14px;
  }
  .pos-dot{
    width:40px;
    height:40px;
    font-size:.7rem;
  }
}

/* ======= Tactic panel (giống ảnh) ======= */
.tactic .card-body{ padding:1rem; }
.tactic-panel{ background:#0f141c; border:1px solid rgba(255,255,255,.06); border-radius:.75rem; overflow:hidden; }
.tp-head{
  display:flex; align-items:center; gap:.75rem;
  padding:.75rem 1rem; border:0; background:#0f141c; color:#e6edf3;
}
.tp-head .tp-title{ font-weight:600; letter-spacing:.4px; text-transform:uppercase; }
.tp-head .bi{ opacity:.7; }

/* hàng item */
.tp-body{ padding: .5rem 1rem 1rem; }
.tp-row{ display:grid; grid-template-columns: 160px 1fr; gap:12px; align-items:center; padding:.5rem 0; border-top:1px solid rgba(255,255,255,.06); }
.tp-row:first-child{ border-top:0; }
.tp-label{ color:#9aa5b1; font-size:.8rem; text-transform:uppercase; }

/* nút tròn – / + / ‹ / › (chỉ trang trí) */
.tp-round{
  width:34px; height:34px; border-radius:50%;
  display:inline-flex; align-items:center; justify-content:center;
  background:#1a2230; color:#e6edf3;
  border:2px solid var(--c-accent);
  font-weight:700; line-height:1; opacity:.9;
}
.tp-round:disabled{ opacity:.8; }

/* slider phân đoạn */
.tp-slider{ display:flex; align-items:center; gap:10px; }
.tp-bar{
  flex:1; display:grid; grid-template-columns: repeat(4, 1fr); gap:8px;
  background:#0e1117; padding:6px; border-radius:.5rem; border:1px solid rgba(255,255,255,.08);
}
.tp-bar .seg{
  display:block; height:10px; border-radius:10px;
  background:#2b313c;
}
.tp-bar .seg.active{ background: var(--c-accent); }

/* select + dot indicator */
.tp-select{ display:flex; align-items:center; gap:10px; }
.tp-value{
  flex:1; text-align:center; font-weight:700; background:#0e1117; border:1px solid rgba(255,255,255,.08);
  padding:.5rem; border-radius:.5rem; letter-spacing:.4px;
}
.tp-value .dots{
  display:flex; gap:6px; justify-content:center; margin-top:6px;
}
.tp-value .dots span{
  width:8px; height:8px; border-radius:50%; background:#2b313c; display:inline-block;
}
.tp-value .dots span.on{ background: var(--c-accent); }

/* ======= Misc ======= */
.border-subtle{ border:1px solid rgba(255,255,255,.08); }

/* Players grid (nếu có trong post) */
.player-grid{
  display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:16px;
}
@media (min-width: 992px){
  .player-grid{ grid-template-columns: repeat(4, minmax(0,1fr)); }
}
.player-card{ text-decoration:none; color:inherit; display:block; }
.player-img{
  background:#11161f; border-radius:18px; padding:10px; aspect-ratio:3/4;
  display:flex; align-items:center; justify-content:center;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.06);
  transition: transform .08s ease, box-shadow .2s ease;
}
.player-img img{ width:100%; height:100%; object-fit:contain; border-radius:12px; }
.player-card:hover .player-img{
  box-shadow: 0 0 0 1px var(--c-accent), 0 6px 20px rgba(3,152,85,.15);
  transform: translateY(-1px);
}
.player-name{ text-align:center; margin-top:.5rem; }
.player-name .small{ color:#9aa5b1; }

/* Media nhỏ */
@media (max-width: 576px){
  .content-media{ max-width:100%; }
  .tp-row{ grid-template-columns: 120px 1fr; }
}
</style>
