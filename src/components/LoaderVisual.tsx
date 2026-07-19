import type { LoadingStyle } from "../theme"

export const LOADING_STYLE_LABELS: Record<LoadingStyle, string> = {
  spinner: "Spinner",
  dots: "Bouncing dots",
  pulse: "Pulse",
  bars: "Equalizer bars",
  orbit: "Orbit",
  skeleton: "Skeleton",
}

export function LoaderVisual({ style }: { style: LoadingStyle }) {
  if (style === "spinner") return <span className="loader-spinner" />
  if (style === "dots") return <span className="loader-dots"><i /><i /><i /></span>
  if (style === "pulse") return <span className="loader-pulse"><i /></span>
  if (style === "bars") return <span className="loader-bars"><i /><i /><i /><i /></span>
  if (style === "orbit") return <span className="loader-orbit"><i /><b /></span>
  return <span className="loader-skeleton"><i /><b><em /><em /><em /></b></span>
}
