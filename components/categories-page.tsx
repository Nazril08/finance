"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AddCategoryModal } from "./add-category-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon, IconName } from "@/lib/icons"

export interface Category {
  id: string
  name: string
  parentId?: string
  icon?: IconName
}

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    const storedCategories = localStorage.getItem("categories")
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories))
    }
  }, [])

  const handleAddCategory = (category: { name: string; parentId?: string; icon?: IconName }) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: category.name,
      parentId: category.parentId === "none" ? undefined : category.parentId,
      icon: category.icon,
    }
    const updatedCategories = [...categories, newCategory]
    setCategories(updatedCategories)
    localStorage.setItem("categories", JSON.stringify(updatedCategories))
  }

  const parentCategories = categories.filter((c) => !c.parentId)
  const getSubcategories = (parentId: string) => categories.filter((c) => c.parentId === parentId)

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
        
        <div className="space-y-4">
          {parentCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {category.icon && <Icon name={category.icon} className="mr-2 h-5 w-5" />}
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getSubcategories(category.id).length > 0 && (
                  <div className="ml-6 space-y-2">
                    <h4 className="text-sm font-semibold">Subcategories</h4>
                    {getSubcategories(category.id).map((subcategory) => (
                      <Card key={subcategory.id}>
                        <CardContent className="p-4 flex items-center">
                          {subcategory.icon && <Icon name={subcategory.icon} className="mr-2 h-5 w-5" />}
                          <p>{subcategory.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>No categories found.</p>
            <p className="text-sm">Get started by adding a new category.</p>
          </div>
        )}
      </div>
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCategoryAdded={handleAddCategory}
        categories={categories}
      />
    </>
  )
}
 