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

interface AddFoodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (item: { name: string; category: string; expiry_date: string }) => void
}

const categories = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Meat",
  "Seafood",
  "Grains",
  "Pantry",
  "Beverages",
  "Frozen",
  "Other",
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-700">Add Food Item</DialogTitle>
          <DialogDescription>
            Add a new food item to track its expiry date and get recipe suggestions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Food Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Carrots"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="focus:ring-emerald-500 focus:border-emerald-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiry" className="text-sm font-medium">
                Expiry Date
              </Label>
              <Input
                id="expiry"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="mr-2">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
