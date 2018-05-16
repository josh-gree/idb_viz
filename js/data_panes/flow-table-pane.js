import React from 'react';
import {format} from 'd3-format';
import { AutoSizer, MultiGrid } from 'react-virtualized'

export default class ODTablePane extends React.Component {

	constructor(props) {
	  	super(props);
		this.state = {};
	}

	componentWillReceiveProps(nextProps) {
		const {hoveredCounty, x, y, selectedCounty, active_direction, data, loadedData, visible} = nextProps;
		const selected = selectedCounty.size > 0 && Array.from(selectedCounty)[0];
		var setState = this.setState.bind(this);
		var {all_sources, all_sinks} = this.state;
		if(!visible) {
			return;
		}
		try{

				const lastSelectNames = Array.from(this.props.selectedCounty).map(x => x.properties.name);
				const selectNames = Array.from(selectedCounty).map(x => x.properties.name);
				if(!(active_direction == this.props.active_direction && loadedData == this.props.loadedData && lastSelectNames.length == selectNames.length && lastSelectNames[0] == selectNames[0])) {
					try{
						all_sources = data;
						all_sinks = all_sources;
						if(active_direction == "out") {
							if(selected) { // If a region is selected, only show flows for that region
						    	all_sinks = all_sinks.filter(x => x.properties.inflows && x.properties.inflows[selected.properties.name] && selected.properties.name != x.properties.name  && x.properties.inflows[selected.properties.name] > nextProps.lowerBound);
						    	all_sources = [selected];
						    }
						} else {
						    if(selected) { // If a region is selected, only show flows for that region
						    	all_sources = all_sources.filter(x => x.properties.outflows && x.properties.outflows[selected.properties.name] && selected.properties.name != x.properties.name && x.properties.outflows[selected.properties.name] > nextProps.lowerBound);
						    	all_sinks = [selected];
						    }
						}
				
						const list = this.table_header(all_sinks, all_sources);
				
						all_sources.forEach(function (src, src_ix) {
							all_sinks.forEach(function (sink, sink_ix) {
								if(src.properties.name != sink.properties.name){
									var val = (src.properties.outflows || {})[sink.properties.name] || "";
									var obj = active_direction == "out" ? sink : src;
									list[src_ix + 2][sink_ix + 2] = {"val": val > nextProps.lowerBound ? format(",.2r")(val) : "", "obj": obj};
									//list[src_ix + 2][sink_ix + 2]["obj"] = src;
									
								}
							});
							}
						);
						this.setState({list: list, columnCount: all_sinks.length + 2, rowCount: all_sources.length + 2,
										 all_sources: all_sources, all_sinks: all_sinks});
					} catch (err) {
						console.log("No data.");
					}
				}
				setState({hoveredColumnIndex: undefined, hoveredRowIndex: undefined, scrollToColumn: 1, scrollToRow: 1})
				if(hoveredCounty){
					all_sources.forEach(function (src, src_ix) {
						all_sinks.forEach(function (sink, sink_ix) {
							if(selected){
								if (active_direction == "out") {
									if(sink.properties.name == hoveredCounty.properties.name) {
										setState({hoveredColumnIndex: sink_ix + 2, hoveredRowIndex: undefined, scrollToColumn: sink_ix + 2})
									}
								} else {
									if(src.properties.name == hoveredCounty.properties.name) {
										setState({hoveredRowIndex: src_ix + 2, hoveredColumnIndex: undefined, scrollToRow: src_ix + 2})
									}
								}
							} else {
								if (active_direction == "in") {
									if(sink.properties.name == hoveredCounty.properties.name) {
										setState({hoveredColumnIndex: sink_ix + 2, hoveredRowIndex: undefined, scrollToColumn: sink_ix + 2})
									}
								} else {
									if(src.properties.name == hoveredCounty.properties.name) {
										setState({hoveredRowIndex: src_ix + 2, hoveredColumnIndex: undefined, scrollToRow: src_ix + 2})
									}
								}
							}
						});
					});

				}
			} catch (err) {
			console.log("Failed to check for redraw.")
		}
		
	}

	table_header(sinks, sources) {
		const header = {0: {1:"To"}, 1: {0: "From"}};
		sinks.forEach((sink, ix) => header[1][ix + 2] = {"val":sink.properties.name, "obj":sink});
		sources.forEach((src, ix) => header[ix + 2]= {1: {"val":src.properties.name, "obj":src}});
		return header;
	}

	cellRenderer (params) {
    	var columnIndex = params.columnIndex;
	    var rowIndex = params.rowIndex;
	    var setState = this.setState.bind(this);
	    var hoverBack = this.props.hoverBack;
	    var className = (columnIndex != 1 && rowIndex != 1) &&
	      (columnIndex === this.state.hoveredColumnIndex ||
	      	      rowIndex === this.state.hoveredRowIndex)
	        ? 'item hoveredItem'
	        : 'item';
	    className = columnIndex == 0 ? 'sidebar' : className;
	    className = rowIndex == 0 ? 'header' : className;
    	const content = (this.state.list[rowIndex] || {})[columnIndex] || "";
	  return (
	    <div
	      key={params.key}
	      className={className}
	      style={params.style}
	      onMouseOver={function() {
	      	          setState({
	      	            hoveredColumnIndex: columnIndex > 1 ? columnIndex : undefined,
	      	            hoveredRowIndex: rowIndex > 1 ? rowIndex : undefined,
	      	          });
	      	          hoverBack({"object": content.obj, "x":-1, "y":-1})
	      	        }}
	      onMouseOut={function() {hoverBack({})}}
	    >
	      {content.val}
	    </div>
	  )  
	}

	render() {
    const {data, visible} = this.props;
    if(!data || !visible) {
    	return null;
    }   
    if(data.filter(x => x.properties.inflows || x.properties.outflows).length == 0) {
    	return null;
    }

    return (
   	<div id="datatable">
   	<AutoSizer>
          {({width, height}) => (
	    <MultiGrid
	      {...this.state}
	      cellRenderer={this.cellRenderer.bind(this)}
	      columnWidth={75}
	      fixedColumnCount={2}
	      fixedRowCount={2}
	      enableFixedColumnScroll
	      enableFixedRowScroll
	      height={height}
	      rowHeight={40}
	      width={width}
	    />)}
	</AutoSizer>
    </div>
    );
  }
}