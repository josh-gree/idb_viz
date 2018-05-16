import React, {Component} from 'react';
import {render} from 'react-dom';
import {getCentroid} from '../utils/polygon-centroid.js';
import {HoverBox} from './hoverbox.js';
import {format} from 'd3-format';
import {getadmin} from '../utils/admin-name.js';

export default class FlowsHover extends HoverBox {
  total_flow(county) {
      const {active_direction} = this.props;
      const flow = county.properties[active_direction + "flows"]
      return Object.keys(flow).reduce(function(prev, current, index) {
          if(current == county.properties.name || flow[current] < 16) {
            return prev;
          }
          return prev + (+flow[current]);
        }, 0);
  }

  render() {
    const {hoveredCounty, selectedCounty, active_direction} = this.props;

    if(!hoveredCounty || !hoveredCounty.properties) {
      return null;
    }
    var outflow;
    var flowdir = active_direction == "out" ? "Outflow" : "Inflow";
    var selected = selectedCounty.size > 0 && Array.from(selectedCounty)[0];

    const flow = hoveredCounty.properties[active_direction == "out" ? "inflows" : "outflows"];// Show flows between hovered & selected
    const reserve_flow = hoveredCounty.properties[active_direction + "flows"];// Show flows between hovered & selected
    if(selected && flow && (selected != hoveredCounty) && (flow[selected.properties.name] > 15)) {
        outflow =  format(".1%")(flow[selected.properties.name]/this.total_flow(selected))
        flowdir = active_direction == "in" ? "Outflow" : "Inflow";
    } else if(reserve_flow) { //Showing total flows for this region.
        outflow = format(",.2r")(this.total_flow(hoveredCounty));
    } else {
      return null; // Don't show a box at all
    }
    return (
    <HoverBox
      popupCoords={getCentroid(hoveredCounty)}
      content={getadmin(hoveredCounty) + " - " + flowdir + ": " + outflow}>
     </HoverBox>
    );
  }
}