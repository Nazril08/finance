"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AddTransactionModal } from "./add-transaction-modal"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Wallet } from "./wallets-page"

// Defining the transaction structure
export interface Transaction {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  walletId: string
  date: Date
  categoryId?: string
}

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    try {
      const storedTransactions = localStorage.getItem("transactions")
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions).map((t: any) => ({ ...t, date: new Date(t.date) })))
      }
      const storedWallets = localStorage.getItem("wallets")
      if (storedWallets) {
        const parsedWallets = JSON.parse(storedWallets).map((w: any) => ({ ...w, id: String(w.id) }))
        setWallets(parsedWallets)
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
  }, [transactions])

  const handleTransactionAdded = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID() }
    
    setTransactions(prev => [newTransaction, ...prev])

    const updatedWallets = wallets.map(wallet => {
      if (wallet.id === newTransaction.walletId) {
        return {
          ...wallet,
          balance: wallet.balance + newTransaction.amount
        }
      }
      return wallet
    })
    setWallets(updatedWallets)
    localStorage.setItem("wallets", JSON.stringify(updatedWallets))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>
      <DataTable columns={columns} data={transactions} />
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={handleTransactionAdded}
        wallets={wallets}
      />
    </div>
  )
}