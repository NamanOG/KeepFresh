"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, ChefHat, Sparkles } from "lucide-react"

interface RecipeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  foodItem: { name: string; category: string } | null
}

interface Recipe {
  id: string
  title: string
  description: string
  cookTime: string
  servings: number
  difficulty: string
  ingredients: string[]
  instructions: string[]
}

export function RecipeDialog({ open, onOpenChange, foodItem }: RecipeDialogProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && foodItem) {
      generateRecipes()
    }
  }, [open, foodItem])

  const generateRecipes = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockRecipes: Recipe[] = [
      {
        id: "1",
        title: `Quick ${foodItem?.name} Stir-fry`,
        description: `A delicious and quick way to use up your ${foodItem?.name} before it expires.`,
        cookTime: "15 mins",
        servings: 2,
        difficulty: "Easy",
        ingredients: [
          `1 cup ${foodItem?.name}`,
          "2 tbsp olive oil",
          "1 onion, sliced",
          "2 cloves garlic, minced",
          "Salt and pepper to taste",
          "Soy sauce",
        ],
        instructions: [
          "Heat oil in a large pan over medium-high heat",
          `Add ${foodItem?.name} and cook for 3-4 minutes`,
          "Add onion and garlic, cook until fragrant",
          "Season with salt, pepper, and soy sauce",
          "Serve immediately over rice",
        ],
      },
      {
        id: "2",
        title: `${foodItem?.name} Smoothie Bowl`,
        description: `A healthy breakfast option featuring ${foodItem?.name}.`,
        cookTime: "5 mins",
        servings: 1,
        difficulty: "Easy",
        ingredients: [
          `1 cup ${foodItem?.name}`,
          "1/2 cup yogurt",
          "1 tbsp honey",
          "1/4 cup granola",
          "Fresh berries for topping",
        ],
        instructions: [
          `Blend ${foodItem?.name} with yogurt and honey`,
          "Pour into a bowl",
          "Top with granola and berries",
          "Enjoy immediately",
        ],
      },
      {
        id: "3",
        title: `Roasted ${foodItem?.name} Medley`,
        description: `A simple roasted dish that brings out the natural flavors of ${foodItem?.name}.`,
        cookTime: "25 mins",
        servings: 4,
        difficulty: "Medium",
        ingredients: [
          `2 cups ${foodItem?.name}`,
          "3 tbsp olive oil",
          "1 tsp herbs (rosemary or thyme)",
          "Salt and pepper",
          "1 lemon, juiced",
        ],
        instructions: [
          "Preheat oven to 400°F (200°C)",
          `Toss ${foodItem?.name} with oil, herbs, salt, and pepper`,
          "Spread on baking sheet",
          "Roast for 20-25 minutes until tender",
          "Drizzle with lemon juice before serving",
        ],
      },
    ]

    setRecipes(mockRecipes)
    setLoading(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto mx-2 sm:mx-4 border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            Recipe Ideas for {foodItem?.name}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Creative ways to use up your {foodItem?.name} and reduce food waste
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
              <Sparkles className="w-5 h-5 text-emerald-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-4 text-lg font-medium text-gray-600">Generating delicious recipes...</p>
            <p className="text-sm text-gray-500">This may take a moment</p>
          </div>
        ) : (
          <div className="grid gap-6 py-4">
            {recipes.map((recipe, index) => (
              <Card
                key={recipe.id}
                className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-gray-50 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg font-bold text-gray-800 leading-tight flex items-center gap-2">
                        <span className="text-2xl">{index === 0 ? "🍳" : index === 1 ? "🥤" : "🔥"}</span>
                        {recipe.title}
                      </CardTitle>
                      <CardDescription className="mt-2 text-sm text-gray-600 leading-relaxed">
                        {recipe.description}
                      </CardDescription>
                    </div>
                    <Badge
                      className={`${getDifficultyColor(recipe.difficulty)} flex-shrink-0 text-xs font-semibold border`}
                    >
                      {recipe.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      {recipe.cookTime}
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                      <Users className="w-3 h-3" />
                      {recipe.servings} servings
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                      <h4 className="font-bold mb-3 text-emerald-800 flex items-center gap-2">🛒 Ingredients</h4>
                      <ul className="text-sm space-y-2">
                        {recipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-emerald-600 mt-1 flex-shrink-0">•</span>
                            <span className="break-words text-gray-700">{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <h4 className="font-bold mb-3 text-blue-800 flex items-center gap-2">👨‍🍳 Instructions</h4>
                      <ol className="text-sm space-y-3">
                        {recipe.instructions.map((instruction, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="bg-blue-600 text-white font-bold min-w-[24px] h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="break-words text-gray-700 leading-relaxed">{instruction}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto min-h-[48px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg rounded-xl"
          >
            ✨ Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
