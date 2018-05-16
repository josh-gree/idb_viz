import React, {Component} from 'react';
import {render} from 'react-dom';
import {getCentroid} from '../utils/polygon-centroid.js';
import {HoverBox} from './hoverbox.js';
import {format} from 'd3-format';
import {getadmin} from '../utils/admin-name.js';

export default class HomesHover extends React.Component {
  render() {
    // render hoverbox on scaler viz ie homelocs or rog
    const {hoveredCounty, selectedCounty, data_prop, data_minimum} = this.props;
    if(!hoveredCounty || !hoveredCounty.properties || !hoveredCounty.properties[data_prop]) {
      return null;
    } 
    
    const homes = hoveredCounty.properties[data_prop];
    return (
    <HoverBox
    	popupCoords={getCentroid(hoveredCounty)}
        content={getadmin(hoveredCounty) + " - " + format(",.2r")(homes)}>
     </HoverBox>
    );
  }
}

HomesHover.defaultProps = {data_minimum: 0};