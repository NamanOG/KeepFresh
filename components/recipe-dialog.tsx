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

    // Generate vegetarian recipes based on food category
    const getRecipesByCategory = (name: string, category: string) => {
      const baseRecipes = [
        // Fruits recipes
        {
          id: "1",
          title: `Fresh ${name} Smoothie Bowl`,
          description: `A nutritious and refreshing smoothie bowl featuring ${name}. Perfect for breakfast or a healthy snack.`,
          cookTime: "5 mins",
          servings: 1,
          difficulty: "Easy",
          ingredients: [
            `1 cup ${name}`,
            "1/2 cup Greek yogurt",
            "1 tbsp honey",
            "1/4 cup granola",
            "2 tbsp chia seeds",
            "Fresh mint leaves",
            "Mixed berries for topping",
            "A splash of milk",
          ],
          instructions: [
            `Blend ${name} with Greek yogurt, honey, and milk until smooth`,
            "Pour into a bowl",
            "Top with granola, chia seeds, and fresh berries",
            "Garnish with mint leaves",
            "Serve immediately and enjoy!",
          ],
        },
        {
          id: "2",
          title: `${name} Milkshake`,
          description: `A creamy and delicious milkshake with ${name}. Perfect for a refreshing treat.`,
          cookTime: "5 mins",
          servings: 2,
          difficulty: "Easy",
          ingredients: [
            `1 cup ${name}`,
            "2 cups whole milk",
            "3 scoops vanilla ice cream",
            "2 tbsp sugar (optional)",
            "1/2 tsp vanilla extract",
            "Whipped cream for topping",
            "Chopped nuts for garnish",
          ],
          instructions: [
            `Blend ${name}, milk, ice cream, sugar, and vanilla until smooth`,
            "Taste and adjust sweetness if needed",
            "Pour into tall glasses",
            "Top with whipped cream",
            "Garnish with chopped nuts and serve with a straw",
          ],
        },
      ]

      // Vegetables recipes
      if (category === "Vegetables") {
        return [
          {
            id: "1",
            title: `Creamy ${name} Curry`,
            description: `A rich and flavorful curry featuring ${name} in a creamy tomato base. Perfect with rice or naan.`,
            cookTime: "30 mins",
            servings: 4,
            difficulty: "Medium",
            ingredients: [
              `2 cups ${name}, chopped`,
              "1 large onion, diced",
              "3 cloves garlic, minced",
              "1 inch ginger, grated",
              "1 can diced tomatoes",
              "1/2 cup heavy cream",
              "2 tbsp ghee or butter",
              "2 tsp garam masala",
              "1 tsp turmeric",
              "1 tsp cumin",
              "Salt and pepper to taste",
              "Fresh cilantro for garnish",
            ],
            instructions: [
              "Heat ghee in a large pan over medium heat",
              "Add onion, garlic, and ginger, cook until golden",
              "Add garam masala, turmeric, and cumin, cook for 1 minute",
              `Add ${name} and cook for 5 minutes`,
              "Add diced tomatoes and simmer for 15 minutes",
              "Stir in heavy cream and simmer for 5 more minutes",
              "Season with salt and pepper",
              "Garnish with fresh cilantro and serve with rice or naan",
            ],
          },
          {
            id: "2",
            title: `Cheesy ${name} Gratin`,
            description: `A comforting baked dish with ${name} in a creamy cheese sauce.`,
            cookTime: "45 mins",
            servings: 6,
            difficulty: "Medium",
            ingredients: [
              `3 cups ${name}, sliced`,
              "2 tbsp butter",
              "2 tbsp all-purpose flour",
              "2 cups whole milk",
              "1 cup grated cheddar cheese",
              "1/2 cup grated parmesan cheese",
              "1/4 tsp nutmeg",
              "Salt and pepper to taste",
              "2 tbsp breadcrumbs",
              "Fresh thyme for garnish",
            ],
            instructions: [
              "Preheat oven to 375°F (190°C)",
              "Melt butter in a saucepan, whisk in flour",
              "Gradually add milk, whisking until smooth",
              "Add cheddar cheese and stir until melted",
              "Season with nutmeg, salt, and pepper",
              `Layer ${name} in a baking dish, pour cheese sauce over`,
              "Top with parmesan and breadcrumbs",
              "Bake for 30-35 minutes until golden and bubbly",
            ],
          },
          {
            id: "3",
            title: `${name} Paneer Stir-fry`,
            description: `Quick and healthy stir-fry with ${name} and protein-rich paneer.`,
            cookTime: "15 mins",
            servings: 3,
            difficulty: "Easy",
            ingredients: [
              `2 cups ${name}, sliced`,
              "200g paneer, cubed",
              "2 tbsp ghee",
              "2 cloves garlic, minced",
              "1 tbsp fresh ginger, grated",
              "1 tsp cumin seeds",
              "1/2 tsp turmeric",
              "1 tsp coriander powder",
              "Salt to taste",
              "Fresh cilantro for garnish",
              "Lemon juice",
            ],
            instructions: [
              "Heat ghee in a wok or large pan",
              "Add cumin seeds and let them splutter",
              "Add paneer cubes and cook until golden, remove and set aside",
              "Add garlic and ginger to the pan, stir for 30 seconds",
              `Add ${name} and stir-fry for 3-4 minutes`,
              "Add turmeric, coriander powder, and salt",
              "Return paneer to pan and stir-fry for another 2 minutes",
              "Garnish with cilantro and a squeeze of lemon juice",
            ],
          },
        ]
      }

      // Dairy recipes
      if (category === "Dairy") {
        return [
          {
            id: "1",
            title: `${name} Pasta Alfredo`,
            description: `Rich and creamy pasta featuring ${name}. Classic comfort food.`,
            cookTime: "20 mins",
            servings: 4,
            difficulty: "Medium",
            ingredients: [
              "400g fettuccine pasta",
              `1 cup ${name}, grated or crumbled`,
              "4 tbsp butter",
              "3 cloves garlic, minced",
              "1 cup heavy cream",
              "1/2 cup parmesan cheese",
              "2 tbsp fresh parsley, chopped",
              "Salt and pepper to taste",
              "Pine nuts for garnish",
            ],
            instructions: [
              "Cook pasta according to package instructions",
              "Melt butter in a large pan, add garlic and cook for 1 minute",
              `Add ${name} and cook until melted/heated through`,
              "Pour in heavy cream and bring to a gentle simmer",
              "Add parmesan cheese and stir until smooth",
              "Toss with cooked pasta and fresh parsley",
              "Season with salt and pepper",
              "Garnish with pine nuts and serve immediately",
            ],
          },
          {
            id: "2",
            title: `${name} and Herb Naan Pizza`,
            description: `Delicious naan pizza topped with ${name} and fresh herbs.`,
            cookTime: "15 mins",
            servings: 2,
            difficulty: "Easy",
            ingredients: [
              "2 naan breads",
              `1/2 cup ${name}, crumbled or sliced`,
              "2 tbsp butter, melted",
              "1 red onion, thinly sliced",
              "2 tbsp fresh rosemary",
              "1/4 cup mozzarella cheese",
              "2 tbsp honey",
              "Arugula for topping",
              "Salt and pepper",
            ],
            instructions: [
              "Preheat oven to 425°F (220°C)",
              "Brush naan with melted butter",
              `Spread ${name} evenly on naan`,
              "Top with sliced onion, rosemary, and mozzarella",
              "Bake for 10-12 minutes until crispy and cheese is melted",
              "Drizzle with honey",
              "Top with fresh arugula before serving",
            ],
          },
        ]
      }

      // Grains recipes
      if (category === "Grains") {
        return [
          {
            id: "1",
            title: `${name} Kheer (Rice Pudding)`,
            description: `Traditional Indian rice pudding with ${name}. A comforting dessert.`,
            cookTime: "45 mins",
            servings: 4,
            difficulty: "Medium",
            ingredients: [
              `1/2 cup ${name}`,
              "4 cups whole milk",
              "1/3 cup sugar",
              "1/4 tsp cardamom powder",
              "2 tbsp chopped almonds",
              "2 tbsp raisins",
              "1 tbsp ghee",
              "Saffron strands",
              "Pistachios for garnish",
            ],
            instructions: [
              `Wash and soak ${name} for 30 minutes if using rice`,
              "Heat ghee in a heavy-bottomed pan",
              `Add ${name} and roast for 2-3 minutes`,
              "Add milk and bring to a boil, then simmer",
              "Cook for 30-40 minutes, stirring occasionally",
              "Add sugar, cardamom, almonds, and raisins",
              "Cook until thick and creamy",
              "Garnish with saffron and pistachios, serve warm or chilled",
            ],
          },
          {
            id: "2",
            title: `Cheesy ${name} Risotto`,
            description: `Creamy risotto with ${name} and plenty of cheese.`,
            cookTime: "35 mins",
            servings: 4,
            difficulty: "Medium",
            ingredients: [
              `1 cup ${name} (arborio rice works best)`,
              "4 cups warm vegetable broth",
              "1 onion, finely diced",
              "3 cloves garlic, minced",
              "1/2 cup white wine",
              "3 tbsp butter",
              "1/2 cup parmesan cheese",
              "1/4 cup heavy cream",
              "2 tbsp olive oil",
              "Fresh herbs for garnish",
              "Salt and pepper",
            ],
            instructions: [
              "Heat olive oil and 1 tbsp butter in a large pan",
              "Add onion and garlic, cook until soft",
              `Add ${name} and stir for 2 minutes`,
              "Pour in wine and stir until absorbed",
              "Add warm broth one ladle at a time, stirring constantly",
              "Continue until rice is creamy and tender (about 20 minutes)",
              "Stir in remaining butter, parmesan, and cream",
              "Season with salt and pepper",
              "Garnish with fresh herbs and serve immediately",
            ],
          },
        ]
      }

      // Default recipes for other categories
      return baseRecipes.concat([
        {
          id: "3",
          title: `${name} Kulfi`,
          description: `Traditional Indian ice cream with ${name}. Rich and creamy frozen dessert.`,
          cookTime: "20 mins + freeze time",
          servings: 6,
          difficulty: "Medium",
          ingredients: [
            `1 cup ${name}, mashed or chopped`,
            "2 cups whole milk",
            "1/2 cup heavy cream",
            "1/3 cup sugar",
            "1/4 tsp cardamom powder",
            "2 tbsp chopped pistachios",
            "2 tbsp chopped almonds",
            "Pinch of saffron",
          ],
          instructions: [
            "Heat milk in a heavy-bottomed pan and reduce to half",
            `Add ${name}, sugar, and cardamom, mix well`,
            "Add cream and saffron, stir until sugar dissolves",
            "Let the mixture cool completely",
            "Pour into kulfi molds or small cups",
            "Freeze for 6-8 hours until set",
            "Garnish with chopped nuts before serving",
          ],
        },
      ])
    }

    const mockRecipes = getRecipesByCategory(foodItem?.name || "", foodItem?.category || "")

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
            🥬 Vegetarian Recipe Ideas for {foodItem?.name}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Delicious vegetarian recipes to use up your {foodItem?.name} and reduce food waste
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
              <Sparkles className="w-5 h-5 text-emerald-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-4 text-lg font-medium text-gray-600">Generating delicious vegetarian recipes...</p>
            <p className="text-sm text-gray-500">Pure vegetarian goodness coming right up! 🥬</p>
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
                        <span className="text-2xl">{index === 0 ? "🍛" : index === 1 ? "🧀" : "🥛"}</span>
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
                    <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                      <span className="text-green-600 text-xs font-semibold">🥬 Vegetarian</span>
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
