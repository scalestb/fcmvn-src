<template>
  <section class="banner border rounded-3 p-4 p-md-5 mb-4">
    <div class="row g-4 align-items-center">
      <div class="col-md-8">
        <h1 class="display-6 fw-bold mb-2">{{ title }}</h1>
        <p v-if="subtitle" class="lead mb-0 text-muted">{{ subtitle }}</p>
      </div>
      <div class="col-md-4 d-none d-md-block">
        <div class="banner-visual rounded-3"></div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>
<style scoped>
.banner{
  background: linear-gradient(135deg, rgba(3,152,85,.2), rgba(3,152,85,.05));
  border-color: rgba(255,255,255,.08) !important;
}
.banner-visual{
  height: 140px;
  background:
    radial-gradient(100% 100% at 0% 0%, rgba(3,152,85,.45) 0%, transparent 60%),
    radial-gradient(100% 100% at 100% 100%, rgba(3,152,85,.35) 0%, transparent 60%),
    #0f1624;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.04);
}
</style>
