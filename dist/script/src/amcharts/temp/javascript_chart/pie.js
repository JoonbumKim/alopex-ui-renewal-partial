(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.AmSlicedChart = AmCharts.Class({

        inherits: AmCharts.AmChart,

        construct: function(theme) {
            var _this = this;
            _this.createEvents("rollOverSlice", "rollOutSlice", "clickSlice", "pullOutSlice", "pullInSlice", "rightClickSlice");

            AmCharts.AmSlicedChart.base.construct.call(_this, theme);

            _this.colors = ["#FF0F00", "#FF6600", "#FF9E01", "#FCD202", "#F8FF01", "#B0DE09", "#04D215", "#0D8ECF", "#0D52D1", "#2A0CD0", "#8A0CCF", "#CD0D74", "#754DEB", "#DDDDDD", "#999999", "#333333", "#000000", "#57032A", "#CA9726", "#990000", "#4B0C25"];
            _this.alpha = 1;
            _this.groupPercent = 0;
            _this.groupedTitle = "Other";
            _this.groupedPulled = false;
            _this.groupedAlpha = 1;
            _this.marginLeft = 0;
            _this.marginTop = 10;
            _this.marginBottom = 10;
            _this.marginRight = 0;
            _this.hoverAlpha = 1;
            _this.outlineColor = "#FFFFFF";
            _this.outlineAlpha = 0;
            _this.outlineThickness = 1;
            _this.startAlpha = 0;
            _this.startDuration = 1;
            _this.startEffect = "bounce";
            _this.sequencedAnimation = true;
            _this.pullOutDuration = 1;
            _this.pullOutEffect = "bounce";
            _this.pullOutOnlyOne = false;
            _this.pullOnHover = false;
            _this.labelsEnabled = true;
            _this.labelTickColor = "#000000";
            _this.labelTickAlpha = 0.2;
            _this.hideLabelsPercent = 0;
            _this.urlTarget = "_self";
            _this.autoMarginOffset = 10;
            _this.gradientRatio = [];
            _this.maxLabelWidth = 200;
            _this.accessibleLabel = "[[title]]: [[percents]]% [[value]] [[description]]";
            //_this.balloonFunction;
            //_this.labelFunction;

            AmCharts.applyTheme(_this, theme, "AmSlicedChart");
        },

        initChart: function() {
            var _this = this;
            AmCharts.AmSlicedChart.base.initChart.call(_this);

            if (_this.dataChanged) {
                _this.parseData();
                _this.dispatchDataUpdated = true;
                _this.dataChanged = false;
                _this.setLegendData(_this.chartData);
            }
            _this.drawChart();
        },


        handleLegendEvent: function(event) {
            var _this = this;
            var type = event.type;
            var dItem = event.dataItem;
            var legend = _this.legend;
            if (dItem.wedge) {
                if (dItem) {
                    var hidden = dItem.hidden;
                    var mouseEvent = event.event;

                    switch (type) {
                        case "clickMarker":
                            if (!hidden && !legend.switchable) {
                                _this.clickSlice(dItem, mouseEvent);
                            }
                            break;
                        case "clickLabel":
                            if (!hidden) {
                                _this.clickSlice(dItem, mouseEvent, false);
                            }
                            break;
                        case "rollOverItem":
                            if (!hidden) {
                                _this.rollOverSlice(dItem, false, mouseEvent);
                            }
                            break;
                        case "rollOutItem":
                            if (!hidden) {
                                _this.rollOutSlice(dItem, mouseEvent);
                            }
                            break;
                        case "hideItem":
                            _this.hideSlice(dItem, mouseEvent);
                            break;
                        case "showItem":
                            _this.showSlice(dItem, mouseEvent);
                            break;
                    }
                }
            }
        },

        invalidateVisibility: function() {
            var _this = this;
            _this.recalculatePercents();
            _this.initChart();
            var legend = _this.legend;
            if (legend) {
                legend.invalidateSize();
            }
        },

        addEventListeners: function(wedge, dItem) {
            var _this = this;

            wedge.mouseover(function(ev) {
                _this.rollOverSlice(dItem, true, ev);
            }).mouseout(function(ev) {
                _this.rollOutSlice(dItem, ev);
            }).touchend(function(ev) {
                _this.rollOverSlice(dItem, ev);
                //if (_this.panEventsEnabled) {
                //_this.clickSlice(dItem, ev);
                //}
            }).mouseup(function(ev) {
                _this.clickSlice(dItem, ev);
            }).contextmenu(function(ev) {
                _this.handleRightClick(dItem, ev);
            });

        },


        formatString: function(text, dItem, noFixBrakes) {
            var _this = this;

            text = AmCharts.formatValue(text, dItem, ["value"], _this.nf, "", _this.usePrefixes, _this.prefixesOfSmallNumbers, _this.prefixesOfBigNumbers);
            var tempPrec = _this.pf.precision;
            if (!isNaN(_this.tempPrec)) {
                _this.pf.precision = _this.tempPrec;
            }
            text = AmCharts.formatValue(text, dItem, ["percents"], _this.pf);
            text = AmCharts.massReplace(text, {
                "[[title]]": dItem.title,
                "[[description]]": dItem.description
            });

            _this.pf.precision = tempPrec;

            if (text.indexOf("[[") != -1) {
                text = AmCharts.formatDataContextValue(text, dItem.dataContext);
            }

            if (!noFixBrakes) {
                text = AmCharts.fixBrakes(text);
            } else {
                // balloon
                text = AmCharts.fixNewLines(text);
            }
            text = AmCharts.cleanFromEmpty(text);

            return text;
        },

        startSlices: function() {
            var _this = this;

            var i;
            for (i = 0; i < _this.chartData.length; i++) {
                if (_this.startDuration > 0 && _this.sequencedAnimation) {
                    _this.setStartTO(i);
                } else {
                    _this.startSlice(_this.chartData[i]);
                }
            }
        },

        setStartTO: function(i) {
            var _this = this;
            var interval = _this.startDuration / _this.chartData.length * 500;
            var t = setTimeout(function() {
                _this.startSequenced.call(_this);
            }, interval * i);
            _this.timeOuts.push(t);
        },

        pullSlices: function(instant) {
            var _this = this;
            var chartData = _this.chartData;
            var i;
            for (i = 0; i < chartData.length; i++) {
                var slice = chartData[i];
                if (slice.pulled) {
                    _this.pullSlice(slice, 1, instant);
                }
            }
        },

        startSequenced: function() {
            var _this = this;
            var chartData = _this.chartData;
            var i;

            for (i = 0; i < chartData.length; i++) {
                if (!chartData[i].started) {
                    var dItem = _this.chartData[i];
                    _this.startSlice(dItem);
                    break;
                }
            }
        },

        startSlice: function(dItem) {
            var _this = this;
            dItem.started = true;
            var w = dItem.wedge;
            var startDuration = _this.startDuration;

            var l = dItem.labelSet;

            if (w && startDuration > 0) {
                if (dItem.alpha > 0) {
                    w.show();
                }

                w.translate(dItem.startX, dItem.startY);
                _this.animatable.push(w);
                w.animate({
                    "opacity": 1,
                    translate: "0,0"
                }, startDuration, _this.startEffect);
            }


            if (l && startDuration > 0) {
                if (dItem.alpha > 0) {
                    l.show();
                }

                l.translate(dItem.startX, dItem.startY);
                l.animate({
                    "opacity": 1,
                    translate: "0,0"
                }, startDuration, _this.startEffect);
            }
        },


        showLabels: function() {
            var _this = this;
            var chartData = _this.chartData;
            var i;
            for (i = 0; i < chartData.length; i++) {
                var dItem = chartData[i];
                if (dItem.alpha > 0) {
                    var label = dItem.label;
                    if (label) {
                        label.show();
                    }
                    var tick = dItem.tick;
                    if (tick) {
                        tick.show();
                    }
                }
            }
        },

        showSlice: function(dItem) {
            var _this = this;
            if (isNaN(dItem)) {
                dItem.hidden = false;
            } else {
                _this.chartData[dItem].hidden = false;
            }
            //_this.hideBalloon();
            _this.invalidateVisibility();
        },

        hideSlice: function(dItem) {
            var _this = this;
            if (isNaN(dItem)) {
                dItem.hidden = true;
            } else {
                _this.chartData[dItem].hidden = true;
            }
            _this.hideBalloon();
            _this.invalidateVisibility();
        },

        rollOverSlice: function(dItem, follow, ev) {
            var _this = this;
            if (!isNaN(dItem)) {
                dItem = _this.chartData[dItem];
            }
            clearTimeout(_this.hoverInt);

            if (!dItem.hidden) {

                if (_this.pullOnHover) {
                    _this.pullSlice(dItem, 1);
                }

                if (_this.hoverAlpha < 1) {
                    var wedge = dItem.wedge;
                    if (wedge) {
                        dItem.wedge.attr({
                            "opacity": _this.hoverAlpha
                        });
                    }
                }

                var x = dItem.balloonX;
                var y = dItem.balloonY;

                if (dItem.pulled) {
                    x += dItem.pullX;
                    y += dItem.pullY;
                }

                var text = _this.formatString(_this.balloonText, dItem, true);

                var balloonFunction = _this.balloonFunction;
                if (balloonFunction) {
                    text = balloonFunction(dItem, text);
                }

                var color = AmCharts.adjustLuminosity(dItem.color, -0.15);

                if (!text) {
                    _this.hideBalloon();
                } else {
                    _this.showBalloon(text, color, follow, x, y);
                }

                if (dItem.value === 0) {
                    _this.hideBalloon();
                }

                var evt = {
                    type: "rollOverSlice",
                    dataItem: dItem,
                    chart: _this,
                    event: ev
                };
                _this.fire(evt);
            }
        },

        rollOutSlice: function(dItem, ev) {
            var _this = this;
            if (!isNaN(dItem)) {
                dItem = _this.chartData[dItem];
            }
            var wedge = dItem.wedge;
            if (wedge) {
                dItem.wedge.attr({
                    "opacity": 1
                });
            }

            _this.hideBalloon();

            var evt = {
                type: "rollOutSlice",
                dataItem: dItem,
                chart: _this,
                event: ev
            };
            _this.fire(evt);
        },

        clickSlice: function(dItem, ev, skipDispatch) {
            var _this = this;
            if (_this.checkTouchDuration(ev)) {
                if (!isNaN(dItem)) {
                    dItem = _this.chartData[dItem];
                }

                //_this.hideBalloon();
                if (dItem.pulled) {
                    _this.pullSlice(dItem, 0);
                } else {
                    _this.pullSlice(dItem, 1);
                }

                AmCharts.getURL(dItem.url, _this.urlTarget);

                if (!skipDispatch) {
                    var evt = {
                        type: "clickSlice",
                        dataItem: dItem,
                        chart: _this,
                        event: ev
                    };
                    _this.fire(evt);
                }
            }
        },

        handleRightClick: function(dItem, ev) {
            var _this = this;
            if (!isNaN(dItem)) {
                dItem = _this.chartData[dItem];
            }
            var evt = {
                type: "rightClickSlice",
                dataItem: dItem,
                chart: _this,
                event: ev
            };
            _this.fire(evt);
        },

        drawTicks: function() {
            var _this = this;
            var chartData = _this.chartData;
            var i;

            for (i = 0; i < chartData.length; i++) {
                var dItem = chartData[i];
                var label = dItem.label;
                if (label && !dItem.skipTick) {
                    var x0 = dItem.tx0;
                    var y0 = dItem.ty0;
                    var x = dItem.tx;
                    var x2 = dItem.tx2;
                    var y = dItem.ty;

                    var tick = AmCharts.line(_this.container, [x0, x, x2], [y0, y, y], _this.labelTickColor, _this.labelTickAlpha);
                    AmCharts.setCN(_this, tick, _this.type + "-tick");
                    AmCharts.setCN(_this, tick, dItem.className, true);
                    dItem.tick = tick;
                    dItem.wedge.push(tick);
                }
            }
        },

        initialStart: function() {
            var _this = this;

            var startDuration = _this.startDuration;
            var t = setTimeout(function() {
                _this.showLabels.call(_this);
            }, startDuration * 1000);
            _this.timeOuts.push(t);

            if (_this.chartCreated) {
                _this.pullSlices(true);
            } else {
                _this.startSlices();
                if (startDuration > 0) {
                    var to = setTimeout(function() {
                        _this.pullSlices.call(_this);
                    }, startDuration * 1200);
                    _this.timeOuts.push(to);
                } else {
                    _this.pullSlices(true);
                }
            }
        },

        pullSlice: function(dItem, dir, instant) {
            var _this = this;
            var duration = _this.pullOutDuration;
            if (instant === true) {
                duration = 0;
            }
            var wedge = dItem.wedge;

            if (wedge) {
                if (duration > 0) {
                    wedge.animate({
                        "translate": (dir * dItem.pullX) + "," + (dir * dItem.pullY)
                    }, duration, _this.pullOutEffect);

                    if (dItem.labelSet) {
                        dItem.labelSet.animate({
                            "translate": (dir * dItem.pullX) + "," + (dir * dItem.pullY)
                        }, duration, _this.pullOutEffect);
                    }
                } else {
                    if (dItem.labelSet) {
                        dItem.labelSet.translate(dir * dItem.pullX, dir * dItem.pullY);
                    }
                    wedge.translate(dir * dItem.pullX, dir * dItem.pullY);
                }
            }



            var evt;
            if (dir == 1) {
                dItem.pulled = true;
                if (_this.pullOutOnlyOne) {
                    _this.pullInAll(dItem.index);
                }

                evt = {
                    type: "pullOutSlice",
                    dataItem: dItem,
                    chart: _this
                };
            } else {
                dItem.pulled = false;
                evt = {
                    type: "pullInSlice",
                    dataItem: dItem,
                    chart: _this
                };
            }
            _this.fire(evt);
        },

        pullInAll: function(except) {
            var _this = this;
            var chartData = _this.chartData;
            var i;
            for (i = 0; i < _this.chartData.length; i++) {
                if (i != except) {
                    if (chartData[i].pulled) {
                        _this.pullSlice(chartData[i], 0);
                    }
                }
            }
        },

        pullOutAll: function() {
            var _this = this;
            var chartData = _this.chartData;
            var i;
            for (i = 0; i < chartData.length; i++) {
                if (!chartData[i].pulled) {
                    _this.pullSlice(chartData[i], 1);
                }
            }
        },

        parseData: function() {
            var _this = this;
            var chartData = [];
            _this.chartData = chartData;

            var dp = _this.dataProvider;

            // backward compatibility
            if (!isNaN(_this.pieAlpha)) {
                _this.alpha = _this.pieAlpha;
            }

            if (dp !== undefined) {
                var sliceCount = dp.length;

                var sum = 0;

                // caluclate sum
                var i;
                var dataItem;
                var color;
                for (i = 0; i < sliceCount; i++) {
                    dataItem = {};
                    var dataSource = dp[i];
                    dataItem.dataContext = dataSource;

                    var rawValue = dataSource[_this.valueField];
                    if (rawValue !== null) {
                        dataItem.value = Number(dataSource[_this.valueField]);
                    }

                    var title = dataSource[_this.titleField];
                    if (!title) {
                        title = "";
                    }
                    dataItem.title = title;

                    dataItem.pulled = AmCharts.toBoolean(dataSource[_this.pulledField], false);

                    var description = dataSource[_this.descriptionField];
                    if (!description) {
                        description = "";
                    }
                    dataItem.description = description;

                    dataItem.labelRadius = Number(dataSource[_this.labelRadiusField]);
                    dataItem.switchable = true;
                    dataItem.className = dataSource[_this.classNameField];

                    dataItem.url = dataSource[_this.urlField];


                    var pattern = dataSource[_this.patternField];
                    if (!pattern && _this.patterns) {
                        pattern = _this.patterns[i];
                    }


                    dataItem.pattern = pattern;

                    dataItem.visibleInLegend = AmCharts.toBoolean(dataSource[_this.visibleInLegendField], true);

                    var alpha = dataSource[_this.alphaField];
                    if (alpha !== undefined) {
                        dataItem.alpha = Number(alpha);
                    } else {
                        dataItem.alpha = _this.alpha;
                    }

                    color = dataSource[_this.colorField];
                    if (color !== undefined) {
                        dataItem.color = color;
                    }

                    dataItem.labelColor = AmCharts.toColor(dataSource[_this.labelColorField]);

                    sum += dataItem.value;

                    dataItem.hidden = false;

                    chartData[i] = dataItem;
                }

                // calculate percents
                var groupCount = 0;

                for (i = 0; i < sliceCount; i++) {
                    dataItem = chartData[i];
                    dataItem.percents = dataItem.value / sum * 100;

                    if (dataItem.percents < _this.groupPercent) {
                        groupCount++;
                    }
                }

                // group to others slice
                if (groupCount > 1) {
                    _this.groupValue = 0;
                    _this.removeSmallSlices();

                    var value = _this.groupValue;
                    var percents = _this.groupValue / sum * 100;
                    chartData.push({
                        title: _this.groupedTitle,
                        value: value,
                        percents: percents,
                        pulled: _this.groupedPulled,
                        color: _this.groupedColor,
                        url: _this.groupedUrl,
                        description: _this.groupedDescription,
                        alpha: _this.groupedAlpha,
                        pattern: _this.groupedPattern,
                        className: _this.groupedClassName,
                        dataContext: {}
                    });
                }

                // v2 compatibility
                var baseColor = _this.baseColor;
                if (!baseColor) {
                    baseColor = _this.pieBaseColor;
                }

                var brightnessStep = _this.brightnessStep;
                if (!brightnessStep) {
                    brightnessStep = _this.pieBrightnessStep;
                }

                // now set colors
                for (i = 0; i < chartData.length; i++) {

                    if (baseColor) {
                        color = AmCharts.adjustLuminosity(baseColor, i * brightnessStep / 100);
                    } else {
                        color = _this.colors[i];
                        if (color === undefined) {
                            color = AmCharts.randomColor();
                        }
                    }
                    if (chartData[i].color === undefined) {
                        chartData[i].color = color;
                    }
                }

                _this.recalculatePercents();
            }
        },


        recalculatePercents: function() {
            var _this = this;
            var chartData = _this.chartData;
            var sum = 0;
            var i;
            var dItem;
            for (i = 0; i < chartData.length; i++) {
                dItem = chartData[i];
                if (!dItem.hidden && dItem.value > 0) {
                    sum += dItem.value;
                }
            }
            for (i = 0; i < chartData.length; i++) {
                dItem = _this.chartData[i];
                if (!dItem.hidden && dItem.value > 0) {
                    dItem.percents = dItem.value * 100 / sum;
                } else {
                    dItem.percents = 0;
                }
            }
        },


        // remove slices which are less then __config.group.percent
        removeSmallSlices: function() {
            var _this = this;
            var chartData = _this.chartData;
            var i;
            for (i = chartData.length - 1; i >= 0; i--) {
                if (chartData[i].percents < _this.groupPercent) {
                    _this.groupValue += chartData[i].value;
                    chartData.splice(i, 1);
                }
            }
        },


        animateAgain: function() {
            var _this = this;
            _this.startSlices();

            for (var i = 0; i < _this.chartData.length; i++) {
                var dItem = _this.chartData[i];
                dItem.started = false;
                var w = dItem.wedge;
                if (w) {
                    w.setAttr("opacity", _this.startAlpha);
                    w.translate(dItem.startX, dItem.startY);
                }
                var l = dItem.labelSet;
                if (l) {
                    l.setAttr("opacity", _this.startAlpha);
                    l.translate(dItem.startX, dItem.startY);
                }
            }

            var startDuration = _this.startDuration;
            if (startDuration > 0) {
                var t = setTimeout(function() {
                    _this.pullSlices.call(_this);
                }, startDuration * 1200);
                _this.timeOuts.push(t);
            } else {
                _this.pullSlices();
            }
        },


        measureMaxLabel: function() {
            var _this = this;
            var chartData = _this.chartData;
            var maxWidth = 0;
            var i;
            for (i = 0; i < chartData.length; i++) {
                var dItem = chartData[i];
                var text = _this.formatString(_this.labelText, dItem);

                var labelFunction = _this.labelFunction;
                if (labelFunction) {
                    text = labelFunction(dItem, text);
                }
                var txt = AmCharts.text(_this.container, text, _this.color, _this.fontFamily, _this.fontSize);
                var w = txt.getBBox().width;
                if (w > maxWidth) {
                    maxWidth = w;
                }
                txt.remove();
            }
            return maxWidth;
        }
    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.AmPieChart = AmCharts.Class({

        inherits: AmCharts.AmSlicedChart,

        construct: function(theme) {
            var _this = this;
            _this.type = "pie";
            AmCharts.AmPieChart.base.construct.call(_this, theme);

            _this.cname = "AmPieChart";
            _this.pieBrightnessStep = 30;
            _this.minRadius = 10;
            _this.depth3D = 0;
            _this.startAngle = 90;
            _this.innerRadius = 0;
            _this.angle = 0;
            _this.startRadius = "500%";
            _this.pullOutRadius = "20%";
            _this.labelRadius = 20;
            _this.labelText = "[[title]]: [[percents]]%";
            _this.balloonText = "[[title]]: [[percents]]% ([[value]])\n[[description]]";
            _this.previousScale = 1;
            _this.adjustPrecision = false;
            _this.gradientType = "radial";
            AmCharts.applyTheme(_this, theme, _this.cname);
        },

        drawChart: function() {

            var _this = this;

            AmCharts.AmPieChart.base.drawChart.call(_this);
            var chartData = _this.chartData;

            if (AmCharts.ifArray(chartData)) {
                if (_this.realWidth > 0 && _this.realHeight > 0) {
                    if (AmCharts.VML) {
                        _this.startAlpha = 1;
                    }

                    var startDuration = _this.startDuration;
                    var container = _this.container;
                    var realWidth = _this.updateWidth();
                    _this.realWidth = realWidth;

                    var realHeight = _this.updateHeight();
                    _this.realHeight = realHeight;

                    var toCoordinate = AmCharts.toCoordinate;
                    var marginLeft = toCoordinate(_this.marginLeft, realWidth);
                    var marginRight = toCoordinate(_this.marginRight, realWidth);
                    var marginTop = toCoordinate(_this.marginTop, realHeight) + _this.getTitleHeight();
                    var marginBottom = toCoordinate(_this.marginBottom, realHeight) + _this.depth3D;

                    var pieX;
                    var pieY;
                    var radius;
                    var labelRadius = AmCharts.toNumber(_this.labelRadius);
                    var labelWidth = _this.measureMaxLabel();

                    if (labelWidth > _this.maxLabelWidth) {
                        labelWidth = _this.maxLabelWidth;
                    }

                    var pullOutRadiusReal;

                    if (!_this.labelText || !_this.labelsEnabled) {
                        labelWidth = 0;
                        labelRadius = 0;
                    }

                    if (_this.pieX === undefined) {
                        pieX = (realWidth - marginLeft - marginRight) / 2 + marginLeft;
                    } else {
                        pieX = toCoordinate(_this.pieX, _this.realWidth);
                    }

                    if (_this.pieY === undefined) {
                        pieY = (realHeight - marginTop - marginBottom) / 2 + marginTop;
                    } else {
                        pieY = toCoordinate(_this.pieY, realHeight);
                    }

                    radius = toCoordinate(_this.radius, realWidth, realHeight);

                    // if radius is not defined, calculate from margins
                    if (!radius) {
                        var pureWidth;

                        if (labelRadius >= 0) {
                            pureWidth = realWidth - marginLeft - marginRight - labelWidth * 2;
                        } else {
                            pureWidth = realWidth - marginLeft - marginRight;
                        }

                        var pureHeight = realHeight - marginTop - marginBottom;
                        radius = Math.min(pureWidth, pureHeight);

                        if (pureHeight < pureWidth) {
                            radius = radius / (1 - _this.angle / 90);

                            if (radius > pureWidth) {
                                radius = pureWidth;
                            }
                        }

                        pullOutRadiusReal = AmCharts.toCoordinate(_this.pullOutRadius, radius);

                        if (labelRadius >= 0) {
                            radius -= (labelRadius + pullOutRadiusReal) * 1.8;
                        } else {
                            radius -= pullOutRadiusReal * 1.8;
                        }
                        radius = radius / 2;
                    }

                    if (radius < _this.minRadius) {
                        radius = _this.minRadius;
                    }

                    pullOutRadiusReal = toCoordinate(_this.pullOutRadius, radius);
                    var startRadius = AmCharts.toCoordinate(_this.startRadius, radius);
                    var innerRadius = toCoordinate(_this.innerRadius, radius);

                    if (innerRadius >= radius) {
                        innerRadius = radius - 1;
                    }

                    var startAngle = AmCharts.fitToBounds(_this.startAngle, 0, 360);

                    // in case the pie has 3D depth, start angle can only be equal to 90 or 270
                    if (_this.depth3D > 0) {
                        if (startAngle >= 270) {
                            startAngle = 270;

                        } else {
                            startAngle = 90;
                        }
                    }

                    startAngle -= 90;

                    if (startAngle > 360) {
                        startAngle -= 360;
                    }

                    var yRadius = radius - radius * _this.angle / 90;
                    var i;
                    var sum = 0;
                    var dItem;
                    for (i = 0; i < chartData.length; i++) {
                        dItem = chartData[i];
                        if (dItem.hidden !== true) {
                            sum += AmCharts.roundTo(dItem.percents, _this.pf.precision);
                        }
                    }

                    sum = AmCharts.roundTo(sum, _this.pf.precision);

                    _this.tempPrec = NaN;
                    if (_this.adjustPrecision) {
                        if (sum != 100) {
                            _this.tempPrec = _this.pf.precision + 1;
                        }
                    }
                    var flipAfter;
                    for (i = 0; i < chartData.length; i++) {
                        dItem = chartData[i];

                        if (dItem.hidden !== true) {
                            if (!_this.showZeroSlices && dItem.percents === 0) {
                                // void
                            } else {
                                // SLICE
                                var arc = dItem.percents * 360 / 100;
                                var ix = Math.sin((startAngle + arc / 2) / 180 * Math.PI);
                                var iy = -Math.cos((startAngle + arc / 2) / 180 * Math.PI) * (yRadius / radius);

                                var outlineColor = _this.outlineColor;
                                if (!outlineColor) {
                                    outlineColor = dItem.color;
                                }

                                var alpha = _this.alpha;
                                if (!isNaN(dItem.alpha)) {
                                    alpha = dItem.alpha;
                                }

                                var wattr = {
                                    "fill": dItem.color,
                                    "stroke": outlineColor,
                                    "stroke-width": _this.outlineThickness,
                                    "stroke-opacity": _this.outlineAlpha,
                                    "fill-opacity": alpha
                                };

                                if (dItem.url) {
                                    wattr.cursor = "pointer";
                                }

                                var xx = pieX;
                                var yy = pieY;

                                var wedge = AmCharts.wedge(container, xx, yy, startAngle, arc, radius, yRadius, innerRadius, _this.depth3D, wattr, _this.gradientRatio, dItem.pattern, _this.path, _this.gradientType);
                                AmCharts.setCN(_this, wedge, "pie-item");
                                AmCharts.setCN(_this, wedge.wedge, "pie-slice");
                                AmCharts.setCN(_this, wedge, dItem.className, true);
                                _this.addEventListeners(wedge, dItem);

                                dItem.startAngle = startAngle;

                                chartData[i].wedge = wedge;
                                if (startDuration > 0) {
                                    if (!_this.chartCreated) {
                                        wedge.setAttr("opacity", _this.startAlpha);
                                    }
                                }

                                // x and y vectors
                                dItem.ix = ix;
                                dItem.iy = iy;
                                dItem.wedge = wedge;
                                dItem.index = i;
                                dItem.label = null;
                                var labelSet = container.set();

                                // LABEL ////////////////////////////////////////////////////////
                                if (_this.labelsEnabled && _this.labelText && dItem.percents >= _this.hideLabelsPercent) {
                                    var labelAngle = startAngle + arc / 2;
                                    if (labelAngle < 0) {
                                        labelAngle += 360;
                                    }

                                    if (labelAngle > 360) {
                                        labelAngle -= 360;
                                    }

                                    var labelRadiusReal = labelRadius;
                                    if (!isNaN(dItem.labelRadius)) {
                                        labelRadiusReal = dItem.labelRadius;

                                        if (labelRadiusReal < 0) {
                                            dItem.skipTick = true;
                                        }
                                    }

                                    var tx = pieX + ix * (radius + labelRadiusReal);
                                    var ty = pieY + iy * (radius + labelRadiusReal);

                                    var align;
                                    var tickL = 0;

                                    if (isNaN(flipAfter)) {
                                        if (labelAngle > 350 && chartData.length - i > 1) {
                                            flipAfter = i - 1 + Math.floor((chartData.length - i) / 2);
                                        }
                                    }

                                    if (labelRadiusReal >= 0) {
                                        var labelQuarter;
                                        //q0
                                        if (labelAngle <= 90 && labelAngle >= 0) {
                                            labelQuarter = 0;
                                            align = "start";
                                            tickL = 8;
                                        }
                                        //q1
                                        else if (labelAngle >= 90 && labelAngle < 180) {
                                            labelQuarter = 1;
                                            align = "start";
                                            tickL = 8;
                                        }
                                        //q2
                                        else if (labelAngle >= 180 && labelAngle < 270) {
                                            labelQuarter = 2;
                                            align = "end";
                                            tickL = -8;
                                        }
                                        //q3
                                        else if ((labelAngle >= 270 && labelAngle <= 354)) {
                                            labelQuarter = 3;
                                            align = "end";
                                            tickL = -8;
                                        }
                                        //q0 again
                                        else if ((labelAngle >= 354)) {
                                            if (i > flipAfter) {
                                                labelQuarter = 0;
                                                align = "start";
                                                tickL = 8;
                                            } else {
                                                labelQuarter = 3;
                                                align = "end";
                                                tickL = -8;
                                            }
                                        }

                                        dItem.labelQuarter = labelQuarter;
                                    } else {
                                        align = "middle";
                                    }

                                    var text = _this.formatString(_this.labelText, dItem);

                                    var labelFunction = _this.labelFunction;
                                    if (labelFunction) {
                                        text = labelFunction(dItem, text);
                                    }

                                    var labelColor = dItem.labelColor;
                                    if (!labelColor) {
                                        labelColor = _this.color;
                                    }


                                    if (text !== "") {
                                        var txt = AmCharts.wrappedText(container, text, labelColor, _this.fontFamily, _this.fontSize, align, false, _this.maxLabelWidth);
                                        AmCharts.setCN(_this, txt, "pie-label");
                                        AmCharts.setCN(_this, txt, dItem.className, true);
                                        txt.translate(tx + tickL * 1.5, ty);
                                        txt.node.style.pointerEvents = "none";
                                        dItem.ty = ty;
                                        dItem.textX = tx + tickL * 1.5;


                                        // var tbox = txt.getBBox();
                                        // var hitRect = AmCharts.rect(container, tbox.width + 5, tbox.height + 5, "#ccFFFF", 0.5);
                                        // hitRect.translate(tx + tickL * 1.5 + tbox.x, ty + tbox.y);
                                        // dItem.hitRect = hitRect;
                                        labelSet.push(txt);
                                        // labelSet.push(hitRect);

                                        _this.axesSet.push(labelSet);
                                        dItem.labelSet = labelSet;

                                        dItem.label = txt;
                                    }
                                    dItem.tx = tx;
                                    dItem.tx2 = tx + tickL;

                                    dItem.tx0 = pieX + ix * radius;
                                    dItem.ty0 = pieY + iy * radius;
                                }
                                var rad = innerRadius + (radius - innerRadius) / 2;
                                if (dItem.pulled) {
                                    rad += pullOutRadiusReal;
                                }

                                if (_this.accessible) {
                                    if (_this.accessibleLabel) {
                                        var accessibleLabel = _this.formatString(_this.accessibleLabel, dItem);
                                        _this.makeAccessible(wedge, accessibleLabel);
                                    }
                                }
                                if (_this.tabIndex !== undefined) {
                                    wedge.setAttr("tabindex", _this.tabIndex);
                                }

                                dItem.balloonX = ix * rad + pieX;
                                dItem.balloonY = iy * rad + pieY;

                                dItem.startX = Math.round(ix * startRadius);
                                dItem.startY = Math.round(iy * startRadius);
                                dItem.pullX = Math.round(ix * pullOutRadiusReal);
                                dItem.pullY = Math.round(iy * pullOutRadiusReal);
                                _this.graphsSet.push(wedge);

                                if (dItem.alpha === 0 || (startDuration > 0 && !_this.chartCreated)) {
                                    wedge.hide();

                                    if (labelSet) {
                                        labelSet.hide();
                                    }
                                }

                                // get start angle of next slice
                                startAngle += dItem.percents * 360 / 100;
                                if (startAngle > 360) {
                                    startAngle -= 360;
                                }
                            }
                        }
                    }

                    if (labelRadius > 0) {
                        _this.arrangeLabels();
                    }

                    _this.pieXReal = pieX;
                    _this.pieYReal = pieY;
                    _this.radiusReal = radius;
                    _this.innerRadiusReal = innerRadius;

                    if (labelRadius > 0) {
                        _this.drawTicks();
                    }

                    _this.initialStart();

                    _this.setDepths();
                }

                var legend = _this.legend;

                if (legend) {
                    legend.invalidateSize();
                }
            } else {
                _this.cleanChart();
            }
            _this.dispDUpd();
        },


        setDepths: function() {
            var chartData = this.chartData;
            var i;

            for (i = 0; i < chartData.length; i++) {
                var dItem = chartData[i];
                var wedge = dItem.wedge;
                var startAngle = dItem.startAngle;
                // find quarter
                //q0 || q1
                if ((startAngle >= 0 && startAngle < 180)) {
                    wedge.toFront();
                }
                //q2 || q3
                else if ((startAngle >= 180)) {
                    wedge.toBack();
                }
            }
        },


        arrangeLabels: function() {
            var _this = this;
            var chartData = _this.chartData;
            var count = chartData.length;
            var dItem;

            // q0
            var i;
            for (i = count - 1; i >= 0; i--) {
                dItem = chartData[i];
                if (dItem.labelQuarter === 0 && !dItem.hidden) {
                    _this.checkOverlapping(i, dItem, 0, true, 0);
                }
            }
            // q1
            for (i = 0; i < count; i++) {
                dItem = chartData[i];
                if (dItem.labelQuarter == 1 && !dItem.hidden) {
                    _this.checkOverlapping(i, dItem, 1, false, 0);
                }
            }
            // q2
            for (i = count - 1; i >= 0; i--) {
                dItem = chartData[i];
                if (dItem.labelQuarter == 2 && !dItem.hidden) {
                    _this.checkOverlapping(i, dItem, 2, true, 0);
                }
            }
            // q3
            for (i = 0; i < count; i++) {
                dItem = chartData[i];

                if (dItem.labelQuarter == 3 && !dItem.hidden) {
                    _this.checkOverlapping(i, dItem, 3, false, 0);
                }
            }
        },

        checkOverlapping: function(index, dItem, quarter, backwards, count) {
            var _this = this;
            var overlapping;
            var i;
            var chartData = _this.chartData;
            var length = chartData.length;
            var label = dItem.label;

            if (label) {
                if (backwards === true) {
                    for (i = index + 1; i < length; i++) {
                        if (chartData[i].labelQuarter == quarter) {
                            overlapping = _this.checkOverlappingReal(dItem, chartData[i], quarter);
                            if (overlapping) {
                                i = length;
                            }
                        }
                    }
                } else {
                    for (i = index - 1; i >= 0; i--) {
                        if (chartData[i].labelQuarter == quarter) {
                            overlapping = _this.checkOverlappingReal(dItem, chartData[i], quarter);
                            if (overlapping) {
                                i = 0;
                            }
                        }
                    }
                }

                if (overlapping === true && count < 200 && isNaN(dItem.labelRadius)) {
                    var newY = dItem.ty + (dItem.iy * 3);
                    dItem.ty = newY;
                    label.translate(dItem.textX, newY);
                    //          if (dItem.hitRect) {
                    //              var bbox = label.getBBox();
                    //              dItem.hitRect.translate(dItem.tx2, newY + bbox.y);
                    //          }
                    _this.checkOverlapping(index, dItem, quarter, backwards, count + 1);
                }
            }
        },

        checkOverlappingReal: function(dItem1, dItem2, quarter) {
            var overlapping = false;
            var label1 = dItem1.label;
            var label2 = dItem2.label;

            if (dItem1.labelQuarter == quarter && !dItem1.hidden && !dItem2.hidden && label2) {
                var bb1 = label1.getBBox();

                var bbox1 = {};
                bbox1.width = bb1.width;
                bbox1.height = bb1.height;
                bbox1.y = dItem1.ty;
                bbox1.x = dItem1.tx;


                var bb2 = label2.getBBox();
                var bbox2 = {};
                bbox2.width = bb2.width;
                bbox2.height = bb2.height;
                bbox2.y = dItem2.ty;
                bbox2.x = dItem2.tx;

                if (AmCharts.hitTest(bbox1, bbox2)) {
                    overlapping = true;                    
                }
            }

            return overlapping;
        }

    });
})();