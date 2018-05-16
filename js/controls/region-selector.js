import React, {Component} from 'react';

export default class RegionSelect extends React.Component {
  render() {
    return (
    <div>
      <select value={this.props.value} onChange={this.props.handleChange}>
            <option value="Cap">Cap Haïtien</option>
            <option value="Port-Au-Prince">Port-Au-Prince</option>
            <option value="PIC">PIC</option>
     </select>
     </div>
    );
  }
}