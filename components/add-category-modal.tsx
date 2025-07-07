"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Category } from "./categories-page"
import { IconPicker } from "./icon-picker"
import { IconName } from "@/lib/icons"

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onCategoryAdded: (category: { name: string; parentId?: string; icon?: IconName }) => void
  categories: Category[]
}

export function AddCategoryModal({ isOpen, onClose, onCategoryAdded, categories }: AddCategoryModalProps) {
  const [name, setName] = useState("")
  const [parentId, setParentId] = useState<string | undefined>()
  const [icon, setIcon] = useState<IconName | undefined>()

  useEffect(() => {
    if (isOpen) {
      setName("")
      setParentId(undefined)
      setIcon(undefined)
    }
  }, [isOpen])

  const handleSubmit = () => {
    if (name.trim()) {
      onCategoryAdded({ name, parentId, icon })
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Enter a name for your new category.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="parent" className="text-right">
              Parent
            </Label>
            <Select onValueChange={setParentId} value={parentId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a parent category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Parent</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Icon
            </Label>
            <div className="col-span-3">
              <IconPicker value={icon} onChange={setIcon} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 