<template>
  <div class="section-title">
    <span class="dot"></span>
    <h2 class="h5 m-0">{{ title }}</h2>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>
