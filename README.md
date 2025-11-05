# FCMVN — Nuxt 3 Prototype (Port 2025)

Nuxt 3 + Vite + Vue 3, UI Bootstrap 5. Mock JSON first, later switch to real API.

## Quick start

```bash
# 1) Install deps
pnpm i   # or: npm i / yarn

# 2) Copy env
cp .env.example .env
# (By default USE_MOCK=1 will read JSON under /public/mock)
# Switch to real API by setting USE_MOCK=0 (and ensure API_BASE_URL).

# 3) Dev server (port 2025)
pnpm dev
```

Open http://localhost:2025

## Structure

- `pages/` — Sườn trang theo road_map
- `public/mock/` — JSON mẫu
- `composables/useApi.ts` — Wrapper gọi API (tự động .json khi USE_MOCK=1)
- `server/api/fcmvn/[...path].ts` — Proxy tới `API_BASE_URL` (tránh CORS) khi USE_MOCK=0.

## Switch to real API

- Set `USE_MOCK=0` in `.env`
- Ensure `API_BASE_URL=https://fcmvn.com/api`
- Update pages to call endpoints thực tế (ví dụ `/tactics/meta` -> do BE trả từ fcmvn.com/api).

## Pages (theo roadmap)
- `/` — Trang chủ
- `/tactics` — Phân tích chiến thuật (meta, theo vị trí)
- `/guides` — Hướng dẫn & thủ thuật
- `/community` — Cộng đồng
- `/lookup` — Tra cứu
- `/hof` — Bảng danh vọng

## Bootstrap 5
- CSS: via SCSS import in `assets/styles/main.scss`
- JS: via plugin `plugins/bootstrap.client.ts`
