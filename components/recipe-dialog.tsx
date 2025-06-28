"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, ChefHat, Loader2 } from "lucide-react"

interface FoodItem {
  id: string
  name: string
  category: string
  expiry_date: string
  created_at: string
}

interface Recipe {
  id: number
  title: string
  readyInMinutes: number
  servings: number
  summary: string
  instructions: string
  ingredients: string[]
}

interface RecipeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  foodItem: FoodItem | null
}

export function RecipeDialog({ open, onOpenChange, foodItem }: RecipeDialogProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && foodItem) {
      fetchRecipes()
    }
  }, [open, foodItem])

  const fetchRecipes = async () => {
    if (!foodItem) return

    setLoading(true)
    try {
      // Mock recipes for demo - in production, you'd use a real API
      const mockRecipes: Recipe[] = [
        {
          id: 1,
          title: `Fresh ${foodItem.name} Stir Fry`,
          readyInMinutes: 20,
          servings: 4,
          summary: `A quick and delicious stir fry featuring fresh ${foodItem.name.toLowerCase()}. Perfect for using up ingredients before they expire!`,
          instructions: `1. Heat oil in a large pan or wok over medium-high heat.\n2. Add ${foodItem.name.toLowerCase()} and cook for 3-4 minutes.\n3. Add your choice of protein and vegetables.\n4. Season with soy sauce, garlic, and ginger.\n5. Serve hot over rice or noodles.`,
          ingredients: [
            `2 cups fresh ${foodItem.name.toLowerCase()}`,
            "2 tbsp vegetable oil",
            "2 cloves garlic, minced",
            "1 tbsp fresh ginger",
            "2 tbsp soy sauce",
            "1 tsp sesame oil",
          ],
        },
        {
          id: 2,
          title: `${foodItem.name} Soup`,
          readyInMinutes: 35,
          servings: 6,
          summary: `A hearty and nutritious soup that's perfect for using up ${foodItem.name.toLowerCase()} before it goes bad.`,
          instructions: `1. Sauté onions and garlic in a large pot.\n2. Add ${foodItem.name.toLowerCase()} and cook for 5 minutes.\n3. Pour in vegetable or chicken broth.\n4. Simmer for 20-25 minutes until tender.\n5. Season with herbs and spices to taste.`,
          ingredients: [
            `3 cups ${foodItem.name.toLowerCase()}`,
            "1 onion, diced",
            "3 cloves garlic",
            "6 cups broth",
            "Salt and pepper to taste",
            "Fresh herbs",
          ],
        },
        {
          id: 3,
          title: `Roasted ${foodItem.name}`,
          readyInMinutes: 45,
          servings: 4,
          summary: `Simple roasted ${foodItem.name.toLowerCase()} that brings out natural flavors and makes a great side dish.`,
          instructions: `1. Preheat oven to 400°F (200°C).\n2. Cut ${foodItem.name.toLowerCase()} into even pieces.\n3. Toss with olive oil, salt, and pepper.\n4. Roast for 25-35 minutes until tender.\n5. Garnish with fresh herbs before serving.`,
          ingredients: [
            `2 lbs ${foodItem.name.toLowerCase()}`,
            "3 tbsp olive oil",
            "Salt and pepper",
            "Fresh rosemary or thyme",
            "Optional: garlic powder",
          ],
        },
      ]

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setRecipes(mockRecipes)
    } catch (error) {
      console.error("Error fetching recipes:", error)
    } finally {
      setLoading(false)
    }
  }

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-700 flex items-center gap-2">
            <ChefHat className="w-6 h-6" />
            Recipe Ideas for {foodItem?.name}
          </DialogTitle>
          <DialogDescription>
            Here are some delicious recipes to help you use up your {foodItem?.name.toLowerCase()} before it expires!
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="ml-2 text-gray-600">Finding perfect recipes...</span>
          </div>
        ) : (
          <div className="grid gap-6 py-4">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{recipe.title}</h3>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {recipe.readyInMinutes} min
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {recipe.servings} servings
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{stripHtml(recipe.summary)}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Ingredients:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Instructions:</h4>
                    <div className="text-sm text-gray-600 whitespace-pre-line">{recipe.instructions}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
