"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"

const walletFormSchema = z.object({
  name: z.string().min(2, "Wallet name must be at least 2 characters."),
  balance: z.coerce.number().positive("Initial balance must be a positive number."),
  image: z.any().optional(),
})

export type WalletFormValues = z.infer<typeof walletFormSchema>

interface EditWalletModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdateWallet: (values: WalletFormValues) => void
  wallet: { id: number; name: string; balance: number; image?: string | null } | null
}

export function EditWalletModal({ isOpen, onClose, onUpdateWallet, wallet }: EditWalletModalProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const form = useForm<WalletFormValues>({
    resolver: zodResolver(walletFormSchema),
  })

  useEffect(() => {
    if (wallet) {
      form.reset({
        name: wallet.name,
        balance: wallet.balance,
      })
      setPreview(wallet.image || null)
    }
  }, [wallet, form])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function onSubmit(data: WalletFormValues) {
    onUpdateWallet({ ...data, image: preview })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Wallet</DialogTitle>
          <DialogDescription>
            Update the details for your wallet. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mandiri, ShopeePay" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Image (Optional)</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={handleImageChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {preview && (
              <div className="flex justify-center">
                <Image src={preview} alt="Image preview" width={100} height={100} className="rounded-md object-cover"/>
              </div>
            )}
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 