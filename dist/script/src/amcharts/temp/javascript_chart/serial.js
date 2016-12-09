(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.AmRectangularChart = AmCharts.Class({

        inherits: AmCharts.AmCoordinateChart,

        construct: function(theme) {
            var _this = this;
            AmCharts.AmRectangularChart.base.construct.call(_this, theme);
            _this.theme = theme;
            _this.createEvents("zoomed", "changed");

            _this.marginLeft = 20;
            _this.marginTop = 20;
            _this.marginBottom = 20;
            _this.marginRight = 20;
            _this.angle = 0;
            _this.depth3D = 0;
            _this.plotAreaFillColors = "#FFFFFF";
            _this.plotAreaFillAlphas = 0;
            _this.plotAreaBorderColor = "#000000";
            _this.plotAreaBorderAlpha = 0;
            _this.maxZoomFactor = 20;
            // this one is deprecated since 3.2.1
            /*
        _this.zoomOutButton = {
            backgroundColor: '#e5e5e5',
            backgroundAlpha: 1
        };*/

            _this.zoomOutButtonImageSize = 19;
            _this.zoomOutButtonImage = "lens";
            _this.zoomOutText = "Show all";
            _this.zoomOutButtonColor = "#e5e5e5";
            _this.zoomOutButtonAlpha = 0;
            _this.zoomOutButtonRollOverAlpha = 1;
            _this.zoomOutButtonPadding = 8;
            //_this.zoomOutButtonFontSize;
            //_this.zoomOutButtonFontColor;

            _this.trendLines = [];
            _this.autoMargins = true;
            _this.marginsUpdated = false;
            _this.autoMarginOffset = 10;

            AmCharts.applyTheme(_this, theme, "AmRectangularChart");
        },

        initChart: function() {
            var _this = this;
            AmCharts.AmRectangularChart.base.initChart.call(_this);
            _this.updateDxy();

            if (!_this.marginsUpdated && _this.autoMargins) {
                _this.resetMargins();
                _this.drawGraphs = false;
            }

            _this.processScrollbars();
            _this.updateMargins();
            _this.updatePlotArea();
            _this.updateScrollbars();
            _this.updateTrendLines();
            _this.updateChartCursor();
            _this.updateValueAxes();

            if (!_this.scrollbarOnly) {
                _this.updateGraphs();
            }
        },

        drawChart: function() {
            var _this = this;
            AmCharts.AmRectangularChart.base.drawChart.call(_this);
            _this.drawPlotArea();
            var chartData = _this.chartData;
            if (AmCharts.ifArray(chartData)) {
                var chartCursor = _this.chartCursor;
                if (chartCursor) {
                    chartCursor.draw();
                }
            }
        },


        resetMargins: function() {
            var _this = this;

            var fixMargins = {};
            var i;

            if (_this.type == "xy") {

                var xAxes = _this.xAxes;
                var yAxes = _this.yAxes;

                for (i = 0; i < xAxes.length; i++) {
                    var xAxis = xAxes[i];
                    if (!xAxis.ignoreAxisWidth) {
                        xAxis.setOrientation(true);
                        xAxis.fixAxisPosition();
                        fixMargins[xAxis.position] = true;
                    }
                }
                for (i = 0; i < yAxes.length; i++) {
                    var yAxis = yAxes[i];
                    if (!yAxis.ignoreAxisWidth) {
                        yAxis.setOrientation(false);
                        yAxis.fixAxisPosition();
                        fixMargins[yAxis.position] = true;
                    }
                }
            } else {
                var valueAxes = _this.valueAxes;

                for (i = 0; i < valueAxes.length; i++) {
                    var valueAxis = valueAxes[i];
                    if (!valueAxis.ignoreAxisWidth) {
                        valueAxis.setOrientation(_this.rotate);
                        valueAxis.fixAxisPosition();
                        fixMargins[valueAxis.position] = true;
                    }
                }

                var categoryAxis = _this.categoryAxis;
                if (categoryAxis) {
                    if (!categoryAxis.ignoreAxisWidth) {
                        categoryAxis.setOrientation(!_this.rotate);
                        categoryAxis.fixAxisPosition();
                        categoryAxis.fixAxisPosition();
                        fixMargins[categoryAxis.position] = true;
                    }
                }
            }


            if (fixMargins.left) {
                _this.marginLeft = 0;
            }
            if (fixMargins.right) {
                _this.marginRight = 0;
            }
            if (fixMargins.top) {
                _this.marginTop = 0;
            }
            if (fixMargins.bottom) {
                _this.marginBottom = 0;
            }

            _this.fixMargins = fixMargins;
        },

        measureMargins: function() {

            var _this = this;
            var valueAxes = _this.valueAxes;
            var bounds;
            var autoMarginOffset = _this.autoMarginOffset;
            var fixMargins = _this.fixMargins;
            var realWidth = _this.realWidth;
            var realHeight = _this.realHeight;

            var l = autoMarginOffset;
            var t = autoMarginOffset;
            var r = realWidth; //3.4.3 - autoMarginOffset;
            var b = realHeight; // 3.4.3 - autoMarginOffset;
            var i;
            for (i = 0; i < valueAxes.length; i++) {
                valueAxes[i].handleSynchronization();
                bounds = _this.getAxisBounds(valueAxes[i], l, r, t, b);
                l = Math.round(bounds.l);
                r = Math.round(bounds.r);
                t = Math.round(bounds.t);
                b = Math.round(bounds.b);
            }

            var categoryAxis = _this.categoryAxis;
            if (categoryAxis) {
                bounds = _this.getAxisBounds(categoryAxis, l, r, t, b);
                l = Math.round(bounds.l);
                r = Math.round(bounds.r);
                t = Math.round(bounds.t);
                b = Math.round(bounds.b);
            }

            if (fixMargins.left && l < autoMarginOffset) {
                _this.marginLeft = Math.round(-l + autoMarginOffset);
                if (!isNaN(_this.minMarginLeft)) {
                    if (_this.marginLeft < _this.minMarginLeft) {
                        _this.marginLeft = _this.minMarginLeft;
                    }
                }
            }

            if (fixMargins.right && r >= realWidth - autoMarginOffset) {
                _this.marginRight = Math.round(r - realWidth + autoMarginOffset);
                if (!isNaN(_this.minMarginRight)) {
                    if (_this.marginRight < _this.minMarginRight) {
                        _this.marginRight = _this.minMarginRight;
                    }
                }
            }
            if (fixMargins.top && t < autoMarginOffset + _this.titleHeight) {
                _this.marginTop = Math.round(_this.marginTop - t + autoMarginOffset + _this.titleHeight);
                if (!isNaN(_this.minMarginTop)) {
                    if (_this.marginTop < _this.minMarginTop) {
                        _this.marginTop = _this.minMarginTop;
                    }
                }
            }
            if (fixMargins.bottom && b > realHeight - autoMarginOffset) {
                _this.marginBottom = Math.round(_this.marginBottom + b - realHeight + autoMarginOffset);
                if (!isNaN(_this.minMarginBottom)) {
                    if (_this.marginBottom < _this.minMarginBottom) {
                        _this.marginBottom = _this.minMarginBottom;
                    }
                }
            }
            //_this.resetAnimation();

            _this.initChart();
        },

        getAxisBounds: function(axis, l, r, t, b) {
            var x;
            var y;

            if (!axis.ignoreAxisWidth) {
                var set = axis.labelsSet;
                var tickLength = axis.tickLength;
                if (axis.inside) {
                    tickLength = 0;
                }

                if (set) {
                    var bbox = axis.getBBox();

                    switch (axis.position) {
                        case "top":
                            y = bbox.y;

                            if (t > y) {
                                t = y;
                            }

                            break;
                        case "bottom":
                            y = bbox.y + bbox.height;
                            if (b < y) {
                                b = y;
                            }
                            break;
                        case "right":

                            x = bbox.x + bbox.width + tickLength + 3;

                            if (r < x) {
                                r = x;
                            }

                            break;
                        case "left":
                            x = bbox.x - tickLength;

                            if (l > x) {
                                l = x;
                            }
                            break;
                    }
                }
            }

            return ({
                l: l,
                t: t,
                r: r,
                b: b
            });
        },


        drawZoomOutButton: function() {
            var _this = this;
            if (!_this.zbSet) {
                var zbSet = _this.container.set();
                _this.zoomButtonSet.push(zbSet);
                var color = _this.color;
                var fontSize = _this.fontSize;
                var zoomOutButtonImageSize = _this.zoomOutButtonImageSize;
                var zoomOutButtonImage = _this.zoomOutButtonImage.replace(/\.[a-z]*$/i, '');
                var zoomOutText = AmCharts.lang.zoomOutText || _this.zoomOutText;
                var zoomOutButtonColor = _this.zoomOutButtonColor;
                var zoomOutButtonAlpha = _this.zoomOutButtonAlpha;
                var zoomOutButtonFontSize = _this.zoomOutButtonFontSize;
                var zoomOutButtonPadding = _this.zoomOutButtonPadding;
                if (!isNaN(zoomOutButtonFontSize)) {
                    fontSize = zoomOutButtonFontSize;
                }
                var zoomOutButtonFontColor = _this.zoomOutButtonFontColor;
                if (zoomOutButtonFontColor) {
                    color = zoomOutButtonFontColor;
                }

                // this one is depracated, but still checking
                var zoomOutButton = _this.zoomOutButton;
                var bbox;

                if (zoomOutButton) {
                    if (zoomOutButton.fontSize) {
                        fontSize = zoomOutButton.fontSize;
                    }
                    if (zoomOutButton.color) {
                        color = zoomOutButton.color;
                    }
                    if (zoomOutButton.backgroundColor) {
                        zoomOutButtonColor = zoomOutButton.backgroundColor;
                    }
                    if (!isNaN(zoomOutButton.backgroundAlpha)) {
                        _this.zoomOutButtonRollOverAlpha = zoomOutButton.backgroundAlpha;
                    }
                }

                var labelX = 0;
                var labelY = 0;
                var pathToImages = _this.pathToImages;
                if (zoomOutButtonImage) {
                    if (AmCharts.isAbsolute(zoomOutButtonImage) || pathToImages === undefined) {
                        pathToImages = "";
                    }

                    var image = _this.container.image(pathToImages + zoomOutButtonImage + _this.extension, 0, 0, zoomOutButtonImageSize, zoomOutButtonImageSize);
                    AmCharts.setCN(_this, image, "zoom-out-image");
                    zbSet.push(image);

                    bbox = image.getBBox();
                    labelX = bbox.width + 5;
                }


                if (zoomOutText !== undefined) {
                    var label = AmCharts.text(_this.container, zoomOutText, color, _this.fontFamily, fontSize, "start");
                    AmCharts.setCN(_this, label, "zoom-out-label");
                    var labelBox = label.getBBox();

                    if (bbox) {
                        labelY = bbox.height / 2 - 3;
                    } else {
                        labelY = labelBox.height / 2;
                    }
                    label.translate(labelX, labelY);
                    zbSet.push(label);
                }

                bbox = zbSet.getBBox();
                var borderAlpha = 1;
                if (!AmCharts.isModern) {
                    borderAlpha = 0;
                }

                var bg = AmCharts.rect(_this.container, bbox.width + zoomOutButtonPadding * 2 + 5, bbox.height + zoomOutButtonPadding * 2 - 2, zoomOutButtonColor, 1, 1, zoomOutButtonColor, borderAlpha);
                bg.setAttr("opacity", zoomOutButtonAlpha);
                bg.translate(-zoomOutButtonPadding, -zoomOutButtonPadding);

                AmCharts.setCN(_this, bg, "zoom-out-bg");
                zbSet.push(bg);
                bg.toBack();
                _this.zbBG = bg;

                //AmCharts.setCN(_this, zbSet, "zoom-out");

                bbox = bg.getBBox();
                zbSet.translate((_this.marginLeftReal + _this.plotAreaWidth - bbox.width + zoomOutButtonPadding), _this.marginTopReal + zoomOutButtonPadding);
                zbSet.hide();

                zbSet.mouseover(function() {
                    _this.rollOverZB();
                }).mouseout(function() {
                    _this.rollOutZB();
                }).click(function() {
                    _this.clickZB();
                }).touchstart(function() {
                    _this.rollOverZB();
                }).touchend(function() {
                    _this.rollOutZB();
                    _this.clickZB();
                });
                var j;
                for (j = 0; j < zbSet.length; j++) {
                    zbSet[j].attr({
                        cursor: "pointer"
                    });
                }

                if (_this.zoomOutButtonTabIndex !== undefined) {
                    zbSet.setAttr("tabindex", _this.zoomOutButtonTabIndex);
                    zbSet.setAttr("role", "menuitem");
                    zbSet.keyup(function(ev) {
                        if (ev.keyCode == 13) {
                            _this.clickZB();
                        }
                    });
                }

                _this.zbSet = zbSet;
            }
        },

        rollOverZB: function() {
            this.rolledOverZB = true;
            this.zbBG.setAttr("opacity", this.zoomOutButtonRollOverAlpha);
        },

        rollOutZB: function() {
            this.rolledOverZB = false;
            this.zbBG.setAttr("opacity", this.zoomOutButtonAlpha);
        },

        clickZB: function() {
            this.rolledOverZB = false;
            this.zoomOut();
        },

        zoomOut: function() {
            var _this = this;
            _this.zoomOutValueAxes();
        },

        drawPlotArea: function() {
            var _this = this;
            var dx = _this.dx;
            var dy = _this.dy;
            var x0 = _this.marginLeftReal;
            var y0 = _this.marginTopReal;
            var w = _this.plotAreaWidth - 1;
            var h = _this.plotAreaHeight - 1;
            var color = _this.plotAreaFillColors;
            var alpha = _this.plotAreaFillAlphas;
            var plotAreaBorderColor = _this.plotAreaBorderColor;
            var plotAreaBorderAlpha = _this.plotAreaBorderAlpha;

            // clip trend lines set
            //_this.trendLinesSet.clipRect(x0, y0, w, h);

            if (typeof(alpha) == "object") {
                alpha = alpha[0];
            }

            var bg = AmCharts.polygon(_this.container, [0, w, w, 0, 0], [0, 0, h, h, 0], color, alpha, 1, plotAreaBorderColor, plotAreaBorderAlpha, _this.plotAreaGradientAngle);

            AmCharts.setCN(_this, bg, "plot-area");
            bg.translate(x0 + dx, y0 + dy);
            //bg.node.setAttribute("class", "amChartsPlotArea"); // this made IE8 work incorrectly
            _this.set.push(bg);

            if (dx !== 0 && dy !== 0) {
                color = _this.plotAreaFillColors;
                if (typeof(color) == "object") {
                    color = color[0];
                }
                color = AmCharts.adjustLuminosity(color, -0.15);

                var hSide = AmCharts.polygon(_this.container, [0, dx, w + dx, w, 0], [0, dy, dy, 0, 0], color, alpha, 1, plotAreaBorderColor, plotAreaBorderAlpha);
                AmCharts.setCN(_this, hSide, "plot-area-bottom");
                hSide.translate(x0, (y0 + h));
                _this.set.push(hSide);

                var vSide = AmCharts.polygon(_this.container, [0, 0, dx, dx, 0], [0, h, h + dy, dy, 0], color, alpha, 1, plotAreaBorderColor, plotAreaBorderAlpha);
                AmCharts.setCN(_this, vSide, "plot-area-left");
                vSide.translate(x0, y0);
                _this.set.push(vSide);
            }

            var bbset = _this.bbset;
            if (bbset) {
                if (_this.scrollbarOnly) {
                    bbset.remove();
                }
            }

        },

        updatePlotArea: function() {
            var _this = this;
            var realWidth = _this.updateWidth();
            var realHeight = _this.updateHeight();
            var container = _this.container;

            _this.realWidth = realWidth;
            _this.realWidth = realHeight;

            if (container) {
                _this.container.setSize(realWidth, realHeight);
            }

            var dx = _this.dx;
            var x0 = _this.marginLeftReal;
            var y0 = _this.marginTopReal;

            var w = realWidth - x0 - _this.marginRightReal - dx;
            var h = realHeight - y0 - _this.marginBottomReal;

            if (w < 1) {
                w = 1;
            }

            if (h < 1) {
                h = 1;
            }

            _this.plotAreaWidth = Math.round(w);
            _this.plotAreaHeight = Math.round(h);

            _this.plotBalloonsSet.translate(x0, y0);
        },

        updateDxy: function() {
            var _this = this;
            _this.dx = Math.round(_this.depth3D * Math.cos(_this.angle * Math.PI / 180));
            _this.dy = Math.round(-_this.depth3D * Math.sin(_this.angle * Math.PI / 180));

            _this.d3x = Math.round(_this.columnSpacing3D * Math.cos(_this.angle * Math.PI / 180));
            _this.d3y = Math.round(-_this.columnSpacing3D * Math.sin(_this.angle * Math.PI / 180));
        },

        updateMargins: function() {
            var _this = this;
            var titleHeight = _this.getTitleHeight();
            _this.titleHeight = titleHeight;
            _this.marginTopReal = _this.marginTop - _this.dy;
            if (_this.fixMargins) {
                if (!_this.fixMargins.top) {
                    _this.marginTopReal += titleHeight;
                }
            }
            _this.marginBottomReal = _this.marginBottom;
            _this.marginLeftReal = _this.marginLeft;
            _this.marginRightReal = _this.marginRight;
        },

        updateValueAxes: function() {
            var _this = this;
            var valueAxes = _this.valueAxes;

            var i;
            for (i = 0; i < valueAxes.length; i++) {
                var valueAxis = valueAxes[i];
                _this.setAxisRenderers(valueAxis);
                _this.updateObjectSize(valueAxis);
            }
        },

        setAxisRenderers: function(axis) {
            axis.axisRenderer = AmCharts.RecAxis;
            axis.guideFillRenderer = AmCharts.RecFill;
            axis.axisItemRenderer = AmCharts.RecItem;
            axis.marginsChanged = true;
        },

        updateGraphs: function() {
            var _this = this;
            var graphs = _this.graphs;
            var i;
            for (i = 0; i < graphs.length; i++) {
                var graph = graphs[i];
                graph.index = i;
                graph.rotate = _this.rotate;
                _this.updateObjectSize(graph);
            }
        },

        // graphs and value axes are updated using this method
        updateObjectSize: function(obj) {
            var _this = this;
            obj.width = _this.plotAreaWidth - 1;
            obj.height = _this.plotAreaHeight - 1;
            obj.x = _this.marginLeftReal;
            obj.y = _this.marginTopReal;
            obj.dx = _this.dx;
            obj.dy = _this.dy;
        },


        updateChartCursor: function() {
            var _this = this;
            var chartCursor = _this.chartCursor;

            if (chartCursor) {
                chartCursor = AmCharts.processObject(chartCursor, AmCharts.ChartCursor, _this.theme);
                _this.updateObjectSize(chartCursor);
                _this.addChartCursor(chartCursor);
                chartCursor.chart = this;
            }
        },

        processScrollbars: function() {
            var _this = this;
            var chartScrollbar = _this.chartScrollbar;
            if (chartScrollbar) {
                chartScrollbar = AmCharts.processObject(chartScrollbar, AmCharts.ChartScrollbar, _this.theme);
                _this.addChartScrollbar(chartScrollbar);
            }
        },

        updateScrollbars: function() {
            // void
        },



        removeChartCursor: function() {
            var _this = this;
            AmCharts.callMethod("destroy", [_this.chartCursor]);
            _this.chartCursor = null;
        },

        zoomTrendLines: function() {
            var _this = this;
            var trendLines = _this.trendLines;
            var i;
            for (i = 0; i < trendLines.length; i++) {
                var trendLine = trendLines[i];

                if (!trendLine.valueAxis.recalculateToPercents) {
                    trendLine.x = _this.marginLeftReal;
                    trendLine.y = _this.marginTopReal;
                    trendLine.draw();
                } else {
                    if (trendLine.set) {
                        trendLine.set.hide();
                    }
                }
            }
        },

        handleCursorValueZoom: function() {

        },

        addTrendLine: function(trendLine) {
            this.trendLines.push(trendLine);
        },

        zoomOutValueAxes: function() {
            var _this = this;
            var valueAxes = _this.valueAxes;
            for (var i = 0; i < valueAxes.length; i++) {
                valueAxes[i].zoomOut();
            }
        },

        removeTrendLine: function(trendLine) {
            var trendLines = this.trendLines;
            var i;
            for (i = trendLines.length - 1; i >= 0; i--) {
                if (trendLines[i] == trendLine) {
                    trendLines.splice(i, 1);
                }
            }
        },


        adjustMargins: function(scrollbar, rotate) {
            var _this = this;
            var position = scrollbar.position;
            var scrollbarHeight = scrollbar.scrollbarHeight + scrollbar.offset;

            if (scrollbar.enabled) {
                if (position == "top") {
                    if (rotate) {
                        _this.marginLeftReal += scrollbarHeight;
                    } else {
                        _this.marginTopReal += scrollbarHeight;
                    }
                } else {
                    if (rotate) {
                        _this.marginRightReal += scrollbarHeight;
                    } else {
                        _this.marginBottomReal += scrollbarHeight;
                    }
                }
            }
        },


        getScrollbarPosition: function(scrollbar, rotate, axisPosition) {
            var scrollbarPosition;

            var b = "bottom";
            var t = "top";
            if (!scrollbar.oppositeAxis) {
                t = b;
                b = "top";
            }

            if (rotate) {
                if (axisPosition == "bottom" || axisPosition == "left") {
                    scrollbarPosition = b;
                } else {
                    scrollbarPosition = t;
                }
            } else {
                if (axisPosition == "top" || axisPosition == "right") {
                    scrollbarPosition = b;
                } else {
                    scrollbarPosition = t;
                }
            }
            scrollbar.position = scrollbarPosition;
        },


        updateChartScrollbar: function(scrollbar, rotate) {
            var _this = this;
            if (scrollbar) {
                scrollbar.rotate = rotate;
                var position = scrollbar.position;
                var marginTopReal = _this.marginTopReal;
                var marginLeftReal = _this.marginLeftReal;
                var scrollbarHeight = scrollbar.scrollbarHeight;
                var dx = _this.dx;
                var dy = _this.dy;
                var offset = scrollbar.offset;

                if (position == "top") {
                    if (rotate) {
                        scrollbar.y = marginTopReal;
                        scrollbar.x = marginLeftReal - scrollbarHeight - offset;
                    } else {
                        scrollbar.y = marginTopReal - scrollbarHeight + dy - offset;
                        scrollbar.x = marginLeftReal + dx;
                    }
                } else {
                    if (rotate) {
                        scrollbar.y = marginTopReal + dy;
                        scrollbar.x = marginLeftReal + _this.plotAreaWidth + dx + offset;
                    } else {
                        scrollbar.y = marginTopReal + _this.plotAreaHeight + offset;
                        scrollbar.x = _this.marginLeftReal;
                    }
                }
            }
        },

        showZB: function(show) {

            var _this = this;
            var zbSet = _this.zbSet;

            if (show) {
                var zoomOutText = _this.zoomOutText;
                if (zoomOutText !== "" && zoomOutText) {
                    _this.drawZoomOutButton();
                }
            }

            zbSet = _this.zbSet;
            if (zbSet) {
                _this.zoomButtonSet.push(zbSet);
                if (show) {
                    zbSet.show();
                } else {
                    zbSet.hide();
                }
                _this.rollOutZB();
            }
        },

        handleReleaseOutside: function(e) {
            var _this = this;

            AmCharts.AmRectangularChart.base.handleReleaseOutside.call(_this, e);
            var chartCursor = _this.chartCursor;
            if (chartCursor) {
                if (chartCursor.handleReleaseOutside) {
                    chartCursor.handleReleaseOutside();
                }
            }
        },

        handleMouseDown: function(e) {
            var _this = this;
            AmCharts.AmRectangularChart.base.handleMouseDown.call(_this, e);
            var chartCursor = _this.chartCursor;
            if (chartCursor) {
                if (chartCursor.handleMouseDown && !_this.rolledOverZB) {
                    chartCursor.handleMouseDown(e);
                }
            }
        },


        update: function() {
            var _this = this;
            AmCharts.AmRectangularChart.base.update.call(_this);

            if (_this.chartCursor) {
                if (_this.chartCursor.update) {
                    _this.chartCursor.update();
                }
            }
        },

        handleScrollbarValueZoom: function(event) {
            var _this = this;
            _this.relativeZoomValueAxes(event.target.valueAxes, event.relativeStart, event.relativeEnd);
            _this.zoomAxesAndGraphs();
        },


        zoomValueScrollbar: function(scrollbar) {
            if (scrollbar) {
                if (scrollbar.enabled) {
                    var valueAxis = scrollbar.valueAxes[0];
                    var start = valueAxis.relativeStart;
                    var end = valueAxis.relativeEnd;

                    if (valueAxis.reversed) {
                        end = 1 - start;
                        start = 1 - valueAxis.relativeEnd;
                    }

                    scrollbar.percentZoom(start, end);
                }
            }
        },

        zoomAxesAndGraphs: function() {
            var _this = this;
            if (!_this.scrollbarOnly) {
                var valueAxes = _this.valueAxes;
                var i;
                for (i = 0; i < valueAxes.length; i++) {
                    var valueAxis = valueAxes[i];
                    valueAxis.zoom(_this.start, _this.end);
                }
                var graphs = _this.graphs;
                for (i = 0; i < graphs.length; i++) {
                    var graph = graphs[i];
                    graph.zoom(_this.start, _this.end);
                }

                var cursor = _this.chartCursor;
                if (cursor) {
                    cursor.clearSelection();
                }

                _this.zoomTrendLines();
            }
        },


        handleValueAxisZoomReal: function(event, axes) {
            var _this = this;

            var start = event.relativeStart;
            var end = event.relativeEnd;

            if (start > end) {
                var temp = start;
                start = end;
                end = temp;
            }

            _this.relativeZoomValueAxes(axes, start, end);

            _this.updateAfterValueZoom();
        },

        updateAfterValueZoom: function() {
            var _this = this;
            _this.zoomAxesAndGraphs();
            _this.zoomScrollbar();
        },

        relativeZoomValueAxes: function(valueAxes, start, end) {
            var _this = this;

            start = AmCharts.fitToBounds(start, 0, 1);
            end = AmCharts.fitToBounds(end, 0, 1);

            if (start > end) {
                var temp = start;
                start = end;
                end = temp;
            }

            var maxZoomFactor = 1 / _this.maxZoomFactor;

            var decimals = AmCharts.getDecimals(maxZoomFactor) + 4;

            if (end - start < maxZoomFactor) {
                var middle = start + (end - start) / 2;
                start = middle - maxZoomFactor / 2;
                end = middle + maxZoomFactor / 2;
            }

            start = AmCharts.roundTo(start, decimals);
            end = AmCharts.roundTo(end, decimals);
            var zoomed = false;
            if (valueAxes) {
                for (var i = 0; i < valueAxes.length; i++) {
                    var valueAxis = valueAxes[i];
                    var wasZoomed = valueAxis.zoomToRelativeValues(start, end, true);
                    if (wasZoomed) {
                        zoomed = wasZoomed;
                    }
                }

                _this.showZB();
            }
            return zoomed;
        },


        // CURSOR HANDLERS
        addChartCursor: function(chartCursor) {
            var _this = this;
            AmCharts.callMethod("destroy", [_this.chartCursor]);

            if (chartCursor) {
                //_this.listenTo(chartCursor, "changed", _this.handleCursorChange);
                _this.listenTo(chartCursor, "moved", _this.handleCursorMove);
                _this.listenTo(chartCursor, "zoomed", _this.handleCursorZoom);
                _this.listenTo(chartCursor, "zoomStarted", _this.handleCursorZoomStarted);
                _this.listenTo(chartCursor, "panning", _this.handleCursorPanning);
                _this.listenTo(chartCursor, "onHideCursor", _this.handleCursorHide);
            }
            _this.chartCursor = chartCursor;
        },

        handleCursorChange: function() {
            //void
        },

        handleCursorMove: function(event) {
            var _this = this;
            var i;
            var valueAxes = _this.valueAxes;
            for (i = 0; i < valueAxes.length; i++) {
                if (!event.panning) {
                    var valueAxis = valueAxes[i];
                    if (valueAxis) {
                        if (valueAxis.showBalloon) {
                            valueAxis.showBalloon(event.x, event.y);
                        }
                    }
                }
            }
        },

        handleCursorZoom: function(event) {
            var _this = this;

            if (_this.skipZoomed) {
                _this.skipZoomed = false;
                return;
            }

            var startX0 = _this.startX0;
            var endX0 = _this.endX0;
            var endY0 = _this.endY0;
            var startY0 = _this.startY0;

            var startX = event.startX;
            var endX = event.endX;
            var startY = event.startY;
            var endY = event.endY;

            startX = startX0 + startX * (endX0 - startX0);
            endX = startX0 + endX * (endX0 - startX0);

            startY = startY0 + startY * (endY0 - startY0);
            endY = startY0 + endY * (endY0 - startY0);

            _this.endY0 = NaN;
            _this.startY0 = NaN;

            _this.endX0 = NaN;
            _this.startX0 = NaN;

            _this.handleCursorZoomReal(startX, endX, startY, endY, event);
        },
        /*
        handleCursorZoomReal:function(){

        },

        handleCursorZoomStarted: function() {
            //void
        },

        handleCursorPanning:function(){

        },
*/
        handleCursorHide: function() {
            var _this = this;
            var i;
            var valueAxes = _this.valueAxes;
            for (i = 0; i < valueAxes.length; i++) {
                valueAxes[i].hideBalloon();
            }
            var graphs = _this.graphs;
            for (i = 0; i < graphs.length; i++) {
                graphs[i].hideBalloonReal();
            }
        }
        // END OF CURSOR HANDLERS
    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.AmSerialChart = AmCharts.Class({

        inherits: AmCharts.AmRectangularChart,

        construct: function(theme) {
            var _this = this;
            _this.type = "serial";
            AmCharts.AmSerialChart.base.construct.call(_this, theme);
            _this.cname = "AmSerialChart";

            _this.theme = theme;

            _this.columnSpacing = 5;
            _this.columnSpacing3D = 0;
            _this.columnWidth = 0.8;

            var categoryAxis = new AmCharts.CategoryAxis(theme);
            categoryAxis.chart = this;
            _this.categoryAxis = categoryAxis;

            _this.zoomOutOnDataUpdate = true;
            _this.skipZoom = false;
            _this.rotate = false;

            _this.mouseWheelScrollEnabled = false;
            _this.mouseWheelZoomEnabled = false;

            // _this.maxSelectedSeries;
            // _this.maxSelectedTime;
            _this.minSelectedTime = 0;

            AmCharts.applyTheme(_this, theme, _this.cname);
        },

        initChart: function() {
            var _this = this;
            AmCharts.AmSerialChart.base.initChart.call(_this);

            _this.updateCategoryAxis(_this.categoryAxis, _this.rotate, "categoryAxis");

            if (_this.dataChanged) {
                _this.parseData();
            } else {
                _this.onDataUpdated();
            }
            _this.drawGraphs = true;
        },

        onDataUpdated: function() {
            var _this = this;
            var columnCount = _this.countColumns();
            var chartData = _this.chartData;
            var graphs = _this.graphs;
            var i;
            for (i = 0; i < graphs.length; i++) {
                var graph = graphs[i];
                graph.data = chartData;
                graph.columnCount = columnCount;
            }

            if (chartData.length > 0) {
                _this.firstTime = _this.getStartTime(chartData[0].time);
                _this.lastTime = _this.getEndTime(chartData[chartData.length - 1].time);
            }

            _this.drawChart();

            if (_this.autoMargins && !_this.marginsUpdated) {
                _this.marginsUpdated = true;
                _this.measureMargins();
            } else {
                _this.dispDUpd();
            }
        },

        syncGrid: function() {
            var _this = this;
            if (_this.synchronizeGrid) {
                var valueAxes = _this.valueAxes;
                var axis;
                var i;
                if (valueAxes.length > 0) {
                    var maxCount = 0;
                    for (i = 0; i < valueAxes.length; i++) {
                        axis = valueAxes[i];
                        if (maxCount < axis.gridCountReal) {
                            maxCount = axis.gridCountReal;
                        }
                    }

                    var validate = false;
                    for (i = 0; i < valueAxes.length; i++) {
                        axis = valueAxes[i];                        
                        if (axis.gridCountReal < maxCount) {                            
                            var delta = (maxCount - axis.gridCountReal) / 2;
                            var deltaMin = delta;
                            var deltaMax = delta;

                            if (delta - Math.round(delta) !== 0) {
                                deltaMin -= 0.5;
                                deltaMax += 0.5;
                            }

                            if(axis.min >= 0 && axis.min - deltaMin * axis.step < 0){
                                deltaMax += deltaMin;
                                deltaMin = 0;
                            } 

                            if(axis.max <= 0 && axis.max + deltaMax * axis.step > 0){
                                deltaMin += deltaMax;
                                deltaMax = 0;
                            } 

                            var decCount = AmCharts.getDecimals(axis.step);
                            axis.minimum = AmCharts.roundTo(axis.min - deltaMin * axis.step, decCount);
                            axis.maximum = AmCharts.roundTo(axis.max + deltaMax * axis.step, decCount);
                            axis.setStep = axis.step;
                            axis.strictMinMax = true;
                            validate = true;
                        }
                    }

                    if(validate){
                        _this.updateAfterValueZoom();
                    }
                    for (i = 0; i < valueAxes.length; i++) {
                        axis = valueAxes[i];
                        axis.minimum = NaN;
                        axis.maximum = NaN;
                        axis.setStep = NaN;
                        axis.strictMinMax = false;
                    }                    
                }
            }
        },


        handleWheelReal: function(delta, shift) {

            var _this = this;

            if (!_this.wheelBusy) {
                var categoryAxis = _this.categoryAxis;
                var parseDates = categoryAxis.parseDates;
                var minDuration = categoryAxis.minDuration();

                var startSign = 1;
                var endSign = 1;

                if (_this.mouseWheelZoomEnabled) {
                    if (!shift) {
                        startSign = -1;
                    }
                } else {
                    if (shift) {
                        startSign = -1;
                    }
                }

                var cursor = _this.chartCursor;
                if (cursor) {
                    var mouseX = cursor.mouseX;
                    var mouseY = cursor.mouseY;
                    if (startSign != endSign) {
                        var pp;
                        if (_this.rotate) {
                            pp = mouseY / _this.plotAreaHeight;
                        } else {
                            pp = mouseX / _this.plotAreaWidth;
                        }
                        startSign *= pp;
                        endSign *= (1 - pp);
                    }
                    
                    var full = (_this.end - _this.start) * 0.05;
                    if(parseDates){
                        full = (_this.endTime - _this.startTime) * 0.05 / minDuration;
                    }
                    
                    if (full < 1) {
                        full = 1;
                    }
                    startSign = startSign * full;
                    endSign = endSign * full;

                    if (parseDates && !categoryAxis.equalSpacing) {

                    } else {
                        startSign = Math.round(startSign);
                        endSign = Math.round(endSign);
                    }
                }

                var newStart;
                var newEnd;
                var dataLength = _this.chartData.length;
                var diff;
                var lastTime = _this.lastTime;
                var firstTime = _this.firstTime;

                if (delta < 0) {
                    if (parseDates) {
                        diff = _this.endTime - _this.startTime;
                        newStart = _this.startTime + startSign * minDuration;
                        newEnd = _this.endTime + endSign * minDuration;

                        if (endSign > 0 && startSign > 0) {
                            if (newEnd >= lastTime) {
                                newEnd = lastTime;
                                newStart = lastTime - diff;
                            }
                        }

                        _this.zoomToDates(new Date(newStart), new Date(newEnd));
                    } else {
                        if (endSign > 0 && startSign > 0) {
                            if (_this.end >= dataLength - 1) {
                                endSign = 0;
                                startSign = 0;
                            }
                        }

                        newStart = _this.start + startSign;
                        newEnd = _this.end + endSign;
                        _this.zoomToIndexes(newStart, newEnd);
                    }
                } else {
                    if (parseDates) {
                        diff = _this.endTime - _this.startTime;
                        newStart = _this.startTime - startSign * minDuration;
                        newEnd = _this.endTime - endSign * minDuration;

                        if (endSign > 0 && startSign > 0) {
                            if (newStart <= firstTime) {
                                newStart = firstTime;
                                newEnd = firstTime + diff;
                            }
                        }

                        _this.zoomToDates(new Date(newStart), new Date(newEnd));
                    } else {
                        // scrolling
                        if (endSign > 0 && startSign > 0) {
                            if (_this.start < 1) {
                                endSign = 0;
                                startSign = 0;
                            }
                        }

                        newStart = _this.start - startSign;
                        newEnd = _this.end - endSign;
                        _this.zoomToIndexes(newStart, newEnd);
                    }
                }
            }
        },

        validateData: function(resetZoom) {
            var _this = this;

            _this.marginsUpdated = false;
            if (_this.zoomOutOnDataUpdate && !resetZoom) {
                _this.start = NaN;
                _this.startTime = NaN;
                _this.end = NaN;
                _this.endTime = NaN;
            }

            AmCharts.AmSerialChart.base.validateData.call(_this);
        },


        drawChart: function() {
            var _this = this;

            if (_this.realWidth > 0 && _this.realHeight > 0) {

                AmCharts.AmSerialChart.base.drawChart.call(_this);

                var chartData = _this.chartData;

                if (AmCharts.ifArray(chartData)) {

                    var chartScrollbar = _this.chartScrollbar;
                    if (chartScrollbar) {
                        if (!_this.marginsUpdated && _this.autoMargins) {
                            // void
                        } else {
                            chartScrollbar.draw();
                        }
                    }

                    var valueScrollbar = _this.valueScrollbar;
                    if (valueScrollbar) {
                        valueScrollbar.draw();
                    }

                    // zoom
                    var last = chartData.length - 1;
                    var start;
                    var end;

                    var categoryAxis = _this.categoryAxis;
                    if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
                        start = _this.startTime;
                        end = _this.endTime;

                        if (isNaN(start) || isNaN(end)) {
                            start = _this.firstTime;
                            end = _this.lastTime;
                        }
                    } else {
                        start = _this.start;
                        end = _this.end;

                        if (isNaN(start) || isNaN(end)) {
                            start = 0;
                            end = last;
                        }
                    }

                    _this.start = undefined;
                    _this.end = undefined;
                    _this.startTime = undefined;
                    _this.endTime = undefined;
                    _this.zoom(start, end);
                }
            } else {
                _this.cleanChart();
            }
        },

        cleanChart: function() {
            var _this = this;
            AmCharts.callMethod("destroy", [_this.valueAxes, _this.graphs, _this.categoryAxis, _this.chartScrollbar, _this.chartCursor, _this.valueScrollbar]);
        },


        updateCategoryAxis: function(categoryAxis, rotate, id) {
            var _this = this;
            categoryAxis.chart = this;
            categoryAxis.id = id;
            categoryAxis.rotate = rotate;
            categoryAxis.setOrientation(!_this.rotate);
            categoryAxis.init();
            _this.setAxisRenderers(categoryAxis);
            _this.updateObjectSize(categoryAxis);
        },

        updateValueAxes: function() {
            var _this = this;
            AmCharts.AmSerialChart.base.updateValueAxes.call(_this);

            var valueAxes = _this.valueAxes;
            var i;
            for (i = 0; i < valueAxes.length; i++) {
                var valueAxis = valueAxes[i];
                var rotate = _this.rotate;
                valueAxis.rotate = rotate;
                valueAxis.setOrientation(rotate);

                var categoryAxis = _this.categoryAxis;

                if (!categoryAxis.startOnAxis || categoryAxis.parseDates) {
                    valueAxis.expandMinMax = true;
                }
            }
        },


        getStartTime: function(time) {
            var _this = this;
            var categoryAxis = _this.categoryAxis;
            return AmCharts.resetDateToMin(new Date(time), categoryAxis.minPeriod, 1, categoryAxis.firstDayOfWeek).getTime();
        },

        getEndTime: function(time) {
            var _this = this;
            var categoryAxis = _this.categoryAxis;
            var minPeriodObj = AmCharts.extractPeriod(categoryAxis.minPeriod);
            return AmCharts.changeDate(new Date(time), minPeriodObj.period, minPeriodObj.count, true).getTime() - 1;
        },

        updateMargins: function() {
            var _this = this;
            AmCharts.AmSerialChart.base.updateMargins.call(_this);

            var scrollbar = _this.chartScrollbar;

            if (scrollbar) {
                _this.getScrollbarPosition(scrollbar, _this.rotate, _this.categoryAxis.position);
                _this.adjustMargins(scrollbar, _this.rotate);
            }

            var valueScrollbar = _this.valueScrollbar;
            if (valueScrollbar) {
                _this.getScrollbarPosition(valueScrollbar, !_this.rotate, _this.valueAxes[0].position);
                _this.adjustMargins(valueScrollbar, !_this.rotate);
            }
        },

        updateScrollbars: function() {
            var _this = this;
            AmCharts.AmSerialChart.base.updateScrollbars.call(_this);
            _this.updateChartScrollbar(_this.chartScrollbar, _this.rotate);
            _this.updateChartScrollbar(_this.valueScrollbar, !_this.rotate);
        },


        zoom: function(start, end) {

            var _this = this;

            var categoryAxis = _this.categoryAxis;

            if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
                _this.timeZoom(start, end);
            } else {
                _this.indexZoom(start, end);
            }

            if (isNaN(start)) {
                _this.zoomOutValueAxes();
            }

            var chartCursor = _this.chartCursor;
            if (chartCursor) {
                if (!chartCursor.pan) {
                    chartCursor.hideCursorReal();
                }
            }

            _this.updateLegendValues();
        },


        timeZoom: function(startTime, endTime) {
            var _this = this;
            var maxSelectedTime = _this.maxSelectedTime;
            if (!isNaN(maxSelectedTime)) {
                if (endTime != _this.endTime) {
                    if (endTime - startTime > maxSelectedTime) {
                        startTime = endTime - maxSelectedTime;
                    }
                }

                if (startTime != _this.startTime) {
                    if (endTime - startTime > maxSelectedTime) {
                        endTime = startTime + maxSelectedTime;
                    }
                }
            }

            var minSelectedTime = _this.minSelectedTime;

            if (minSelectedTime > 0 && endTime - startTime < minSelectedTime) {
                var middleTime = Math.round(startTime + (endTime - startTime) / 2);
                var delta = Math.round(minSelectedTime / 2);
                startTime = middleTime - delta;
                endTime = middleTime + delta;
            }

            var chartData = _this.chartData;
            var categoryAxis = _this.categoryAxis;

            if (AmCharts.ifArray(chartData)) {
                if (startTime != _this.startTime || endTime != _this.endTime) {
                    // check whether start and end time is not the same (or the difference is less then the duration of the shortest period)
                    var minDuration = categoryAxis.minDuration();

                    var firstTime = _this.firstTime;
                    var lastTime = _this.lastTime;

                    if (!startTime) {
                        startTime = firstTime;
                        if (!isNaN(maxSelectedTime)) {
                            startTime = lastTime - maxSelectedTime;
                        }
                    }

                    if (!endTime) {
                        endTime = lastTime;
                    }

                    if (startTime > lastTime) {
                        startTime = lastTime;
                    }

                    if (endTime < firstTime) {
                        endTime = firstTime;
                    }

                    if (startTime < firstTime) {
                        startTime = firstTime;
                    }

                    if (endTime > lastTime) {
                        endTime = lastTime;
                    }

                    if (endTime < startTime) {
                        endTime = startTime + minDuration;
                    }

                    if (endTime - startTime < minDuration / 5) {
                        if (endTime < lastTime) {
                            endTime = startTime + minDuration / 5;
                        } else {
                            startTime = endTime - minDuration / 5;
                        }

                    }

                    _this.startTime = startTime;
                    _this.endTime = endTime;

                    var lastIndex = chartData.length - 1;
                    var start = _this.getClosestIndex(chartData, "time", startTime, true, 0, lastIndex);
                    var end = _this.getClosestIndex(chartData, "time", endTime, false, start, lastIndex);

                    categoryAxis.timeZoom(startTime, endTime);
                    categoryAxis.zoom(start, end);

                    _this.start = AmCharts.fitToBounds(start, 0, lastIndex);
                    _this.end = AmCharts.fitToBounds(end, 0, lastIndex);

                    _this.zoomAxesAndGraphs();
                    _this.zoomScrollbar();

                    _this.fixCursor();

                    _this.showZB();
                    _this.syncGrid();
                    _this.updateColumnsDepth();
                    _this.dispatchTimeZoomEvent();                    
                }
            }            
        },


        showZB: function() {
            var _this = this;
            var show;

            var categoryAxis = _this.categoryAxis;
            if (categoryAxis) {
                if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
                    if (_this.startTime > _this.firstTime) {
                        show = true;
                    }

                    if (_this.endTime < _this.lastTime) {
                        show = true;
                    }
                }
            }

            if (_this.start > 0) {
                show = true;
            }

            if (_this.end < _this.chartData.length - 1) {
                show = true;
            }

            var valueAxes = _this.valueAxes;
            if (valueAxes) {                
                var valueAxis = valueAxes[0];                
                if(!isNaN(valueAxis.relativeStart)){
                    if (AmCharts.roundTo(valueAxis.relativeStart, 3) !== 0) {
                        show = true;
                    }
                    if (AmCharts.roundTo(valueAxis.relativeEnd, 3) != 1) {
                        show = true;
                    }
                }
            }

            AmCharts.AmSerialChart.base.showZB.call(_this, show);
        },

        updateAfterValueZoom: function() {
            var _this = this;
            AmCharts.AmSerialChart.base.updateAfterValueZoom.call(_this);
            _this.updateColumnsDepth();
        },


        indexZoom: function(start, end) {
            var _this = this;
            var maxSelectedSeries = _this.maxSelectedSeries;
            var outOfMax = false;

            if (!isNaN(maxSelectedSeries)) {
                if (end != _this.end) {
                    if (end - start > maxSelectedSeries) {
                        start = end - maxSelectedSeries;
                        outOfMax = true;
                    }
                }

                if (start != _this.start) {
                    if (end - start > maxSelectedSeries) {
                        end = start + maxSelectedSeries;
                        outOfMax = true;
                    }
                }
            }
                 
            if(outOfMax){
                var chartScrollbar = _this.chartScrollbar;
                if(chartScrollbar){
                    if(chartScrollbar.dragger){
                        var bbox = chartScrollbar.dragger.getBBox();
                        chartScrollbar.maxWidth = bbox.width;                 
                        chartScrollbar.maxHeight = bbox.height;
                    }
                }
            }

            if (start != _this.start || end != _this.end) {
                var last = _this.chartData.length - 1;

                if (isNaN(start)) {
                    start = 0;

                    if (!isNaN(maxSelectedSeries)) {
                        start = last - maxSelectedSeries;
                    }
                }

                if (isNaN(end)) {
                    end = last;
                }

                if (end < start) {
                    end = start;
                }

                if (end > last) {
                    end = last;
                }

                if (start > last) {
                    start = last - 1;
                }

                if (start < 0) {
                    start = 0;
                }

                _this.start = start;
                _this.end = end;

                _this.categoryAxis.zoom(start, end);
                _this.zoomAxesAndGraphs();

                _this.zoomScrollbar();

                _this.fixCursor();

                if (start !== 0 || end != _this.chartData.length - 1) {
                    _this.showZB(true);
                } else {
                    _this.showZB(false);
                }
                _this.syncGrid();
                _this.updateColumnsDepth();                
                _this.dispatchIndexZoomEvent();                
            }
        },

        updateGraphs: function() {
            var _this = this;
            AmCharts.AmSerialChart.base.updateGraphs.call(_this);

            var graphs = _this.graphs;
            var i;
            for (i = 0; i < graphs.length; i++) {
                var graph = graphs[i];
                graph.columnWidthReal = _this.columnWidth;
                graph.categoryAxis = _this.categoryAxis;

                if (AmCharts.isString(graph.fillToGraph)) {
                    graph.fillToGraph = _this.graphsById[graph.fillToGraph];
                }
            }
        },

        zoomAxesAndGraphs: function() {
            var _this = this;
            AmCharts.AmSerialChart.base.zoomAxesAndGraphs.call(_this);
            _this.updateColumnsDepth();
        },

        updateColumnsDepth: function() {
            var _this = this;

            if (_this.depth3D !== 0 || _this.angle !== 0) {
                var i;
                var graphs = _this.graphs;
                var graph;

                _this.columnsArray = [];

                for (i = 0; i < graphs.length; i++) {
                    graph = graphs[i];

                    var graphColumnsArray = graph.columnsArray;

                    if (graphColumnsArray) {
                        var j;
                        for (j = 0; j < graphColumnsArray.length; j++) {
                            _this.columnsArray.push(graphColumnsArray[j]);
                        }
                    }
                }

                _this.columnsArray.sort(_this.compareDepth);

                var count = _this.columnsArray.length;
                if (count > 0) {
                    var prevSet = _this.columnsSet;

                    var columnsSet = _this.container.set();
                    _this.columnSet.push(columnsSet);

                    for (i = 0; i < _this.columnsArray.length; i++) {
                        columnsSet.push(_this.columnsArray[i].column.set);
                    }

                    if (graph) {
                        columnsSet.translate(graph.x, graph.y);
                    }

                    _this.columnsSet = columnsSet;

                    AmCharts.remove(prevSet);
                }
            }
        },

        compareDepth: function(a, b) {
            if (a.depth > b.depth) {
                return 1;
            } else {
                return -1;
            }
        },

        zoomScrollbar: function() {
            var _this = this;
            var chartScrollbar = _this.chartScrollbar;
            var categoryAxis = _this.categoryAxis;
            if (chartScrollbar) {

                if (!_this.zoomedByScrollbar) {
                    var dragger = chartScrollbar.dragger;
                    if (dragger) {
                        dragger.stop();
                    }
                }

                _this.zoomedByScrollbar = false;

                if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
                    chartScrollbar.timeZoom(_this.startTime, _this.endTime);
                } else {
                    chartScrollbar.zoom(_this.start, _this.end);
                }
            }
            _this.zoomValueScrollbar(_this.valueScrollbar);
        },

        updateTrendLines: function() {
            var _this = this;

            var trendLines = _this.trendLines;
            var i;
            for (i = 0; i < trendLines.length; i++) {
                var trendLine = trendLines[i];
                trendLine = AmCharts.processObject(trendLine, AmCharts.TrendLine, _this.theme);
                trendLines[i] = trendLine;
                trendLine.chart = this;

                if (!trendLine.id) {
                    trendLine.id = "trendLineAuto" + i + "_" + new Date().getTime();
                }

                if (AmCharts.isString(trendLine.valueAxis)) {
                    trendLine.valueAxis = _this.getValueAxisById(trendLine.valueAxis);
                }

                if (!trendLine.valueAxis) {
                    trendLine.valueAxis = _this.valueAxes[0];
                }
                trendLine.categoryAxis = _this.categoryAxis;
            }
        },


        countColumns: function() {
            var _this = this;
            var count = 0;

            var axisCount = _this.valueAxes.length;
            var graphCount = _this.graphs.length;
            var graph;
            var axis;
            var counted = false;

            var j;
            var i;
            for (i = 0; i < axisCount; i++) {
                axis = _this.valueAxes[i];
                var stackType = axis.stackType;
                var k = 0;
                if (stackType == "100%" || stackType == "regular") {
                    counted = false;
                    for (j = 0; j < graphCount; j++) {
                        graph = _this.graphs[j];
                        graph.tcc = 1;
                        if (graph.valueAxis == axis && graph.type == "column") {
                            if (!counted && graph.stackable) {
                                count++;
                                counted = true;
                            }

                            if ((!graph.stackable && graph.clustered) || (graph.newStack && k !== 0)) {
                                count++;
                            }

                            graph.columnIndex = count - 1;

                            if (!graph.clustered) {
                                graph.columnIndex = 0;
                            }
                            k++;
                        }
                    }
                }

                if (stackType == "none" || stackType == "3d") {
                    var atLeastOne = false;
                    for (j = 0; j < graphCount; j++) {
                        graph = _this.graphs[j];
                        if (graph.valueAxis == axis && graph.type == "column") {
                            if (graph.clustered) {
                                graph.tcc = 1;
                                if (graph.newStack) {
                                    count = 0;
                                }
                                if (!graph.hidden) {
                                    graph.columnIndex = count;
                                    count++;
                                }
                            } else {
                                if (!graph.hidden) {
                                    // if this is the last and not yet counted
                                    atLeastOne = true;
                                    graph.tcc = 1;
                                    graph.columnIndex = 0;
                                }
                            }
                        }
                    }
                    if (atLeastOne && count === 0) {
                        count = 1;
                    }
                }
                if (stackType == "3d") {
                    var realCount = 1;
                    for (i = 0; i < graphCount; i++) {
                        graph = _this.graphs[i];
                        if (graph.newStack) {
                            realCount++;
                        }
                        graph.depthCount = realCount;
                        graph.tcc = count;
                    }
                    count = realCount;
                }
            }
            return count;
        },


        parseData: function() {
            var _this = this;
            AmCharts.AmSerialChart.base.parseData.call(_this);
            _this.parseSerialData(_this.dataProvider);
        },

        getCategoryIndexByValue: function(value) {
            var _this = this;
            var chartData = _this.chartData;
            var i;
            for (i = 0; i < chartData.length; i++) {
                if (chartData[i].category == value) {
                    return i;
                }
            }
        },



        handleScrollbarZoom: function(event) {
            var _this = this;
            _this.zoomedByScrollbar = true;
            _this.zoom(event.start, event.end);
        },

        dispatchTimeZoomEvent: function() {
            var _this = this;
            if (_this.drawGraphs) {
                if (_this.prevStartTime != _this.startTime || _this.prevEndTime != _this.endTime) {
                    var e = {};
                    e.type = "zoomed";
                    e.startDate = new Date(_this.startTime);
                    e.endDate = new Date(_this.endTime);
                    e.startIndex = _this.start;
                    e.endIndex = _this.end;
                    _this.startIndex = _this.start;
                    _this.endIndex = _this.end;
                    _this.startDate = e.startDate;
                    _this.endDate = e.endDate;

                    _this.prevStartTime = _this.startTime;
                    _this.prevEndTime = _this.endTime;
                    var categoryAxis = _this.categoryAxis;

                    var minPeriod = AmCharts.extractPeriod(categoryAxis.minPeriod).period;
                    var dateFormat = categoryAxis.dateFormatsObject[minPeriod];

                    e.startValue = AmCharts.formatDate(e.startDate, dateFormat, _this);
                    e.endValue = AmCharts.formatDate(e.endDate, dateFormat, _this);
                    e.chart = _this;
                    e.target = _this;
                    _this.fire(e);
                }
            }
        },

        dispatchIndexZoomEvent: function() {
            var _this = this;
            if (_this.drawGraphs) {
                if (_this.prevStartIndex != _this.start || _this.prevEndIndex != _this.end) {
                    _this.startIndex = _this.start;
                    _this.endIndex = _this.end;
                    var chartData = _this.chartData;
                    if (AmCharts.ifArray(chartData)) {
                        if (!isNaN(_this.start) && !isNaN(_this.end)) {
                            var e = {};
                            e.chart = _this;
                            e.target = _this;
                            e.type = "zoomed";
                            e.startIndex = _this.start;
                            e.endIndex = _this.end;
                            e.startValue = chartData[_this.start].category;
                            e.endValue = chartData[_this.end].category;

                            if (_this.categoryAxis.parseDates) {
                                _this.startTime = chartData[_this.start].time;
                                _this.endTime = chartData[_this.end].time;

                                e.startDate = new Date(_this.startTime);
                                e.endDate = new Date(_this.endTime);
                            }
                            _this.prevStartIndex = _this.start;
                            _this.prevEndIndex = _this.end;

                            _this.fire(e);
                        }
                    }
                }
            }
        },

        updateLegendValues: function() {
            var _this = this;

            if (_this.legend) {
                _this.legend.updateValues();
            }
        },


        getClosestIndex: function(ac, field, value, first, start, end) {
            var _this = this;
            if (start < 0) {
                start = 0;
            }

            if (end > ac.length - 1) {
                end = ac.length - 1;
            }

            // middle index
            var index = start + Math.round((end - start) / 2);
            // middle value
            var valueAtIndex = ac[index][field];

            if (value == valueAtIndex) {
                return index;
            }

            if (end - start <= 1) {
                if (first) {
                    return start;
                } else {
                    var valueAtStart = ac[start][field];
                    var valueAtEnd = ac[end][field];

                    if (Math.abs(valueAtStart - value) < Math.abs(valueAtEnd - value)) {
                        return start;
                    } else {
                        return end;
                    }
                }
            }

            if (value == valueAtIndex) {
                return index;
            }
            // go to left
            else if (value < valueAtIndex) {
                return _this.getClosestIndex(ac, field, value, first, start, index);
            }
            // go to right
            else {
                return _this.getClosestIndex(ac, field, value, first, index, end);
            }
        },

        zoomToIndexes: function(start, end) {
            var _this = this;
            var chartData = _this.chartData;
            if (chartData) {
                var length = chartData.length;
                if (length > 0) {
                    if (start < 0) {
                        start = 0;
                    }

                    if (end > length - 1) {
                        end = length - 1;
                    }

                    var categoryAxis = _this.categoryAxis;
                    if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
                        _this.zoom(chartData[start].time, _this.getEndTime(chartData[end].time));
                    } else {
                        _this.zoom(start, end);
                    }
                }
            }
        },

        zoomToDates: function(start, end) {
            var _this = this;
            var chartData = _this.chartData;

            if (chartData) {
                if (_this.categoryAxis.equalSpacing) {
                    var startIndex = _this.getClosestIndex(chartData, "time", start.getTime(), true, 0, chartData.length);
                    end = AmCharts.resetDateToMin(end, _this.categoryAxis.minPeriod, 1); // 3.4.3 to solve extra date when zooming
                    var endIndex = _this.getClosestIndex(chartData, "time", end.getTime(), false, 0, chartData.length);
                    _this.zoom(startIndex, endIndex);
                } else {
                    _this.zoom(start.getTime(), end.getTime());
                }
            }
        },

        zoomToCategoryValues: function(start, end) {
            var _this = this;
            if (_this.chartData) {
                _this.zoom(_this.getCategoryIndexByValue(start), _this.getCategoryIndexByValue(end));
            }
        },

        formatPeriodString: function(text, graph) {

            var _this = this;

            if (graph) {

                graph.periodDataItem = {};
                graph.periodPercentDataItem = {};

                var keys = ["value", "open", "low", "high", "close"];
                var keysExt = ["value", "open", "low", "high", "close", "average", "sum", "count"];

                var valueAxis = graph.valueAxis;
                var chartData = _this.chartData;

                var numberFormatter = graph.numberFormatter;
                if (!numberFormatter) {
                    numberFormatter = _this.nf;
                }

                for (var k = 0; k < keys.length; k++) {
                    var key = keys[k];
                    var sum = 0;
                    var count = 0;
                    var psum = 0;
                    var pcount = 0;
                    var open;
                    var close;
                    var low;
                    var high;
                    var average;
                    var popen;
                    var pclose;
                    var plow;
                    var phigh;
                    var paverage;

                    for (var i = _this.start; i <= _this.end; i++) {
                        var serialDataItem = chartData[i];
                        if (serialDataItem) {
                            var graphDataItem = serialDataItem.axes[valueAxis.id].graphs[graph.id];
                            if (graphDataItem) {

                                if (graphDataItem.values) {

                                    var value = graphDataItem.values[key];
                                    var xx = serialDataItem.x.categoryAxis;
                                   
                                    if (_this.rotate) {
                                        if (xx < 0 || xx > graphDataItem.graph.height) {
                                            value = NaN;
                                        }
                                    } else {
                                        if (xx < 0 || xx > graphDataItem.graph.width) {
                                            value = NaN;
                                        }
                                    }

                                    if (!isNaN(value)) {

                                        if (isNaN(open)) {
                                            open = value;
                                        }

                                        close = value;

                                        if (isNaN(low) || low > value) {
                                            low = value;
                                        }

                                        if (isNaN(high) || high < value) {
                                            high = value;
                                        }

                                        var decCountSum = AmCharts.getDecimals(sum);
                                        var decCountValue = AmCharts.getDecimals(value);

                                        sum += value;

                                        sum = AmCharts.roundTo(sum, Math.max(decCountSum, decCountValue));

                                        count++;

                                        average = sum / count;
                                    }
                                }

                                if (graphDataItem.percents) {
                                    var percents = graphDataItem.percents[key];
                                    if (!isNaN(percents)) {

                                        if (isNaN(popen)) {
                                            popen = percents;
                                        }

                                        pclose = percents;

                                        if (isNaN(plow) || plow > percents) {
                                            plow = percents;
                                        }

                                        if (isNaN(phigh) || phigh < percents) {
                                            phigh = percents;
                                        }
                                        
                                        var decCountSumP = AmCharts.getDecimals(psum);
                                        var decCountValueP = AmCharts.getDecimals(percents);

                                        psum += percents;

                                        psum = AmCharts.roundTo(psum, Math.max(decCountSumP, decCountValueP));

                                        pcount++;

                                        paverage = psum / pcount;                                        
                                    }
                                }
                            }
                        }
                    }

                    var data = {
                        open: open,
                        close: close,
                        high: high,
                        low: low,
                        average: average,
                        sum: sum,
                        count: count
                    };
                    var pdata = {
                        open: popen,
                        close: pclose,
                        high: phigh,
                        low: plow,
                        average: paverage,
                        sum: psum,
                        count: pcount
                    };

                    text = AmCharts.formatValue(text, data, keysExt, numberFormatter, key + "\\.", _this.usePrefixes, _this.prefixesOfSmallNumbers, _this.prefixesOfBigNumbers);
                    text = AmCharts.formatValue(text, pdata, keysExt, _this.pf, "percents\\." + key + "\\.");

                    graph.periodDataItem[key] = data;
                    graph.periodPercentDataItem[key] = pdata;
                }
            }

            text = AmCharts.cleanFromEmpty(text);

            return text;
        },


        formatString: function(text, dItem, noFixBrakes) {
            var _this = this;

            if (dItem) {
                var graph = dItem.graph;
                if (text !== undefined) {
                    if (text.indexOf("[[category]]") != -1) {
                        var category = dItem.serialDataItem.category;
                        var categoryAxis = _this.categoryAxis;

                        if (categoryAxis.parseDates) {
                            var dateFormat = _this.balloonDateFormat;
                            var chartCursor = _this.chartCursor;
                            if (chartCursor) {
                                if (chartCursor.categoryBalloonDateFormat) {
                                    dateFormat = chartCursor.categoryBalloonDateFormat;
                                }
                            }

                            var formattedDate = AmCharts.formatDate(category, dateFormat, _this);

                            if (formattedDate.indexOf("fff") != -1) {
                                formattedDate = AmCharts.formatMilliseconds(formattedDate, category);
                            }
                            category = formattedDate;

                        }
                        text = text.replace(/\[\[category\]\]/g, String(category.replace("$", "$$$")));
                    }

                    var numberFormatter = graph.numberFormatter;

                    if (!numberFormatter) {
                        numberFormatter = _this.nf;
                    }

                    var valueAxis = dItem.graph.valueAxis;
                    var duration = valueAxis.duration;

                    if (duration && !isNaN(dItem.values.value)) {
                        var fDuration = AmCharts.formatDuration(dItem.values.value, duration, "", valueAxis.durationUnits, valueAxis.maxInterval, numberFormatter);
                        var regExp = new RegExp("\\[\\[value\\]\\]", "g");
                        text = text.replace(regExp, fDuration);
                    }

                    if (valueAxis.type == "date") {
                        var fDate = AmCharts.formatDate(new Date(dItem.values.value), graph.dateFormat, _this);
                        var regExp2 = new RegExp("\\[\\[value\\]\\]", "g");
                        text = text.replace(regExp2, fDate);

                        fDate = AmCharts.formatDate(new Date(dItem.values.open), graph.dateFormat, _this);
                        regExp2 = new RegExp("\\[\\[open\\]\\]", "g");
                        text = text.replace(regExp2, fDate);
                    }

                    var keys = ["value", "open", "low", "high", "close", "total"];
                    var percentFormatter = _this.pf;

                    text = AmCharts.formatValue(text, dItem.percents, keys, percentFormatter, "percents\\.");
                    text = AmCharts.formatValue(text, dItem.values, keys, numberFormatter, "", _this.usePrefixes, _this.prefixesOfSmallNumbers, _this.prefixesOfBigNumbers);
                    text = AmCharts.formatValue(text, dItem.values, ["percents"], percentFormatter);

                    if (text.indexOf("[[") != -1) {
                        text = AmCharts.formatDataContextValue(text, dItem.dataContext);
                    }

                    if (text.indexOf("[[") != -1 && dItem.graph.customData) {
                        text = AmCharts.formatDataContextValue(text, dItem.graph.customData);
                    }

                    text = AmCharts.AmSerialChart.base.formatString.call(_this, text, dItem, noFixBrakes);
                }
                return text;
            }
        },

        updateChartCursor: function() {
            var _this = this;
            AmCharts.AmSerialChart.base.updateChartCursor.call(_this);
            var chartCursor = _this.chartCursor;
            var categoryAxis = _this.categoryAxis;
            if (chartCursor) {

                var categoryBalloonAlpha = chartCursor.categoryBalloonAlpha;
                var balloonColor = chartCursor.categoryBalloonColor;
                var color = chartCursor.color;

                if (balloonColor === undefined) {
                    balloonColor = chartCursor.cursorColor;
                }
                var valueZoomable = chartCursor.valueZoomable;
                var zoomable = chartCursor.zoomable;

                var valueLineEnabled = chartCursor.valueLineEnabled;
                if (_this.rotate) {
                    chartCursor.vLineEnabled = valueLineEnabled;
                    chartCursor.hZoomEnabled = valueZoomable;
                    chartCursor.vZoomEnabled = zoomable;
                } else {
                    chartCursor.hLineEnabled = valueLineEnabled;
                    chartCursor.vZoomEnabled = valueZoomable;
                    chartCursor.hZoomEnabled = zoomable;
                }

                var balloon;
                var valueAxis;
                if (chartCursor.valueLineBalloonEnabled) {
                    for (var i = 0; i < _this.valueAxes.length; i++) {
                        valueAxis = _this.valueAxes[i];
                        balloon = valueAxis.balloon;
                        if (!balloon) {
                            balloon = {};
                        }

                        balloon = AmCharts.extend(balloon, _this.balloon, true);

                        balloon.fillColor = balloonColor;
                        balloon.balloonColor = balloonColor;
                        balloon.fillAlpha = categoryBalloonAlpha;
                        balloon.borderColor = balloonColor;
                        balloon.color = color;
                        valueAxis.balloon = balloon;
                    }
                } else {
                    for (var j = 0; j < _this.valueAxes.length; j++) {
                        valueAxis = _this.valueAxes[j];
                        if (valueAxis.balloon) {
                            valueAxis.balloon = null;
                        }
                    }
                }

                if (categoryAxis) {
                    categoryAxis.balloonTextFunction = chartCursor.categoryBalloonFunction;
                    chartCursor.categoryLineAxis = categoryAxis;
                    categoryAxis.balloonText = chartCursor.categoryBalloonText;
                    if (chartCursor.categoryBalloonEnabled) {
                        balloon = categoryAxis.balloon;
                        if (!balloon) {
                            balloon = {};
                        }
                        balloon = AmCharts.extend(balloon, _this.balloon, true);

                        // TODO CLASS NAME
                        balloon.fillColor = balloonColor;
                        balloon.balloonColor = balloonColor;
                        balloon.fillAlpha = categoryBalloonAlpha;
                        balloon.borderColor = balloonColor;
                        balloon.color = color;

                        categoryAxis.balloon = balloon;
                    }
                    if (categoryAxis.balloon) {
                        categoryAxis.balloon.enabled = chartCursor.categoryBalloonEnabled;
                    }
                }
            }
        },

        addChartScrollbar: function(chartScrollbar) {
            var _this = this;
            AmCharts.callMethod("destroy", [_this.chartScrollbar]);

            if (chartScrollbar) {
                chartScrollbar.chart = _this;
                _this.listenTo(chartScrollbar, "zoomed", _this.handleScrollbarZoom);
            }

            if (_this.rotate) {
                if (chartScrollbar.width === undefined) {
                    chartScrollbar.width = chartScrollbar.scrollbarHeight;
                }
            } else {
                if (chartScrollbar.height === undefined) {
                    chartScrollbar.height = chartScrollbar.scrollbarHeight;
                }
            }
            chartScrollbar.gridAxis = _this.categoryAxis;
            _this.chartScrollbar = chartScrollbar;
        },

        addValueScrollbar: function(chartScrollbar) {
            var _this = this;
            AmCharts.callMethod("destroy", [_this.valueScrollbar]);

            if (chartScrollbar) {
                chartScrollbar.chart = _this;
                _this.listenTo(chartScrollbar, "zoomed", _this.handleScrollbarValueZoom);
                _this.listenTo(chartScrollbar, "zoomStarted", _this.handleCursorZoomStarted); // not mistake
            }

            var scrollbarHeight = chartScrollbar.scrollbarHeight;
            if (!_this.rotate) {
                if (chartScrollbar.width === undefined) {
                    chartScrollbar.width = scrollbarHeight;
                }
            } else {
                if (chartScrollbar.height === undefined) {
                    chartScrollbar.height = scrollbarHeight;
                }
            }
            if (!chartScrollbar.gridAxis) {
                chartScrollbar.gridAxis = _this.valueAxes[0];
            }
            chartScrollbar.valueAxes = _this.valueAxes;
            _this.valueScrollbar = chartScrollbar;
        },

        removeChartScrollbar: function() {
            var _this = this;
            AmCharts.callMethod("destroy", [_this.chartScrollbar]);
            _this.chartScrollbar = null;
        },

        removeValueScrollbar: function() {
            var _this = this;
            AmCharts.callMethod("destroy", [_this.valueScrollbar]);
            _this.valueScrollbar = null;
        },

        handleReleaseOutside: function(e) {
            var _this = this;
            AmCharts.AmSerialChart.base.handleReleaseOutside.call(_this, e);
            AmCharts.callMethod("handleReleaseOutside", [_this.chartScrollbar, _this.valueScrollbar]);
        },

        update: function() {
            var _this = this;

            AmCharts.AmSerialChart.base.update.call(_this);

            if (_this.chartScrollbar) {
                if (_this.chartScrollbar.update) {
                    _this.chartScrollbar.update();
                }
            }

            if (_this.valueScrollbar) {
                if (_this.valueScrollbar.update) {
                    _this.valueScrollbar.update();
                }
            }
        },

        processScrollbars: function() {
            var _this = this;
            AmCharts.AmSerialChart.base.processScrollbars.call(_this);

            var valueScrollbar = _this.valueScrollbar;
            if (valueScrollbar) {
                valueScrollbar = AmCharts.processObject(valueScrollbar, AmCharts.ChartScrollbar, _this.theme);
                valueScrollbar.id = "valueScrollbar";
                _this.addValueScrollbar(valueScrollbar);
            }
        },


        //// value zooming ////////////////////////////////////////////////////////////////////////////////////
        handleValueAxisZoom: function(event) {
            var _this = this;            
            _this.handleValueAxisZoomReal(event, _this.valueAxes);
        },

        zoomOut: function() {
            var _this = this;
            AmCharts.AmSerialChart.base.zoomOut.call(_this);
            _this.zoom();
            _this.syncGrid();
        },


        getNextItem: function(graphDataItem) {

            var _this = this;
            var index = graphDataItem.index;
            var chartData = _this.chartData;
            var graph = graphDataItem.graph;

            if (index + 1 < chartData.length) {
                for (var n = index + 1; n < chartData.length; n++) {
                    var nextSerialDataItem = chartData[n];
                    if (nextSerialDataItem) {
                        graphDataItem = nextSerialDataItem.axes[graph.valueAxis.id].graphs[graph.id];
                        if (!isNaN(graphDataItem.y)) {
                            return graphDataItem;
                        }
                    }
                }
            }
        },

        /// CURSOR HANDLERS
        handleCursorZoomReal: function(startX, endX, startY, endY, event) {
            var _this = this;

            var categoryStart;
            var categoryEnd;
            var chartCursor = event.target;
            var start;
            var end;

            if (_this.rotate) {
                if (!isNaN(startX) && !isNaN(endX)) {
                    if (_this.relativeZoomValueAxes(_this.valueAxes, startX, endX)) {
                        _this.updateAfterValueZoom();
                    }

                }
                categoryStart = startY;
                categoryEnd = endY;

                if (chartCursor.vZoomEnabled) {
                    start = event.start;
                    end = event.end;
                }
            } else {
                if (!isNaN(startY) && !isNaN(endY)) {
                    if (_this.relativeZoomValueAxes(_this.valueAxes, startY, endY)) {
                        _this.updateAfterValueZoom();
                    }
                }
                categoryStart = startX;
                categoryEnd = endX;

                if (chartCursor.hZoomEnabled) {
                    start = event.start;
                    end = event.end;
                }
            }

            if (!isNaN(start) && !isNaN(end)) {
                var categoryAxis = _this.categoryAxis;
                if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
                    _this.zoomToDates(new Date(start), new Date(end));
                } else {
                    _this.zoomToIndexes(start, end);
                }
            }
        },


        handleCursorZoomStarted: function() {
            var _this = this;
            var valueAxes = _this.valueAxes;

            if (valueAxes) {
                var valueAxis = valueAxes[0];
                var start = valueAxis.relativeStart;
                var end = valueAxis.relativeEnd;

                if (valueAxis.reversed) {
                    start = 1 - valueAxis.relativeEnd;
                    end = 1 - valueAxis.relativeStart;
                }

                if (_this.rotate) {
                    _this.startX0 = start;
                    _this.endX0 = end;
                } else {
                    _this.startY0 = start;
                    _this.endY0 = end;
                }
            }
            var categoryAxis = _this.categoryAxis;
            if (categoryAxis) {
                _this.start0 = _this.start;
                _this.end0 = _this.end;
                _this.startTime0 = _this.startTime;
                _this.endTime0 = _this.endTime;
            }
        },

        fixCursor: function() {
            var _this = this;
            if (_this.chartCursor) {
                _this.chartCursor.fixPosition();
            }
            _this.prevCursorItem = null;
        },

        handleCursorMove: function(event) {
            var _this = this;
            AmCharts.AmSerialChart.base.handleCursorMove.call(_this, event);

            var cursor = event.target;
            var categoryAxis = _this.categoryAxis;

            if (event.panning) {
                _this.handleCursorHide(event);
            } else if (_this.chartData && !cursor.isHidden) {
                var graphs = _this.graphs;
                if (graphs) {
                    var coordinate;
                    if (_this.rotate) {
                        coordinate = event.y;
                    } else {
                        coordinate = event.x;
                    }
                    var serialDataItem;

                    var index = categoryAxis.xToIndex(coordinate);

                    var chartData = _this.chartData;

                    serialDataItem = chartData[index];


                    if (serialDataItem) {
                        var i;
                        var graph;
                        var graphDataItem;
                        var valueAxisId;
                        var mostCloseGraph;


                        // find most close
                        if (cursor.oneBalloonOnly && cursor.valueBalloonsEnabled) {
                            var distance = Infinity;
                            for (i = 0; i < graphs.length; i++) {
                                graph = graphs[i];
                                var balloon = graph.balloon;

                                if (balloon.enabled && graph.showBalloon && !graph.hidden) {

                                    valueAxisId = graph.valueAxis.id;
                                    graphDataItem = serialDataItem.axes[valueAxisId].graphs[graph.id];

                                    if (cursor.showNextAvailable) {
                                        if (isNaN(graphDataItem.y)) {
                                            graphDataItem = _this.getNextItem(graphDataItem);

                                            if(!graphDataItem){
                                                continue;
                                            }
                                        }
                                    }                                    

                                    var balloonCoordinate = graphDataItem.y;

                                    if (graph.showBalloonAt == "top") {
                                        balloonCoordinate = 0;
                                    }
                                    if (graph.showBalloonAt == "bottom") {
                                        balloonCoordinate = _this.height;
                                    }

                                    var mouseX = cursor.mouseX;
                                    var mouseY = cursor.mouseY;
                                    var dist;

                                    if (_this.rotate) {
                                        dist = Math.abs(mouseX - balloonCoordinate);
                                        if (dist < distance) {
                                            distance = dist;
                                            mostCloseGraph = graph;
                                        }
                                    } else {
                                        dist = Math.abs(mouseY - balloonCoordinate);
                                        if (dist < distance) {
                                            distance = dist;
                                            mostCloseGraph = graph;
                                        }
                                    }
                                }
                            }

                            cursor.mostCloseGraph = mostCloseGraph;
                        }

                        if (_this.prevCursorItem != serialDataItem || mostCloseGraph != _this.prevMostCloseGraph) {

                            var balloons = [];
                            for (i = 0; i < graphs.length; i++) {
                                graph = graphs[i];
                                valueAxisId = graph.valueAxis.id;
                                graphDataItem = serialDataItem.axes[valueAxisId].graphs[graph.id];

                                if (cursor.showNextAvailable) {
                                    if (isNaN(graphDataItem.y)) {
                                        graphDataItem = _this.getNextItem(graphDataItem);
                                    }
                                }

                                if (mostCloseGraph) {
                                    if (graph != mostCloseGraph) {
                                        graph.showGraphBalloon(graphDataItem, cursor.pointer, false, cursor.graphBulletSize, cursor.graphBulletAlpha);
                                        graph.balloon.hide(0);
                                        continue;
                                    }
                                }

                                if (cursor.valueBalloonsEnabled) {
                                    graph.balloon.showBullet = cursor.bulletsEnabled;
                                    graph.balloon.bulletSize = cursor.bulletSize / 2;

                                    if (!event.hideBalloons) {

                                        graph.showGraphBalloon(graphDataItem, cursor.pointer, false, cursor.graphBulletSize, cursor.graphBulletAlpha);

                                        if (graph.balloon.set) {
                                            balloons.push({
                                                balloon: graph.balloon,
                                                y: graph.balloon.pointToY
                                            });
                                        }
                                    }
                                } else {
                                    graph.currentDataItem = graphDataItem;
                                    graph.resizeBullet(graphDataItem, cursor.graphBulletSize, cursor.graphBulletAlpha);
                                }
                            }

                            if (cursor.avoidBalloonOverlapping) {
                                _this.arrangeBalloons(balloons);
                            }

                            _this.prevCursorItem = serialDataItem;
                        }

                        _this.prevMostCloseGraph = mostCloseGraph;
                    }
                }

                categoryAxis.showBalloon(event.x, event.y, cursor.categoryBalloonDateFormat, event.skip);

                _this.updateLegendValues();
            }
        },


        handleCursorHide: function(event) {
            var _this = this;
            AmCharts.AmSerialChart.base.handleCursorHide.call(_this, event);
            var categoryAxis = _this.categoryAxis;
            _this.prevCursorItem = null;
            _this.updateLegendValues();
            if (categoryAxis) {
                categoryAxis.hideBalloon();
            }

            var graphs = _this.graphs;
            var i;
            for (i = 0; i < graphs.length; i++) {
                var graph = graphs[i];
                graph.currentDataItem = null;
            }
        },

        handleCursorPanning: function(event) {
            var _this = this;
            var cursor = event.target;

            // VALUE AXES
            var newStart;
            var newEnd;
            var deltaX = event.deltaX;
            var deltaY = event.deltaY;

            var delta2X = event.delta2X;
            var delta2Y = event.delta2Y;

            var limitPan = false;

            if (_this.rotate) {
                if (isNaN(delta2X)) {
                    delta2X = deltaX;
                    limitPan = true;
                }

                var endX0 = _this.endX0;
                var startX0 = _this.startX0;

                var initialDeltaX = endX0 - startX0;
                var newDeltaX = initialDeltaX * deltaX;
                var newDelta2X = initialDeltaX * delta2X;

                var newStartX = startX0 - newDeltaX;
                var newEndX = endX0 - newDelta2X;

                var limitX = initialDeltaX;
                if (!limitPan) {
                    limitX = 0;
                }

                newStart = AmCharts.fitToBounds(newStartX, 0, 1 - limitX);
                newEnd = AmCharts.fitToBounds(newEndX, limitX, 1);
            } else {

                if (isNaN(delta2Y)) {
                    delta2Y = deltaY;
                    limitPan = true;
                }

                var endY0 = _this.endY0;
                var startY0 = _this.startY0;
                var initialDeltaY = endY0 - startY0;
                var newDeltaY = initialDeltaY * deltaY;
                var newDelta2Y = initialDeltaY * delta2Y;

                var newStartY = startY0 + newDelta2Y;
                var newEndY = endY0 + newDeltaY;

                var limitY = initialDeltaY;
                if (!limitPan) {
                    limitY = 0;
                }

                newStart = AmCharts.fitToBounds(newStartY, 0, 1 - limitY);
                newEnd = AmCharts.fitToBounds(newEndY, limitY, 1);
            }

            var valueZoomed;
            if (cursor.valueZoomable) {
                valueZoomed = _this.relativeZoomValueAxes(_this.valueAxes, newStart, newEnd);
            }

            var categoryZoomed;

            // CATEGORY AXES
            var categoryAxis = _this.categoryAxis;

            var delta;
            var delta2;
            if (_this.rotate) {
                delta = deltaY;
                delta2 = delta2Y;
            } else {
                delta = deltaX;
                delta2 = delta2X;
            }

            limitPan = false;
            if (isNaN(delta2)) {
                delta2 = delta;
                limitPan = true;
            }

            if (cursor.zoomable) {
                if (Math.abs(delta) > 0 || Math.abs(delta2) > 0) {
                    // time zoom is smooth
                    if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {

                        var startTime0 = _this.startTime0;
                        var endTime0 = _this.endTime0;
                        var fullDuration = endTime0 - startTime0;

                        var deltaTime = fullDuration * delta;
                        var deltaTime2 = fullDuration * delta2;
                        var firstTime = _this.firstTime;
                        var lastTime = _this.lastTime;

                        var limitTime = fullDuration;
                        if (!limitPan) {
                            limitTime = 0;
                        }

                        var newStartTime = Math.round(AmCharts.fitToBounds(startTime0 - deltaTime, firstTime, lastTime - limitTime));
                        var newEndTime = Math.round(AmCharts.fitToBounds(endTime0 - deltaTime2, firstTime + limitTime, lastTime));

                        if (_this.startTime != newStartTime || _this.endTime != newEndTime) {
                            // dispatch zoomed event to maintain 3.17 behavior
                            var ev = {
                                chart: _this,
                                target: cursor,
                                type: "zoomed",
                                start: newStartTime,
                                end: newEndTime
                            };
                            _this.skipZoomed = true;
                            cursor.fire(ev);
                            _this.zoom(newStartTime, newEndTime);
                            categoryZoomed = true;
                        }
                    }
                    // category zoom
                    else {
                        var start0 = _this.start0;
                        var end0 = _this.end0;
                        var difference = end0 - start0;
                        var deltaIndex = Math.round(difference * delta);
                        var deltaIndex2 = Math.round(difference * delta2);

                        var dataCount = _this.chartData.length - 1;

                        var limitDifference = difference;
                        if (!limitPan) {
                            limitDifference = 0;
                        }

                        newStart = AmCharts.fitToBounds(start0 - deltaIndex, 0, dataCount - limitDifference);
                        newEnd = AmCharts.fitToBounds(end0 - deltaIndex2, limitDifference, dataCount);

                        if (_this.start != newStart || _this.end != newEnd) {

                            // dispatch zoomed event to maintain 3.17 behavior
                            _this.skipZoomed = true;
                            cursor.fire({
                                chart: _this,
                                target: cursor,
                                type: "zoomed",
                                start: newStart,
                                end: newEnd
                            });

                            _this.zoom(newStart, newEnd);
                            categoryZoomed = true;
                        }
                    }
                }
            }

            if (!categoryZoomed && valueZoomed) {
                _this.updateAfterValueZoom();
            }
        },
        // END OF CURSOR HANDLERS

        arrangeBalloons: function(balloons) {
            var _this = this;
            var bottom = _this.plotAreaHeight;

            balloons.sort(_this.compareY);
            var i;
            var balloon;
            var bPrevious;
            var plotAreaWidth = _this.plotAreaWidth;
            var count = balloons.length;

            for (i = 0; i < count; i++) {
                balloon = balloons[i].balloon;
                balloon.setBounds(0, 0, plotAreaWidth, bottom);
                balloon.restorePrevious();
                balloon.draw();
                bottom = balloon.yPos - 3;
            }

            balloons.reverse();

            for (i = 0; i < count; i++) {
                balloon = balloons[i].balloon;
                var b = balloon.bottom;
                var balloonHeight = balloon.bottom - balloon.yPos;

                if (i > 0) {
                    if (b - balloonHeight < bPrevious + 3) {
                        balloon.setBounds(0, bPrevious + 3, plotAreaWidth, bPrevious + balloonHeight + 3);
                        balloon.restorePrevious();
                        balloon.draw();
                    }
                }
                if (balloon.set) {
                    balloon.set.show();
                }
                bPrevious = balloon.bottom;
            }
        },


        compareY: function(a, b) {
            if (a.y < b.y) {
                return 1;
            } else {
                return -1;
            }
        }

    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.Cuboid = AmCharts.Class({
        construct: function(container, width, height, dx, dy, colors, alpha, bwidth, bcolor, balpha, gradientRotation, cornerRadius, rotate, dashLength, pattern, topRadius, bcn) {
            var _this = this;
            _this.set = container.set();
            _this.container = container;
            _this.h = Math.round(height);
            _this.w = Math.round(width);
            _this.dx = dx;
            _this.dy = dy;
            _this.colors = colors;
            _this.alpha = alpha;
            _this.bwidth = bwidth;
            _this.bcolor = bcolor;
            _this.balpha = balpha;
            _this.dashLength = dashLength;
            _this.topRadius = topRadius;
            _this.pattern = pattern;
            _this.rotate = rotate;
            _this.bcn = bcn;
            if (rotate) {
                if (width < 0 && gradientRotation === 0) {
                    gradientRotation = 180;
                }
            } else {
                if (height < 0) {
                    if (gradientRotation == 270) {
                        gradientRotation = 90;
                    }
                }
            }
            _this.gradientRotation = gradientRotation;

            if (dx === 0 && dy === 0) {
                _this.cornerRadius = cornerRadius;
            }
            _this.draw();
        },

        draw: function() {
            var _this = this;
            var set = _this.set;
            set.clear();

            var container = _this.container;
            var chart = container.chart;

            var w = _this.w;
            var h = _this.h;
            var dx = _this.dx;
            var dy = _this.dy;
            var colors = _this.colors;
            var alpha = _this.alpha;
            var bwidth = _this.bwidth;
            var bcolor = _this.bcolor;
            var balpha = _this.balpha;
            var gradientRotation = _this.gradientRotation;
            var cornerRadius = _this.cornerRadius;
            var dashLength = _this.dashLength;
            var pattern = _this.pattern;
            var topRadius = _this.topRadius;
            var bcn = _this.bcn;

            // bot
            var firstColor = colors;
            var lastColor = colors;

            if (typeof(colors) == "object") {
                firstColor = colors[0];
                lastColor = colors[colors.length - 1];
            }

            var bottom;
            var back;
            var backBorders;
            var lside;
            var rside;
            var rsideBorders;
            var top;
            var topBorders;
            var bottomBorders;

            // if dx or dx > 0, draw other sides
            var tempAlpha = alpha;
            if (pattern) {
                alpha = 0;
            }

            var brX;
            var brY;
            var trX;
            var trY;
            var rotate = _this.rotate;

            if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
                // cylinder
                if (!isNaN(topRadius)) {

                    var bx;
                    var by;
                    var tx;
                    var ty;
                    if (rotate) {
                        by = h / 2;
                        bx = dx / 2;
                        ty = h / 2;
                        tx = w + dx / 2;
                        brY = Math.abs(h / 2);
                        brX = Math.abs(dx / 2);
                    } else {
                        bx = w / 2;
                        by = dy / 2;
                        tx = w / 2;
                        ty = h + dy / 2 + 1;
                        brX = Math.abs(w / 2);
                        brY = Math.abs(dy / 2);
                    }

                    trX = brX * topRadius;
                    trY = brY * topRadius;

                    // draw bottom and top elipses
                    if (brX > 0.1 && brX > 0.1) {
                        bottom = AmCharts.circle(container, brX, firstColor, alpha, bwidth, bcolor, balpha, false, brY);
                        bottom.translate(bx, by);
                    }
                    if (trX > 0.1 && trX > 0.1) {
                        top = AmCharts.circle(container, trX, AmCharts.adjustLuminosity(firstColor, 0.5), alpha, bwidth, bcolor, balpha, false, trY);
                        top.translate(tx, ty);
                    }
                }
                // cuboid
                else {
                    var bc = lastColor;
                    var ccc = AmCharts.adjustLuminosity(firstColor, -0.2);
                    var tc = firstColor;

                    ccc = AmCharts.adjustLuminosity(tc, -0.2);
                    bottom = AmCharts.polygon(container, [0, dx, w + dx, w, 0], [0, dy, dy, 0, 0], ccc, alpha, 1, bcolor, 0, gradientRotation);

                    if (balpha > 0) {
                        bottomBorders = AmCharts.line(container, [0, dx, w + dx], [0, dy, dy], bcolor, balpha, bwidth, dashLength);
                    }

                    // back
                    back = AmCharts.polygon(container, [0, 0, w, w, 0], [0, h, h, 0, 0], ccc, alpha, 1, bcolor, 0, gradientRotation);
                    back.translate(dx, dy);

                    // back borders
                    if (balpha > 0) {
                        backBorders = AmCharts.line(container, [dx, dx], [dy, dy + h], bcolor, balpha, bwidth, dashLength);
                    }

                    // left side
                    lside = AmCharts.polygon(container, [0, 0, dx, dx, 0], [0, h, h + dy, dy, 0], ccc, alpha, 1, bcolor, 0, gradientRotation);

                    // right side
                    rside = AmCharts.polygon(container, [w, w, w + dx, w + dx, w], [0, h, h + dy, dy, 0], ccc, alpha, 1, bcolor, 0, gradientRotation);

                    // right side borders
                    if (balpha > 0) {
                        rsideBorders = AmCharts.line(container, [w, w + dx, w + dx, w], [0, dy, h + dy, h], bcolor, balpha, bwidth, dashLength);
                    }
                    //}
                    ccc = AmCharts.adjustLuminosity(bc, 0.2);
                    top = AmCharts.polygon(container, [0, dx, w + dx, w, 0], [h, h + dy, h + dy, h, h], ccc, alpha, 1, bcolor, 0, gradientRotation);

                    // bot borders
                    if (balpha > 0) {
                        topBorders = AmCharts.line(container, [0, dx, w + dx], [h, h + dy, h + dy], bcolor, balpha, bwidth, dashLength);
                    }
                }
            }

            alpha = tempAlpha;

            if (Math.abs(h) < 1) {
                h = 0;
            }

            if (Math.abs(w) < 1) {
                w = 0;
            }

            var front;
            // cylinder
            if (!isNaN(topRadius) && (Math.abs(dx) > 0 || Math.abs(dy) > 0)) {
                colors = [firstColor];
                var attr = {
                    "fill": colors,
                    "stroke": bcolor,
                    "stroke-width": bwidth,
                    "stroke-opacity": balpha,
                    "fill-opacity": alpha
                };

                var comma = ",";

                var path;
                var tCenter;
                var gradAngle;
                var al;

                if (rotate) {
                    tCenter = (h / 2 - h / 2 * topRadius);
                    path = "M" + 0 + comma + 0 + " L" + w + comma + tCenter;
                    al = " B";
                    if (w > 0) {
                        al = " A";
                    }
                    if (AmCharts.VML) {
                        path += al + Math.round(w - trX) + comma + Math.round(h / 2 - trY) + comma + Math.round(w + trX) + comma + Math.round(h / 2 + trY) + comma + w + comma + 0 + comma + w + comma + h;
                        path += " L" + 0 + comma + h;
                        path += al + Math.round(-brX) + comma + Math.round(h / 2 - brY) + comma + Math.round(brX) + comma + Math.round(h / 2 + brY) + comma + 0 + comma + h + comma + 0 + comma + 0;
                    } else {
                        path += "A" + trX + comma + trY + comma + 0 + comma + 0 + comma + 0 + comma + w + comma + (h - h / 2 * (1 - topRadius)) + "L" + 0 + comma + h;
                        path += "A" + brX + comma + brY + comma + 0 + comma + 0 + comma + 1 + comma + 0 + comma + 0;
                    }
                    gradAngle = 90;
                } else {
                    tCenter = (w / 2 - w / 2 * topRadius);
                    path = "M" + 0 + comma + 0 + " L" + tCenter + comma + h;
                    if (AmCharts.VML) {

                        path = "M" + 0 + comma + 0 + " L" + tCenter + comma + h;
                        al = " B";
                        if (h < 0) {
                            al = " A";
                        }
                        path += al + Math.round(w / 2 - trX) + comma + Math.round(h - trY) + comma + Math.round(w / 2 + trX) + comma + Math.round(h + trY) + comma + 0 + comma + h + comma + w + comma + h;
                        path += " L" + w + comma + 0;
                        path += al + Math.round(w / 2 + brX) + comma + Math.round(brY) + comma + Math.round(w / 2 - brX) + comma + Math.round(-brY) + comma + w + comma + 0 + comma + 0 + comma + 0;
                    } else {
                        path += "A" + trX + comma + trY + comma + 0 + comma + 0 + comma + 0 + comma + (w - w / 2 * (1 - topRadius)) + comma + h + "L" + w + comma + 0;
                        path += "A" + brX + comma + brY + comma + 0 + comma + 0 + comma + 1 + comma + 0 + comma + 0;
                    }
                    gradAngle = 180;
                }


                front = container.path(path).attr(attr);
                front.gradient("linearGradient", [firstColor, AmCharts.adjustLuminosity(firstColor, -0.3), AmCharts.adjustLuminosity(firstColor, -0.3), firstColor], gradAngle);
                if (rotate) {
                    front.translate(dx / 2, 0);
                } else {
                    front.translate(0, dy / 2);
                }
            } else {
                if (h === 0) {
                    front = AmCharts.line(container, [0, w], [0, 0], bcolor, balpha, bwidth, dashLength);
                } else if (w === 0) {
                    front = AmCharts.line(container, [0, 0], [0, h], bcolor, balpha, bwidth, dashLength);
                } else {
                    if (cornerRadius > 0) {
                        front = AmCharts.rect(container, w, h, colors, alpha, bwidth, bcolor, balpha, cornerRadius, gradientRotation, dashLength);
                    } else {
                        front = AmCharts.polygon(container, [0, 0, w, w, 0], [0, h, h, 0, 0], colors, alpha, bwidth, bcolor, balpha, gradientRotation, false, dashLength);
                    }
                }
            }

            var elements;
            if (!isNaN(topRadius)) {
                if (rotate) {
                    if (w > 0) {
                        elements = [bottom, front, top];
                    } else {
                        elements = [top, front, bottom];
                    }
                } else {
                    if (h < 0) {
                        elements = [bottom, front, top];
                    } else {
                        elements = [top, front, bottom];
                    }
                }

            } else {
                if (h < 0) {
                    elements = [bottom, bottomBorders, back, backBorders, lside, rside, rsideBorders, top, topBorders, front];
                } else {
                    elements = [top, topBorders, back, backBorders, lside, rside, bottom, bottomBorders, rsideBorders, front];
                }
            }

            AmCharts.setCN(chart, front, bcn + "front");
            AmCharts.setCN(chart, back, bcn + "back");
            AmCharts.setCN(chart, top, bcn + "top");
            AmCharts.setCN(chart, bottom, bcn + "bottom");
            AmCharts.setCN(chart, lside, bcn + "left");
            AmCharts.setCN(chart, rside, bcn + "right");


            var i;
            for (i = 0; i < elements.length; i++) {
                var el = elements[i];
                if (el) {
                    set.push(el);
                    AmCharts.setCN(chart, el, bcn + "element");
                }
            }

            if (pattern) {
                front.pattern(pattern, NaN, chart.path);
            }
        },


        width: function(v) {
            if (isNaN(v)) {
                v = 0;
            }
            var _this = this;
            _this.w = Math.round(v);
            _this.draw();
        },

        height: function(v) {
            if (isNaN(v)) {
                v = 0;
            }
            var _this = this;
            _this.h = Math.round(v);
            _this.draw();
        },

        animateHeight: function(duration, easingFunction) {
            var _this = this;
            _this.animationFinished = false;
            _this.easing = easingFunction;
            _this.totalFrames = duration * AmCharts.updateRate;
            _this.rh = _this.h;
            _this.frame = 0;
            _this.height(1);
            setTimeout(function() {
                _this.updateHeight.call(_this);
            }, 1000 / AmCharts.updateRate);
        },

        updateHeight: function() {
            var _this = this;
            _this.frame++;
            var totalFrames = _this.totalFrames;

            if (_this.frame <= totalFrames) {
                var value = _this.easing(0, _this.frame, 1, _this.rh - 1, totalFrames);
                _this.height(value);
                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(function() {
                        _this.updateHeight.call(_this);
                    });
                } else {
                    setTimeout(function() {
                        _this.updateHeight.call(_this);
                    }, 1000 / AmCharts.updateRate);
                }
            } else {
                _this.height(_this.rh);
                _this.animationFinished = true;
            }
        },

        animateWidth: function(duration, easingFunction) {
            var _this = this;
            _this.animationFinished = false;
            _this.easing = easingFunction;
            _this.totalFrames = duration * AmCharts.updateRate;
            _this.rw = _this.w;
            _this.frame = 0;
            _this.width(1);

            setTimeout(function() {
                _this.updateWidth.call(_this);
            }, 1000 / AmCharts.updateRate);
        },

        updateWidth: function() {
            var _this = this;
            _this.frame++;
            var totalFrames = _this.totalFrames;

            if (_this.frame <= totalFrames) {
                var value = _this.easing(0, _this.frame, 1, _this.rw - 1, totalFrames);
                _this.width(value);

                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(function() {
                        _this.updateWidth.call(_this);
                    });
                } else {
                    setTimeout(function() {
                        _this.updateWidth.call(_this);
                    }, 1000 / AmCharts.updateRate);
                }
            } else {
                _this.width(_this.rw);
                _this.animationFinished = true;
            }
        }

    });

})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;

    AmCharts.CategoryAxis = AmCharts.Class({

        inherits: AmCharts.AxisBase,

        construct: function(theme) {
            var _this = this;
            _this.cname = "CategoryAxis";
            AmCharts.CategoryAxis.base.construct.call(_this, theme);
            _this.minPeriod = "DD";
            _this.parseDates = false;
            _this.equalSpacing = false;
            _this.position = "bottom";
            _this.startOnAxis = false;
            _this.gridPosition = "middle";

            _this.safeDistance = 30;
            
            //_this.categoryFunction;

            _this.stickBalloonToCategory = false;

            AmCharts.applyTheme(_this, theme, _this.cname);
        },


        draw: function() {
            var _this = this;
            AmCharts.CategoryAxis.base.draw.call(_this);

            _this.generateDFObject();

            var data = _this.chart.chartData;
            _this.data = data;

            _this.labelRotationR = _this.labelRotation;
            _this.type = null;

            if (AmCharts.ifArray(data)) {
                var i;
                var chart = _this.chart;

                var axisName = "category-axis";
                if (_this.id != "scrollbar") {
                    AmCharts.setCN(chart, _this.set, axisName);
                    AmCharts.setCN(chart, _this.labelsSet, axisName);
                    AmCharts.setCN(chart, _this.axisLine.axisSet, axisName);
                } else {
                    _this.bcn = _this.id + "-";
                }

                var end = _this.end;
                var start = _this.start;
                var labelFrequency = _this.labelFrequency;
                var startFrom = 0;
                var valueCount = end - start + 1;
                var gridCount = _this.gridCountR;
                var showFirstLabel = _this.showFirstLabel;
                var showLastLabel = _this.showLastLabel;
                var coord;
                var below;
                var valueText = "";
                var minPeriodObj = AmCharts.extractPeriod(_this.minPeriod);
                var minDuration = AmCharts.getPeriodDuration(minPeriodObj.period, minPeriodObj.count);
                var periodObj;
                var periodMultiplier;
                var period;
                var periodDuration;
                var periodReal;
                var previousTime;
                var previousTimeReal;
                var periodCount;
                var time;
                var biggerPeriodChanged;
                var dateFormat;
                var realStartFrom;
                var rotate = _this.rotate;
                var firstDayOfWeek = _this.firstDayOfWeek;
                var boldPeriodBeginning = _this.boldPeriodBeginning;
                var lastTime = data[data.length - 1].time;
                var maxTime = AmCharts.resetDateToMin(new Date(lastTime + minDuration * 1.05), _this.minPeriod, 1, firstDayOfWeek).getTime();
                _this.firstTime = chart.firstTime;
                var bold;
                var axisItem;
                var UNDEFINED;

                if (_this.endTime > maxTime) {
                    _this.endTime = maxTime;
                }

                var minorGridEnabled = _this.minorGridEnabled;
                var minorGridFrequency;
                var gridAlphaReal = _this.gridAlpha;
                var minorPeriodDuration;

                var serialDataItem;
                var sum = 0;
                var prevCoord = 0;
                if (_this.widthField) {
                    for (i = _this.start; i <= _this.end; i++) {
                        serialDataItem = _this.data[i];
                        if (serialDataItem) {
                            var widthValue = Number(_this.data[i].dataContext[_this.widthField]);
                            if (!isNaN(widthValue)) {
                                sum += widthValue;
                                serialDataItem.widthValue = widthValue;
                            }
                        }
                    }
                }

                // PARSE DATES
                if (_this.parseDates && !_this.equalSpacing) {
                    _this.lastTime = data[data.length - 1].time;
                    _this.maxTime = AmCharts.resetDateToMin(new Date(_this.lastTime + minDuration * 1.05), _this.minPeriod, 1, firstDayOfWeek).getTime();
                    _this.timeDifference = _this.endTime - _this.startTime;
                    _this.parseDatesDraw();
                }
                // DO NOT PARSE DATES
                else if (!_this.parseDates) {

                    _this.cellWidth = _this.getStepWidth(valueCount);

                    // in case there are more values when gridlines, fix the gridCount
                    if (valueCount < gridCount) {
                        gridCount = valueCount;
                    }

                    startFrom += _this.start;

                    _this.stepWidth = _this.getStepWidth(valueCount);

                    if (gridCount > 0) {
                        var gridFrequency = Math.floor(valueCount / gridCount);
                        minorGridFrequency = _this.chooseMinorFrequency(gridFrequency);

                        realStartFrom = startFrom;
                        if (realStartFrom / 2 == Math.round(realStartFrom / 2)) {
                            realStartFrom--;
                        }

                        if (realStartFrom < 0) {
                            realStartFrom = 0;
                        }

                        var realCount = 0;

                        if (_this.widthField) {
                            realStartFrom = _this.start;
                        }

                        if (_this.end - realStartFrom + 1 >= _this.autoRotateCount) {
                            _this.labelRotationR = _this.autoRotateAngle;
                        }

                        for (i = realStartFrom; i <= _this.end + 2; i++) {
                            var sDataItem;
                            var forceShow = false;
                            if (i >= 0 && i < _this.data.length) {
                                sDataItem = _this.data[i];
                                valueText = sDataItem.category;
                                forceShow = sDataItem.forceShow;
                            } else {
                                valueText = "";
                            }

                            if (minorGridEnabled && !isNaN(minorGridFrequency)) {
                                if (i / minorGridFrequency != Math.round(i / minorGridFrequency) && !forceShow) {
                                    continue;
                                } else {
                                    if (i / gridFrequency == Math.round(i / gridFrequency) || forceShow) {

                                    } else {
                                        _this.gridAlpha = _this.minorGridAlpha;
                                        valueText = UNDEFINED;
                                    }
                                }
                            } else {
                                if (i / gridFrequency != Math.round(i / gridFrequency) && !forceShow) {
                                    continue;
                                }
                            }

                            coord = _this.getCoordinate(i - startFrom);



                            var vShift = 0;
                            if (_this.gridPosition == "start") {
                                coord = coord - _this.cellWidth / 2;
                                vShift = _this.cellWidth / 2;
                            }
                            below = true;
                            var tickShift = vShift;
                            if (_this.tickPosition == "start") {
                                tickShift = 0;
                                below = false;
                                vShift = 0;
                            }

                            if ((i == start && !showFirstLabel) || (i == _this.end && !showLastLabel)) {
                                valueText = UNDEFINED;
                            }

                            if (Math.round(realCount / labelFrequency) != realCount / labelFrequency) {
                                valueText = UNDEFINED;
                            }

                            realCount++;

                            var cellW = _this.cellWidth;
                            if (rotate) {
                                cellW = NaN;
                                if (_this.ignoreAxisWidth || !chart.autoMargins) {
                                    if (_this.position == "right") {
                                        cellW = chart.marginRight;
                                    } else {
                                        cellW = chart.marginLeft;
                                    }
                                    cellW -= _this.tickLength + 10;
                                }
                            }

                            if (_this.labelFunction && sDataItem) {
                                valueText = _this.labelFunction(valueText, sDataItem, this);
                            }
                            valueText = AmCharts.fixBrakes(valueText);

                            bold = false;
                            if (_this.boldLabels) {
                                bold = true;
                            }

                            // this adds last tick
                            if (i > _this.end && _this.tickPosition == "start") {
                                valueText = " ";
                            }

                            // this makes axis labels to be centered if chart is rotated and inside is set to true. 3.14.5
                            if (_this.rotate && _this.inside) {
                                vShift -= 2;
                            }

                            if (!isNaN(sDataItem.widthValue)) {
                                sDataItem.percentWidthValue = sDataItem.widthValue / sum * 100;
                                if (_this.rotate) {
                                    cellW = _this.height * sDataItem.widthValue / sum;
                                } else {
                                    cellW = _this.width * sDataItem.widthValue / sum;
                                }
                                coord = prevCoord;
                                prevCoord += cellW;
                                vShift = cellW / 2;
                            }

                            axisItem = new _this.axisItemRenderer(this, coord, valueText, below, cellW, vShift, UNDEFINED, bold, tickShift, false, sDataItem.labelColor, sDataItem.className);
                            axisItem.serialDataItem = sDataItem;
                            _this.pushAxisItem(axisItem);

                            _this.gridAlpha = gridAlphaReal;
                        }
                    }
                }

                // PARSE, BUT EQUAL SPACING
                else if (_this.parseDates && _this.equalSpacing) {
                    startFrom = _this.start;
                    _this.startTime = _this.data[_this.start].time;
                    _this.endTime = _this.data[_this.end].time;

                    _this.timeDifference = _this.endTime - _this.startTime;

                    periodObj = _this.choosePeriod(0);
                    period = periodObj.period;
                    periodMultiplier = periodObj.count;
                    periodDuration = AmCharts.getPeriodDuration(period, periodMultiplier);

                    // check if this period is not shorter then minPeriod
                    if (periodDuration < minDuration) {
                        period = minPeriodObj.period;
                        periodMultiplier = minPeriodObj.count;
                        periodDuration = minDuration;
                    }

                    periodReal = period;
                    // weeks don't have format, swith to days
                    if (periodReal == "WW") {
                        periodReal = "DD";
                    }
                    _this.currentDateFormat = _this.dateFormatsObject[periodReal];
                    _this.stepWidth = _this.getStepWidth(valueCount);

                    gridCount = Math.ceil(_this.timeDifference / periodDuration) + 1;

                    previousTime = AmCharts.resetDateToMin(new Date(_this.startTime - periodDuration), period, periodMultiplier, firstDayOfWeek).getTime();

                    _this.cellWidth = _this.getStepWidth(valueCount);

                    periodCount = Math.round(previousTime / periodDuration);

                    start = -1;
                    if (periodCount / 2 == Math.round(periodCount / 2)) {
                        start = -2;
                        previousTime -= periodDuration;
                    }

                    realStartFrom = _this.start;

                    if (realStartFrom / 2 == Math.round(realStartFrom / 2)) {
                        realStartFrom--;
                    }

                    if (realStartFrom < 0) {
                        realStartFrom = 0;
                    }

                    var realEnd = _this.end + 2;
                    if (realEnd >= _this.data.length) {
                        realEnd = _this.data.length;
                    }

                    // first must be skipped if more data items then gridcount
                    var thisIsFirst = false;

                    thisIsFirst = !showFirstLabel;

                    _this.previousPos = -1000;

                    if (_this.labelRotationR > 20) {
                        _this.safeDistance = 5;
                    }

                    var realRealStartFrom = realStartFrom;
                    // find second period change to avoid small gap between first label and the second
                    if (_this.data[realStartFrom].time != AmCharts.resetDateToMin(new Date(_this.data[realStartFrom].time), period, periodMultiplier, firstDayOfWeek).getTime()) {
                        var cc = 0;
                        var tempPreviousTime = previousTime;
                        for (i = realStartFrom; i < realEnd; i++) {
                            time = _this.data[i].time;

                            if (_this.checkPeriodChange(period, periodMultiplier, time, tempPreviousTime)) {
                                cc++;
                                if (cc >= 2) {
                                    realRealStartFrom = i;
                                    i = realEnd;
                                }
                                tempPreviousTime = time;
                            }
                        }
                    }

                    if (minorGridEnabled && periodMultiplier > 1) {
                        minorGridFrequency = _this.chooseMinorFrequency(periodMultiplier);
                        minorPeriodDuration = AmCharts.getPeriodDuration(period, minorGridFrequency);
                    }

                    if (_this.gridCountR > 0) {
                        for (i = realStartFrom; i < realEnd; i++) {
                            time = _this.data[i].time;

                            if (_this.checkPeriodChange(period, periodMultiplier, time, previousTime) && i >= realRealStartFrom) {

                                coord = _this.getCoordinate(i - _this.start);

                                biggerPeriodChanged = false;
                                if (_this.nextPeriod[periodReal]) {
                                    biggerPeriodChanged = _this.checkPeriodChange(_this.nextPeriod[periodReal], 1, time, previousTime, periodReal);

                                    if (biggerPeriodChanged) {
                                        var resetedTime = AmCharts.resetDateToMin(new Date(time), _this.nextPeriod[periodReal], 1, firstDayOfWeek).getTime();

                                        if (resetedTime != time) {
                                            biggerPeriodChanged = false;
                                        }
                                    }
                                }

                                bold = false;
                                if (biggerPeriodChanged && _this.markPeriodChange) {
                                    dateFormat = _this.dateFormatsObject[_this.nextPeriod[periodReal]];
                                    bold = true;
                                } else {
                                    dateFormat = _this.dateFormatsObject[periodReal];
                                }

                                valueText = AmCharts.formatDate(new Date(time), dateFormat, chart);

                                if ((i == start && !showFirstLabel) || (i == gridCount && !showLastLabel)) {
                                    valueText = " ";
                                }

                                if (!thisIsFirst) {
                                    if (!boldPeriodBeginning) {
                                        bold = false;
                                    }

                                    // draw grid
                                    if (coord - _this.previousPos > _this.safeDistance * Math.cos(_this.labelRotationR * Math.PI / 180)) {

                                        if (_this.labelFunction) {
                                            valueText = _this.labelFunction(valueText, new Date(time), this, period, periodMultiplier, previousTimeReal);
                                        }

                                        if (_this.boldLabels) {
                                            bold = true;
                                        }

                                        axisItem = new _this.axisItemRenderer(this, coord, valueText, UNDEFINED, UNDEFINED, UNDEFINED, UNDEFINED, bold);

                                        var axisItemGraphics = axisItem.graphics();
                                        _this.pushAxisItem(axisItem);
                                        var graphicsWidth = axisItemGraphics.getBBox().width;
                                        if (!AmCharts.isModern) {
                                            graphicsWidth -= coord;
                                        }
                                        _this.previousPos = coord + graphicsWidth;


                                    }
                                } else {
                                    thisIsFirst = false;
                                }

                                previousTime = time;
                                previousTimeReal = time;
                            }
                        }
                    }
                }


                // get x's of all categories
                var prevX = 0;
                var xxx;
                for (i = 0; i < _this.data.length; i++) {
                    serialDataItem = _this.data[i];
                    if (serialDataItem) {
                        if (_this.parseDates && !_this.equalSpacing) {
                            var categoryTime = serialDataItem.time;
                            var cellWidth = _this.cellWidth;
                            if (_this.minPeriod == "MM") {
                                var daysInMonth = AmCharts.daysInMonth(new Date(categoryTime));
                                var duration = daysInMonth * 86400000;
                                cellWidth = duration * _this.stepWidth;
                                serialDataItem.cellWidth = cellWidth;
                            }

                            xxx = Math.round((categoryTime - _this.startTime) * _this.stepWidth + cellWidth / 2);
                        } else {
                            xxx = _this.getCoordinate(i - startFrom);
                        }

                        serialDataItem.x[_this.id] = xxx;
                    }
                }

                if (_this.widthField) {
                    for (i = _this.start; i <= _this.end; i++) {
                        serialDataItem = _this.data[i];
                        var widthValue2 = serialDataItem.widthValue;
                        serialDataItem.percentWidthValue = widthValue2 / sum * 100;
                        if (_this.rotate) {
                            xxx = _this.height * widthValue2 / sum / 2 + prevX;
                            prevX = _this.height * widthValue2 / sum + prevX;
                        } else {
                            xxx = _this.width * widthValue2 / sum / 2 + prevX;
                            prevX = _this.width * widthValue2 / sum + prevX;
                        }
                        serialDataItem.x[_this.id] = xxx;
                    }
                }

                // guides
                var count = _this.guides.length;

                for (i = 0; i < count; i++) {
                    var guide = _this.guides[i];
                    var guideToCoord = NaN;
                    var guideCoord = NaN;
                    var valueShift = NaN;
                    var toCategoryIndex = NaN;
                    var categoryIndex = NaN;
                    var above = guide.above;

                    if (guide.toCategory) {
                        toCategoryIndex = chart.getCategoryIndexByValue(guide.toCategory);
                        if (!isNaN(toCategoryIndex)) {
                            guideToCoord = _this.getCoordinate(toCategoryIndex - startFrom);

                            if (guide.expand) {
                                guideToCoord += _this.cellWidth / 2;
                            }

                            axisItem = new _this.axisItemRenderer(this, guideToCoord, "", true, NaN, NaN, guide);
                            _this.pushAxisItem(axisItem, above);
                        }
                    }

                    if (guide.category) {
                        categoryIndex = chart.getCategoryIndexByValue(guide.category);
                        if (!isNaN(categoryIndex)) {
                            guideCoord = _this.getCoordinate(categoryIndex - startFrom);

                            if (guide.expand) {
                                guideCoord -= _this.cellWidth / 2;
                            }

                            valueShift = (guideToCoord - guideCoord) / 2;
                            axisItem = new _this.axisItemRenderer(this, guideCoord, guide.label, true, NaN, valueShift, guide);
                            _this.pushAxisItem(axisItem, above);
                        }
                    }
                    var dataDateFormat = chart.dataDateFormat;
                    if (guide.toDate) {
                        if (dataDateFormat && !(guide.toDate instanceof Date)) {
                            guide.toDate = guide.toDate.toString() + " |";
                        }
                        guide.toDate = AmCharts.getDate(guide.toDate, dataDateFormat);

                        if (_this.equalSpacing) {
                            toCategoryIndex = chart.getClosestIndex(_this.data, "time", guide.toDate.getTime(), false, 0, _this.data.length - 1);
                            if (!isNaN(toCategoryIndex)) {
                                guideToCoord = _this.getCoordinate(toCategoryIndex - startFrom);
                            }
                        } else {
                            guideToCoord = (guide.toDate.getTime() - _this.startTime) * _this.stepWidth;
                        }
                        axisItem = new _this.axisItemRenderer(this, guideToCoord, "", true, NaN, NaN, guide);
                        _this.pushAxisItem(axisItem, above);
                    }

                    if (guide.date) {
                        if (dataDateFormat && !(guide.date instanceof Date)) {
                            guide.date = guide.date.toString() + " |";
                        }
                        guide.date = AmCharts.getDate(guide.date, dataDateFormat);

                        if (_this.equalSpacing) {
                            categoryIndex = chart.getClosestIndex(_this.data, "time", guide.date.getTime(), false, 0, _this.data.length - 1);
                            if (!isNaN(categoryIndex)) {
                                guideCoord = _this.getCoordinate(categoryIndex - startFrom);
                            }
                        } else {
                            guideCoord = (guide.date.getTime() - _this.startTime) * _this.stepWidth;
                        }

                        valueShift = (guideToCoord - guideCoord) / 2;

                        below = true;
                        if (guide.toDate) {
                            below = false;
                        }

                        if (_this.orientation == "H") {
                            axisItem = new _this.axisItemRenderer(this, guideCoord, guide.label, below, valueShift * 2, NaN, guide);
                        } else {
                            axisItem = new _this.axisItemRenderer(this, guideCoord, guide.label, false, NaN, valueShift, guide);
                        }
                        _this.pushAxisItem(axisItem, above);
                    }


                    if (guideToCoord > 0 || guideCoord > 0) {
                        var draw = false;
                        if (_this.rotate) {
                            if (guideToCoord < _this.height || guideCoord < _this.height) {
                                draw = true;
                            }
                        } else {
                            if (guideToCoord < _this.width || guideCoord < _this.width) {
                                draw = true;
                            }
                        }
                        if (draw) {
                            var guideFill = new _this.guideFillRenderer(this, guideCoord, guideToCoord, guide);
                            var guideFillGraphics = guideFill.graphics();
                            _this.pushAxisItem(guideFill, above);
                            guide.graphics = guideFillGraphics;
                            guideFillGraphics.index = i;

                            if (guide.balloonText) {
                                _this.addEventListeners(guideFillGraphics, guide);
                            }
                        }
                    }
                }

                var chartCursor = chart.chartCursor;
                if (chartCursor) {
                    if (rotate) {
                        chartCursor.fixHeight(_this.cellWidth);
                    } else {
                        chartCursor.fixWidth(_this.cellWidth);
                        if (chartCursor.fullWidth) {
                            if (_this.balloon) {
                                _this.balloon.minWidth = _this.cellWidth;
                            }
                        }
                    }
                }
                _this.previousHeight = currentHeight;
            }

            _this.axisCreated = true;

            _this.set.translate(_this.x, _this.y);
            _this.labelsSet.translate(_this.x, _this.y);
            _this.labelsSet.show();
            _this.positionTitle();
            var axisLine = _this.axisLine.set;
            if (axisLine) {
                axisLine.toFront();
            }

            var currentHeight = _this.getBBox().height;
            if ((currentHeight - _this.previousHeight) > 2 && _this.autoWrap && !_this.parseDates) {
                _this.chart.marginsUpdated = false;
                _this.axisCreated = false;
            }
        },


        xToIndex: function(x) {
            var _this = this;
            var data = _this.data;
            var chart = _this.chart;
            var rotate = chart.rotate;
            var stepWidth = _this.stepWidth;
            var index;
            if (_this.parseDates && !_this.equalSpacing) {
                var time = _this.startTime + Math.round(x / stepWidth) - _this.minDuration() / 2;
                index = chart.getClosestIndex(data, "time", time, false, _this.start, _this.end + 1);
            } else {
                if (_this.widthField) {
                    var minDistance = Infinity;
                    for (var i = _this.start; i <= _this.end; i++) {
                        var serialDataItem = _this.data[i];
                        if (serialDataItem) {
                            var xx = Math.abs(serialDataItem.x[_this.id] - x);
                            if (xx < minDistance) {
                                minDistance = xx;
                                index = i;
                            }
                        }
                    }
                } else {
                    if (!_this.startOnAxis) {
                        x -= stepWidth / 2;
                    }
                    index = _this.start + Math.round(x / stepWidth);
                }
            }

            index = AmCharts.fitToBounds(index, 0, data.length - 1);

            var indexX;
            if (data[index]) {
                indexX = data[index].x[_this.id];
            }

            if (rotate) {
                if (indexX > _this.height + 1) {
                    index--;
                }
                if (indexX < 0) {
                    index++;
                }
            } else {
                if (indexX > _this.width + 1) {
                    index--;
                }
                if (indexX < 0) {
                    index++;
                }
            }

            index = AmCharts.fitToBounds(index, 0, data.length - 1);

            return index;
        },

        dateToCoordinate: function(date) {
            var _this = this;
            if (_this.parseDates && !_this.equalSpacing) {
                return (date.getTime() - _this.startTime) * _this.stepWidth;
            } else if (_this.parseDates && _this.equalSpacing) {
                var index = _this.chart.getClosestIndex(_this.data, "time", date.getTime(), false, 0, _this.data.length - 1);
                return _this.getCoordinate(index - _this.start);
            } else {
                return NaN;
            }
        },

        categoryToCoordinate: function(category) {
            var _this = this;
            if (_this.chart) {
                if (_this.parseDates) {
                    return _this.dateToCoordinate(new Date(category));
                }
                var index = _this.chart.getCategoryIndexByValue(category);
                if (!isNaN(index)) {
                    return _this.getCoordinate(index - _this.start);
                }
            } else {
                return NaN;
            }
        },

        coordinateToDate: function(coordinate) {
            var _this = this;
            if (_this.equalSpacing) {
                var index = _this.xToIndex(coordinate);
                return new Date(_this.data[index].time);
            } else {
                return new Date(_this.startTime + coordinate / _this.stepWidth);
            }
        },

        coordinateToValue: function(coordinate) {
            var _this = this;
            var index = _this.xToIndex(coordinate);
            var serialDataItem = _this.data[index];

            if (serialDataItem) {
                if (_this.parseDates) {
                    return serialDataItem.time;
                } else {
                    return serialDataItem.category;
                }
            }
        },

        getCoordinate: function(index) {
            var _this = this;
            var coord = index * _this.stepWidth;

            if (!_this.startOnAxis) {
                coord += _this.stepWidth / 2;
            }

            return Math.round(coord);
        },

        formatValue: function(value, dateFormat) {
            var _this = this;

            if (!dateFormat) {
                dateFormat = _this.currentDateFormat;
            }

            if (_this.parseDates) {
                value = AmCharts.formatDate(new Date(value), dateFormat, _this.chart);
            }
            return value;
        },


        showBalloonAt: function(category, coordinate) {
            var _this = this;

            if (coordinate === undefined) {
                if (_this.parseDates) {
                    coordinate = _this.dateToCoordinate(new Date(category));
                } else {
                    coordinate = _this.categoryToCoordinate(category);
                }
            }
            return _this.adjustBalloonCoordinate(coordinate);
        },


        formatBalloonText: function(text, index, dateFormat) {
            var _this = this;
            var category = "";
            var toCategory = "";
            var chart = _this.chart;

            var serialDataItem = _this.data[index];
            if (serialDataItem) {
                if (_this.parseDates) {
                    category = AmCharts.formatDate(serialDataItem.category, dateFormat, chart);

                    var toDate = AmCharts.changeDate(new Date(serialDataItem.category), _this.minPeriod, 1);
                    toCategory = AmCharts.formatDate(toDate, dateFormat, chart);

                    if (category.indexOf("fff") != -1) {
                        category = AmCharts.formatMilliseconds(category, serialDataItem.category);
                        toCategory = AmCharts.formatMilliseconds(toCategory, toDate);
                    }

                } else {

                    var nextDataItem;
                    if (_this.data[index + 1]) {
                        nextDataItem = _this.data[index + 1];
                    }

                    category = AmCharts.fixNewLines(serialDataItem.category);
                    if (nextDataItem) {
                        toCategory = AmCharts.fixNewLines(nextDataItem.category);
                    }
                }
            }

            var catText = text.replace(/\[\[category\]\]/g, String(category));
            catText = catText.replace(/\[\[toCategory\]\]/g, String(toCategory));
            return catText;
        },


        // BALLOON //
        adjustBalloonCoordinate: function(coordinate, skip) {
            var _this = this;
            var index = _this.xToIndex(coordinate);
            var chart = _this.chart;
            var chartCursor = chart.chartCursor;

            if (_this.stickBalloonToCategory) {
                var serialDataItem = _this.data[index];

                if (serialDataItem) {
                    coordinate = serialDataItem.x[_this.id];
                }

                if (_this.stickBalloonToStart) {
                    coordinate -= _this.cellWidth / 2;
                }


                var y = 0;
                if (chartCursor) {
                    var limitToGraph = chartCursor.limitToGraph;
                    if (limitToGraph) {
                        var axisId = limitToGraph.valueAxis.id;
                        if (!limitToGraph.hidden) {
                            y = serialDataItem.axes[axisId].graphs[limitToGraph.id].y;
                        }
                    }

                    if (_this.rotate) {
                        if (_this.position == "left") {
                            if (limitToGraph) {
                                y -= chartCursor.width;
                            }
                            if (y > 0) {
                                y = 0;
                            }
                        } else {
                            if (y < 0) {
                                y = 0;
                            }
                        }

                        chartCursor.fixHLine(coordinate, y);
                    } else {
                        if (_this.position == "top") {
                            if (limitToGraph) {
                                y -= chartCursor.height;
                            }
                            if (y > 0) {
                                y = 0;
                            }
                        } else {
                            if (y < 0) {
                                y = 0;
                            }
                        }

                        chartCursor.fixVLine(coordinate, y);
                    }
                }
            }
            if (chartCursor && !skip) {
                chartCursor.setIndex(index);
                if (_this.parseDates) {
                    chartCursor.setTimestamp(_this.coordinateToDate(coordinate).getTime());
                }
            }
            return coordinate;
        }
    });
})();