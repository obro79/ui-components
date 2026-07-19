import { useState, type ReactNode } from "react"
import { Check, Copy } from "lucide-react"
import { COMPONENT_REGISTRY, type ComponentDefinition } from "../component-registry"
import "../builder-essentials.css"
import { BuilderToastProvider } from "./builder"

type EssentialCardProps = {
  number: string
  definition: ComponentDefinition
  children: ReactNode
  wide?: boolean
}

function EssentialCard({ number, definition, children, wide = false }: EssentialCardProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle")
  const copyExample = async () => {
    try {
      await navigator.clipboard.writeText(definition.exampleSource)
      setCopyState("copied")
    } catch {
      setCopyState("error")
    }
    window.setTimeout(() => setCopyState("idle"), 1600)
  }
  return <article className="builder-essential-card" data-wide={wide || undefined}>
    <header className="builder-essential-card__header">
      <span aria-hidden="true">{number}</span>
      <div><h3>{definition.title}</h3><p>{definition.description}</p></div>
      <button type="button" className="builder-copy-example" onClick={copyExample} aria-label={`Copy ${definition.title} example`}>
        {copyState === "copied" ? <Check aria-hidden="true" size={14} /> : <Copy aria-hidden="true" size={14} />}
        {copyState === "copied" ? "Copied" : copyState === "error" ? "Retry" : "Copy example"}
      </button>
    </header>
    <div className="builder-essential-card__stage">{children}</div>
  </article>
}

export type BuilderEssentialsGalleryProps = {
  id?: string
  title?: string
  description?: string
}

export function BuilderEssentialsGallery({
  id = "builder-essentials",
  title = "Builder essentials",
  description = "High-frequency product patterns with complete keyboard, focus, empty, and feedback states.",
}: BuilderEssentialsGalleryProps) {
  const headingId = `${id}-heading`
  return <BuilderToastProvider>
    <section id={id} className="builder-essentials" aria-labelledby={headingId}>
      <div className="builder-essentials__intro">
        <p className="eyebrow">Application patterns</p>
        <h2 id={headingId}>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="builder-essentials__grid">
        {COMPONENT_REGISTRY.map((definition, index) => {
          const Preview = definition.preview
          return <EssentialCard key={definition.id} number={String(index + 1).padStart(2, "0")} definition={definition} wide={definition.id === "data-table-tools"}><Preview /></EssentialCard>
        })}
      </div>
    </section>
  </BuilderToastProvider>
}
