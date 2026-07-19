import { useEffect, useState } from "react"
import { CircleCheck, Play, RotateCw } from "lucide-react"
import { LOADING_STYLE_LABELS, LoaderVisual } from "./LoaderVisual"
import { MOTION_PRESETS, MOTION_SPEEDS, type MotionPreset } from "../motion"
import type { LoadingStyle, ThemeConfig } from "../theme"
import "../motion-playground.css"

const MOTION_LABELS: Record<MotionPreset, { label: string; copy: string }> = {
  none: { label: "None", copy: "Instant state changes" },
  fade: { label: "Fade", copy: "Quiet opacity shift" },
  rise: { label: "Rise", copy: "Content enters upward" },
  drop: { label: "Drop", copy: "Content settles downward" },
  float: { label: "Float", copy: "Slow spatial drift" },
  spring: { label: "Spring", copy: "Tactile overshoot" },
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  return reduced
}

export function MotionPlayground({ config, onChange }: { config: ThemeConfig; onChange: (patch: Partial<ThemeConfig>) => void }) {
  const [replay, setReplay] = useState(0)
  const reducedMotion = useReducedMotion()

  return (
    <div className="motion-playground">
      <section className="motion-control-section" aria-labelledby="motion-style-title">
        <div className="motion-section-heading">
          <div>
            <h3 id="motion-style-title">Interface motion</h3>
            <p>Choose one motion language for previews and product overlays.</p>
          </div>
          <button className="motion-replay" type="button" onClick={() => setReplay((value) => value + 1)}>
            <RotateCw size={15} aria-hidden="true" /> Replay
          </button>
        </div>
        <div className="motion-option-grid" role="radiogroup" aria-label="Interface motion preset">
          {MOTION_PRESETS.map((motionPreset) => (
            <button
              type="button"
              role="radio"
              aria-checked={config.motionPreset === motionPreset}
              data-selected={config.motionPreset === motionPreset || undefined}
              data-preview-motion={motionPreset}
              onClick={() => { onChange({ motionPreset }); setReplay((value) => value + 1) }}
              key={`${motionPreset}-${replay}`}
            >
              <span className="motion-option-stage"><i /></span>
              <span><strong>{MOTION_LABELS[motionPreset].label}</strong><small>{MOTION_LABELS[motionPreset].copy}</small></span>
            </button>
          ))}
        </div>
      </section>

      <section className="motion-control-section" aria-labelledby="motion-speed-title">
        <h3 id="motion-speed-title">Speed</h3>
        <div className="segmented-control" role="group" aria-label="Motion speed">
          {MOTION_SPEEDS.map((speed) => (
            <button type="button" className={config.motionSpeed === speed ? "active" : ""} aria-pressed={config.motionSpeed === speed} onClick={() => onChange({ motionSpeed: speed })} key={speed}>
              {speed[0].toUpperCase() + speed.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section className="motion-control-section" aria-labelledby="loading-style-title">
        <div className="motion-section-heading">
          <div><h3 id="loading-style-title">Loading animation</h3><p>The selected state is used throughout the gallery and export.</p></div>
        </div>
        <div className="loading-choice-grid" role="radiogroup" aria-label="Loading animation">
          {(Object.entries(LOADING_STYLE_LABELS) as Array<[LoadingStyle, string]>).map(([style, label]) => (
            <button type="button" role="radio" aria-checked={config.loadingStyle === style} data-selected={config.loadingStyle === style || undefined} onClick={() => onChange({ loadingStyle: style })} key={style}>
              <span className="loading-choice-stage"><LoaderVisual style={style} /></span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="motion-control-section" aria-labelledby="overlay-preview-title">
        <div className="motion-section-heading">
          <div><h3 id="overlay-preview-title">Live overlay behavior</h3><p>Dialogs, popovers, sheets, menus, and toasts inherit the same timing.</p></div>
          <button className="motion-replay" type="button" onClick={() => setReplay((value) => value + 1)}><Play size={15} aria-hidden="true" /> Preview</button>
        </div>
        <div className="motion-overlay-stage" key={`overlay-${replay}`} aria-label={`${MOTION_LABELS[config.motionPreset].label} overlay preview`}>
          <div className="motion-overlay-backdrop" />
          <div className="motion-overlay-card"><span className="eyebrow">Preview</span><strong>Overlay motion</strong><small>{MOTION_LABELS[config.motionPreset].copy}</small></div>
          <div className="motion-overlay-toast"><CircleCheck size={15} aria-hidden="true" /> Theme updated</div>
        </div>
        <div className="reduced-motion-status" data-reduced={reducedMotion || undefined} role="status">
          <span aria-hidden="true" />
          {reducedMotion ? "Reduced motion is active — previews render without travel." : "Reduced motion is supported and follows your system setting."}
        </div>
      </section>
    </div>
  )
}
