<script setup lang="ts">
import HeaderBanner from '~/components/common/HeaderBanner.vue'
import { useSeo } from '~/composables/useSeo'
const pageTitle = "B\u1ea3ng danh v\u1ecdng"
const pageSubtitle = "Nh\u1eefng g\u01b0\u01a1ng m\u1eb7t ti\u00eau bi\u1ec3u"
useSeo().applySeo({ title: pageTitle, description: pageSubtitle || "Nh\u1eefng g\u01b0\u01a1ng m\u1eb7t ti\u00eau bi\u1ec3u", path: useRoute().fullPath })

import SectionHeader from '~/components/common/SectionHeader.vue'
import ErrorAlert from '~/components/common/ErrorAlert.vue'

const api = useApi()
const { data, error, pending } = await api.get('/hof/list')
</script>

<template>
  <HeaderBanner :title="pageTitle" :subtitle="pageSubtitle" />
  <div>
    <SectionHeader title="Bảng danh vọng" />
    <ErrorAlert :error="error" />
    <div v-if="pending">Đang tải...</div>

    <div v-else class="row g-3">
      <div v-for="(p, i) in (data?.persons || [])" :key="i" class="col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100">
          <img :src="p.avatar" class="card-img-top" :alt="p.name">
          <div class="card-body">
            <div class="fw-semibold">{{ p.name }}</div>
            <div class="small text-muted">{{ p.role }}</div>
            <a :href="p.link" target="_blank" class="btn btn-sm btn-outline-primary mt-2">Xem</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
