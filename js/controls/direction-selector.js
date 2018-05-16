import React, {Component} from 'react';

export default class DirectionSelect extends Component {
  render() {
    const {active_direction} = this.props;
    return (
        <div>
        <label htmlFor="in">In</label>
        <input id="in" type="radio" name="direction" value="in" onChange={this.props.handleChange} checked={active_direction == "in"} />
        <br />
        <label htmlFor="">Out</label>
        <input id="out" type="radio" name="direction" value="out" onChange={this.props.handleChange} checked={active_direction == "out"} />
     </div>
    );
  }
}