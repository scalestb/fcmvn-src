<script setup lang="ts">
import HeaderBanner from '~/components/common/HeaderBanner.vue'
import SectionHeader from '~/components/common/SectionHeader.vue'
import ErrorAlert from '~/components/common/ErrorAlert.vue'
import { useSeo } from '~/composables/useSeo'

const pageTitle = 'Trang chủ'
const pageSubtitle = 'Tổng quan & nội dung nổi bật'
useSeo().applySeo({
  title: pageTitle,
  description: pageSubtitle,
  path: useRoute().fullPath
})

const api = useApi()
const { data, error, pending } = await api.get('/home')

// link nội bộ bắt đầu bằng 1 dấu / (không phải //)
const isInternal = (url?: string) => /^\/(?!\/)/.test(url || '')
</script>

<template>
  <HeaderBanner
    :title="pageTitle"
    :subtitle="pageSubtitle"
    image="/imgs/banners/home_01.png"
    :backgroundCover="true"
    :height="200"
  />

  <div>
    <SectionHeader title="Trang chủ" />
    <ErrorAlert :error="error" />
    <div v-if="pending">Đang tải dữ liệu...</div>

    <div v-else>
      <div class="row g-3">
        <div class="col-md-8">
          <div class="card p-3 h-100">
            <h3 class="h6 text-primary mb-3">Tin nổi bật</h3>

            <ul class="list-group list-group-flush">
              <li
                v-for="(n, i) in (data?.news || [])"
                :key="i"
                class="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2"
              >
                <template v-if="n?.link && isInternal(n.link)">
                  <!-- Link nội bộ -->
                  <NuxtLink :to="n.link" class="fw-semibold text-decoration-none">
                    {{ n.title }}
                  </NuxtLink>
                </template>
                <template v-else>
                  <!-- Link ngoài -->
                  <a
                    :href="n?.link || '#'"
                    :target="n?.target || '_blank'"
                    rel="noopener"
                    class="fw-semibold text-decoration-none"
                  >
                    {{ n.title }}
                  </a>
                </template>
              </li>
            </ul>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card p-3 h-100">
            <h3 class="h6 text-primary mb-3">Chủ đề nhanh</h3>
            <div class="d-grid gap-2">
              <NuxtLink to="/tactics" class="btn btn-outline-primary btn-sm">Meta & Chiến thuật</NuxtLink>
              <NuxtLink to="/guides" class="btn btn-outline-primary btn-sm">Hướng dẫn</NuxtLink>
              <NuxtLink to="/community" class="btn btn-outline-primary btn-sm">Cộng đồng</NuxtLink>
              <NuxtLink to="/lookup" class="btn btn-outline-primary btn-sm">Tra cứu</NuxtLink>
              <NuxtLink to="/hof" class="btn btn-outline-primary btn-sm">Bảng danh vọng</NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <div class="card p-3">
          <h3 class="h6 text-primary mb-3">Sản phẩm / Affiliate</h3>
          <div class="row g-3">
            <div v-for="(p, i) in (data?.affiliates || [])" :key="i" class="col-6 col-md-3">
              <div class="card h-100">
                <img :src="p.image" class="card-img-top" :alt="p.name" />
                <div class="card-body">
                  <div class="fw-semibold small">{{ p.name }}</div>
                  <a :href="p.link" target="_blank" class="btn btn-sm btn-primary mt-2">Xem</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
