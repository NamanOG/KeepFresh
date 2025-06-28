import { useEffect, useState } from 'react'
import { getDaysUntilExpiry } from '@/lib/get-days-until-expiry'
import { toast } from '@/hooks/use-toast'

export interface FoodItem {
  id: string
  name: string
  category: string
  expiry_date: string
  created_at: string
}

export function useExpiryNotifications(foodItems: FoodItem[]) {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default')
  const [serviceWorkerReg, setServiceWorkerReg] = useState<ServiceWorkerRegistration | null>(null)

  // Initialize Service Worker and check notification permission
  useEffect(() => {
    console.log('🔔 Initializing notification system...')
    
    if (!('Notification' in window)) {
      console.log('🔔 Browser does not support notifications')
      toast({
        title: "⚠️ Notifications Not Supported",
        description: "Your browser doesn't support notifications. You'll still see alerts in the app.",
        variant: "destructive"
      })
      return
    }

    // Register Service Worker for notifications
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          console.log('🔔 Registering service worker...')
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          })
          console.log('🔔 Service worker registered:', registration)
          
          // Wait for the service worker to be ready
          const readyRegistration = await navigator.serviceWorker.ready
          console.log('🔔 Service worker ready:', readyRegistration)
          setServiceWorkerReg(readyRegistration)
          
          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            console.log('🔔 Service worker update found')
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🔔 New service worker installed, reloading...')
                  window.location.reload()
                }
              })
            }
          })
          
        } catch (error) {
          console.error('🔔 Service worker registration failed:', error)
          toast({
            title: "⚠️ Service Worker Failed",
            description: "Falling back to basic notifications. Some features may be limited on mobile.",
            variant: "destructive"
          })
        }
      } else {
        console.log('🔔 Service workers not supported')
        toast({
          title: "⚠️ Limited Mobile Support",
          description: "Your browser has limited notification support.",
          variant: "destructive"
        })
      }
    }

    registerServiceWorker()

    console.log('🔔 Current permission:', Notification.permission)
    setPermissionStatus(Notification.permission)

    // Request permission
    const requestPermission = async () => {
      try {
        console.log('🔔 Requesting notification permission...')
        const permission = await Notification.requestPermission()
        console.log('🔔 Permission result:', permission)
        setPermissionStatus(permission)

        if (permission === 'granted') {
          console.log('🔔 Permission granted! Testing notification...')
          
          // Send a test notification
          await sendNotification(
            '✅ KeepFresh Notifications Enabled!',
            'You will now receive alerts for expiring food items.',
            'permission-granted-test'
          )

          toast({
            title: "🔔 Notifications Enabled",
            description: "You'll receive alerts when food items are expiring soon!",
          })
        } else if (permission === 'denied') {
          console.log('🔔 Permission denied')
          toast({
            title: "🔕 Notifications Blocked",
            description: "Please enable notifications in your browser settings to get expiry alerts.",
            variant: "destructive"
          })
        } else {
          console.log('🔔 Permission dismissed')
          toast({
            title: "❓ Notifications Dismissed",
            description: "You can enable notifications later in your browser settings.",
          })
        }
      } catch (error) {
        console.error('🔔 Error requesting permission:', error)
        toast({
          title: "⚠️ Permission Request Failed",
          description: "There was an error requesting notification permissions.",
          variant: "destructive"
        })
      }
    }

    // Helper function to send notifications with fallback
    const sendNotification = async (title: string, body: string, tag: string) => {
      try {
        // Try Service Worker method first (preferred for mobile)
        if (serviceWorkerReg && 'showNotification' in serviceWorkerReg) {
          console.log('🔔 Using Service Worker notification')
          await serviceWorkerReg.showNotification(title, {
            body,
            icon: '/KeepFresh.png',
            badge: '/KeepFresh.png',
            tag,
            requireInteraction: false,
            silent: false,
            vibrate: [200, 100, 200],
            data: { timestamp: Date.now() },
            actions: [
              {
                action: 'view',
                title: 'View Items'
              }
            ]
          })
        } else {
          // Fallback to regular Notification constructor
          console.log('🔔 Using regular Notification constructor')
          const notification = new Notification(title, {
            body,
            icon: '/KeepFresh.png',
            badge: '/KeepFresh.png',
            tag,
            requireInteraction: false,
            silent: false,
            timestamp: Date.now()
          })

          notification.onclick = () => {
            window.focus()
            notification.close()
          }

          setTimeout(() => notification.close(), 4000)
        }
      } catch (error) {
        console.error('🔔 Failed to send notification:', error)
        throw error
      }
    }

    // Request permission after a short delay
    const timer = setTimeout(requestPermission, 1000)
    return () => clearTimeout(timer)
  }, [serviceWorkerReg])

  // Helper function to send notifications (available to effects below)
  const sendNotification = async (title: string, body: string, tag: string, requireInteraction = false) => {
    try {
      // Try Service Worker method first (preferred for mobile)
      if (serviceWorkerReg && 'showNotification' in serviceWorkerReg) {
        console.log('🔔 Using Service Worker notification')
        await serviceWorkerReg.showNotification(title, {
          body,
          icon: '/KeepFresh.png',
          badge: '/KeepFresh.png',
          tag,
          requireInteraction,
          silent: false,
          vibrate: [200, 100, 200],
          data: { timestamp: Date.now() },
          actions: [
            {
              action: 'view',
              title: 'View Items'
            }
          ]
        })
      } else {
        // Fallback to regular Notification constructor
        console.log('🔔 Using regular Notification constructor')
        const notification = new Notification(title, {
          body,
          icon: '/KeepFresh.png',
          badge: '/KeepFresh.png',
          tag,
          requireInteraction,
          silent: false,
          timestamp: Date.now()
        })

        notification.onclick = () => {
          window.focus()
          notification.close()
        }

        const autoCloseDelay = requireInteraction ? 15000 : 8000
        setTimeout(() => notification.close(), autoCloseDelay)
      }
    } catch (error) {
      console.error('🔔 Failed to send notification:', error)
    }
  }

  // Monitor food items and send notifications
  useEffect(() => {
    if (!foodItems.length || permissionStatus !== 'granted') {
      console.log('🔔 Skipping notification check:', { 
        itemCount: foodItems.length, 
        permission: permissionStatus 
      })
      return
    }

    console.log('🔔 Checking food items for expiry notifications...')

    // Find items expiring within 3 days
    const expiringItems = foodItems.filter(item => {
      const daysLeft = getDaysUntilExpiry(item.expiry_date)
      return daysLeft >= 0 && daysLeft <= 3
    })

    console.log('🔔 Found expiring items:', expiringItems.map(item => ({
      name: item.name,
      daysLeft: getDaysUntilExpiry(item.expiry_date)
    })))

    // Send notifications for expiring items
    expiringItems.forEach(async (item) => {
      const daysLeft = getDaysUntilExpiry(item.expiry_date)
      const notificationKey = `keepfresh-notification-${item.id}-${item.expiry_date}`
      
      // Check if we already sent this notification today
      const lastSent = localStorage.getItem(notificationKey)
      const today = new Date().toDateString()
      
      if (lastSent === today) {
        console.log(`🔔 Already sent notification for ${item.name} today`)
        return
      }

      console.log(`🔔 Sending notification for ${item.name} (${daysLeft} days left)`)

      let title = ''
      let body = ''

      if (daysLeft === 0) {
        title = '🚨 Food Expires Today!'
        body = `${item.name} expires today! Use it now or it will go bad.`
      } else if (daysLeft === 1) {
        title = '⚠️ Food Expires Tomorrow!'
        body = `${item.name} expires tomorrow. Plan to use it soon!`
      } else if (daysLeft === 2) {
        title = '📅 Food Expires in 2 Days'
        body = `${item.name} expires in 2 days. Consider using it soon!`
      } else if (daysLeft === 3) {
        title = '📅 Food Expires in 3 Days'
        body = `${item.name} expires in 3 days. Keep it in mind!`
      }

      try {
        await sendNotification(
          title,
          body,
          `expiry-${item.id}-${daysLeft}`,
          daysLeft <= 1 // More urgent notifications require interaction
        )

        // Mark as sent for today
        localStorage.setItem(notificationKey, today)

      } catch (error) {
        console.error(`🔔 Failed to create notification for ${item.name}:`, error)
      }
    })

  }, [foodItems, permissionStatus, serviceWorkerReg])

  // Send notification for newly added expiring items
  useEffect(() => {
    if (!foodItems.length || permissionStatus !== 'granted') return

    foodItems.forEach(async (item) => {
      const daysLeft = getDaysUntilExpiry(item.expiry_date)
      const itemAge = Date.now() - new Date(item.created_at).getTime()
      const isNewlyAdded = itemAge < 15000 // Added within last 15 seconds
      
      if (isNewlyAdded && daysLeft >= 0 && daysLeft <= 3) {
        const notificationKey = `keepfresh-new-item-${item.id}`
        
        if (!localStorage.getItem(notificationKey)) {
          console.log(`🔔 Sending new item notification for ${item.name}`)
          
          try {
            await sendNotification(
              '⚠️ Added Expiring Item!',
              `${item.name} expires ${daysLeft === 0 ? 'today' : daysLeft === 1 ? 'tomorrow' : `in ${daysLeft} days`}!`,
              `new-${item.id}`,
              true
            )

            localStorage.setItem(notificationKey, 'sent')

          } catch (error) {
            console.error(`🔔 Failed to create new item notification:`, error)
          }
        }
      }
    })
  }, [foodItems, permissionStatus, serviceWorkerReg])

  // Cleanup old notification flags
  useEffect(() => {
    const cleanup = () => {
      const keys = Object.keys(localStorage)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - 7)
      
      keys.forEach(key => {
        if (key.startsWith('keepfresh-notification-')) {
          const parts = key.split('-')
          const datePart = parts[parts.length - 1]
          if (datePart && new Date(datePart) < cutoffDate) {
            localStorage.removeItem(key)
          }
        }
      })
    }

    cleanup()
    const interval = setInterval(cleanup, 24 * 60 * 60 * 1000) // Daily cleanup
    return () => clearInterval(interval)
  }, [])
}
