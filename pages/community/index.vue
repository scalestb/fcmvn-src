<script setup lang="ts">
import HeaderBanner from '~/components/common/HeaderBanner.vue'
import { useSeo } from '~/composables/useSeo'
const pageTitle = "Cộng đồng"
const pageSubtitle = "Nơi kết nối người chơi"
useSeo().applySeo({ title: pageTitle, description: pageSubtitle || "Nơi kết nối người chơi", path: useRoute().fullPath })

import SectionHeader from '~/components/common/SectionHeader.vue'
import ErrorAlert from '~/components/common/ErrorAlert.vue'

const api = useApi()
const { data, error, pending } = await api.get('/community/list')

// ✅ Sắp xếp: verified = true lên trước
const communities = computed(() => {
  const list = (data.value?.communities || []).slice()
  return list.sort((a: any, b: any) => Number(b?.verified) - Number(a?.verified))
})
</script>

<template>
  <HeaderBanner :title="pageTitle" :subtitle="pageSubtitle"  image="/imgs/banners/commu_01.png" :backgroundCover="true" :height="200" />

  <div>
    <SectionHeader title="Cộng đồng" />
    <ErrorAlert :error="error" />
    <div v-if="pending">Đang tải...</div>

    <div v-else>
      <div class="card p-3 mb-3">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <div class="fw-semibold">Đăng ký cộng đồng của bạn</div>
            <div class="small text-muted">Gửi link group/chat/fanpage để được hiển thị</div>
          </div>
          <NuxtLink to="#" class="btn btn-primary btn-sm disabled">Form (sắp có)</NuxtLink>
        </div>
      </div>

      <div class="row g-3">
        <!-- dùng computed đã sort -->
        <div v-for="(c, i) in communities" :key="i" class="col-md-6 col-lg-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex align-items-start justify-content-between">
                <div class="me-2">
                  <div class="fw-semibold mb-1">{{ c.name }}</div>
                  <div class="small text-muted">{{ c.platform }}</div>
                </div>
                <!-- ✅ Tag verified -->
                <span
                  class="badge"
                  :class="c.verified ? 'bg-success' : 'bg-secondary'"
                  :title="c.verified ? 'Đã xác minh' : 'Chưa xác minh'"
                >
                  {{ c.verified ? 'Đã xác minh' : 'Chưa xác minh' }}
                </span>
              </div>

              <a :href="c.link" target="_blank" class="btn btn-sm btn-outline-primary mt-3">
                Tham gia
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
