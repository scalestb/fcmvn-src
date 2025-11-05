<template>
  <div v-if="error" class="alert alert-danger" role="alert">
    <div class="fw-semibold mb-1">Đã có lỗi xảy ra</div>
    <pre class="small mb-0">{{ pretty }}</pre>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ error: any }>()
const pretty = computed(() => {
  const v = props.error?.value ?? props.error
  return v?._data ?? v?.data ?? v?.message ?? JSON.stringify(v, null, 2)
})
</script>
