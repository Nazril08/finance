"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

type Transaction = {
  id: number
  date: Date
  description: string
  type: "income" | "expense"
  amount: number
  walletId: number
}

const TRANSACTIONS_STORAGE_KEY = "my-transactions"

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY)
    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date),
      }))
      setTransactions(parsedTransactions)
    }
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, 3).map((transaction) => (
            <div key={transaction.id} className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">
                  {format(transaction.date, "PPP")}
                </p>
              </div>
              <div className="flex items-center">
                <span
                  className={`text-sm font-medium ${
                    transaction.type === "income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}Rp
                  {transaction.amount.toLocaleString("id-ID")}
                </span>
                {transaction.type === "income" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400 ml-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400 ml-1" />
                )}
              </div>
            </div>
          ))}
        </div>
        <Button asChild className="w-full mt-4" variant="outline">
          <Link href="/transactions">View All Transactions</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
