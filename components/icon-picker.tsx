"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Icon, iconList, IconName } from "@/lib/icons"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface IconPickerProps {
  value?: IconName
  onChange: (value: IconName) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? <Icon name={value} className="mr-2 h-4 w-4" /> : "Select icon..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search icon..." />
          <CommandEmpty>No icon found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {Object.keys(iconList).map((iconName) => (
              <CommandItem
                key={iconName}
                value={iconName}
                onSelect={(currentValue) => {
                  onChange(currentValue as IconName)
                  setOpen(false)
                }}
              >
                <Icon name={iconName as IconName} className="mr-2 h-4 w-4" />
                {iconName}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === iconName ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 