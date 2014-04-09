// Take a <donut-chart title="Foo" data="obj.percentage" color="#fff"></donut-chart>
// and transform it into a d3-d svg chart like:
// <svg>
//   <g>
//     <path d="" transform="translate(to center)" />
//   </g>
// </svg>

angular.module('ng.donut-chart', []).directive('donutChart', function() {
    'use strict';
    return {
        restrict: 'EA',
        scope: {
            data: '=',
            title: '@',
            color: '@',
            size: '@',
            symbol: '@'
        },
        link: function(scope, element, attrs) {
            var symbol = attrs.symbol || '%';
            var size = attrs.size || element[0].clientWidth;
            var color = attrs.color || '5a8e2f';
            var ringSize = size / 20;

            var strokeColor = '#a39d8c';
            var bgFillColor = '#f2f0d6';
            var punchoutFillColor = '#f1e0af';
            var punchoutStrokeColor = '#d2c194';

            var outer = size / 4;

            var transform = function(x, y) {
                return 'translate('+x+','+y+')';
            };

            if (typeof d3 !== 'object') {
                throw new Error("ng.donut-chart requires a global d3 object");
            }
            var scale = d3.scale.linear().domain([0, 100]).range([0, 2 * Math.PI]);

            var transformDown = (size / 4) + ringSize + 1;
            var centerTransform = transform(transformDown, transformDown);

            var width = transformDown * 2;
            var height = scope.title ? size : width;
            var svg = d3.select(element[0])
                .append('svg')
                .style({
                    height: size,
                    width: transformDown * 2
                });

            var drawArc = function(inner, outer, start, end) {
                var a =  d3.svg.arc()
                    .innerRadius(inner).outerRadius(outer)
                    .startAngle(scale(start));
                if (typeof end !== 'undefined') {
                    a.endAngle(end);
                }
                return a;
            };

            var outerBounds = outer + ringSize;

            var background = svg.append('circle').attr({
                'class': 'background',
                fill: bgFillColor,
                stroke: strokeColor,
                r: outerBounds,
                transform: centerTransform
            });

            var middleLayer = svg.append('g').attr({transform: centerTransform});
            var topLayer = svg.append('g').attr({transform: centerTransform});

            var punchOut = middleLayer.append('path').attr({
                'class': 'punch-out',
                fill: punchoutFillColor,
                stroke: punchoutStrokeColor,
                d: drawArc(outer - ringSize, outer, 0, 100)
            });

            if (scope.title) {
                var dropPin = svg.append('g').attr({
                    transform: centerTransform,
                    'class': 'drop-pin'
                });
                var cy = outerBounds * 1.3;
                var r = outerBounds / 20;
                dropPin.append('line').attr({
                    x1: 0,
                    y1: outerBounds,
                    x2: 0,
                    y2: cy,
                    stroke: strokeColor
                });
                dropPin.append('circle').attr({
                    fill: strokeColor,
                    cx: 0,
                    cy: cy,
                    r: r
                });
                dropPin.append('text').attr({
                    y: cy + r,
                    'alignment-baseline': 'hanging',
                    'text-anchor': 'middle'
                }).text(scope.title);
            }

            topLayer.append('circle').attr({
                fill: bgFillColor,
                stroke: '#f9f9ec',
                r: outer - ringSize
            });

            var textLabel = topLayer.append('text').attr({
                transform: transform(0, 5),
                'text-anchor': 'middle'
            });


            var arc = drawArc(outer - ringSize, outer - 0.5, 0);
            var path = middleLayer.append('path')
                .datum({endAngle: 0})
                .attr({
                    fill: '#' + color,
                    d: arc
                });

            var arcTween = function(transition, newAngle) {
                transition.attrTween('d', function(d) {
                    var interpolate = d3.interpolate(d.endAngle, scale(newAngle));
                    return function(t) {
                        d.endAngle = interpolate(t);
                        return arc(d);
                    };
                });
            };

            scope.$digest();

            scope.render = function(data, tweenTime) {
                path.transition()
                    .duration(tweenTime || 750)
                    .call(arcTween, data);
                textLabel.text(data + symbol);
            };

            scope.$watch('data', function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    scope.render(newVal);
                }
            });

            if (scope.data) scope.render(scope.data, 250);
        }
    };
});
