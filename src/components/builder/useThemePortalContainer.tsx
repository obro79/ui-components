import { useCallback, useState } from "react"

export function useThemePortalContainer() {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | undefined>()
  const rootRef = useCallback((node: HTMLDivElement | null) => {
    if (node) setPortalContainer(node.closest<HTMLElement>(".app.theme-scope") ?? undefined)
  }, [])

  return { rootRef, portalContainer }
}
