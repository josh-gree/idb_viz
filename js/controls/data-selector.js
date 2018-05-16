import React, {Component} from 'react';

export default class DataSelect extends React.Component {
  render() {
    return (
    <div>
      <select value={this.props.value} onChange={this.props.handleChange}>
            <option value="longterm_flows">Flows</option>
            <option value="trips">Trips</option>
            <option value="homes">Homes</option>
            <option value="rog">Radius of Gyration</option>
            <option value="tower_activity">Network Activity</option>
            <option value="hartigan">Commuters</option>
            <option value="roads">Roads</option>
     </select>
     </div>
    );
  }
}