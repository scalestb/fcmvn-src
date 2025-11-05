<script setup lang="ts">
import HeaderBanner from '~/components/common/HeaderBanner.vue'
import { useSeo } from '~/composables/useSeo'
const pageTitle = "Trang ch\u1ee7"
const pageSubtitle = "T\u1ed5ng quan & n\u1ed9i dung n\u1ed5i b\u1eadt"
useSeo().applySeo({ title: pageTitle, description: pageSubtitle || "T\u1ed5ng quan & n\u1ed9i dung n\u1ed5i b\u1eadt", path: useRoute().fullPath })

import SectionHeader from '~/components/common/SectionHeader.vue'
import ErrorAlert from '~/components/common/ErrorAlert.vue'

const api = useApi()
const { data, error, pending } = await api.get('/home')
</script>

<template>
  <HeaderBanner :title="pageTitle" :subtitle="pageSubtitle" image="/imgs/banners/home_01.png" :backgroundCover="true" :height="200" />
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
              <li v-for="(n, i) in (data?.news || [])" :key="i" class="list-group-item">
                <strong>{{ n.title }}</strong>
                <div class="small text-muted">{{ n.source }}</div>
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
                <img :src="p.image" class="card-img-top" :alt="p.name">
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
