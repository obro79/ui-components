import { Command as CommandIcon, FilePlus2, LayoutTemplate, Moon, Search, Settings2 } from "lucide-react"
import { Command } from "cmdk"
import { useEffect, useState, type ReactNode } from "react"
import { useThemePortalContainer } from "./useThemePortalContainer"

export type CommandPaletteItem = {
  id: string
  label: string
  description?: string
  group: string
  keywords?: string[]
  shortcut?: string
  icon?: ReactNode
}

const DEFAULT_COMMANDS: CommandPaletteItem[] = [
  { id: "new-project", label: "Create project", description: "Start from a blank workspace", group: "Actions", shortcut: "N", icon: <FilePlus2 aria-hidden="true" size={17} /> },
  { id: "open-templates", label: "Browse templates", description: "Explore reusable starting points", group: "Actions", shortcut: "T", icon: <LayoutTemplate aria-hidden="true" size={17} /> },
  { id: "search-library", label: "Search component library", description: "Find a pattern or primitive", group: "Navigate", keywords: ["components", "patterns"], shortcut: "L", icon: <Search aria-hidden="true" size={17} /> },
  { id: "appearance", label: "Toggle appearance", description: "Switch the preview theme", group: "Settings", shortcut: "D", icon: <Moon aria-hidden="true" size={17} /> },
  { id: "preferences", label: "Open preferences", description: "Change editor defaults", group: "Settings", shortcut: ",", icon: <Settings2 aria-hidden="true" size={17} /> },
]

export type CommandPaletteProps = {
  items?: CommandPaletteItem[]
  onSelect?: (item: CommandPaletteItem) => void
  triggerLabel?: string
}

export function CommandPalette({ items = DEFAULT_COMMANDS, onSelect, triggerLabel = "Open command palette" }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const [lastAction, setLastAction] = useState("No command selected")
  const { rootRef, portalContainer } = useThemePortalContainer()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const groups = [...new Set(items.map((item) => item.group))]
  const choose = (item: CommandPaletteItem) => {
    setLastAction(item.label)
    onSelect?.(item)
    setOpen(false)
  }

  return <div ref={rootRef} className="builder-command-demo">
    <button type="button" className="builder-control-button builder-command-trigger" aria-keyshortcuts="Meta+K Control+K" onClick={() => setOpen(true)}>
      <CommandIcon aria-hidden="true" size={17} />
      <span>{triggerLabel}</span>
      <kbd>⌘ / Ctrl K</kbd>
    </button>
    <p className="builder-status-line" aria-live="polite">Last action: <strong>{lastAction}</strong></p>

    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global command menu"
      loop
      container={portalContainer}
      overlayClassName="builder-command-overlay"
      contentClassName="builder-command-dialog"
    >
      <div className="builder-command-search">
        <Search aria-hidden="true" size={18} />
        <Command.Input autoFocus placeholder="Search actions, pages, and settings…" aria-label="Search commands" />
        <kbd>Esc</kbd>
      </div>
      <Command.List className="builder-command-list" label="Available commands">
        <Command.Empty className="builder-command-empty">No matching command. Try a different phrase.</Command.Empty>
        {groups.map((group) => <Command.Group key={group} heading={group}>
          {items.filter((item) => item.group === group).map((item) => <Command.Item
            key={item.id}
            value={`${item.label} ${item.description ?? ""}`}
            keywords={item.keywords}
            onSelect={() => choose(item)}
          >
            <span className="builder-command-icon">{item.icon}</span>
            <span className="builder-command-copy"><strong>{item.label}</strong>{item.description && <small>{item.description}</small>}</span>
            {item.shortcut && <span className="builder-command-shortcut">{item.shortcut}</span>}
          </Command.Item>)}
        </Command.Group>)}
      </Command.List>
      <div className="builder-command-footer" aria-hidden="true"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Select</span><span><kbd>Esc</kbd> Close</span></div>
    </Command.Dialog>
  </div>
}
