export const MOTION_PRESETS = ["none", "fade", "rise", "drop", "float", "spring"] as const
export type MotionPreset = (typeof MOTION_PRESETS)[number]

export const MOTION_SPEEDS = ["fast", "normal", "slow"] as const
export type MotionSpeed = (typeof MOTION_SPEEDS)[number]

export type MotionOverlayBehavior = "none" | "fade" | "fade-rise" | "fade-drop" | "fade-float" | "fade-scale"

export type MotionRecipe = {
  /** Baseline duration before the selected speed multiplier is applied. */
  durationMs: number
  easing: string
  /** Signed starting offset. Positive values enter upward; negative values drop into place. */
  distancePx: number
  scaleFrom: number
  overlayBehavior: MotionOverlayBehavior
}

/**
 * The single source of truth for UI motion. Components consume the resolved CSS
 * variables rather than defining their own timing curves and travel distances.
 */
export const MOTION_RECIPES = {
  none: { durationMs: 0, easing: "linear", distancePx: 0, scaleFrom: 1, overlayBehavior: "none" },
  fade: { durationMs: 180, easing: "cubic-bezier(0.2, 0, 0, 1)", distancePx: 0, scaleFrom: 1, overlayBehavior: "fade" },
  rise: { durationMs: 220, easing: "cubic-bezier(0.16, 1, 0.3, 1)", distancePx: 8, scaleFrom: 1, overlayBehavior: "fade-rise" },
  drop: { durationMs: 220, easing: "cubic-bezier(0.16, 1, 0.3, 1)", distancePx: -8, scaleFrom: 1, overlayBehavior: "fade-drop" },
  float: { durationMs: 320, easing: "cubic-bezier(0.22, 1, 0.36, 1)", distancePx: 6, scaleFrom: 0.985, overlayBehavior: "fade-float" },
  spring: { durationMs: 420, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", distancePx: 10, scaleFrom: 0.92, overlayBehavior: "fade-scale" },
} as const satisfies Record<MotionPreset, MotionRecipe>

const SPEED_MULTIPLIERS: Record<MotionSpeed, number> = {
  fast: 0.7,
  normal: 1,
  slow: 1.45,
}

export type ResolvedMotionRecipe = MotionRecipe & {
  preset: MotionPreset
  speed: MotionSpeed
}

export function isMotionPreset(value: unknown): value is MotionPreset {
  return typeof value === "string" && (MOTION_PRESETS as readonly string[]).includes(value)
}

export function isMotionSpeed(value: unknown): value is MotionSpeed {
  return typeof value === "string" && (MOTION_SPEEDS as readonly string[]).includes(value)
}

export function resolveMotionRecipe(preset: MotionPreset, speed: MotionSpeed): ResolvedMotionRecipe {
  const recipe = MOTION_RECIPES[preset]
  return {
    ...recipe,
    durationMs: Math.round(recipe.durationMs * SPEED_MULTIPLIERS[speed]),
    preset,
    speed,
  }
}
