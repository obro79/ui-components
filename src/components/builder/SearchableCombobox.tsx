import { Combobox } from "@base-ui/react/combobox"
import { Check, ChevronDown, Search, X } from "lucide-react"
import { useId, useState } from "react"
import { useThemePortalContainer } from "./useThemePortalContainer"

export type ComboboxOption = {
  value: string
  label: string
  description?: string
}

const DEFAULT_OPTIONS: ComboboxOption[] = [
  { value: "minimalism", label: "Minimalism", description: "Quiet essentials and generous whitespace" },
  { value: "swiss", label: "Swiss", description: "Strict grid and objective hierarchy" },
  { value: "editorial", label: "Editorial", description: "Publication scale and asymmetric rhythm" },
  { value: "saas-modern", label: "SaaS Modern", description: "Friendly product surfaces and clear actions" },
  { value: "mission-control", label: "Mission Control", description: "Dense operational panels and live state" },
  { value: "neo-brutalism", label: "Neo-brutalism", description: "Flat color, hard borders, and offset depth" },
]

export type SearchableComboboxProps = {
  options?: ComboboxOption[]
  label?: string
  placeholder?: string
  defaultValue?: ComboboxOption | null
  onValueChange?: (value: ComboboxOption | null) => void
}

export function SearchableCombobox({
  options = DEFAULT_OPTIONS,
  label = "Visual direction",
  placeholder = "Search styles…",
  defaultValue = null,
  onValueChange,
}: SearchableComboboxProps) {
  const inputId = useId()
  const { rootRef, portalContainer } = useThemePortalContainer()
  const [selected, setSelected] = useState<ComboboxOption | null>(defaultValue)
  const [query, setQuery] = useState("")
  const updateValue = (next: ComboboxOption | null) => {
    setSelected(next)
    onValueChange?.(next)
  }

  return <div ref={rootRef} className="builder-combobox-demo">
    <Combobox.Root<ComboboxOption>
      items={options}
      value={selected}
      onValueChange={updateValue}
      onInputValueChange={setQuery}
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.value}
      autoHighlight
    >
      <label className="builder-field-label" htmlFor={inputId}>{label}</label>
      <Combobox.InputGroup className="builder-combobox-input-group">
        <Search aria-hidden="true" size={17} />
        <Combobox.Input id={inputId} className="builder-combobox-input" placeholder={placeholder} />
        <div className="builder-combobox-actions">
          <Combobox.Clear className="builder-icon-button builder-combobox-clear" aria-label="Clear selection and search"><X aria-hidden="true" size={15} /></Combobox.Clear>
          <Combobox.Trigger className="builder-icon-button" aria-label="Open style options"><ChevronDown aria-hidden="true" size={16} /></Combobox.Trigger>
        </div>
      </Combobox.InputGroup>

      <Combobox.Portal className="builder-portal" container={portalContainer}>
        <Combobox.Positioner className="builder-combobox-positioner" sideOffset={6}>
          <Combobox.Popup className="builder-combobox-popup">
            <Combobox.Empty className="builder-combobox-empty">No styles match “{query}”.</Combobox.Empty>
            <Combobox.List className="builder-combobox-list">
              {(option: ComboboxOption) => <Combobox.Item key={option.value} value={option} className="builder-combobox-item">
                <Combobox.ItemIndicator className="builder-combobox-indicator"><Check aria-hidden="true" size={15} /></Combobox.ItemIndicator>
                <span><strong>{option.label}</strong>{option.description && <small>{option.description}</small>}</span>
              </Combobox.Item>}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
    <p className="builder-status-line" aria-live="polite">Selected: <strong>{selected?.label ?? "None"}</strong></p>
  </div>
}
