import React, {Component} from 'react';

export default class DateSelect extends Component {
  render() {
    const {active_date} = this.props;
    return (
        <div>
        <label htmlFor="2016">2016</label>
        <input id="2016" type="radio" name="date" value="2016" onChange={this.props.handleChange} checked={active_date == "2016"} />
        <br />
        <label htmlFor="2017">2017</label>
        <input id="2017" type="radio" name="date" value="2017" onChange={this.props.handleChange} checked={active_date == "2017"} />
     </div>
    );
  }
}