// Service Worker for KeepFresh notifications
// Place this file as /public/sw.js

const CACHE_NAME = 'keepfresh-v1'

// Install event
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...')
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('🔧 Service Worker activating...')
  event.waitUntil(self.clients.claim())
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.notification.tag)
  
  event.notification.close()
  
  // Handle different actions
  if (event.action === 'view') {
    // Open the app when "View Items" is clicked
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        // Check if app is already open
        const client = clients.find((c) => c.url.includes(self.location.origin))
        if (client) {
          client.focus()
        } else {
          // Open new window/tab
          self.clients.openWindow('/')
        }
      })
    )
  } else {
    // Default click behavior - focus the app
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        const client = clients.find((c) => c.url.includes(self.location.origin))
        if (client) {
          client.focus()
        } else {
          self.clients.openWindow('/')
        }
      })
    )
  }
})

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('🔔 Notification closed:', event.notification.tag)
})

// Optional: Handle background sync for offline notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered')
    // You could implement background notification checking here
  }
})

// Optional: Handle push messages if you want server-sent notifications later
self.addEventListener('push', (event) => {
  console.log('📨 Push message received:', event.data?.text())
  
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/KeepFresh.png',
      badge: '/KeepFresh.png',
      tag: data.tag || 'push-notification',
      requireInteraction: data.requireInteraction || false,
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: [
        {
          action: 'view',
          title: 'View Items'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'KeepFresh', options)
    )
  }
})
