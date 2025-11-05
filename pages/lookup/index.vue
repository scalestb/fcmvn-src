<script setup lang="ts">
import HeaderBanner from '~/components/common/HeaderBanner.vue'
import { useSeo } from '~/composables/useSeo'
const pageTitle = "Tra c\u1ee9u"
const pageSubtitle = "Th\u00f4ng tin nhanh, ch\u00ednh x\u00e1c"
useSeo().applySeo({ title: pageTitle, description: pageSubtitle || "Th\u00f4ng tin nhanh, ch\u00ednh x\u00e1c", path: useRoute().fullPath })

import SectionHeader from '~/components/common/SectionHeader.vue'
import ErrorAlert from '~/components/common/ErrorAlert.vue'

const api = useApi()
const q = ref('')
const result = ref<any>(null)
const loading = ref(false)
const err = ref<any>(null)

async function onSearch() {
  err.value = null
  loading.value = true
  try {
    const { data, error } = await api.get('/lookup/account', { query: { q: q.value } })
    err.value = error.value
    result.value = data.value
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <HeaderBanner :title="pageTitle" :subtitle="pageSubtitle" />
  <div>
    <SectionHeader title="Tra cứu" />
    <ErrorAlert :error="err" />

    <div class="input-group mb-3">
      <input v-model="q" class="form-control" placeholder="Nhập ID tài khoản / nickname..." />
      <button class="btn btn-primary" :disabled="loading" @click="onSearch">
        <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
        Tra cứu
      </button>
    </div>

    <div v-if="result" class="card p-3">
      <div class="fw-semibold">Kết quả</div>
      <pre class="small text-muted mb-0">{{ result }}</pre>
    </div>
  </div>
</template>
