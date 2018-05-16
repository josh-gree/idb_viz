/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';
import FlowsHover from './js/map_overlays/flows-hoverbox.js';
import HomesHover from './js/map_overlays/home-hover.js';
import RoadHover from './js/map_overlays/road-hoverbox.js';
import MapControls from './js/controls/map-controls.js'
import ColorBar from './js/controls/colorbar.js';
import ODTablePane from './js/data_panes/flow-table-pane.js';
import TablePane from './js/data_panes/table-pane.js';
import RoadGraph from './js/data_panes/road-graph-pane.js';
import {interpolateBlues} from 'd3-scale-chromatic';
import {json as requestJson} from 'd3-request';
import {format} from 'd3-format';

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVtb25peHoiLCJhIjoiY2oxYzl1NGdxMDAwMTJ4cWp1emdwZW9rcCJ9.tjPOTfVMwOz7QKHmbbLE9A'; // eslint-disable-line

class Root extends Component {

  // set initial state
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      data: null,
      selectedCounty: new Set([]),
      hoveredCounty: null,
      arcson: false,
      active_layer: "",
      active_source: "admin2",
      active_data: "longterm_flows",
      active_date: "2016",
      active_direction: "out",
      pick_multi: false,
      extrudeon: false,
      active_region: "PIC",
      ts: 6,
      dow: -1,
      interpolator:interpolateBlues,
      loadedData: './data/longterm_flows_admin2.json'
    };

    requestJson('./data/longterm_flows_admin2.json', (error, response) => {
      // Get the initial data to be displayed on page load. Update compionent
      // state and set selected county to first feature in data
      if (!error) {
        this.setState({
          data: response.features,
          selectedCounty: new Set([response.features[0]])
        });
      }
    });
  }

  componentDidMount() {
    // Do some stuff when window is resized
    window.addEventListener('resize', this._resize.bind(this));
    document.addEventListener("keydown", this._handleKeyDown.bind(this));
    document.addEventListener("keyup", this._handleKeyUp.bind(this));
    this._resize();
  }

  _handleKeyDown(evt) {
    if(evt.key == "Shift") {
      this.setState({pick_multi: true});
    }
  }

  _handleKeyUp(evt) {
    if(evt.key == "Shift") {
      this.setState({pick_multi: false});
    }
  }

  _resize() {
    // called from above
    this._onChangeViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onChangeViewport(viewport) {
    // actually updates component state
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  _setSelect(dat) {
    // update component state to reflect selected county
    // if selected county is currentlly selected 
    // set selected county to null
    const {selectedCounty, pick_multi} = this.state;
    const selected = new Set(selectedCounty);
    if(dat == undefined) {
      return;
    }
    if(selected.has(dat.object)){
      selected.delete(dat.object)
    } else {
      if (pick_multi) {
        selected.add(dat.object);
      } else {
        selected.clear();
        selected.add(dat.object);
      }
    }
    this.setState({selectedCounty: selected});
  }

  _setTime(dat) {
    this.setState({ts: dat});
  }

  _setDow(dat) {
    this.setState({dow: dat});
  }

  _setHover(dat) {
    // set hover info into component state
    this.setState({hoveredCounty: dat.object, hoverX: dat.x, hoverY: dat.y})
  }

  setSource(e) {
    var src = e.target.value;
    this.updateData({active_source: src});
  }

  setRegion(e) {
    var src = e.target.value;
    this.updateData({active_region: src});
  }

  setData(e) {
    var src = e.target.value;
    this.updateData({active_data: src});
  }

  setDate(e) {
    // no idea!!
    var src = e.target.value;
    this.updateData({active_date: src});
  }

  updateData(obj) {
    const new_state = Object.assign({}, this.state, obj);
    const {active_source, active_data, active_region, active_date} = new_state;
    var source_elems =  [active_data];
    
    if(active_data == "hartigan"){
      // Hartigan only available at grid level
      source_elems.push("grid");
      // Hartigan also has focus regions.
      source_elems.push(active_region);
    }  else if (active_data == "roads") {
    }  else {
      source_elems.push(active_source);
    }
    if(["longterm_flows"].indexOf(active_data) == -1) { // Flows are year-year, so no date
      source_elems.push(active_date);
    }
    const json_url = "./data/" + source_elems.join("_") + ".json";
    requestJson(json_url, (error, response) => {
        console.log(json_url);
        if (!error) {
          this.setState(Object.assign(new_state, {
            data: response.features.sort(function(x, y) { // Sort alphabetically.
                if(x.properties.name < y.properties.name) {
                  return -1;
                }
                if(x.properties.name > y.properties.name) {
                  return 1;
                }
                return 0;
              }),
            selectedCounty: this._updateSelection(response.features),
            loadedData: json_url
          }));
        }
    });
  }

  _updateSelection(data) {
    const {selectedCounty, active_data} = this.state;
    var c = (selectedCounty.size > 0) && Array.from(selectedCounty)[0];
    const selected = new Set(selectedCounty);
    if(c){
         selected.clear();
         const filterfn = active_data == "roads" ? x => x.id == c.id : x => x.properties.name == c.properties.name;
         data.filter(filterfn).forEach(x => selected.add(x));
    }
    return selected;
  }

  setLayer(e) {
    // update state to reflect if arcs are displayed
    const {arcson} = this.state;
    this.setState({arcson: !arcson})
  }

  toggleExtrude(e) {
    // update state to reflect if regions are extruded
    const {extrudeon} = this.state;
    this.setState({extrudeon: !extrudeon})
  }

  setDirection(e) {
    // Update state to reflect if in or outflows are viewed
    this.setState({active_direction: e.target.value});
  }

  render_map() {
    // renders basemap and adds overlay using makes use of DeckGLOverlay 
    // component imported from deckgl-overlay.js
    const {viewport, data, selectedCounty, hoveredCounty, arcson, active_direction,
           has_arcs, extrudeon, active_data, ts, dow, interpolator} = this.state;
    var selected = (selectedCounty.size > 0) && Array.from(selectedCounty)[0];
    return (
      <MapGL
        {...viewport}
        perspectiveEnabled={true}
        onChangeViewport={this._onChangeViewport.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <HomesHover
          hoveredCounty={hoveredCounty}
          selectedCounty={selectedCounty}
          data_prop={"total"}
          data_minimum={15}
        />
        <FlowsHover
          hoveredCounty={hoveredCounty}
          selectedCounty={selectedCounty}
          active_direction={active_direction}
        />
        <HomesHover
          hoveredCounty={hoveredCounty}
          selectedCounty={selectedCounty}
          data_prop={"rog"}
        />
        <RoadHover
          hoveredCounty={hoveredCounty}
          selectedCounty={selectedCounty}
          hour={ts}
          dow={dow}
        />
        <DeckGLOverlay viewport={viewport}
          data={data}
          selectedFeature={selected}
          hoveredFeature={hoveredCounty}
          onClick={this._setSelect.bind(this)}
          onHover={this._setHover.bind(this)}
          strokeWidth={5}
          arcson={arcson}
          extrudeon={extrudeon}
          active_direction={active_direction}
          has_arcs={has_arcs}
          active_data={active_data}
          ts={ts}
          dow={dow}
          interpolator={interpolator}
          />
      </MapGL>
    );
  }

  render_controls() {
    // renders map ui elements making use of MapControls component from ./js/map-controls.js
    const {active_source, active_layer, arcson, dataFn, active_data,
          active_date, active_direction, extrudeon,
          active_region, ts, dow} = this.state;
    return(
      <MapControls
          sourceFn={this.setSource.bind(this)}
          active_source={active_source}
          active_layer={arcson}
          layerFn={this.setLayer.bind(this)}
          active_data={active_data}
          dataFn={this.setData.bind(this)}
          active_date={active_date}
          dateFn={this.setDate.bind(this)}
          active_direction={active_direction}
          directionFn={this.setDirection.bind(this)}
          extrude_on={extrudeon}
          extrudeFn={this.toggleExtrude.bind(this)}
          active_region={active_region}
          regionFn={this.setRegion.bind(this)}
          ts={ts}
          setTimeCallBack={this._setTime.bind(this)}
          dow={dow}
          setDowCallBack={this._setDow.bind(this)}
          />
    );
  }

  render() {
    // renders everything inside a div if we have a scaler or a matrix dataset then
    // only renders tooltip applicable
    const {active_data, hoveredCounty, selectedCounty, active_direction, hoverX, hoverY, interpolator, data, loadedData, ts, dow} = this.state;
    return(
    <div>
    
    {this.render_map()}
    {this.render_controls()}
    <ColorBar
            stops={5}
            interpolator={interpolator}
         />
    {/* <ODTablePane
      loadedData={loadedData}
      visible={["longterm_flows", "trips", "hartigan"].indexOf(active_data) != -1}
      data={data}
      selectedCounty={selectedCounty}
      active_direction={active_direction}
      hoveredCounty={hoveredCounty}
      lowerBound={15}
      hoverBack={this._setHover.bind(this)}
    />
    <TablePane
      loadedData={loadedData}
      visible={active_data == "rog"}
      data={data}
      valueProp={"rog"}
      valueName={"Radius of Gyration"}
      hoveredCounty={hoveredCounty}
      lowerBound={0}
      hoverBack={this._setHover.bind(this)}
    />
    <TablePane
      loadedData={loadedData}
      visible={active_data == "homes"}
      data={data}
      valueProp={"total"}
      hoveredCounty={hoveredCounty}
      valueName={"Homes"}
      lowerBound={15}
      hoverBack={this._setHover.bind(this)}
    /> */}
    <RoadGraph
      data={selectedCounty}
      hour={ts}
      dow={dow}
    />
    </div>
    );
  }
}

// final render function attatches root component to the dom body
render(<Root />, document.body.appendChild(document.createElement('div')));
