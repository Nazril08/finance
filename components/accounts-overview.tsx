"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet as WalletIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Wallet } from "./wallets-page";

const WALLETS_STORAGE_KEY = "wallets"

export function AccountsOverview() {
  const [wallets, setWallets] = useState<Wallet[]>([])

  useEffect(() => {
    const handleStorageChange = () => {
      const savedWallets = localStorage.getItem(WALLETS_STORAGE_KEY)
      if (savedWallets) {
        try {
          const parsedWallets = JSON.parse(savedWallets).map((w: any) => ({ ...w, id: String(w.id) }))
          setWallets(parsedWallets)
        } catch (e) {
            console.error("Failed to parse wallets from storage", e)
            setWallets([])
        }
      } else {
        setWallets([])
      }
    }

    handleStorageChange()
    window.addEventListener("storage", handleStorageChange)
    
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Accounts Overview</CardTitle>
        <WalletIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalBalance)}
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
                  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(account.balance)}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
