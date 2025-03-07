"use client"
import { Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface TimePickerProps {
  id: string
  label?: string
  value: string
  onChange: (value: string) => void
}

export function TimePicker({ id, label, value, onChange }: TimePickerProps) {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input id={id} type="time" value={value} onChange={(e) => onChange(e.target.value)} className="pl-10" />
        <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}

