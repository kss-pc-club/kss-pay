const cacheVersion = '1.0.0'
const cacheFile = [
  './onlineCheck',
  './onlineCheck?pwa=true',
  './_header.html',
  './css/main.css',
  './css/header.css',
]

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Installing...')
  e.waitUntil(
    caches.open(cacheVersion).then((cache) => {
      console.log('[Service Worker] Pre-Caching Offline Page...')
      return cache.addAll(cacheFile)
    })
  )
  console.log(
    '[Service Worker] Installed Successfully!\nVersion: ' + cacheVersion
  )
})

self.addEventListener('activate', (e) => {
  console.log('[Service Worker] Activated')
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== cacheVersion) {
            console.log('[Service Worker] Removing old Cache: ', key)
            return caches.delete(key)
          }
        })
      )
    })
  )
  console.log('[Service Worker] Removed old cache Successfully.')
  return self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  if (
    cacheFile.includes(e.request.url.replace('https://pay.kss-pc.club', ''))
  ) {
    console.log('[Service Worker] Fetching', e.request.url)
    e.respondWith(
      caches.match(e.request).then((r) => {
        return (
          r ||
          fetch(e.request).then((response) => {
            return caches.open(cacheVersion).then((cache) => {
              console.log(`[Service Worker] Caching new resource: ${e.request}`)
              cache.put(e.request, response.clone())
              return response
            })
          })
        )
      })
    )
  }
})
