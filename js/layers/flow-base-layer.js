import {getScale, getHeightScale} from '../utils/scales.js';
import {GeoJsonLayer} from 'deck.gl';

//TODO: Make this work more like road-use-layer, which makes use of the appropriate update method

export function flowDataRange({data, selectedFeature, hoveredFeature, active_direction}) {
 
    const activeFeature = selectedFeature || hoveredFeature;
    const out = active_direction == "out";

    return data.map(d => {
      const {inflows, outflows} = d.properties;
      if (!activeFeature && outflows && out) {
        // Scale wrt total outflows
        var tot = Object.keys(outflows).reduce((prev, current) => prev + (+outflows[current]), 0);
        return tot > 0 ? tot : null;
      } else if (activeFeature && inflows && out) {
        // Scale wrt inflows from active feature
        return inflows[activeFeature.properties.name];
      } else if (!activeFeature && inflows && !out) {
        // Scale wrt total outflows
        var tot = Object.keys(inflows).reduce((prev, current) => prev + (+inflows[current]), 0);
        return tot > 0 ? tot : null;
      } else if (activeFeature && outflows && !out) {
        // Scale wrt outflows to active feature
        return outflows[activeFeature.properties.name];
      }
    }).filter(x => x > 15);
  }


//TODO: Simplify this hairball & the other flow funcs
function fillFunc(props) {
  const {hoveredFeature, selectedFeature, active_direction, interpolator} = props;
  const out = active_direction == "out";
  const activeFeature = selectedFeature || hoveredFeature;

  if(activeFeature) { // Something hovered or selected & viewing flows out
    return f => {
      if(!f) { return [0, 0, 0, 0];}

      if(activeFeature.properties.name == f.properties.name) { // This feature is the one hovered or selected
        return [0, 200, 50, 200]; 
      }
      const scale = this.state.scale;
      
      const flows = f.properties[(out && "outflows") || "inflows"];
      if(flows && Object.keys(flows)) { // This feature has inflows, and view is outflows
            if(flows.hasOwnProperty(activeFeature.properties.name)) { // This feature has inflow from the active one
              var flow = flows[activeFeature.properties.name];
              if(flow > 15) { 
                return scale(flow);
              }
            }
      }
      return [0, 0, 20, 200]; // Default colour
    }
  } else { //Nothing hovered or selected, viewing flows out
    return f => {
      if(!f) {return [0, 0, 0, 0];}

      const scale = this.state.scale;
      const flows = f.properties[(out && "outflows") || "inflows"];
      if (flows && Object.keys(flows)) { // View is outflows, this feature has outflows
        return scale(Object.keys(flows).reduce((prev, current) => prev + (+flows[current]), 0));
      }
      return [0, 0, 20, 200]; // Default colour
    }
  }
  }

export class FlowBaseOverlay extends GeoJsonLayer {
  constructor(props) {
    props.getFillColor = fillFunc.bind(this)(props)
    super(props)
  }

  initializeState() {
    super.initializeState()
    this.state.scale = f => [255, 255, 255, 100];
  }

  updateState({props, oldProps, context, oldContext, changeFlags}) {
    super.updateState({props, oldProps, context, oldContext, changeFlags});
    if(changeFlags.dataChanged || changeFlags.updateTriggersChanged) {
      this.state.scale = getScale(flowDataRange(props), props.interpolator);
    }
  }
}

FlowBaseOverlay.layerName = 'FlowBaseOverlay';