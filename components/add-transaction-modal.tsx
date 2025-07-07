"use client"

import { useState, useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Transaction } from "./transactions-page"
import { Category } from "./categories-page"
import { Wallet } from "./wallets-page"

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onTransactionAdded: (transaction: Omit<Transaction, "id">) => void
  wallets: Wallet[]
}

export function AddTransactionModal({ isOpen, onClose, onTransactionAdded, wallets }: AddTransactionModalProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState(0)
  const [type, setType] = useState<"income" | "expense">("expense")
  const [walletId, setWalletId] = useState<string | undefined>()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState<string | undefined>()

  useEffect(() => {
    const storedCategories = localStorage.getItem("categories")
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories))
    }

    if (isOpen) {
      setDescription("")
      setAmount(0)
      setType("expense")
      setWalletId(undefined)
      setDate(new Date())
      setCategoryId(undefined)
    }
  }, [isOpen])

  const handleSubmit = () => {
    if (!description || !walletId || !date) {
      // Tambahkan validasi atau feedback ke pengguna
      return
    }

    onTransactionAdded({
      description,
      amount: type === "expense" ? -Math.abs(amount) : Math.abs(amount),
      type,
      walletId,
      date,
      categoryId,
    })

    onClose()
  }

  const parentCategories = categories.filter((c) => !c.parentId)
  const getSubcategories = (parentId: string) => categories.filter((c) => c.parentId === parentId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Enter the details for your new transaction.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Groceries, Salary"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select onValueChange={(value) => setType(value as "income" | "expense")} value={type}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="wallet" className="text-right">
              Wallet
            </Label>
            <Select onValueChange={setWalletId} value={walletId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a wallet" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Category</Label>
            <div className="col-span-3">
              <Select onValueChange={setCategoryId} value={categoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Category</SelectItem>
                  {parentCategories.map((pCat) => (
                    <SelectGroup key={pCat.id}>
                      <SelectItem value={pCat.id}>{pCat.name}</SelectItem>
                      {getSubcategories(pCat.id).map((sCat) => (
                        <SelectItem key={sCat.id} value={sCat.id} className="pl-6">
                          {sCat.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal col-span-3",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save Transaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 