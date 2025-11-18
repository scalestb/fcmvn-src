<script setup lang="ts">
import HeaderBanner from '~/components/common/HeaderBanner.vue'
import SectionHeader from '~/components/common/SectionHeader.vue'
import ErrorAlert from '~/components/common/ErrorAlert.vue'
import TopByPosition from '~/components/tactics/TopByPosition.vue'
import { useSeo } from '~/composables/useSeo'

const pageTitle = 'Meta & Chiến thuật'
const pageSubtitle = 'Gợi ý sơ đồ, lối chơi và top cầu thủ theo meta hiện tại'

useSeo().applySeo({
  title: pageTitle,
  description: pageSubtitle,
  path: useRoute().fullPath
})

const api = useApi()
const { data, error, pending } = await api.get('/tactics/meta')
</script>

<template>
  <div>
    <HeaderBanner :title="pageTitle" :subtitle="pageSubtitle" />

    <SectionHeader title="Phân tích meta & chiến thuật" />
    <ErrorAlert :error="error" />

    <div v-if="pending">Đang tải dữ liệu...</div>

    <div v-else class="row g-3">
      <!-- Cột trái: các group tactics -->
      <div class="col-md-8">
        <div class="card h-100">
          <div class="card-body">
            <p v-if="data?.src" class="small text-muted mb-3">
              Nguồn tham khảo:
              <a :href="data.src" target="_blank" rel="noopener">
                {{ data.src }}
              </a>
            </p>

            <div
              v-for="(group, gi) in (data?.tactics || [])"
              :key="gi"
              class="mb-4"
            >
              <h3 class="h6 mb-2">
                {{ group.title }}
              </h3>

              <ul class="list-unstyled mb-0">
                <li
                  v-for="(m, mi) in (group.list || [])"
                  :key="mi"
                  class="mb-2"
                >
                  <div class="d-flex align-items-start justify-content-between">
                    <div class="me-3">
                      <div class="fw-semibold">
                        {{ m.formation }}
                      </div>
                      <div class="small text-muted">
                        {{ m.description }}
                      </div>
                    </div>

                    <NuxtLink
                      v-if="m.link"
                      :to="m.link"
                      class="btn btn-sm btn-outline-primary"
                    >
                      Xem chi tiết
                    </NuxtLink>
                  </div>
                </li>
              </ul>
            </div>

            <p v-if="!(data?.tactics || []).length" class="text-muted small mb-0">
              Chưa có dữ liệu tactics.
            </p>
          </div>
        </div>
      </div>

      <!-- Cột phải: top cầu thủ theo vị trí -->
      <div class="col-md-4">
        <TopByPosition :positions="data?.byPosition || []" />
      </div>
    </div>
  </div>
</template>
