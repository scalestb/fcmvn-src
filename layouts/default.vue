<template>
  <div>
    <!-- Bootstrap Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <NuxtLink class="navbar-brand fw-bold" to="/">FCMVN</NuxtLink>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div id="navbarNav" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><NuxtLink class="nav-link" to="/tactics">Phân tích chiến thuật</NuxtLink></li>
            <li class="nav-item"><NuxtLink class="nav-link" to="/guides">Hướng dẫn & thủ thuật</NuxtLink></li>
            <li class="nav-item"><NuxtLink class="nav-link" to="/community">Cộng đồng</NuxtLink></li>
            <!-- <li class="nav-item"><NuxtLink class="nav-link" to="/lookup">Tra cứu</NuxtLink></li> -->
            <!-- <li class="nav-item"><NuxtLink class="nav-link" to="/hof">Bảng danh vọng</NuxtLink></li> -->
          </ul>
        </div>
      </div>
    </nav>

    <main class="py-4">
      <div class="container">
        <slot />
      </div>
    </main>

    <footer class="bg-light border-top py-4 mt-auto">
      <div class="container text-muted small">
        <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between">
          <span>© {{ new Date().getFullYear() }} FCMVN</span>
          <span>Prototype · Bootstrap 5 · Nuxt 3</span>
        </div>
      </div>
    </footer>
  </div>
</template>
