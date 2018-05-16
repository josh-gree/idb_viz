import React, {Component} from 'react';
import {HomesOverlay} from './js/layers/homes-layer.js';
import {FlowBaseOverlay} from './js/layers/flow-base-layer.js';
import {FlowOverlay} from './js/layers/flows-layer.js';
import {RoadUseOverlay} from './js/layers/road-use-layer.js';
import {getScale} from './js/utils/scales.js';


import DeckGL, {GeoJsonLayer, ArcLayer} from 'deck.gl';


const LIGHT_SETTINGS = {
  lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
  ambientRatio: 0.9,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.8, 0.8, 0.8],
  numberOfLights: 2
};

export default class DeckGLOverlay extends Component {

  static get defaultViewport() {
    return {
      longitude: -72.30,
      latitude: 18.55,
      zoom: 7,
      maxZoom: 15,
      pitch: 30,
      bearing: 30
    };
  }

  _initialize(gl) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }


  render() {
    const {viewport, strokeWidth, data, hoveredFeature, selectedFeature, arcson, active_direction, extrudeon, ts, dow,
           active_data, interpolator} = this.props;
    if(!data) {
      return null;
    }

    const defaults = {interpolator: interpolator, data: data, onHover: this.props.onHover, lightSettings: LIGHT_SETTINGS, autoHighlight: true,
     pickable: Boolean(this.props.onHover || this.props.onClick), getLineColor: () => [255, 255, 255, 255], filled: true,
      lineWidthMinPixels: 1,}
    const scale = getScale(data.map(f => f.properties.total), interpolator);
    const layers = [
      active_data == "roads" && 
          new RoadUseOverlay(Object.assign({}, defaults, {
      lineWidthMinPixels: 5,
      strokeWidth: 5,
      filled: false,
      stroked: true,
      lineJointRounded: true,
      fp64: true,
      hour: ts,
      dow: dow,
      visible: active_data == "roads",
      onClick: this.props.onClick,
      updateTriggers: {visible: {active_data}, getLineColor: {ts, dow}}
    })),
      active_data == "rog" &&
          new HomesOverlay(Object.assign({}, defaults, {extruded: extrudeon, stroked: true, visible: active_data == "rog", data_property: "rog"})),
      active_data == "homes" && 
          new HomesOverlay(Object.assign({}, defaults, {extruded: extrudeon, stroked: true, visible: active_data == "homes", data_property: "total", data_minimum: 15}, defaults)),
      active_data != "rog" && active_data != "homes" && active_data != "roads" && 
          new FlowBaseOverlay(Object.assign({}, defaults, {selectedFeature: selectedFeature, hoveredFeature: hoveredFeature, arcson: arcson, active_direction: active_direction,
       visible: active_data != "rog" && active_data != "homes" && active_data != "roads", onClick: this.props.onClick,
       updateTriggers: {getFillColor: {hoveredFeature, selectedFeature, active_direction}},})),
      active_data != "rog" && active_data != "homes" && active_data != "roads" && arcson && 
          new FlowOverlay(Object.assign({}, defaults, {flow_data: data, selectedFeature: selectedFeature, hoveredFeature: hoveredFeature, arcson: arcson, active_direction: active_direction,
       visible: active_data != "rog" && active_data != "homes" && active_data != "roads" && arcson, onClick: this.props.onClick,
       updateTriggers: {getFillColor: {hoveredFeature, selectedFeature, active_direction}}, strokeWidth}))
      ];

    return (
      <DeckGL {...viewport} layers={ layers } onWebGLInitialized={this._initialize} />
    );
  }
}
