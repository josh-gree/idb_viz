import React, {Component} from 'react';
import {render} from 'react-dom';
import {getCentroid} from '../utils/polygon-centroid.js';
import {HoverBox} from './hoverbox.js';
import {format} from 'd3-format';
import {getadmin} from '../utils/admin-name.js';
import {timeFormat} from 'd3-time-format';

export default class RoadHover extends React.Component {
  render() {
    // render hoverbox on scaler viz ie homelocs or rog
    const {hoveredCounty, selectedCounty, hour, dow} = this.props;
    const dt = new Date(0, 0, 0, hour, 0, 0);
    const formatter = timeFormat("%H:%M");
    if(!hoveredCounty || !hoveredCounty.properties || !hoveredCounty.properties.dat ||
     !hoveredCounty.properties.dat[dow] || !hoveredCounty.properties.dat[dow][hour]) {
      return null;
    } 
    
    const homes = hoveredCounty.properties.dat[dow][hour];
    return (
    <HoverBox
      popupCoords={getCentroid(hoveredCounty)}
        content={"Average occupance at " + formatter(dt) + " -  " + format(",.2r")(homes)}>
     </HoverBox>
    );
  }
}