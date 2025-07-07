"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Transaction } from "./transactions-page"
import { Wallet } from "./wallets-page"
import { Category } from "./categories-page"

const getWalletName = (walletId: string, wallets: Wallet[]): string => {
  const wallet = wallets.find(w => w.id === walletId)
  return wallet?.name || "N/A"
}

const getCategoryName = (categoryId: string | undefined, categories: Category[]): string => {
  if (!categoryId) return "N/A"
  const category = categories.find(c => c.id === categoryId)
  return category?.name || "N/A"
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "walletId",
    header: "Wallet",
    cell: ({ row }) => {
        const wallets: Wallet[] = JSON.parse(localStorage.getItem("wallets") || "[]");
        const walletId = row.getValue("walletId") as string;
        return getWalletName(walletId, wallets)
    }
  },
  {
    accessorKey: "categoryId",
    header: "Category",
    cell: ({ row }) => {
        const categories: Category[] = JSON.parse(localStorage.getItem("categories") || "[]");
        const categoryId = row.getValue("categoryId") as string | undefined;
        return getCategoryName(categoryId, categories)
    }
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"))
      return new Intl.DateTimeFormat("en-US").format(date)
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(transaction.id)}
            >
              Copy transaction ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 