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

  // Check and request notification permission
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

    console.log('🔔 Current permission:', Notification.permission)
    setPermissionStatus(Notification.permission)

    // Always try to request permission, even if it shows as granted
    const requestPermission = async () => {
      try {
        console.log('🔔 Requesting notification permission...')
        const permission = await Notification.requestPermission()
        console.log('🔔 Permission result:', permission)
        setPermissionStatus(permission)

        if (permission === 'granted') {
          console.log('🔔 Permission granted! Testing notification...')
          
          // Send a test notification to confirm it's working
          try {
            const testNotification = new Notification('✅ KeepFresh Notifications Enabled!', {
              body: 'You will now receive alerts for expiring food items.',
              icon: '/KeepFresh.png',
              tag: 'permission-granted-test'
            })

            testNotification.onclick = () => {
              window.focus()
              testNotification.close()
            }

            setTimeout(() => testNotification.close(), 4000)

            toast({
              title: "🔔 Notifications Enabled",
              description: "You'll receive alerts when food items are expiring soon!",
            })
          } catch (error) {
            console.error('🔔 Test notification failed:', error)
          }
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
      }
    }

    // Request permission after a short delay to ensure the page is loaded
    const timer = setTimeout(requestPermission, 1000)
    return () => clearTimeout(timer)
  }, [])

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
    expiringItems.forEach(item => {
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
        const notification = new Notification(title, {
          body,
          icon: '/KeepFresh.png',
          badge: '/KeepFresh.png',
          tag: `expiry-${item.id}-${daysLeft}`,
          requireInteraction: daysLeft <= 1, // More urgent notifications stay visible
          silent: false,
          timestamp: Date.now()
        })

        notification.onclick = () => {
          console.log('🔔 Notification clicked!')
          window.focus()
          notification.close()
        }

        notification.onshow = () => {
          console.log(`🔔 Notification shown for ${item.name}`)
        }

        notification.onerror = (error) => {
          console.error('🔔 Notification error:', error)
        }

        // Mark as sent for today
        localStorage.setItem(notificationKey, today)

        // Auto-close after delay (longer for more urgent items)
        const autoCloseDelay = daysLeft <= 1 ? 15000 : 8000
        setTimeout(() => {
          notification.close()
        }, autoCloseDelay)

      } catch (error) {
        console.error(`🔔 Failed to create notification for ${item.name}:`, error)
      }
    })

  }, [foodItems, permissionStatus])

  // Send notification for newly added expiring items
  useEffect(() => {
    if (!foodItems.length || permissionStatus !== 'granted') return

    foodItems.forEach(item => {
      const daysLeft = getDaysUntilExpiry(item.expiry_date)
      const itemAge = Date.now() - new Date(item.created_at).getTime()
      const isNewlyAdded = itemAge < 15000 // Added within last 15 seconds
      
      if (isNewlyAdded && daysLeft >= 0 && daysLeft <= 3) {
        const notificationKey = `keepfresh-new-item-${item.id}`
        
        if (!localStorage.getItem(notificationKey)) {
          console.log(`🔔 Sending new item notification for ${item.name}`)
          
          try {
            const notification = new Notification('⚠️ Added Expiring Item!', {
              body: `${item.name} expires ${daysLeft === 0 ? 'today' : daysLeft === 1 ? 'tomorrow' : `in ${daysLeft} days`}!`,
              icon: '/KeepFresh.png',
              tag: `new-${item.id}`,
              requireInteraction: true
            })

            notification.onclick = () => {
              window.focus()
              notification.close()
            }

            localStorage.setItem(notificationKey, 'sent')

            setTimeout(() => {
              notification.close()
            }, 10000)

          } catch (error) {
            console.error(`🔔 Failed to create new item notification:`, error)
          }
        }
      }
    })
  }, [foodItems, permissionStatus])

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
