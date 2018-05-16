 import {scaleQuantile, scaleSequential, scaleLinear} from 'd3-scale';
 import {color} from 'd3-color';

 export function getScale(data_range, color_interpolator) {
    if(data_range) {
        const qScale = scaleQuantile().domain(data_range).range([0, 1, 2, 3, 4, 5]);
        function f(val) {
          if(val == 0) {
            return [0, 0, 20, 200]
          }
          var scale = scaleSequential().domain([0, 5]).clamp(true).interpolator(color_interpolator);
          var col = color(scale(qScale(val)));
          return [col.r, col.g, col.b, 220];  
        }
        return f;
    } else {
      function g(val) {
        return [0, 0, 20, 200];
      }
      return g;
    }
}

export function getHeightScale(data_range, max_height) {
    if(data_range){
        data_range = data_range.sort((a, b) => a - b);
        var max = data_range[data_range.length - 1];
        var min = data_range[0];
        function scale(val) {
            return (val/max)*max_height;
        }
        return scale;
      }
    return function(val) {
      return 0;
    }
}

export function linspace(start, end, n) {
        var out = [];
        var delta = (end - start) / (n - 1);

        var i = 0;
        while(i < (n - 1)) {
            out.push(start + (i * delta));
            i++;
        }

        out.push(end);
        return out;
    }