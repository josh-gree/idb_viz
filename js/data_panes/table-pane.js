import React from 'react';
import {format} from 'd3-format';
import { AutoSizer, MultiGrid } from 'react-virtualized'

export default class TablePane extends React.Component {

	constructor(props) {
	  	super(props);
		this.state = {};
	}

	componentWillReceiveProps(nextProps) {
		const {data, loadedData, hoveredCounty, visible} = nextProps;
		if(!visible) {
			return;
		}
		var setState = this.setState.bind(this);
		var {all_sources} = this.state;
		if(loadedData != this.props.loadedData) {
					
				try{
					all_sources = data.filter(src => src.properties[nextProps.valueProp] && src.properties[nextProps.valueProp] > nextProps.lowerBound);
					const list = this.table_header();
			
					all_sources.forEach(function(src, src_ix)  {
						list[src_ix + 1] = {0: src.properties.name, 1: format(",.2r")(src.properties[nextProps.valueProp])};
					});
					setState({list: list, columnCount: 2, rowCount: all_sources.length + 1, all_sources: all_sources});
				} catch (err) {
					console.log("No data.");
				}
		}
		if(hoveredCounty && all_sources){
				all_sources.forEach(function(src, src_ix)  {
						if(src.properties.name == hoveredCounty.properties.name) {
							setState({hoveredColumnIndex: 1, hoveredRowIndex: src_ix + 1, scrollToRow: src_ix + 1})
						}
					});
			}
	}

	table_header() {
		const header = {0: {0:"Region", 1:this.props.valueName}};
		return header;
	}

	cellRenderer (params) {
    	var columnIndex = params.columnIndex;
	    var rowIndex = params.rowIndex;
	    var hoverBack = this.props.hoverBack;
	    var setState = this.setState.bind(this);
	    var className =
	      rowIndex === this.state.hoveredRowIndex
	        ? 'item hoveredItem'
	        : 'item';
	    className = rowIndex == 0 ? 'sidebar' : className;
    	const content = (this.state.list[rowIndex] || {})[columnIndex] || "";
    	const obj = this.state.all_sources[rowIndex - 1];
	  return (
	    <div
	      key={params.key}
	      className={className}
	      style={params.style}
	      onMouseOver={function() {
	      	          setState({
	      	            hoveredColumnIndex: columnIndex,
	      	            hoveredRowIndex: rowIndex,
	      	          });
	      	          hoverBack({'object':obj, 'x':-1, 'y':-1})
	      	        }}
	      onMouseOut={function() {hoverBack({})}}
	    >
	      {content}
	    </div>
	  )  
	}

	render() {
    const {data, valueProp, visible} = this.props;
    if(!data || !visible) {
    	return null;
    }   
    if(data.filter(x => x.properties[valueProp]).length == 0) {
    	return null;
    }

    return (
   	<div id="datatable">
   	<AutoSizer>
          {({width, height}) => (
	    <MultiGrid
	      {...this.state}
	      cellRenderer={this.cellRenderer.bind(this)}
	      columnWidth={80}
	      fixedColumnCount={0}
	      fixedRowCount={1}
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