<script setup lang="ts">
import HeaderBanner from '~/components/common/HeaderBanner.vue'
import { useSeo } from '~/composables/useSeo'
const pageTitle = "C\u1ed9ng \u0111\u1ed3ng"
const pageSubtitle = "N\u01a1i k\u1ebft n\u1ed1i ng\u01b0\u1eddi ch\u01a1i"
useSeo().applySeo({ title: pageTitle, description: pageSubtitle || "N\u01a1i k\u1ebft n\u1ed1i ng\u01b0\u1eddi ch\u01a1i", path: useRoute().fullPath })

import SectionHeader from '~/components/common/SectionHeader.vue'
import ErrorAlert from '~/components/common/ErrorAlert.vue'

const api = useApi()
const { data, error, pending } = await api.get('/community/list')
</script>

<template>
  <HeaderBanner :title="pageTitle" :subtitle="pageSubtitle" />
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
        <div v-for="(c, i) in (data?.communities || [])" :key="i" class="col-md-6 col-lg-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="fw-semibold mb-1">{{ c.name }}</div>
              <div class="small text-muted mb-2">{{ c.platform }}</div>
              <a :href="c.link" target="_blank" class="btn btn-sm btn-outline-primary">Tham gia</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
