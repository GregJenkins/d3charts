
function ScatterPlot(scope, element, attribute) {
    var margin = scope.options.margin; 
    scope.width = scope.options.width;
    scope.height = scope.options.height;
    scope.margin = margin;
    var width = scope.width - margin.left - margin.right;
    var height = scope.height - margin.top - margin.bottom;
    scope.rectWidth = width;
    scope.rectHeight = height; 
    scope.zoomed = false;
    this.scope = scope; 
    var that = this;
    var xAttribute = scope.options.xAttribute;
    var yAttribute = scope.options.yAttribute;
    var sizeAttribute = scope.options.sizeAttribute;  
	var xMax = d3.max(scope.data, function(d) { return d[xAttribute]; });
    var xMin = d3.min(scope.data, function(d) { return d[xAttribute]; });
    var yMax = d3.max(scope.data, function(d) { return d[yAttribute]; });
    var yMin = d3.min(scope.data, function(d) { return d[yAttribute]; });
    var rMin = d3.min(scope.data, function(d) { return d[sizeAttribute]; });
    var rMax = d3.max(scope.data, function(d) { return d[sizeAttribute]; });
		
    //Define scales
    var xScale = d3.scale.linear()
        .domain([Math.floor(xMin), Math.ceil(xMax)])
        .range([0, width]);

    var yScale = d3.scale.linear()
        .domain([Math.floor(yMin), Math.ceil(yMax)])
        .range([height, 0]);		

    var rScale = d3.scale.linear()
        .domain([rMin, rMax])
        .range([2, 40]);

    //Define X axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(10)
        .orient("bottom")      
        .tickFormat(scope.options.format);

    //Define Y axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(10)
        .tickFormat(scope.options.format);
    var svgElement = element.find('svg');
    // Setup zoom 
    this.zoom = d3.behavior.zoom().x(xScale).y(yScale).scaleExtent([1, 8]).on('zoom', function() {
                          that.zoomFunction(); 
                      });
    var group = d3.select(svgElement[0])
                .select('g')
                .call(this.zoom);
    group.select('g.x.axis')
        .call(xAxis)
        .selectAll('.tick line')
        .attr('y1', -height);

    group.select('g.y.axis')
        .call(yAxis)
        .selectAll('.tick line')
        .attr('x1', width);


    group.select('#circles')
        .selectAll('circle')
        .data(scope.data)
        .enter()
        .append('circle')
        .attr('transform', function(d, i) {
            return 'translate(' + xScale(d[xAttribute]) + ',' + yScale(d[yAttribute]) + ')';
        })
        .attr('r', function (d, i) {
            return rScale(d[sizeAttribute]);
        })
        .attr('opacity', '0.8')
        .attr('fill', function(d) {
            return scope.options.colorScale(d[sizeAttribute] / rMax);
        });

    // Zoom event callback 
    this.zoomFunction = function(){
      if (!scope.zoomed) {
        scope.zoomed = true;
        scope.$digest();
      }
      group.select('.x.axis')
        .call(xAxis)
        .selectAll('.tick line')
        .attr('y1', -height);
      group.select('.y.axis')
        .call(yAxis)
        .selectAll('.tick line')
        .attr('x1', width);
      d3.select('#circles')
        .selectAll('circle')			
        .attr("transform", function(d, i) {
            return 'translate(' + xScale(d[xAttribute]) + ',' + yScale(d[yAttribute]) + ')';
        }); 
    };
    
    // Reset zoom 
    scope.resetZoom = function() {
        that.zoom.scale(1);
        that.zoom.translate([0, 0]);
        that.zoomFunction();
        scope.zoomed = false;
    };
    
    // tooltip 
    this.removeTooltip = function(){
        d3.select('div#scatterplot div#tooltip').remove();
    }
    group.selectAll('#circles circle')
         .on('mouseover', function(d) {
             var x = d3.event.clientX;
             var y = d3.event.clientY;
             that.removeTooltip(); 
             var div = d3.select('div#scatterplot')
                        .append('div')
                        .attr('id', 'tooltip')
                        .style('top', y)
                        .style('left', x);
             div.append('div')
                .text('strategyid: ' + d['strategyid']);
             div.append('div')
                .text(xAttribute + ': ' + d[xAttribute]);
             div.append('div')
                .text(yAttribute + ': ' + d[yAttribute]);
             div.append('div')
                .text(sizeAttribute + ': ' + d[sizeAttribute]); 
         })
        .on('mouseout', function(d) {
            that.removeTooltip(); 
        });  
}
    

angular.module('ScatterPlotModule') 
.directive('scatterPlot', [function() {
    return {
        restrict: 'E',
        templateUrl: 'scatterPlot.html',
        scope: {
            data: '=',
            options: '='
        },
        link: function(scope, element, attribute) {
            new ScatterPlot(scope, element, attribute); 
        }
    }; 
}]);