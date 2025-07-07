"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AddTransactionModal, TransactionFormValues } from "./add-transaction-modal"
import { format } from "date-fns"

type Wallet = {
  id: number
  name: string
  balance: number
  image?: string | null
}

type Transaction = {
  id: number
  date: Date
  description: string
  type: "income" | "expense"
  amount: number
  walletId: number
}

const WALLETS_STORAGE_KEY = "my-wallets"
const TRANSACTIONS_STORAGE_KEY = "my-transactions"

export function TransactionsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedWallets = localStorage.getItem(WALLETS_STORAGE_KEY)
    const savedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY)
    if (savedWallets) setWallets(JSON.parse(savedWallets))
    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date),
      }))
      setTransactions(parsedTransactions)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(wallets))
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions))
    }
  }, [wallets, transactions, isLoaded])

  const handleAddTransaction = (data: TransactionFormValues) => {
    const newTransaction: Transaction = {
      ...data,
      id: Date.now(),
      walletId: Number(data.walletId),
    }
    setTransactions((prev) => [newTransaction, ...prev])

    setWallets((prevWallets) =>
      prevWallets.map((wallet) => {
        if (wallet.id === newTransaction.walletId) {
          const newBalance =
            newTransaction.type === "income"
              ? wallet.balance + newTransaction.amount
              : wallet.balance - newTransaction.amount
          return { ...wallet, balance: newBalance }
        }
        return wallet
      })
    )
  }

  const getWalletName = (walletId: number) => {
    return wallets.find((w) => w.id === walletId)?.name || "N/A"
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{format(transaction.date, "PPP")}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{getWalletName(transaction.walletId)}</TableCell>
                <TableCell>
                  <Badge variant={transaction.type === "income" ? "default" : "destructive"}>
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {transaction.type === "income" ? "+" : "-"} Rp
                  {transaction.amount.toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        wallets={wallets}
      />
    </>
  )
} 