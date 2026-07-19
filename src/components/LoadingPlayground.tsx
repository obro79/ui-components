import { useState } from "react"
import { Pause, Play } from "lucide-react"
import { LOADING_STYLE_LABELS, LoaderVisual } from "./LoaderVisual"
import type { LoadingStyle } from "../theme"
import "../loading-playground.css"

const loaders = Object.entries(LOADING_STYLE_LABELS) as Array<[LoadingStyle, string]>

export function LoadingPlayground({ selected = "spinner" }: { selected?: LoadingStyle }) {
  const [playing, setPlaying] = useState(true)

  return (
    <section className="loading-playground" data-playing={playing} aria-labelledby="loading-playground-title">
      <header className="loading-playground__header">
        <div>
          <h3 id="loading-playground-title">Loading animation playground</h3>
          <p>Six token-aware patterns for indeterminate and placeholder states.</p>
        </div>
        <button
          className="loading-playground__toggle"
          type="button"
          aria-pressed={playing}
          aria-label={`Loading motion ${playing ? "on" : "off"}`}
          onClick={() => setPlaying((current) => !current)}
        >
          {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
          {playing ? "Pause motion" : "Play motion"}
        </button>
      </header>

      <p className="sr-only" role="status" aria-live="polite">
        Loading animations {playing ? "playing" : "paused"}.
      </p>

      <div className="loading-playground__grid" role="list" aria-label="Loading animation examples">
        {loaders.map(([id, label]) => (
          <article className="loading-playground__item" data-selected={id === selected || undefined} role="listitem" key={id}>
            <div className="loading-playground__stage" role="img" aria-label={`${label} loading indicator`}>
              <LoaderVisual style={id} />
            </div>
            <div className="loading-playground__label">
              <strong>{label}</strong>
              <span>{id === selected ? "Active theme loader" : id === "skeleton" ? "Content placeholder" : "Loading indicator"}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
