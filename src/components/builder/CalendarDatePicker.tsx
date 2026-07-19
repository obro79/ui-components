import { CalendarDays, X } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

const dateFormatter = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })

export type CalendarDatePickerProps = {
  label?: string
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date | undefined) => void
}

export function CalendarDatePicker({ label = "Launch date", value, defaultValue, onValueChange }: CalendarDatePickerProps) {
  const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue)
  const [open, setOpen] = useState(false)
  const selected = value === undefined ? internalValue : value

  const update = (date: Date | undefined) => {
    if (value === undefined) setInternalValue(date)
    onValueChange?.(date)
  }

  const selectDate = (date: Date | undefined) => {
    update(date)
    if (date) setOpen(false)
  }

  return <div className="builder-calendar-demo">
    <span className="builder-field-label">{label}</span>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="builder-date-trigger">
        <CalendarDays aria-hidden="true" size={17} />
        <span>{selected ? dateFormatter.format(selected) : "Choose a date"}</span>
        <span className="builder-date-trigger__hint" aria-hidden="true">Open</span>
      </PopoverTrigger>
      <PopoverContent className="builder-calendar-popover" side="bottom" aria-label={`${label} calendar`}>
        <DayPicker mode="single" selected={selected} onSelect={selectDate} showOutsideDays fixedWeeks />
        <div className="builder-calendar-footer">
          <span aria-live="polite">{selected ? dateFormatter.format(selected) : "No date selected"}</span>
          <button type="button" className="builder-control-button builder-control-button--quiet" disabled={!selected} onClick={() => update(undefined)}><X aria-hidden="true" size={15} />Clear</button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
}
