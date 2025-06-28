"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, AlertTriangle, CheckCircle, Clock, Leaf, Bell } from "lucide-react"
import { AddFoodDialog } from "@/components/add-food-dialog"
import { RecipeDialog } from "@/components/recipe-dialog"
import { createClient } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import { useExpiryNotifications, type FoodItem } from "@/hooks/use-expiry-notifications"
import { getDaysUntilExpiry } from "@/lib/get-days-until-expiry"

export default function HomePage() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null)
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // Handle notifications automatically
  useExpiryNotifications(foodItems)

  useEffect(() => {
    console.log("🚀 HomePage mounted, fetching food items...")
    fetchFoodItems()
  }, [])

  const fetchFoodItems = async () => {
    console.log("📥 Fetching food items from database...")
    try {
      const { data, error } = await supabase.from("food_items").select("*").order("expiry_date", { ascending: true })

      if (error) throw error

      console.log("✅ Fetched", data?.length || 0, "food items:", data)
      setFoodItems(data || [])
    } catch (error) {
      console.error("❌ Error fetching food items:", error)
      toast({
        title: "Error",
        description: "Failed to load food items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addFoodItem = async (item: Omit<FoodItem, "id" | "created_at">) => {
    console.log("➕ Adding new food item:", item)
    try {
      const { data, error } = await supabase.from("food_items").insert([item]).select().single()

      if (error) throw error

      console.log("✅ Food item added to database:", data)

      const newFoodItems = [...foodItems, data].sort(
        (a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime(),
      )

      console.log("🔄 Updating food items state, new count:", newFoodItems.length)
      setFoodItems(newFoodItems)

      toast({
        title: "✅ Success",
        description: "Food item added successfully!",
      })
    } catch (error) {
      console.error("❌ Error adding food item:", error)
      toast({
        title: "❌ Error",
        description: "Failed to add food item",
        variant: "destructive",
      })
    }
  }

  const deleteFoodItem = async (id: string) => {
    console.log("🗑️ Deleting food item:", id)
    try {
      const { error } = await supabase.from("food_items").delete().eq("id", id)

      if (error) throw error

      setFoodItems((prev) => prev.filter((item) => item.id !== id))

      toast({
        title: "🗑️ Removed",
        description: "Food item removed successfully!",
      })
    } catch (error) {
      console.error("❌ Error deleting food item:", error)
      toast({
        title: "❌ Error",
        description: "Failed to remove food item",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (daysLeft: number) => {
    if (daysLeft < 0) {
      return (
        <Badge variant="destructive" className="gap-1 shadow-sm">
          <AlertTriangle className="w-3 h-3" />
          Expired
        </Badge>
      )
    } else if (daysLeft <= 2) {
      return (
        <Badge variant="destructive" className="gap-1 shadow-sm animate-pulse">
          <AlertTriangle className="w-3 h-3" />
          Urgent
        </Badge>
      )
    } else if (daysLeft <= 5) {
      return (
        <Badge className="gap-1 shadow-sm bg-amber-100 text-amber-800 hover:bg-amber-200">
          <Clock className="w-3 h-3" />
          Soon
        </Badge>
      )
    } else {
      return (
        <Badge className="gap-1 shadow-sm bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
          <CheckCircle className="w-3 h-3" />
          Fresh
        </Badge>
      )
    }
  }

  const expiringItems = foodItems.filter((item) => getDaysUntilExpiry(item.expiry_date) <= 3)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
              <Leaf className="w-6 h-6 text-emerald-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading your fresh items...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              KeepFresh
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            Smart food tracking to reduce waste and discover amazing recipes
          </p>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Food Item
          </Button>
        </div>

        {/* Expiring Soon Alert */}
        {expiringItems.length > 0 && (
          <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                Urgent: Items Expiring Soon
              </CardTitle>
              <CardDescription className="text-orange-700 font-medium">
                {expiringItems.length} item{expiringItems.length > 1 ? "s" : ""} need your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {expiringItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-orange-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <div>
                        <span className="font-semibold text-gray-900">{item.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({item.category})</span>
                        <div className="text-sm text-orange-600 font-medium">
                          {getDaysUntilExpiry(item.expiry_date)} days left
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md"
                      onClick={() => {
                        setSelectedItem(item)
                        setIsRecipeDialogOpen(true)
                      }}
                    >
                      Get Recipes
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {foodItems.length === 0 ? (
          <Card className="text-center py-12 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent>
              <div className="text-gray-400 mb-6">
                <div className="p-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Start Your Fresh Journey</h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                Add your first food item and never let fresh ingredients go to waste again
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {foodItems.map((item) => {
              const daysLeft = getDaysUntilExpiry(item.expiry_date)
              return (
                <Card
                  key={item.id}
                  className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1 mr-3">
                        <CardTitle className="text-lg font-bold text-gray-800 truncate group-hover:text-emerald-700 transition-colors">
                          {item.name}
                        </CardTitle>
                        <CardDescription className="text-sm font-medium text-gray-500">{item.category}</CardDescription>
                      </div>
                      {getStatusBadge(daysLeft)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                        <Calendar className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                        <span className="truncate">
                          <span className="font-medium">Expires:</span>{" "}
                          {new Date(item.expiry_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                        <span
                          className={`text-lg font-bold ${
                            daysLeft < 0 ? "text-red-600" : daysLeft <= 2 ? "text-orange-600" : "text-emerald-600"
                          }`}
                        >
                          {daysLeft < 0
                            ? `Expired ${Math.abs(daysLeft)} days ago`
                            : daysLeft === 0
                              ? "Expires today!"
                              : `${daysLeft} days remaining`}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 pt-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={() => {
                            setSelectedItem(item)
                            setIsRecipeDialogOpen(true)
                          }}
                        >
                          🍳 Get Recipe Ideas
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 bg-transparent"
                          onClick={() => deleteFoodItem(item.id)}
                        >
                          🗑️ Remove Item
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Dialogs */}
        <AddFoodDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={addFoodItem} />
        <RecipeDialog open={isRecipeDialogOpen} onOpenChange={setIsRecipeDialogOpen} foodItem={selectedItem} />
      </div>
    </div>
  )
}
