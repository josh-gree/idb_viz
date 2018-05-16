import {getScale, getHeightScale} from '../utils/scales.js';
import {GeoJsonLayer} from 'deck.gl';
import {interpolateBlues} from 'd3-scale-chromatic';


function _getDataRange(data, prop, min) {
    return data.map(function(d) {
      if(d.properties.hasOwnProperty(prop)) {
        return d.properties[prop]; // Scale wrt total pops
      }
    }).filter(x => x >= min);
  }

export class HomesOverlay extends GeoJsonLayer {
  constructor(props) {
    props.getFillColor = this.fillColor.bind(this);
    props.getElevation = this.elevation.bind(this);
    super(props)
  }

  initializeState() {
    super.initializeState()
    this.state.scale = f => [255, 255, 255, 100];
    this.state.elevation_scale = f => 0;
  }

  fillColor(f) {
    if(!f || !f.properties.hasOwnProperty(this.props.data_property) || (f.properties[this.props.data_property] == null)) {
      return [0, 0, 0, 0];
    }
    return this.state.scale(f.properties[this.props.data_property])
  }

  elevation(f) {
    var val = 0;
    if (f.properties[this.props.data_property]) {
      val = f.properties[this.props.data_property]
    }
    return val > this.props.data_minimum ? this.state.elevation_scale(val) : 0;
  }

  updateState({props, oldProps, context, oldContext, changeFlags}) {
    super.updateState({props, oldProps, context, oldContext, changeFlags});
    if(changeFlags.dataChanged || changeFlags.updateTriggersChanged) {
      const dataRange = _getDataRange(props.data, this.props.data_property, this.props.data_minimum);
      this.state.scale = getScale(dataRange, props.interpolator);
      this.state.elevation_scale = getHeightScale(dataRange, 100000);
    }
  }

  

  
}

HomesOverlay.layerName = 'HomesOverlay';
HomesOverlay.defaultProps = {data_minimum: 0};