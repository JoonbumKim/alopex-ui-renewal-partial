(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.GaugeAxis = AmCharts.Class({

        construct: function(theme) {
            var _this = this;
            _this.cname = "GaugeAxis";
            _this.radius = "95%";
            _this.createEvents("rollOverBand", "rollOutBand", "clickBand");
            _this.labelsEnabled = true;
            _this.startAngle = -120;
            _this.endAngle = 120;
            _this.startValue = 0;
            _this.endValue = 200;
            _this.gridCount = 5;
            //_this.valueInterval;
            //_this.minorTickInterval;
            _this.tickLength = 10;
            _this.minorTickLength = 5;
            _this.tickColor = "#555555";
            _this.tickAlpha = 1;
            _this.tickThickness = 1;
            _this.labelFrequency = 1;
            _this.inside = true;
            _this.labelOffset = 10;
            _this.showFirstLabel = true;
            _this.showLastLabel = true;
            _this.axisThickness = 1;
            _this.axisColor = "#000000";
            _this.axisAlpha = 1;
            _this.gridInside = true;
            //_this.topText = "";
            //_this.topTextFontSize;
            //_this.topTextColor;
            //_this.labelFunction;
            _this.topTextYOffset = 0;
            _this.topTextBold = true;

            //_this.bottomText = "";
            //_this.bottomTextFontSize;
            // _this.bottomTextColor
            _this.bottomTextYOffset = 0;
            _this.bottomTextBold = true;
            _this.centerX = "0%";
            _this.centerY = "0%";

            _this.bandOutlineThickness = 0;
            _this.bandOutlineAlpha = 0;
            _this.bandOutlineColor = "#000000";
            _this.bandAlpha = 1;
            //_this.bandGradientRatio;
            _this.bcn = "gauge-axis";

            AmCharts.applyTheme(_this, theme, "GaugeAxis");
        },

        value2angle: function(value) {
            var _this = this;

            return (value - _this.startValue) / (_this.endValue - _this.startValue) * (_this.endAngle - _this.startAngle) + _this.startAngle;
            //return _this.startAngle + _this.singleValueAngle * value;
        },

        setTopText: function(text) {
            if (text !== undefined) {
                var _this = this;
                _this.topText = text;
                var chart = _this.chart;
                if (_this.axisCreated) {

                    if (_this.topTF) {
                        _this.topTF.remove();
                    }

                    var fontSize = _this.topTextFontSize;
                    if (!fontSize) {
                        fontSize = chart.fontSize;
                    }

                    var textColor = _this.topTextColor;
                    if (!textColor) {
                        textColor = chart.color;
                    }

                    var topTextField = AmCharts.text(chart.container, text, textColor, chart.fontFamily, fontSize, undefined, _this.topTextBold);
                    AmCharts.setCN(chart, topTextField, "axis-top-label");

                    topTextField.translate(_this.centerXReal, _this.centerYReal - _this.radiusReal / 2 + _this.topTextYOffset);
                    _this.set.push(topTextField);
                    _this.topTF = topTextField;
                }
            }
        },

        setBottomText: function(text) {
            if (text !== undefined) {
                var _this = this;
                _this.bottomText = text;
                var chart = _this.chart;
                if (_this.axisCreated) {

                    if (_this.bottomTF) {
                        _this.bottomTF.remove();
                    }

                    var fontSize = _this.bottomTextFontSize;
                    if (!fontSize) {
                        fontSize = chart.fontSize;
                    }

                    var textColor = _this.bottomTextColor;
                    if (!textColor) {
                        textColor = chart.color;
                    }

                    var bottomTextField = AmCharts.text(chart.container, text, textColor, chart.fontFamily, fontSize, undefined, _this.bottomTextBold);
                    AmCharts.setCN(chart, bottomTextField, "axis-bottom-label");

                    bottomTextField.translate(_this.centerXReal, _this.centerYReal + _this.radiusReal / 2 + _this.bottomTextYOffset);
                    _this.bottomTF = bottomTextField;
                    _this.set.push(bottomTextField);
                }
            }
        },

        draw: function() {
            var _this = this;

            var chart = _this.chart;
            var set = chart.container.set();
            _this.set = set;

            AmCharts.setCN(chart, set, _this.bcn);
            AmCharts.setCN(chart, set, _this.bcn + "-" + _this.id);
            chart.graphsSet.push(set);
            _this.bandSet = chart.container.set();
            _this.set.push(_this.bandSet);

            var startValue = _this.startValue;
            var endValue = _this.endValue;

            var valueInterval = _this.valueInterval;

            if (isNaN(valueInterval)) {
                var dif = endValue - startValue;
                valueInterval = dif / _this.gridCount;
            }

            var minorTickInterval = _this.minorTickInterval;

            if (isNaN(minorTickInterval)) {
                minorTickInterval = valueInterval / 5;
            }

            var startAngle = _this.startAngle;

            var endAngle = _this.endAngle;

            var tickLength = _this.tickLength;

            var majorTickCount = (endValue - startValue) / valueInterval + 1;

            var valueAngle = (endAngle - startAngle) / (majorTickCount - 1);

            var singleValueAngle = valueAngle / valueInterval;

            _this.singleValueAngle = singleValueAngle;

            var container = chart.container;
            var tickColor = _this.tickColor;
            var tickAlpha = _this.tickAlpha;
            var tickThickness = _this.tickThickness;


            var minorTickCount = valueInterval / minorTickInterval;
            var minorValueAngle = valueAngle / minorTickCount;
            var minorTickLength = _this.minorTickLength;
            var labelFrequency = _this.labelFrequency;
            var radius = _this.radiusReal;

            if (!_this.inside) {
                radius -= 15;
            }

            _this.radiusRealReal = radius;

            var centerX = chart.centerX + AmCharts.toCoordinate(_this.centerX, chart.realWidth);
            var centerY = chart.centerY + AmCharts.toCoordinate(_this.centerY, chart.realHeight);

            _this.centerXReal = centerX;
            _this.centerYReal = centerY;

            // axis

            var axisAttr = {
                "fill": _this.axisColor,
                "fill-opacity": _this.axisAlpha,
                "stroke-width": 0,
                "stroke-opacity": 0
            };

            var axisRadius;
            var minorTickRadius;
            if (_this.gridInside) {
                axisRadius = radius;
                minorTickRadius = radius;
            } else {
                axisRadius = radius - tickLength;
                minorTickRadius = axisRadius + minorTickLength;
            }

            _this.minorTickRadius = minorTickRadius;

            _this.drawBands();

            var axisThickness = _this.axisThickness / 2;
            var axis = AmCharts.wedge(container, centerX, centerY, startAngle, endAngle - startAngle, axisRadius + axisThickness, axisRadius + axisThickness, axisRadius - axisThickness, 0, axisAttr);
            AmCharts.setCN(chart, axis.wedge, "axis-line");

            set.push(axis);

            var round = AmCharts.doNothing;
            if (!AmCharts.isModern) {
                round = Math.round;
            }

            var startDecCount = AmCharts.getDecimals(startValue);
            var endDecCount = AmCharts.getDecimals(endValue);
            var decCount = AmCharts.getDecimals(valueInterval);

            decCount = Math.max(decCount, startDecCount, endDecCount);

            valueInterval = AmCharts.roundTo(valueInterval, decCount + 1);

            for (var i = 0; i < majorTickCount; i++) {
                // MAJOR TICKS                
                var value = AmCharts.roundTo(startValue + i * valueInterval, decCount);
                var angle = startAngle + i * valueAngle;

                var xx1 = round(centerX + radius * Math.sin((angle) / (180) * Math.PI));
                var yy1 = round(centerY - radius * Math.cos((angle) / (180) * Math.PI));

                var xx2 = round(centerX + (radius - tickLength) * Math.sin((angle) / (180) * Math.PI));
                var yy2 = round(centerY - (radius - tickLength) * Math.cos((angle) / (180) * Math.PI));

                var line = AmCharts.line(container, [xx1, xx2], [yy1, yy2], tickColor, tickAlpha, tickThickness, 0, false, false, true);
                AmCharts.setCN(chart, line, "axis-tick");

                set.push(line);
                var sign = -1;
                var dx = _this.labelOffset;
                if (!_this.inside) {
                    dx = -dx - tickLength;
                    sign = 1;
                }

                var sin = Math.sin((angle) / (180) * Math.PI);
                var cos = Math.cos((angle) / (180) * Math.PI);
                var lx = centerX + (radius - tickLength - dx) * sin;
                var ly = centerY - (radius - tickLength - dx) * cos;

                var fontSize = _this.fontSize;
                if (isNaN(fontSize)) {
                    fontSize = chart.fontSize;
                }

                var lsin = Math.sin((angle - 90) / (180) * Math.PI);
                var lcos = Math.cos((angle - 90) / (180) * Math.PI);

                // LABELS
                if (labelFrequency > 0 && _this.labelsEnabled) {
                    if (i / labelFrequency == Math.round(i / labelFrequency)) {
                        if ((!_this.showLastLabel && i == majorTickCount - 1) || (!_this.showFirstLabel && i === 0)) {

                        } else {

                            var valueTxt;
                            if (_this.usePrefixes) {
                                valueTxt = AmCharts.addPrefix(value, chart.prefixesOfBigNumbers, chart.prefixesOfSmallNumbers, chart.nf, true);
                            } else {
                                valueTxt = AmCharts.formatNumber(value, chart.nf, decCount);
                            }

                            var unit = _this.unit;
                            if (unit) {
                                if (_this.unitPosition == "left") {
                                    valueTxt = unit + valueTxt;
                                } else {
                                    valueTxt = valueTxt + unit;
                                }
                            }

                            var labelFunction = _this.labelFunction;
                            if (labelFunction) {
                                valueTxt = labelFunction(value);
                            }
                            var labelColor = _this.color;
                            if (labelColor === undefined) {
                                labelColor = chart.color;
                            }

                            var label = AmCharts.text(container, valueTxt, labelColor, chart.fontFamily, fontSize);
                            AmCharts.setCN(chart, label, "axis-label");
                            var labelBBox = label.getBBox();
                            label.translate(lx + sign * labelBBox.width / 2 * lcos, ly + sign * labelBBox.height / 2 * lsin);
                            set.push(label);
                        }
                    }
                }

                // MINOR TICKS
                if (i < majorTickCount - 1) {
                    for (var m = 1; m < minorTickCount; m++) {
                        var mAngle = angle + minorValueAngle * m;

                        var mxx1 = round(centerX + minorTickRadius * Math.sin((mAngle) / (180) * Math.PI));
                        var myy1 = round(centerY - minorTickRadius * Math.cos((mAngle) / (180) * Math.PI));

                        var mxx2 = round(centerX + (minorTickRadius - minorTickLength) * Math.sin((mAngle) / (180) * Math.PI));
                        var myy2 = round(centerY - (minorTickRadius - minorTickLength) * Math.cos((mAngle) / (180) * Math.PI));

                        var mLine = AmCharts.line(container, [mxx1, mxx2], [myy1, myy2], tickColor, tickAlpha, tickThickness, 0, false, false, true);
                        AmCharts.setCN(chart, mLine, "axis-tick-minor");
                        set.push(mLine);
                    }
                }
            }


            _this.axisCreated = true;
            _this.setTopText(_this.topText);
            _this.setBottomText(_this.bottomText);
            var bbox = chart.graphsSet.getBBox();
            _this.width = bbox.width;
            _this.height = bbox.height;
        },

        drawBands: function() {
            var _this = this;
            var bands = _this.bands;
            if (bands) {
                for (var b = 0; b < bands.length; b++) {
                    var band = bands[b];
                    if (band) {
                        band.axis = _this;
                        AmCharts.processObject(band, AmCharts.GaugeBand, _this.theme);
                        band.draw(band.startValue, band.endValue);
                    }
                }
            }
        },

        addListeners: function(band, bandGraphics) {
            var _this = this;

            bandGraphics.mouseover(function(ev) {
                _this.fireEvent("rollOverBand", band, ev);
            }).mouseout(function(ev) {
                _this.fireEvent("rollOutBand", band, ev);
            }).touchend(function(ev) {
                _this.fireEvent("clickBand", band, ev);
            }).touchstart(function(ev) {
                _this.fireEvent("rollOverBand", band, ev);
            }).click(function(ev) {
                _this.fireEvent("clickBand", band, ev);
            });
        },

        fireEvent: function(type, band, ev) {
            var _this = this;
            var evt = {
                type: type,
                dataItem: band,
                chart: _this,
                event: ev
            };
            _this.fire(evt);
        },

        addEventListeners: function(bandGraphics, band) {
            var _this = this;
            var chart = _this.chart;
            bandGraphics.mouseover(function(ev) {
                chart.showBalloon(band.balloonText, band.color, true);
                _this.fireEvent("rollOverBand", band, ev);
            }).mouseout(function(ev) {
                chart.hideBalloon();
                _this.fireEvent("rollOutBand", band, ev);
            }).click(function(ev) {
                _this.fireEvent("clickBand", band, ev);
                AmCharts.getURL(band.url, chart.urlTarget);
            }).touchend(function(ev) {
                _this.fireEvent("clickBand", band, ev);
                AmCharts.getURL(band.url, chart.urlTarget);
            });
        }
    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;

    AmCharts.GaugeArrow = AmCharts.Class({

        construct: function(theme) {
            var _this = this;
            _this.cname = "GaugeArrow";
            _this.color = "#000000";
            _this.alpha = 1;
            _this.nailAlpha = 1;
            _this.nailRadius = 8;
            _this.startWidth = 8;
            _this.endWidth = 0;
            _this.borderAlpha = 1;
            _this.radius = "90%";
            _this.innerRadius = 0;
            _this.nailBorderAlpha = 0;
            _this.nailBorderThickness = 1;
            _this.frame = 0;

            AmCharts.applyTheme(_this, theme, "GaugeArrow");
        },

        setValue: function(value) {
            var _this = this;
            var chart = _this.chart;
            if (!chart) {
                _this.value = value;
                _this.previousValue = value;
            } else {
                if (chart.setValue) {
                    chart.setValue(this, value);
                } else {
                    _this.value = value;
                    _this.previousValue = value;
                }
            }
        }

    });

    AmCharts.GaugeBand = AmCharts.Class({
        construct: function() {
            var _this = this;
            _this.cname = "GaugeBand";
            _this.frame = 0;
        },

        draw: function(startValue, endValue) {
            var _this = this;

            var axis = _this.axis;

            if (_this.bandGraphics) {
                _this.bandGraphics.remove();
            }

            var chart = axis.chart;
            var startAngle = axis.startAngle;
            var radius = axis.radiusRealReal;
            var singleValueAngle = axis.singleValueAngle;
            var container = chart.container;
            var minorTickLength = axis.minorTickLength;

            var bandStartValue = startValue;
            var bandEndValue = endValue;
            var bandRadius = AmCharts.toCoordinate(_this.radius, radius);

            if (isNaN(bandRadius)) {
                bandRadius = axis.minorTickRadius;
            }

            var bandInnerRadius = AmCharts.toCoordinate(_this.innerRadius, radius);
            if (isNaN(bandInnerRadius)) {
                bandInnerRadius = bandRadius - minorTickLength;
            }

            var bandStartAngle = startAngle + singleValueAngle * (bandStartValue - axis.startValue);

            var bandArc = singleValueAngle * (bandEndValue - bandStartValue);

            var outlineColor = _this.outlineColor;
            if (outlineColor === undefined) {
                outlineColor = axis.bandOutlineColor;
            }

            var outlineThickness = _this.outlineThickness;
            if (isNaN(outlineThickness)) {
                outlineThickness = axis.bandOutlineThickness;
            }

            var outlineAlpha = _this.outlineAlpha;
            if (isNaN(outlineAlpha)) {
                outlineAlpha = axis.bandOutlineAlpha;
            }

            var bandAlpha = _this.alpha;
            if (isNaN(bandAlpha)) {
                bandAlpha = axis.bandAlpha;
            }

            var attr = {
                "fill": _this.color,
                "stroke": outlineColor,
                "stroke-width": outlineThickness,
                "stroke-opacity": outlineAlpha
            };

            if (_this.url) {
                attr.cursor = "pointer";
            }

            var gradientRatio = _this.gradientRatio;
            if (!gradientRatio) {
                gradientRatio = axis.bandGradientRatio;
            }

            var bandGraphics = AmCharts.wedge(container, axis.centerXReal, axis.centerYReal, bandStartAngle, bandArc, bandRadius, bandRadius, bandInnerRadius, 0, attr, gradientRatio, undefined, undefined, "radial");
            AmCharts.setCN(chart, bandGraphics.wedge, "axis-band");
            if (_this.id !== undefined) {
                AmCharts.setCN(chart, bandGraphics.wedge, "axis-band-" + _this.id);
            }

            bandGraphics.setAttr("opacity", bandAlpha);

            axis.bandSet.push(bandGraphics);

            _this.bandGraphics = bandGraphics;

            _this.currentStartValue = startValue;
            _this.currentEndValue = endValue;

            axis.addEventListeners(bandGraphics, _this);
        },

        update: function() {
            var _this = this;
            var axis = _this.axis;
            var chart = axis.chart;
            if (axis) {
                if (axis.value2angle) {
                    var endValue;
                    var startValue;
                    if (_this.frame >= chart.totalFrames) {
                        endValue = _this.endValue;
                        startValue = _this.startValue;
                    } else {
                        _this.frame++;

                        var effect = AmCharts.getEffect(chart.startEffect);
                        startValue = AmCharts[effect](0, _this.frame, _this.previousStartValue, _this.startValue - _this.previousStartValue, chart.totalFrames);
                        endValue = AmCharts[effect](0, _this.frame, _this.previousEndValue, _this.endValue - _this.previousEndValue, chart.totalFrames);

                        if (isNaN(startValue)) {
                            startValue = _this.startValue;
                        }
                        if (isNaN(endValue)) {
                            endValue = _this.endValue;
                        }
                    }
                    if (startValue != _this.currentStartValue || endValue != _this.currentEndValue) {
                        _this.draw(startValue, endValue);
                    }
                }
            }
        },

        setStartValue: function(value) {
            var _this = this;
            _this.previousStartValue = _this.startValue;
            _this.startValue = value;
            _this.frame = 0;
        },

        setEndValue: function(value) {
            var _this = this;
            _this.previousEndValue = _this.endValue;
            _this.endValue = value;
            _this.frame = 0;
        }

    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.AmAngularGauge = AmCharts.Class({

        inherits: AmCharts.AmChart,

        construct: function(theme) {
            var _this = this;
            _this.cname = "AmAngularGauge";
            AmCharts.AmAngularGauge.base.construct.call(_this, theme);

            _this.theme = theme;
            _this.type = "gauge";
            _this.marginLeft = 10;
            _this.marginTop = 10;
            _this.marginBottom = 10;
            _this.marginRight = 10;
            _this.minRadius = 10;

            _this.faceColor = "#FAFAFA";
            _this.faceAlpha = 0;
            _this.faceBorderWidth = 1;
            _this.faceBorderColor = "#555555";
            _this.faceBorderAlpha = 0;
            //_this.facePattern;

            _this.arrows = [];
            _this.axes = [];
            _this.startDuration = 1;
            _this.startEffect = "easeOutSine";
            _this.adjustSize = true;
            _this.extraWidth = 0;
            _this.extraHeight = 0;

            // _this.gaugeX;
            // _this.gaugeY;
            AmCharts.applyTheme(_this, theme, _this.cname);
        },

        addAxis: function(axis) {
            axis.chart = this;
            this.axes.push(axis);
        },

        formatString: function(text, dItem) {
            var _this = this;
            text = AmCharts.formatValue(text, dItem, ["value"], _this.nf, "", _this.usePrefixes, _this.prefixesOfSmallNumbers, _this.prefixesOfBigNumbers);
            return text;
        },

        initChart: function() {

            var _this = this;
            AmCharts.AmAngularGauge.base.initChart.call(_this);

            var axis;
            if (_this.axes.length === 0) {
                axis = new AmCharts.GaugeAxis(_this.theme);
                _this.addAxis(axis);
            }

            var i;

            for (i = 0; i < _this.axes.length; i++) {
                axis = _this.axes[i];
                axis = AmCharts.processObject(axis, AmCharts.GaugeAxis, _this.theme);
                if (!axis.id) {
                    axis.id = "axisAuto" + i + "_" + new Date().getTime();
                }
                axis.chart = _this;
                _this.axes[i] = axis;
            }


            var arrow;
            var arrows = _this.arrows;

            for (i = 0; i < arrows.length; i++) {
                arrow = arrows[i];

                arrow = AmCharts.processObject(arrow, AmCharts.GaugeArrow, _this.theme);
                if (!arrow.id) {
                    arrow.id = "arrowAuto" + i + "_" + new Date().getTime();
                }
                arrow.chart = _this;
                arrows[i] = arrow;

                var arrowAxis = arrow.axis;
                if (AmCharts.isString(arrowAxis)) {
                    arrow.axis = AmCharts.getObjById(_this.axes, arrowAxis);
                }

                if (!arrow.axis) {
                    arrow.axis = _this.axes[0];
                }
                if (isNaN(arrow.value)) {
                    arrow.setValue(arrow.axis.startValue);
                }
                if (isNaN(arrow.previousValue)) {
                    arrow.previousValue = arrow.axis.startValue;
                }
            }
            _this.setLegendData(arrows);
            _this.drawChart();
            _this.totalFrames = _this.startDuration * AmCharts.updateRate;
        },


        drawChart: function() {
            var _this = this;
            AmCharts.AmAngularGauge.base.drawChart.call(_this);

            var container = _this.container;
            var realWidth = _this.updateWidth();
            _this.realWidth = realWidth;

            var realHeight = _this.updateHeight();
            _this.realHeight = realHeight;

            var toCoordinate = AmCharts.toCoordinate;
            var marginLeft = toCoordinate(_this.marginLeft, realWidth);
            var marginRight = toCoordinate(_this.marginRight, realWidth);
            var marginTop = toCoordinate(_this.marginTop, realHeight) + _this.getTitleHeight();
            var marginBottom = toCoordinate(_this.marginBottom, realHeight);

            var radius = toCoordinate(_this.radius, realWidth, realHeight);
            var pureWidth = realWidth - marginLeft - marginRight;
            var pureHeight = realHeight - marginTop - marginBottom + _this.extraHeight;

            if (!radius) {
                radius = Math.min(pureWidth, pureHeight) / 2;
            }

            if (radius < _this.minRadius) {
                radius = _this.minRadius;
            }
            _this.radiusReal = radius;

            _this.centerX = (realWidth - marginLeft - marginRight) / 2 + marginLeft;
            _this.centerY = (realHeight - marginTop - marginBottom) / 2 + marginTop + _this.extraHeight / 2;

            if (!isNaN(_this.gaugeX)) {
                _this.centerX = _this.gaugeX;
            }

            if (!isNaN(_this.gaugeY)) {
                _this.centerY = _this.gaugeY;
            }

            var circleAlpha = _this.faceAlpha;
            var circleBorderAlpha = _this.faceBorderAlpha;
            var background;

            if (circleAlpha > 0 || circleBorderAlpha > 0) {
                background = AmCharts.circle(container, radius, _this.faceColor, circleAlpha, _this.faceBorderWidth, _this.faceBorderColor, circleBorderAlpha, false);
                background.translate(_this.centerX, _this.centerY);
                background.toBack();

                var facePattern = _this.facePattern;

                if (facePattern) {
                    background.pattern(facePattern, NaN, _this.path);
                }

            }

            var maxWidth = 0;
            var maxHeight = 0;
            var i;
            for (i = 0; i < _this.axes.length; i++) {
                var axis = _this.axes[i];
                var axisRadius = axis.radius;
                axis.radiusReal = AmCharts.toCoordinate(axisRadius, _this.radiusReal);
                axis.draw();

                var dp = 1;

                if (String(axisRadius).indexOf("%") !== -1) {
                    dp = 1 + (100 - Number(axisRadius.substr(0, axisRadius.length - 1))) / 100;
                }

                if (axis.width * dp > maxWidth) {
                    maxWidth = axis.width * dp;
                }

                if (axis.height * dp > maxHeight) {
                    maxHeight = axis.height * dp;
                }
            }

            var legend = _this.legend;

            if (legend) {
                legend.invalidateSize();
            }

            if (_this.adjustSize && !_this.sizeAdjusted) {
                if (background) {
                    var bgBox = background.getBBox();
                    if (bgBox.width > maxWidth) {
                        maxWidth = bgBox.width;
                    }
                    if (bgBox.height > maxHeight) {
                        maxHeight = bgBox.height;
                    }
                }

                var emptySpace = 0;
                if (pureHeight > maxHeight || pureWidth > maxWidth) {
                    emptySpace = Math.min(pureHeight - maxHeight, pureWidth - maxWidth);
                }
                if (emptySpace > 5) {
                    //_this.extraWidth = pureWidth - maxWidth;
                    _this.extraHeight = emptySpace;
                    _this.sizeAdjusted = true;
                    _this.validateNow();
                }
            }

            var n = _this.arrows.length;
            var arrow;

            for (i = 0; i < n; i++) {
                arrow = _this.arrows[i];
                arrow.drawnAngle = NaN;
            }

            _this.dispDUpd();
        },

        validateSize: function() {
            var _this = this;
            _this.extraWidth = 0;
            _this.extraHeight = 0;
            _this.sizeAdjusted = false;
            _this.chartCreated = false;
            AmCharts.AmAngularGauge.base.validateSize.call(_this);
        },

        addArrow: function(arrow) {
            var _this = this;
            _this.arrows.push(arrow);
        },

        removeArrow: function(arrow) {
            var _this = this;

            AmCharts.removeFromArray(_this.arrows, arrow);
            _this.validateNow();
        },


        removeAxis: function(axis) {
            var _this = this;

            AmCharts.removeFromArray(_this.axes, axis);
            _this.validateNow();
        },


        drawArrow: function(arrow, angle) {
            // ARROW
            var _this = this;
            var bcn = "gauge-arrow";
            if (arrow.set) {
                arrow.set.remove();
            }
            var container = _this.container;
            arrow.set = container.set();
            AmCharts.setCN(_this, arrow.set, bcn);
            AmCharts.setCN(_this, arrow.set, bcn + "-" + arrow.id);

            if (!arrow.hidden) {
                var axis = arrow.axis;
                var radius = axis.radiusReal;

                var centerX = axis.centerXReal;
                var centerY = axis.centerYReal;
                var arrowStartWidth = arrow.startWidth;
                var arrowEndWidth = arrow.endWidth;
                var arrowInnerRadius = AmCharts.toCoordinate(arrow.innerRadius, axis.radiusReal);
                var arrowRadius = AmCharts.toCoordinate(arrow.radius, axis.radiusReal);

                if (!axis.inside) {
                    arrowRadius -= 15;
                }

                var nailColor = arrow.nailColor;
                if (!nailColor) {
                    nailColor = arrow.color;
                }

                var borderColor = arrow.nailColor;
                if (!borderColor) {
                    borderColor = arrow.color;
                }

                if (arrow.nailRadius > 0) {
                    var arrowNail = AmCharts.circle(container, arrow.nailRadius, nailColor, arrow.nailAlpha, arrow.nailBorderThickness, nailColor, arrow.nailBorderAlpha);
                    AmCharts.setCN(_this, arrowNail, bcn + "-nail");

                    arrow.set.push(arrowNail);
                    arrowNail.translate(centerX, centerY);
                }

                if (isNaN(arrowRadius)) {
                    arrowRadius = radius - axis.tickLength;
                }

                var sin = Math.sin((angle) / (180) * Math.PI);
                var cos = Math.cos((angle) / (180) * Math.PI);

                var sin2 = Math.sin((angle + 90) / (180) * Math.PI);
                var cos2 = Math.cos((angle + 90) / (180) * Math.PI);

                var ax = [centerX - arrowStartWidth / 2 * sin2 + arrowInnerRadius * sin, centerX + arrowRadius * sin - arrowEndWidth / 2 * sin2, centerX + arrowRadius * sin + arrowEndWidth / 2 * sin2, centerX + arrowStartWidth / 2 * sin2 + arrowInnerRadius * sin];
                var ay = [centerY + arrowStartWidth / 2 * cos2 - arrowInnerRadius * cos, centerY - arrowRadius * cos + arrowEndWidth / 2 * cos2, centerY - arrowRadius * cos - arrowEndWidth / 2 * cos2, centerY - arrowStartWidth / 2 * cos2 - arrowInnerRadius * cos];
                var arrowGraphics = AmCharts.polygon(container, ax, ay, arrow.color, arrow.alpha, 1, borderColor, arrow.borderAlpha, undefined, true);

                AmCharts.setCN(_this, arrowGraphics, bcn);

                arrow.set.push(arrowGraphics);

                _this.graphsSet.push(arrow.set);
            }
        },

        setValue: function(arrow, value) {
            var _this = this;
            if (arrow.axis) {
                if (arrow.axis.value2angle) {
                    arrow.frame = 0;
                    arrow.previousValue = arrow.value;
                }
            }
            arrow.value = value;

            var legend = _this.legend;
            if (legend) {
                legend.updateValues();
            }

            if (_this.accessible) {
                if (_this.background) {
                    _this.makeAccessible(_this.background, value);
                }
            }
        },

        handleLegendEvent: function(event) {
            var _this = this;
            var type = event.type;
            var dItem = event.dataItem;

            if (!_this.legend.data) {
                if (dItem) {
                    switch (type) {
                        case "hideItem":
                            _this.hideArrow(dItem);
                            break;
                        case "showItem":
                            _this.showArrow(dItem);
                            break;
                    }
                }
            }
        },

        hideArrow: function(arrow) {
            arrow.set.hide();
            arrow.hidden = true;
        },

        showArrow: function(arrow) {
            arrow.set.show();
            arrow.hidden = false;
        },

        updateAnimations: function() {
            var _this = this;
            AmCharts.AmAngularGauge.base.updateAnimations.call(_this);
            var n = _this.arrows.length;
            var arrow;
            var axis;
            for (var i = 0; i < n; i++) {
                arrow = _this.arrows[i];
                if (arrow.axis) {
                    if (arrow.axis.value2angle) {
                        var value;
                        if (arrow.frame >= _this.totalFrames) {
                            value = arrow.value;
                        } else {
                            arrow.frame++;

                            if (arrow.clockWiseOnly) {
                                if (arrow.value < arrow.previousValue) {
                                    axis = arrow.axis;
                                    arrow.previousValue = arrow.previousValue - (axis.endValue - axis.startValue);
                                }
                            }
                            var effect = AmCharts.getEffect(_this.startEffect);
                            value = AmCharts[effect](0, arrow.frame, arrow.previousValue, arrow.value - arrow.previousValue, _this.totalFrames);

                            if (isNaN(value)) {
                                value = arrow.value;
                            }
                        }

                        var angle = arrow.axis.value2angle(value);
                        if (arrow.drawnAngle != angle) {
                            _this.drawArrow(arrow, angle);
                            arrow.drawnAngle = angle;
                        }
                    }
                }
            }

            var axes = _this.axes;
            for (var a = axes.length - 1; a >= 0; a--) {
                axis = axes[a];
                if (axis.bands) {
                    for (var b = axis.bands.length - 1; b >= 0; b--) {
                        var band = axis.bands[b];
                        if (band.update) {
                            band.update();
                        }
                    }
                }
            }
        }
    });
})();