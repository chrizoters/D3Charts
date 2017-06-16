var genStatistics; // Render Object
var sst = 0; // To Capture the Data Value
var container = []; // SVG Container
var d = []; //Arc - Value Meter
var lstContainer = [];

// Gloabl variable for Canvas Width and Height
var vw = "100%"; 
    vh = "100%"; 

define(["jquery", "./d3.min", "./d3.v3.min"], function ($, d3) {
    'use strict';
    return {
        initialProperties: {
            version: 1.0,
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 2,
                    qHeight: 100
                }]
            }
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                measures: {
                    uses: "measures",
                    min: 1,
                    max: 1

                },
                addons: {
                    uses: "addons",
                    items: {
                        TotalCount: {
                            ref: "TotalCount",
                            label: "Higher Limit",
                            type: "number",
                            defaultValue: 0,
                            expression: "always",
                            expressionType: "dimension"
                        },
                        Selcolour: {
                            ref: "Selcolour",
                            label: "Colour",
                            type: "string",
                            defaultValue: "#FF3D4D"
                        },

                    }
                },
                settings: {
                    uses: "settings"


                }

            }
        },

        snapshot: {
            canTakeSnapshot: true
        },

        //paint is used for drawing the object
        paint: function ($element, layout) {

            var vw = $element.width();
            var vh = $element.height();


            if (typeof layout.responsive == 'undefined') {
                layout.responsive = true;
            }

            var divName = layout.qInfo.qId;
            var html = '<div id="canvas'
                  + divName
                  + '" style="width:' + vw + 'px;'
                  + 'height:' + vh + 'px;'
                  + 'left: 0; position: absolute; background-color:red'
                  + 'top:0;z-index:999;"></div>';

            $element.html(html);

            var format = layout.qHyperCube.qMeasureInfo[0].qNumFormat.qFmt;
            var d3Format;
            var value = layout.qHyperCube.qDataPages[0].qMatrix[0];

            sst = value[0].qNum;

            if (format) {
                if (format.indexOf('%') != (-1)) {
                    d3Format = '<,%';
                } else {

                }
            }

            var id = "container_" + layout.qInfo.qId;
        
            if (document.getElementById(id)) {
                $("#" + id).empty();
                $("#" + id).css("margin", "auto"); //Center Alignment
				
            }
            else {
                $element.append($('<div />;').attr("id", id).width(vw).height(vh).css("margin", "auto !important"));

            }
            if (value[0].qText != "" || value[0].qText != null()) {

            }
            if (isNaN(sst)) { sst = 0; }
            viz(sst, id, vw, vh, layout.Selcolour, layout.TotalCount, d3Format, value[0].qText, divName);

        }
    };
});

// Statistics Visualization

function viz(value, id, width, height, Selcolour, MaxCount, format, textValue, divName) {

alert( width + '||' + height + '||' + "Maxcount : " + MaxCount + '|| ' + "value :" + value + '|| ' + 'format:' + format);

    if (!format) {
        format = ',.2s';
    }

    var statistics = function (container, configuration) {
        lstContainer.push(container);
        var that = {};
        var config = {
            cWidth: width,
            cHeight: height,
            twoPi: 2 * Math.PI,
            progress: 0,
            maxValue: MaxCount,
            Color: Selcolour,
            formatPercent: d3.format("0"),
        };
		
        function configure(configuration) {
            var prop = undefined;
            for (prop in configuration) {
                config[prop] = configuration[prop];
            }

        }
        that.configure = configure;
        that.isRendered = function () { return (svg !== undefined); };
      
        function render(newValue) {

            animate(sst);
        }

        var animate = function (percentage) {

        var arc = d3.svg.arc()
                     
                      .startAngle(0)
                      .innerRadius(50) //Need to be Auto-Gen
                      .outerRadius(53);//Need to be Auto-Gen
            
            svg = d3.select(container) 
          
               .append('svg:svg')
               .attr("width", config.cWidth)
               .attr("height", config.cHeight)
               .attr('fill', '#2E7AF9')
               .append("g")
               .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                var meter = svg.append("g")
                meter.append("path")
                   .attr("fill", "lightgrey")
                   .attr('id', divName)
                   .attr("d", arc.endAngle(config.twoPi));

                var text = meter.append("text")
                    .attr("y", "0")
                    .attr("text-anchor", "middle")
                    .attr("font-size", "20px")
                    .attr('alignment-baseline', 'central')
                    .attr('font-family', 'sans-serif')
                    .attr('fill', config.Color);

                var resVal = config.formatPercent(sst);
                var maxVal=((percentage / config.maxValue) * config.twoPi);
                if(isNaN(maxVal)){maxVal=0;}
               
                text.append("tspan").attr("x", "0").attr("dy", "5").attr("font-size", "30px").text(resVal);

                text.append("tspan").attr("x", "0").attr("fill", "grey").attr("dy", "17").attr("font-size", "13px").text(config.maxValue);
                   
                 var foreground = meter.append("path")
                                .attr("id", divName)
                                .attr("fill", config.Color);
                     foreground.attr("d", arc.endAngle(maxVal));
              };
            
        that.render = render;

        configure(configuration);

        return that;
    };



    function onDocumentReady() {
        genStatistics = statistics('#' + id, {
            cWidth: vw,
            cHeight: vh,
            maxValue: MaxCount,
            progress: 0,

        });
        genStatistics.render();

    }
    onDocumentReady();
}
