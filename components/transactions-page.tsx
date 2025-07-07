"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AddTransactionModal } from "./add-transaction-modal"
import { EditTransactionModal } from "./edit-transaction-modal"
import { DeleteTransactionDialog } from "./delete-transaction-dialog"
import { DataTable } from "./data-table"
import { columns, TransactionRow } from "./columns"
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
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const storedTransactions = localStorage.getItem("transactions")
      if (storedTransactions) {
        return JSON.parse(storedTransactions).map((t: any) => ({ ...t, date: new Date(t.date) }))
      }
    } catch (error) {
      console.error("Failed to parse transactions from localStorage on init", error)
    }
    return []
  })

  const [wallets, setWallets] = useState<Wallet[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const storedWallets = localStorage.getItem("wallets")
      if (storedWallets) {
        return JSON.parse(storedWallets).map((w: any) => ({ ...w, id: String(w.id) }))
      }
    } catch (error) {
      console.error("Failed to parse wallets from localStorage on init", error)
    }
    return []
  })
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null)
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem("wallets", JSON.stringify(wallets))
  }, [wallets])

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
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
  }
  
  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    const originalTransaction = transactions.find(t => t.id === updatedTransaction.id)
    if (!originalTransaction) return

    setTransactions(transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t))

    const balanceDifference = updatedTransaction.amount - originalTransaction.amount
    
    const updatedWallets = wallets.map(wallet => {
      // Revert original transaction amount
      if(wallet.id === originalTransaction.walletId) {
        wallet.balance -= originalTransaction.amount
      }
      // Apply new transaction amount
      if(wallet.id === updatedTransaction.walletId) {
        wallet.balance += updatedTransaction.amount
      }
      return wallet
    })

    setWallets(updatedWallets)
  }

  const handleDeleteTransaction = () => {
    if(!transactionToDelete) return

    setTransactions(transactions.filter(t => t.id !== transactionToDelete.id))

    const updatedWallets = wallets.map(wallet => {
      if (wallet.id === transactionToDelete.walletId) {
        return {
          ...wallet,
          balance: wallet.balance - transactionToDelete.amount
        }
      }
      return wallet
    })
    setWallets(updatedWallets)
    setIsDeleteDialogOpen(false)
    setTransactionToDelete(null)
  }

  const transactionsWithActions: TransactionRow[] = useMemo(() => transactions.map(transaction => ({
    ...transaction,
    onEdit: (t) => {
      setTransactionToEdit(t)
      setIsEditModalOpen(true)
    },
    onDelete: (t) => {
      setTransactionToDelete(t)
      setIsDeleteDialogOpen(true)
    },
  })), [transactions])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>
      <DataTable columns={columns} data={transactionsWithActions} />
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTransactionAdded={handleAddTransaction}
        wallets={wallets}
      />
      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => {
            setIsEditModalOpen(false)
            setTransactionToEdit(null)
        }}
        onTransactionUpdated={handleUpdateTransaction}
        transaction={transactionToEdit}
        wallets={wallets}
      />
      <DeleteTransactionDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
            setIsDeleteDialogOpen(false)
            setTransactionToDelete(null)
        }}
        onConfirm={handleDeleteTransaction}
      />
    </div>
  )
}