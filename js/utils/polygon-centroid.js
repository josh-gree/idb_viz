import {polygonCentroid, polygonContains} from 'd3-polygon';

export function getCentroid(f) {
    var cent;
    var geom;
    if(f.hasOwnProperty("centroid")) {
      return f.centroid.coordinates;
    }
    if(f.geometry.type == "Polygon") {
    	geom = f.geometry.coordinates[0];
    } else {
    	geom = f.geometry.coordinates[0][0];
    }
  	cent = polygonCentroid(geom)
  	if(polygonContains(geom, cent)) {
    	return cent;
  	}
	console.log("Failed to get centroid of Polygon:")    
    console.log(f)
    return false;
}