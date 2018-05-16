import {getScale, getHeightScale} from '../utils/scales.js';
import {GeoJsonLayer} from 'deck.gl';
import {interpolateBlues} from 'd3-scale-chromatic';


function _getDataRange(data, hour, dow) {
    return [].concat(...data.map(function(d) {
      //if(d.properties.dat.hasOwnProperty(hour)) {
      //  return d.properties.dat[hour]; // Scale wrt hour
      //}
      //console.log(d.properties.dat);
      return Object.keys(d.properties.dat).map(k => (d.properties.dat[dow] || {})[k]);
    }));
  }

export class RoadUseOverlay extends GeoJsonLayer {
  constructor(props) {
    props.getLineColor = this.lineColor.bind(this);
    super(props);
  }

  initializeState() {
    super.initializeState()
    this.state.scale = f => [255, 255, 255, 100];
  }

  lineColor(f) {
    const {dow, hour} = this.props;
    if(!f || !f.properties.dat.hasOwnProperty(dow) || !f.properties.dat[dow].hasOwnProperty(hour)) {
      return [255, 255, 255, 100];
    }
    return this.state.scale(f.properties.dat[dow][hour])
  }

  updateState({props, oldProps, context, oldContext, changeFlags}) {
    super.updateState({props, oldProps, context, oldContext, changeFlags});
    if(changeFlags.dataChanged || (changeFlags.updateTriggersChanged && props.dow != oldProps.dow)) {
      this.state.scale = getScale(_getDataRange(props.data, props.hour, props.dow), props.interpolator);
    }
  }

  

  
}

RoadUseOverlay.layerName = 'RoadUseOverlay';