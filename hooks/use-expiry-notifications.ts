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
  // Request notification permission on mount
  useEffect(() => {
    const requestPermission = async () => {
      if ("Notification" in window && Notification.permission === "default") {
        const permission = await Notification.requestPermission()
        if (permission === "granted") {
          toast({
            title: "🔔 Notifications Enabled",
            description: "You'll receive alerts when food items are expiring soon!",
          })
        }
      }
    }
    requestPermission()
  }, [])

  // Check for notifications when food items change
  useEffect(() => {
    if (!foodItems.length) return

    // Only proceed if notifications are supported and permitted
    if (!("Notification" in window) || Notification.permission !== "granted") {
      console.log("🚫 Notifications not supported or not permitted")
      return
    }

    const todayKey = new Date().toDateString()

    // Find items expiring in 3 days or less (but not expired)
    const expiringItems = foodItems.filter((item) => {
      const daysLeft = getDaysUntilExpiry(item.expiry_date)
      return daysLeft >= 0 && daysLeft <= 3
    })

    console.log(
      `📋 Found ${expiringItems.length} items expiring soon:`,
      expiringItems.map((item) => `${item.name} (${getDaysUntilExpiry(item.expiry_date)} days)`),
    )

    expiringItems.forEach((item) => {
      const daysLeft = getDaysUntilExpiry(item.expiry_date)
      const storageKey = `notification-${item.id}-${todayKey}`

      // Check if we already sent a notification for this item today
      if (localStorage.getItem(storageKey)) {
        console.log(`🔇 Already notified today for: ${item.name}`)
        return
      }

      const icon = "/KeepFresh.png"
      let title = ""
      let body = ""

      if (daysLeft === 0) {
        title = "⚠️ Food Expires Today!"
        body = `${item.name} expires today. Use it now or it will go to waste!`
      } else if (daysLeft === 1) {
        title = "🚨 Food Expires Tomorrow!"
        body = `${item.name} expires tomorrow. Plan to use it soon!`
      } else {
        title = "⏰ Food Expiring Soon"
        body = `${item.name} expires in ${daysLeft} days. Consider using it soon!`
      }

      try {
        new Notification(title, {
          body,
          icon,
          badge: icon,
          tag: item.id,
        })

        // Mark that we've sent a notification for this item today
        localStorage.setItem(storageKey, "sent")
        console.log(`📢 Notification sent for: ${item.name} (${daysLeft} days left)`)
      } catch (error) {
        console.error("❌ Failed to send notification:", error)
      }
    })
  }, [foodItems])
}
