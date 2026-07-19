import { CheckCircle2, RotateCcw, TriangleAlert, X } from "lucide-react"
import { useState, type ReactNode } from "react"
import { Toaster, toast } from "sonner"

export function BuilderToastProvider({ children }: { children: ReactNode }) {
  return <>
    {children}
    <Toaster
      className="builder-toaster"
      position="bottom-right"
      closeButton
      duration={4200}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "builder-toast",
          title: "builder-toast__title",
          description: "builder-toast__description",
          icon: "builder-toast__icon",
          actionButton: "builder-toast__action",
          cancelButton: "builder-toast__action builder-toast__action--quiet",
          closeButton: "builder-toast__close",
          success: "builder-toast--success",
          error: "builder-toast--error",
        },
      }}
    />
  </>
}

export function ToastDemo() {
  const [lastEvent, setLastEvent] = useState("Ready")

  const showSuccess = () => {
    setLastEvent("Success toast shown")
    toast.success("Changes published", { description: "Your component library is now up to date." })
  }

  const showError = () => {
    setLastEvent("Error toast shown")
    toast.error("Export failed", { description: "Check your connection and try the export again." })
  }

  const showAction = () => {
    setLastEvent("Action toast shown")
    toast("Preset archived", {
      description: "Calm SaaS was removed from comparisons.",
      action: { label: "Undo", onClick: () => setLastEvent("Archive undone") },
    })
  }

  const dismissAll = () => {
    toast.dismiss()
    setLastEvent("All toasts dismissed")
  }

  return <div className="builder-toast-demo">
    <div className="builder-action-grid">
      <button type="button" className="builder-control-button" onClick={showSuccess}><CheckCircle2 aria-hidden="true" size={16} />Success</button>
      <button type="button" className="builder-control-button" onClick={showError}><TriangleAlert aria-hidden="true" size={16} />Error</button>
      <button type="button" className="builder-control-button" onClick={showAction}><RotateCcw aria-hidden="true" size={16} />With action</button>
      <button type="button" className="builder-control-button builder-control-button--quiet" onClick={dismissAll}><X aria-hidden="true" size={16} />Dismiss</button>
    </div>
    <p className="builder-status-line" aria-live="polite">{lastEvent}</p>
  </div>
}
