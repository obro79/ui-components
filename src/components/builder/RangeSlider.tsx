import { Slider } from "@base-ui/react/slider"
import { useState } from "react"

export type RangeSliderProps = {
  singleLabel?: string
  rangeLabel?: string
  singleDefaultValue?: number
  rangeDefaultValue?: readonly [number, number]
  onSingleValueChange?: (value: number) => void
  onRangeValueChange?: (value: readonly number[]) => void
}

export function RangeSlider({
  singleLabel = "Volume",
  rangeLabel = "Budget range",
  singleDefaultValue = 62,
  rangeDefaultValue = [24, 76],
  onSingleValueChange,
  onRangeValueChange,
}: RangeSliderProps) {
  const [singleValue, setSingleValue] = useState(singleDefaultValue)
  const [rangeValue, setRangeValue] = useState<readonly number[]>(rangeDefaultValue)

  const updateSingle = (next: number) => {
    setSingleValue(next)
    onSingleValueChange?.(next)
  }

  const updateRange = (next: readonly number[]) => {
    setRangeValue(next)
    onRangeValueChange?.(next)
  }

  return <div className="builder-slider-demo">
    <div className="builder-slider-block">
      <div className="builder-slider-label"><span>{singleLabel}</span><output aria-live="polite">{singleValue}%</output></div>
      <Slider.Root value={singleValue} onValueChange={updateSingle} min={0} max={100} step={1} largeStep={10}>
        <Slider.Control className="builder-slider-control">
          <Slider.Track className="builder-slider-track"><Slider.Indicator className="builder-slider-indicator" /><Slider.Thumb className="builder-slider-thumb" getAriaLabel={() => singleLabel} getAriaValueText={(_, value) => `${value} percent`} /></Slider.Track>
        </Slider.Control>
      </Slider.Root>
      <div className="builder-slider-scale" aria-hidden="true"><span>0</span><span>50</span><span>100</span></div>
    </div>

    <div className="builder-slider-block">
      <div className="builder-slider-label"><span>{rangeLabel}</span><output aria-live="polite">${rangeValue[0]}k – ${rangeValue[1]}k</output></div>
      <Slider.Root value={rangeValue} onValueChange={updateRange} min={0} max={100} step={1} largeStep={10} minStepsBetweenValues={5} thumbCollisionBehavior="none">
        <Slider.Control className="builder-slider-control">
          <Slider.Track className="builder-slider-track">
            <Slider.Indicator className="builder-slider-indicator" />
            <Slider.Thumb index={0} className="builder-slider-thumb" getAriaLabel={() => "Minimum budget"} getAriaValueText={(_, value) => `${value} thousand dollars minimum`} />
            <Slider.Thumb index={1} className="builder-slider-thumb" getAriaLabel={() => "Maximum budget"} getAriaValueText={(_, value) => `${value} thousand dollars maximum`} />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
      <p className="builder-helper-text">Use arrow keys for 1k steps; Page Up and Page Down move by 10k.</p>
    </div>
  </div>
}
