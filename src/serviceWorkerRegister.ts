//----- ServiceWorkerの登録 -----//
if ('serviceWorker' in navigator) {
  if (location.pathname !== '/login') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./serviceWorker.js')
        .then((reg) => {
          console.log('[Service Worker] Service Worker Registered.', reg)
        })
        .catch((err) =>
          console.error('[Service Worker] Something went wrong.', err)
        )
    })
  }
}
