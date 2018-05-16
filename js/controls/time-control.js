import React, {Component} from 'react';
import {timeFormat} from 'd3-time-format';
import Slider, {createSliderWithTooltip} from 'rc-slider';

const SliderWithTooltip = createSliderWithTooltip(Slider);

export default class TimeSelect extends React.Component {
  render() {
    const {ts, setTimeCallBack} = this.props;
    const dt = new Date(0, 0, 0, ts, 0, 0);
    const formatter = timeFormat("%H:%M");
    const tipFormatter = val => formatter(new Date(0, 0, 0, val, 0, 0));
    return (
    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
            <div style={{width: "60%", display: "flex", flexDirection: "column"}}>
            <SliderWithTooltip
                onChange={setTimeCallBack}
                onAfterChange={setTimeCallBack}
                defaultValue={ts}
                max={23}
                tipFormatter={tipFormatter}
            />
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
            {formatter(dt)}
            </div>
    </div>
    );
  }
}