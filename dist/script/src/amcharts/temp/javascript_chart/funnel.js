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
    AmCharts.AmFunnelChart = AmCharts.Class({

        inherits: AmCharts.AmSlicedChart,

        construct: function(theme) {
            var _this = this;
            _this.type = "funnel";
            AmCharts.AmFunnelChart.base.construct.call(_this, theme);

            _this.cname = "AmFunnelChart";
            _this.startY = 0;
            _this.startX = 0;

            _this.baseWidth = "100%";
            _this.neckWidth = 0;
            _this.neckHeight = 0;
            _this.rotate = false;
            _this.valueRepresents = "height";

            _this.pullDistance = 30;
            _this.labelPosition = "center";
            _this.labelText = "[[title]]: [[value]]";
            _this.balloonText = "[[title]]: [[value]]\n[[description]]";

            AmCharts.applyTheme(_this, theme, _this.cname);
        },


        drawChart: function() {
            var _this = this;
            AmCharts.AmFunnelChart.base.drawChart.call(_this);

            var chartData = _this.chartData;

            if (AmCharts.ifArray(chartData)) {
                if (_this.realWidth > 0 && _this.realHeight > 0) {

                    var dx = Math.round(_this.depth3D * Math.cos(_this.angle * Math.PI / 180));
                    var dy = Math.round(-_this.depth3D * Math.sin(_this.angle * Math.PI / 180));

                    var container = _this.container;
                    var startDuration = _this.startDuration;
                    var rotate = _this.rotate;
                    var realWidth = _this.updateWidth();
                    _this.realWidth = realWidth;

                    var realHeight = _this.updateHeight();
                    _this.realHeight = realHeight;

                    var toCoordinate = AmCharts.toCoordinate;
                    var marginLeft = toCoordinate(_this.marginLeft, realWidth);
                    var marginRight = toCoordinate(_this.marginRight, realWidth);
                    var marginTop = toCoordinate(_this.marginTop, realHeight) + _this.getTitleHeight();
                    var marginBottom = toCoordinate(_this.marginBottom, realHeight);

                    if (dx > 0 && dy < 0) {
                        _this.neckWidth = 0;
                        _this.neckHeight = 0;
                        if (rotate) {
                            marginBottom -= dy / 2;
                        } else {
                            marginTop -= dy / 2;
                        }
                    }

                    var widthWitoutMargins = realWidth - marginLeft - marginRight;
                    var baseWidthReal = AmCharts.toCoordinate(_this.baseWidth, widthWitoutMargins);
                    var neckWidthReal = AmCharts.toCoordinate(_this.neckWidth, widthWitoutMargins);
                    var totalHeight = realHeight - marginBottom - marginTop;
                    var neckHeightReal = AmCharts.toCoordinate(_this.neckHeight, totalHeight);

                    var sliceY = marginTop;
                    var neckStartY = sliceY + totalHeight - neckHeightReal;
                    if (rotate) {
                        sliceY = realHeight - marginBottom;
                        neckStartY = sliceY - totalHeight + neckHeightReal;
                    }

                    _this.firstSliceY = sliceY;

                    if (AmCharts.VML) {
                        _this.startAlpha = 1;
                    }

                    var centerX = widthWitoutMargins / 2 + marginLeft;

                    var www = (baseWidthReal - neckWidthReal) / 2;
                    var tgA = (totalHeight - neckHeightReal) / www;
                    var previousTopRadius = 1;
                    // in case area is not calculated, only height (standard bad practice)

                    var previousWidth = baseWidthReal / 2;

                    var totalSquare = (totalHeight - neckHeightReal) * (baseWidthReal + neckWidthReal) / 2 + neckWidthReal * neckHeightReal;
                    var previousTextY = sliceY;
                    var previousTextHeight = 0;

                    for (var i = 0; i < chartData.length; i++) {

                        var dItem = chartData[i];
                        var sliceHeightTrimmed;
                        if (dItem.hidden !== true) {
                            if (!_this.showZeroSlices && dItem.percents === 0) {
                                // void
                            } else {
                                var xx = [];
                                var yy = [];
                                var sliceHeight;

                                if (_this.valueRepresents == "height") {
                                    sliceHeight = totalHeight * dItem.percents / 100;
                                } else {
                                    var c = -totalSquare * dItem.percents / 100 / 2;
                                    var b = previousWidth;
                                    var a = -1 / (2 * tgA);
                                    var d = (Math.pow(b, 2) - 4 * a * c);

                                    if (d < 0) {
                                        d = 0;
                                    }

                                    sliceHeight = (Math.sqrt(d) - b) / (2 * a);

                                    if ((!rotate && sliceY >= neckStartY) || (rotate && sliceY <= neckStartY)) {
                                        sliceHeight = (-c * 2) / neckWidthReal;
                                    } else if ((!rotate && sliceY + sliceHeight > neckStartY) || (rotate && sliceY - sliceHeight < neckStartY)) {

                                        if (rotate) {
                                            sliceHeightTrimmed = Math.round(sliceHeight + (sliceY - sliceHeight - neckStartY));
                                        } else {
                                            sliceHeightTrimmed = Math.round(sliceHeight - (sliceY + sliceHeight - neckStartY));
                                        }

                                        d = sliceHeightTrimmed / tgA;

                                        var sTrimmed = (b - d / 2) * sliceHeightTrimmed;

                                        var sSquare = -c - sTrimmed;

                                        var sHeight = (sSquare * 2) / neckWidthReal;

                                        if (sHeight != Infinity) {
                                            sliceHeight = sliceHeightTrimmed + sHeight;
                                        }
                                    }

                                }

                                var sliceWidth = previousWidth - sliceHeight / tgA;

                                var tickInSquare = false;
                                if ((!rotate && sliceY + sliceHeight > neckStartY) || (rotate && sliceY - sliceHeight < neckStartY)) {
                                    sliceWidth = neckWidthReal / 2;


                                    xx.push(centerX - previousWidth, centerX + previousWidth, centerX + sliceWidth, centerX + sliceWidth, centerX - sliceWidth, centerX - sliceWidth);
                                    if (rotate) {
                                        sliceHeightTrimmed = sliceHeight + (sliceY - sliceHeight - neckStartY);
                                        if (sliceY < neckStartY) {
                                            sliceHeightTrimmed = 0;
                                        }
                                        yy.push(sliceY, sliceY, sliceY - sliceHeightTrimmed, sliceY - sliceHeight, sliceY - sliceHeight, sliceY - sliceHeightTrimmed, sliceY);
                                    } else {
                                        sliceHeightTrimmed = sliceHeight - (sliceY + sliceHeight - neckStartY);

                                        if (sliceY > neckStartY) {
                                            sliceHeightTrimmed = 0;
                                        }

                                        yy.push(sliceY, sliceY, sliceY + sliceHeightTrimmed, sliceY + sliceHeight, sliceY + sliceHeight, sliceY + sliceHeightTrimmed, sliceY);
                                    }
                                    tickInSquare = true;
                                } else {
                                    xx.push(centerX - previousWidth, centerX + previousWidth, centerX + sliceWidth, centerX - sliceWidth);
                                    if (rotate) {
                                        yy.push(sliceY, sliceY, sliceY - sliceHeight, sliceY - sliceHeight);
                                    } else {
                                        yy.push(sliceY, sliceY, sliceY + sliceHeight, sliceY + sliceHeight);
                                    }
                                }

                                var wedge = container.set();
                                var wedgeGraphics;
                                if (dx > 0 && dy < 0) {

                                    var topRadius = sliceWidth / previousWidth;
                                    var sign = -1;

                                    if (!rotate) {
                                        sign = 1;
                                    }

                                    if (isNaN(previousTopRadius)) {
                                        previousTopRadius = 0;
                                    }

                                    wedgeGraphics = new AmCharts.Cuboid(container, previousWidth * 2, sign * sliceHeight, dx, dy * previousTopRadius, dItem.color, dItem.alpha, _this.outlineThickness, _this.outlineColor, _this.outlineAlpha, 90, 0, false, 0, dItem.pattern, topRadius).set;
                                    wedgeGraphics.translate(centerX - previousWidth, sliceY - dy / 2 * previousTopRadius);
                                    previousTopRadius = topRadius * previousTopRadius;
                                } else {
                                    wedgeGraphics = AmCharts.polygon(container, xx, yy, dItem.color, dItem.alpha, _this.outlineThickness, _this.outlineColor, _this.outlineAlpha);

                                }
                                AmCharts.setCN(_this, wedge, "funnel-item");
                                AmCharts.setCN(_this, wedgeGraphics, "funnel-slice");
                                AmCharts.setCN(_this, wedge, dItem.className, true);
                                wedge.push(wedgeGraphics);
                                _this.graphsSet.push(wedge);
                                if (!rotate) {
                                    wedge.toBack();
                                }

                                dItem.wedge = wedge;
                                dItem.index = i;

                                var gradientRatio = _this.gradientRatio;
                                if (gradientRatio) {
                                    var gradient = [];
                                    var g;
                                    for (g = 0; g < gradientRatio.length; g++) {
                                        gradient.push(AmCharts.adjustLuminosity(dItem.color, gradientRatio[g]));
                                    }
                                    if (gradient.length > 0) {
                                        wedgeGraphics.gradient("linearGradient", gradient);
                                    }
                                    if (dItem.pattern) {
                                        wedgeGraphics.pattern(dItem.pattern, NaN, _this.path);
                                    }
                                }


                                if (startDuration > 0) {
                                    if (!_this.chartCreated) {
                                        wedge.setAttr("opacity", _this.startAlpha);
                                    }
                                }

                                _this.addEventListeners(wedge, dItem);
                                if (rotate) {
                                    dItem.ty0 = sliceY - sliceHeight / 2;
                                }
                                else{
                                    dItem.ty0 = sliceY + sliceHeight / 2;   
                                }
                                // label
                                if (_this.labelsEnabled && _this.labelText && dItem.percents >= _this.hideLabelsPercent) {

                                    var text = _this.formatString(_this.labelText, dItem);

                                    var labelFunction = _this.labelFunction;
                                    if (labelFunction) {
                                        text = labelFunction(dItem, text);
                                    }

                                    var labelColor = dItem.labelColor;
                                    if (!labelColor) {
                                        labelColor = _this.color;
                                    }

                                    var labelPosition = _this.labelPosition;
                                    var align = "left";
                                    if (labelPosition == "center") {
                                        align = "middle";
                                    }
                                    if (labelPosition == "left") {
                                        align = "right";
                                    }

                                    var txt;

                                    if (text !== "") {
                                        txt = AmCharts.wrappedText(container, text, labelColor, _this.fontFamily, _this.fontSize, align, false, _this.maxLabelWidth);
                                        AmCharts.setCN(_this, txt, "funnel-label");
                                        AmCharts.setCN(_this, txt, dItem.className, true);
                                        txt.node.style.pointerEvents = "none";
                                        wedge.push(txt);

                                        var tx = centerX;

                                        var ty;
                                        if (rotate) {
                                            ty = sliceY - sliceHeight / 2;
                                            dItem.ty0 = ty;
                                        } else {
                                            ty = sliceY + sliceHeight / 2;
                                            dItem.ty0 = ty;
                                            if (ty < previousTextY + previousTextHeight + 5) {
                                                ty = previousTextY + previousTextHeight + 5;
                                            }
                                            if (ty > realHeight - marginBottom) {
                                                ty = realHeight - marginBottom;
                                            }
                                        }

                                        if (labelPosition == "right") {
                                            tx = widthWitoutMargins + 10 + marginLeft;
                                            dItem.tx0 = centerX + (previousWidth - sliceHeight / 2 / tgA);
                                            if (tickInSquare) {
                                                dItem.tx0 = centerX + sliceWidth;
                                            }
                                        }

                                        if (labelPosition == "left") {
                                            dItem.tx0 = centerX - (previousWidth - sliceHeight / 2 / tgA);
                                            if (tickInSquare) {
                                                dItem.tx0 = centerX - sliceWidth;
                                            }
                                            tx = marginLeft;
                                        }

                                        dItem.label = txt;
                                        dItem.labelX = tx;
                                        dItem.labelY = ty;
                                        dItem.labelHeight = txt.getBBox().height;

                                        txt.translate(tx, ty);

                                        var tbox = txt.getBBox();
                                        var hitRect = AmCharts.rect(container, tbox.width + 5, tbox.height + 5, "#ffffff", 0.005);
                                        hitRect.translate(tx + tbox.x, ty + tbox.y);

                                        wedge.push(hitRect);

                                        dItem.hitRect = hitRect;

                                        previousTextHeight = txt.getBBox().height;
                                        previousTextY = ty;
                                    }
                                }

                                if (dItem.alpha === 0 || (startDuration > 0 && !_this.chartCreated)) {
                                    wedge.hide();
                                }

                                if (rotate) {
                                    sliceY -= sliceHeight;
                                } else {
                                    sliceY += sliceHeight;
                                }

                                previousWidth = sliceWidth;

                                dItem.startX = AmCharts.toCoordinate(_this.startX, realWidth);
                                dItem.startY = AmCharts.toCoordinate(_this.startY, realHeight);
                                dItem.pullX = AmCharts.toCoordinate(_this.pullDistance, realWidth);
                                dItem.pullY = 0;
                                dItem.balloonX = centerX;
                                dItem.balloonY = dItem.ty0;

                                if(_this.accessible){
                                    if(_this.accessibleLabel){
                                        var accessibleLabel = _this.formatString(_this.accessibleLabel, dItem);
                                        _this.makeAccessible(wedge, accessibleLabel);
                                    }
                                }              
                                if(_this.tabIndex !== undefined){
                                    wedge.setAttr("tabindex", _this.tabIndex);
                                }                                                               
                            }
                        }
                    }
                    _this.arrangeLabels();

                    _this.initialStart();

                    var legend = _this.legend;
                    if (legend) {
                        legend.invalidateSize();
                    }
                } else {
                    _this.cleanChart();
                }
            }
            _this.dispDUpd();
        },

        arrangeLabels: function() {
            var _this = this;

            var rotate = _this.rotate;
            var previousY;
            if (rotate) {
                previousY = 0;
            } else {
                previousY = _this.realHeight;
            }
            var previousHeight = 0;
            var chartData = _this.chartData;

            var count = chartData.length;
            var dItem;
            for (var i = 0; i < count; i++) {
                dItem = chartData[count - i - 1];

                var label = dItem.label;

                var labelY = dItem.labelY;
                var labelX = dItem.labelX;
                var labelHeight = dItem.labelHeight;
                var newY = labelY;
                if (rotate) {
                    if (previousY + previousHeight + 5 > labelY) {
                        newY = previousY + previousHeight + 5;
                    }
                } else {
                    if (labelY + labelHeight + 5 > previousY) {
                        newY = previousY - 5 - labelHeight;
                    }
                }
                previousY = newY;
                previousHeight = labelHeight;

                if (label) {
                    label.translate(labelX, newY);
                    var bbox = label.getBBox();

                    if (dItem.hitRect) {
                        dItem.hitRect.translate(labelX + bbox.x, newY + bbox.y);
                    }
                }

                dItem.labelY = newY;
                dItem.tx = labelX;
                dItem.ty = newY;
                dItem.tx2 = labelX;
            }
            if (_this.labelPosition != "center") {
                _this.drawTicks();
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