import { Dialog } from "@base-ui/react/dialog"
import { PanelBottom, PanelLeft, PanelRight, PanelTop, X } from "lucide-react"
import { useId, useState, type ReactNode } from "react"
import { useThemePortalContainer } from "./useThemePortalContainer"

export type SheetSide = "top" | "right" | "bottom" | "left"

export type SheetProps = {
  side?: SheetSide
  title?: string
  description?: string
  triggerLabel?: string
  children?: ReactNode
}

export function Sheet({
  side = "right",
  title = "Workspace settings",
  description = "Adjust this project without leaving the current page.",
  triggerLabel = "Open sheet",
  children,
}: SheetProps) {
  const { rootRef, portalContainer } = useThemePortalContainer()
  const fieldId = useId()
  const SideIcon = side === "top" ? PanelTop : side === "bottom" ? PanelBottom : side === "left" ? PanelLeft : PanelRight

  return <div ref={rootRef} className="builder-sheet-root">
    <Dialog.Root>
      <Dialog.Trigger className="builder-control-button">{triggerLabel}<SideIcon aria-hidden="true" size={16} /></Dialog.Trigger>
      <Dialog.Portal className="builder-portal" container={portalContainer}>
        <Dialog.Backdrop className="builder-sheet-backdrop" />
        <Dialog.Popup className={`builder-sheet builder-sheet--${side}`}>
          <div className="builder-sheet-header">
            <div><Dialog.Title className="builder-sheet-title">{title}</Dialog.Title><Dialog.Description className="builder-sheet-description">{description}</Dialog.Description></div>
            <Dialog.Close className="builder-icon-button builder-sheet-close" aria-label="Close sheet"><X aria-hidden="true" size={17} /></Dialog.Close>
          </div>
          <div className="builder-sheet-body">
            {children ?? <>
              <label className="builder-field-label" htmlFor={`${fieldId}-name`}>Project name</label>
              <input className="builder-text-input" id={`${fieldId}-name`} defaultValue="UI Made Easy" />
              <label className="builder-field-label" htmlFor={`${fieldId}-density`}>Density</label>
              <select className="builder-text-input" id={`${fieldId}-density`} defaultValue="comfortable"><option value="comfortable">Comfortable</option><option value="compact">Compact</option><option value="spacious">Spacious</option></select>
            </>}
          </div>
          <div className="builder-sheet-footer"><Dialog.Close className="builder-control-button builder-control-button--quiet">Cancel</Dialog.Close><Dialog.Close className="builder-control-button builder-control-button--primary">Save changes</Dialog.Close></div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  </div>
}

const SIDE_OPTIONS: Array<{ side: SheetSide; label: string; icon: ReactNode }> = [
  { side: "top", label: "Top", icon: <PanelTop aria-hidden="true" size={16} /> },
  { side: "right", label: "Right", icon: <PanelRight aria-hidden="true" size={16} /> },
  { side: "bottom", label: "Bottom", icon: <PanelBottom aria-hidden="true" size={16} /> },
  { side: "left", label: "Left", icon: <PanelLeft aria-hidden="true" size={16} /> },
]

export function SheetDemo() {
  const [side, setSide] = useState<SheetSide>("right")
  return <div className="builder-sheet-demo">
    <div className="builder-segmented" role="group" aria-label="Sheet edge">
      {SIDE_OPTIONS.map((option) => <button key={option.side} type="button" aria-pressed={side === option.side} onClick={() => setSide(option.side)}>{option.icon}<span>{option.label}</span></button>)}
    </div>
    <Sheet side={side} triggerLabel={`Open ${side} sheet`} />
  </div>
}
