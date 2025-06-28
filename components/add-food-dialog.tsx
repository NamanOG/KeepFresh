"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf } from "lucide-react"

interface AddFoodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (item: { name: string; category: string; expiry_date: string }) => void
}

const categories = [
  { value: "Fruits", emoji: "🍎" },
  { value: "Vegetables", emoji: "🥕" },
  { value: "Dairy", emoji: "🥛" },
  { value: "Grains", emoji: "🌾" },
  { value: "Pantry", emoji: "🥫" },
  { value: "Frozen", emoji: "🧊" },
  { value: "Beverages", emoji: "🥤" },
  { value: "Other", emoji: "📦" },
]

export function AddFoodDialog({ open, onOpenChange, onAdd }: AddFoodDialogProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [expiryDate, setExpiryDate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && category && expiryDate) {
      onAdd({
        name,
        category,
        expiry_date: expiryDate,
      })
      setName("")
      setCategory("")
      setExpiryDate("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] mx-4 w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            Add Fresh Item
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Track a new food item and get notified before it expires
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                Food Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Bananas, Milk, Chicken"
                className="min-h-[48px] border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="min-h-[48px] border-2 border-gray-200 focus:border-emerald-500 rounded-xl">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="min-h-[44px] flex items-center rounded-lg">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{cat.emoji}</span>
                        {cat.value}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="expiry" className="text-sm font-semibold text-gray-700">
                Expiry Date
              </Label>
              <Input
                id="expiry"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="min-h-[48px] border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                required
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto min-h-[48px] border-2 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto min-h-[48px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg rounded-xl"
            >
              ✨ Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
