<script setup lang="ts">
import HeaderBanner from '~/components/common/HeaderBanner.vue'
import { useSeo } from '~/composables/useSeo'
const pageTitle = "Ph\u00e2n t\u00edch chi\u1ebfn thu\u1eadt"
const pageSubtitle = "Meta & c\u00e1ch v\u1eadn h\u00e0nh t\u1ed1i \u01b0u"
useSeo().applySeo({ title: pageTitle, description: pageSubtitle || "Meta & c\u00e1ch v\u1eadn h\u00e0nh t\u1ed1i \u01b0u", path: useRoute().fullPath })

import SectionHeader from '~/components/common/SectionHeader.vue'
import ErrorAlert from '~/components/common/ErrorAlert.vue'

const api = useApi()
const { data, error, pending } = await api.get('/tactics/meta')
</script>

<template>
  <HeaderBanner :title="pageTitle" :subtitle="pageSubtitle" />
  <div>
    <SectionHeader title="Phân tích chiến thuật — Meta" />
    <ErrorAlert :error="error" />
    <div v-if="pending">Đang tải dữ liệu...</div>

    <div v-else class="row g-3">
      <div class="col-md-8">
        <div class="card p-3 h-100">
          <h3 class="h6 text-primary mb-3">Meta hiện tại</h3>
          <ul class="list-group list-group-flush">
            <li v-for="(m, i) in (data?.meta || [])" :key="i" class="list-group-item">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{{ m.formation }}</strong>
                  <div class="small text-muted">{{ m.description }}</div>
                </div>
                <span class="badge bg-success">{{ m.rating }}/10</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card p-3 h-100">
          <h3 class="h6 text-primary mb-3">Top theo vị trí</h3>
          <ul class="list-group list-group-flush">
            <li v-for="(p, i) in (data?.byPosition || [])" :key="i" class="list-group-item">
              <strong>{{ p.position }}</strong>
              <div class="small text-muted">{{ p.players.join(', ') }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
