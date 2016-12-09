(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.AmRadarChart = AmCharts.Class({

        inherits: AmCharts.AmCoordinateChart,

        construct: function(theme) {
            var _this = this;
            _this.type = "radar";
            AmCharts.AmRadarChart.base.construct.call(_this, theme);
            _this.cname = "AmRadarChart";

            _this.marginLeft = 0;
            _this.marginTop = 0;
            _this.marginBottom = 0;
            _this.marginRight = 0;
            _this.radius = "35%";

            AmCharts.applyTheme(_this, theme, _this.cname);
        },

        initChart: function() {
            var _this = this;
            AmCharts.AmRadarChart.base.initChart.call(_this);
            if (_this.dataChanged) {
                _this.parseData();
            } else {
                _this.onDataUpdated();
            }
        },

        onDataUpdated: function() {
            this.drawChart();
        },

        updateGraphs: function() {
            var _this = this;
            var graphs = _this.graphs;
            var i;
            for (i = 0; i < graphs.length; i++) {
                var graph = graphs[i];
                graph.index = i;
                graph.width = _this.realRadius;
                graph.height = _this.realRadius;
                graph.x = _this.marginLeftReal;
                graph.y = _this.marginTopReal;
                graph.data = _this.chartData;
            }
        },

        parseData: function() {
            var _this = this;
            AmCharts.AmRadarChart.base.parseData.call(_this);
            _this.parseSerialData(_this.dataProvider);
        },

        updateValueAxes: function() {
            var _this = this;
            var valueAxes = _this.valueAxes;
            var i;
            for (i = 0; i < valueAxes.length; i++) {
                var valueAxis = valueAxes[i];
                valueAxis.axisRenderer = AmCharts.RadAxis;
                valueAxis.guideFillRenderer = AmCharts.RadarFill;
                valueAxis.axisItemRenderer = AmCharts.RadItem;
                valueAxis.autoGridCount = false;
                valueAxis.rMultiplier = 1;

                valueAxis.x = _this.marginLeftReal;
                valueAxis.y = _this.marginTopReal;
                valueAxis.width = _this.realRadius;
                valueAxis.height = _this.realRadius;
                valueAxis.marginsChanged = true;

                valueAxis.titleDY = -valueAxis.height;
            }
        },


        drawChart: function() {
            var _this = this;
            AmCharts.AmRadarChart.base.drawChart.call(_this);
            var realWidth = _this.updateWidth();
            var realHeight = _this.updateHeight();

            var marginTop = _this.marginTop + _this.getTitleHeight();
            var marginLeft = _this.marginLeft;
            var marginBottom = _this.marginBottom;
            var marginRight = _this.marginRight;
            var allowedHeight = realHeight - marginTop - marginBottom;

            _this.marginLeftReal = marginLeft + (realWidth - marginLeft - marginRight) / 2;
            _this.marginTopReal = marginTop + allowedHeight / 2;

            var radH = realHeight - marginTop - marginBottom;
            var radW = realWidth - marginLeft - marginRight;

            _this.realRadius = AmCharts.toCoordinate(_this.radius, Math.min(radW, radH), allowedHeight);

            _this.updateValueAxes();
            _this.updateGraphs();

            var chartData = _this.chartData;

            if (AmCharts.ifArray(chartData)) {
                if (_this.realWidth > 0 && _this.realHeight > 0) {
                    var last = chartData.length - 1;
                    var valueAxes = _this.valueAxes;
                    var i;
                    for (i = 0; i < valueAxes.length; i++) {
                        var valueAxis = valueAxes[i];
                        valueAxis.zoom(0, last);
                    }

                    var graphs = _this.graphs;
                    for (i = 0; i < graphs.length; i++) {
                        var graph = graphs[i];
                        graph.zoom(0, last);
                    }

                    var legend = _this.legend;
                    if (legend) {
                        legend.invalidateSize();
                    }
                }
            } else {
                _this.cleanChart();
            }
            _this.dispDUpd();

            _this.gridSet.toBack();
            _this.axesSet.toBack();
            _this.set.toBack();
        },


        formatString: function(text, dItem, noFixBrakes) {
            var _this = this;
            var graph = dItem.graph;

            if (text.indexOf("[[category]]") != -1) {
                var category = dItem.serialDataItem.category;
                text = text.replace(/\[\[category\]\]/g, String(category));
            }

            var numberFormatter = graph.numberFormatter;
            if (!numberFormatter) {
                numberFormatter = _this.nf;
            }

            var keys = ["value"];
            text = AmCharts.formatValue(text, dItem.values, keys, numberFormatter, "", _this.usePrefixes, _this.prefixesOfSmallNumbers, _this.prefixesOfBigNumbers);

            if (text.indexOf("[[") != -1) {
                text = AmCharts.formatDataContextValue(text, dItem.dataContext);
            }

            text = AmCharts.AmRadarChart.base.formatString.call(_this, text, dItem, noFixBrakes);

            return text;
        },

        cleanChart: function() {
            var _this = this;
            AmCharts.callMethod("destroy", [_this.valueAxes, _this.graphs]);
        }

    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.RadAxis = AmCharts.Class({

        construct: function(axis) {
            var _this = this;
            var chart = axis.chart;

            var t = axis.axisThickness;
            var c = axis.axisColor;
            var a = axis.axisAlpha;
            var UNDEFINED;

            _this.set = chart.container.set();
            _this.set.translate(axis.x, axis.y);
            chart.axesSet.push(_this.set);

            var axisTitleOffset = axis.axisTitleOffset;
            var radarCategoriesEnabled = axis.radarCategoriesEnabled;

            var fontFamily = axis.chart.fontFamily;
            var textSize = axis.fontSize;

            if (textSize === UNDEFINED) {
                textSize = axis.chart.fontSize;
            }

            var color = axis.color;
            if (color === UNDEFINED) {
                color = axis.chart.color;
            }

            if (chart) {
                _this.axisWidth = axis.height;
                var dataProvider = chart.chartData;
                var count = dataProvider.length;
                var i;
                var dist = _this.axisWidth;

                if (axis.pointPosition == "middle" && axis.gridType != "circles") {
                    axis.rMultiplier = Math.cos(180 / count * Math.PI / 180);
                    dist = dist * axis.rMultiplier;
                }

                for (i = 0; i < count; i += axis.axisFrequency) {
                    var angle = 180 - 360 / count * i;
                    var labelAngle = angle;

                    if (axis.pointPosition == "middle") {
                        labelAngle -= 180 / count;
                    }

                    var xx = _this.axisWidth * Math.sin((angle) / (180) * Math.PI);
                    var yy = _this.axisWidth * Math.cos((angle) / (180) * Math.PI);
                    if (a > 0) {
                        var line = AmCharts.line(chart.container, [0, xx], [0, yy], c, a, t);
                        _this.set.push(line);

                        AmCharts.setCN(chart, line, axis.bcn + "line");
                    }

                    // label
                    if (radarCategoriesEnabled) {
                        var align = "start";
                        var labelX = (dist + axisTitleOffset) * Math.sin((labelAngle) / (180) * Math.PI);
                        var labelY = (dist + axisTitleOffset) * Math.cos((labelAngle) / (180) * Math.PI);

                        if (labelAngle == 180 || labelAngle === 0) {
                            align = "middle";
                            labelX = labelX - 5;
                        }
                        if (labelAngle < 0) {
                            align = "end";
                            labelX = labelX - 10;
                        }

                        if (labelAngle == 180) {
                            labelY -= 5;
                        }

                        if (labelAngle === 0) {
                            labelY += 5;
                        }

                        var titleTF = AmCharts.text(chart.container, dataProvider[i].category, color, fontFamily, textSize, align);
                        titleTF.translate(labelX + 5, labelY);
                        _this.set.push(titleTF);

                        AmCharts.setCN(chart, titleTF, axis.bcn + "title");
                    }
                }
            }
        }
    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.RadItem = AmCharts.Class({

        construct: function(axis, coord, value, below, textWidth, valueShift, guide, bold) {
            var _this = this;
            var UNDEFINED;
            var chart = axis.chart;

            if (value === UNDEFINED) {
                value = "";
            }

            var fontFamily = axis.chart.fontFamily;
            var textSize = axis.fontSize;

            if (textSize === UNDEFINED) {
                textSize = axis.chart.fontSize;
            }

            var color = axis.color;
            if (color === UNDEFINED) {
                color = axis.chart.color;
            }

            var container = axis.chart.container;
            var set = container.set();
            _this.set = set;

            var axisColor = axis.axisColor;
            var axisAlpha = axis.axisAlpha;
            var tickLength = axis.tickLength;
            var gridAlpha = axis.gridAlpha;
            var gridThickness = axis.gridThickness;
            var gridColor = axis.gridColor;
            var dashLength = axis.dashLength;
            var fillColor = axis.fillColor;
            var fillAlpha = axis.fillAlpha;
            var labelsEnabled = axis.labelsEnabled;
            var counter = axis.counter;
            var labelInside = axis.inside;
            var gridType = axis.gridType;
            var i;
            var count;
            var angle;
            var labelOffset = axis.labelOffset;
            var className;


            coord -= axis.height;
            var tick;
            var grid;

            if (guide) {
                labelsEnabled = true;

                if (guide.id !== undefined) {
                    className = chart.classNamePrefix + "-guide-" + guide.id;
                }

                if (!isNaN(guide.tickLength)) {
                    tickLength = guide.tickLength;
                }

                if (guide.lineColor != UNDEFINED) {
                    gridColor = guide.lineColor;
                }

                if (!isNaN(guide.lineAlpha)) {
                    gridAlpha = guide.lineAlpha;
                }

                if (!isNaN(guide.dashLength)) {
                    dashLength = guide.dashLength;
                }

                if (!isNaN(guide.lineThickness)) {
                    gridThickness = guide.lineThickness;
                }
                if (guide.inside === true) {
                    labelInside = true;
                }
                if (guide.boldLabel !== undefined) {
                    bold = guide.boldLabel;
                }
            } else {
                if (!value) {
                    gridAlpha = gridAlpha / 3;
                    tickLength = tickLength / 2;
                }
            }

            var align = "end";
            var dir = -1;
            if (labelInside) {
                align = "start";
                dir = 1;
            }

            var valueTF;
            if (labelsEnabled) {
                valueTF = AmCharts.text(container, value, color, fontFamily, textSize, align, bold);
                valueTF.translate((tickLength + 3 + labelOffset) * dir, coord);
                set.push(valueTF);

                AmCharts.setCN(chart, valueTF, axis.bcn + "label");
                if (guide) {
                    AmCharts.setCN(chart, valueTF, "guide");
                }
                AmCharts.setCN(chart, valueTF, className, true);

                _this.label = valueTF;

                tick = AmCharts.line(container, [0, tickLength * dir], [coord, coord], axisColor, axisAlpha, gridThickness);
                set.push(tick);

                AmCharts.setCN(chart, tick, axis.bcn + "tick");
                if (guide) {
                    AmCharts.setCN(chart, tick, "guide");
                }
                AmCharts.setCN(chart, tick, className, true);
            }

            var radius = Math.abs(coord);

            // grid
            var xx = [];
            var yy = [];
            if (gridAlpha > 0) {
                if (gridType == "polygons") {

                    count = axis.data.length;

                    for (i = 0; i < count; i++) {
                        angle = 180 - 360 / count * i;
                        xx.push(radius * Math.sin((angle) / (180) * Math.PI));
                        yy.push(radius * Math.cos((angle) / (180) * Math.PI));
                    }
                    xx.push(xx[0]);
                    yy.push(yy[0]);

                    grid = AmCharts.line(container, xx, yy, gridColor, gridAlpha, gridThickness, dashLength);
                } else {
                    grid = AmCharts.circle(container, radius, "#FFFFFF", 0, gridThickness, gridColor, gridAlpha);
                }
                set.push(grid);

                AmCharts.setCN(chart, grid, axis.bcn + "grid");
                AmCharts.setCN(chart, grid, className, true);
                if (guide) {
                    AmCharts.setCN(chart, grid, "guide");
                }
            }

            if (counter == 1 && fillAlpha > 0 && !guide && value !== "") {
                var prevCoord = axis.previousCoord;
                var fill;

                if (gridType == "polygons") {
                    for (i = count; i >= 0; i--) {
                        angle = 180 - 360 / count * i;
                        xx.push(prevCoord * Math.sin((angle) / (180) * Math.PI));
                        yy.push(prevCoord * Math.cos((angle) / (180) * Math.PI));
                    }
                    fill = AmCharts.polygon(container, xx, yy, fillColor, fillAlpha);
                } else {
                    fill = AmCharts.wedge(container, 0, 0, 0, 360, radius, radius, prevCoord, 0, {
                        "fill": fillColor,
                        "fill-opacity": fillAlpha,
                        "stroke": "#000",
                        "stroke-opacity": 0,
                        "stroke-width": 1
                    });
                }
                set.push(fill);

                AmCharts.setCN(chart, fill, axis.bcn + "fill");
                AmCharts.setCN(chart, fill, className, true);
            }


            if (axis.visible === false) {
                if (tick) {
                    tick.hide();
                }
                if (valueTF) {
                    valueTF.hide();
                }
            }

            if (value !== "") {
                if (counter === 0) {
                    axis.counter = 1;
                } else {
                    axis.counter = 0;
                }
                axis.previousCoord = radius;
            }
        },

        graphics: function() {
            return this.set;
        },

        getLabel: function() {
            return this.label;
        }
    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.RadarFill = AmCharts.Class({

        construct: function(axis, guideCoord, guideToCoord, guide) {

            guideCoord = guideCoord - axis.axisWidth;
            guideToCoord = guideToCoord - axis.axisWidth;

            var guideToCoordReal = Math.max(guideCoord, guideToCoord);
            var guideCoordReal = Math.min(guideCoord, guideToCoord);

            guideToCoord = guideToCoordReal;
            guideCoord = guideCoordReal;

            var _this = this;
            var chart = axis.chart;
            var container = chart.container;
            var fillAlpha = guide.fillAlpha;
            var fillColor = guide.fillColor;

            var radius = Math.abs(guideToCoord);
            var innerRadius = Math.abs(guideCoord);

            var radiusReal = Math.max(radius, innerRadius);
            var innerRadiusReal = Math.min(radius, innerRadius);

            radius = radiusReal;
            innerRadius = innerRadiusReal;

            var angle = guide.angle + 90;
            var toAngle = guide.toAngle + 90;
            if (isNaN(angle)) {
                angle = 0;
            }
            if (isNaN(toAngle)) {
                toAngle = 360;
            }

            _this.set = container.set();

            if (fillColor === undefined) {
                fillColor = "#000000";
            }

            if (isNaN(fillAlpha)) {
                fillAlpha = 0;
            }

            var fill;
            if (axis.gridType == "polygons") {
                var xx = [];
                var yy = [];

                var count = axis.data.length;

                var i;
                for (i = 0; i < count; i++) {
                    angle = 180 - 360 / count * i;
                    xx.push(radius * Math.sin((angle) / (180) * Math.PI));
                    yy.push(radius * Math.cos((angle) / (180) * Math.PI));
                }
                xx.push(xx[0]);
                yy.push(yy[0]);

                for (i = count; i >= 0; i--) {
                    angle = 180 - 360 / count * i;
                    xx.push(innerRadius * Math.sin((angle) / (180) * Math.PI));
                    yy.push(innerRadius * Math.cos((angle) / (180) * Math.PI));
                }

                fill = AmCharts.polygon(container, xx, yy, fillColor, fillAlpha);
            } else {
                fill = AmCharts.wedge(container, 0, 0, angle, (toAngle - angle), radius, radius, innerRadius, 0, {
                    "fill": fillColor,
                    "fill-opacity": fillAlpha,
                    "stroke": "#000",
                    "stroke-opacity": 0,
                    "stroke-width": 1
                });
            }

            AmCharts.setCN(chart, fill, "guide-fill");
            if (guide.id) {
                AmCharts.setCN(chart, fill, "guide-fill-" + guide.id);
            }

            _this.set.push(fill);

            _this.fill = fill;
        },

        graphics: function() {
            return this.set;
        },

        getLabel: function() {

        }
    });
})();