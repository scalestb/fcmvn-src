<script setup lang="ts">
import SectionHeader from '~/components/common/SectionHeader.vue'
import ErrorAlert from '~/components/common/ErrorAlert.vue'

const api = useApi()
const { data, error, pending } = await api.get('/guides/tricks')
</script>

<template>
  <div>
    <SectionHeader title="Hướng dẫn & Thủ thuật" />
    <ErrorAlert :error="error" />
    <div v-if="pending">Đang tải...</div>

    <div v-else class="row g-3">
      <div v-for="(g, i) in (data?.guides || [])" :key="i" class="col-md-6">
        <div class="card h-100">
          <div class="card-body">
            <h3 class="h6">{{ g.title }}</h3>
            <p class="small text-muted">{{ g.summary }}</p>
            <a :href="g.source" target="_blank" class="btn btn-sm btn-outline-primary">Xem chi tiết</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
