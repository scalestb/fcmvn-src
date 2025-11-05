export default defineNuxtPlugin(() => {
  // Import JS bundle only on client
  if (process.client) {
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
  }
})
