import React, {Component} from 'react';
import ArcControl from './arc-control.js';
import ExtrudeControl from './extrude-control.js';
import TimeSelect from './time-control.js';
import DowSelect from './dow-control.js';
import SourceSelect from './src-selector.js';
import DataSelect from './data-selector.js';
import DateSelect from './date-selector.js';
import DirectionSelect from './direction-selector.js';
import RegionSelect from './region-selector.js';


export default class MapControls extends React.Component {

  hasLevels() {
    const {active_data} = this.props;
    return ["tower_activity", "hartigan", "roads"].indexOf(active_data) == -1;
  }

  hasArcs() {
    const {active_data} = this.props;
    return ["longterm_flows", "trips", "hartigan"].indexOf(active_data) != -1;
  }

  hasRegions() {
    const {active_data} = this.props;
    return active_data == "hartigan";
  }

  hasDates() {
    const {active_data} = this.props;
    return ["longterm_flows", "tower_activity"].indexOf(active_data) == -1;
  }

  hasTimes() {
    const {active_data} = this.props;
    return active_data == "roads";
  }

  render() {
    const {sourceFn, active_source, active_layer, layerFn,
     dataFn, active_data, dateFn,
     active_date, directionFn, active_direction,
     extrude_on, extrudeFn, regionFn, active_region, ts, setTimeCallBack,
     dow, setDowCallBack} = this.props;
    return (
    <div id="mapControls">
        <DataSelect
        handleChange={dataFn}
        value={active_data}
         />
        {this.hasLevels() &&
            <SourceSelect
            handleChange={sourceFn}
            value={active_source}
             />
            }
         {this.hasRegions() &&
            <RegionSelect
            handleChange={regionFn}
            value={active_region}
             />
            }
         {this.hasArcs() && 
                  <ArcControl
                 handleChange={layerFn}
                 arcson={active_layer}
                 />
               }
         {!this.hasArcs() && !this.hasTimes() && 
                  <ExtrudeControl
                 handleChange={extrudeFn}
                 extrude_on={extrude_on}
                 />
               }
         {this.hasDates() && 
            <DateSelect
                 handleChange={dateFn}
                 active_date={active_date}
                 />
         }
         {this.hasArcs() && 
            <DirectionSelect
                 handleChange={directionFn}
                 active_direction={active_direction}
                 />
         }
         {this.hasTimes() &&
            <TimeSelect
                ts={ts}
                setTimeCallBack={setTimeCallBack}
            />
         }
         {this.hasTimes() &&
            <DowSelect
                ts={dow}
                setDowCallBack={setDowCallBack}
            />
         }
    </div>
    );
  }
}