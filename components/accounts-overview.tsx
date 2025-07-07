"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

type Wallet = {
  id: number
  name: string
  balance: number
  image?: string | null
}

const WALLETS_STORAGE_KEY = "my-wallets"

export function AccountsOverview() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const handleStorageChange = () => {
      const savedWallets = localStorage.getItem(WALLETS_STORAGE_KEY)
      if (savedWallets) {
        setWallets(JSON.parse(savedWallets))
      }
    }

    handleStorageChange()
    window.addEventListener("storage", handleStorageChange)
    setIsLoaded(true)
    
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0)

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Accounts Overview</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Accounts Overview</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          Rp{totalBalance.toLocaleString("id-ID")}
        </div>
        <p className="text-xs text-muted-foreground">
          Total balance across all accounts
        </p>
        <ScrollArea className="h-[120px] mt-4">
          <div className="space-y-2 pr-4">
            {wallets.map((account) => (
              <div
                key={account.id}
                className="flex justify-between items-center"
              >
                <span className="text-sm text-muted-foreground">
                  {account.name}
                </span>
                <span className="text-sm font-medium">
                  Rp{account.balance.toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
