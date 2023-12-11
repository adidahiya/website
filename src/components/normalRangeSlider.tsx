import { Slider, type SliderProps } from "@blueprintjs/core";
import * as React from "react";

export default function NormalRangeSlider<P extends SliderProps>(props: P) {
    return <Slider labelStepSize={0.2} max={0.95} min={0.05} stepSize={0.05} {...props} />;
}
