import React, {Component} from 'react';
import {timeFormat} from 'd3-time-format';
import Slider, {createSliderWithTooltip} from 'rc-slider';

const SliderWithTooltip = createSliderWithTooltip(Slider);

export default class DowSelect extends React.Component {

  formatter(ts) {
     const formatter = timeFormat("%a");
     return ts > -1 ? formatter(new Date(0, 0, ts, 0, 0, 0)) : 'All'
  }

  render() {
    const {ts, setDowCallBack} = this.props;
    const tipFormatter = val => this.formatter(val);
    return (
    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
            <div style={{width: "60%", display: "flex", flexDirection: "column"}}>
            <SliderWithTooltip
                onChange={setDowCallBack}
                onAfterChange={setDowCallBack}
                defaultValue={ts}
                max={6}
                min={-1}
                tipFormatter={tipFormatter}
            />
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
            {this.formatter(ts)}
            </div>
    </div>
    );
  }
}