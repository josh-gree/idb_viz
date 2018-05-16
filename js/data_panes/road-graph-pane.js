import React from 'react';
import {timeFormat} from 'd3-time-format';
import {timeHour} from 'd3-time';
import {format} from 'd3-format';
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  Crosshair
} from 'react-vis';

//TODO: Probably want to show crosshair for mouse hover on the graph + allow jumping in time from graph as well as map
//TODO: Graph all roads when none selected
//TODO: Allow graphing multiple roads

export default class RoadGraph extends React.Component {
  tickFormatter(v) {
    const {dow} = this.props;
    if(dow == -1) {
      return timeFormat("%H:%M")(new Date(0, 0, 0, v, 0, 0));
    } else {
      return timeFormat("%a %H:%M")(timeHour.offset(new Date(0, 0, 0, 0, 0, 0), v));
    }
  }

  render() {
    const {data, hour, dow} = this.props;
    const selected = data.size > 0 && Array.from(data)[0];
    if(!selected) {
      return null;
    }
    const {dat} = selected.properties;
    if(!dat) {
      return null;
    }
    const lineData = dow == -1 ? Array(24).fill().map((_, i) => ({x: i, y: (dat[-1] || {})[i] || 0})) : Array(24*7).fill().map((_, i) => ({x: i, y: (dat[Math.floor(i/24)] || {})[i % 24] || 0}));

    return (
      <div id="datatable">
      <FlexibleXYPlot>
        <HorizontalGridLines />
        <VerticalGridLines />
        <XAxis title="Time" tickFormat={this.tickFormatter.bind(this)}/>
        <YAxis title="Traffic weight" />
        <LineSeries
          className="first-series"
          data={lineData}
        />
        <Crosshair values={[lineData[hour+Math.max(dow*24, 0)]]}>
          <div style={{background: 'black', borderRadius: "2px"}}>
            <p>{format(",.4r")(lineData[hour+Math.max(dow*24, 0)].y)}</p>
          </div>
        </Crosshair>
      </FlexibleXYPlot>
      </div>
    );
  }
}