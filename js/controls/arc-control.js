import React, {Component} from 'react';

export default class ArcControl extends React.Component {
  render() {
    return (
        <div>
        <label htmlFor="arcs">Arcs</label>
        <input id="arcs" type="checkbox" checked={this.props.arcson} onChange={this.props.handleChange} />
     </div>
    );
  }
}