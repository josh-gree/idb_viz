import {format} from 'd3-format';

export function getadmin(f) {
      const {name} = f.properties;
      if(name.startsWith("5")) {
          const {coordinates} = f.geometry;
          return "" + format(",.4r")(coordinates[0][0][0]) + ", " + format(",.4r")(coordinates[0][0][1]);
      }
      return name
  }