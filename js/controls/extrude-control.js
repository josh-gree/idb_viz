import React, {Component} from 'react';

export default class ExtrudeControl extends React.Component {
  render() {
    return (
        <div>
        <label htmlFor="extrude">Extrude</label>
        <input id="extrude" type="checkbox" checked={this.props.extrude_on} onChange={this.props.handleChange} />
     </div>
    );
  }
}