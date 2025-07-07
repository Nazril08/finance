"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AddWalletModal, WalletFormValues } from "@/components/add-wallet-modal"
import { EditWalletModal } from "@/components/edit-wallet-modal"
import { DeleteWalletDialog } from "@/components/delete-wallet-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WalletIcon, MoreHorizontal } from "lucide-react"

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  image?: string | null;
}

export function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const storedWallets = localStorage.getItem("wallets");
      if (storedWallets) {
        return JSON.parse(storedWallets).map((w: any) => ({ ...w, id: String(w.id) }));
      }
    } catch (error) {
      console.error("Failed to parse wallets from localStorage on init", error);
    }
    return [];
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [walletToEdit, setWalletToEdit] = useState<Wallet | null>(null)
  const [walletToDelete, setWalletToDelete] = useState<Wallet | null>(null)

  useEffect(() => {
    localStorage.setItem("wallets", JSON.stringify(wallets));
  }, [wallets]);


  const handleAddWallet = (data: WalletFormValues) => {
    const newWallet: Wallet = {
      id: crypto.randomUUID(),
      name: data.name,
      balance: data.balance,
      image: data.image as string | null,
    }
    setWallets((prev) => [...prev, newWallet])
  }

  const handleUpdateWallet = (updatedWallet: Wallet) => {
    setWallets(wallets.map((wallet) =>
      wallet.id === updatedWallet.id ? updatedWallet : wallet
    ))
    
    try {
        const storedTransactions = localStorage.getItem("transactions")
        if (storedTransactions) {
          let transactions = JSON.parse(storedTransactions)
          transactions = transactions.map((t: any) => {
            if (t.walletId === updatedWallet.id) {
              return { ...t, walletName: updatedWallet.name }
            }
            return t
          })
          localStorage.setItem("transactions", JSON.stringify(transactions))
        }
    } catch (error) {
        console.error("Failed to update transactions in localStorage", error);
    }
  }

  const handleDeleteWallet = () => {
    if (!walletToDelete) return

    try {
        const storedTransactions = localStorage.getItem("transactions")
        if (storedTransactions) {
            const transactions = JSON.parse(storedTransactions)
            const updatedTransactions = transactions.filter((t: any) => t.walletId !== walletToDelete.id)
            localStorage.setItem("transactions", JSON.stringify(updatedTransactions))
        }
    } catch (error) {
        console.error("Failed to update transactions in localStorage", error);
    }
    
    setWallets(wallets.filter((wallet) => wallet.id !== walletToDelete.id))
    setIsDeleteDialogOpen(false)
    setWalletToDelete(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Wallets</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add Wallet</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wallets.map((wallet) => (
          <Card key={wallet.id} className="overflow-hidden">
            <div className="h-40 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              {wallet.image ? (
                <img src={wallet.image} alt={wallet.name} className="h-full w-full object-cover" />
              ) : (
                <WalletIcon className="h-16 w-16 text-gray-400" />
              )}
            </div>
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg font-semibold">{wallet.name}</CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(wallet.balance)}
                        </p>
                    </div>
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
                                onClick={() => {
                                    setWalletToEdit(wallet)
                                    setIsEditModalOpen(true)
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    setWalletToDelete(wallet)
                                    setIsDeleteDialogOpen(true)
                                }}
                                className="text-red-600"
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddWalletModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddWallet={handleAddWallet}
      />
      
      <EditWalletModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setWalletToEdit(null)
        }}
        wallet={walletToEdit}
        onUpdateWallet={handleUpdateWallet}
      />
      
      <DeleteWalletDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setWalletToDelete(null)
        }}
        onConfirm={handleDeleteWallet}
      />
    </div>
  )
} 