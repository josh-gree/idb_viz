import React, {Component} from 'react';

export default class PlayButton extends React.Component {
  render() {
    return (
    <div>
      <span onClick={e => this.props.onClick()}>{this.props.text}</span>
    </div>
    );
  }
}