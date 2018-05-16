import React, {Component} from 'react';
import {scaleQuantile, scaleSequential, scaleLinear} from 'd3-scale';
import {linspace} from '../utils/scales.js';
import {format} from 'd3-format';

export default class ColorBar extends React.Component {



  barScale() {
    const colorScale = scaleSequential(this.props.interpolator).domain([0,1]);
    const {stops} = this.props;
    return linspace(0, 1, stops).map(x => [format(".0%")(x), colorScale(x)]);
  }

  render() {
    const scale = this.barScale().map((stop, ix) => <stop offset={stop[0]}  stopColor={stop[1]} key={ix}/>);
    return (
    <div id="legend">
    <svg width="30" height="150" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="MyGradient" x1="0" x2="0" y1="1" y2="0">
            {scale}
        </linearGradient>
    </defs>

    <rect fill="url(#MyGradient)"
          x="0" y="0" width="30" height="150" />
    </svg>
    </div>
    );
  }
}