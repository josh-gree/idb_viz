import React, {Component} from 'react';
import {render} from 'react-dom';
import {Popup} from 'react-map-gl';

export class HoverBox extends React.Component {
  render() {
    const {popupCoords, content} = this.props;
    if(!popupCoords) {
      return null;
    } 
 
    return (
    <Popup tipSize={5}
        anchor="bottom-right"
        longitude={popupCoords[0]}
        latitude={popupCoords[1]}
        captureClick={false}
        captureDrag={false}
        captureDoubleClick={false}
        closeOnClick={false}
        closeButton={false}
        >
        {content}
     </Popup>
    );
  }
}