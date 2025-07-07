"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, MoreVertical, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { AddWalletModal, WalletFormValues as AddWalletFormValues } from "./add-wallet-modal"
import { EditWalletModal, WalletFormValues as EditWalletFormValues } from "./edit-wallet-modal"
import { DeleteWalletDialog } from "./delete-wallet-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Wallet = {
  id: number
  name: string
  balance: number
  image?: string | null
}

type Transaction = {
  id: number
  walletId: number
}

const WALLETS_STORAGE_KEY = "my-wallets"
const TRANSACTIONS_STORAGE_KEY = "my-transactions"

const initialWallets: Wallet[] = [
  { id: 1, name: "BCA", balance: 5000000, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia_logo.svg/2560px-Bank_Central_Asia_logo.svg.png" },
  { id: 2, name: "GoPay", balance: 750000, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/2560px-Gopay_logo.svg.png" },
  { id: 3, name: "OVO", balance: 250000, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/2560px-Logo_ovo_purple.svg.png" },
]

export function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedWallets = localStorage.getItem(WALLETS_STORAGE_KEY)
    if (savedWallets && savedWallets !== "[]") {
      setWallets(JSON.parse(savedWallets))
    } else {
      setWallets(initialWallets)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(wallets))
    }
  }, [wallets, isLoaded])

  const handleAddWallet = (data: AddWalletFormValues) => {
    const newWallet: Wallet = {
      id: Date.now(),
      name: data.name,
      balance: data.balance,
      image: data.image,
    }
    setWallets((prev) => [...prev, newWallet])
  }
  
  const handleUpdateWallet = (data: EditWalletFormValues) => {
    if (!selectedWallet) return
    setWallets(wallets.map(w => w.id === selectedWallet.id ? { ...w, ...data } : w))
  }

  const handleDeleteWallet = () => {
    if (!selectedWallet) return
    
    const savedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY)
    if (savedTransactions) {
      let transactions: Transaction[] = JSON.parse(savedTransactions)
      transactions = transactions.filter(t => t.walletId !== selectedWallet.id)
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions))
    }

    setWallets(wallets.filter(w => w.id !== selectedWallet.id))
    setIsDeleteDialogOpen(false)
    setSelectedWallet(null)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">My Wallets</h1>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Wallet
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wallets.map((wallet) => (
            <Card key={wallet.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{wallet.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {wallet.image && <Image src={wallet.image} alt={wallet.name} width={40} height={40} className="rounded-md object-contain" />}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setSelectedWallet(wallet); setIsEditModalOpen(true); }}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedWallet(wallet); setIsDeleteDialogOpen(true); }} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rp{wallet.balance.toLocaleString("id-ID")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <AddWalletModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddWallet={handleAddWallet}
      />
      <EditWalletModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateWallet={handleUpdateWallet}
        wallet={selectedWallet}
      />
      <DeleteWalletDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteWallet}
      />
    </>
  )
} 