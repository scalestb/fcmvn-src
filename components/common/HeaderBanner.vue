<!-- components/common/HeaderBanner.vue -->
<template>
  <section
    class="banner border rounded-3 p-4 p-md-5 mb-4"
    :style="imgStyleSection"
  >
    <div class="row g-4 align-items-center">
      <div class="col-md-8">
        <h1 class="display-6 fw-bold mb-2">{{ title }}</h1>
        <p v-if="subtitle" class="lead mb-0 text-muted">{{ subtitle }}</p>
      </div>

      <!-- Ảnh bên phải (desktop) -->
      <div class="col-md-4 d-none d-md-block">
        <slot name="image">
          <img
            v-if="image"
            :src="image"
            :alt="imageAlt || title"
            class="banner-img img-fluid rounded-3"
            loading="lazy"
            decoding="async"
            :style="imgStyle"
          />
        </slot>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  /** URL ảnh banner (đặt trong /public để dùng đường dẫn tuyệt đối `/banners/xxx.jpg`) */
  image?: string
  imageAlt?: string
  /** Chiều cao ảnh cột phải (px hoặc chuỗi '180px','12rem'...). Mặc định 140px */
  height?: number | string
  /** Nếu muốn dùng ảnh làm nền full banner (tràn 2 cột), bật true */
  backgroundCover?: boolean
}>(), {
  height: 140,
  backgroundCover: false
})

function normalizeHeight(h: number | string | undefined, fallback = '140px') {
  if (typeof h === 'number') return `${h}px`
  if (typeof h === 'string' && h.trim()) return h
  return fallback
}

const imgStyle = computed(() => ({
  '--banner-img-h': normalizeHeight(props.height)
} as any))

const imgStyleSection = computed(() => {
  if (!props.backgroundCover || !props.image) return {}
  // Dùng ảnh làm NỀN toàn banner (cover)
  return {
    backgroundImage: `linear-gradient(135deg, rgba(10,15,22,.65), rgba(10,15,22,.55)), url('${props.image}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } as any
})
</script>

<style scoped>
.banner{
  background: linear-gradient(135deg, rgba(3,152,85,.2), rgba(3,152,85,.05));
  border-color: rgba(255,255,255,.08) !important;
}

/* Ảnh ở cột phải */
.banner-img{
  width: 100%;
  height: var(--banner-img-h, 140px);
  object-fit: cover;
  object-position: center;
  display: block;
}

/* Tăng chiều cao ảnh cột phải trên màn to nếu muốn */
@media (min-width: 992px){
  .banner-img{
    height: calc(var(--banner-img-h, 140px) + 40px);
  }
}
</style>
