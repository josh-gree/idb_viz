import React, {Component} from 'react';

export default class SourceSelect extends React.Component {
  render() {
    return (
    <div>
      <select value={this.props.value} onChange={this.props.handleChange}>
            <option value="admin2">Admin2</option>
            <option value="admin3">Admin3</option>
            <option value="grid">Grid</option>
     </select>
     </div>
    );
  }
}