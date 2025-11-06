<template>
  <div class="card p-3 h-100">
    <h3 class="h6 text-primary mb-3">{{ title }}</h3>

    <div v-for="(group, gi) in positions" :key="gi" class="mb-3">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <strong class="me-3">{{ group.position }}</strong>
        <!-- slot optional nút Xem thêm nếu cần -->
        <slot name="actions" :group="group" />
      </div>

      <div class="player-grid">
        <component
          v-for="(pl, pi) in group.players"
          :key="pl.id ?? pi"
          :is="isExternal(pl.link) ? 'a' : resolveLink"
          :href="isExternal(pl.link) ? pl.link : null"
          :to="!isExternal(pl.link) ? pl.link : null"
          :target="isExternal(pl.link) ? '_blank' : null"
          rel="noopener"
          class="player-card"
        >
          <div class="player-img">
            <img :src="pl.image" :alt="pl.name" loading="lazy" />
          </div>
          <div class="player-name">{{ pl.name }}</div>
        </component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Player = { id: number | string; name: string; image: string; link: string }
type Group  = { position: string; players: Player[] }

const props = withDefaults(defineProps<{
  positions: Group[]
  title?: string
}>(), {
  title: 'Top theo vị trí'
})

const resolveLink = 'NuxtLink'
function isExternal(link?: string) {
  return !!link && /^(?:https?:)?\/\//i.test(link)
}
</script>

<style scoped>
/* Lưới 3 cột, giống layout minh hoạ */
.player-grid{
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
@media (max-width: 480px){
  .player-grid{ gap: 14px; }
}

/* Thẻ cầu thủ */
.player-card{
  text-decoration: none;
  color: inherit;
  display: block;
}
.player-img{
  background: #11161f; /* khớp dark theme */
  border-radius: 18px;
  padding: 10px;
  aspect-ratio: 3 / 4; /* tỉ lệ dọc như card in-game */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,.06);
  transition: transform .08s ease, box-shadow .2s ease;
}
.player-img img{
  width: 100%;
  height: 100%;
  object-fit: contain; /* ảnh card size khác nhau vẫn cân */
  border-radius: 12px;
}
.player-card:hover .player-img{
  box-shadow:
    0 0 0 1px var(--c-accent),
    0 6px 20px rgba(3,152,85,.15);
  transform: translateY(-1px);
}
.player-name{
  text-align: center;
  margin-top: 8px;
  font-size: .9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
