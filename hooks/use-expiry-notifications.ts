"use client"

import { useEffect } from "react"
import { getDaysUntilExpiry } from "@/lib/get-days-until-expiry"
import { toast } from "@/hooks/use-toast"

export interface FoodItem {
  id: string
  name: string
  category: string
  expiry_date: string
  created_at: string
}

export function useExpiryNotifications(foodItems: FoodItem[]) {
  console.log("🔄 useExpiryNotifications hook called with", foodItems.length, "items")

  // Request notification permission on mount
  useEffect(() => {
    console.log("🔔 Requesting notification permission...")

    const requestPermission = async () => {
      if ("Notification" in window) {
        console.log("📱 Notification API supported, current permission:", Notification.permission)

        if (Notification.permission === "default") {
          console.log("🔔 Requesting permission...")
          const permission = await Notification.requestPermission()
          console.log("✅ Permission result:", permission)

          if (permission === "granted") {
            console.log("✅ Notifications granted!")
            toast({
              title: "🔔 Notifications Enabled",
              description: "You'll receive alerts when food items are expiring soon!",
            })

            // Test notification immediately
            setTimeout(() => {
              console.log("🧪 Sending test notification...")
              try {
                const testNotification = new Notification("🧪 Test Notification", {
                  body: "KeepFresh notifications are working!",
                  icon: "/KeepFresh.png",
                  requireInteraction: true,
                })
                console.log("✅ Test notification sent successfully")
                testNotification.onclick = () => {
                  console.log("🖱️ Test notification clicked")
                  testNotification.close()
                }
              } catch (error) {
                console.error("❌ Test notification failed:", error)
              }
            }, 1000)
          } else {
            console.log("❌ Permission denied")
            toast({
              title: "❌ Notifications Disabled",
              description: "Enable notifications to get expiry alerts",
              variant: "destructive",
            })
          }
        } else if (Notification.permission === "granted") {
          console.log("✅ Notifications already granted")

          // Send test notification for already granted permission
          setTimeout(() => {
            console.log("🧪 Sending test notification (already granted)...")
            try {
              const testNotification = new Notification("🧪 KeepFresh Ready", {
                body: "Notifications are enabled and working!",
                icon: "/KeepFresh.png",
                requireInteraction: true,
              })
              console.log("✅ Test notification sent successfully")
            } catch (error) {
              console.error("❌ Test notification failed:", error)
            }
          }, 500)
        } else {
          console.log("❌ Notifications denied")
        }
      } else {
        console.log("❌ Notification API not supported")
      }
    }

    requestPermission()
  }, [])

  // Check for notifications when food items change
  useEffect(() => {
    console.log("🔍 Checking notifications for", foodItems.length, "food items")

    if (!foodItems.length) {
      console.log("📭 No food items to check")
      return
    }

    // Only proceed if notifications are supported and permitted
    if (!("Notification" in window)) {
      console.log("❌ Notification API not supported")
      return
    }

    if (Notification.permission !== "granted") {
      console.log("❌ Notification permission not granted, current:", Notification.permission)
      return
    }

    console.log("✅ Notifications supported and permitted, checking items...")

    const todayKey = new Date().toDateString()
    console.log("📅 Today key:", todayKey)

    // Find items expiring in 3 days or less (including expired items)
    const expiringItems = foodItems.filter((item) => {
      const daysLeft = getDaysUntilExpiry(item.expiry_date)
      const isExpiring = daysLeft <= 3 // Include expired items (negative days)
      console.log(`🔍 Item: ${item.name}, Days left: ${daysLeft}, Is expiring: ${isExpiring}`)
      return isExpiring
    })

    console.log(
      `📋 Found ${expiringItems.length} items expiring soon:`,
      expiringItems.map((item) => ({
        name: item.name,
        daysLeft: getDaysUntilExpiry(item.expiry_date),
        expiryDate: item.expiry_date,
      })),
    )

    if (expiringItems.length === 0) {
      console.log("📭 No expiring items found")
      return
    }

    expiringItems.forEach((item) => {
      const daysLeft = getDaysUntilExpiry(item.expiry_date)
      const storageKey = `notification-${item.id}-${todayKey}`

      console.log(`🔑 Checking storage key: ${storageKey}`)

      // Check if we already sent a notification for this item today
      const alreadySent = localStorage.getItem(storageKey)
      if (alreadySent) {
        console.log(`🔇 Already notified today for: ${item.name}`)
        return
      }

      const icon = "/KeepFresh.png"
      let title = ""
      let body = ""

      if (daysLeft < 0) {
        title = "🚨 Food Already Expired!"
        body = `${item.name} expired ${Math.abs(daysLeft)} days ago. Check if it's still safe to use!`
      } else if (daysLeft === 0) {
        title = "⚠️ Food Expires Today!"
        body = `${item.name} expires today. Use it now or it will go to waste!`
      } else if (daysLeft === 1) {
        title = "🚨 Food Expires Tomorrow!"
        body = `${item.name} expires tomorrow. Plan to use it soon!`
      } else {
        title = "⏰ Food Expiring Soon"
        body = `${item.name} expires in ${daysLeft} days. Consider using it soon!`
      }

      console.log(`📢 Preparing notification for ${item.name}:`, { title, body, daysLeft })

      try {
        console.log(`🚀 Creating notification...`)
        const notification = new Notification(title, {
          body,
          icon,
          badge: icon,
          tag: item.id,
          requireInteraction: true,
          silent: false, // Make sure it's not silent
        })

        console.log(`✅ Notification created successfully for: ${item.name}`)

        // Add click handler
        notification.onclick = () => {
          console.log(`🖱️ Notification clicked for: ${item.name}`)
          window.focus()
          notification.close()
        }

        // Add error handler
        notification.onerror = (error) => {
          console.error(`❌ Notification error for ${item.name}:`, error)
        }

        // Mark that we've sent a notification for this item today
        localStorage.setItem(storageKey, "sent")
        console.log(`✅ Notification sent successfully for: ${item.name} (${daysLeft} days left)`)

        // Also show a toast for confirmation
        toast({
          title: "🔔 Notification Sent",
          description: `Alert sent for ${item.name} (expires ${daysLeft === 0 ? "today" : daysLeft < 0 ? `${Math.abs(daysLeft)} days ago` : `in ${daysLeft} days`})`,
        })
      } catch (error) {
        console.error("❌ Failed to send notification:", error)
        toast({
          title: "❌ Notification Failed",
          description: `Could not send notification for ${item.name}: ${error.message}`,
          variant: "destructive",
        })
      }
    })
  }, [foodItems])
}
