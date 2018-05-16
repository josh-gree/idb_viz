import {getScale} from '../utils/scales.js';
import {ArcLayer} from 'deck.gl';
import {flowDataRange} from './flow-base-layer.js';
import {getCentroid} from '../utils/polygon-centroid.js';

//TODO: Make this work more like road-use-layer, which makes use of the appropriate update method

function _getArcs({flow_data, selectedFeature, hoveredFeature, active_direction, interpolator}) {
    if (!flow_data || !(selectedFeature || hoveredFeature)) {
      return null;
    }
    const activeFeature = selectedFeature || hoveredFeature;
    const {outflows, inflows} = activeFeature.properties;
    if(outflows == undefined || inflows == undefined) {
      return [];
    }
    const {centroid} = activeFeature;
    var obj = active_direction == "out" ? outflows : inflows
    if(obj){
        const arcs = Object.keys(obj).map(name => {
          const f = flow_data.filter(function(x) {return x.properties.name == name});
          if(!f.length) {
            return [];
          }

          return {
            sourcePosition: getCentroid(activeFeature),
            targetPosition: f.length ? getCentroid(f[0]) : false,
            val: obj[name] > 15 && obj[name]// - (name in inflows ? inflows[name] : 0) //Uncomment for net
          };
        });

        return arcs.filter(x => (x.val) && (x.targetPosition));
    }
    return [];
  }

export class FlowOverlay extends ArcLayer {
  constructor(props) {
    props.data =  _getArcs(props);
    props.getSourceColor = d => this.state.scale(d.val)
    props.getTargetColor = d => this.state.scale(d.val)
    props.pickable = false;
    props.onHover = null;
    super(props)
  }

  initializeState() {
    super.initializeState()
    this.state.scale = f => [255, 255, 255, 0];
  }

  updateState({props, oldProps, context, oldContext, changeFlags}) {
    super.updateState({props, oldProps, context, oldContext, changeFlags});
    if(changeFlags.dataChanged || changeFlags.updateTriggersChanged) {
      const {flow_data, selectedFeature, hoveredFeature, active_direction, interpolator} = props;
      this.state.scale = getScale(flowDataRange({data: flow_data, selectedFeature: selectedFeature, hoveredFeature: hoveredFeature,
         active_direction: active_direction}), props.interpolator);
    }
  }
}

FlowOverlay.layerName = 'FlowOverlay';