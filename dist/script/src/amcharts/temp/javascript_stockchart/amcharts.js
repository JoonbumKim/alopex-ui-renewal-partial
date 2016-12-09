(function() {
    "use strict";

    var AmCharts;
    if (!window.AmCharts) {
        AmCharts = {};
        window.AmCharts = AmCharts;
        AmCharts.themes = {};
        AmCharts.maps = {};
        AmCharts.inheriting = {};
        AmCharts.charts = [];
        AmCharts.onReadyArray = [];
        AmCharts.useUTC = false;
        AmCharts.updateRate = 60;
        AmCharts.uid = 0;
        AmCharts.lang = {};
        AmCharts.translations = {};
        AmCharts.mapTranslations = {};
        AmCharts.windows = {};
        AmCharts.initHandlers = [];
        AmCharts.amString = "am";
        AmCharts.pmString = "pm";        
    } else {
        AmCharts = window.AmCharts;
    }


    AmCharts.Class = function(init) {
        var cstr = function() {
            if (arguments[0] === AmCharts.inheriting) {
                return;
            }
            this.events = {};
            this.construct.apply(this, arguments);
        };


        if (init.inherits) {
            cstr.prototype = new init.inherits(AmCharts.inheriting);
            cstr.base = init.inherits.prototype;
            delete init.inherits;
        } else {
            cstr.prototype.createEvents = function() {
                for (var i = 0; i < arguments.length; i++) {
                    this.events[arguments[i]] = [];
                }
            };

            cstr.prototype.listenTo = function(obj, event, handler) {

                this.removeListener(obj, event, handler);

                obj.events[event].push({
                    handler: handler,
                    scope: this
                });
            };

            cstr.prototype.addListener = function(event, handler, obj) {

                this.removeListener(this, event, handler);
                if (event) {
                    if (this.events[event]) {
                        this.events[event].push({
                            handler: handler,
                            scope: obj
                        });
                    }
                }
            };

            cstr.prototype.removeListener = function(obj, event, handler) {
                if (obj) {
                    if (obj.events) {
                        var ev = obj.events[event];
                        if (ev) {
                            for (var i = ev.length - 1; i >= 0; i--) {
                                if (ev[i].handler === handler) {
                                    ev.splice(i, 1);
                                }
                            }
                        }
                    }
                }
            };

            cstr.prototype.fire = function(event) {
                var type = event.type;
                var handlers = this.events[type];
                for (var i = 0; i < handlers.length; i++) {
                    var h = handlers[i];
                    h.handler.call(h.scope, event);
                }
            };
        }

        for (var p in init) {
            cstr.prototype[p] = init[p];
        }

        return cstr;

    };


    AmCharts.addChart = function(chart) {

        if (window.requestAnimationFrame) {
            if (!AmCharts.animationRequested) {
                AmCharts.animationRequested = true;
                window.requestAnimationFrame(AmCharts.update);
            }
        } else {
            if (!AmCharts.updateInt) {
                AmCharts.updateInt = setInterval(function() {
                    AmCharts.update();
                }, Math.round(1000 / AmCharts.updateRate));
            }
        }

        AmCharts.charts.push(chart);
    };

    AmCharts.removeChart = function(chart) {
        var charts = AmCharts.charts;
        for (var i = charts.length - 1; i >= 0; i--) {
            if (charts[i] == chart) {
                charts.splice(i, 1);
            }
        }
        if (charts.length === 0) {
            if (AmCharts.updateInt) {
                clearInterval(AmCharts.updateInt);
                AmCharts.updateInt = NaN;
            }
        }
    };


    AmCharts.isModern = true;
    AmCharts.getIEVersion = function() {
        var rv = 0;
        var ua;
        var re;
        if (navigator.appName == "Microsoft Internet Explorer") {
            ua = navigator.userAgent;
            re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
            if (re.exec(ua) !== null)
                rv = parseFloat(RegExp.$1);
        }
        return rv;
    };

    AmCharts.applyLang = function(language, chart) {

        var translations = AmCharts.translations;

        chart.dayNames = AmCharts.extend({}, AmCharts.dayNames);
        chart.shortDayNames = AmCharts.extend({}, AmCharts.shortDayNames);
        chart.monthNames = AmCharts.extend({}, AmCharts.monthNames);
        chart.shortMonthNames = AmCharts.extend({}, AmCharts.shortMonthNames);

        chart.amString = "am";
        chart.pmString = "pm";

        if (translations) {
            var lang = translations[language];

            if (lang) {
                AmCharts.lang = lang;
                if (lang.monthNames) {
                    chart.dayNames = AmCharts.extend({}, lang.dayNames);
                    chart.shortDayNames = AmCharts.extend({}, lang.shortDayNames);
                    chart.monthNames = AmCharts.extend({}, lang.monthNames);
                    chart.shortMonthNames = AmCharts.extend({}, lang.shortMonthNames);
                }
                if (lang.am) {
                    chart.amString = lang.am;
                }
                if (lang.pm) {
                    chart.pmString = lang.pm;
                }
            }
        }

        AmCharts.amString = chart.amString;
        AmCharts.pmString = chart.pmString;        
    };


    AmCharts.IEversion = AmCharts.getIEVersion();
    if (AmCharts.IEversion < 9 && AmCharts.IEversion > 0) {
        AmCharts.isModern = false;
        AmCharts.isIE = true;
    }

    AmCharts.dx = 0;
    AmCharts.dy = 0;

    // check browser
    if (document.addEventListener || window.opera) {
        AmCharts.isNN = true;
        AmCharts.isIE = false;
        AmCharts.dx = 0.5;
        AmCharts.dy = 0.5;
    }

    if (document.attachEvent) {
        AmCharts.isNN = false;
        AmCharts.isIE = true;
        if (!AmCharts.isModern) {
            AmCharts.dx = 0;
            AmCharts.dy = 0;
        }
    }

    if (window.chrome) {
        AmCharts.chrome = true;
    }

    AmCharts.handleMouseUp = function(e) {
        var charts = AmCharts.charts;

        for (var i = 0; i < charts.length; i++) {
            var chart = charts[i];

            if (chart) {
                if (chart.handleReleaseOutside) {
                    chart.handleReleaseOutside(e);
                }
            }
        }
    };

    AmCharts.handleMouseMove = function(e) {
        var charts = AmCharts.charts;
        for (var i = 0; i < charts.length; i++) {
            var chart = charts[i];

            if (chart) {
                if (chart.handleMouseMove) {
                    chart.handleMouseMove(e);
                }
            }
        }
    };

    AmCharts.handleWheel = function(e) {
        var charts = AmCharts.charts;
        for (var i = 0; i < charts.length; i++) {
            var chart = charts[i];
            if (chart) {
                if (chart.mouseIsOver) {
                    if (chart.mouseWheelScrollEnabled || chart.mouseWheelZoomEnabled) {
                        if (chart.handleWheel) {
                            chart.handleWheel(e);
                        }
                    }
                    // else {
                        //if (e.stopPropagation) {
                        //    e.stopPropagation();
                        //}
                    //}
                    break;
                }
            }
        }
    };

    AmCharts.resetMouseOver = function() {
        var charts = AmCharts.charts;
        for (var i = 0; i < charts.length; i++) {
            var chart = charts[i];

            if (chart) {
                chart.mouseIsOver = false;
            }
        }
    };


    AmCharts.ready = function(value) {
        AmCharts.onReadyArray.push(value);
    };

    AmCharts.handleLoad = function() {
        AmCharts.isReady = true;
        var onReadyArray = AmCharts.onReadyArray;
        for (var i = 0; i < onReadyArray.length; i++) {
            var fnc = onReadyArray[i];
            if (isNaN(AmCharts.processDelay)) {
                fnc();
            } else {
                setTimeout(fnc, AmCharts.processDelay * i);
            }
        }
    };

    AmCharts.addInitHandler = function(method, types) {
        AmCharts.initHandlers.push({
            method: method,
            types: types
        });
    };

    AmCharts.callInitHandler = function(chart) {
        var initHandlers = AmCharts.initHandlers;
        if (AmCharts.initHandlers) {
            for (var i = 0; i < initHandlers.length; i++) {
                var handler = initHandlers[i];
                if (handler.types) {

                    if (AmCharts.isInArray(handler.types, chart.type)) {
                        handler.method(chart);
                    }
                } else {
                    handler.method(chart);
                }
            }
        }
    };


    AmCharts.getUniqueId = function() {
        AmCharts.uid++;
        return "AmChartsEl-" + AmCharts.uid;
    };

    // add events for NN/FF/etc
    if (AmCharts.isNN) {
        document.addEventListener("mousemove", AmCharts.handleMouseMove);
        document.addEventListener("mouseup", AmCharts.handleMouseUp, true);
        window.addEventListener("load", AmCharts.handleLoad, true);
        window.addEventListener("DOMMouseScroll", AmCharts.handleWheel, true);
        document.addEventListener("mousewheel", AmCharts.handleWheel, true);        
    }

    if (AmCharts.isIE) {
        document.attachEvent("onmousemove", AmCharts.handleMouseMove);
        document.attachEvent("onmouseup", AmCharts.handleMouseUp);
        window.attachEvent("onload", AmCharts.handleLoad);
        document.attachEvent("onmousewheel", AmCharts.handleWheel);
    }



    AmCharts.clear = function() {

        var charts = AmCharts.charts;
        if (charts) {
            for (var i = charts.length - 1; i >= 0; i--) {
                charts[i].clear();
            }
        }

        if (AmCharts.updateInt) {
            clearInterval(AmCharts.updateInt);
        }

        AmCharts.charts = [];

        if (AmCharts.isNN) {
            document.removeEventListener("mousemove", AmCharts.handleMouseMove, true);
            //window.removeEventListener("resize", AmCharts.handleResize, true);
            document.removeEventListener("mouseup", AmCharts.handleMouseUp, true);
            window.removeEventListener("load", AmCharts.handleLoad, true);
            window.removeEventListener("DOMMouseScroll", AmCharts.handleWheel, true);
            document.removeEventListener("mousewheel", AmCharts.handleWheel, true);            
        }

        if (AmCharts.isIE) {
            document.detachEvent("onmousemove", AmCharts.handleMouseMove);
            //window.detachEvent("onresize", AmCharts.handleResize);
            document.detachEvent("onmouseup", AmCharts.handleMouseUp);
            window.detachEvent("onload", AmCharts.handleLoad);
        }
    };

    AmCharts.makeChart = function(div, config, amDelay) {
        var type = config.type;
        var theme = config.theme;

        if (AmCharts.isString(theme)) {
            theme = AmCharts.themes[theme];
            config.theme = theme;
        }

        var chart;
        switch (type) {
            case "serial":
                chart = new AmCharts.AmSerialChart(theme);
                break;
            case "xy":
                chart = new AmCharts.AmXYChart(theme);
                break;
            case "pie":
                chart = new AmCharts.AmPieChart(theme);
                break;
            case "radar":
                chart = new AmCharts.AmRadarChart(theme);
                break;
            case "gauge":
                chart = new AmCharts.AmAngularGauge(theme);
                break;
            case "funnel":
                chart = new AmCharts.AmFunnelChart(theme);
                break;
            case "map":
                chart = new AmCharts.AmMap(theme);
                break;
            case "stock":
                chart = new AmCharts.AmStockChart(theme);
                break;
            case "gantt":
                chart = new AmCharts.AmGanttChart(theme);
                break;
        }

        AmCharts.extend(chart, config);

        if (AmCharts.isReady) {
            if (isNaN(amDelay)) {
                chart.write(div);
            } else {
                setTimeout(function() {
                    AmCharts.realWrite(chart, div);
                }, amDelay);
            }
        } else {
            AmCharts.ready(function() {
                if (isNaN(amDelay)) {
                    chart.write(div);
                } else {
                    setTimeout(function() {
                        AmCharts.realWrite(chart, div);
                    }, amDelay);
                }
            });
        }
        return chart;
    };

    AmCharts.realWrite = function(chart, div) {
        chart.write(div);
    };


    AmCharts.updateCount = 0;
    AmCharts.validateAt = Math.round(AmCharts.updateRate / 10);

    AmCharts.update = function() {
        var charts = AmCharts.charts;
        AmCharts.updateCount++;
        var update = false;
        if (AmCharts.updateCount == AmCharts.validateAt) {
            update = true;
            AmCharts.updateCount = 0;
        }

        if (charts) {
            for (var i = charts.length - 1; i >= 0; i--) {
                if (charts[i].update) {
                    charts[i].update();
                }
                if (update) {
                    if (charts[i].autoResize) {
                        if (charts[i].validateSize) {
                            charts[i].validateSize();
                        }
                    } else {
                        if (charts[i].premeasure) {
                            charts[i].premeasure();
                        }
                    }
                }
            }
        }
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(AmCharts.update);
        }
    };

    AmCharts.bezierX = 3;
    AmCharts.bezierY = 6;

    if (document.readyState == "complete") {
        AmCharts.handleLoad();
    }
})();
 (function() {
     "use strict";
     var AmCharts = window.AmCharts;
     AmCharts.toBoolean = function(str, ifUndefined) {
         if (str === undefined) {
             return ifUndefined;
         }
         switch (String(str).toLowerCase()) {
             case "true":
             case "yes":
             case "1":
                 return true;
             case "false":
             case "no":
             case "0":
             case null:
                 return false;
             default:
                 return Boolean(str);
         }
     };

     AmCharts.removeFromArray = function(arr, el) {
         var i;
         if (el !== undefined && arr !== undefined) {
             for (i = arr.length - 1; i >= 0; i--) {
                 if (arr[i] == el) {
                     arr.splice(i, 1);
                     continue;
                 }
             }
         }
     };

     AmCharts.getPath = function() {
         var scripts = document.getElementsByTagName("script");
         if (scripts) {
             for (var i = 0; i < scripts.length; i++) {
                 var url = scripts[i].src;
                 if (url.search(/\/(amcharts|ammap)\.js/) !== -1)
                     return url.replace(/\/(amcharts|ammap)\.js.*/, "/");
             }
         }
         return;
     };



     AmCharts.normalizeUrl = function(url) {
         return "" !== url && url.search(/\/$/) === -1 ? url + "/" : url;
     };

     AmCharts.isAbsolute = function(url) {
         return url.search(/^http[s]?:|^\//) === 0;
     };

     AmCharts.isInArray = function(arr, item) {
         for (var i = 0; i < arr.length; i++) {
             if (arr[i] == item) {
                 return true;
             }
         }
         return false;
     };

     AmCharts.getDecimals = function(val) {
         var numbersAfterDecimal = 0;
         if (!isNaN(val)) {
             var str = String(val);

             if (str.indexOf("e-") != -1) {
                 numbersAfterDecimal = Number(str.split("-")[1]);
             } else if (str.indexOf(".") != -1) {
                 numbersAfterDecimal = str.split(".")[1].length;
             }
         }
         return numbersAfterDecimal;
     };

     AmCharts.wordwrap = function(str, m, b, c) {
         //  discuss at: http://phpjs.org/functions/wordwrap/
         // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
         // improved by: Nick Callen
         // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
         // improved by: Sakimori
         //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
         // bugfixed by: Michael Grier
         // bugfixed by: Feras ALHAEK

         var i, j, l, s, r;

         str += "";

         if (m < 1) {
             return str;
         }

         for (i = -1, l = (r = str.split(/\r\n|\n|\r/)).length; ++i < l; r[i] += s) {
             for (s = r[i], r[i] = ""; s.length > m; r[i] += AmCharts.trim(s.slice(0, j)) + ((s = s.slice(j)).length ? b : "")) {
                 j = c == 2 || (j = s.slice(0, m + 1).match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length || c == 1 && m || j.input.length + (j = s.slice(m).match(/^\S*/))[0].length;
             }
             s = AmCharts.trim(s);

         }

         return r.join(b);
     };

     AmCharts.trim = function(str) {
         return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
     };

     AmCharts.wrappedText = function(container, value, color, fontFamily, textSize, align, bold, textWidth) {
         var text = AmCharts.text(container, value, color, fontFamily, textSize, align, bold);

         if (text) {
             var bbox = text.getBBox();

             if (bbox.width > textWidth) {

                 var br = "\n";
                 if (!AmCharts.isModern) {
                     br = "<br>";
                 }

                 var count = value.length;
                 var symbolWidth = bbox.width / count;
                 var allowedCount = Math.floor(textWidth / symbolWidth);
                 if (allowedCount > 2) {
                     allowedCount -= 2;
                 }
                 value = AmCharts.wordwrap(value, allowedCount, br, true);
                 text.remove();
                 text = AmCharts.text(container, value, color, fontFamily, textSize, align, bold);
             }
         }

         return text;
     };

     AmCharts.getStyle = function(oElm, strCssRule) {
         var strValue = "";
         if (document.defaultView && document.defaultView.getComputedStyle) {
             try {
                 strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
             } catch (err) {
                 //void
             }
         } else if (oElm.currentStyle) {
             strCssRule = strCssRule.replace(/\-(\w)/g, function(strMatch, p1) {
                 return p1.toUpperCase();
             });
             strValue = oElm.currentStyle[strCssRule];
         }
         return strValue;
     };

     AmCharts.removePx = function(value) {
         if (value !== undefined) {
             return Number(value.substring(0, value.length - 2));
         }
     };

     AmCharts.getURL = function(url, urlTarget) {
         if (url) {
             if (urlTarget == "_self" || !urlTarget) {
                 window.location.href = url;
             } else if (urlTarget == "_top" && window.top) {
                 window.top.location.href = url;
             } else if (urlTarget == "_parent" && window.parent) {
                 window.parent.location.href = url;
             } else if (urlTarget == "_blank") {
                 window.open(url);
             } else {
                 var iFrame = document.getElementsByName(urlTarget)[0];

                 if (iFrame) {
                     iFrame.src = url;
                 } else {
                     var wind = AmCharts.windows[urlTarget];
                     if (wind) {
                         if (wind.opener && !wind.opener.closed) {
                             wind.location.href = url;
                         } else {
                             AmCharts.windows[urlTarget] = window.open(url);
                         }
                     } else {
                         AmCharts.windows[urlTarget] = window.open(url);
                     }
                 }
             }
         }
     };


     AmCharts.ifArray = function(arr) {
         if (arr) {
             if ((typeof arr) == "object") {
                 if (arr.length > 0) {
                     return true;
                 }
             }
         }
         return false;
     };


     AmCharts.callMethod = function(method, arr) {
         var j;
         for (j = 0; j < arr.length; j++) {
             var object = arr[j];

             if (object) {
                 if (object[method]) {
                     object[method]();
                 }
                 var length = object.length;
                 if (length > 0) {
                     var i;
                     for (i = 0; i < length; i++) {
                         var obj = object[i];
                         if (obj) {
                             if (obj[method]) {
                                 obj[method]();
                             }
                         }
                     }
                 }
             }
         }
     };


     AmCharts.toNumber = function(val) {
         if (typeof(val) == "number") {
             return val;
         } else {
             return Number(String(val).replace(/[^0-9\-.]+/g, ""));
         }
     };

     AmCharts.toColor = function(str) {
         if (str !== "" && str !== undefined) {
             if (str.indexOf(",") != -1) {
                 var arr = str.split(",");
                 var i;
                 for (i = 0; i < arr.length; i++) {
                     var cc = arr[i].substring(arr[i].length - 6, arr[i].length);
                     arr[i] = "#" + cc;
                 }
                 str = arr;
             } else {
                 str = str.substring(str.length - 6, str.length);
                 str = "#" + str;
             }
         }
         return str;
     };

     AmCharts.toCoordinate = function(val, full, full2) {
         var coord;

         if (val !== undefined) {
             val = String(val);
             if (full2) {
                 if (full2 < full) {
                     full = full2;
                 }
             }

             coord = Number(val);
             // if there is ! in the beginning, then calculate right or bottom
             if (val.indexOf("!") != -1) {
                 coord = full - Number(val.substr(1));
             }
             // if values is set in percents, recalculate to pixels
             if (val.indexOf("%") != -1) {
                 coord = full * Number(val.substr(0, val.length - 1)) / 100;
             }
         }
         return coord;
     };

     AmCharts.fitToBounds = function(number, min, max) {
         if (number < min) {
             number = min;
         }

         if (number > max) {
             number = max;
         }
         return number;
     };

     AmCharts.isDefined = function(value) {
         if (value === undefined) {
             return false;
         } else {
             return true;
         }
     };

     AmCharts.stripNumbers = function(str) {
         return str.replace(/[0-9]+/g, "");
     };

     AmCharts.roundTo = function(num, precision) {
         if (precision < 0) {
             return num;
         } else {
             var d = Math.pow(10, precision);
             return Math.round(num * d) / d;
         }
     };

     AmCharts.toFixed = function(number, precision) {
         var num = String(Math.round(number * Math.pow(10, precision)));

         if (precision > 0) {
             var length = num.length;

             if (length < precision) {
                 var i;
                 for (i = 0; i < precision - length; i++) {
                     num = "0" + num;
                 }
             }

             var base = num.substring(0, num.length - precision);
             if (base === "") {
                 base = 0;
             }
             return base + "." + num.substring(num.length - precision, num.length);
         } else {
             return String(num);
         }
     };

     AmCharts.formatDuration = function(duration, interval, result, units, maxInterval, numberFormat) {
         var intervals = AmCharts.intervals;
         var decimalSeparator = numberFormat.decimalSeparator;
         if (duration >= intervals[interval].contains) {
             var value = duration - Math.floor(duration / intervals[interval].contains) * intervals[interval].contains;

             if (interval == "ss") {
                 value = AmCharts.formatNumber(value, numberFormat);
                 if (value.split(decimalSeparator)[0].length == 1) {
                     value = "0" + value;
                 }
             } else {
                 value = AmCharts.roundTo(value, numberFormat.precision);
             }


             if ((interval == "mm" || interval == "hh") && value < 10) {
                 value = "0" + value;
             }

             result = value + "" + units[interval] + "" + result;

             duration = Math.floor(duration / intervals[interval].contains);
             interval = intervals[interval].nextInterval;

             return AmCharts.formatDuration(duration, interval, result, units, maxInterval, numberFormat);
         } else {
             if (interval == "ss") {
                 duration = AmCharts.formatNumber(duration, numberFormat);

                 if (duration.split(decimalSeparator)[0].length == 1) {
                     duration = "0" + duration;
                 }
             }

             if ((interval == "mm" || interval == "hh") && duration < 10) {
                 duration = "0" + duration;
             }

             result = duration + "" + units[interval] + "" + result;

             if (intervals[maxInterval].count > intervals[interval].count) {
                 var i;
                 for (i = intervals[interval].count; i < intervals[maxInterval].count; i++) {
                     interval = intervals[interval].nextInterval;

                     if (interval == "ss" || interval == "mm" || interval == "hh") {
                         result = "00" + units[interval] + "" + result;
                     } else if (interval == "DD") {
                         result = "0" + units[interval] + "" + result;
                     }
                 }
             }
             if (result.charAt(result.length - 1) == ":") {
                 result = result.substring(0, result.length - 1);
             }
             return result;
         }
     };


     AmCharts.formatNumber = function(num, format, zeroCount, addPlus, addPercents) {
         num = AmCharts.roundTo(num, format.precision);


         if (isNaN(zeroCount)) {
             zeroCount = format.precision;
         }

         var dSep = format.decimalSeparator;
         var tSep = format.thousandsSeparator;

         // check if negative
         var negative;
         if (num < 0) {
             negative = "-";
         } else {
             negative = "";
         }

         num = Math.abs(num);

         var numStr = String(num);

         var exp = false;

         if (numStr.indexOf("e") != -1) {
             exp = true;
         }

         if (zeroCount >= 0 && !exp) {
             numStr = AmCharts.toFixed(num, zeroCount);
         }
         var formated = "";
         if (!exp) {
             var array = numStr.split(".");

             var string = String(array[0]);
             var i;
             for (i = string.length; i >= 0; i = i - 3) {
                 if (i != string.length) {
                     if (i !== 0) {
                         formated = string.substring(i - 3, i) + tSep + formated;
                     } else {
                         formated = string.substring(i - 3, i) + formated;
                     }
                 } else {
                     formated = string.substring(i - 3, i);
                 }
             }

             if (array[1] !== undefined) {
                 formated = formated + dSep + array[1];
             }
             if (zeroCount !== undefined && zeroCount > 0 && formated != "0") {
                 formated = AmCharts.addZeroes(formated, dSep, zeroCount);
             }
         } else {
             formated = numStr;
         }

         formated = negative + formated;

         if (negative === "" && addPlus === true && num !== 0) {
             formated = "+" + formated;
         }

         if (addPercents === true) {
             formated = formated + "%";
         }

         return (formated);
     };

     AmCharts.addZeroes = function(number, dSep, count) {
         var array = number.split(dSep);

         if (array[1] === undefined && count > 0) {
             array[1] = "0";
         }
         if (array[1].length < count) {
             array[1] = array[1] + "0";
             return AmCharts.addZeroes(array[0] + dSep + array[1], dSep, count);
         } else {
             if (array[1] !== undefined) {
                 return array[0] + dSep + array[1];
             } else {
                 return array[0];
             }
         }
     };

     AmCharts.scientificToNormal = function(num) {
         var str = String(num);
         var newNumber;
         var arr = str.split("e");
         var i;
         // small numbers
         if (arr[1].substr(0, 1) == "-") {
             newNumber = "0.";

             for (i = 0; i < Math.abs(Number(arr[1])) - 1; i++) {
                 newNumber += "0";
             }
             newNumber += arr[0].split(".").join("");
         } else {
             var digitsAfterDec = 0;
             var tmp = arr[0].split(".");
             if (tmp[1]) {
                 digitsAfterDec = tmp[1].length;
             }

             newNumber = arr[0].split(".").join("");

             for (i = 0; i < Math.abs(Number(arr[1])) - digitsAfterDec; i++) {
                 newNumber += "0";
             }
         }
         return newNumber;
     };


     AmCharts.toScientific = function(num, dSep) {
         if (num === 0) {
             return "0";
         }
         var exponent = Math.floor(Math.log(Math.abs(num)) * Math.LOG10E);
         var mantissa = String(mantissa).split(".").join(dSep);
         return String(mantissa) + "e" + exponent;
     };


     AmCharts.randomColor = function() {
         return "#" + ("00000" + (Math.random() * 16777216 << 0).toString(16)).substr(-6);
     };

     AmCharts.hitTest = function(bbox1, bbox2, abort) {
         var hit = false;

         var x1 = bbox1.x;
         var x2 = bbox1.x + bbox1.width;
         var y1 = bbox1.y;
         var y2 = bbox1.y + bbox1.height;
         var isInRectangle = AmCharts.isInRectangle;

         if (!hit) {
             hit = isInRectangle(x1, y1, bbox2);
         }
         if (!hit) {
             hit = isInRectangle(x1, y2, bbox2);
         }
         if (!hit) {
             hit = isInRectangle(x2, y1, bbox2);
         }
         if (!hit) {
             hit = isInRectangle(x2, y2, bbox2);
         }
         if (!hit && abort !== true) {
             hit = AmCharts.hitTest(bbox2, bbox1, true);
         }
         return hit;
     };

     AmCharts.isInRectangle = function(x, y, box) {
         if (x >= box.x - 5 && x <= box.x + box.width + 5 && y >= box.y - 5 && y <= box.y + box.height + 5) {
             return true;
         } else {
             return false;
         }
     };

     AmCharts.isPercents = function(s) {
         if (String(s).indexOf("%") != -1) {
             return true;
         }
     };


     AmCharts.formatValue = function(string, data, keys, numberFormatter, addString, usePrefixes, prefixesSmall, prefixesBig) {
         if (data) {
             if (addString === undefined) {
                 addString = "";
             }
             var i;
             for (i = 0; i < keys.length; i++) {
                 var key = keys[i];
                 var value = data[key];
                 if (value !== undefined) {
                     var stringValue;
                     if (usePrefixes) {
                         stringValue = AmCharts.addPrefix(value, prefixesBig, prefixesSmall, numberFormatter);
                     } else {
                         stringValue = AmCharts.formatNumber(value, numberFormatter);
                     }
                     var regExp = new RegExp("\\[\\[" + addString + "" + key + "\\]\\]", "g");
                     string = string.replace(regExp, stringValue);
                 }
             }
         }
         return string;
     };

     AmCharts.formatDataContextValue = function(string, data) {
         if (string) {
             var items = string.match(/\[\[.*?\]\]/g);
             var i;
             for (i = 0; i < items.length; i++) {
                 var item = items[i];
                 var pureItem = item.substr(2, item.length - 4);

                 if (data[pureItem] !== undefined) {
                     var regExp = new RegExp("\\[\\[" + pureItem + "\\]\\]", "g");
                     string = string.replace(regExp, data[pureItem]);
                 }
             }
         }
         return string;
     };

     AmCharts.massReplace = function(string, replObj) {
         var key;
         for (key in replObj) {
             if (replObj.hasOwnProperty(key)) {
                 var value = replObj[key];
                 if (value === undefined) {
                     value = "";
                 }
                 string = string.replace(key, value);
             }
         }

         return string;
     };

     AmCharts.cleanFromEmpty = function(str) {
         return str.replace(/\[\[[^\]]*\]\]/g, "");
     };

     AmCharts.addPrefix = function(value, prefixesOfBigNumbers, prefixesOfSmallNumbers, numberFormat, strict) {
         var str = AmCharts.formatNumber(value, numberFormat);
         var sign = "";
         var c;
         var newVal;
         var prec;

         if (value === 0) {
             return "0";
         }

         if (value < 0) {
             sign = "-";
         }

         value = Math.abs(value);

         if (value > 1) {
             for (c = prefixesOfBigNumbers.length - 1; c > -1; c--) {
                 if (value >= prefixesOfBigNumbers[c].number) {
                     newVal = value / prefixesOfBigNumbers[c].number;

                     prec = Number(numberFormat.precision);

                     if (prec < 1) {
                         prec = 1;
                     }

                     var newVal2 = AmCharts.roundTo(newVal, prec);

                     var nf = {
                         precision: -1,
                         decimalSeparator: numberFormat.decimalSeparator,
                         thousandsSeparator: numberFormat.thousandsSeparator
                     };

                     var stringValue = AmCharts.formatNumber(newVal2, nf);

                     if (strict) {
                         if (newVal != newVal2) {
                             continue;
                         }
                     }

                     str = sign + "" + stringValue + "" + prefixesOfBigNumbers[c].prefix;
                     break;
                 }
             }
         } else {
             for (c = 0; c < prefixesOfSmallNumbers.length; c++) {
                 if (value <= prefixesOfSmallNumbers[c].number) {
                     newVal = value / prefixesOfSmallNumbers[c].number;
                     prec = Math.abs(Math.floor(Math.log(newVal) * Math.LOG10E));
                     newVal = AmCharts.roundTo(newVal, prec);

                     str = sign + "" + newVal + "" + prefixesOfSmallNumbers[c].prefix;
                     break;
                 }
             }
         }
         return str;
     };


     AmCharts.remove = function(obj) {
         if (obj) {
             obj.remove();
         }
     };


     AmCharts.getEffect = function(val) {
         if (val == ">") {
             val = "easeOutSine";
         }
         if (val == "<") {
             val = "easeInSine";
         }
         if (val == "elastic") {
             val = "easeOutElastic";
         }
         return val;
     };

     AmCharts.getObjById = function(objects, id) {

         var currentObj;
         var i;
         for (i = 0; i < objects.length; i++) {
             var obj = objects[i];
             if (obj.id == id) {
                 currentObj = obj;
                 break;
             }
         }
         return currentObj;
     };

     AmCharts.applyTheme = function(object, theme, className) {

         if (!theme) {
             theme = AmCharts.theme;
         }

         try{
            theme = JSON.parse(JSON.stringify(theme));
         }
         catch(err){

         }

         if (theme) {
             if (theme[className]) {
                 AmCharts.extend(object, theme[className]);
             }
         }
     };


     AmCharts.isString = function(value) {
         if (typeof(value) == "string") {
             return true;
         } else {
             return false;
         }
     };

     AmCharts.extend = function(obj1, obj2, firstIsPriority) {
         var i;
         if (!obj1) {
             obj1 = {};
         }
         for (i in obj2) {
             if (firstIsPriority) {
                 if (!obj1.hasOwnProperty(i)) {
                     obj1[i] = obj2[i];
                 }
             } else {                
                 obj1[i] = obj2[i];
             }

         }
         return obj1;
     };


     AmCharts.copyProperties = function(fromObject, toObject) {
         var i;
         for (i in fromObject) {
             if (fromObject.hasOwnProperty(i)) {
                 if (i != "events" && fromObject[i] !== undefined && typeof(fromObject[i]) != "function" && i != "cname") {
                     toObject[i] = fromObject[i];
                 }
             }
         }
     };

     AmCharts.processObject = function(object, ObjectClass, theme, secondIsPriority) {
         if ((object instanceof ObjectClass) === false) {
             if (secondIsPriority) {
                 object = AmCharts.extend(new ObjectClass(theme), object);
             } else {
                 object = AmCharts.extend(object, new ObjectClass(theme), true);
             }
             if (object.listeners) {
                 for (var e in object.listeners) {
                     var ev = object.listeners[e];
                     object.addListener(ev.event, ev.method);
                 }
             }
         }
         return object;
     };


     AmCharts.fixNewLines = function(text) {
         //if (!AmCharts.isModern) {
         var from = "\\n";
         var to = "<br />";
         var rgx = new RegExp(from, "g");
         if (text) {
             text = text.replace(rgx, to);
         }
         //}
         return text;
     };


     AmCharts.fixBrakes = function(text) {
         if (!AmCharts.isModern) {
             text = AmCharts.fixNewLines(text);
         } else {
             var from = "<br>";
             var to = "\n";
             var rgx = new RegExp(from, "g");
             if (text) {
                 text = text.replace(rgx, to);
             }
         }
         return text;
     };


     AmCharts.deleteObject = function(object, size) {
         if (!object) {
             return;
         }
         if (size === undefined || size === null) {
             size = 20;
         }
         if (size === 0) {
             return;
         }
         if (Object.prototype.toString.call(object) === "[object Array]") {
             for (var i = 0; i < object.length; i++) {
                 AmCharts.deleteObject(object[i], size - 1);
                 object[i] = null;
             }
         } else if (object && !object.tagName) { // added 3.3.6 to avoid destroying dom
             //}else{
             try {
                 object.theme = null;
                 for (var prop in object) {
                     if (!object[prop]) {
                         continue;
                     }
                     if (typeof object[prop] == "object") {
                         AmCharts.deleteObject(object[prop], size - 1);
                     }
                     if (typeof object[prop] == "function") {
                         continue;
                     }
                     object[prop] = null;
                 }
             } catch (e) {}
         }
         object = null;
     };



     // borrowed from jquery
     AmCharts.bounce = function(x, t, b, c, d) {
         if ((t /= d) < (1 / 2.75)) {
             return c * (7.5625 * t * t) + b;
         } else if (t < (2 / 2.75)) {
             return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
         } else if (t < (2.5 / 2.75)) {
             return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
         } else {
             return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
         }
     };

     AmCharts.easeInOutQuad = function(x, t, b, c, d) {
         t /= d / 2;
         if (t < 1) return c / 2 * t * t + b;
         t--;
         return -c / 2 * (t * (t - 2) - 1) + b;
     };

     AmCharts.easeInSine = function(x, t, b, c, d) {
         return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
     };
     AmCharts.easeOutSine = function(x, t, b, c, d) {
         return c * Math.sin(t / d * (Math.PI / 2)) + b;
     };

     AmCharts.easeOutElastic = function(x, t, b, c, d) {
         var s = 1.70158;
         var p = 0;
         var a = c;
         if (t === 0) {
             return b;
         }
         if ((t /= d) == 1) {
             return b + c;
         }
         if (!p) {
             p = d * 0.3;
         }
         if (a < Math.abs(c)) {
             a = c;
             s = p / 4;
         } else {
             s = p / (2 * Math.PI) * Math.asin(c / a);
         }
         return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
     };


     AmCharts.fixStepE = function(stepE) {
         // fix step e beacuse of roundoff problem
         var stepExp = stepE.toExponential(0);
         var stepExpArr = stepExp.split("e");
         var base = Number(stepExpArr[0]);
         var mant = Number(stepExpArr[1]);
         if (base == 9) {
             mant++;
         }
         return AmCharts.generateNumber(1, mant);
     };

     AmCharts.generateNumber = function(num, mant) {
         var zeroes = "";
         var n;

         if (mant < 0) {
             n = Math.abs(mant) - 1;
         } else {
             n = Math.abs(mant);
         }

         var i;
         for (i = 0; i < n; i++) {
             zeroes = zeroes + "0";
         }
         if (mant < 0) {
             return Number("0." + zeroes + String(num));
         } else {
             return Number(String(num) + zeroes);
         }
     };

     AmCharts.setCN = function(chart, element, name, skipPrefix) {
         if (chart.addClassNames) {
             if (element) {
                 var node = element.node;
                 if (node) {
                     if (name) {
                         var currentName = node.getAttribute("class");

                         var prefix = chart.classNamePrefix + "-";
                         if (skipPrefix) {
                             prefix = "";
                         }

                         if (currentName) {
                             node.setAttribute("class", currentName + " " + prefix + name);
                         } else {
                             node.setAttribute("class", prefix + name);
                         }
                     }
                 }
             }
         }
     };

     AmCharts.removeCN = function(chart, element, name) {
         if (element) {
             var node = element.node;
             if (node) {
                 if (name) {
                     var list = node.classList;
                     if (list) {
                         var prefix = chart.classNamePrefix + "-";
                         list.remove(prefix + name);
                     }
                 }
             }
         }
     };


     AmCharts.parseDefs = function(defs, obj) {
         for (var d in defs) {
             var type = typeof(defs[d]);
             var el;
             if (defs[d].length > 0 && type == "object") {
                 for (var i = 0; i < defs[d].length; i++) {
                     el = document.createElementNS(AmCharts.SVG_NS, d);
                     obj.appendChild(el);
                     AmCharts.parseDefs(defs[d][i], el);
                 }
             } else {
                 if (type == "object") {
                     el = document.createElementNS(AmCharts.SVG_NS, d);
                     obj.appendChild(el);
                     AmCharts.parseDefs(defs[d], el);
                 } else {
                     obj.setAttribute(d, defs[d]);
                 }
             }
         }
     };
 })();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.AxisBase = AmCharts.Class({
        construct: function(theme) {
            var _this = this;
            _this.createEvents("clickItem", "rollOverItem", "rollOutItem");
            _this.dx = 0;
            _this.dy = 0;
            _this.x = 0;
            _this.y = 0;
            _this.titleDY = 0;
            //_this.axisWidth;
            _this.axisThickness = 1;
            _this.axisColor = "#000000";
            _this.axisAlpha = 1;
            _this.tickLength = 5;
            _this.gridCount = 5;
            _this.gridAlpha = 0.15;
            _this.gridThickness = 1;
            _this.gridColor = "#000000";
            _this.dashLength = 0;
            _this.labelFrequency = 1;
            _this.showFirstLabel = true;
            _this.showLastLabel = true;
            _this.fillColor = "#FFFFFF";
            _this.fillAlpha = 0;
            _this.labelsEnabled = true;
            _this.labelRotation = 0;
            _this.autoGridCount = true;
            //_this.valueRollOverColor = "#CC0000";
            _this.offset = 0;
            _this.guides = [];
            _this.visible = true;
            _this.counter = 0;
            _this.guides = [];
            _this.inside = false;
            _this.ignoreAxisWidth = false;
            //_this.boldLabels;
            //_this.titleColor;
            //_this.titleFontSize;
            _this.minHorizontalGap = 75;
            _this.minVerticalGap = 35;
            _this.titleBold = true;
            _this.minorGridEnabled = false;
            _this.minorGridAlpha = 0.07;
            _this.autoWrap = false;
            _this.titleAlign = "middle";
            _this.labelOffset = 0;
            _this.bcn = "axis-";
            _this.centerLabels = false;

            _this.firstDayOfWeek = 1;
            _this.boldPeriodBeginning = true;
            _this.markPeriodChange = true;
            _this.centerLabelOnFullPeriod = true;

            _this.periods = [{
                period: "fff",
                count: 1
            }, {
                period: "fff",
                count: 5
            }, {
                period: "fff",
                count: 10
            }, {
                period: "fff",
                count: 50
            }, {
                period: "fff",
                count: 100
            }, {
                period: "fff",
                count: 500
            }, {
                period: "ss",
                count: 1
            }, {
                period: "ss",
                count: 5
            }, {
                period: "ss",
                count: 10
            }, {
                period: "ss",
                count: 30
            }, {
                period: "mm",
                count: 1
            }, {
                period: "mm",
                count: 5
            }, {
                period: "mm",
                count: 10
            }, {
                period: "mm",
                count: 30
            }, {
                period: "hh",
                count: 1
            }, {
                period: "hh",
                count: 3
            }, {
                period: "hh",
                count: 6
            }, {
                period: "hh",
                count: 12
            }, {
                period: "DD",
                count: 1
            }, {
                period: "DD",
                count: 2
            }, {
                period: "DD",
                count: 3
            }, {
                period: "DD",
                count: 4
            }, {
                period: "DD",
                count: 5
            }, {
                period: "WW",
                count: 1
            }, {
                period: "MM",
                count: 1
            }, {
                period: "MM",
                count: 2
            }, {
                period: "MM",
                count: 3
            }, {
                period: "MM",
                count: 6
            }, {
                period: "YYYY",
                count: 1
            }, {
                period: "YYYY",
                count: 2
            }, {
                period: "YYYY",
                count: 5
            }, {
                period: "YYYY",
                count: 10
            }, {
                period: "YYYY",
                count: 50
            }, {
                period: "YYYY",
                count: 100
            }];

            _this.dateFormats = [{
                period: "fff",
                format: "NN:SS.QQQ"
            }, {
                period: "ss",
                format: "JJ:NN:SS"
            }, {
                period: "mm",
                format: "JJ:NN"
            }, {
                period: "hh",
                format: "JJ:NN"
            }, {
                period: "DD",
                format: "MMM DD"
            }, {
                period: "WW",
                format: "MMM DD"
            }, {
                period: "MM",
                format: "MMM"
            }, {
                period: "YYYY",
                format: "YYYY"
            }];

            _this.nextPeriod = {
                fff: "ss",
                ss: "mm",
                mm: "hh",
                hh: "DD",
                DD: "MM",
                MM: "YYYY"
            };

            // new properties
            //_this.balloon;

            AmCharts.applyTheme(_this, theme, "AxisBase");
        },

        zoom: function(start, end) {
            var _this = this;

            _this.start = start;
            _this.end = end;
            _this.dataChanged = true;
            _this.draw();
        },

        fixAxisPosition: function() {
            var _this = this;
            var pos = _this.position;

            if (_this.orientation == "H") {
                if (pos == "left") {
                    pos = "bottom";
                }
                if (pos == "right") {
                    pos = "top";
                }
            } else {
                if (pos == "bottom") {
                    pos = "left";
                }
                if (pos == "top") {
                    pos = "right";
                }
            }

            _this.position = pos;
        },

        init: function() {
            var _this = this;
            _this.createBalloon();
        },


        draw: function() {
            var _this = this;
            var chart = _this.chart;
            _this.prevBX = NaN;
            _this.prevBY = NaN;
            _this.allLabels = [];
            _this.counter = 0;
            _this.destroy();
            _this.fixAxisPosition();
            _this.setBalloonBounds();
            _this.labels = [];

            var container = chart.container;

            var set = container.set();
            chart.gridSet.push(set);
            _this.set = set;

            var labelsSet = container.set();
            chart.axesLabelsSet.push(labelsSet);

            _this.labelsSet = labelsSet;

            _this.axisLine = new _this.axisRenderer(_this);

            if (_this.autoGridCount) {
                var c;

                if (_this.orientation == "V") {
                    c = _this.height / _this.minVerticalGap;
                    if (c < 3) {
                        c = 3;
                    }
                } else {
                    c = _this.width / _this.minHorizontalGap;
                }
                _this.gridCountR = Math.max(c, 1);
            } else {
                _this.gridCountR = _this.gridCount;
            }
            _this.axisWidth = _this.axisLine.axisWidth;
            _this.addTitle();
        },


        setOrientation: function(rotate) {
            var _this = this;
            if (rotate) {
                _this.orientation = "H";
            } else {
                _this.orientation = "V";
            }
        },


        addTitle: function() {
            var _this = this;
            var title = _this.title;

            _this.titleLabel = null;

            if (title) {
                var chart = _this.chart;

                var color = _this.titleColor;
                if (color === undefined) {
                    color = chart.color;
                }

                var titleFontSize = _this.titleFontSize;
                if (isNaN(titleFontSize)) {
                    titleFontSize = chart.fontSize + 1;
                }
                var titleLabel = AmCharts.text(chart.container, title, color, chart.fontFamily, titleFontSize, _this.titleAlign, _this.titleBold);
                AmCharts.setCN(chart, titleLabel, _this.bcn + "title");
                _this.titleLabel = titleLabel;
            }
        },

        positionTitle: function() {
            var _this = this;
            var titleLabel = _this.titleLabel;
            if (titleLabel) {
                var tx;
                var ty;
                var labelsSet = _this.labelsSet;
                var bbox = {};

                if (labelsSet.length() > 0) {
                    bbox = labelsSet.getBBox();
                } else {
                    bbox.x = 0;
                    bbox.y = 0;
                    bbox.width = _this.width;
                    bbox.height = _this.height;

                    if (AmCharts.VML) {
                        bbox.y += _this.y;
                        bbox.x += _this.x;
                    }
                }
                labelsSet.push(titleLabel);

                var bx = bbox.x;
                var by = bbox.y;

                if (AmCharts.VML) {
                    by -= _this.y;
                    bx -= this.x;
                }

                var bw = bbox.width;
                var bh = bbox.height;

                var w = _this.width;
                var h = _this.height;

                var r = 0;

                var fontSize = titleLabel.getBBox().height / 2;
                var inside = _this.inside;
                var titleAlign = _this.titleAlign;

                switch (_this.position) {
                    case "top":
                        if (titleAlign == "left") {
                            tx = -1;
                        } else if (titleAlign == "right") {
                            tx = w;
                        } else {
                            tx = w / 2;
                        }

                        ty = by - 10 - fontSize;
                        break;
                    case "bottom":
                        if (titleAlign == "left") {
                            tx = -1;
                        } else if (titleAlign == "right") {
                            tx = w;
                        } else {
                            tx = w / 2;
                        }

                        ty = by + bh + 10 + fontSize;
                        break;
                    case "left":
                        tx = bx - 10 - fontSize;

                        if (inside) {
                            tx -= 5;
                        }
                        if (titleAlign == "left") {
                            ty = h + 1;
                        } else if (titleAlign == "right") {
                            ty = -1;
                        } else {
                            ty = h / 2;
                        }
                        r = -90;

                        ty += _this.titleDY;

                        break;
                    case "right":
                        tx = bx + bw + 10 + fontSize;
                        if (inside) {
                            tx += 7;
                        }
                        if (titleAlign == "left") {
                            ty = h + 2;
                        } else if (titleAlign == "right") {
                            ty = -2;
                        } else {
                            ty = h / 2;
                        }
                        ty += _this.titleDY;
                        r = -90;
                        break;
                }

                if (_this.marginsChanged) {
                    titleLabel.translate(tx, ty);
                    _this.tx = tx;
                    _this.ty = ty;
                } else {
                    titleLabel.translate(_this.tx, _this.ty);
                }

                _this.marginsChanged = false;

                if (!isNaN(_this.titleRotation)) {
                    r = _this.titleRotation;
                }
                if (r !== 0) {
                    titleLabel.rotate(r);
                }
            }
        },

        pushAxisItem: function(axisItem, above) {
            var _this = this;

            var axisItemGraphics = axisItem.graphics();
            if (axisItemGraphics.length() > 0) {
                if (above) {
                    _this.labelsSet.push(axisItemGraphics);
                } else {
                    _this.set.push(axisItemGraphics);
                }
            }

            var label = axisItem.getLabel();
            if (label) {
                _this.labelsSet.push(label);

                label.click(function(ev) {
                    _this.handleMouse(ev, axisItem, "clickItem");
                }).touchend(function(ev) {
                    _this.handleMouse(ev, axisItem, "clickItem");
                }).mouseover(function(ev) {
                    _this.handleMouse(ev, axisItem, "rollOverItem");
                }).mouseout(function(ev) {
                    _this.handleMouse(ev, axisItem, "rollOutItem");
                });
            }
        },

        handleMouse: function(ev, axisItem, type) {
            var _this = this;

            var e = {
                type: type,
                value: axisItem.value,
                serialDataItem: axisItem.serialDataItem,
                axis: _this,
                target: axisItem.label,
                chart: _this.chart,
                event: ev
            };
            _this.fire(e);
        },

        addGuide: function(guide) {
            var _this = this;
            var guides = _this.guides;
            var isInArray = false;
            var c = guides.length;
            for (var i = 0; i < guides.length; i++) {
                if (guides[i] == guide) {
                    isInArray = true;
                    c = i;
                }
            }

            guide = AmCharts.processObject(guide, AmCharts.Guide, _this.theme);

            if (!guide.id) {
                guide.id = "guideAuto" + c + "_" + new Date().getTime();
            }

            if (!isInArray) {
                guides.push(guide);
            }
        },

        removeGuide: function(guide) {
            var guides = this.guides;
            var i;
            for (i = 0; i < guides.length; i++) {
                if (guides[i] == guide) {
                    guides.splice(i, 1);
                }
            }
        },

        handleGuideOver: function(guide) {
            var _this = this;
            clearTimeout(_this.chart.hoverInt);
            var bbox = guide.graphics.getBBox();
            var x = _this.x + bbox.x + bbox.width / 2;
            var y = _this.y + bbox.y + bbox.height / 2;
            var color = guide.fillColor;
            if (color === undefined) {
                color = guide.lineColor;
            }
            _this.chart.showBalloon(guide.balloonText, color, true, x, y);
        },

        handleGuideOut: function() {
            this.chart.hideBalloon();
        },

        addEventListeners: function(graphics, guide) {
            var _this = this;
            graphics.mouseover(function() {
                _this.handleGuideOver(guide);
            });
            graphics.touchstart(function() {
                _this.handleGuideOver(guide);
            });
            graphics.mouseout(function() {
                _this.handleGuideOut(guide);
            });
        },


        getBBox: function() {
            var _this = this;
            var bbox;
            if (_this.labelsSet) {
                bbox = _this.labelsSet.getBBox();
            }

            if (bbox) {
                if (!AmCharts.VML) {
                    bbox = ({
                        x: (bbox.x + _this.x),
                        y: (bbox.y + _this.y),
                        width: bbox.width,
                        height: bbox.height
                    });
                }
            } else {
                bbox = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                };
            }
            return bbox;
        },

        destroy: function() {
            var _this = this;

            AmCharts.remove(_this.set);
            AmCharts.remove(_this.labelsSet);

            var axisLine = _this.axisLine;
            if (axisLine) {
                AmCharts.remove(axisLine.axisSet);
            }
            AmCharts.remove(_this.grid0);
        },

        chooseMinorFrequency: function(frequency) {
            for (var i = 10; i > 0; i--) {
                if (frequency / i == Math.round(frequency / i)) {
                    return frequency / i;
                }
            }
        },


        parseDatesDraw: function() {
            var _this = this;
            var i;
            var chart = _this.chart;
            var showFirstLabel = _this.showFirstLabel;
            var showLastLabel = _this.showLastLabel;
            var coord;
            var valueText = "";
            var minPeriodObj = AmCharts.extractPeriod(_this.minPeriod);
            var minDuration = AmCharts.getPeriodDuration(minPeriodObj.period, minPeriodObj.count);
            var previousTime;
            var previousTimeReal;
            var periodWidth;
            var periodCount;
            var time;
            var biggerPeriodChanged;
            var dateFormat;
            var firstDayOfWeek = _this.firstDayOfWeek;
            var boldPeriodBeginning = _this.boldPeriodBeginning;
            var bold;
            var axisItem;
            var minorGridEnabled = _this.minorGridEnabled;
            var minorGridFrequency;
            var gridAlphaReal = _this.gridAlpha;
            var minorPeriodDuration;
            var mAxisItem;
            var periodObj = _this.choosePeriod(0);
            var period = periodObj.period;
            var periodMultiplier = periodObj.count;
            var periodDuration = AmCharts.getPeriodDuration(period, periodMultiplier);

            // check if this period is not shorter then minPeriod
            if (periodDuration < minDuration) {
                period = minPeriodObj.period;
                periodMultiplier = minPeriodObj.count;
                periodDuration = minDuration;
            }

            var periodReal = period;

            // weeks don't have format, swith to days
            if (periodReal == "WW") {
                periodReal = "DD";
            }

            _this.stepWidth = _this.getStepWidth(_this.timeDifference);
            var gridCount = Math.ceil(_this.timeDifference / periodDuration) + 5;

            //previousTime = AmCharts.resetDateToMin(new Date(_this.startTime - periodDuration * periodMultiplier), period, periodMultiplier, firstDayOfWeek).getTime();
            // 2.10.7
            previousTime = AmCharts.resetDateToMin(new Date(_this.startTime - periodDuration), period, periodMultiplier, firstDayOfWeek).getTime();

            var startTime = previousTime;

            // if this is pure period (no numbers and not a week), place the value in the middle
            if ((periodReal == period && periodMultiplier == 1 && _this.centerLabelOnFullPeriod) || _this.autoWrap || _this.centerLabels) {
                periodWidth = periodDuration * _this.stepWidth;
                if (_this.autoWrap && !_this.centerLabels) {
                    periodWidth = -periodWidth; // dirty hack to know about align
                }
            }

            _this.cellWidth = minDuration * _this.stepWidth;

            periodCount = Math.round(previousTime / periodDuration);

            var start = -1;
            if (periodCount / 2 == Math.round(periodCount / 2)) {
                start = -2;
                previousTime -= periodDuration;
            }

            var initialTime = _this.firstTime;
            // delta time is used to fix a problem which happens because month duration is not the same all the time
            var deltaTime = 0;
            var labelShift = 0;

            if (minorGridEnabled && periodMultiplier > 1) {
                minorGridFrequency = _this.chooseMinorFrequency(periodMultiplier);
                minorPeriodDuration = AmCharts.getPeriodDuration(period, minorGridFrequency);
                if (period == "DD") {
                    minorPeriodDuration += AmCharts.getPeriodDuration("hh"); // solves minor grid and daylight saving prob
                }
                if (period == "fff") {
                    minorPeriodDuration = 1;
                }
            }

            if (_this.gridCountR > 0) {
                if (gridCount - 5 - start > _this.autoRotateCount) {
                    if (!isNaN(_this.autoRotateAngle)) {
                        _this.labelRotationR = _this.autoRotateAngle; // not very good
                    }
                }

                for (i = start; i <= gridCount; i++) {

                    //time = previousTime + periodDuration * 1.1;
                    time = initialTime + periodDuration * (i + Math.floor((startTime - initialTime) / periodDuration)) - deltaTime;

                    if (period == "DD") {
                        time += 3600000; // this should fix daylight saving errors - otherwise double grid appears or the gap between grid lines is bigger
                    }
                    time = AmCharts.resetDateToMin(new Date(time), period, periodMultiplier, firstDayOfWeek).getTime();

                    //if (time != previousTime) {
                    // fixing not equal month duration problem
                    if (period == "MM") {
                        var mult = (time - previousTime) / periodDuration;
                        if ((time - previousTime) / periodDuration >= 1.5) {
                            //time = time - (mult - 1) * periodDuration; 3.3.6
                            time = time - (mult - 1) * periodDuration + AmCharts.getPeriodDuration("DD", 3); // add extra 3 days, as month length is not equal and might remove too much sometimes
                            time = AmCharts.resetDateToMin(new Date(time), period, 1).getTime(); // this is new (3.3.7), as we add 3 days above
                            deltaTime += periodDuration;
                        }
                    }

                    coord = (time - _this.startTime) * _this.stepWidth;

                    if (chart.type == "radar") {
                        coord = _this.axisWidth - coord;
                        if (coord < 0 || coord > _this.axisWidth) {
                            continue;
                        }
                    } else {
                        if (_this.rotate) {
                            if (_this.type == "date") {
                                if (_this.gridPosition == "middle") {
                                    labelShift = -periodDuration * _this.stepWidth / 2;
                                }
                            }

                        } else {
                            // value axis
                            if (_this.type == "date") {
                                coord = _this.axisWidth - coord;
                            }
                        }
                    }

                    biggerPeriodChanged = false;

                    if (_this.nextPeriod[periodReal]) {
                        biggerPeriodChanged = _this.checkPeriodChange(_this.nextPeriod[periodReal], 1, time, previousTime, periodReal);
                    }

                    bold = false;

                    if (biggerPeriodChanged && _this.markPeriodChange) {
                        dateFormat = _this.dateFormatsObject[_this.nextPeriod[periodReal]];

                        if (_this.twoLineMode) {
                            dateFormat = _this.dateFormatsObject[periodReal] + "\n" + dateFormat;
                            dateFormat = AmCharts.fixBrakes(dateFormat);
                        }
                        bold = true;
                    } else {
                        dateFormat = _this.dateFormatsObject[periodReal];
                    }

                    if (!boldPeriodBeginning) {
                        bold = false;
                    }

                    _this.currentDateFormat = dateFormat;

                    valueText = AmCharts.formatDate(new Date(time), dateFormat, chart);

                    if ((i == start && !showFirstLabel) || (i == gridCount && !showLastLabel)) {
                        valueText = " ";
                    }

                    if (_this.labelFunction) {
                        valueText = _this.labelFunction(valueText, new Date(time), this, period, periodMultiplier, previousTimeReal).toString();
                    }

                    if (_this.boldLabels) {
                        bold = true;
                    }
                    // draw grid
                    axisItem = new _this.axisItemRenderer(this, coord, valueText, false, periodWidth, labelShift, false, bold);
                    _this.pushAxisItem(axisItem);

                    previousTime = time;
                    previousTimeReal = time;

                    // minor grid
                    if (!isNaN(minorGridFrequency)) {
                        for (var g = 1; g < periodMultiplier; g = g + minorGridFrequency) {
                            _this.gridAlpha = _this.minorGridAlpha;
                            //var mtime = time + minorPeriodDuration * (g + 0.1 + Math.floor((startTime - initialTime) / minorPeriodDuration));
                            var mtime = time + minorPeriodDuration * g;
                            mtime = AmCharts.resetDateToMin(new Date(mtime), period, minorGridFrequency, firstDayOfWeek).getTime();
                            var mcoord = (mtime - _this.startTime) * _this.stepWidth;
                            mAxisItem = new _this.axisItemRenderer(this, mcoord, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
                            _this.pushAxisItem(mAxisItem);
                        }
                    }
                    _this.gridAlpha = gridAlphaReal;
                }
            }
        },


        choosePeriod: function(index) {
            var _this = this;
            var periodDuration = AmCharts.getPeriodDuration(_this.periods[index].period, _this.periods[index].count);
            var count = Math.ceil(_this.timeDifference / periodDuration);
            var periods = _this.periods;

            var gridCount = _this.gridCountR;
            if (_this.timeDifference < periodDuration && index > 0) {
                return periods[index - 1];
            }

            if (count <= gridCount) {
                return periods[index];
            } else {
                if (index + 1 < periods.length) {
                    return _this.choosePeriod(index + 1);
                } else {
                    return periods[index];
                }
            }
        },

        getStepWidth: function(valueCount) {
            var _this = this;
            var stepWidth;

            if (_this.startOnAxis) {
                stepWidth = _this.axisWidth / (valueCount - 1);

                if (valueCount == 1) {
                    stepWidth = _this.axisWidth;
                }
            } else {
                stepWidth = _this.axisWidth / valueCount;
            }
            return stepWidth;
        },



        timeZoom: function(startTime, endTime) {
            var _this = this;
            _this.startTime = startTime;
            _this.endTime = endTime;
        },

        minDuration: function() {
            var _this = this;
            var minPeriodObj = AmCharts.extractPeriod(_this.minPeriod);
            return AmCharts.getPeriodDuration(minPeriodObj.period, minPeriodObj.count);
        },

        checkPeriodChange: function(period, count, time, previousTime, previousPeriod) {
            var currentDate = new Date(time);
            var previousDate = new Date(previousTime);

            var firstDayOfWeek = this.firstDayOfWeek;
            var realCount = count;
            if (period == "DD") {
                count = 1;
            }

            var current = AmCharts.resetDateToMin(currentDate, period, count, firstDayOfWeek).getTime();
            var previous = AmCharts.resetDateToMin(previousDate, period, count, firstDayOfWeek).getTime();

            if (period == "DD" && previousPeriod != "hh") {
                // removing one hour to avoid daylight saving problem
                if (current - previous < AmCharts.getPeriodDuration(period, realCount) - AmCharts.getPeriodDuration("hh", 1)) { // 3.14.6 fixing prob with equal spacing, removed =.
                    return false;
                }
            }

            if (current != previous) {
                return true;
            } else {
                return false;
            }
        },


        generateDFObject: function() {
            var _this = this;
            _this.dateFormatsObject = {};
            var i;
            for (i = 0; i < _this.dateFormats.length; i++) {
                var df = _this.dateFormats[i];
                _this.dateFormatsObject[df.period] = df.format;
            }
        },


        /// BALLOON
        hideBalloon: function() {
            var _this = this;
            if (_this.balloon) {
                if (_this.balloon.hide) {
                    _this.balloon.hide();
                }
            }
            _this.prevBX = NaN;
            _this.prevBY = NaN;
        },

        formatBalloonText: function(text) {
            return text;
        },

        showBalloon: function(x, y, format, skip) {
            var _this = this;

            var offset = _this.offset;
            switch (_this.position) {
                case "bottom":
                    y = _this.height + offset;
                    break;
                case "top":
                    y = -offset;
                    break;
                case "left":
                    x = -offset;
                    break;
                case "right":
                    x = _this.width + offset;
                    break;
            }

            if (!format) {
                format = _this.currentDateFormat;
            }

            var text;
            if (_this.orientation == "V") {
                if (y < 0 || y > _this.height) {
                    return;
                }

                if (!isNaN(y)) {
                    y = _this.adjustBalloonCoordinate(y, skip);
                    text = _this.coordinateToValue(y);
                } else {
                    _this.hideBalloon();
                    return;
                }
            } else {
                if (x < 0 || x > _this.width) {
                    return;
                }
                if (!isNaN(x)) {
                    x = _this.adjustBalloonCoordinate(x, skip);
                    text = _this.coordinateToValue(x);
                } else {
                    _this.hideBalloon();
                    return;
                }
            }

            var chart = _this.chart;
            var index;
            var chartCursor = chart.chartCursor;
            if (chartCursor) {
                index = chartCursor.index;
            }

            if (_this.balloon && text !== undefined) {
                if (_this.balloon.enabled) {
                    if (_this.balloonTextFunction) {
                        if (_this.type == "date" || _this.parseDates === true) {
                            text = new Date(text);
                        }
                        text = _this.balloonTextFunction(text);
                    } else if (_this.balloonText) {
                        text = _this.formatBalloonText(_this.balloonText, index, format);
                    } else {
                        if (!isNaN(text)) {
                            text = _this.formatValue(text, format);
                        }
                    }

                    if (x != _this.prevBX || y != _this.prevBY) {
                        _this.balloon.setPosition(x, y);
                        _this.prevBX = x;
                        _this.prevBY = y;
                        if (text) {
                            _this.balloon.showBalloon(text);
                        }
                    }
                }
            }
        },

        adjustBalloonCoordinate: function(coordinate) {
            return coordinate;
        },

        createBalloon: function() {
            var _this = this;
            var chart = _this.chart;
            var chartCursor = chart.chartCursor;

            if (chartCursor) {
                var cursorPosition = chartCursor.cursorPosition;
                if (cursorPosition != "mouse") {
                    _this.stickBalloonToCategory = true;
                }
                if (cursorPosition == "start") {
                    _this.stickBalloonToStart = true;
                }
                if (_this.cname == "ValueAxis") {
                    _this.stickBalloonToCategory = false;
                }
            }

            if (_this.balloon) {
                if (_this.balloon.destroy) {
                    _this.balloon.destroy();
                }
                AmCharts.extend(_this.balloon, chart.balloon, true);
            }

        },

        setBalloonBounds: function() {
            var _this = this;
            var balloon = _this.balloon;

            if (balloon) {
                var chart = _this.chart;

                balloon.cornerRadius = 0;
                balloon.shadowAlpha = 0;
                balloon.borderThickness = 1;
                balloon.borderAlpha = 1;
                balloon.adjustBorderColor = false;
                balloon.showBullet = false;

                _this.balloon = balloon;
                balloon.chart = chart;
                balloon.mainSet = chart.plotBalloonsSet;
                balloon.pointerWidth = _this.tickLength;
                if (_this.parseDates || _this.type == "date") {
                    balloon.pointerWidth = 0;
                }
                balloon.className = _this.id;

                // set pointer orientation
                var pointerOrientation = "V";

                if (_this.orientation == "V") {
                    pointerOrientation = "H";
                }

                // otherwise the balloon will not follow line excatly
                if (!_this.stickBalloonToCategory) {
                    balloon.animationDuration = 0;
                }
                var position = _this.position;

                // set bounds
                var l, r, t, b;
                var inside = _this.inside;
                var width = _this.width;
                var height = _this.height;
                var max = 1000;


                switch (position) {
                    case "bottom":
                        l = 0;
                        r = width;
                        if (inside) {
                            t = 0;
                            b = height;
                        } else {
                            t = height;
                            b = height + max;
                        }

                        break;
                    case "top":
                        l = 0;
                        r = width;
                        if (inside) {
                            t = 0;
                            b = height;
                        } else {
                            t = -max;
                            b = 0;
                        }
                        break;
                    case "left":
                        t = 0;
                        b = height;
                        if (inside) {
                            l = 0;
                            r = width;
                        } else {
                            l = -max;
                            r = 0;
                        }
                        break;
                    case "right":
                        t = 0;
                        b = height;
                        if (inside) {
                            l = 0;
                            r = width;
                        } else {
                            l = width;
                            r = width + max;
                        }
                        break;

                }
                if (!balloon.drop) {
                    balloon.pointerOrientation = pointerOrientation;
                }
                balloon.setBounds(l, t, r, b);
            }
        }
    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.ValueAxis = AmCharts.Class({

        inherits: AmCharts.AxisBase,

        construct: function(theme) {
            var _this = this;
            _this.cname = "ValueAxis";
            _this.createEvents("axisChanged", "logarithmicAxisFailed", "axisZoomed", "axisIntZoomed");
            AmCharts.ValueAxis.base.construct.call(this, theme);
            _this.dataChanged = true;
            //_this.gridCount = 8;
            _this.stackType = "none";
            _this.position = "left";
            _this.unitPosition = "right";
            _this.integersOnly = false;
            _this.includeGuidesInMinMax = false;
            _this.includeHidden = false;
            _this.recalculateToPercents = false;
            _this.includeAllValues = false;
            //_this.duration;
            _this.durationUnits = {
                DD: "d. ",
                hh: ":",
                mm: ":",
                ss: ""
            };
            _this.scrollbar = false;
            //_this.maxDecCount;
            _this.baseValue = 0;
            _this.radarCategoriesEnabled = true;
            _this.axisFrequency = 1;
            _this.gridType = "polygons";
            _this.useScientificNotation = false;
            _this.axisTitleOffset = 10;
            _this.pointPosition = "axis";
            _this.minMaxMultiplier = 1;
            _this.logGridLimit = 2;
            _this.treatZeroAs = 0;
            _this.totalTextOffset = 0;
            _this.minPeriod = "ss";
            _this.relativeStart = 0;
            _this.relativeEnd = 1;
            //_this.zeroGridAlpha;

            // _this.labelFunction

            AmCharts.applyTheme(_this, theme, _this.cname);
        },

        updateData: function() {
            var _this = this;
            if (_this.gridCountR <= 0) {
                _this.gridCountR = 1;
            }
            _this.totals = [];
            _this.data = _this.chart.chartData;

            var chart = _this.chart;

            if (chart.type != "xy") {
                _this.stackGraphs("smoothedLine");
                _this.stackGraphs("line");
                _this.stackGraphs("column");
                _this.stackGraphs("step");
            }

            if (_this.recalculateToPercents) {
                _this.recalculate();
            }

            if (_this.synchronizationMultiplier && _this.synchronizeWith) {

                if (AmCharts.isString(_this.synchronizeWith)) {
                    _this.synchronizeWith = chart.getValueAxisById(_this.synchronizeWith);
                }
                if (_this.synchronizeWith) {
                    _this.synchronizeWithAxis(_this.synchronizeWith);
                    _this.foundGraphs = true;
                }
            } else {
                _this.foundGraphs = false;
                _this.getMinMax();

                if (_this.start === 0 && _this.end == _this.data.length - 1 && isNaN(_this.minZoom) && isNaN(_this.maxZoom)) {
                    _this.fullMin = _this.min;
                    _this.fullMax = _this.max;

                    if (_this.type != "date") {
                        if (!isNaN(_this.minimum)) {
                            _this.fullMin = _this.minimum;
                        }

                        if (!isNaN(_this.maximum)) {
                            _this.fullMax = _this.maximum;
                        }
                    }


                    if (_this.logarithmic) {
                        _this.fullMin = _this.logMin;

                        if (_this.fullMin === 0) {
                            _this.fullMin = _this.treatZeroAs;
                        }
                    }

                    if (_this.type == "date") {
                        if (!_this.minimumDate) {
                            _this.fullMin = _this.minRR;
                        }
                        if (!_this.maximumDate) {
                            _this.fullMax = _this.maxRR;
                        }
                    }
                }
            }
        },


        draw: function() {
            var _this = this;
            AmCharts.ValueAxis.base.draw.call(_this);

            var chart = _this.chart;
            var set = _this.set;
            _this.labelRotationR = _this.labelRotation;

            var valueAxisName = "value-axis";
            AmCharts.setCN(chart, _this.set, valueAxisName + " " + valueAxisName + "-" + _this.id);
            AmCharts.setCN(chart, _this.labelsSet, valueAxisName + " " + valueAxisName + "-" + _this.id);
            AmCharts.setCN(chart, _this.axisLine.axisSet, valueAxisName + " " + valueAxisName + "-" + _this.id);
            var type = _this.type;

            // this is to handle fallback to v.1 of flash chart only
            if (type == "duration") {
                _this.duration = "ss";
            }

            if (_this.dataChanged === true) {
                _this.updateData();
                _this.dataChanged = false;
            }
            if (type == "date") {
                _this.logarithmic = false;
                _this.min = _this.minRR;
                _this.max = _this.maxRR;
                _this.reversed = false;
                _this.getDateMinMax();
            }

            if (_this.logarithmic) {
                var treatZeroAs = _this.treatZeroAs;
                var min = _this.getExtremes(0, _this.data.length - 1).min;

                if (!isNaN(_this.minimum) && _this.minimum < min) {
                    min = _this.minimum;
                }

                _this.logMin = min;
                if (_this.minReal < min) {
                    _this.minReal = min;
                }
                if (isNaN(_this.minReal)) {
                    _this.minReal = min;
                }
                if (treatZeroAs > 0 && min === 0) {
                    min = treatZeroAs;
                    _this.minReal = min;
                }

                if (min <= 0 || _this.minimum <= 0) {
                    var eType = "logarithmicAxisFailed";
                    _this.fire({
                        type: eType,
                        chart: chart
                    });
                    return;
                }
            }


            _this.grid0 = null;

            var coord;
            var i;
            var dx = chart.dx;
            var dy = chart.dy;
            var hide = false;
            var logarithmic = _this.logarithmic;

            if (!isNaN(_this.min) && !isNaN(_this.max) && _this.foundGraphs && _this.min != Infinity && _this.max != -Infinity) {

                if (_this.type == "date") {
                    if (_this.min == _this.max) {
                        _this.max += _this.minDuration();
                        _this.min -= _this.minDuration();
                    }
                }
                var labelFrequency = _this.labelFrequency;
                var showFirstLabel = _this.showFirstLabel;
                var showLastLabel = _this.showLastLabel;
                var frequency = 1;
                var startCount = 0;

                _this.minCalc = _this.min;
                _this.maxCalc = _this.max;

                if (_this.strictMinMax) {
                    if (!isNaN(_this.minimum)) {
                        _this.min = _this.minimum;
                    }

                    if (!isNaN(_this.maximum)) {
                        _this.max = _this.maximum;
                    }
                    if (_this.min == _this.max) {
                        return; // if strictminmax is set, this is needed to avoid js errors
                    }
                }

                if (!isNaN(_this.minZoom)) {
                    _this.min = _this.minZoom;
                    _this.minReal = _this.minZoom;
                }

                if (!isNaN(_this.maxZoom)) {
                    _this.max = _this.maxZoom;
                }



                if (_this.logarithmic) {
                    var degr = Math.log(_this.fullMax) * Math.LOG10E - Math.log(_this.fullMin) * Math.LOG10E;

                    var minDegrees = Math.log(_this.minReal) / Math.LN10 - Math.log(_this.fullMin) * Math.LOG10E;
                    var maxDegrees = Math.log(_this.max) / Math.LN10 - Math.log(_this.fullMin) * Math.LOG10E;

                    _this.relativeStart = minDegrees / degr;
                    _this.relativeEnd = maxDegrees / degr;
                } else {
                    _this.relativeStart = AmCharts.fitToBounds((_this.min - _this.fullMin) / (_this.fullMax - _this.fullMin), 0, 1);
                    _this.relativeEnd = AmCharts.fitToBounds((_this.max - _this.fullMin) / (_this.fullMax - _this.fullMin), 0, 1);
                }

                // the number of grid lines
                var gridCountReal = Math.round((_this.maxCalc - _this.minCalc) / _this.step) + 1;

                // LOGARITHMIC
                var degrees;
                if (logarithmic === true) {
                    degrees = Math.log(_this.max) * Math.LOG10E - Math.log(_this.minReal) * Math.LOG10E;

                    _this.stepWidth = _this.axisWidth / degrees;

                    // in case we have more degrees, draw grid every degree only
                    if (degrees > _this.logGridLimit) {
                        gridCountReal = Math.ceil((Math.log(_this.max) * Math.LOG10E)) + 1;
                        startCount = Math.round((Math.log(_this.minReal) * Math.LOG10E));
                        if (gridCountReal > _this.gridCountR) {
                            frequency = Math.ceil(gridCountReal / _this.gridCountR);
                        }
                    }
                }
                // LINEAR
                else {
                    // the width of one value
                    _this.stepWidth = _this.axisWidth / (_this.max - _this.min);
                }
                var numbersAfterDecimal = 0;
                if (_this.step < 1 && _this.step > -1) {
                    numbersAfterDecimal = AmCharts.getDecimals(_this.step);
                }

                if (_this.integersOnly) {
                    numbersAfterDecimal = 0;
                }

                if (numbersAfterDecimal > _this.maxDecCount) {
                    numbersAfterDecimal = _this.maxDecCount;
                }

                var precision = _this.precision;
                if (!isNaN(precision)) {
                    numbersAfterDecimal = precision;
                }

                if (isNaN(_this.maxZoom)) {
                    _this.max = AmCharts.roundTo(_this.max, _this.maxDecCount);
                    _this.min = AmCharts.roundTo(_this.min, _this.maxDecCount);
                }

                var numberFormatter = {};
                numberFormatter.precision = numbersAfterDecimal;
                numberFormatter.decimalSeparator = chart.nf.decimalSeparator;
                numberFormatter.thousandsSeparator = chart.nf.thousandsSeparator;
                _this.numberFormatter = numberFormatter;

                var axisItem;

                _this.exponential = false;

                for (i = startCount; i < gridCountReal; i += frequency) {
                    var val = AmCharts.roundTo(_this.step * i + _this.min, numbersAfterDecimal);

                    if (String(val).indexOf("e") != -1) {
                        _this.exponential = true;
                    }
                }

                if (_this.duration) {
                    _this.maxInterval = AmCharts.getMaxInterval(_this.max, _this.duration);
                }

                var step = _this.step;
                var minorGridEnabled = _this.minorGridEnabled;
                var minorGridStep;
                var minorGridAlpha = _this.minorGridAlpha;

                if (minorGridEnabled) {
                    minorGridStep = _this.getMinorGridStep(step, _this.stepWidth * step);
                }

                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if (!_this.autoGridCount && _this.gridCount === 0) {
                    // void
                } else {
                    if (type == "date") {
                        _this.generateDFObject();
                        _this.timeDifference = _this.max - _this.min;
                        _this.lastTime = _this.max;
                        _this.maxTime = _this.max;
                        _this.firstTime = _this.min;
                        _this.startTime = _this.min;
                        _this.parseDatesDraw();
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    else {

                        if (gridCountReal >= _this.autoRotateCount) {
                            if (!isNaN(_this.autoRotateAngle)) {
                                _this.labelRotationR = _this.autoRotateAngle;
                            }
                        }
                        var startMin = _this.minCalc;
                        if (logarithmic) {
                            gridCountReal++;
                            startMin = this.maxCalc - gridCountReal * step;
                        }

                        _this.gridCountReal = gridCountReal;
                        _this.startCount = startCount;

                        for (i = startCount; i < gridCountReal; i += frequency) {

                            var value = step * i + startMin;

                            // not 100% solution 3.14.1 increased to 10, was 5
                            // disabled since v 3.18, need another approach. otherwise values look really bad while zooming
                            /*
                            if (logarithmic) {
                                if (_this.max - _this.min > _this.min * 10) {
                                    value -= _this.min;
                                }
                            }*/

                            value = AmCharts.roundTo(value, _this.maxDecCount + 1);


                            if (_this.integersOnly && Math.round(value) != value) {
                                // void
                            } else if (!isNaN(precision) && Number(AmCharts.toFixed(value, precision)) != value) {
                                // void
                            } else {
                                if (logarithmic === true) {

                                    if (degrees > _this.logGridLimit) {
                                        value = Math.pow(10, i);
                                    } else {
                                        if (value <= 0) {
                                            value = startMin + step * i + step / 2; // experimental 3.20.1
                                            if (value <= 0) {
                                                continue;
                                            }
                                        }
                                    }
                                }

                                /////////////
                                var valueText = _this.formatValue(value, false, i);
                                /////////////

                                if (Math.round(i / labelFrequency) != i / labelFrequency) {
                                    valueText = undefined;
                                }

                                if ((i === 0 && !showFirstLabel) || (i == (gridCountReal - 1) && !showLastLabel)) {
                                    valueText = " ";
                                }

                                coord = _this.getCoordinate(value);

                                var textWidth;
                                if (_this.rotate && _this.autoWrap) {
                                    textWidth = _this.stepWidth * step - 10;
                                }

                                axisItem = new _this.axisItemRenderer(_this, coord, valueText, undefined, textWidth, undefined, undefined, _this.boldLabels);
                                _this.pushAxisItem(axisItem);


                                if (value == _this.baseValue && chart.type != "radar") {
                                    var xx;
                                    var yy;

                                    var ww = _this.width;
                                    var hh = _this.height;

                                    if (_this.orientation == "H") {
                                        if (coord >= 0 && coord <= ww + 1) {
                                            xx = [coord, coord, coord + dx];
                                            yy = [hh, 0, dy];
                                        }
                                    } else {
                                        if (coord >= 0 && coord <= hh + 1) {
                                            xx = [0, ww, ww + dx];
                                            yy = [coord, coord, coord + dy];
                                        }
                                    }

                                    if (xx) {
                                        var gridAlpha = AmCharts.fitToBounds(_this.gridAlpha * 2, 0, 1);
                                        if (!isNaN(_this.zeroGridAlpha)) {
                                            gridAlpha = _this.zeroGridAlpha;
                                        }

                                        var grid0 = AmCharts.line(chart.container, xx, yy, _this.gridColor, gridAlpha, 1, _this.dashLength);
                                        grid0.translate(_this.x, _this.y);
                                        _this.grid0 = grid0;
                                        chart.axesSet.push(grid0);
                                        grid0.toBack();

                                        AmCharts.setCN(chart, grid0, _this.bcn + "zero-grid-" + _this.id);
                                        AmCharts.setCN(chart, grid0, _this.bcn + "zero-grid");
                                    }
                                }

                                // minor grid
                                if (!isNaN(minorGridStep) && minorGridAlpha > 0 && i < gridCountReal - 1) {
                                    var minorCount = step / minorGridStep;
                                    if (logarithmic) {
                                        var nextValue = step * (i + frequency) + _this.minCalc;
                                        nextValue = AmCharts.roundTo(nextValue, _this.maxDecCount + 1);

                                        if (degrees > _this.logGridLimit) {
                                            nextValue = Math.pow(10, i + frequency);
                                        }
                                        minorCount = 9;
                                        minorGridStep = (nextValue - value) / minorCount;
                                    }

                                    // change it temporary
                                    var realAlpha = _this.gridAlpha;
                                    _this.gridAlpha = _this.minorGridAlpha;
                                    for (var m = 1; m < minorCount; m++) {
                                        var minorValue = value + minorGridStep * m;
                                        var minorCoord = _this.getCoordinate(minorValue);
                                        var minorAxisItem = new _this.axisItemRenderer(this, minorCoord, "", false, 0, 0, false, false, 0, true);
                                        _this.pushAxisItem(minorAxisItem);
                                    }
                                    _this.gridAlpha = realAlpha;
                                }
                            }
                        }
                    }
                }


                // draw guides
                var guides = _this.guides;
                var count = guides.length;

                if (count > 0) {
                    var fillAlphaReal = _this.fillAlpha;
                    _this.fillAlpha = 0; // this may seam strange, but is for addValue method not to draw fill
                    for (i = 0; i < count; i++) {
                        var guide = guides[i];
                        var guideToCoord = NaN;

                        var above = guide.above;

                        if (!isNaN(guide.toValue)) {
                            guideToCoord = _this.getCoordinate(guide.toValue);
                            axisItem = new _this.axisItemRenderer(this, guideToCoord, "", true, NaN, NaN, guide);
                            _this.pushAxisItem(axisItem, above);
                        }

                        var guideCoord = NaN;

                        if (!isNaN(guide.value)) {
                            guideCoord = _this.getCoordinate(guide.value);
                            var valueShift = (guideToCoord - guideCoord) / 2;
                            axisItem = new _this.axisItemRenderer(this, guideCoord, guide.label, true, NaN, valueShift, guide);
                            _this.pushAxisItem(axisItem, above);
                        }

                        if (isNaN(guideToCoord)) {
                            guideCoord -= 3;
                            guideToCoord = guideCoord + 3;
                        }

                        if (!isNaN(guideToCoord - guideCoord)) {
                            if (guideCoord < 0 && guideToCoord < 0) {

                            } else {
                                var guideFill = new _this.guideFillRenderer(this, guideCoord, guideToCoord, guide);
                                _this.pushAxisItem(guideFill, above);
                                var guideFillGraphics = guideFill.graphics();
                                guide.graphics = guideFillGraphics;
                                if (guide.balloonText) {
                                    _this.addEventListeners(guideFillGraphics, guide);
                                }
                            }
                        }
                    }
                    _this.fillAlpha = fillAlphaReal;
                }

                // BASE VALUE
                var base = _this.baseValue;

                // if the min is > 0, then the base value is equal to min
                if (_this.min > _this.baseValue && _this.max > _this.baseValue) {
                    base = _this.min;
                }

                // if both min and max are less then zero, then the base value is equal to max
                if (_this.min < _this.baseValue && _this.max < _this.baseValue) {
                    base = _this.max;
                }

                if (logarithmic && base < _this.minReal) {
                    base = _this.minReal;
                }

                _this.baseCoord = _this.getCoordinate(base, true);

                var name = "axisChanged";
                var event = {
                    type: name,
                    target: _this,
                    chart: chart
                };

                if (logarithmic) {
                    event.min = _this.minReal;
                } else {
                    event.min = _this.min;
                }
                event.max = _this.max;

                _this.fire(event);

                _this.axisCreated = true;
            } else {
                hide = true;
            }

            var axisLineSet = _this.axisLine.set;
            var labelsSet = _this.labelsSet;
            set.translate(_this.x, _this.y);
            labelsSet.translate(_this.x, _this.y);

            _this.positionTitle();

            if (chart.type != "radar") {
                axisLineSet.toFront();
            }

            if (!_this.visible || hide) {
                set.hide();
                axisLineSet.hide();
                labelsSet.hide();
            } else {
                set.show();
                axisLineSet.show();
                labelsSet.show();
            }

            // these are documented
            _this.axisY = _this.y;
            _this.axisX = _this.x;
        },

        getDateMinMax: function() {
            var _this = this;
            if (_this.minimumDate) {
                if (!(_this.minimumDate instanceof Date)) {
                    _this.minimumDate = AmCharts.getDate(_this.minimumDate, _this.chart.dataDateFormat, "fff");
                }
                _this.min = _this.minimumDate.getTime();
            }
            if (_this.maximumDate) {
                if (!(_this.maximumDate instanceof Date)) {
                    _this.maximumDate = AmCharts.getDate(_this.maximumDate, _this.chart.dataDateFormat, "fff");
                }
                _this.max = _this.maximumDate.getTime();
            }
        },


        formatValue: function(value, notStrict, i) {
            var _this = this;
            var exponential = _this.exponential;
            var logarithmic = _this.logarithmic;
            var numberFormatter = _this.numberFormatter;
            var chart = _this.chart;
            var valueText;
            if (numberFormatter) {
                if (_this.logarithmic === true) {
                    if (String(value).indexOf("e") != -1) {
                        exponential = true;
                    } else {
                        exponential = false;
                    }
                }

                if (_this.useScientificNotation) {
                    exponential = true;
                }

                if (_this.usePrefixes) {
                    exponential = false;
                }

                if (!exponential) {
                    if (logarithmic) {
                        var temp = String(value).split(".");
                        if (temp[1]) {
                            numberFormatter.precision = temp[1].length;
                            //added in 3.4.3 to fix floating point
                            if (i < 0) {
                                numberFormatter.precision = Math.abs(i);
                            }
                            // end of 3.4.3
                            if (notStrict && value > 1) {
                                numberFormatter.precision = 0;
                            }
                            if (!notStrict && !isNaN(_this.precision)) {
                                numberFormatter.precision = _this.precision;
                            }

                        } else {
                            numberFormatter.precision = -1;
                        }
                    }

                    if (_this.usePrefixes) {
                        valueText = AmCharts.addPrefix(value, chart.prefixesOfBigNumbers, chart.prefixesOfSmallNumbers, numberFormatter, !notStrict);
                    } else {
                        valueText = AmCharts.formatNumber(value, numberFormatter, numberFormatter.precision);
                    }

                } else {
                    if (String(value).indexOf("e") == -1) {
                        valueText = value.toExponential(15);
                    } else {
                        valueText = String(value);
                    }

                    var valStrArr = valueText.split("e");
                    var valBase = Number(valStrArr[0]);
                    var valMant = Number(valStrArr[1]);

                    valBase = AmCharts.roundTo(valBase, 14);

                    if (!notStrict && !isNaN(_this.precision)) {
                        valBase = AmCharts.roundTo(valBase, _this.precision);
                    }

                    if (valBase == 10) {
                        valBase = 1;
                        valMant += 1;
                    }

                    valueText = valBase + "e" + valMant;

                    if (value === 0) {
                        valueText = "0";
                    }
                    if (value == 1) {
                        valueText = "1";
                    }
                }

                if (_this.duration) {
                    if (notStrict) {
                        numberFormatter.precision = 0;
                    }
                    valueText = AmCharts.formatDuration(value, _this.duration, "", _this.durationUnits, _this.maxInterval, numberFormatter);
                }

                if (_this.type == "date") {
                    valueText = AmCharts.formatDate(new Date(value), _this.currentDateFormat, chart);
                }

                if (_this.recalculateToPercents) {
                    valueText = valueText + "%";
                } else {
                    var unit = _this.unit;
                    if (unit) {
                        if (_this.unitPosition == "left") {
                            valueText = unit + valueText;
                        } else {
                            valueText = valueText + unit;
                        }
                    }
                }

                if (_this.labelFunction) {
                    if (_this.type == "date") {
                        valueText = _this.labelFunction(valueText, new Date(value), this).toString();
                    } else {
                        valueText = _this.labelFunction(value, valueText, this).toString();
                    }
                }
                return valueText;
            }
        },


        getMinorGridStep: function(step, width) {
            var gridCount = [5, 4, 2];

            if (width < 60) {
                gridCount.shift();
            }

            var stepE = Math.floor(Math.log(Math.abs(step)) * Math.LOG10E);
            for (var i = 0; i < gridCount.length; i++) {
                var minorStep = step / gridCount[i];
                var minorStepE = Math.floor(Math.log(Math.abs(minorStep)) * Math.LOG10E);

                if (Math.abs(stepE - minorStepE) > 1) {
                    continue;
                }

                if (step < 1) {
                    var tempStep = Math.pow(10, -minorStepE) * minorStep;

                    if (tempStep == Math.round(tempStep)) {
                        return minorStep;
                    }
                } else {
                    if (minorStep == Math.round(minorStep)) {
                        return minorStep;
                    }
                }
            }
        },

        stackGraphs: function(type) {
            var _this = this;
            var stackType = _this.stackType;
            if (stackType == "stacked") {
                stackType = "regular";
            }
            if (stackType == "line") {
                stackType = "none";
            }
            if (stackType == "100% stacked") {
                stackType = "100%";
            }
            _this.stackType = stackType;

            var previousValues = [];
            var previousNegativeValues = [];
            var previousPositiveValues = [];
            var sum = [];
            var value;
            var graphs = _this.chart.graphs;
            var previousGraph;
            var graphType;
            var graph;
            var graphDataItem;
            var j;
            var i;
            var baseValue = _this.baseValue;

            var linetype = false;
            if (type == "line" || type == "step" || type == "smoothedLine") {
                linetype = true;
            }

            // set stackGraphs (tells the graph to which graph it is stacked)
            if (linetype && (stackType == "regular" || stackType == "100%")) {
                for (j = 0; j < graphs.length; j++) {
                    graph = graphs[j];
                    graph.stackGraph = null;

                    if (!graph.hidden) {
                        graphType = graph.type;

                        if (graph.chart == _this.chart && graph.valueAxis == this && type == graphType && graph.stackable) {
                            if (previousGraph) {
                                graph.stackGraph = previousGraph;
                                previousGraph = graph;
                            } else {
                                previousGraph = graph;
                            }
                        }
                    }
                }
            }

            var start = _this.start - 10;
            var end = _this.end + 10;
            var count = _this.data.length - 1;

            start = AmCharts.fitToBounds(start, 0, count);
            end = AmCharts.fitToBounds(end, 0, count);

            // do the calculations
            for (i = start; i <= end; i++) {
                var maxDecCount = 0;
                for (j = 0; j < graphs.length; j++) {
                    graph = graphs[j];
                    if (!graph.hidden) {
                        graphType = graph.type;

                        if (graph.chart == _this.chart && graph.valueAxis == this && type == graphType && graph.stackable) {
                            graphDataItem = _this.data[i].axes[_this.id].graphs[graph.id];

                            value = graphDataItem.values.value;

                            if (!isNaN(value)) {
                                var numbersAfterDecimal = AmCharts.getDecimals(value);
                                if (maxDecCount < numbersAfterDecimal) {
                                    maxDecCount = numbersAfterDecimal;
                                }

                                if (isNaN(sum[i])) {
                                    sum[i] = Math.abs(value);
                                } else {
                                    sum[i] += Math.abs(value);
                                }

                                sum[i] = AmCharts.roundTo(sum[i], maxDecCount);

                                // LINE AND STEP
                                // for the bands, if no stack set but fillToGraph is set
                                var fillToGraph = graph.fillToGraph;
                                if (linetype && fillToGraph) {
                                    var fillToDataItem = _this.data[i].axes[_this.id].graphs[fillToGraph.id];
                                    if (fillToDataItem) {
                                        graphDataItem.values.open = fillToDataItem.values.value;
                                    }
                                }


                                if (stackType == "regular") {
                                    // LINE AND STEP
                                    if (linetype) {
                                        // if previous value is not present
                                        if (isNaN(previousValues[i])) {
                                            previousValues[i] = value;
                                            graphDataItem.values.close = value;
                                            graphDataItem.values.open = _this.baseValue;
                                        }
                                        // if previous value is present
                                        else {
                                            if (isNaN(value)) {
                                                graphDataItem.values.close = previousValues[i];
                                                graphDataItem.values.open = previousValues[i];
                                            } else {
                                                graphDataItem.values.close = value + previousValues[i];
                                                graphDataItem.values.open = previousValues[i];
                                            }
                                            previousValues[i] = graphDataItem.values.close;
                                        }
                                    }

                                    // COLUMN
                                    if (type == "column") {

                                        if (graph.newStack) {
                                            previousPositiveValues[i] = NaN;
                                            previousNegativeValues[i] = NaN;
                                        }

                                        graphDataItem.values.close = value;

                                        if (value < 0) {
                                            graphDataItem.values.close = value;
                                            if (!isNaN(previousNegativeValues[i])) {
                                                graphDataItem.values.close += previousNegativeValues[i];
                                                graphDataItem.values.open = previousNegativeValues[i];
                                            } else {
                                                graphDataItem.values.open = baseValue;
                                            }
                                            previousNegativeValues[i] = graphDataItem.values.close;
                                        } else {
                                            graphDataItem.values.close = value;
                                            if (!isNaN(previousPositiveValues[i])) {
                                                graphDataItem.values.close += previousPositiveValues[i];
                                                graphDataItem.values.open = previousPositiveValues[i];
                                            } else {
                                                graphDataItem.values.open = baseValue;
                                            }
                                            previousPositiveValues[i] = graphDataItem.values.close;
                                        }
                                    }
                                }
                            } else {
                                if (graph.newStack) {
                                    previousPositiveValues[i] = NaN;
                                    previousNegativeValues[i] = NaN;
                                }
                            }
                        }
                    } else {
                        if (graph.newStack) {
                            previousPositiveValues[i] = NaN;
                            previousNegativeValues[i] = NaN;
                        }
                    }
                }
            }

            for (i = _this.start; i <= _this.end; i++) {
                for (j = 0; j < graphs.length; j++) {
                    graph = graphs[j];
                    if (!graph.hidden) {
                        graphType = graph.type;
                        if (graph.chart == _this.chart && graph.valueAxis == this && type == graphType && graph.stackable) {
                            graphDataItem = _this.data[i].axes[_this.id].graphs[graph.id];
                            value = graphDataItem.values.value;

                            if (!isNaN(value)) {
                                var percents = value / sum[i] * 100;
                                graphDataItem.values.percents = percents;
                                graphDataItem.values.total = sum[i];

                                if (graph.newStack) {
                                    previousPositiveValues[i] = NaN;
                                    previousNegativeValues[i] = NaN;
                                }

                                if (stackType == "100%") {
                                    if (isNaN(previousNegativeValues[i])) {
                                        previousNegativeValues[i] = 0;
                                    }

                                    if (isNaN(previousPositiveValues[i])) {
                                        previousPositiveValues[i] = 0;
                                    }

                                    if (percents < 0) {
                                        graphDataItem.values.close = AmCharts.fitToBounds(percents + previousNegativeValues[i], -100, 100);
                                        graphDataItem.values.open = previousNegativeValues[i];
                                        previousNegativeValues[i] = graphDataItem.values.close;
                                    } else {
                                        // this fixes 100.000000001 error
                                        graphDataItem.values.close = AmCharts.fitToBounds(percents + previousPositiveValues[i], -100, 100);
                                        graphDataItem.values.open = previousPositiveValues[i];
                                        previousPositiveValues[i] = graphDataItem.values.close;
                                    }
                                }
                            }
                        }
                    } else {
                        if (graph.newStack) {
                            previousPositiveValues[i] = NaN;
                            previousNegativeValues[i] = NaN;
                        }
                    }
                }
            }
        },


        recalculate: function() {
            var _this = this;
            var chart = _this.chart;
            var graphs = chart.graphs;
            var j;
            for (j = 0; j < graphs.length; j++) {
                var graph = graphs[j];

                if (graph.valueAxis == this) {
                    var fieldName = "value";
                    if (graph.type == "candlestick" || graph.type == "ohlc") {
                        fieldName = "open";
                    }

                    var baseValue;
                    var graphDataItem;
                    var end = _this.end + 2;
                    end = AmCharts.fitToBounds(_this.end + 1, 0, _this.data.length - 1);
                    var start = _this.start;

                    if (start > 0) {
                        start--;
                    }

                    var ii;

                    var thisStart = _this.start;
                    if (graph.compareFromStart) {
                        thisStart = 0;
                    }

                    // trying to adjust start 3.4.10
                    if (!isNaN(chart.startTime)) {
                        var categoryAxis = chart.categoryAxis;
                        if (categoryAxis) {
                            var minDuration = categoryAxis.minDuration();

                            var realStartDate = new Date(chart.startTime + minDuration / 2);
                            var startTime = AmCharts.resetDateToMin(new Date(chart.startTime), categoryAxis.minPeriod).getTime();
                            var realStartTime = AmCharts.resetDateToMin(new Date(realStartDate), categoryAxis.minPeriod).getTime();
                            if (realStartTime > startTime) {
                                thisStart++;
                            }
                        }
                    }

                    var recalculateFromDate = chart.recalculateFromDate;

                    if (recalculateFromDate) {

                        recalculateFromDate = AmCharts.getDate(recalculateFromDate, chart.dataDateFormat, "fff");

                        thisStart = chart.getClosestIndex(chart.chartData, "time", recalculateFromDate.getTime(), true, 0, chart.chartData.length);

                        end = chart.chartData.length - 1;
                    }

                    for (ii = thisStart; ii <= end; ii++) {
                        graphDataItem = _this.data[ii].axes[_this.id].graphs[graph.id];
                        baseValue = graphDataItem.values[fieldName];

                        if (graph.recalculateValue) {
                            baseValue = graphDataItem.dataContext[graph.valueField + graph.recalculateValue];
                        }

                        if (!isNaN(baseValue)) {
                            break;
                        }
                    }

                    _this.recBaseValue = baseValue;
                    var i;
                    for (i = start; i <= end; i++) {
                        graphDataItem = _this.data[i].axes[_this.id].graphs[graph.id];
                        graphDataItem.percents = {};
                        var values = graphDataItem.values;

                        var k;
                        for (k in values) {
                            if (k != "percents") {
                                var val = values[k];
                                var percent = val / baseValue * 100 - 100;

                                graphDataItem.percents[k] = percent;
                            } else {
                                graphDataItem.percents[k] = values[k];
                            }
                        }
                    }
                }
            }
        },


        getMinMax: function() {
            var _this = this;
            var expand = false;
            var chart = _this.chart;
            var graphs = chart.graphs;
            var g;
            for (g = 0; g < graphs.length; g++) {
                var type = graphs[g].type;

                if (type == "line" || type == "step" || type == "smoothedLine") {
                    if (_this.expandMinMax) {
                        expand = true;
                    }
                }
            }

            if (expand) {
                if (_this.start > 0) {
                    _this.start--;
                }

                if (_this.end < _this.data.length - 1) {
                    _this.end++;
                }
            }

            if (chart.type == "serial") {
                if (chart.categoryAxis.parseDates === true && !expand) {
                    if (_this.end < _this.data.length - 1) {
                        _this.end++;
                    }
                }
            }

            if (_this.includeAllValues) {
                _this.start = 0;
                _this.end = _this.data.length - 1;
            }

            // get min and max
            var minMaxMultiplier = _this.minMaxMultiplier;
            var minMax = _this.getExtremes(_this.start, _this.end);
            _this.min = minMax.min;
            _this.max = minMax.max;

            _this.minRR = _this.min;
            _this.maxRR = _this.max;

            var delta = (_this.max - _this.min) * (minMaxMultiplier - 1);
            _this.min -= delta;
            _this.max += delta;

            var guideCount = _this.guides.length;
            if (_this.includeGuidesInMinMax && guideCount > 0) {
                var i;
                for (i = 0; i < guideCount; i++) {
                    var guide = _this.guides[i];

                    if (guide.toValue < _this.min) {
                        _this.min = guide.toValue;
                    }

                    if (guide.value < _this.min) {
                        _this.min = guide.value;
                    }

                    if (guide.toValue > _this.max) {
                        _this.max = guide.toValue;
                    }

                    if (guide.value > _this.max) {
                        _this.max = guide.value;
                    }
                }
            }

            // set defined
            if (!isNaN(_this.minimum)) {
                _this.min = _this.minimum;
            }

            if (!isNaN(_this.maximum)) {
                _this.max = _this.maximum;
            }

            if (_this.type == "date") {
                _this.getDateMinMax();
            }

            if (_this.min > _this.max) {
                var maxT = _this.max;
                _this.max = _this.min;
                _this.min = maxT;
            }
            if (!isNaN(_this.minZoom)) {
                _this.min = _this.minZoom;
            }

            if (!isNaN(_this.maxZoom)) {
                _this.max = _this.maxZoom;
            }

            _this.minCalc = _this.min;
            _this.maxCalc = _this.max;

            _this.minReal = _this.min;
            _this.maxReal = _this.max;

            if (_this.min === 0 && _this.max === 0) {
                _this.max = 9;
            }

            if (_this.min > _this.max) {
                _this.min = _this.max - 1;
            }

            var initialMin = _this.min; //initial minimum
            var initialMax = _this.max; //initial maximum
            var dif = _this.max - _this.min; //difference
            var difE; //row of difference
            if (dif === 0) {
                // difference is 0 if all values of the period are equal
                // then difference will be
                difE = Math.pow(10, Math.floor(Math.log(Math.abs(_this.max)) * Math.LOG10E)) / 10;
            } else {
                difE = Math.pow(10, Math.floor(Math.log(Math.abs(dif)) * Math.LOG10E)) / 10;
            }

            // new min and max
            if (isNaN(_this.maximum)) {
                _this.max = Math.ceil(_this.max / difE) * difE + difE;
            }

            if (isNaN(_this.minimum)) {
                _this.min = Math.floor(_this.min / difE) * difE - difE;
            }

            if (_this.min < 0 && initialMin >= 0) { //min is zero if initial min > 0
                _this.min = 0;
            }

            if (_this.max > 0 && initialMax <= 0) { //min is zero if initial min > 0
                _this.max = 0;
            }

            if (_this.stackType == "100%") {
                if (_this.min < 0) {
                    _this.min = -100;
                } else {
                    _this.min = 0;
                }

                if (_this.max < 0) {
                    _this.max = 0;
                } else {
                    _this.max = 100;
                }
            }

            // new difference
            dif = _this.max - _this.min;
            difE = Math.pow(10, Math.floor(Math.log(Math.abs(dif)) * Math.LOG10E)) / 10;

            // aprox size of the step
            _this.step = Math.ceil((dif / _this.gridCountR) / difE) * difE;

            // row of the step
            var stepE = Math.pow(10, Math.floor(Math.log(Math.abs(_this.step)) * Math.LOG10E));
            stepE = AmCharts.fixStepE(stepE);

            var temp = Math.ceil(_this.step / stepE); //number from 1 to 10
            if (temp > 5) {
                temp = 10;
            }

            if (temp <= 5 && temp > 2) {
                temp = 5;
            }

            //real step
            _this.step = Math.ceil(_this.step / (stepE * temp)) * stepE * temp;
            if (!isNaN(_this.setStep)) {
                _this.step = _this.setStep;
            }

            if (stepE < 1) {
                _this.maxDecCount = Math.abs(Math.log(Math.abs(stepE)) * Math.LOG10E);
                _this.maxDecCount = Math.round(_this.maxDecCount);
                _this.step = AmCharts.roundTo(_this.step, _this.maxDecCount + 1);
            } else {
                _this.maxDecCount = 0;
            }

            _this.min = _this.step * Math.floor(_this.min / _this.step);
            _this.max = _this.step * Math.ceil(_this.max / _this.step);

            if (_this.min < 0 && initialMin >= 0) { //min is zero if initial min > 0
                _this.min = 0;
            }

            if (_this.max > 0 && initialMax <= 0) { //min is zero if initial min > 0
                _this.max = 0;
            }

            // tweek real min
            // round
            if (_this.minReal > 1 && _this.max - _this.minReal > 1) {
                _this.minReal = Math.floor(_this.minReal);
            }

            dif = (Math.pow(10, Math.floor(Math.log(Math.abs(_this.minReal)) * Math.LOG10E)));

            // find next after zero
            if (_this.min === 0) {
                _this.minReal = dif;
            }
            if (_this.min === 0 && _this.minReal > 1) {
                _this.minReal = 1;
            }

            if (_this.min > 0 && _this.minReal - _this.step > 0) {
                if (_this.min + _this.step < _this.minReal) {
                    _this.minReal = _this.min + _this.step;
                } else {
                    _this.minReal = _this.min;
                }
            }

            if (_this.logarithmic) {
                var degrees = Math.log(initialMax) * Math.LOG10E - Math.log(initialMin) * Math.LOG10E;
                if (degrees > 2) {
                    _this.min = Math.pow(10, Math.floor(Math.log(Math.abs(initialMin)) * Math.LOG10E));
                    _this.minReal = _this.min;
                    _this.max = Math.pow(10, Math.ceil(Math.log(Math.abs(initialMax)) * Math.LOG10E));
                } else {
                    var minE = Math.pow(10, Math.floor(Math.log(Math.abs(_this.min)) * Math.LOG10E)) / 10;
                    var minRealE = Math.pow(10, Math.floor(Math.log(Math.abs(initialMin)) * Math.LOG10E)) / 10;

                    if (minE < minRealE) {
                        _this.min = 10 * minRealE;
                        _this.minReal = _this.min;
                    }
                }
            }
        },



        getExtremes: function(start, end) {
            var _this = this;
            var min;
            var max;

            var i;
            for (i = start; i <= end; i++) {
                var graphs = _this.data[i].axes[_this.id].graphs;

                var j;
                for (j in graphs) {
                    if (graphs.hasOwnProperty(j)) {

                        var graph = _this.chart.graphsById[j];

                        if (graph.includeInMinMax) {
                            if (!graph.hidden || _this.includeHidden) {
                                if (isNaN(min)) {
                                    min = Infinity;
                                }

                                if (isNaN(max)) {
                                    max = -Infinity;
                                }

                                _this.foundGraphs = true;

                                var values = graphs[j].values;
                                if (_this.recalculateToPercents) {
                                    values = graphs[j].percents;
                                }

                                var val;

                                if (_this.minMaxField) {
                                    val = values[_this.minMaxField];

                                    if (val < min) {
                                        min = val;
                                    }

                                    if (val > max) {
                                        max = val;
                                    }
                                } else {
                                    var k;
                                    for (k in values) {
                                        if (values.hasOwnProperty(k)) {
                                            if (k != "percents" && k != "total" && k != "error") {
                                                val = values[k];
                                                if (val < min) {
                                                    min = val;
                                                }
                                                if (val > max) {
                                                    max = val;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return {
                min: min,
                max: max
            };
        },


        zoomOut: function(skipEvent) {
            var _this = this;
            _this.minZoom = NaN;
            _this.maxZoom = NaN;
            _this.zoomToRelativeValues(0, 1, skipEvent);
        },

        zoomToRelativeValues: function(start, end, skipEvent) {
            var _this = this;

            if (_this.reversed) {
                var tempStart = start;
                start = 1 - end;
                end = 1 - tempStart;
            }

            var max = _this.fullMax;
            var min = _this.fullMin;

            var newMin = min + (max - min) * start;
            var newMax = min + (max - min) * end;

            if (_this.logarithmic) {
                var degrees = Math.log(max) * Math.LOG10E - Math.log(min) * Math.LOG10E;
                var minDegrees = degrees * start;
                var maxDegrees = degrees * end;

                newMin = Math.pow(10, minDegrees + Math.log(min) * Math.LOG10E);
                newMax = Math.pow(10, maxDegrees + Math.log(min) * Math.LOG10E);
            }

            return _this.zoomToValues(newMin, newMax, skipEvent);
        },

        zoomToValues: function(startValue, endValue, skipEvent) {
            var _this = this;

            if (endValue < startValue) {
                var temp = endValue;
                endValue = startValue;
                startValue = temp;
            }

            var fullMax = _this.fullMax;
            var fullMin = _this.fullMin;

            _this.relativeStart = (startValue - fullMin) / (fullMax - fullMin);
            _this.relativeEnd = (endValue - fullMin) / (fullMax - fullMin);

            if (_this.logarithmic) {
                var degrees = Math.log(fullMax) * Math.LOG10E - Math.log(fullMin) * Math.LOG10E;

                var minDegrees = Math.log(startValue) / Math.LN10 - Math.log(fullMin) * Math.LOG10E;
                var maxDegrees = Math.log(endValue) / Math.LN10 - Math.log(fullMin) * Math.LOG10E;

                _this.relativeStart = minDegrees / degrees;
                _this.relativeEnd = maxDegrees / degrees;
            }

            if (_this.minZoom != startValue || _this.maxZoom != endValue) {

                _this.minZoom = startValue;
                _this.maxZoom = endValue;

                var event = {};
                event.type = "axisZoomed";
                event.chart = _this.chart;
                event.valueAxis = _this;
                event.startValue = startValue;
                event.endValue = endValue;

                event.relativeStart = _this.relativeStart;
                event.relativeEnd = _this.relativeEnd;

                if (_this.prevStartValue != startValue || _this.prevEndValue != endValue) {
                    _this.fire(event);
                }

                _this.prevStartValue = startValue;
                _this.prevEndValue = endValue;


                if (!skipEvent) {
                    var ev = {};
                    AmCharts.copyProperties(event, ev);
                    ev.type = "axisIntZoomed";

                    _this.fire(ev);
                }
                if (_this.relativeStart === 0 && _this.relativeEnd == 1) {
                    _this.minZoom = NaN;
                    _this.maxZoom = NaN;
                }
                return true;
            }
        },

        coordinateToValue: function(coordinate) {
            var _this = this;
            if (isNaN(coordinate)) {
                return NaN;
            }

            var value;
            var axisWidth = _this.axisWidth;
            var stepWidth = _this.stepWidth;
            var reversed = _this.reversed;
            var rotate = _this.rotate;
            var min = _this.min;
            var minReal = _this.minReal;

            // LOGARITHMIC
            if (_this.logarithmic === true) {
                var degree;

                if (rotate) {
                    // REVERSED
                    if (reversed === true) {
                        degree = (axisWidth - coordinate) / stepWidth;
                    }
                    // NOT REVERSED
                    else {
                        degree = coordinate / stepWidth;
                    }
                } else {
                    // REVERSED
                    if (reversed === true) {
                        degree = coordinate / stepWidth;
                    }
                    // NOT REVERSED
                    else {
                        degree = (axisWidth - coordinate) / stepWidth;
                    }
                }
                value = Math.pow(10, degree + Math.log(minReal) * Math.LOG10E);
            }

            // LINEAR (SIMPLE)
            else {
                // REVERSED
                if (reversed === true) {
                    if (rotate) {
                        value = min - (coordinate - axisWidth) / stepWidth;
                    } else {
                        value = coordinate / stepWidth + min;
                    }
                }
                // NOT REVERSED
                else {
                    if (rotate) {
                        value = coordinate / stepWidth + min;
                    } else {
                        value = min - (coordinate - axisWidth) / stepWidth;
                    }
                }
            }
            return value;
        },


        getCoordinate: function(value, noRound) {
            var _this = this;
            if (isNaN(value)) {
                return NaN;
            }
            var rotate = _this.rotate;
            var reversed = _this.reversed;
            var coord;
            var axisWidth = _this.axisWidth;
            var stepWidth = _this.stepWidth;
            var min = _this.min;
            var minReal = _this.minReal;

            // LOGARITHMIC
            if (_this.logarithmic === true) {
                if (value === 0) {
                    value = _this.treatZeroAs;
                }

                var degree = (Math.log(value) * Math.LOG10E) - Math.log(minReal) * Math.LOG10E;
                if (rotate) {
                    // REVERSED
                    if (reversed === true) {
                        coord = axisWidth - stepWidth * degree;
                    }
                    // NOT REVERSED
                    else {
                        coord = stepWidth * degree;
                    }
                } else {
                    // REVERSED
                    if (reversed === true) {
                        coord = stepWidth * degree;
                    }
                    // NOT REVERSED
                    else {
                        coord = axisWidth - stepWidth * degree;
                    }
                }
            }
            // LINEAR (SIMPLE)
            else {
                // REVERSED
                if (reversed === true) {
                    if (rotate) {
                        coord = axisWidth - stepWidth * (value - min);
                    } else {
                        coord = stepWidth * (value - min);
                    }
                }
                // NOT REVERSED
                else {
                    if (rotate) {
                        coord = stepWidth * (value - min);
                    } else {
                        coord = axisWidth - stepWidth * (value - min);
                    }
                }
            }

            // this should fix problem with very big coordinates
            if (Math.abs(coord) > 10000000) {
                var sign = coord / Math.abs(coord);
                coord = 10000000 * sign;
            }

            if (!noRound) {
                coord = Math.round(coord);
            }

            return coord;
        },

        /**
         * One value axis can be synchronized with another value axis.
         * You should set synchronizationMultiplier in order for this to work.
         */
        synchronizeWithAxis: function(value) {
            var _this = this;
            _this.synchronizeWith = value;
            _this.listenTo(_this.synchronizeWith, "axisChanged", _this.handleSynchronization);
        },


        handleSynchronization: function() {
            var _this = this;

            if (_this.synchronizeWith) {
                if (AmCharts.isString(_this.synchronizeWith)) {
                    _this.synchronizeWith = _this.chart.getValueAxisById(_this.synchronizeWith);
                }

                var synchronizeWith = _this.synchronizeWith;

                var syncMin = synchronizeWith.min;
                var syncMax = synchronizeWith.max;
                var syncStep = synchronizeWith.step;

                var synchronizationMultiplier = _this.synchronizationMultiplier;

                if (synchronizationMultiplier) {
                    _this.min = syncMin * synchronizationMultiplier;
                    _this.max = syncMax * synchronizationMultiplier;
                    _this.step = syncStep * synchronizationMultiplier;

                    var stepE = Math.pow(10, Math.floor(Math.log(Math.abs(_this.step)) * Math.LOG10E));

                    var maxDecCount = Math.abs(Math.log(Math.abs(stepE)) * Math.LOG10E);
                    maxDecCount = Math.round(maxDecCount);

                    _this.maxDecCount = maxDecCount;

                    _this.draw();
                }
            }
        }
    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.RecAxis = AmCharts.Class({

        construct: function(axis) {
            var _this = this;
            var chart = axis.chart;
            var t = axis.axisThickness;
            var c = axis.axisColor;
            var a = axis.axisAlpha;
            var o = axis.offset;
            var dx = axis.dx;
            var dy = axis.dy;

            var vx = axis.x;
            var vy = axis.y;
            var vh = axis.height;
            var vw = axis.width;

            var x;
            var y;
            var container = chart.container;

            // POSITION CONTAINERS
            // HORIZONTAL
            var line;

            if (axis.orientation == "H") {
                line = AmCharts.line(container, [0, vw], [0, 0], c, a, t);

                _this.axisWidth = axis.width;

                // BOTTOM
                if (axis.position == "bottom") {
                    y = t / 2 + o + vh + vy - 1;
                    x = vx;
                }
                // TOP
                else {
                    y = -t / 2 - o + vy + dy;
                    x = dx + vx;
                }
            }
            // VERTICAL
            else {
                _this.axisWidth = axis.height;

                // RIGHT
                if (axis.position == "right") {
                    line = AmCharts.line(container, [0, 0, -dx], [0, vh, vh - dy], c, a, t);
                    y = vy + dy;
                    x = t / 2 + o + dx + vw + vx - 1;
                }
                // LEFT
                else {
                    line = AmCharts.line(container, [0, 0], [0, vh], c, a, t);
                    y = vy;
                    x = -t / 2 - o + vx;
                }
            }
            line.translate(x, y);
            var set = chart.container.set();
            set.push(line);
            chart.axesSet.push(set);
            AmCharts.setCN(chart, line, axis.bcn + "line");
            _this.axisSet = set;
            _this.set = line;
        }
    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.RecItem = AmCharts.Class({

        construct: function(axis, coord, value, below, textWidth, valueShift, guide, bold, tickShift, minor, labelColor, className) {
            var _this = this;

            coord = Math.round(coord);
            var UNDEFINED;
            var chart = axis.chart;

            _this.value = value;

            if (value == UNDEFINED) {
                value = "";
            }

            if (!tickShift) {
                tickShift = 0;
            }

            if (below == UNDEFINED) {
                below = true;
            }
            var fontFamily = chart.fontFamily;
            var textSize = axis.fontSize;

            if (textSize == UNDEFINED) {
                textSize = chart.fontSize;
            }

            var color = axis.color;
            if (color == UNDEFINED) {
                color = chart.color;
            }
            if (labelColor !== UNDEFINED) {
                color = labelColor;
            }

            var container = axis.chart.container;
            var set = container.set();
            _this.set = set;

            var vCompensation = 3;
            var hCompensation = 4;
            var axisThickness = axis.axisThickness;
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
            var labelRotation = axis.labelRotationR;
            var counter = axis.counter;
            var labelInside = axis.inside;
            var labelOffset = axis.labelOffset;
            var dx = axis.dx;
            var dy = axis.dy;

            var orientation = axis.orientation;
            var position = axis.position;
            var previousCoord = axis.previousCoord;

            var vh = axis.height;
            var vw = axis.width;
            var offset = axis.offset;

            var tick;
            var grid;
            var MIDDLE = "middle";
            var START = "start";
            var BOTTOM = "bottom";


            if (guide) {
                if (guide.id !== undefined) {
                    className = chart.classNamePrefix + "-guide-" + guide.id;
                }

                labelsEnabled = true;

                if (!isNaN(guide.tickLength)) {
                    tickLength = guide.tickLength;
                }

                if (guide.lineColor != UNDEFINED) {
                    gridColor = guide.lineColor;
                }

                if (guide.color != UNDEFINED) {
                    color = guide.color;
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

                    if (offset > 0) {
                        offset = 0;
                    }
                }

                if (!isNaN(guide.labelRotation)) {
                    labelRotation = guide.labelRotation;
                }
                if (!isNaN(guide.fontSize)) {
                    textSize = guide.fontSize;
                }

                if (guide.position) {
                    position = guide.position;
                }
                if (guide.boldLabel !== undefined) {
                    bold = guide.boldLabel;
                }
                if (!isNaN(guide.labelOffset)) {
                    labelOffset = guide.labelOffset;
                }
            } else {
                if (value === "") {
                    tickLength = 0;
                }
            }

            if (minor && !isNaN(axis.minorTickLength)) {
                tickLength = axis.minorTickLength;
            }

            var align = START;
            if (textWidth > 0) {
                align = MIDDLE;
            }

            if (axis.centerLabels) {
                align = MIDDLE;
            }

            var angle = labelRotation * Math.PI / 180;
            var fillWidth;
            var fill;
            var fillHeight;
            var lx = 0;
            var ly = 0;
            var tx = 0;
            var ty = 0;
            var labelTextWidth = 0;
            var labelTextHeight = 0;
            var fillCoord;

            if (orientation == "V") {
                labelRotation = 0;
            }

            var valueTF;
            if (labelsEnabled && value !== "") {
                if (axis.autoWrap && labelRotation === 0) {
                    valueTF = AmCharts.wrappedText(container, value, color, fontFamily, textSize, align, bold, Math.abs(textWidth), 0);
                } else {
                    valueTF = AmCharts.text(container, value, color, fontFamily, textSize, align, bold);
                }

                var bbox = valueTF.getBBox();
                labelTextWidth = bbox.width;
                labelTextHeight = bbox.height;
            }

            // horizontal AXIS
            if (orientation == "H") {
                if (coord >= 0 && coord <= vw + 1) {
                    if (tickLength > 0 && axisAlpha > 0 && coord + tickShift <= vw + 1) {
                        tick = AmCharts.line(container, [coord + tickShift, coord + tickShift], [0, tickLength], axisColor, axisAlpha, gridThickness);
                        set.push(tick);
                    }
                    if (gridAlpha > 0) {
                        grid = AmCharts.line(container, [coord, coord + dx, coord + dx], [vh, vh + dy, dy], gridColor, gridAlpha, gridThickness, dashLength);
                        set.push(grid);
                    }
                }
                ly = 0;
                lx = coord;

                if (guide && labelRotation == 90 && labelInside) {
                    lx -= textSize;
                }

                if (below === false) {
                    align = START;

                    if (position == BOTTOM) {
                        if (labelInside) {
                            ly += tickLength;
                        } else {
                            ly -= tickLength;
                        }
                    } else {
                        if (labelInside) {
                            ly -= tickLength;
                        } else {
                            ly += tickLength;
                        }
                    }

                    lx += 3;

                    if (textWidth > 0) {
                        lx += textWidth / 2 - 3;
                        align = MIDDLE;
                    }

                    if (labelRotation > 0) {
                        align = MIDDLE;
                    }
                } else {
                    align = MIDDLE;
                }


                if (counter == 1 && fillAlpha > 0 && !guide && !minor && previousCoord < vw) {
                    fillCoord = AmCharts.fitToBounds(coord, 0, vw);
                    previousCoord = AmCharts.fitToBounds(previousCoord, 0, vw);
                    fillWidth = fillCoord - previousCoord;
                    if (fillWidth > 0) {
                        fill = AmCharts.rect(container, fillWidth, axis.height, fillColor, fillAlpha);
                        fill.translate((fillCoord - fillWidth + dx), dy);
                        set.push(fill);
                    }
                }

                // ADJUST POSITIONS
                // BOTTOM
                if (position == BOTTOM) {
                    ly += vh + textSize / 2 + offset;

                    //INSIDE
                    if (labelInside) {
                        if (labelRotation > 0) {
                            ly = vh - (labelTextWidth / 2) * Math.sin(angle) - tickLength - vCompensation;
                            lx += (labelTextWidth / 2) * Math.cos(angle) - hCompensation + 2;
                        } else if (labelRotation < 0) {
                            ly = vh + labelTextWidth * Math.sin(angle) - tickLength - vCompensation + 2;
                            lx += -labelTextWidth * Math.cos(angle) - labelTextHeight * Math.sin(angle) - hCompensation;
                        } else {
                            ly -= tickLength + textSize + vCompensation + vCompensation;
                        }
                        ly -= labelOffset;
                    }
                    //OUTSIDE
                    else {
                        if (labelRotation > 0) {
                            ly = vh + (labelTextWidth / 2) * Math.sin(angle) + tickLength + vCompensation;
                            lx -= (labelTextWidth / 2) * Math.cos(angle);
                        } else if (labelRotation < 0) {
                            ly = vh + tickLength + vCompensation - (labelTextWidth / 2) * Math.sin(angle) + 2;
                            lx += (labelTextWidth / 2) * Math.cos(angle);
                        } else {
                            ly += tickLength + axisThickness + vCompensation + 3;
                        }
                        ly += labelOffset;
                    }
                }
                // TOP
                else {
                    ly += dy + textSize / 2 - offset;
                    lx += dx;
                    //INSIDE
                    if (labelInside) {
                        if (labelRotation > 0) {
                            ly = (labelTextWidth / 2) * Math.sin(angle) + tickLength + vCompensation;
                            lx -= (labelTextWidth / 2) * Math.cos(angle);
                        } else {
                            ly += tickLength + vCompensation;
                        }
                        ly += labelOffset;
                    }
                    //OUTSIDE
                    else {
                        if (labelRotation > 0) {
                            ly = -(labelTextWidth / 2) * Math.sin(angle) - tickLength - 2 * vCompensation;
                            lx += (labelTextWidth / 2) * Math.cos(angle);
                        } else {
                            ly -= tickLength + textSize + vCompensation + axisThickness + 3;
                        }
                        ly -= labelOffset;
                    }
                }

                if (position == BOTTOM) {
                    //INSIDE
                    if (labelInside) {
                        ty = vh - tickLength - 1;
                    }
                    //OUTSIDE
                    else {
                        ty = vh + axisThickness - 1;
                    }
                    ty += offset;
                }
                // TOP
                else {
                    tx = dx;
                    //INSIDE
                    if (labelInside) {
                        ty = dy;
                    }
                    //OUTSIDE
                    else {
                        ty = dy - tickLength - axisThickness + 1;
                    }
                    ty -= offset;
                }

                if (valueShift) {
                    lx += valueShift;
                }

                var llx = lx;

                if (labelRotation > 0) {
                    llx += labelTextWidth / 2 * Math.cos(angle);
                }

                if (valueTF) {
                    var dlx = 0;
                    if (labelInside) {
                        dlx = labelTextWidth / 2 * Math.cos(angle);
                    }

                    if (llx + dlx > vw + 2 || llx < 0) {
                        valueTF.remove();
                        valueTF = null;
                    }
                }
            }
            // VERTICAL AXIS
            else {
                if (coord >= 0 && coord <= vh + 1) {
                    // ticks
                    if (tickLength > 0 && axisAlpha > 0 && coord + tickShift <= vh + 1) {
                        tick = AmCharts.line(container, [0, tickLength + 1], [coord + tickShift, coord + tickShift], axisColor, axisAlpha, gridThickness);
                        set.push(tick);
                    }
                    // grid
                    if (gridAlpha > 0) {
                        grid = AmCharts.line(container, [0, dx, vw + dx], [coord, coord + dy, coord + dy], gridColor, gridAlpha, gridThickness, dashLength);
                        set.push(grid);
                    }
                }

                // text field
                align = "end";

                if ((labelInside === true && position == "left") || (labelInside === false && position == "right")) {
                    align = START;
                }
                ly = coord - labelTextHeight / 2 + 2;

                if (counter == 1 && fillAlpha > 0 && !guide && !minor) {
                    fillCoord = AmCharts.fitToBounds(coord, 0, vh);
                    previousCoord = AmCharts.fitToBounds(previousCoord, 0, vh);
                    fillHeight = fillCoord - previousCoord;
                    fill = AmCharts.polygon(container, [0, axis.width, axis.width, 0], [0, 0, fillHeight, fillHeight], fillColor, fillAlpha);
                    fill.translate(dx, (fillCoord - fillHeight + dy));
                    set.push(fill);
                }
                // ADJUST POSITIONS
                // RIGHT
                ly += textSize / 2;
                if (position == "right") {
                    lx += dx + vw + offset;
                    ly += dy;

                    // INSIDE
                    if (labelInside) {
                        lx -= tickLength + hCompensation;
                        if (!valueShift) {
                            ly -= textSize / 2 + 3;
                        }
                        lx -= labelOffset;
                    }
                    //OUTSIDE
                    else {
                        lx += tickLength + hCompensation + axisThickness;
                        ly -= 2;
                        lx += labelOffset;
                    }
                }
                // LEFT
                else {
                    // INSIDE
                    if (labelInside) {
                        lx += tickLength + hCompensation - offset;
                        if (!valueShift) {
                            ly -= textSize / 2 + 3;
                        }
                        if (guide) {
                            lx += dx;
                            ly += dy;
                        }
                        lx += labelOffset;
                    }
                    // OUTSIDE
                    else {
                        lx += -tickLength - axisThickness - hCompensation - 2 - offset;
                        ly -= 2;
                        lx -= labelOffset;
                    }
                }

                if (tick) {
                    if (position == "right") {
                        tx += dx + offset + vw - 1;
                        ty += dy;
                        // INSIDE
                        if (labelInside) {
                            tx -= axisThickness;
                        }
                        //OUTSIDE
                        else {
                            tx += axisThickness;
                        }
                    }
                    // LEFT
                    else {
                        tx -= offset;
                        // INSIDE
                        if (labelInside) {
                            // void
                        }
                        // OUTSIDE
                        else {
                            tx -= tickLength + axisThickness;
                        }
                    }
                }

                if (valueShift) {
                    ly += valueShift;
                }

                var topY = -3;

                if (position == "right") {
                    topY += dy;
                }
                if (valueTF) {
                    if (ly > vh + 1 || ly < topY - textSize / 10) {
                        valueTF.remove();
                        valueTF = null;
                    }
                }
            }

            if (tick) {
                tick.translate(tx, ty);
                AmCharts.setCN(chart, tick, axis.bcn + "tick");
                AmCharts.setCN(chart, tick, className, true);

                if (guide) {
                    AmCharts.setCN(chart, tick, "guide");
                }
            }

            if (axis.visible === false) {
                if (tick) {
                    tick.remove();
                    tick = null;
                }
                if (valueTF) {
                    valueTF.remove();
                    valueTF = null;
                }
            }

            if (valueTF) {
                valueTF.attr({
                    "text-anchor": align
                });
                valueTF.translate(lx, ly, NaN, true);

                if (labelRotation !== 0) {
                    valueTF.rotate(-labelRotation, axis.chart.backgroundColor);
                }
                axis.allLabels.push(valueTF);

                //if (value != " ") { // caused memory leak 3.12.0
                _this.label = valueTF;
                //}

                AmCharts.setCN(chart, valueTF, axis.bcn + "label");
                AmCharts.setCN(chart, valueTF, className, true);
                if (guide) {
                    AmCharts.setCN(chart, valueTF, "guide");
                }
            }

            if (grid) {
                AmCharts.setCN(chart, grid, axis.bcn + "grid");
                AmCharts.setCN(chart, grid, className, true);
                if (guide) {
                    AmCharts.setCN(chart, grid, "guide");
                }
            }

            if (fill) {
                AmCharts.setCN(chart, fill, axis.bcn + "fill");
                AmCharts.setCN(chart, fill, className, true);
            }

            if (!minor) {
                if (counter === 0) {
                    axis.counter = 1;
                } else {
                    axis.counter = 0;
                }
                axis.previousCoord = coord;
            } else {
                if (grid) {
                    AmCharts.setCN(chart, grid, axis.bcn + "grid-minor");
                }
            }

            // remove empty
            if (_this.set.node.childNodes.length === 0) {
                _this.set.remove();
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
    AmCharts.RecFill = AmCharts.Class({

        construct: function(axis, guideCoord, guideToCoord, guide) {
            var _this = this;
            var dx = axis.dx;
            var dy = axis.dy;
            var orientation = axis.orientation;
            var shift = 0;

            if (guideToCoord < guideCoord) {
                var temp = guideCoord;
                guideCoord = guideToCoord;
                guideToCoord = temp;
            }

            var fillAlpha = guide.fillAlpha;
            if (isNaN(fillAlpha)) {
                fillAlpha = 0;
            }
            var container = axis.chart.container;
            var fillColor = guide.fillColor;


            if (orientation == "V") {
                guideCoord = AmCharts.fitToBounds(guideCoord, 0, axis.height);
                guideToCoord = AmCharts.fitToBounds(guideToCoord, 0, axis.height);
            } else {
                guideCoord = AmCharts.fitToBounds(guideCoord, 0, axis.width);
                guideToCoord = AmCharts.fitToBounds(guideToCoord, 0, axis.width);
            }

            var fillWidth = guideToCoord - guideCoord;

            if (isNaN(fillWidth)) {
                fillWidth = 4;
                shift = 2;
                fillAlpha = 0;
            }

            if (fillWidth < 0) {
                if (typeof(fillColor) == "object") {
                    fillColor = fillColor.join(",").split(",").reverse();
                }
            }

            var fill;

            if (orientation == "V") {
                fill = AmCharts.rect(container, axis.width, fillWidth, fillColor, fillAlpha);
                fill.translate(dx, guideCoord - shift + dy);
            } else {
                fill = AmCharts.rect(container, fillWidth, axis.height, fillColor, fillAlpha);
                fill.translate(guideCoord - shift + dx, dy);
            }

            AmCharts.setCN(axis.chart, fill, "guide-fill");
            if (guide.id) {
                AmCharts.setCN(axis.chart, fill, "guide-fill-" + guide.id);
            }

            _this.set = container.set([fill]);
        },

        graphics: function() {
            return this.set;
        },

        getLabel: function() {

        }
    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.AmChart = AmCharts.Class({

        construct: function(theme) {
            var _this = this;
            _this.tapToActivate = true;
            _this.svgIcons = true;
            _this.theme = theme;
            _this.classNamePrefix = "amcharts";
            _this.addClassNames = false;
            _this.version = "3.20.10";
            AmCharts.addChart(_this);
            _this.createEvents("buildStarted", "dataUpdated", "init", "rendered", "drawn", "failed", "resized", "animationFinished");
            _this.width = "100%";
            _this.height = "100%";
            _this.dataChanged = true;
            _this.chartCreated = false;
            _this.previousHeight = 0;
            _this.previousWidth = 0;
            _this.backgroundColor = "#FFFFFF";
            _this.backgroundAlpha = 0;
            _this.borderAlpha = 0;
            _this.borderColor = "#000000";
            _this.color = "#000000";
            _this.fontFamily = "Verdana";
            _this.fontSize = 11;
            _this.usePrefixes = false;
            _this.autoResize = true;
            _this.autoDisplay = false;
            _this.accessible = true;
            //_this.path = "amcharts/";
            _this.addCodeCredits = true;
            _this.touchClickDuration = 0;
            _this.touchStartTime = 0;

            _this.precision = -1;
            _this.percentPrecision = 2;
            _this.decimalSeparator = ".";
            _this.thousandsSeparator = ",";

            _this.labels = [];
            _this.allLabels = [];
            _this.titles = [];
            _this.autoMarginOffset = 0;
            _this.marginLeft = 0;
            _this.marginRight = 0;
            _this.timeOuts = [];
            _this.creditsPosition = "top-left";

            var chartDiv = document.createElement("div");
            var chartStyle = chartDiv.style;
            chartStyle.overflow = "hidden";
            chartStyle.position = "relative";
            chartStyle.textAlign = "left";
            _this.chartDiv = chartDiv;

            var legendDiv = document.createElement("div");
            var legendStyle = legendDiv.style;
            legendStyle.overflow = "hidden";
            legendStyle.position = "relative";
            legendStyle.textAlign = "left";
            _this.legendDiv = legendDiv;

            _this.titleHeight = 0;
            _this.hideBalloonTime = 150;

            _this.handDrawScatter = 2;
            _this.handDrawThickness = 1;

            _this.cssScale = 1;
            _this.cssAngle = 0;

            _this.prefixesOfBigNumbers = [{
                number: 1e+3,
                prefix: "k"
            }, {
                number: 1e+6,
                prefix: "M"
            }, {
                number: 1e+9,
                prefix: "G"
            }, {
                number: 1e+12,
                prefix: "T"
            }, {
                number: 1e+15,
                prefix: "P"
            }, {
                number: 1e+18,
                prefix: "E"
            }, {
                number: 1e+21,
                prefix: "Z"
            }, {
                number: 1e+24,
                prefix: "Y"
            }];
            _this.prefixesOfSmallNumbers = [{
                number: 1e-24,
                prefix: "y"
            }, {
                number: 1e-21,
                prefix: "z"
            }, {
                number: 1e-18,
                prefix: "a"
            }, {
                number: 1e-15,
                prefix: "f"
            }, {
                number: 1e-12,
                prefix: "p"
            }, {
                number: 1e-9,
                prefix: "n"
            }, {
                number: 1e-6,
                prefix: "μ"
            }, {
                number: 1e-3,
                prefix: "m"
            }];
            _this.panEventsEnabled = true; // changed since 3.4.4


            _this.product = "amcharts";

            _this.animations = [];

            _this.balloon = new AmCharts.AmBalloon(_this.theme);
            _this.balloon.chart = this;

            _this.processTimeout = 0;
            _this.processCount = 1000;

            _this.animatable = [];

            AmCharts.applyTheme(_this, theme, "AmChart");
        },

        drawChart: function() {
            var _this = this;

            if (_this.realWidth > 0 && _this.realHeight > 0) {

                _this.drawBackground();

                _this.redrawLabels();

                _this.drawTitles();

                _this.brr();

                _this.renderFix();

                if (_this.chartDiv) {
                    _this.boundingRect = _this.chartDiv.getBoundingClientRect();
                }
            }
        },

        makeAccessible: function(svgObject, label, role) {
            var _this = this;
            if (_this.accessible && svgObject) {
                if(role){
                    svgObject.setAttr("role", role);
                }
                svgObject.setAttr("aria-label", label);
            }
        },

        drawBackground: function() {
            var _this = this;
            AmCharts.remove(_this.background);
            var container = _this.container;
            var backgroundColor = _this.backgroundColor;
            var backgroundAlpha = _this.backgroundAlpha;
            var set = _this.set;

            if (!AmCharts.isModern && backgroundAlpha === 0) {
                backgroundAlpha = 0.001;
            }

            var realWidth = _this.updateWidth();
            _this.realWidth = realWidth;

            var realHeight = _this.updateHeight();
            _this.realHeight = realHeight;

            var background = AmCharts.polygon(container, [0, realWidth - 1, realWidth - 1, 0], [0, 0, realHeight - 1, realHeight - 1], backgroundColor, backgroundAlpha, 1, _this.borderColor, _this.borderAlpha);
            AmCharts.setCN(_this, background, "bg");
            _this.background = background;
            set.push(background);

            var backgroundImage = _this.backgroundImage;
            if (backgroundImage) {
                var bgImg = container.image(backgroundImage, 0, 0, realWidth, realHeight);
                AmCharts.setCN(_this, backgroundImage, "bg-image");
                _this.bgImg = bgImg;
                set.push(bgImg);
            }
        },

        drawTitles: function(remove) {
            var _this = this;
            var titles = _this.titles;
            _this.titleHeight = 0;

            if (AmCharts.ifArray(titles)) {
                var nextY = 20;
                var i;
                for (i = 0; i < titles.length; i++) {
                    var title = titles[i];
                    title = AmCharts.processObject(title, AmCharts.Title, _this.theme);

                    if (title.enabled !== false) {
                        var color = title.color;
                        if (color === undefined) {
                            color = _this.color;
                        }
                        var size = title.size;

                        if (isNaN(size)) {
                            size = _this.fontSize + 2;
                        }

                        var alpha = title.alpha;
                        if (isNaN(alpha)) {
                            alpha = 1;
                        }

                        var marginLeft = _this.marginLeft;
                        var bold = true;
                        if (title.bold !== undefined) {
                            bold = title.bold;
                        }

                        var dw = 35;
                        var titleLabel = AmCharts.wrappedText(_this.container, title.text, color, _this.fontFamily, size, "middle", bold, _this.realWidth - dw);
                        titleLabel.translate(marginLeft + (_this.realWidth - _this.marginRight - marginLeft) / 2, nextY);
                        titleLabel.node.style.pointerEvents = "none";
                        title.sprite = titleLabel;

                        if (title.tabIndex !== undefined) {
                            titleLabel.setAttr("tabindex", title.tabIndex);
                        }

                        AmCharts.setCN(_this, titleLabel, "title");
                        if (title.id) {
                            AmCharts.setCN(_this, titleLabel, "title-" + title.id);
                        }

                        titleLabel.attr({
                            opacity: title.alpha
                        });

                        nextY += titleLabel.getBBox().height + 5;
                        if (remove) {
                            titleLabel.remove();
                        } else {
                            _this.freeLabelsSet.push(titleLabel);
                        }
                    }
                }
                _this.titleHeight = nextY - 10;
            }
        },

        write: function(divId) {

            var _this = this;

            if (_this.listeners) {
                for (var i = 0; i < _this.listeners.length; i++) {
                    var ev = _this.listeners[i];
                    _this.addListener(ev.event, ev.method);
                }
            }

            var event = {
                type: "buildStarted",
                chart: _this
            };
            _this.fire(event);
            if (_this.afterWriteTO) {
                clearTimeout(_this.afterWriteTO);
            }

            if (_this.processTimeout > 0) {
                _this.afterWriteTO = setTimeout(function() {
                    _this.afterWrite.call(_this, divId);
                }, _this.processTimeout);
            } else {
                _this.afterWrite(divId);
            }
        },


        afterWrite: function(divId) {
            var _this = this;
            var div;
            if (typeof(divId) != "object") {
                div = document.getElementById(divId);
            } else {
                div = divId;
            }
            if (div) {
                //div.innerHTML = "";
                // fixed ammap prob
                while (div.firstChild) {
                    div.removeChild(div.firstChild);
                }

                _this.div = div;

                div.style.overflow = "hidden";
                div.style.textAlign = "left";

                var chartDiv = _this.chartDiv;
                var legendDiv = _this.legendDiv;
                var legend = _this.legend;
                var legendStyle = legendDiv.style;

                var chartStyle = chartDiv.style;
                _this.measure();

                _this.previousHeight = _this.divRealHeight;
                _this.previousWidth = _this.divRealWidth;

                var UNDEFINED;
                var ABSOLUTE = "absolute";
                var RELATIVE = "relative";
                var PX = "px";
                var containerStyle;

                var container = document.createElement("div");
                containerStyle = container.style;
                containerStyle.position = RELATIVE;
                _this.containerDiv = container;
                container.className = _this.classNamePrefix + "-main-div";
                chartDiv.className = _this.classNamePrefix + "-chart-div";

                div.appendChild(container);

                var exportConfig = _this.exportConfig;

                if (exportConfig && AmCharts.AmExport) {
                    var amExport = _this.AmExport;
                    if (!amExport) {
                        _this.AmExport = new AmCharts.AmExport(this, exportConfig);
                    }
                }

                if (_this.amExport && AmCharts.AmExport) {
                    _this.AmExport = AmCharts.extend(_this.amExport, new AmCharts.AmExport(this), true);
                }

                if (_this.AmExport) {
                    if (_this.AmExport.init) {
                        _this.AmExport.init();
                    }
                }


                if (legend) {

                    legend = _this.addLegend(legend, legend.divId);

                    if (legend.enabled) {

                        legendStyle.left = null;
                        legendStyle.top = null;
                        legendStyle.right = null;
                        chartStyle.left = null;
                        chartStyle.right = null;
                        chartStyle.top = null;
                        legendStyle.position = RELATIVE;
                        chartStyle.position = RELATIVE;
                        
                        containerStyle.width = "100%";
                        containerStyle.height = "100%";                        

                        switch (legend.position) {
                            case "bottom":
                                container.appendChild(chartDiv);
                                container.appendChild(legendDiv);
                                break;
                            case "top":
                                container.appendChild(legendDiv);
                                container.appendChild(chartDiv);
                                break;
                            case ABSOLUTE:
                                legendStyle.position = ABSOLUTE;
                                chartStyle.position = ABSOLUTE;
                                if (legend.left !== UNDEFINED) {
                                    legendStyle.left = legend.left + PX;
                                }
                                if (legend.right !== UNDEFINED) {
                                    legendStyle.right = legend.right + PX;
                                }
                                if (legend.top !== UNDEFINED) {
                                    legendStyle.top = legend.top + PX;
                                }
                                if (legend.bottom !== UNDEFINED) {
                                    legendStyle.bottom = legend.bottom + PX;
                                }
                                legend.marginLeft = 0;
                                legend.marginRight = 0;

                                container.appendChild(chartDiv);
                                container.appendChild(legendDiv);
                                break;
                            case "right":
                                legendStyle.position = RELATIVE;
                                chartStyle.position = ABSOLUTE;
                                container.appendChild(chartDiv);
                                container.appendChild(legendDiv);
                                break;
                            case "left":
                                legendStyle.position = ABSOLUTE;
                                chartStyle.position = RELATIVE;
                                container.appendChild(chartDiv);
                                container.appendChild(legendDiv);
                                break;
                            case "outside":
                                container.appendChild(chartDiv);
                                break;
                        }
                    } else {
                        container.appendChild(chartDiv);
                    }
                    _this.prevLegendPosition = legend.position;
                } else {
                    container.appendChild(chartDiv);
                }

                if (!_this.listenersAdded) {
                    _this.addListeners();
                    _this.listenersAdded = true;
                }

                _this.initChart();
            }
        },

        createLabelsSet: function() {
            var _this = this;
            AmCharts.remove(_this.labelsSet);
            _this.labelsSet = _this.container.set();
            _this.freeLabelsSet.push(_this.labelsSet);
        },


        initChart: function() {

            var _this = this;

            _this.balloon = AmCharts.processObject(_this.balloon, AmCharts.AmBalloon, _this.theme);

            if (window.AmCharts_path) {
                _this.path = window.AmCharts_path;
            }

            if (_this.path === undefined) {
                _this.path = AmCharts.getPath();
            }

            if (_this.path === undefined) {
                _this.path = "amcharts/";
            }

            _this.path = AmCharts.normalizeUrl(_this.path);

            if (_this.pathToImages === undefined) {
                _this.pathToImages = _this.path + "images/";
            }

            if (!_this.initHC) {
                AmCharts.callInitHandler(this);
                _this.initHC = true;
            }
            AmCharts.applyLang(_this.language, _this);

            // this is to handle backwards compatibility when numberFormatter and percentFromatter were objects
            var numberFormatter = _this.numberFormatter;
            if (numberFormatter) {
                if (!isNaN(numberFormatter.precision)) {
                    _this.precision = numberFormatter.precision;
                }

                if (numberFormatter.thousandsSeparator !== undefined) {
                    _this.thousandsSeparator = numberFormatter.thousandsSeparator;
                }

                if (numberFormatter.decimalSeparator !== undefined) {
                    _this.decimalSeparator = numberFormatter.decimalSeparator;
                }
            }

            var percentFormatter = _this.percentFormatter;
            if (percentFormatter) {
                if (!isNaN(percentFormatter.precision)) {
                    _this.percentPrecision = percentFormatter.precision;
                }
            }

            _this.nf = {
                precision: _this.precision,
                thousandsSeparator: _this.thousandsSeparator,
                decimalSeparator: _this.decimalSeparator
            };
            _this.pf = {
                precision: _this.percentPrecision,
                thousandsSeparator: _this.thousandsSeparator,
                decimalSeparator: _this.decimalSeparator
            };

            //_this.previousHeight = _this.divRealHeight;
            //_this.previousWidth = _this.divRealWidth;

            _this.destroy();

            var container = _this.container;
            if (container) {
                container.container.innerHTML = "";
                container.width = _this.realWidth;
                container.height = _this.realHeight;
                container.addDefs(_this);
                _this.chartDiv.appendChild(container.container);
            } else {
                container = new AmCharts.AmDraw(_this.chartDiv, _this.realWidth, _this.realHeight, _this);
            }
            _this.container = container;

            _this.extension = ".png";
            if (_this.svgIcons && AmCharts.SVG) {
                _this.extension = ".svg";
            }

            _this.checkDisplay();

            _this.checkTransform(_this.div);

            container.chart = _this;

            if (AmCharts.VML || AmCharts.SVG) {

                container.handDrawn = _this.handDrawn;
                container.handDrawScatter = _this.handDrawScatter;
                container.handDrawThickness = _this.handDrawThickness;


                AmCharts.remove(_this.set);
                _this.set = container.set();
                //_this.set.setAttr("id", "mainSet");

                AmCharts.remove(_this.gridSet);
                _this.gridSet = container.set();
                //_this.gridSet.setAttr("id", "grid");

                AmCharts.remove(_this.cursorLineSet);
                _this.cursorLineSet = container.set();


                AmCharts.remove(_this.graphsBehindSet);
                _this.graphsBehindSet = container.set();

                AmCharts.remove(_this.bulletBehindSet);
                _this.bulletBehindSet = container.set();

                AmCharts.remove(_this.columnSet);
                _this.columnSet = container.set();
                //_this.columnSet.setAttr("id", "columns");


                AmCharts.remove(_this.graphsSet);
                _this.graphsSet = container.set();

                AmCharts.remove(_this.trendLinesSet);
                _this.trendLinesSet = container.set();
                //_this.trendLinesSet.setAttr("id", "trendlines");

                AmCharts.remove(_this.axesSet);
                _this.axesSet = container.set();
                //_this.axesSet.setAttr("id", "axes");


                AmCharts.remove(_this.cursorSet);
                _this.cursorSet = container.set();
                //_this.cursorSet.setAttr("id", "cursor");


                AmCharts.remove(_this.scrollbarsSet);
                _this.scrollbarsSet = container.set();
                //_this.scrollbarsSet.setAttr("id", "scrollbars");

                AmCharts.remove(_this.bulletSet);
                _this.bulletSet = container.set();
                //_this.bulletSet.setAttr("id", "bullets");


                AmCharts.remove(_this.freeLabelsSet);
                _this.freeLabelsSet = container.set();
                //_this.freeLabelsSet.setAttr("id", "free labels");

                AmCharts.remove(_this.axesLabelsSet);
                _this.axesLabelsSet = container.set();
                //_this.axesLabelsSet.setAttr("id", "axes labels");


                AmCharts.remove(_this.balloonsSet);
                _this.balloonsSet = container.set();


                AmCharts.remove(_this.plotBalloonsSet);
                _this.plotBalloonsSet = container.set();

                AmCharts.remove(_this.zoomButtonSet);
                _this.zoomButtonSet = container.set();

                AmCharts.remove(_this.zbSet);
                _this.zbSet = null;

                AmCharts.remove(_this.linkSet);
                _this.linkSet = container.set();
            } else {
                var etype = "failed";
                _this.fire({
                    type: etype,
                    chart: _this
                });

                return;
            }
        },

        premeasure: function() {
            var _this = this;
            var div = _this.div;

            if (div) {
                try {
                    _this.boundingRect = _this.chartDiv.getBoundingClientRect();
                } catch (err) {

                }

                var mw = div.offsetWidth;
                var mh = div.offsetHeight;

                if (div.clientHeight) {
                    mw = div.clientWidth;
                    mh = div.clientHeight;
                }

                if (mw != _this.mw || mh != _this.mh) {
                    _this.mw = mw;
                    _this.mh = mh;
                    _this.measure();
                }
            }
        },

        measure: function() {
            var _this = this;

            var div = _this.div;

            if (div) {
                var chartDiv = _this.chartDiv;
                var divRealWidth = div.offsetWidth;
                var divRealHeight = div.offsetHeight;
                var container = _this.container;
                var PX = "px";

                if (div.clientHeight) {
                    divRealWidth = div.clientWidth;
                    divRealHeight = div.clientHeight;
                }

                var paddingLeft = AmCharts.removePx(AmCharts.getStyle(div, "padding-left"));
                var paddingRight = AmCharts.removePx(AmCharts.getStyle(div, "padding-right"));
                var paddingTop = AmCharts.removePx(AmCharts.getStyle(div, "padding-top"));
                var paddingBottom = AmCharts.removePx(AmCharts.getStyle(div, "padding-bottom"));

                if (!isNaN(paddingLeft)) {
                    divRealWidth -= paddingLeft;
                }
                if (!isNaN(paddingRight)) {
                    divRealWidth -= paddingRight;
                }
                if (!isNaN(paddingTop)) {
                    divRealHeight -= paddingTop;
                }
                if (!isNaN(paddingBottom)) {
                    divRealHeight -= paddingBottom;
                }

                var divRealWidth = div.offsetWidth;
                var divRealHeight = div.offsetHeight;

                if (div.clientHeight) {
                    divRealWidth = div.clientWidth;
                    divRealHeight = div.clientHeight;
                }

                divRealHeight = Math.round(divRealHeight);
                divRealWidth = Math.round(divRealWidth);

                var realWidth = Math.round(AmCharts.toCoordinate(_this.width, divRealWidth));
                var realHeight = Math.round(AmCharts.toCoordinate(_this.height, divRealHeight));

                if ((divRealWidth != _this.previousWidth || divRealHeight != _this.previousHeight) && realWidth > 0 && realHeight > 0) {
                    chartDiv.style.width = realWidth + PX;
                    chartDiv.style.height = realHeight + PX;
                    chartDiv.style.padding = 0;

                    if (container) {
                        container.setSize(realWidth, realHeight);
                    }
                    _this.balloon = AmCharts.processObject(_this.balloon, AmCharts.AmBalloon, _this.theme);
                }
                if (_this.balloon.setBounds) {
                    _this.balloon.setBounds(2, 2, realWidth - 2, realHeight);
                }
                _this.balloon.chart = this;
                _this.realWidth = realWidth;
                _this.realHeight = realHeight;
                _this.divRealWidth = divRealWidth;
                _this.divRealHeight = divRealHeight;
            }

        },

        checkDisplay: function() {
            var _this = this;
            if (_this.autoDisplay) {
                if (_this.container) {
                    var tester = AmCharts.rect(_this.container, 10, 10);
                    var bbox = tester.getBBox();

                    if (bbox.width === 0 && bbox.height === 0) {
                        _this.realWidth = 0;
                        _this.realHeight = 0;
                        _this.divRealWidth = 0;
                        _this.divRealHeight = 0;
                        _this.previousHeight = NaN;
                        _this.previousWidth = NaN;
                    }
                    tester.remove();
                }
            }
        },

        checkTransform:function(div){
            var _this = this;
            if(_this.autoTransform){                
                if(window.getComputedStyle){
                    if(div){
                        if(div.style){
                            var style = window.getComputedStyle(div, null);
                            if(style){
                                var matrix = style.getPropertyValue("-webkit-transform") ||
                                    style.getPropertyValue("-moz-transform") ||
                                    style.getPropertyValue("-ms-transform") ||
                                    style.getPropertyValue("-o-transform") ||
                                    style.getPropertyValue("transform");

                                if(matrix && matrix !== "none"){
                                    var values = matrix.split('(')[1].split(')')[0].split(',');
                                    var a = values[0];
                                    var b = values[1];
                                    //var c = values[2];
                                    //var d = values[3];

                                    var scale = Math.sqrt(a * a + b * b);
                                    //var sin = b / scale;                    
                                    //var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

                                    if(!isNaN(scale)){
                                        _this.cssScale *= scale;
                                    }

                                    //if(!isNaN(angle)){
                                    //    _this.cssAngle += angle;
                                    //}
                                }
                            }
                        }
                        if(div.parentNode){
                            _this.checkTransform(div.parentNode);
                        }
                    }
                }
            }
        },

        destroy: function() {
            var _this = this;
            _this.chartDiv.innerHTML = "";
            _this.clearTimeOuts();

            if (_this.legend) {
                _this.legend.destroy();
            }
        },

        clearTimeOuts: function() {
            var _this = this;
            var timeOuts = _this.timeOuts;
            if (timeOuts) {
                var i;
                for (i = 0; i < timeOuts.length; i++) {
                    clearTimeout(timeOuts[i]);
                }
            }
            _this.timeOuts = [];
        },

        clear: function(keepChart) {
            var _this = this;
            try {
                document.removeEventListener("touchstart", _this.docfn1, true);
                document.removeEventListener("touchend", _this.docfn2, true);
            } catch (err) {
                //void
            }

            AmCharts.callMethod("clear", [_this.chartScrollbar, _this.scrollbarV, _this.scrollbarH, _this.chartCursor]);
            _this.chartScrollbar = null;
            _this.scrollbarV = null;
            _this.scrollbarH = null;
            _this.chartCursor = null;
            _this.clearTimeOuts();

            if (_this.container) {
                _this.container.remove(_this.chartDiv);
                _this.container.remove(_this.legendDiv);
            }
            if (!keepChart) {
                AmCharts.removeChart(this);
            }
            var div = _this.div;
            if (div) {
                while (div.firstChild) {
                    div.removeChild(div.firstChild);
                }
            }

            if (_this.legend) {
                _this.legend.destroy();
            }

            if (_this.AmExport) {
                if (_this.AmExport.clear) {
                    _this.AmExport.clear();
                }
            }
        },

        setMouseCursor: function(cursor) {
            if (cursor == "auto" && AmCharts.isNN) {
                cursor = "default";
            }
            this.chartDiv.style.cursor = cursor;
            this.legendDiv.style.cursor = cursor;
        },


        redrawLabels: function() {
            var _this = this;
            _this.labels = [];
            var allLabels = _this.allLabels;

            _this.createLabelsSet();

            var i;
            for (i = 0; i < allLabels.length; i++) {
                _this.drawLabel(allLabels[i]);
            }
        },

        drawLabel: function(label) {
            var _this = this;

            if (_this.container && label.enabled !== false) {

                label = AmCharts.processObject(label, AmCharts.Label, _this.theme);

                var x = label.x;
                var y = label.y;
                var text = label.text;
                var align = label.align;
                var size = label.size;
                var color = label.color;
                var rotation = label.rotation;
                var alpha = label.alpha;
                var bold = label.bold;
                var UNDEFINED;

                var nx = AmCharts.toCoordinate(x, _this.realWidth);
                var ny = AmCharts.toCoordinate(y, _this.realHeight);

                if (!nx) {
                    nx = 0;
                }

                if (!ny) {
                    ny = 0;
                }

                if (color === UNDEFINED) {
                    color = _this.color;
                }
                if (isNaN(size)) {
                    size = _this.fontSize;
                }
                if (!align) {
                    align = "start";
                }
                if (align == "left") {
                    align = "start";
                }
                if (align == "right") {
                    align = "end";
                }
                if (align == "center") {
                    align = "middle";
                    if (!rotation) {
                        nx = _this.realWidth / 2 - nx;
                    } else {
                        ny = _this.realHeight - ny + ny / 2;
                    }
                }
                if (alpha === UNDEFINED) {
                    alpha = 1;
                }
                if (rotation === UNDEFINED) {
                    rotation = 0;
                }

                ny += size / 2;

                var labelObj = AmCharts.text(_this.container, text, color, _this.fontFamily, size, align, bold, alpha);
                labelObj.translate(nx, ny);

                if (label.tabIndex !== undefined) {
                    labelObj.setAttr("tabindex", label.tabIndex);
                }

                AmCharts.setCN(_this, labelObj, "label");
                if (label.id) {
                    AmCharts.setCN(_this, labelObj, "label-" + label.id);
                }

                if (rotation !== 0) {
                    labelObj.rotate(rotation);
                }

                if (label.url) {
                    labelObj.setAttr("cursor", "pointer");
                    labelObj.click(function() {
                        AmCharts.getURL(label.url, _this.urlTarget);
                    });
                } else {
                    labelObj.node.style.pointerEvents = "none";
                }

                _this.labelsSet.push(labelObj);
                _this.labels.push(labelObj);
            }
        },

        addLabel: function(x, y, text, align, size, color, rotation, alpha, bold, url) {
            var _this = this;
            var label = {
                x: x,
                y: y,
                text: text,
                align: align,
                size: size,
                color: color,
                alpha: alpha,
                rotation: rotation,
                bold: bold,
                url: url,
                enabled: true
            };

            if (_this.container) {
                _this.drawLabel(label);
            }
            _this.allLabels.push(label);
        },

        clearLabels: function() {
            var _this = this;
            var labels = _this.labels;
            var i;
            for (i = labels.length - 1; i >= 0; i--) {
                labels[i].remove();
            }
            _this.labels = [];
            _this.allLabels = [];
        },

        updateHeight: function() {
            var _this = this;
            var height = _this.divRealHeight;

            var legend = _this.legend;
            if (legend) {
                var legendHeight = _this.legendDiv.offsetHeight;

                var lPosition = legend.position;
                if (lPosition == "top" || lPosition == "bottom") {
                    height -= legendHeight;
                    if (height < 0 || isNaN(height)) {
                        height = 0;
                    }
                    _this.chartDiv.style.height = height + "px";
                }
            }
            return height;
        },


        updateWidth: function() {
            var _this = this;
            var width = _this.divRealWidth;
            var height = _this.divRealHeight;
            var legend = _this.legend;
            if (legend) {
                var legendDiv = _this.legendDiv;
                var legendWidth = legendDiv.offsetWidth;

                if (!isNaN(legend.width)) {
                    legendWidth = legend.width;
                }
                if (legend.ieW) {
                    legendWidth = legend.ieW;
                }

                var legendHeight = legendDiv.offsetHeight;
                var legendStyle = legendDiv.style;

                var chartDiv = _this.chartDiv;
                var chartStyle = chartDiv.style;

                var lPosition = legend.position;
                var px = "px";

                if (lPosition == "right" || lPosition == "left") {
                    width -= legendWidth;
                    if (width < 0 || isNaN(width)) {
                        width = 0;
                    }

                    chartStyle.width = width + px;
                    _this.balloon.setBounds(2, 2, width - 2, _this.realHeight);

                    if (lPosition == "left") {
                        chartStyle.left = legendWidth + px;
                        legendStyle.left = 0 + px;
                    } else {
                        chartStyle.left = 0 + px;
                        legendStyle.left = width + px;
                    }

                    if (height > legendHeight) {
                        legendStyle.top = (height - legendHeight) / 2 + px;
                    }
                }
            }
            return width;
        },


        getTitleHeight: function() {
            var _this = this;
            _this.drawTitles(true);
            return _this.titleHeight;
        },

        addTitle: function(text, size, color, alpha, bold) {
            var _this = this;

            if (isNaN(size)) {
                size = _this.fontSize + 2;
            }

            var tObj = {
                text: text,
                size: size,
                color: color,
                alpha: alpha,
                bold: bold,
                enabled: true
            };
            _this.titles.push(tObj);
            return tObj;
        },


        handleWheel: function(event) {

            var _this = this;

            var delta = 0;
            if (!event) {
                event = window.event;
            }
            if (event.wheelDelta) {
                delta = event.wheelDelta / 120;
            } else if (event.detail) {
                delta = -event.detail / 3;
            }
            if (delta) {
                _this.handleWheelReal(delta, event.shiftKey);
            }
            if (event.preventDefault) {
                event.preventDefault();
            }
        },

        handleWheelReal: function() {
            // void
        },


        handleDocTouchStart: function() {
            var _this = this;
            _this.hideBalloonReal();
            _this.handleMouseMove();
            _this.tmx = _this.mouseX;
            _this.tmy = _this.mouseY;
            _this.touchStartTime = new Date().getTime();
        },

        handleDocTouchEnd: function() {
            var _this = this;

            if (_this.tmx > -0.5 && _this.tmx < _this.divRealWidth + 1 && _this.tmy > 0 && _this.tmy < _this.divRealHeight) {
                _this.handleMouseMove();
                if (Math.abs(_this.mouseX - _this.tmx) < 4 && Math.abs(_this.mouseY - _this.tmy) < 4) {
                    _this.tapped = true;
                    if (_this.panRequired && _this.panEventsEnabled && _this.chartDiv) {
                        _this.chartDiv.style.msTouchAction = "none";
                        _this.chartDiv.style.touchAction = "none";
                    }
                } else {
                    if (!_this.mouseIsOver) {
                        _this.resetTouchStyle();
                    }
                }
            } else {
                _this.tapped = false;
                _this.resetTouchStyle();
            }

        },

        resetTouchStyle: function() {
            var _this = this;
            if (_this.panEventsEnabled && _this.chartDiv) {
                _this.chartDiv.style.msTouchAction = "auto";
                _this.chartDiv.style.touchAction = "auto";
            }
        },

        checkTouchDuration: function(ev) {
            var _this = this;
            var now = new Date().getTime();

            if (ev) {
                if (ev.touches) {
                    _this.isTouchEvent = true;
                } else {
                    if (!_this.isTouchEvent) {
                        return true;
                    }
                }
            }
            if (now - _this.touchStartTime > _this.touchClickDuration) {
                return true;
            } else {
                setTimeout(function() {
                    _this.resetTouchDuration();
                }, 300);
            }
        },

        resetTouchDuration: function() {
            this.isTouchEvent = false;
        },

        checkTouchMoved: function() {
            var _this = this;
            if (Math.abs(_this.mouseX - _this.tmx) > 4 || Math.abs(_this.mouseY - _this.tmy) > 4) {
                return true;
            }
        },

        addListeners: function() {
            var _this = this;
            var chartDiv = _this.chartDiv;

            if (document.addEventListener) {
                if ("ontouchstart" in document.documentElement) {
                    chartDiv.addEventListener("touchstart", function(event) {
                        _this.handleTouchStart.call(_this, event);
                    }, true);

                    chartDiv.addEventListener("touchmove", function(event) {
                        _this.handleMouseMove.call(_this, event);
                    }, true);

                    chartDiv.addEventListener("touchend", function(event) {
                        _this.handleTouchEnd.call(_this, event);
                    }, true);

                    _this.docfn1 = function(event) {
                        _this.handleDocTouchStart.call(_this, event);
                    };

                    _this.docfn2 = function(event) {
                        _this.handleDocTouchEnd.call(_this, event);
                    };

                    document.addEventListener("touchstart", _this.docfn1, true);
                    document.addEventListener("touchend", _this.docfn2, true);
                }

                chartDiv.addEventListener("mousedown", function(event) {
                    _this.mouseIsOver = true;
                    _this.handleMouseMove.call(_this, event);
                    _this.handleMouseDown.call(_this, event);
                    _this.handleDocTouchStart.call(_this, event);
                }, true);

                chartDiv.addEventListener("mouseover", function(event) {
                    _this.handleMouseOver.call(_this, event);
                }, true);

                chartDiv.addEventListener("mouseout", function(event) {
                    _this.handleMouseOut.call(_this, event);
                }, true);
                chartDiv.addEventListener("mouseup", function(event) {
                    _this.handleDocTouchEnd.call(_this, event);
                }, true);
            } else {
                chartDiv.attachEvent("onmousedown", function(event) {
                    _this.handleMouseDown.call(_this, event);
                });

                chartDiv.attachEvent("onmouseover", function(event) {
                    _this.handleMouseOver.call(_this, event);
                });

                chartDiv.attachEvent("onmouseout", function(event) {
                    _this.handleMouseOut.call(_this, event);
                });
            }
        },

        dispDUpd: function() {
            var _this = this;
            if (!_this.skipEvents) {
                var type;

                if (_this.dispatchDataUpdated) {
                    _this.dispatchDataUpdated = false;
                    type = "dataUpdated";
                    _this.fire({
                        type: type,
                        chart: _this
                    });
                }
                if (!_this.chartCreated) {
                    _this.chartCreated = true;
                    type = "init";
                    _this.fire({
                        type: type,
                        chart: _this
                    });
                }

                if (!_this.chartRendered) {
                    type = "rendered";
                    _this.fire({
                        type: type,
                        chart: _this
                    });
                    _this.chartRendered = true;
                }
                type = "drawn";
                _this.fire({
                    type: type,
                    chart: _this
                });
            }
            _this.skipEvents = false;
        },



        validateSize: function() {
            var _this = this;
            _this.premeasure();

            _this.checkDisplay();

            _this.cssScale = 1;
            _this.cssAngle = 0;

            _this.checkTransform(_this.div);

            if (_this.divRealWidth != _this.previousWidth || _this.divRealHeight != _this.previousHeight) {
                var legend = _this.legend;

                if (_this.realWidth > 0 && _this.realHeight > 0) {
                    _this.sizeChanged = true;
                    if (legend) {
                        if (_this.legendInitTO) {
                            clearTimeout(_this.legendInitTO);
                        }
                        var legendInitTO = setTimeout(function() {
                            legend.invalidateSize();
                        }, 10);
                        _this.timeOuts.push(legendInitTO);
                        _this.legendInitTO = legendInitTO;
                    }

                    //if (_this.type != "xy") {
                    _this.marginsUpdated = false;
                    //} else {
                    //    _this.marginsUpdated = true;
                    //} // this exception is removed in v 3.18.7, because otherwise axis do not measure space for labels in angular.

                    clearTimeout(_this.initTO);
                    var initTO = setTimeout(function() {
                        _this.initChart();
                    }, 10);
                    _this.timeOuts.push(initTO);
                    _this.initTO = initTO;
                }

                _this.renderFix();
                if (legend) {
                    if (legend.renderFix) {
                        legend.renderFix();
                    }
                }

                clearTimeout(_this.resizedTO);

                _this.resizedTO = setTimeout(function() {
                    var type = "resized";
                    _this.fire({
                        type: type,
                        chart: _this
                    });
                }, 10);


                _this.previousHeight = _this.divRealHeight;
                _this.previousWidth = _this.divRealWidth;
            }

        },

        invalidateSize: function() {
            var _this = this;
            _this.previousWidth = NaN;
            _this.previousHeight = NaN;
            _this.invalidateSizeReal();
        },

        invalidateSizeReal: function() {
            var _this = this;
            _this.marginsUpdated = false;
            clearTimeout(_this.validateTO);
            var validateTO = setTimeout(function() {
                _this.validateSize();
            }, 5);
            _this.timeOuts.push(validateTO);
            _this.validateTO = validateTO;
        },

        validateData: function(noReset) {
            var _this = this;
            if (_this.chartCreated) {
                _this.dataChanged = true;
                //if (_this.type != "xy") {
                _this.marginsUpdated = false;
                //} else {
                //_this.marginsUpdated = true; 3.14.5
                //}
                _this.initChart(noReset);
            }
        },

        validateNow: function(validateData, skipEvents) {
            var _this = this;

            if (_this.initTO) {
                clearTimeout(_this.initTO);
            }

            if (validateData) {
                _this.dataChanged = true;
                _this.marginsUpdated = false;
            }
            _this.skipEvents = skipEvents;
            //_this.listenersAdded = false;
            _this.chartRendered = false;
            var legend = _this.legend;
            if (legend) {
                if (legend.position != _this.prevLegendPosition) {
                    _this.mw = 0;
                    _this.previousWidth = 0;
                    if (legend.invalidateSize) {
                        legend.invalidateSize();
                        _this.validateSize();
                    }
                }
            }
            _this.write(_this.div);
        },

        showItem: function(dItem) {
            var _this = this;
            dItem.hidden = false;
            _this.initChart();
        },

        hideItem: function(dItem) {
            var _this = this;
            dItem.hidden = true;
            _this.initChart();
        },

        hideBalloon: function() {
            var _this = this;
            clearTimeout(_this.hoverInt);
            clearTimeout(_this.balloonTO);
            _this.hoverInt = setTimeout(function() {
                _this.hideBalloonReal.call(_this);
            }, _this.hideBalloonTime);
        },

        cleanChart: function() {
            // do not delete
        },

        hideBalloonReal: function() {
            var balloon = this.balloon;
            if (balloon) {
                if (balloon.hide) {
                    balloon.hide();
                }
            }
        },

        showBalloon: function(text, color, follow, x, y) {
            var _this = this;
            clearTimeout(_this.balloonTO);
            clearTimeout(_this.hoverInt);

            _this.balloonTO = setTimeout(function() {
                _this.showBalloonReal.call(_this, text, color, follow, x, y);
            }, 1);
        },

        showBalloonReal: function(text, color, follow, x, y) {
            var _this = this;
            _this.handleMouseMove();

            var balloon = _this.balloon;
            if (balloon.enabled) {

                balloon.followCursor(false);
                balloon.changeColor(color);

                if (!follow || balloon.fixedPosition) {
                    balloon.setPosition(x, y);
                    if (isNaN(x) || isNaN(y)) {
                        balloon.followCursor(true);
                    } else {
                        balloon.followCursor(false);
                    }
                } else {
                    balloon.followCursor(true);
                }
                if (text) {
                    balloon.showBalloon(text);
                }
            }
        },



        handleMouseOver: function() {
            var _this = this;
            if (_this.outTO) {
                clearTimeout(_this.outTO);
            }
            AmCharts.resetMouseOver();
            this.mouseIsOver = true;
        },

        handleMouseOut: function() {
            var _this = this;
            AmCharts.resetMouseOver();
            if (_this.outTO) {
                clearTimeout(_this.outTO);
            }
            _this.outTO = setTimeout(function() {
                _this.handleMouseOutReal();
            }, 10);
        },

        handleMouseOutReal: function() {
            this.mouseIsOver = false;
        },

        handleMouseMove: function(e) {
            var _this = this;

            if (!e) {
                e = window.event;
            }

            _this.mouse2X = NaN;
            _this.mouse2Y = NaN;

            var mouseX, mouseY, mouse2X, mouse2Y;

            if (e) {
                if (e.touches) {

                    var touch2 = e.touches.item(1);
                    if (touch2 && _this.panEventsEnabled && _this.boundingRect) {
                        mouse2X = touch2.clientX - _this.boundingRect.left;
                        mouse2Y = touch2.clientY - _this.boundingRect.top;
                    }

                    e = e.touches.item(0);

                    if (!e) {
                        return;
                    }
                } else {
                    _this.wasTouched = false;
                }

                if (_this.boundingRect) {
                    if (e.clientX) {
                        mouseX = e.clientX - _this.boundingRect.left;
                        mouseY = e.clientY - _this.boundingRect.top;
                    }
                }

                if (!isNaN(mouse2X)) {
                    _this.mouseX = Math.min(mouseX, mouse2X);
                    _this.mouse2X = Math.max(mouseX, mouse2X);
                } else {
                    _this.mouseX = mouseX;
                }
                if (!isNaN(mouse2Y)) {
                    _this.mouseY = Math.min(mouseY, mouse2Y);
                    _this.mouse2Y = Math.max(mouseY, mouse2Y);
                } else {
                    _this.mouseY = mouseY;
                }
                if(_this.autoTransform){
                    _this.mouseX = _this.mouseX / _this.cssScale;
                    _this.mouseY = _this.mouseY / _this.cssScale;
                }
            }
        },

        handleTouchStart: function(e) {
            var _this = this;
            _this.hideBalloonReal();
            if (e) {
                if ((e.touches && _this.tapToActivate && !_this.tapped) || !_this.panRequired) {
                    return;
                }
            }

            _this.handleMouseMove(e);
            _this.handleMouseDown(e);
        },

        handleTouchEnd: function(e) {
            var _this = this;
            _this.wasTouched = true;
            _this.handleMouseMove(e);
            AmCharts.resetMouseOver();
            this.handleReleaseOutside(e);
        },


        handleReleaseOutside: function() {
            var _this = this;
            _this.handleDocTouchEnd.call(_this);
        },

        handleMouseDown: function(e) {
            var _this = this;
            AmCharts.resetMouseOver();
            _this.mouseIsOver = true;

            if (e) {
                if (e.preventDefault) {
                    if (_this.panEventsEnabled) {
                        e.preventDefault();
                    } else {
                        if (!e.touches) {
                            e.preventDefault();
                        }
                    }
                }
            }
        },



        addLegend: function(legend, divId) {

            var _this = this;
            legend = AmCharts.processObject(legend, AmCharts.AmLegend, _this.theme);
            legend.divId = divId;
            legend.ieW = 0;

            var div;
            if (typeof(divId) != "object" && divId) {
                div = document.getElementById(divId);
            } else {
                div = divId;
            }

            _this.legend = legend;
            legend.chart = _this;
            if (div) {
                legend.div = div;
                legend.position = "outside";
                legend.autoMargins = false;
            } else {
                legend.div = _this.legendDiv;
            }

            return legend;
        },

        removeLegend: function() {
            var _this = this;
            _this.legend = undefined;
            _this.previousWidth = 0;
            _this.legendDiv.innerHTML = "";
        },

        handleResize: function() {
            var _this = this;

            if (AmCharts.isPercents(_this.width) || AmCharts.isPercents(_this.height)) {
                _this.invalidateSizeReal();
            }
            _this.renderFix();
        },

        renderFix: function() {
            if (!AmCharts.VML) {
                var container = this.container;
                if (container) {
                    container.renderFix();
                }
            }
        },

        getSVG: function() {
            if (AmCharts.hasSVG) {
                return this.container;
            }
        },

        animate: function(obj, attribute, from, to, time, effect, suffix) {
            var _this = this;

            if (obj["an_" + attribute]) {
                AmCharts.removeFromArray(_this.animations, obj["an_" + attribute]);
            }

            var animation = {
                obj: obj,
                frame: 0,
                attribute: attribute,
                from: from,
                to: to,
                time: time,
                effect: effect,
                suffix: suffix
            };
            obj["an_" + attribute] = animation;
            _this.animations.push(animation);

            return animation;
        },

        setLegendData: function(data) {
            var _this = this;
            var legend = _this.legend;
            if (legend) {
                legend.setData(data);
            }
        },

        stopAnim: function(animation) {
            var _this = this;
            AmCharts.removeFromArray(_this.animations, animation);
        },

        updateAnimations: function() {
            var _this = this;
            var i;

            if (_this.container) {
                _this.container.update();
            }

            if (_this.animations) {
                for (i = _this.animations.length - 1; i >= 0; i--) {
                    var animation = _this.animations[i];
                    var totalCount = AmCharts.updateRate * animation.time;
                    var frame = animation.frame + 1;
                    var obj = animation.obj;
                    var attribute = animation.attribute;

                    if (frame <= totalCount) {
                        var value;
                        animation.frame++;

                        var from = Number(animation.from);
                        var to = Number(animation.to);

                        var change = to - from;

                        value = AmCharts[animation.effect](0, frame, from, change, totalCount);

                        if (change === 0) {
                            _this.animations.splice(i, 1);
                            obj.node.style[attribute] = Number(animation.to) + animation.suffix;
                        } else {
                            obj.node.style[attribute] = value + animation.suffix;
                        }
                    } else {
                        obj.node.style[attribute] = Number(animation.to) + animation.suffix;
                        obj.animationFinished = true;
                        _this.animations.splice(i, 1);
                    }
                }
            }
        },

        update: function() {
            var _this = this;
            _this.updateAnimations();

            var animatable = _this.animatable;
            if (animatable.length > 0) {
                var finished = true;
                for (var i = animatable.length - 1; i >= 0; i--) {
                    var obj = animatable[i];
                    if (obj) {
                        if (obj.animationFinished) {
                            animatable.splice(i, 1);
                        } else {
                            finished = false;
                        }
                    }
                }

                if (finished) {
                    _this.fire({
                        type: "animationFinished",
                        chart: _this
                    });
                    _this.animatable = [];
                }
            }
        },

        inIframe: function() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        },

        brr: function() {
/*
            var _this = this;
            if (!_this.hideCredits) {
                var url = "amcharts.com";

                var host = window.location.hostname;
                var har = host.split(".");
                var mh;
                if (har.length >= 2) {
                    mh = har[har.length - 2] + "." + har[har.length - 1];
                }

                if (_this.amLink) {
                    var parent = _this.amLink.parentNode;
                    if (parent) {
                        parent.removeChild(_this.amLink);
                    }
                }
                var creditsPosition = _this.creditsPosition;
                var PX = "px";

                if (mh != url || _this.inIframe() === true) {

                    url = "http://www." + url;

                    var x0 = 0;
                    var y0 = 0;
                    var w = _this.realWidth;
                    var h = _this.realHeight;
                    var type = _this.type;
                    if (type == "serial" || type == "xy" || type == "gantt") {
                        x0 = _this.marginLeftReal;
                        y0 = _this.marginTopReal;
                        w = x0 + _this.plotAreaWidth;
                        h = y0 + _this.plotAreaHeight;
                    }

                    var link = url + "/javascript-charts/";
                    var title = "JavaScript charts";
                    var txt = "JS chart by amCharts";
                    if (_this.product == "ammap") {
                        link = url + "/javascript-maps/";
                        title = "Interactive JavaScript maps";
                        txt = "JS map by amCharts";
                    }

                    var a = document.createElement("a");
                    var aLabel = document.createTextNode(txt);
                    a.setAttribute("href", link);
                    a.setAttribute("title", title);
                    if (_this.urlTarget) {
                        a.setAttribute("target", _this.urlTarget);
                    }
                    a.appendChild(aLabel);
                    _this.chartDiv.appendChild(a);

                    _this.amLink = a;

                    var astyle = a.style;
                    astyle.position = "absolute";
                    astyle.textDecoration = "none";
                    astyle.color = _this.color;
                    astyle.fontFamily = _this.fontFamily;
                    astyle.fontSize = "11px";
                    astyle.opacity = 0.7;
                    astyle.display = "block";

                    var linkWidth = a.offsetWidth;
                    var linkHeight = a.offsetHeight;

                    var left = 5 + x0;
                    var top = y0 + 5;

                    if (creditsPosition == "bottom-left") {
                        left = 5 + x0;
                        top = h - linkHeight - 3;
                    }

                    if (creditsPosition == "bottom-right") {
                        left = w - linkWidth - 5;
                        top = h - linkHeight - 3;
                    }

                    if (creditsPosition == "top-right") {
                        left = w - linkWidth - 5;
                        top = y0 + 5;
                    }

                    astyle.left = left + PX;
                    astyle.top = top + PX;
                }
            }
*/
        }

    });

    // declaring only
    AmCharts.Slice = AmCharts.Class({
        construct: function() {}
    });
    AmCharts.SerialDataItem = AmCharts.Class({
        construct: function() {}
    });
    AmCharts.GraphDataItem = AmCharts.Class({
        construct: function() {}
    });
    AmCharts.Guide = AmCharts.Class({
        construct: function(theme) {
            var _this = this;
            _this.cname = "Guide";
            AmCharts.applyTheme(_this, theme, _this.cname);
        }
    });

    AmCharts.Title = AmCharts.Class({
        construct: function(theme) {
            var _this = this;
            _this.cname = "Title";
            AmCharts.applyTheme(_this, theme, _this.cname);
        }
    });

    AmCharts.Label = AmCharts.Class({
        construct: function(theme) {
            var _this = this;
            _this.cname = "Label";
            AmCharts.applyTheme(_this, theme, _this.cname);
        }
    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.AmGraph = AmCharts.Class({

        construct: function(theme) {
            var _this = this;
            _this.cname = "AmGraph";
            _this.createEvents("rollOverGraphItem", "rollOutGraphItem", "clickGraphItem", "doubleClickGraphItem", "rightClickGraphItem", "clickGraph", "rollOverGraph", "rollOutGraph");
            _this.type = "line";
            _this.stackable = true;
            _this.columnCount = 1;
            _this.columnIndex = 0;
            _this.showBalloon = true;
            _this.centerCustomBullets = true;
            _this.maxBulletSize = 50;
            _this.minBulletSize = 4;
            _this.balloonText = "[[value]]";
            _this.animationPlayed = false;
            _this.scrollbar = false;
            _this.hidden = false;
            //_this.columnWidth;
            _this.pointPosition = "middle";
            _this.depthCount = 1;
            _this.includeInMinMax = true;
            _this.negativeBase = 0;
            _this.visibleInLegend = true;
            _this.showAllValueLabels = false;
            _this.showBalloonAt = "close";
            _this.showBulletsAt = "close";
            _this.lineThickness = 1;
            _this.dashLength = 0;
            _this.connect = true;
            _this.lineAlpha = 1;
            _this.bullet = "none";
            _this.bulletBorderThickness = 2;
            _this.bulletBorderAlpha = 0;
            _this.bulletAlpha = 1;
            _this.bulletSize = 8;
            _this.bulletOffset = 0;
            _this.hideBulletsCount = 0;
            //_this.labelPosition = "top";
            _this.cornerRadiusTop = 0;
            _this.cursorBulletAlpha = 1;
            _this.gradientOrientation = "vertical";
            _this.dx = 0;
            _this.dy = 0;
            _this.periodValue = "";
            _this.clustered = true;
            _this.periodSpan = 1;
            _this.accessibleLabel = "[[title]] [[category]] [[value]]";
            _this.accessibleSkipText = "Press enter to skip [[title]]";
            //_this.balloonPosition = 0;
            //_this.useLineColorForBulletBorder = false;
            //_this.showHandOnHover;
            //_this.useNegativeColorIfDown
            //_this.proCandelstics
            //_this.topRadius = 1;
            _this.x = 0;
            _this.y = 0;
            _this.switchable = true;
            _this.minDistance = 1;
            _this.tcc = 1;
            //_this.legendPeriodValueText;

            // NEW
            _this.labelRotation = 0;
            _this.labelAnchor = "auto";
            _this.labelOffset = 3;

            _this.bcn = "graph-";

            _this.dateFormat = "MMM DD, YYYY";
            _this.noRounding = true;

            AmCharts.applyTheme(_this, theme, _this.cname);

        },

        init: function() {
            var _this = this;
            _this.createBalloon();
        },

        draw: function() {

            var _this = this;
            var chart = _this.chart;
            chart.isRolledOverBullet = false;

            var chartType = chart.type;
            if (chart.drawGraphs) {


                // handling backwards compatibility with numberformatter
                if (!isNaN(_this.precision)) {
                    if (!_this.numberFormatter) {
                        _this.numberFormatter = {
                            precision: _this.precision,
                            decimalSeparator: chart.decimalSeparator,
                            thousandsSeparator: chart.thousandsSeparator
                        };
                    } else {
                        _this.numberFormatter.precision = _this.precision;
                    }
                }

                var container = chart.container;
                _this.container = container;

                _this.destroy();

                var set = container.set();
                _this.set = set;
                set.translate(_this.x, _this.y);

                var bulletSet = container.set();
                _this.bulletSet = bulletSet;
                bulletSet.translate(_this.x, _this.y);

                if (_this.behindColumns) {
                    chart.graphsBehindSet.push(set);
                    chart.bulletBehindSet.push(bulletSet);
                } else {
                    chart.graphsSet.push(set);
                    chart.bulletSet.push(bulletSet);
                }

                var bulletAxis = _this.bulletAxis;
                if (AmCharts.isString(bulletAxis)) {
                    _this.bulletAxis = chart.getValueAxisById(bulletAxis);
                }

                var columnsSet = container.set();
                AmCharts.remove(_this.columnsSet);
                _this.columnsSet = columnsSet;

                AmCharts.setCN(chart, set, "graph-" + _this.type);
                AmCharts.setCN(chart, set, "graph-" + _this.id);

                AmCharts.setCN(chart, bulletSet, "graph-" + _this.type);
                AmCharts.setCN(chart, bulletSet, "graph-" + _this.id);

                _this.columnsArray = [];
                _this.ownColumns = [];
                _this.allBullets = [];
                _this.animationArray = [];

                var labelPosition = _this.labelPosition;
                if (!labelPosition) {
                    var stackType = _this.valueAxis.stackType;
                    labelPosition = "top";
                    if (_this.type == "column") {

                        if (chart.rotate) {
                            labelPosition = "right";
                        }

                        if (stackType == "100%" || stackType == "regular") {
                            labelPosition = "middle";
                        }
                    }
                    _this.labelPosition = labelPosition;
                }

                if (AmCharts.ifArray(_this.data)) {
                    var create = false;

                    if (chartType == "xy") {
                        if (_this.xAxis.axisCreated && _this.yAxis.axisCreated) {
                            create = true;
                        }
                    } else {
                        if (_this.valueAxis.axisCreated) {
                            create = true;
                        }
                    }
                    if (!_this.hidden && create) {
                        _this.createGraph();
                    }
                }

                set.push(columnsSet);
            }
        },


        createGraph: function() {
            var _this = this;
            var chart = _this.chart;
            var UNDEFINED;

            _this.startAlpha = chart.startAlpha;

            _this.seqAn = chart.sequencedAnimation;
            _this.baseCoord = _this.valueAxis.baseCoord;

            if (_this.fillAlphas === UNDEFINED) {
                _this.fillAlphas = 0;
            }

            _this.bulletColorR = _this.bulletColor;
            if (_this.bulletColorR === UNDEFINED) {
                _this.bulletColorR = _this.lineColorR;
                _this.bulletColorNegative = _this.negativeLineColor;
            }

            if (_this.bulletAlpha === UNDEFINED) {
                _this.bulletAlpha = _this.lineAlpha;
            }
            if (type == "step" || AmCharts.VML) {
                _this.noRounding = false;
            }

            /*
        if (!_this.bulletBorderColor) {
            _this.bulletBorderAlpha = 0;
        }
       */


            var type = chart.type;
            if (type == "gantt") {
                type = "serial";
            }

            clearTimeout(_this.playedTO);
            if (!isNaN(_this.valueAxis.min) && !isNaN(_this.valueAxis.max)) {
                switch (type) {
                    case "serial":
                        if (_this.categoryAxis) {
                            _this.createSerialGraph();

                            if (_this.type == "candlestick") {
                                var valueAxis = _this.valueAxis;
                                if (valueAxis.minMaxMultiplier < 1) {
                                    _this.positiveClip(_this.set);
                                }
                            }
                        }
                        break;
                    case "radar":
                        _this.createRadarGraph();
                        break;
                    case "xy":
                        _this.createXYGraph();
                        //_this.positiveClip(_this.set);  // this cause export probs, but graph is masked anyway.
                        break;
                }

                _this.playedTO = setTimeout(function() {
                    _this.setAnimationPlayed.call(_this);
                }, _this.chart.startDuration * 500);
            }
        },

        setAnimationPlayed: function() {
            this.animationPlayed = true;
        },

        createXYGraph: function() {
            var _this = this;
            var xx = [];
            var yy = [];

            var xAxis = _this.xAxis;
            var yAxis = _this.yAxis;

            _this.pmh = yAxis.height;
            _this.pmw = xAxis.width;
            _this.pmx = 0;
            _this.pmy = 0;
            var i;

            for (i = _this.start; i <= _this.end; i++) {
                var serialDataItem = _this.data[i];
                var graphDataItem = serialDataItem.axes[xAxis.id].graphs[_this.id];

                var values = graphDataItem.values;
                var xValue = values.x;
                var yValue = values.y;

                var xxx = xAxis.getCoordinate(xValue, _this.noRounding);
                var yyy = yAxis.getCoordinate(yValue, _this.noRounding);

                if (!isNaN(xValue) && !isNaN(yValue)) {
                    xx.push(xxx);
                    yy.push(yyy);

                    graphDataItem.x = xxx;
                    graphDataItem.y = yyy;

                    var bullet = _this.createBullet(graphDataItem, xxx, yyy, i);

                    // LABELS ////////////////////////////////////////////////////////
                    var labelText = _this.labelText;
                    if (labelText) {
                        var lText = _this.createLabel(graphDataItem, labelText);

                        var bulletSize = 0;
                        if (bullet) {
                            bulletSize = bullet.size;
                        }

                        _this.positionLabel(graphDataItem, xxx, yyy, lText, bulletSize);
                    }
                }
            }
            _this.drawLineGraph(xx, yy);
            _this.launchAnimation();
        },


        createRadarGraph: function() {
            var _this = this;
            var stackType = _this.valueAxis.stackType;
            var xx = [];
            var yy = [];
            var sxx = [];
            var syy = [];
            var firstX;
            var firstY;

            var firstSX;
            var firstSY;
            var i;

            for (i = _this.start; i <= _this.end; i++) {
                var serialDataItem = _this.data[i];
                var graphDataItem = serialDataItem.axes[_this.valueAxis.id].graphs[_this.id];

                var close;
                var open;

                if (stackType == "none" || stackType == "3d") {
                    close = graphDataItem.values.value;
                } else {
                    close = graphDataItem.values.close;
                    open = graphDataItem.values.open;
                }

                if (isNaN(close)) {
                    if (!_this.connect) {
                        _this.drawLineGraph(xx, yy, sxx, syy);
                        xx = [];
                        yy = [];
                        sxx = [];
                        syy = [];
                    }
                } else {
                    var coord = _this.valueAxis.getCoordinate(close, _this.noRounding) - _this.height;
                    coord *= _this.valueAxis.rMultiplier;

                    var angle = -360 / (_this.end - _this.start + 1) * i;

                    if (_this.valueAxis.pointPosition == "middle") {
                        angle -= 180 / (_this.end - _this.start + 1);
                    }

                    var xxx = (coord * Math.sin((angle) / (180) * Math.PI));
                    var yyy = (coord * Math.cos((angle) / (180) * Math.PI));

                    xx.push(xxx);
                    yy.push(yyy);

                    if (!isNaN(open)) {
                        var openCoord = _this.valueAxis.getCoordinate(open, _this.noRounding) - _this.height;
                        openCoord *= _this.valueAxis.rMultiplier;

                        var sxxx = (openCoord * Math.sin((angle) / (180) * Math.PI));
                        var syyy = (openCoord * Math.cos((angle) / (180) * Math.PI));

                        sxx.push(sxxx);
                        syy.push(syyy);

                        if (isNaN(firstSX)) {
                            firstSX = sxxx;
                        }
                        if (isNaN(firstSY)) {
                            firstSY = syyy;
                        }
                    }

                    var bullet = _this.createBullet(graphDataItem, xxx, yyy, i);

                    graphDataItem.x = xxx;
                    graphDataItem.y = yyy;

                    // LABELS ////////////////////////////////////////////////////////
                    var labelText = _this.labelText;
                    if (labelText) {
                        var lText = _this.createLabel(graphDataItem, labelText);

                        var bulletSize = 0;
                        if (bullet) {
                            bulletSize = bullet.size;
                        }

                        lText = _this.positionLabel(graphDataItem, xxx, yyy, lText, bulletSize);
                    }
                    if (isNaN(firstX)) {
                        firstX = xxx;
                    }
                    if (isNaN(firstY)) {
                        firstY = yyy;
                    }
                }
            }
            xx.push(firstX);
            yy.push(firstY);

            if (!isNaN(firstSX)) {
                sxx.push(firstSX);
                syy.push(firstSY);
            }

            _this.drawLineGraph(xx, yy, sxx, syy);
            _this.launchAnimation();
        },

        positionLabel: function(graphDataItem, x, y, lText, bulletSize) {
            var _this = this;
            if (lText) {

                var chart = _this.chart;
                var valueAxis = _this.valueAxis;

                var lA = "middle";
                var lC = false;
                var lP = _this.labelPosition;

                var lBB = lText.getBBox();

                var isRotated = _this.chart.rotate;
                var isNegative = graphDataItem.isNegative;

                // Grab from chart
                var fontSize = _this.fontSize;
                if (fontSize === undefined) {
                    fontSize = _this.chart.fontSize;
                }

                // Ultimate middle; canceling weird topper textbox offset
                //y -= (lBB.height / 4) / 2; // wrong with multiple lines
                y -= lBB.height / 2 - fontSize / 2 - 1; // 3.20.1

                if (graphDataItem.labelIsNegative !== undefined) {
                    isNegative = graphDataItem.labelIsNegative;
                }

                // Position switch
                switch (lP) {
                    case "right":
                        lP = isRotated ? (isNegative ? "left" : "right") : "right";
                        break;
                    case "top":
                        lP = isRotated ? "top" : (isNegative ? "bottom" : "top");
                        break;
                    case "bottom":
                        lP = isRotated ? "bottom" : (isNegative ? "top" : "bottom");
                        break;
                    case "left":
                        lP = isRotated ? (isNegative ? "right" : "left") : "left";
                        break;
                }

                var columnGraphics = graphDataItem.columnGraphics;
                var cgx = 0;
                var cgy = 0;

                if (columnGraphics) {
                    cgx = columnGraphics.x;
                    cgy = columnGraphics.y;
                }

                var labelOffset = _this.labelOffset;


                switch (lP) {
                    case "right":
                        lA = "start";
                        x += bulletSize / 2 + labelOffset;
                        break;
                    case "top":
                        if (valueAxis.reversed) {
                            y += bulletSize / 2 + lBB.height / 2 + labelOffset;
                        } else {
                            y -= bulletSize / 2 + lBB.height / 2 + labelOffset;
                        }
                        break;

                    case "bottom":
                        if (valueAxis.reversed) {
                            y -= bulletSize / 2 + lBB.height / 2 + labelOffset;
                        } else {
                            y += bulletSize / 2 + lBB.height / 2 + labelOffset;
                        }
                        break;
                    case "left":
                        lA = "end";
                        x -= bulletSize / 2 + labelOffset;
                        break;
                    case "inside":
                        if (_this.type == "column") {
                            lC = true;
                            if (isRotated) {
                                if (isNegative) {
                                    lA = "end";
                                    x = cgx - 3 - labelOffset;
                                } else {
                                    lA = "start";
                                    x = cgx + 3 + labelOffset;
                                }
                            } else {
                                if (isNegative) {
                                    y = cgy + 7 + labelOffset;
                                } else {
                                    y = cgy - 10 - labelOffset;
                                }
                            }
                        }
                        break;
                    case "middle":
                        if (_this.type == "column") {
                            lC = true;
                            if (isRotated) {
                                x -= (x - cgx) / 2 + labelOffset - 3;
                            } else {
                                y -= (y - cgy) / 2 + labelOffset - 3;
                            }
                        }
                        break;
                }

                //var lA;
                if (_this.labelAnchor != "auto") {
                    lA = _this.labelAnchor;
                }

                // Early adoption to update boundary box
                lText.attr({
                    "text-anchor": lA
                });
                if (_this.labelRotation) {
                    lText.rotate(_this.labelRotation);
                }
                lText.translate(x, y);


                // Check boundaries
                if (!_this.showAllValueLabels) {
                    if (columnGraphics && lC) {
                        lBB = lText.getBBox();
                        if (lBB.height > graphDataItem.columnHeight || lBB.width > graphDataItem.columnWidth) {
                            lText.remove();
                            lText = null;
                        }
                    }
                }

                // remove if out of bounds
                if (lText) {
                    if (chart.type != "radar") {
                        if (isRotated) {
                            if (y < 0 || y > _this.height) {
                                lText.remove();
                                lText = null;
                            }
                            if (!_this.showAllValueLabels) {
                                if (x < 0 || x > _this.width) {
                                    lText.remove();
                                    lText = null;
                                }
                            }
                        } else {
                            if (x < 0 || x > _this.width) {
                                lText.remove();
                                lText = null;
                            }
                            if (!_this.showAllValueLabels) {
                                if (y < 0 || y > _this.height) {
                                    lText.remove();
                                    lText = null;
                                }
                            }
                        }
                    }
                }
                if (lText) {
                    _this.allBullets.push(lText);
                }
                return lText;
            }
        },

        getGradRotation: function() {
            var _this = this;
            var gradientRotation = 270;
            if (_this.gradientOrientation == "horizontal") {
                gradientRotation = 0;
            }
            _this.gradientRotation = gradientRotation;
            return gradientRotation;
        },

        createSerialGraph: function() {

            var _this = this;
            var UNDEFINED;
            _this.lineColorSwitched = UNDEFINED;
            _this.fillColorsSwitched = UNDEFINED;
            _this.dashLengthSwitched = UNDEFINED;
            var chart = _this.chart;
            var id = _this.id;
            var index = _this.index;
            var data = _this.data;
            var container = _this.chart.container;
            var valueAxis = _this.valueAxis;
            var type = _this.type;
            var columnWidth = _this.columnWidthReal;
            var showBulletsAt = _this.showBulletsAt;

            if (!isNaN(_this.columnWidth)) {
                columnWidth = _this.columnWidth;
            }

            if (isNaN(columnWidth)) {
                columnWidth = 0.8; // this is mainly for scrollbar
            }
            var useNegativeColorIfDown = _this.useNegativeColorIfDown;
            var width = _this.width;
            var height = _this.height;

            var y = _this.y;
            var rotate = _this.rotate;
            var columnCount = _this.columnCount;
            var crt = AmCharts.toCoordinate(_this.cornerRadiusTop, columnWidth / 2);
            var connect = _this.connect;
            var xx = [];
            var yy = [];
            var previousxClose;
            var previousyClose;
            var previousxOpen;
            var previousyOpen;
            var totalGarphs = _this.chart.graphs.length;
            var depth;
            var dx = _this.dx / _this.tcc;
            var dy = _this.dy / _this.tcc;

            var stackType = valueAxis.stackType;
            var start = _this.start;
            var end = _this.end;
            var scrollbar = _this.scrollbar;

            var columnBCN = "graph-column-";
            if (scrollbar) {
                columnBCN = "scrollbar-graph-column-";
            }

            var categoryAxis = _this.categoryAxis;
            var baseCoord = _this.baseCoord;
            var negativeBase = _this.negativeBase;
            var columnIndex = _this.columnIndex;
            var lineThickness = _this.lineThickness;
            var lineAlpha = _this.lineAlpha;
            var lineColor = _this.lineColorR;
            var dashLength = _this.dashLength;
            var set = _this.set;
            var previousClose; // = -Infinity;

            // backward compatibility with old flash version
            /*
        if (labelPosition == "above") {
            labelPosition = "top";
        }
        if (labelPosition == "below") {
            labelPosition = "bottom";
        }*/

            var gradientRotation = _this.getGradRotation();

            var columnSpacing = _this.chart.columnSpacing;
            var cellWidth = categoryAxis.cellWidth;

            var maxSpacing = (cellWidth * columnWidth - columnCount) / columnCount;
            if (columnSpacing > maxSpacing) {
                columnSpacing = maxSpacing;
            }

            var serialDataItem;
            var graphDataItem;
            var value;

            // dimensions and position of positive mask
            var pmh = height;
            var pmw = width;
            var pmx = 0;
            var pmy = 0;
            // dimensions and position of negative mask
            var nmh;
            var nmw;
            var nmx;
            var nmy;

            var fillColors = _this.fillColorsR;
            var negativeFillColors = _this.negativeFillColors;
            var negativeLineColor = _this.negativeLineColor;
            var fillAlphas = _this.fillAlphas;
            var negativeFillAlphas = _this.negativeFillAlphas;

            // arrays of fillAlphas are not supported, but might be received, take first value only.
            if (typeof(fillAlphas) == "object") {
                fillAlphas = fillAlphas[0];
            }
            if (typeof(negativeFillAlphas) == "object") {
                negativeFillAlphas = negativeFillAlphas[0];
            }
            var noRounding = _this.noRounding;

            if (type == "step") {
                noRounding = false;
            }

            // get coordinate of minimum axis value
            var minCoord = valueAxis.getCoordinate(valueAxis.min);

            if (valueAxis.logarithmic) {
                minCoord = valueAxis.getCoordinate(valueAxis.minReal);
            }
            _this.minCoord = minCoord;

            // bullet could be set previously if only one data point was available
            if (_this.resetBullet) {
                _this.bullet = "none";
            }
            // if it"s line/smoothedLine/step graph, mask (clip rectangle will be applied on a line. Calculate mask dimensions here.
            if (!scrollbar && (type == "line" || type == "smoothedLine" || type == "step")) {
                // if it"s line/smoothedLine and there is one data point only, set bullet to round if not set any
                if (data.length == 1 && type != "step" && _this.bullet == "none") {
                    _this.bullet = "round";
                    _this.resetBullet = true;
                }
                // only need to do adjustments if negative colors are set
                if ((negativeFillColors || negativeLineColor != UNDEFINED) && !useNegativeColorIfDown) {
                    var zeroValue = negativeBase;
                    if (zeroValue > valueAxis.max) {
                        zeroValue = valueAxis.max;
                    }

                    if (zeroValue < valueAxis.min) {
                        zeroValue = valueAxis.min;
                    }

                    if (valueAxis.logarithmic) {
                        zeroValue = valueAxis.minReal;
                    }

                    var zeroCoord = valueAxis.getCoordinate(zeroValue);

                    var maxCoord = valueAxis.getCoordinate(valueAxis.max);

                    if (rotate) {
                        pmh = height;
                        pmw = Math.abs(maxCoord - zeroCoord);
                        nmh = height;
                        nmw = Math.abs(minCoord - zeroCoord);

                        pmy = 0;
                        nmy = 0;

                        if (valueAxis.reversed) {
                            pmx = 0;
                            nmx = zeroCoord;
                        } else {
                            pmx = zeroCoord;
                            nmx = 0;
                        }
                    } else {
                        pmw = width;
                        pmh = Math.abs(maxCoord - zeroCoord);
                        nmw = width;
                        nmh = Math.abs(minCoord - zeroCoord);

                        pmx = 0;
                        nmx = 0;

                        if (valueAxis.reversed) {
                            nmy = y;
                            pmy = zeroCoord;
                        } else {
                            nmy = zeroCoord;
                        }
                    }
                }
            }
            var round = Math.round;

            _this.pmx = round(pmx);
            _this.pmy = round(pmy);
            _this.pmh = round(pmh);
            _this.pmw = round(pmw);

            _this.nmx = round(nmx);
            _this.nmy = round(nmy);
            _this.nmh = round(nmh);
            _this.nmw = round(nmw);

            if (!AmCharts.isModern) {
                _this.nmx = 0;
                _this.nmy = 0;
                _this.nmh = _this.height;
            }

            // 3.10.2
            /*
            problem fix - if clustered is set to false, but we have another two clustered columns,
            the false column did not took full width
        */
            if (!_this.clustered) {
                columnCount = 1;
            }
            // end of fix

            // get column width
            if (type == "column") {
                columnWidth = (cellWidth * columnWidth - (columnSpacing * (columnCount - 1))) / columnCount;
            } else {
                columnWidth = cellWidth * columnWidth;
            }
            // set one pixel if actual width is less
            if (columnWidth < 1) {
                columnWidth = 1;
            }
            var fixedColumnWidth = _this.fixedColumnWidth;
            if (!isNaN(fixedColumnWidth)) {
                columnWidth = fixedColumnWidth;
            }
            // find first not missing value
            var i;
            if (type == "line" || type == "step" || type == "smoothedLine") {
                if (start > 0) {
                    for (i = start - 1; i > -1; i--) {
                        serialDataItem = data[i];
                        graphDataItem = serialDataItem.axes[valueAxis.id].graphs[id];
                        value = graphDataItem.values.value;

                        if (!isNaN(value)) {
                            start = i;
                            break;
                        }
                    }
                    // if lineColorField or other simmilar are set, we need to check if there are any set before
                    if (_this.lineColorField) {
                        for (i = start; i > -1; i--) {

                            serialDataItem = data[i];
                            graphDataItem = serialDataItem.axes[valueAxis.id].graphs[id];

                            if (graphDataItem.lineColor) {
                                _this.lineColorSwitched = graphDataItem.lineColor;
                                _this.bulletColorSwitched = _this.lineColorSwitched;
                                break;
                            }
                        }
                    }

                    if (_this.fillColorsField) {
                        for (i = start; i > -1; i--) {

                            serialDataItem = data[i];
                            graphDataItem = serialDataItem.axes[valueAxis.id].graphs[id];

                            if (graphDataItem.fillColors) {
                                _this.fillColorsSwitched = graphDataItem.fillColors;
                                break;
                            }
                        }
                    }

                    if (_this.dashLengthField) {
                        for (i = start; i > -1; i--) {

                            serialDataItem = data[i];
                            graphDataItem = serialDataItem.axes[valueAxis.id].graphs[id];

                            if (!isNaN(graphDataItem.dashLength)) {
                                _this.dashLengthSwitched = graphDataItem.dashLength;
                                break;
                            }
                        }
                    }

                }
                if (end < data.length - 1) {
                    for (i = end + 1; i < data.length; i++) {
                        serialDataItem = data[i];
                        graphDataItem = serialDataItem.axes[valueAxis.id].graphs[id];
                        value = graphDataItem.values.value;

                        if (!isNaN(value)) {
                            end = i;
                            break;
                        }
                    }
                }
            }
            // add one more
            if (end < data.length - 1) {
                end++;
            }

            var sxx = [];
            var syy = [];

            var stackableLine = false;
            if (type == "line" || type == "step" || type == "smoothedLine") {
                if (_this.stackable && stackType == "regular" || stackType == "100%" || _this.fillToGraph) {
                    stackableLine = true;
                }
            }

            var noStepRisers = _this.noStepRisers;

            var previousLX = -1000;
            var previousLY = -1000;
            var minDistance = _this.minDistance;


            var nowIsPositive = true;
            var changeColor = false;
            var prevColumnX = 0;
            var prevColumnY = 0;

            ///////////////////////////////////////////////////////////////////////////
            // now go through all data items and get coordinates or draw actual objects
            for (i = start; i <= end; i++) {
                serialDataItem = data[i];
                graphDataItem = serialDataItem.axes[valueAxis.id].graphs[id];
                graphDataItem.index = i;

                var nextDataItem;
                var nextClose = NaN;
                if (useNegativeColorIfDown && _this.openField == UNDEFINED) {
                    for (var n = i + 1; n < data.length; n++) {
                        if (data[n]) {
                            var nextSerialDataItem = data[i + 1];
                            nextDataItem = nextSerialDataItem.axes[valueAxis.id].graphs[id];

                            if (nextDataItem) {
                                if (nextDataItem.values) {
                                    nextClose = nextDataItem.values.value;

                                    if (!isNaN(nextClose)) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }

                var cx;
                var cy;
                var cw;
                var ch;
                var xxx = NaN;
                var xClose = NaN;
                var yClose = NaN;
                var xOpen = NaN;
                var yOpen = NaN;
                var xLow = NaN;
                var yLow = NaN;
                var xHigh = NaN;
                var yHigh = NaN;

                var labelX = NaN;
                var labelY = NaN;
                var bulletX = NaN;
                var bulletY = NaN;

                var close = NaN;
                var high = NaN;
                var low = NaN;
                var open = NaN;
                var cuboid = UNDEFINED;

                var fillColorsReal = fillColors;
                var fillAlphasReal = fillAlphas;
                var lineColorReal = lineColor;
                var borderColor;
                var cset;
                var proCandlesticks = _this.proCandlesticks;
                var topRadius = _this.topRadius;

                var rh = height - 1;
                var rw = width - 1;

                var pattern = _this.pattern;
                if (graphDataItem.pattern != UNDEFINED) {
                    pattern = graphDataItem.pattern;
                }

                if (!isNaN(graphDataItem.alpha)) {
                    fillAlphasReal = graphDataItem.alpha;
                }

                if (!isNaN(graphDataItem.dashLength)) {
                    dashLength = graphDataItem.dashLength;
                }

                var values = graphDataItem.values;
                if (valueAxis.recalculateToPercents) {
                    values = graphDataItem.percents;
                }

                if (stackType == "none") {
                    if (!isNaN(graphDataItem.columnIndex)) {
                        columnIndex = graphDataItem.columnIndex;
                    } else {
                        columnIndex = _this.columnIndex;
                    }
                }


                if (values) {
                    if (!_this.stackable || stackType == "none" || stackType == "3d") {
                        close = values.value;
                    } else {
                        close = values.close;
                    }

                    // in case candlestick
                    if (type == "candlestick" || type == "ohlc") {
                        close = values.close;
                        low = values.low;
                        yLow = valueAxis.getCoordinate(low);

                        high = values.high;
                        yHigh = valueAxis.getCoordinate(high);
                    }

                    open = values.open;
                    yClose = valueAxis.getCoordinate(close, noRounding);

                    if (!isNaN(open)) {
                        yOpen = valueAxis.getCoordinate(open, noRounding);

                        if (useNegativeColorIfDown && stackType != "regular" && stackType != "100%") {
                            nextClose = open;
                            yOpen = NaN;
                            open = NaN;
                        }
                    }

                    if (useNegativeColorIfDown) {
                        if (_this.openField == UNDEFINED) {
                            if (nextDataItem) {
                                if (nextClose < close) {
                                    nextDataItem.isNegative = true;
                                } else {
                                    nextDataItem.isNegative = false;
                                }
                                if (isNaN(nextClose)) {
                                    graphDataItem.isNegative = !nowIsPositive;
                                }
                            }
                        } else {
                            if (nextClose > close) {
                                graphDataItem.isNegative = true;
                            } else {
                                graphDataItem.isNegative = false;
                            }
                        }
                    }

                    // do not store y if this is scrollbar
                    if (!scrollbar) {
                        switch (_this.showBalloonAt) {
                            case "close":
                                graphDataItem.y = yClose;
                                break;
                            case "open":
                                graphDataItem.y = yOpen;
                                break;
                            case "high":
                                graphDataItem.y = yHigh;
                                break;
                            case "low":
                                graphDataItem.y = yLow;
                                break;
                        }
                    }

                    // x coordinate
                    xxx = serialDataItem.x[categoryAxis.id];

                    var periodSpan = _this.periodSpan - 1;

                    if (type == "step") {
                        if (!isNaN(serialDataItem.cellWidth)) {
                            cellWidth = serialDataItem.cellWidth;
                        }
                    }

                    var stepLineDelta1 = Math.floor(cellWidth / 2) + Math.floor(periodSpan * cellWidth / 2);
                    var stepLineDelta2 = stepLineDelta1;

                    var stepShift = 0;
                    if (_this.stepDirection == "left") {
                        stepShift = (cellWidth * 2 + periodSpan * cellWidth) / 2;
                        xxx -= stepShift;
                    }

                    if (_this.stepDirection == "center") {
                        stepShift = cellWidth / 2;
                        xxx -= stepShift;
                    }

                    if (_this.pointPosition == "start") {
                        xxx -= cellWidth / 2 + Math.floor(periodSpan * cellWidth / 2);
                        stepLineDelta1 = 0;
                        stepLineDelta2 = Math.floor(cellWidth) + Math.floor(periodSpan * cellWidth);
                    }

                    if (_this.pointPosition == "end") {
                        xxx += cellWidth / 2 + Math.floor(periodSpan * cellWidth / 2);
                        stepLineDelta1 = Math.floor(cellWidth) + Math.floor(periodSpan * cellWidth);
                        stepLineDelta2 = 0;
                    }

                    if (noStepRisers) {
                        var stepWidth = _this.columnWidth;

                        if (!isNaN(stepWidth)) {
                            stepLineDelta1 = stepWidth * stepLineDelta1;
                            stepLineDelta2 = stepWidth * stepLineDelta2;
                        }
                    }

                    if (!scrollbar) {
                        graphDataItem.x = xxx;
                    }

                    // fix to avoid wrong behavior when lines are too long
                    // theorethically this is not 100% correct approach, but visually there is no any diference.
                    var maxmax = 100000;

                    if (xxx < -maxmax) {
                        xxx = -maxmax;
                    }

                    if (xxx > width + maxmax) {
                        xxx = width + maxmax;
                    }

                    if (rotate) {
                        xClose = yClose;
                        xOpen = yOpen;
                        yClose = xxx;
                        yOpen = xxx;

                        if (isNaN(open) && !_this.fillToGraph) {
                            xOpen = baseCoord;
                        }

                        xLow = yLow;
                        xHigh = yHigh;
                    } else {
                        xClose = xxx;
                        xOpen = xxx;

                        if (isNaN(open) && !_this.fillToGraph) {
                            yOpen = baseCoord;
                        }
                    }

                    if ((!proCandlesticks && close < open) || (proCandlesticks && close < previousClose)) {
                        graphDataItem.isNegative = true;

                        if (negativeFillColors) {
                            fillColorsReal = negativeFillColors;
                        }

                        if (negativeFillAlphas) {
                            fillAlphasReal = negativeFillAlphas;
                        }

                        if (negativeLineColor != UNDEFINED) {
                            lineColorReal = negativeLineColor;
                        }
                    }

                    changeColor = false;

                    if (!isNaN(close)) {
                        if (useNegativeColorIfDown) {
                            if (close > nextClose) {
                                if (nowIsPositive) {
                                    changeColor = true;
                                }
                                nowIsPositive = false;
                            } else {
                                if (!nowIsPositive) {
                                    changeColor = true;
                                }
                                nowIsPositive = true;
                            }
                        } else {
                            if (close < negativeBase) {
                                graphDataItem.isNegative = true;
                            } else {
                                graphDataItem.isNegative = false;
                            }
                        }
                        previousClose = close;
                    }

                    var ignoreCustomColor = false;

                    if (scrollbar) {
                        var chartScrollbar = chart.chartScrollbar;
                        if (chartScrollbar.ignoreCustomColors) {
                            ignoreCustomColor = true;
                        }
                    }

                    if (!ignoreCustomColor) {
                        if (graphDataItem.color != UNDEFINED) {
                            fillColorsReal = graphDataItem.color;
                        }

                        if (graphDataItem.fillColors) {
                            fillColorsReal = graphDataItem.fillColors;
                        }
                    }

                    switch (type) {
                        // LINE
                        case "line":
                            if (!isNaN(close)) {
                                if (Math.abs(xClose - previousLX) >= minDistance || Math.abs(yClose - previousLY) >= minDistance) {
                                    xx.push(xClose);
                                    yy.push(yClose);

                                    previousLX = xClose;
                                    previousLY = yClose;
                                }

                                labelX = xClose;
                                labelY = yClose;
                                bulletX = xClose;
                                bulletY = yClose;

                                if (stackableLine) {
                                    if (!isNaN(yOpen) && !isNaN(xOpen)) {
                                        sxx.push(xOpen);
                                        syy.push(yOpen);
                                    }
                                }


                                if (changeColor || (graphDataItem.lineColor != UNDEFINED && graphDataItem.lineColor != _this.lineColorSwitched) || (graphDataItem.fillColors != UNDEFINED && graphDataItem.fillColors != _this.fillColorsSwitched) || !isNaN(graphDataItem.dashLength)) {
                                    _this.drawLineGraph(xx, yy, sxx, syy);
                                    xx = [xClose];
                                    yy = [yClose];

                                    sxx = [];
                                    syy = [];

                                    if (stackableLine) {
                                        if (!isNaN(yOpen) && !isNaN(xOpen)) {
                                            sxx.push(xOpen);
                                            syy.push(yOpen);
                                        }
                                    }

                                    if (useNegativeColorIfDown) {
                                        if (nowIsPositive) {
                                            _this.lineColorSwitched = lineColor;
                                            _this.fillColorsSwitched = fillColors;
                                        } else {
                                            _this.lineColorSwitched = negativeLineColor;
                                            _this.fillColorsSwitched = negativeFillColors;
                                        }
                                    } else {
                                        _this.lineColorSwitched = graphDataItem.lineColor;
                                        _this.fillColorsSwitched = graphDataItem.fillColors;
                                    }
                                    _this.dashLengthSwitched = graphDataItem.dashLength;
                                }

                                if (graphDataItem.gap) {
                                    _this.drawLineGraph(xx, yy, sxx, syy);
                                    xx = [];
                                    yy = [];

                                    sxx = [];
                                    syy = [];
                                }

                            } else if (!connect) {
                                _this.drawLineGraph(xx, yy, sxx, syy);
                                xx = [];
                                yy = [];

                                sxx = [];
                                syy = [];
                            }
                            break;

                        case "smoothedLine":
                            if (!isNaN(close)) {

                                if (Math.abs(xClose - previousLX) >= minDistance || Math.abs(yClose - previousLY) >= minDistance) {
                                    xx.push(xClose);
                                    yy.push(yClose);

                                    previousLX = xClose;
                                    previousLY = yClose;
                                }

                                labelX = xClose;
                                labelY = yClose;
                                bulletX = xClose;
                                bulletY = yClose;

                                if (stackableLine) {
                                    if (!isNaN(yOpen) && !isNaN(xOpen)) {
                                        sxx.push(xOpen);
                                        syy.push(yOpen);
                                    }
                                }
                                if (graphDataItem.lineColor != UNDEFINED || graphDataItem.fillColors != UNDEFINED || !isNaN(graphDataItem.dashLength)) {
                                    _this.drawSmoothedGraph(xx, yy, sxx, syy);
                                    xx = [xClose];
                                    yy = [yClose];

                                    sxx = [];
                                    syy = [];

                                    if (stackableLine) {
                                        if (!isNaN(yOpen) && !isNaN(xOpen)) {
                                            sxx.push(xOpen);
                                            syy.push(yOpen);
                                        }
                                    }

                                    _this.lineColorSwitched = graphDataItem.lineColor;
                                    _this.fillColorsSwitched = graphDataItem.fillColors;
                                    _this.dashLengthSwitched = graphDataItem.dashLength;
                                }
                                if (graphDataItem.gap) {
                                    _this.drawSmoothedGraph(xx, yy, sxx, syy);
                                    xx = [];
                                    yy = [];

                                    sxx = [];
                                    syy = [];
                                }

                            } else if (!connect) {
                                _this.drawSmoothedGraph(xx, yy, sxx, syy);
                                xx = [];
                                yy = [];

                                sxx = [];
                                syy = [];
                            }
                            break;

                            // STEP
                        case "step":
                            if (!isNaN(close)) {

                                if (rotate) {
                                    if (!isNaN(previousxClose)) {
                                        xx.push(previousxClose);
                                        yy.push(yClose - stepLineDelta1);
                                    }
                                    yy.push(yClose - stepLineDelta1);
                                    xx.push(xClose);
                                    yy.push(yClose + stepLineDelta2);
                                    xx.push(xClose);

                                    if (stackableLine) {
                                        if (!isNaN(yOpen) && !isNaN(xOpen)) {
                                            if (!isNaN(previousxOpen)) {
                                                sxx.push(previousxOpen);
                                                syy.push(yOpen - stepLineDelta1);
                                            }
                                            sxx.push(xOpen);
                                            syy.push(yOpen - stepLineDelta1);
                                            sxx.push(xOpen);
                                            syy.push(yOpen + stepLineDelta2);
                                        }
                                    }
                                } else {
                                    if (!isNaN(previousyClose)) {
                                        //yy.push(previousyClose); 3.14.5 not 100% sure. fixes dashed line problem.
                                        //xx.push(previousxClose);

                                        yy.push(previousyClose);
                                        xx.push(xClose - stepLineDelta1);
                                    }
                                    xx.push(xClose - stepLineDelta1);
                                    yy.push(yClose);
                                    xx.push(xClose + stepLineDelta2);
                                    yy.push(yClose);

                                    if (stackableLine) {
                                        if (!isNaN(yOpen) && !isNaN(xOpen)) {
                                            if (!isNaN(previousyOpen)) {
                                                sxx.push(xOpen - stepLineDelta1);
                                                syy.push(previousyOpen);
                                            }

                                            sxx.push(xOpen - stepLineDelta1);
                                            syy.push(yOpen);
                                            sxx.push(xOpen + stepLineDelta2);
                                            syy.push(yOpen);
                                        }
                                    }
                                }
                                previousxClose = xClose;
                                previousyClose = yClose;
                                previousxOpen = xOpen;
                                previousyOpen = yOpen;
                                labelX = xClose;
                                labelY = yClose;
                                bulletX = xClose;
                                bulletY = yClose;

                                if ((changeColor || graphDataItem.lineColor != UNDEFINED || graphDataItem.fillColors != UNDEFINED || !isNaN(graphDataItem.dashLength) && i < end)) {
                                    var lastX = xx[xx.length - 2];
                                    var lastY = yy[yy.length - 2];

                                    xx.pop();
                                    yy.pop();
                                    sxx.pop();
                                    syy.pop();

                                    _this.drawLineGraph(xx, yy, sxx, syy);

                                    xx = [lastX];
                                    yy = [lastY];

                                    if (rotate) {
                                        yy.push(yClose + stepLineDelta2);
                                        xx.push(xClose);
                                    } else {
                                        xx.push(xClose + stepLineDelta2); // 3.14.5 fixed problem with last data point's step
                                        yy.push(yClose); // 3.14.5
                                    }

                                    sxx = [lastX];
                                    syy = [previousyOpen];

                                    _this.lineColorSwitched = graphDataItem.lineColor;
                                    _this.fillColorsSwitched = graphDataItem.fillColors;
                                    _this.dashLengthSwitched = graphDataItem.dashLength;

                                    if (useNegativeColorIfDown) {
                                        if (nowIsPositive) {
                                            _this.lineColorSwitched = lineColor;
                                            _this.fillColorsSwitched = fillColors;
                                        } else {
                                            _this.lineColorSwitched = negativeLineColor;
                                            _this.fillColorsSwitched = negativeFillColors;
                                        }
                                    }

                                }

                                if (noStepRisers || graphDataItem.gap) {
                                    previousyClose = NaN;
                                    previousxClose = NaN;
                                    _this.drawLineGraph(xx, yy, sxx, syy);
                                    xx = [];
                                    yy = [];

                                    sxx = [];
                                    syy = [];
                                }

                            } else if (!connect) {
                                if (_this.periodSpan <= 1 || (_this.periodSpan > 1 && xClose - previousxClose > stepLineDelta1 + stepLineDelta2)) {
                                    previousyClose = NaN;
                                    previousxClose = NaN;
                                }
                                _this.drawLineGraph(xx, yy, sxx, syy);
                                xx = [];
                                yy = [];

                                sxx = [];
                                syy = [];
                            }
                            break;


                            // COLUMN
                        case "column":
                            borderColor = lineColorReal;
                            if (graphDataItem.lineColor != UNDEFINED) {
                                borderColor = graphDataItem.lineColor;
                            }
                            if (!isNaN(close)) {
                                if (useNegativeColorIfDown) {

                                } else {
                                    if (close < negativeBase) {
                                        graphDataItem.isNegative = true;
                                    } else {
                                        graphDataItem.isNegative = false;
                                    }
                                }

                                if (graphDataItem.isNegative) {
                                    if (negativeFillColors) {
                                        fillColorsReal = negativeFillColors;
                                    }

                                    if (negativeLineColor != UNDEFINED) {
                                        borderColor = negativeLineColor;
                                    }
                                }

                                var min = valueAxis.min;
                                var max = valueAxis.max;

                                var realOpen = open;
                                if (isNaN(realOpen)) {
                                    realOpen = negativeBase;
                                }

                                if ((close < min && realOpen < min) || (close > max && realOpen > max)) {
                                    // void
                                } else {
                                    var cIndex;
                                    if (rotate) {
                                        if (stackType == "3d") {
                                            cy = yClose - (columnCount / 2 - _this.depthCount + 1) * (columnWidth + columnSpacing) + columnSpacing / 2 + dy * columnIndex;
                                            cx = xOpen + dx * columnIndex;
                                            cIndex = columnIndex;
                                        } else {
                                            cy = Math.floor(yClose - (columnCount / 2 - columnIndex) * (columnWidth + columnSpacing) + columnSpacing / 2);
                                            cx = xOpen;
                                            cIndex = 0;
                                        }

                                        cw = columnWidth;

                                        labelX = xClose;
                                        labelY = cy + columnWidth / 2;

                                        /*
                                        if (!isNaN(xOpen)) {
                                            if (xOpen > xClose && !graphDataItem.isNegative) {
                                                labelX = xOpen;
                                            }
                                        }*/

                                        bulletX = xClose;
                                        bulletY = cy + columnWidth / 2;

                                        if (cy + cw > height + cIndex * dy) {
                                            cw = height - cy + cIndex * dy;
                                        }

                                        if (cy < cIndex * dy) {
                                            cw += cy;
                                            cy = cIndex * dy;
                                        }

                                        ch = xClose - xOpen;

                                        var cxr = cx;
                                        cx = AmCharts.fitToBounds(cx, 0, width);

                                        ch = ch + (cxr - cx);
                                        ch = AmCharts.fitToBounds(ch, -cx, width - cx + dx * columnIndex);

                                        if (ch < 0) {
                                            graphDataItem.labelIsNegative = true;
                                        } else {
                                            graphDataItem.labelIsNegative = false;
                                        }

                                        if (ch === 0) {
                                            if (1 / close === 1 / -0) {
                                                graphDataItem.labelIsNegative = true;
                                            }
                                        }

                                        if (!isNaN(serialDataItem.percentWidthValue)) {
                                            cw = _this.height * serialDataItem.percentWidthValue / 100;
                                            cy = xxx - cw / 2;
                                            prevColumnY += cw;
                                            labelY = cy + cw / 2;
                                        }

                                        cw = AmCharts.roundTo(cw, 2);
                                        ch = AmCharts.roundTo(ch, 2);

                                        if (cy < height && cw > 0) {
                                            cuboid = new AmCharts.Cuboid(container, ch, cw, dx - chart.d3x, dy - chart.d3y, fillColorsReal, fillAlphasReal, lineThickness, borderColor, lineAlpha, gradientRotation, crt, rotate, dashLength, pattern, topRadius, columnBCN);
                                            graphDataItem.columnWidth = Math.abs(ch);
                                            graphDataItem.columnHeight = Math.abs(cw);
                                        }
                                    } else {
                                        if (stackType == "3d") {
                                            cx = xClose - (columnCount / 2 - _this.depthCount + 1) * (columnWidth + columnSpacing) + columnSpacing / 2 + dx * columnIndex;
                                            cy = yOpen + dy * columnIndex;
                                            cIndex = columnIndex;
                                        } else {
                                            cx = xClose - (columnCount / 2 - columnIndex) * (columnWidth + columnSpacing) + columnSpacing / 2;
                                            cy = yOpen;
                                            cIndex = 0;
                                        }
                                        cw = columnWidth;

                                        labelX = cx + columnWidth / 2;
                                        labelY = yClose;

                                        /*
                                        if (!isNaN(yOpen)) {
                                            if (yOpen < yClose && (!graphDataItem.isNegative && !valueAxis.reversed)) {
                                                labelY = yOpen;
                                            }
                                        }*/

                                        bulletX = cx + columnWidth / 2;
                                        bulletY = yClose;

                                        if (cx + cw > width + cIndex * dx) {
                                            cw = width - cx + cIndex * dx;
                                        }

                                        if (cx < cIndex * dx) {
                                            cw += cx - cIndex * dx;
                                            cx = cIndex * dx;
                                        }

                                        ch = yClose - yOpen;

                                        if (ch > 0) {
                                            graphDataItem.labelIsNegative = true;
                                        } else {
                                            graphDataItem.labelIsNegative = false;
                                        }

                                        if (ch === 0) {
                                            if (1 / close !== 1 / Math.abs(close)) {
                                                graphDataItem.labelIsNegative = true;
                                            }
                                        }

                                        var cyr = cy;
                                        cy = AmCharts.fitToBounds(cy, _this.dy, height);
                                        ch = ch + (cyr - cy);



                                        ch = AmCharts.fitToBounds(ch, -cy + dy * cIndex, height - cy);

                                        if (!isNaN(serialDataItem.percentWidthValue)) {
                                            cw = _this.width * serialDataItem.percentWidthValue / 100;
                                            cx = xxx - cw / 2;
                                            prevColumnX += cw;
                                            labelX = cx + cw / 2;
                                        }
                                        cw = AmCharts.roundTo(cw, 2);
                                        ch = AmCharts.roundTo(ch, 2);

                                        if (cx < width + columnIndex * dx && cw > 0) {
                                            if (_this.showOnAxis) {
                                                cy -= dy / 2;
                                            }
                                            cuboid = new AmCharts.Cuboid(container, cw, ch, dx - chart.d3x, dy - chart.d3y, fillColorsReal, fillAlphasReal, lineThickness, borderColor, _this.lineAlpha, gradientRotation, crt, rotate, dashLength, pattern, topRadius, columnBCN);
                                            graphDataItem.columnHeight = Math.abs(ch);
                                            graphDataItem.columnWidth = Math.abs(cw);
                                        }
                                    }
                                }

                                if (cuboid) {
                                    cset = cuboid.set;

                                    //cuboid.setCN(chart, _this.bcn, _this.id, graphDataItem.className);
                                    AmCharts.setCN(chart, cuboid.set, "graph-" + _this.type);
                                    AmCharts.setCN(chart, cuboid.set, "graph-" + _this.id);


                                    if (graphDataItem.className) {
                                        AmCharts.setCN(chart, cuboid.set, graphDataItem.className, true);
                                    }

                                    graphDataItem.columnGraphics = cset;

                                    cx = AmCharts.roundTo(cx, 2);
                                    cy = AmCharts.roundTo(cy, 2);

                                    cset.translate(cx, cy);

                                    if (graphDataItem.url || _this.showHandOnHover) {
                                        cset.setAttr("cursor", "pointer");
                                    }

                                    // in case columns array is passed (it is not passed only for the scrollers chart, as it can"t be 3d
                                    // all columns are placed into array with predicted depth, then sorted by depth in Serial Chart and
                                    // added to columnsContainer which was created in AmSerialChart class
                                    if (!scrollbar) {
                                        if (stackType == "none") {
                                            if (rotate) {
                                                depth = (_this.end + 1 - i) * totalGarphs - index;
                                            } else {
                                                depth = totalGarphs * i + index;
                                            }
                                        }

                                        if (stackType == "3d") {
                                            if (rotate) {
                                                //depth = (totalGarphs - index) * (_this.end + 1 - i);
                                                depth = (_this.end + 1 - i) * totalGarphs - index - _this.depthCount * 1000;
                                                labelX += dx * columnIndex;
                                                bulletX += dx * columnIndex;

                                                graphDataItem.y += dx * columnIndex;

                                            } else {
                                                depth = (totalGarphs - index) * (i + 1) + _this.depthCount * 1000;
                                                labelY += dy * columnIndex;
                                                bulletY += dy * columnIndex;

                                                graphDataItem.y += dy * columnIndex;
                                            }

                                        }
                                        if (stackType == "regular" || stackType == "100%") {
                                            if (rotate) {
                                                if (values.value > 0) {
                                                    depth = (_this.end + 1 - i) * totalGarphs + index;
                                                } else {
                                                    depth = (_this.end + 1 - i) * totalGarphs - index;
                                                }
                                            } else {
                                                if (values.value > 0) {
                                                    depth = (totalGarphs * i) + index;
                                                } else {
                                                    depth = totalGarphs * i - index;
                                                }
                                            }
                                        }

                                        _this.columnsArray.push({
                                            column: cuboid,
                                            depth: depth
                                        });


                                        if (rotate) {
                                            graphDataItem.x = cy + cw / 2;
                                        } else {
                                            graphDataItem.x = cx + cw / 2;
                                        }
                                        _this.ownColumns.push(cuboid);
                                        _this.animateColumns(cuboid, i, xClose, xOpen, yClose, yOpen);
                                        _this.addListeners(cset, graphDataItem);

                                        if (_this.tabIndex !== undefined) {
                                            cset.setAttr("tabindex", _this.tabIndex);
                                        }
                                    }
                                    _this.columnsSet.push(cset);
                                    //graphDataItem.columnSprite = cset;
                                }
                            }
                            break;
                            // CANDLESTICK
                        case "candlestick":
                            if (!isNaN(open) && !isNaN(close)) {

                                var highLine;
                                var lowLine;

                                borderColor = lineColorReal;
                                if (graphDataItem.lineColor != UNDEFINED) {
                                    borderColor = graphDataItem.lineColor;
                                }

                                labelX = xClose;
                                labelY = yClose;
                                bulletY = yClose;
                                bulletX = xClose;

                                if (rotate) {
                                    if (showBulletsAt == "open") {
                                        bulletX = xOpen;
                                    }
                                    if (showBulletsAt == "high") {
                                        bulletX = xHigh;
                                    }
                                    if (showBulletsAt == "low") {
                                        bulletX = xLow;
                                    }

                                    xClose = AmCharts.fitToBounds(xClose, 0, rw);
                                    xOpen = AmCharts.fitToBounds(xOpen, 0, rw);
                                    xLow = AmCharts.fitToBounds(xLow, 0, rw);
                                    xHigh = AmCharts.fitToBounds(xHigh, 0, rw);

                                    if (xClose === 0 && xOpen === 0 && xLow === 0 && xHigh === 0) {
                                        continue;
                                    }

                                    if (xClose == rw && xOpen == rw && xLow == rw && xHigh == rw) {
                                        continue;
                                    }

                                    cy = yClose - columnWidth / 2;
                                    cx = xOpen;

                                    cw = columnWidth;
                                    if (cy + cw > height) {
                                        cw = height - cy;
                                    }

                                    if (cy < 0) {
                                        cw += cy;
                                        cy = 0;
                                    }

                                    if (cy < height && cw > 0) {
                                        var xArrayHigh;
                                        var xArrayLow;

                                        if (close > open) {
                                            xArrayHigh = [xClose, xHigh];
                                            xArrayLow = [xOpen, xLow];
                                        } else {
                                            xArrayHigh = [xOpen, xHigh];
                                            xArrayLow = [xClose, xLow];
                                        }
                                        if (!isNaN(xHigh) && !isNaN(xLow)) {
                                            if (yClose < height && yClose > 0) {
                                                highLine = AmCharts.line(container, xArrayHigh, [yClose, yClose], borderColor, lineAlpha, lineThickness);
                                                lowLine = AmCharts.line(container, xArrayLow, [yClose, yClose], borderColor, lineAlpha, lineThickness);
                                            }
                                        }
                                        ch = xClose - xOpen;

                                        cuboid = new AmCharts.Cuboid(container, ch, cw, dx, dy, fillColorsReal, fillAlphas, lineThickness, borderColor, lineAlpha, gradientRotation, crt, rotate, dashLength, pattern, topRadius, columnBCN);
                                    }
                                } else {
                                    if (showBulletsAt == "open") {
                                        bulletY = yOpen;
                                    }
                                    if (showBulletsAt == "high") {
                                        bulletY = yHigh;
                                    }
                                    if (showBulletsAt == "low") {
                                        bulletY = yLow;
                                    }

                                    yClose = AmCharts.fitToBounds(yClose, 0, rh);
                                    yOpen = AmCharts.fitToBounds(yOpen, 0, rh);
                                    yLow = AmCharts.fitToBounds(yLow, 0, rh);
                                    yHigh = AmCharts.fitToBounds(yHigh, 0, rh);

                                    if (yClose === 0 && yOpen === 0 && yLow === 0 && yHigh === 0) {
                                        continue;
                                    }

                                    if (yClose == rh && yOpen == rh && yLow == rh && yHigh == rh) {
                                        continue;
                                    }

                                    cx = xClose - columnWidth / 2;
                                    cy = yOpen + lineThickness / 2;

                                    cw = columnWidth;
                                    if (cx + cw > width) {
                                        cw = width - cx;
                                    }

                                    if (cx < 0) {
                                        cw += cx;
                                        cx = 0;
                                    }

                                    ch = yClose - yOpen;

                                    if (cx < width && cw > 0) {

                                        if (proCandlesticks) {
                                            if (close >= open) {
                                                fillAlphasReal = 0;
                                            }
                                        }

                                        cuboid = new AmCharts.Cuboid(container, cw, ch, dx, dy, fillColorsReal, fillAlphasReal, lineThickness, borderColor, lineAlpha, gradientRotation, crt, rotate, dashLength, pattern, topRadius, columnBCN);
                                        var yArrayHigh;
                                        var yArrayLow;


                                        if (close > open) {
                                            yArrayHigh = [yClose, yHigh];
                                            yArrayLow = [yOpen, yLow];
                                        } else {
                                            yArrayHigh = [yOpen, yHigh];
                                            yArrayLow = [yClose, yLow];
                                        }
                                        if (!isNaN(yHigh) && !isNaN(yLow)) {
                                            if (xClose < width && xClose > 0) {
                                                highLine = AmCharts.line(container, [xClose, xClose], yArrayHigh, borderColor, lineAlpha, lineThickness);
                                                lowLine = AmCharts.line(container, [xClose, xClose], yArrayLow, borderColor, lineAlpha, lineThickness);

                                                AmCharts.setCN(chart, highLine, _this.bcn + "line-high");
                                                if (graphDataItem.className) {
                                                    AmCharts.setCN(chart, highLine, graphDataItem.className, true);
                                                }

                                                AmCharts.setCN(chart, lowLine, _this.bcn + "line-low");
                                                if (graphDataItem.className) {
                                                    AmCharts.setCN(chart, lowLine, graphDataItem.className, true);
                                                }
                                            }
                                        }
                                    }
                                }
                                if (cuboid) {
                                    cset = cuboid.set;
                                    graphDataItem.columnGraphics = cset;
                                    set.push(cset);
                                    cset.translate(cx, cy - lineThickness / 2);

                                    if (graphDataItem.url || _this.showHandOnHover) {
                                        cset.setAttr("cursor", "pointer");
                                    }

                                    if (highLine) {
                                        set.push(highLine);
                                        set.push(lowLine);
                                    }

                                    if (!scrollbar) {
                                        if (rotate) {
                                            graphDataItem.x = cy + cw / 2;
                                        } else {
                                            graphDataItem.x = cx + cw / 2;
                                        }

                                        _this.animateColumns(cuboid, i, xClose, xOpen, yClose, yOpen);

                                        _this.addListeners(cset, graphDataItem);

                                        if (_this.tabIndex !== undefined) {
                                            cset.setAttr("tabindex", _this.tabIndex);
                                        }
                                    }
                                }
                            }
                            break;

                            // OHLC ////////////////////////
                        case "ohlc":
                            if (!isNaN(open) && !isNaN(high) && !isNaN(low) && !isNaN(close)) {
                                var itemSet = container.set();
                                set.push(itemSet);
                                if (close < open) {
                                    graphDataItem.isNegative = true;

                                    if (negativeLineColor != UNDEFINED) {
                                        lineColorReal = negativeLineColor;
                                    }
                                }

                                if (graphDataItem.lineColor != UNDEFINED) {
                                    lineColorReal = graphDataItem.lineColor;
                                }

                                var verticalLine;
                                var openLine;
                                var closeLine;
                                if (rotate) {
                                    bulletY = yClose;
                                    bulletX = xClose;
                                    if (showBulletsAt == "open") {
                                        bulletX = xOpen;
                                    }
                                    if (showBulletsAt == "high") {
                                        bulletX = xHigh;
                                    }
                                    if (showBulletsAt == "low") {
                                        bulletX = xLow;
                                    }

                                    xLow = AmCharts.fitToBounds(xLow, 0, rw);
                                    xHigh = AmCharts.fitToBounds(xHigh, 0, rw);

                                    if (xClose === 0 && xOpen === 0 && xLow === 0 && xHigh === 0) {
                                        continue;
                                    }

                                    if (xClose == rw && xOpen == rw && xLow == rw && xHigh == rw) {
                                        continue;
                                    }

                                    var y1 = yClose - columnWidth / 2;
                                    y1 = AmCharts.fitToBounds(y1, 0, height);
                                    var y2 = AmCharts.fitToBounds(yClose, 0, height);
                                    var y3 = yClose + columnWidth / 2;
                                    y3 = AmCharts.fitToBounds(y3, 0, height);
                                    if (xOpen >= 0 && xOpen <= rw) {
                                        openLine = AmCharts.line(container, [xOpen, xOpen], [y1, y2], lineColorReal, lineAlpha, lineThickness, dashLength);
                                    }
                                    if (yClose > 0 && yClose < height) {
                                        verticalLine = AmCharts.line(container, [xLow, xHigh], [yClose, yClose], lineColorReal, lineAlpha, lineThickness, dashLength);
                                    }
                                    if (xClose >= 0 && xClose <= rw) {
                                        closeLine = AmCharts.line(container, [xClose, xClose], [y2, y3], lineColorReal, lineAlpha, lineThickness, dashLength);
                                    }

                                } else {
                                    bulletY = yClose;
                                    if (showBulletsAt == "open") {
                                        bulletY = yOpen;
                                    }
                                    if (showBulletsAt == "high") {
                                        bulletY = yHigh;
                                    }
                                    if (showBulletsAt == "low") {
                                        bulletY = yLow;
                                    }
                                    bulletX = xClose;

                                    yLow = AmCharts.fitToBounds(yLow, 0, rh);
                                    yHigh = AmCharts.fitToBounds(yHigh, 0, rh);

                                    var x1 = xClose - columnWidth / 2;
                                    x1 = AmCharts.fitToBounds(x1, 0, width);
                                    var x2 = AmCharts.fitToBounds(xClose, 0, width);
                                    var x3 = xClose + columnWidth / 2;
                                    x3 = AmCharts.fitToBounds(x3, 0, width);
                                    if (yOpen >= 0 && yOpen <= rh) {
                                        openLine = AmCharts.line(container, [x1, x2], [yOpen, yOpen], lineColorReal, lineAlpha, lineThickness, dashLength);
                                    }
                                    if (xClose > 0 && xClose < width) {
                                        verticalLine = AmCharts.line(container, [xClose, xClose], [yLow, yHigh], lineColorReal, lineAlpha, lineThickness, dashLength);
                                    }
                                    if (yClose >= 0 && yClose <= rh) {
                                        closeLine = AmCharts.line(container, [x2, x3], [yClose, yClose], lineColorReal, lineAlpha, lineThickness, dashLength);
                                    }

                                }

                                set.push(openLine);
                                set.push(verticalLine);
                                set.push(closeLine);

                                AmCharts.setCN(chart, openLine, _this.bcn + "stroke-open");
                                AmCharts.setCN(chart, closeLine, _this.bcn + "stroke-close");
                                AmCharts.setCN(chart, verticalLine, _this.bcn + "stroke");
                                if (graphDataItem.className) {
                                    AmCharts.setCN(chart, itemSet, graphDataItem.className, true);
                                }

                                labelX = xClose;
                                labelY = yClose;
                            }
                            break;
                    }

                    // BULLETS AND LABELS
                    if (!scrollbar && !isNaN(close)) {
                        var hideBulletsCount = _this.hideBulletsCount;
                        if (_this.end - _this.start <= hideBulletsCount || hideBulletsCount === 0) {

                            var bullet = _this.createBullet(graphDataItem, bulletX, bulletY, i);

                            // LABELS ////////////////////////////////////////////////////////
                            var labelText = _this.labelText;

                            if (labelText && !isNaN(labelX) && !isNaN(labelX)) {
                                var lText = _this.createLabel(graphDataItem, labelText);
                                var bulletSize = 0;
                                if (bullet) {
                                    bulletSize = bullet.size;
                                }
                                _this.positionLabel(graphDataItem, labelX, labelY, lText, bulletSize);
                            }

                            // TOTALS
                            if (stackType == "regular" || stackType == "100%") {
                                var totalText = valueAxis.totalText;
                                if (totalText) {
                                    var tText = _this.createLabel(graphDataItem, totalText, valueAxis.totalTextColor);
                                    AmCharts.setCN(chart, tText, _this.bcn + "label-total");
                                    _this.allBullets.push(tText);

                                    if (tText) {
                                        var tbox = tText.getBBox();
                                        var tWidth = tbox.width;
                                        var tHeight = tbox.height;
                                        var tx;
                                        var ty;
                                        var totalTextOffset = valueAxis.totalTextOffset;

                                        var previousTotal = valueAxis.totals[i];
                                        if (previousTotal) {
                                            previousTotal.remove();
                                        }

                                        var lDelta = 0;
                                        if (type != "column") {
                                            lDelta = _this.bulletSize;
                                        }

                                        if (rotate) {
                                            ty = labelY;
                                            if (close < 0) {
                                                tx = xClose - tWidth / 2 - 2 - lDelta - totalTextOffset;
                                            } else {
                                                tx = xClose + tWidth / 2 + 3 + lDelta + totalTextOffset;
                                            }
                                        } else {
                                            tx = labelX;
                                            if (close < 0) {
                                                ty = yClose + tHeight / 2 + lDelta + totalTextOffset;
                                            } else {
                                                ty = yClose - tHeight / 2 - 3 - lDelta - totalTextOffset;
                                            }
                                        }
                                        tText.translate(tx, ty);
                                        valueAxis.totals[i] = tText;

                                        if (rotate) {
                                            if (ty < 0 || ty > height) {
                                                tText.remove();
                                            }
                                        } else {
                                            if (tx < 0 || tx > width) {
                                                tText.remove();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            _this.lastDataItem = graphDataItem;

            if (type == "line" || type == "step" || type == "smoothedLine") {
                if (type == "smoothedLine") {
                    _this.drawSmoothedGraph(xx, yy, sxx, syy);
                } else {
                    _this.drawLineGraph(xx, yy, sxx, syy);
                }
                if (!scrollbar) {
                    _this.launchAnimation();
                }
            }

            if (_this.bulletsHidden) {
                _this.hideBullets();
            }
            if (_this.customBulletsHidden) {
                _this.hideCustomBullets();
            }
        },

        animateColumns: function(cuboid, i) {
            var _this = this;

            var duration = _this.chart.startDuration;

            if (duration > 0 && !_this.animationPlayed) {
                if (_this.seqAn) {
                    cuboid.set.hide();
                    _this.animationArray.push(cuboid);
                    var timeout = setTimeout(function() {
                        _this.animate.call(_this);
                    }, duration / (_this.end - _this.start + 1) * (i - _this.start) * 1000);
                    _this.timeOuts.push(timeout);
                } else {
                    _this.animate(cuboid);
                }
                _this.chart.animatable.push(cuboid);
            }
        },

        createLabel: function(graphDataItem, labelText, textColor) {
            var _this = this;
            var chart = _this.chart;
            var numberFormatter = _this.numberFormatter;
            if (!numberFormatter) {
                numberFormatter = chart.nf;
            }

            var color = graphDataItem.labelColor;
            if (!color) {
                color = _this.color;
            }
            if (!color) {
                color = chart.color;
            }
            if (textColor) {
                color = textColor;
            }

            var fontSize = _this.fontSize;
            if (fontSize === undefined) {
                fontSize = chart.fontSize;
                _this.fontSize = fontSize;
            }

            var labelFunction = _this.labelFunction;

            var text = chart.formatString(labelText, graphDataItem);
            text = AmCharts.cleanFromEmpty(text);

            if (labelFunction) {
                text = labelFunction(graphDataItem, text);
            }
            if (text !== undefined && text !== "") {
                var lText = AmCharts.text(_this.container, text, color, chart.fontFamily, fontSize);
                lText.node.style.pointerEvents = "none";
                AmCharts.setCN(chart, lText, _this.bcn + "label");

                _this.bulletSet.push(lText);
                return lText;
            }
        },

        positiveClip: function(obj) {
            var _this = this;
            obj.clipRect(_this.pmx, _this.pmy, _this.pmw, _this.pmh);
        },

        negativeClip: function(obj) {
            var _this = this;
            obj.clipRect(_this.nmx, _this.nmy, _this.nmw, _this.nmh);
        },

        drawLineGraph: function(xx, yy, sxx, syy) {
            var _this = this;
            if (xx.length > 1) {
                var noRounding = _this.noRounding;
                var set = _this.set;
                var chart = _this.chart;
                var container = _this.container;

                var positiveSet = container.set();
                var negativeSet = container.set();

                set.push(negativeSet);
                set.push(positiveSet);


                var lineAlpha = _this.lineAlpha;
                var lineThickness = _this.lineThickness;

                var fillAlphas = _this.fillAlphas;
                var lineColor = _this.lineColorR;


                var negativeLineAlpha = _this.negativeLineAlpha;
                if (isNaN(negativeLineAlpha)) {
                    negativeLineAlpha = lineAlpha;
                }

                var lineColorSwitched = _this.lineColorSwitched;
                if (lineColorSwitched) {
                    lineColor = lineColorSwitched;
                }

                var fillColors = _this.fillColorsR;

                var fillColorsSwitched = _this.fillColorsSwitched;
                if (fillColorsSwitched) {
                    fillColors = fillColorsSwitched;
                }

                var dashLength = _this.dashLength;
                var dashLengthSwitched = _this.dashLengthSwitched;
                if (dashLengthSwitched) {
                    dashLength = dashLengthSwitched;
                }

                var negativeLineColor = _this.negativeLineColor;
                var negativeFillColors = _this.negativeFillColors;
                var negativeFillAlphas = _this.negativeFillAlphas;

                var baseCoord = _this.baseCoord;

                if (_this.negativeBase !== 0) {
                    baseCoord = _this.valueAxis.getCoordinate(_this.negativeBase, noRounding);
                    if (baseCoord > _this.height) {
                        baseCoord = _this.height;
                    }
                    if (baseCoord < 0) {
                        baseCoord = 0;
                    }
                }

                // draw lines
                var line = AmCharts.line(container, xx, yy, lineColor, lineAlpha, lineThickness, dashLength, false, true, noRounding);
                line.node.setAttribute("stroke-linejoin", "round");
                AmCharts.setCN(chart, line, _this.bcn + "stroke");

                positiveSet.push(line);

                positiveSet.click(function(ev) {
                    _this.handleGraphEvent(ev, "clickGraph");
                }).mouseover(function(ev) {
                    _this.handleGraphEvent(ev, "rollOverGraph");
                }).mouseout(function(ev) {
                    _this.handleGraphEvent(ev, "rollOutGraph");
                }).touchmove(function(ev) {
                    _this.chart.handleMouseMove(ev);
                }).touchend(function(ev) {
                    _this.chart.handleTouchEnd(ev);
                });


                if (negativeLineColor !== undefined && !_this.useNegativeColorIfDown) {
                    var negativeLine = AmCharts.line(container, xx, yy, negativeLineColor, negativeLineAlpha, lineThickness, dashLength, false, true, noRounding);
                    negativeLine.node.setAttribute("stroke-linejoin", "round");
                    AmCharts.setCN(chart, negativeLine, _this.bcn + "stroke");
                    AmCharts.setCN(chart, negativeLine, _this.bcn + "stroke-negative");
                    negativeSet.push(negativeLine);
                }

                if (fillAlphas > 0 || negativeFillAlphas > 0) {
                    var xxx = xx.join(";").split(";");
                    var yyy = yy.join(";").split(";");

                    var type = chart.type;
                    if (type == "serial" || type == "radar") {
                        if (sxx.length > 0) {
                            sxx.reverse();
                            syy.reverse();

                            xxx = xx.concat(sxx);
                            yyy = yy.concat(syy);
                        } else {
                            if (type == "radar") {
                                yyy.push(0);
                                xxx.push(0);
                            } else {
                                if (_this.rotate) {
                                    yyy.push(yyy[yyy.length - 1]);
                                    xxx.push(baseCoord);
                                    yyy.push(yyy[0]);
                                    xxx.push(baseCoord);
                                    yyy.push(yyy[0]);
                                    xxx.push(xxx[0]);
                                } else {
                                    xxx.push(xxx[xxx.length - 1]);
                                    yyy.push(baseCoord);
                                    xxx.push(xxx[0]);
                                    yyy.push(baseCoord);
                                    xxx.push(xx[0]);
                                    yyy.push(yyy[0]);
                                }
                            }
                        }
                    } else if (type == "xy") {
                        var fillToAxis = _this.fillToAxis;
                        if (fillToAxis) {
                            if (AmCharts.isString(fillToAxis)) {
                                fillToAxis = chart.getValueAxisById(fillToAxis);
                            }


                            if (fillToAxis.orientation == "H") {
                                if (fillToAxis.position == "top") {
                                    baseCoord = 0;
                                } else {
                                    baseCoord = fillToAxis.height;
                                }
                                xxx.push(xxx[xxx.length - 1]);
                                yyy.push(baseCoord);
                                xxx.push(xxx[0]);
                                yyy.push(baseCoord);
                                xxx.push(xx[0]);
                                yyy.push(yyy[0]);
                            } else {
                                if (fillToAxis.position == "left") {
                                    baseCoord = 0;
                                } else {
                                    baseCoord = fillToAxis.width;
                                }
                                yyy.push(yyy[yyy.length - 1]);
                                xxx.push(baseCoord);
                                yyy.push(yyy[0]);
                                xxx.push(baseCoord);
                                yyy.push(yyy[0]);
                                xxx.push(xxx[0]);
                            }
                        }
                    }
                    var gradientRotation = _this.gradientRotation;

                    if (fillAlphas > 0) {
                        var fill = AmCharts.polygon(container, xxx, yyy, fillColors, fillAlphas, 1, "#000", 0, gradientRotation, noRounding);
                        fill.pattern(_this.pattern, NaN, chart.path);

                        AmCharts.setCN(chart, fill, _this.bcn + "fill");

                        positiveSet.push(fill);
                    }

                    if (negativeFillColors || negativeLineColor !== undefined) {
                        if (isNaN(negativeFillAlphas)) {
                            negativeFillAlphas = fillAlphas;
                        }
                        if (!negativeFillColors) {
                            negativeFillColors = negativeLineColor;
                        }

                        var negativeFill = AmCharts.polygon(container, xxx, yyy, negativeFillColors, negativeFillAlphas, 1, "#000", 0, gradientRotation, noRounding);

                        AmCharts.setCN(chart, negativeFill, _this.bcn + "fill");
                        AmCharts.setCN(chart, negativeFill, _this.bcn + "fill-negative");

                        negativeFill.pattern(_this.pattern, NaN, chart.path);


                        negativeSet.push(negativeFill);

                        negativeSet.click(function(ev) {
                            _this.handleGraphEvent(ev, "clickGraph");
                        }).mouseover(function(ev) {
                            _this.handleGraphEvent(ev, "rollOverGraph");
                        }).mouseout(function(ev) {
                            _this.handleGraphEvent(ev, "rollOutGraph");
                        }).touchmove(function(ev) {
                            _this.chart.handleMouseMove(ev);
                        }).touchend(function(ev) {
                            _this.chart.handleTouchEnd(ev);
                        });
                    }
                }
                _this.applyMask(negativeSet, positiveSet);
            }
        },

        applyMask: function(negativeSet, positiveSet) {
            var _this = this;
            var length = negativeSet.length();
            if (_this.chart.type == "serial" && !_this.scrollbar) {
                _this.positiveClip(positiveSet);
                if (length > 0) {
                    _this.negativeClip(negativeSet);
                }
            }
        },


        drawSmoothedGraph: function(xx, yy, sxx, syy) {
            var _this = this;
            if (xx.length > 1) {
                var set = _this.set;
                var chart = _this.chart;
                var container = _this.container;

                var positiveSet = container.set();
                var negativeSet = container.set();

                set.push(negativeSet);
                set.push(positiveSet);

                var lineAlpha = _this.lineAlpha;
                var lineThickness = _this.lineThickness;
                var dashLength = _this.dashLength;
                var fillAlphas = _this.fillAlphas;
                var lineColor = _this.lineColorR;
                var fillColors = _this.fillColorsR;
                var negativeLineColor = _this.negativeLineColor;
                var negativeFillColors = _this.negativeFillColors;
                var negativeFillAlphas = _this.negativeFillAlphas;
                var baseCoord = _this.baseCoord;

                var lineColorSwitched = _this.lineColorSwitched;
                if (lineColorSwitched) {
                    lineColor = lineColorSwitched;
                }

                var fillColorsSwitched = _this.fillColorsSwitched;
                if (fillColorsSwitched) {
                    fillColors = fillColorsSwitched;
                }

                var negativeLineAlpha = _this.negativeLineAlpha;
                if (isNaN(negativeLineAlpha)) {
                    negativeLineAlpha = lineAlpha;
                }

                // draw lines
                var gradientRotation = _this.getGradRotation();

                var line = new AmCharts.Bezier(container, xx, yy, lineColor, lineAlpha, lineThickness, fillColors, 0, dashLength, undefined, gradientRotation);
                AmCharts.setCN(chart, line, _this.bcn + "stroke");
                positiveSet.push(line.path);

                if (negativeLineColor !== undefined) {
                    var negativeLine = new AmCharts.Bezier(container, xx, yy, negativeLineColor, negativeLineAlpha, lineThickness, fillColors, 0, dashLength, undefined, gradientRotation);
                    AmCharts.setCN(chart, negativeLine, _this.bcn + "stroke");
                    AmCharts.setCN(chart, negativeLine, _this.bcn + "stroke-negative");
                    negativeSet.push(negativeLine.path);
                }

                if (fillAlphas > 0) {
                    var xxx = xx.join(";").split(";");
                    var yyy = yy.join(";").split(";");

                    var endStr = "";
                    var comma = ",";

                    if (sxx.length > 0) {
                        sxx.push("M");
                        syy.push("M");
                        sxx.reverse();
                        syy.reverse();

                        xxx = xx.concat(sxx);
                        yyy = yy.concat(syy);
                    } else {

                        if (_this.rotate) {
                            endStr += " L" + baseCoord + comma + yy[yy.length - 1];
                            endStr += " L" + baseCoord + comma + yy[0];
                            endStr += " L" + xx[0] + comma + yy[0];
                        } else {
                            endStr += " L" + xx[xx.length - 1] + comma + baseCoord;
                            endStr += " L" + xx[0] + comma + baseCoord;
                            endStr += " L" + xx[0] + comma + yy[0];
                        }
                    }
                    var fill = new AmCharts.Bezier(container, xxx, yyy, NaN, 0, 0, fillColors, fillAlphas, dashLength, endStr, gradientRotation);
                    AmCharts.setCN(chart, fill, _this.bcn + "fill");
                    fill.path.pattern(_this.pattern, NaN, chart.path);
                    positiveSet.push(fill.path);

                    if (negativeFillColors || negativeLineColor !== undefined) {
                        if (!negativeFillAlphas) {
                            negativeFillAlphas = fillAlphas;
                        }
                        if (!negativeFillColors) {
                            negativeFillColors = negativeLineColor;
                        }

                        var negativeFill = new AmCharts.Bezier(container, xx, yy, NaN, 0, 0, negativeFillColors, negativeFillAlphas, dashLength, endStr, gradientRotation);
                        negativeFill.path.pattern(_this.pattern, NaN, chart.path);
                        AmCharts.setCN(chart, negativeFill, _this.bcn + "fill");
                        AmCharts.setCN(chart, negativeFill, _this.bcn + "fill-negative");
                        negativeSet.push(negativeFill.path);
                    }
                }
                _this.applyMask(negativeSet, positiveSet);
            }
        },


        launchAnimation: function() {
            var _this = this;
            var duration = _this.chart.startDuration;

            if (duration > 0 && !_this.animationPlayed) {

                var set = _this.set;
                var bulletSet = _this.bulletSet;

                if (!AmCharts.VML) {
                    set.attr({
                        "opacity": _this.startAlpha
                    });
                    bulletSet.attr({
                        "opacity": _this.startAlpha
                    });
                }

                set.hide();
                bulletSet.hide();

                if (_this.seqAn) {
                    var t = setTimeout(function() {
                        _this.animateGraphs.call(_this);
                    }, _this.index * duration * 1000);
                    _this.timeOuts.push(t);
                } else {
                    _this.animateGraphs();
                }
            }
        },

        animateGraphs: function() {
            var _this = this;
            var chart = _this.chart;
            var set = _this.set;
            var bulletSet = _this.bulletSet;
            var x = _this.x;
            var y = _this.y;

            set.show();
            bulletSet.show();

            var duration = chart.startDuration;
            var effect = chart.startEffect;

            if (set) {
                if (_this.rotate) {
                    set.translate(-1000, y);
                    bulletSet.translate(-1000, y);
                } else {
                    set.translate(x, -1000);
                    bulletSet.translate(x, -1000);
                }
                set.animate({
                    opacity: 1,
                    translate: x + "," + y
                }, duration, effect);
                bulletSet.animate({
                    opacity: 1,
                    translate: x + "," + y
                }, duration, effect);

                chart.animatable.push(set);
            }
        },

        animate: function(cuboid) {
            var _this = this;
            var chart = _this.chart;

            var animationArray = _this.animationArray;
            if (!cuboid && animationArray.length > 0) {
                cuboid = animationArray[0];
                animationArray.shift();
            }

            var effect = AmCharts[AmCharts.getEffect(chart.startEffect)];
            var duration = chart.startDuration;

            if (cuboid) {
                if (this.rotate) {
                    cuboid.animateWidth(duration, effect);
                } else {
                    cuboid.animateHeight(duration, effect);
                }
                var obj = cuboid.set;
                obj.show();
            }
        },

        legendKeyColor: function() {
            var _this = this;
            var color = _this.legendColor;
            var lineAlpha = _this.lineAlpha;

            if (color === undefined) {
                color = _this.lineColorR;

                if (lineAlpha === 0) {
                    var colorArray = _this.fillColorsR;
                    if (colorArray) {
                        if (typeof(colorArray) == "object") {
                            color = colorArray[0];
                        } else {
                            color = colorArray;
                        }
                    }
                }
            }
            return color;
        },

        legendKeyAlpha: function() {
            var _this = this;
            var alpha = _this.legendAlpha;
            if (alpha === undefined) {
                alpha = _this.lineAlpha;

                if (_this.fillAlphas > alpha) {
                    alpha = _this.fillAlphas;
                }

                if (alpha === 0) {
                    alpha = _this.bulletAlpha;
                }
                if (alpha === 0) {
                    alpha = 1;
                }
            }
            return alpha;
        },


        createBullet: function(graphDataItem, bulletX, bulletY) {
            var _this = this;
            if (!isNaN(bulletX) && !isNaN(bulletY)) {

                if (_this.bullet == "none" && !_this.customBullet && !graphDataItem.bullet && !graphDataItem.customBullet) {
                    return;
                }

                var chart = _this.chart;
                var container = _this.container;
                var bulletOffset = _this.bulletOffset;
                var bulletSize = _this.bulletSize;
                if (!isNaN(graphDataItem.bulletSize)) {
                    bulletSize = graphDataItem.bulletSize;
                }

                var value = graphDataItem.values.value;
                var maxValue = _this.maxValue;
                var minValue = _this.minValue;
                var maxBulletSize = _this.maxBulletSize;
                var minBulletSize = _this.minBulletSize;
                if (!isNaN(maxValue)) {
                    if (!isNaN(value)) {
                        //bulletSize = value / _this.maxValue * _this.maxBulletSize;
                        bulletSize = (value - minValue) / (maxValue - minValue) * (maxBulletSize - minBulletSize) + minBulletSize;
                    }
                    if (minValue == maxValue) {
                        bulletSize = maxBulletSize;
                    }
                }

                var originalSize = bulletSize;
                if (_this.bulletAxis) {
                    var error = graphDataItem.values.error;

                    if (!isNaN(error)) {
                        value = error;
                    }
                    bulletSize = _this.bulletAxis.stepWidth * value;
                }

                if (bulletSize < _this.minBulletSize) {
                    bulletSize = _this.minBulletSize;
                }

                if (_this.rotate) {
                    if (graphDataItem.isNegative) {
                        bulletX -= bulletOffset;
                    } else {
                        bulletX += bulletOffset;
                    }

                } else {
                    if (graphDataItem.isNegative) {
                        bulletY += bulletOffset;
                    } else {
                        bulletY -= bulletOffset;
                    }

                }

                var bulletColor = _this.bulletColorR;

                if (graphDataItem.lineColor) {
                    _this.bulletColorSwitched = graphDataItem.lineColor;
                }

                if (_this.bulletColorSwitched) {
                    bulletColor = _this.bulletColorSwitched;
                }

                if (graphDataItem.isNegative && _this.bulletColorNegative !== undefined) {
                    bulletColor = _this.bulletColorNegative;
                }

                if (graphDataItem.color !== undefined) {
                    bulletColor = graphDataItem.color;
                }

                var pattern;
                if (chart.type == "xy") {
                    if (_this.valueField) {
                        pattern = _this.pattern;
                        if (graphDataItem.pattern) {
                            pattern = graphDataItem.pattern;
                        }
                    }
                }

                var bulletType = _this.bullet;
                if (graphDataItem.bullet) {
                    bulletType = graphDataItem.bullet;
                }

                var bbt = _this.bulletBorderThickness;
                var bbc = _this.bulletBorderColorR;
                var bba = _this.bulletBorderAlpha;
                var bc = bulletColor;
                var ba = _this.bulletAlpha;

                if (!bbc) {
                    bbc = bc;
                }
                if (_this.useLineColorForBulletBorder) {
                    bbc = _this.lineColorR;
                    if (graphDataItem.isNegative) {
                        if (_this.negativeLineColor) {
                            bbc = _this.negativeLineColor;
                        }
                    }

                    if (_this.lineColorSwitched) {
                        bbc = _this.lineColorSwitched;
                    }
                }

                var customAlpha = graphDataItem.alpha;
                if (!isNaN(customAlpha)) {
                    ba = customAlpha;
                }

                var extremeLeft = -0.5;

                var bullet = AmCharts.bullet(container, bulletType, bulletSize, bc, ba, bbt, bbc, bba, originalSize, 0, pattern, chart.path);

                var customBullet = _this.customBullet;

                if (graphDataItem.customBullet) {
                    customBullet = graphDataItem.customBullet;
                }

                if (customBullet) {
                    if (bullet) {
                        bullet.remove();
                    }

                    if (typeof(customBullet) == "function") {
                        var CustomBullet = customBullet;
                        var customBulletClass = new CustomBullet();

                        customBulletClass.chart = chart;

                        if (graphDataItem.bulletConfig) {
                            customBulletClass.availableSpace = bulletY;
                            customBulletClass.graph = _this;
                            customBulletClass.graphDataItem = graphDataItem;
                            customBulletClass.bulletY = bulletY;
                            graphDataItem.bulletConfig.minCoord = _this.minCoord - bulletY;
                            customBulletClass.bulletConfig = graphDataItem.bulletConfig;
                        }
                        customBulletClass.write(container);
                        if (bullet && customBulletClass.showBullet) {
                            customBulletClass.set.push(bullet);
                        }
                        graphDataItem.customBulletGraphics = customBulletClass.cset;
                        bullet = customBulletClass.set;
                    } else {
                        bullet = container.set();
                        var bulletImage = container.image(customBullet, 0, 0, bulletSize, bulletSize);
                        bullet.push(bulletImage);

                        if (_this.centerCustomBullets) {
                            bulletImage.translate(-bulletSize / 2, -bulletSize / 2);
                        }
                    }
                }

                if (bullet) {
                    if (graphDataItem.url || _this.showHandOnHover) {
                        bullet.setAttr("cursor", "pointer");
                    }

                    if (chart.type == "serial" || chart.type == "gantt") {
                        if (bulletX < extremeLeft || bulletX > _this.width || bulletY < -bulletSize / 2 || bulletY > _this.height) {
                            bullet.remove();
                            bullet = null;
                        }
                    }


                    if (bullet) {
                        _this.bulletSet.push(bullet);
                        bullet.translate(bulletX, bulletY);
                        _this.addListeners(bullet, graphDataItem);
                        _this.allBullets.push(bullet);
                    }
                    graphDataItem.bx = bulletX;
                    graphDataItem.by = bulletY;

                    AmCharts.setCN(chart, bullet, _this.bcn + "bullet");
                    if (graphDataItem.className) {
                        AmCharts.setCN(chart, bullet, graphDataItem.className, true);
                    }
                }

                if (bullet) {
                    bullet.size = bulletSize || 0;

                    var bulletHitAreaSize = _this.bulletHitAreaSize;
                    if (_this.bulletHitAreaSize) {
                        var hitBullet = AmCharts.circle(container, bulletHitAreaSize, "#FFFFFF", 0.001, 0);
                        hitBullet.translate(bulletX, bulletY);
                        graphDataItem.hitBullet = hitBullet;
                        _this.bulletSet.push(hitBullet);
                        _this.addListeners(hitBullet, graphDataItem);
                    }

                    graphDataItem.bulletGraphics = bullet;
                    if (_this.tabIndex !== undefined) {
                        bullet.setAttr("tabindex", _this.tabIndex);
                    }
                } else {
                    bullet = {
                        size: 0
                    };
                }

                bullet.graphDataItem = graphDataItem;

                return bullet;
            }
        },

        showBullets: function() {
            var _this = this;
            var allBullets = _this.allBullets;
            var i;
            _this.bulletsHidden = false;
            for (i = 0; i < allBullets.length; i++) {
                allBullets[i].show();
            }
        },

        hideBullets: function() {
            var _this = this;
            var allBullets = _this.allBullets;
            var i;
            _this.bulletsHidden = true;
            for (i = 0; i < allBullets.length; i++) {
                allBullets[i].hide();
            }
        },

        showCustomBullets: function() {
            var _this = this;
            var allBullets = _this.allBullets;
            var i;
            _this.customBulletsHidden = false;
            for (i = 0; i < allBullets.length; i++) {
                var graphDataItem = allBullets[i].graphDataItem;
                if (graphDataItem.customBulletGraphics) {
                    graphDataItem.customBulletGraphics.show();
                }
            }
        },

        hideCustomBullets: function() {
            var _this = this;
            var allBullets = _this.allBullets;
            var i;
            _this.customBulletsHidden = true;
            for (i = 0; i < allBullets.length; i++) {
                var graphDataItem = allBullets[i].graphDataItem;
                if (graphDataItem.customBulletGraphics) {
                    graphDataItem.customBulletGraphics.hide();
                }
            }
        },


        addListeners: function(obj, dItem) {
            var _this = this;
            obj.mouseover(function(ev) {
                _this.handleRollOver(dItem, ev);
            }).mouseout(function(ev) {
                _this.handleRollOut(dItem, ev);
            }).touchend(function(ev) {
                _this.handleRollOver(dItem, ev);
                if (_this.chart.panEventsEnabled) {
                    _this.handleClick(dItem, ev);
                }
            }).touchstart(function(ev) {
                _this.handleRollOver(dItem, ev);
            }).click(function(ev) {
                _this.handleClick(dItem, ev);
            }).dblclick(function(ev) {
                _this.handleDoubleClick(dItem, ev);
            }).contextmenu(function(ev) {
                _this.handleRightClick(dItem, ev);
            });

            var chart = _this.chart;
            if (chart.accessible) {
                if (_this.accessibleLabel) {
                    var accessibleLabel = chart.formatString(_this.accessibleLabel, dItem);
                    chart.makeAccessible(obj, accessibleLabel);
                }
            }
        },

        handleRollOver: function(dItem, ev) {
            var _this = this;

            _this.handleGraphEvent(ev, "rollOverGraph");
            if (dItem) {
                var chart = _this.chart;
                if (dItem.bulletConfig) {
                    chart.isRolledOverBullet = true;
                }
                var type = "rollOverGraphItem";
                var event = {
                    type: type,
                    item: dItem,
                    index: dItem.index,
                    graph: _this,
                    target: _this,
                    chart: _this.chart,
                    event: ev
                };
                _this.fire(event);
                chart.fire(event);
                clearTimeout(chart.hoverInt);

                var chartCursor = chart.chartCursor;
                if (chartCursor) {
                    if (chartCursor.valueBalloonsEnabled) {
                        return;
                    }
                }
                _this.showGraphBalloon(dItem, "V", true);
            }
        },


        handleRollOut: function(dItem, ev) {
            var _this = this;
            var chart = _this.chart;
            if (dItem) {
                var type = "rollOutGraphItem";

                var event = {
                    type: type,
                    item: dItem,
                    index: dItem.index,
                    graph: this,
                    target: _this,
                    chart: _this.chart,
                    event: ev
                };
                _this.fire(event);
                chart.fire(event);
                chart.isRolledOverBullet = false;
            }

            _this.handleGraphEvent(ev, "rollOutGraph");

            var chartCursor = chart.chartCursor;
            if (chartCursor) {
                if (chartCursor.valueBalloonsEnabled) {
                    return;
                }
            }
            _this.hideBalloon();
        },

        handleClick: function(dItem, ev) {
            var _this = this;

            if (!_this.chart.checkTouchMoved() && _this.chart.checkTouchDuration(ev)) {

                if (dItem) {
                    var type = "clickGraphItem";
                    var event = {
                        type: type,
                        item: dItem,
                        index: dItem.index,
                        graph: _this,
                        target: _this,
                        chart: _this.chart,
                        event: ev
                    };
                    _this.fire(event);
                    _this.chart.fire(event);

                    AmCharts.getURL(dItem.url, _this.urlTarget);
                }

                _this.handleGraphEvent(ev, "clickGraph");
            }
        },

        handleGraphEvent: function(ev, type) {
            var _this = this;

            var event = {
                type: type,
                graph: _this,
                target: _this,
                chart: _this.chart,
                event: ev
            };
            _this.fire(event);
            _this.chart.fire(event);
        },

        handleRightClick: function(dItem, ev) {
            var _this = this;

            if (dItem) {
                var type = "rightClickGraphItem";
                var event = {
                    type: type,
                    item: dItem,
                    index: dItem.index,
                    graph: _this,
                    target: _this,
                    chart: _this.chart,
                    event: ev
                };
                _this.fire(event);
                _this.chart.fire(event);
            }
        },


        handleDoubleClick: function(dItem, ev) {
            var _this = this;

            if (dItem) {
                var type = "doubleClickGraphItem";
                var event = {
                    type: type,
                    item: dItem,
                    index: dItem.index,
                    graph: _this,
                    target: _this,
                    chart: _this.chart,
                    event: ev
                };
                _this.fire(event);
                _this.chart.fire(event);
            }
        },

        zoom: function(start, end) {
            var _this = this;
            _this.start = start;
            _this.end = end;
            _this.draw();
        },

        changeOpacity: function(a) {
            var _this = this;
            var set = _this.set;
            var OPACITY = "opacity";
            if (set) {
                set.setAttr(OPACITY, a);
            }
            var ownColumns = _this.ownColumns;
            if (ownColumns) {
                var i;
                for (i = 0; i < ownColumns.length; i++) {
                    var cset = ownColumns[i].set;
                    if (cset) {
                        cset.setAttr(OPACITY, a);
                    }
                }
            }
            var bulletSet = _this.bulletSet;
            if (bulletSet) {
                bulletSet.setAttr(OPACITY, a);
            }
        },

        destroy: function() {
            var _this = this;
            AmCharts.remove(_this.set);
            AmCharts.remove(_this.bulletSet);

            var timeOuts = _this.timeOuts;
            if (timeOuts) {
                var i;
                for (i = 0; i < timeOuts.length; i++) {
                    clearTimeout(timeOuts[i]);
                }
            }
            _this.timeOuts = [];
        },

        createBalloon: function() {
            var _this = this;
            var chart = _this.chart;

            if (!_this.balloon) {
                _this.balloon = {};
            } else {
                if (_this.balloon.destroy) {
                    _this.balloon.destroy();
                }
            }
            var balloon = _this.balloon;
            AmCharts.extend(balloon, chart.balloon, true);
            balloon.chart = chart;
            balloon.mainSet = chart.plotBalloonsSet;
            balloon.className = _this.id;
        },

        /// BALLOON
        hideBalloon: function() {
            var _this = this;
            var chart = _this.chart;

            if (!chart.chartCursor) {
                chart.hideBalloon();
            } else if (!chart.chartCursor.valueBalloonsEnabled) {
                chart.hideBalloon();
            }

            clearTimeout(_this.hoverInt);
            _this.hoverInt = setTimeout(function() {
                _this.hideBalloonReal.call(_this);
            }, chart.hideBalloonTime);
        },

        hideBalloonReal: function() {
            var _this = this;
            if (_this.balloon) {
                _this.balloon.hide();
            }

            _this.fixBulletSize();
        },

        fixBulletSize: function() {
            var _this = this;
            if (AmCharts.isModern) {
                var resizedItem = _this.resizedDItem;

                if (resizedItem) {
                    var bulletGraphics = resizedItem.bulletGraphics;
                    if (bulletGraphics) {
                        if (!bulletGraphics.doNotScale) { // restricts stock events from scaling and disappearing
                            bulletGraphics.translate(resizedItem.bx, resizedItem.by, 1);

                            var bulletAlpha = _this.bulletAlpha;
                            if (!isNaN(resizedItem.alpha)) {
                                bulletAlpha = resizedItem.alpha;
                            }

                            bulletGraphics.setAttr("fill-opacity", bulletAlpha);
                            bulletGraphics.setAttr("stroke-opacity", _this.bulletBorderAlpha);
                        }
                    }
                }
                _this.resizedDItem = null;
            }
        },

        // can not use showBalloon method, as it was always a property
        showGraphBalloon: function(dItem, pointerOrientation, follow, bulletSize, bulletAlpha) {
            if (dItem) {
                var _this = this;
                var chart = _this.chart;
                var balloon = _this.balloon;

                var dx = 0;
                var dy = 0;
                var chartCursor = chart.chartCursor;
                var setBounds = true;
                if (chartCursor) {
                    if (!chartCursor.valueBalloonsEnabled) {
                        balloon = chart.balloon;
                        dx = _this.x;
                        dy = _this.y;
                        setBounds = false;
                    }
                } else {
                    balloon = chart.balloon;
                    dx = _this.x;
                    dy = _this.y;
                    setBounds = false;
                }


                clearTimeout(_this.hoverInt);

                if (chart.chartCursor) {
                    _this.currentDataItem = dItem;

                    if (chart.type == "serial" && chart.isRolledOverBullet && chart.chartCursor.valueBalloonsEnabled) {
                        _this.hideBalloonReal();
                        return;
                    }
                }

                _this.resizeBullet(dItem, bulletSize, bulletAlpha);

                if (balloon) {
                    if (balloon.enabled && _this.showBalloon && !_this.hidden) {
                        var text = chart.formatString(_this.balloonText, dItem, true);

                        var balloonFunction = _this.balloonFunction;
                        if (balloonFunction) {
                            text = balloonFunction(dItem, dItem.graph);
                        }

                        if (text) {
                            text = AmCharts.cleanFromEmpty(text);
                        }

                        if (text && text !== "") {
                            var color = chart.getBalloonColor(_this, dItem);
                            //_this.balloon.showBullet = false;
                            if (!balloon.drop) {
                                balloon.pointerOrientation = pointerOrientation;
                            }

                            var bx = dItem.x;
                            var by = dItem.y;
                            if (chart.rotate) {
                                bx = dItem.y;
                                by = dItem.x;
                            }

                            bx += dx;
                            by += dy;

                            if (isNaN(bx) || isNaN(by)) {
                                _this.hideBalloonReal();
                                return;
                            }

                            var width = _this.width;
                            var height = _this.height;
                            if (setBounds) {
                                balloon.setBounds(dx, dy, width + dx, height + dy);
                            }

                            balloon.changeColor(color);
                            balloon.setPosition(bx, by);

                            balloon.fixPrevious();

                            if (balloon.fixedPosition) {
                                follow = false;
                            }

                            if (!follow) {
                                if (chart.type != "radar") {
                                    if (bx < dx || bx > width + dx || by < dy - 0.5 || by > height + dy) {
                                        balloon.showBalloon(text);
                                        balloon.hide(0);
                                        return;
                                    }
                                }
                            }

                            balloon.followCursor(follow);

                            balloon.showBalloon(text);
                        } else {
                            _this.hideBalloonReal();
                            balloon.hide();
                            _this.resizeBullet(dItem, bulletSize, bulletAlpha);
                        }
                        return;
                    }
                }
                _this.hideBalloonReal();
            }
        },

        resizeBullet: function(dItem, bulletSize, bulletAlpha) {
            var _this = this;
            // resize graphs bullet
            _this.fixBulletSize();
            if (dItem) {
                if (AmCharts.isModern) {
                    if ((bulletSize != 1 || !isNaN(bulletAlpha))) {
                        var bulletGraphics = dItem.bulletGraphics;
                        if (bulletGraphics) {
                            if (!bulletGraphics.doNotScale) { // restricts stock events from scaling and disappearing
                                bulletGraphics.translate(dItem.bx, dItem.by, bulletSize);

                                if (!isNaN(bulletAlpha)) {
                                    bulletGraphics.setAttr("fill-opacity", bulletAlpha);
                                    bulletGraphics.setAttr("stroke-opacity", bulletAlpha);
                                }

                                _this.resizedDItem = dItem;
                            }
                        }
                    }
                }
            }
        }



    });

})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.ChartCursor = AmCharts.Class({

        construct: function(theme) {
            var _this = this;
            _this.cname = "ChartCursor";
            _this.createEvents("changed", "zoomed", "onHideCursor", "onShowCursor", "draw", "selected", "moved", "panning", "zoomStarted");
            _this.enabled = true;
            _this.cursorAlpha = 1;
            _this.selectionAlpha = 0.2;
            _this.cursorColor = "#CC0000";
            _this.categoryBalloonAlpha = 1;
            _this.color = "#FFFFFF";
            _this.type = "cursor";
            _this.zoomed = false;
            _this.zoomable = true;
            _this.pan = false;
            _this.categoryBalloonDateFormat = "MMM DD, YYYY";
            _this.categoryBalloonText = "[[category]]";
            _this.valueBalloonsEnabled = true;
            _this.categoryBalloonEnabled = true;
            _this.rolledOver = false;
            _this.cursorPosition = "middle";
            _this.skipZoomDispatch = false;
            _this.bulletsEnabled = false;
            _this.bulletSize = 8;
            _this.oneBalloonOnly = false;
            _this.selectWithoutZooming = false;
            _this.graphBulletSize = 1.7;
            _this.animationDuration = 0.3;
            _this.zooming = false;
            _this.adjustment = 0;
            _this.avoidBalloonOverlapping = true;
            _this.leaveCursor = false;
            _this.leaveAfterTouch = true;
            _this.valueZoomable = false;
            //_this.graphBulletAlpha = 1;
            _this.balloonPointerOrientation = "horizontal";
            //_this.fullWidth;
            //_this.valueLine;
            //_this.valueLineBalloonEnabled;
            //_this.valueLineAlpha;

            // new properties
            _this.vLineEnabled = true;
            _this.hLineEnabled = true;

            _this.hZoomEnabled = false;
            _this.vZoomEnabled = false;

            AmCharts.applyTheme(_this, theme, _this.cname);
        },

        draw: function() {
            var _this = this;
            _this.destroy();
            var chart = _this.chart;
            chart.panRequired = true;
            var container = chart.container;
            _this.rotate = chart.rotate;
            _this.container = container;

            _this.prevLineWidth = NaN;
            _this.prevLineHeight = NaN;

            var set = container.set();
            set.translate(_this.x, _this.y);
            _this.set = set;

            chart.cursorSet.push(set);

            _this.createElements();

            if (AmCharts.isString(_this.limitToGraph)) {
                _this.limitToGraph = AmCharts.getObjById(chart.graphs, _this.limitToGraph);
                _this.fullWidth = false;
                _this.cursorPosition = "middle";
            }

            _this.pointer = _this.balloonPointerOrientation.substr(0, 1).toUpperCase();
            _this.isHidden = false;
            _this.hideLines();

            // backward compatibility only, doesn't do anything
            if (!_this.valueLineAxis) {
                _this.valueLineAxis = chart.valueAxes[0];
            }
        },

        createElements: function() {
            var _this = this;
            var chart = _this.chart;
            var dx = chart.dx;
            var dy = chart.dy;
            var width = _this.width;
            var height = _this.height;

            var vLineAlpha;
            var hLineAlpha;

            var cursorAlpha = _this.cursorAlpha;
            var valueLineAlpha = _this.valueLineAlpha;

            if (_this.rotate) {
                vLineAlpha = valueLineAlpha;
                hLineAlpha = cursorAlpha;
            } else {
                hLineAlpha = valueLineAlpha;
                vLineAlpha = cursorAlpha;
            }

            if (chart.type == "xy") {
                hLineAlpha = cursorAlpha;
                if (valueLineAlpha !== undefined) {
                    hLineAlpha = valueLineAlpha;
                }

                vLineAlpha = cursorAlpha;
            }

            _this.vvLine = AmCharts.line(_this.container, [dx, 0, 0], [dy, 0, height], _this.cursorColor, vLineAlpha, 1);
            AmCharts.setCN(chart, _this.vvLine, "cursor-line");
            AmCharts.setCN(chart, _this.vvLine, "cursor-line-vertical");

            _this.hhLine = AmCharts.line(_this.container, [0, width, width + dx], [0, 0, dy], _this.cursorColor, hLineAlpha, 1);
            AmCharts.setCN(chart, _this.hhLine, "cursor-line");
            AmCharts.setCN(chart, _this.hhLine, "cursor-line-horizontal");

            // backward compatibility
            if (_this.rotate) {
                _this.vLine = _this.vvLine;
            } else {
                _this.vLine = _this.hhLine;
            }

            _this.set.push(_this.vvLine);
            _this.set.push(_this.hhLine);

            _this.set.node.style.pointerEvents = "none";

            // full cell-width cursor lines should be clipped.
            _this.fullLines = _this.container.set();
            //_this.set.push(_this.fullLines);

            var cursorLineSet = chart.cursorLineSet;
            cursorLineSet.push(_this.fullLines);
            cursorLineSet.translate(_this.x, _this.y);
            cursorLineSet.clipRect(-1, -1, width + 2, height + 2);

            if (_this.tabIndex !== undefined) {
                cursorLineSet.setAttr("tabindex", _this.tabIndex);
                cursorLineSet.keyup(function(ev) {
                    _this.handleKeys(ev);
                }).focus(
                    function(ev) {
                        _this.showCursor();
                    }
                ).blur(
                    function(ev) {
                        _this.hideCursor();
                    }
                );
            }

            _this.set.clipRect(0, 0, width, height);
        },

        handleKeys: function(ev) {
            var _this = this;
            var index = _this.prevIndex;
            var chart = _this.chart;
            if (chart) {
                var data = chart.chartData;
                if (data) {
                    if (isNaN(index)) {
                        index = data.length - 1;
                    }

                    if (ev.keyCode == 37 || ev.keyCode == 40) {
                        index--;
                    }
                    if (ev.keyCode == 39 || ev.keyCode == 38) {
                        index++;
                    }

                    index = AmCharts.fitToBounds(index, chart.startIndex, chart.endIndex);

                    var serialDataItem = _this.chart.chartData[index];
                    if (serialDataItem) {
                        _this.setPosition(serialDataItem.x.categoryAxis);
                    }

                    _this.prevIndex = index;
                }
            }
        },

        update: function() {
            var _this = this;
            var chart = _this.chart;
            if (chart) {
                var mouseX = chart.mouseX - _this.x;
                var mouseY = chart.mouseY - _this.y;

                _this.mouseX = mouseX;
                _this.mouseY = mouseY;

                _this.mouse2X = chart.mouse2X - _this.x;
                _this.mouse2Y = chart.mouse2Y - _this.y;

                var show;
                if (chart.chartData) {
                    if (chart.chartData.length > 0) {
                        if (_this.mouseIsOver()) {
                            _this.hideGraphBalloons = false;
                            show = true;
                            _this.rolledOver = true;
                            _this.updateDrawing();
                            if (_this.vvLine) {
                                if (isNaN(_this.fx)) {
                                    if (!chart.rotate && _this.limitToGraph) {
                                        // void
                                    } else {
                                        _this.vvLine.translate(mouseX, 0);
                                    }
                                }
                            }
                            if (_this.hhLine) {
                                if (isNaN(_this.fy)) {
                                    if (chart.rotate && _this.limitToGraph) {
                                        // void
                                    } else {
                                        _this.hhLine.translate(0, mouseY);
                                    }
                                }
                            }

                            if (isNaN(_this.mouse2X)) {
                                _this.dispatchMovedEvent(mouseX, mouseY);
                            } else {
                                show = false;
                            }

                        } else {
                            if (!_this.forceShow) {
                                _this.hideCursor();
                            }
                        }

                        if (_this.zooming) {

                            if (!isNaN(_this.mouse2X)) {
                                if (!isNaN(_this.mouse2X0)) {
                                    _this.dispatchPanEvent();
                                }
                                return;
                            }

                            if (_this.pan) {
                                _this.dispatchPanEvent();
                                return;
                            } else if (_this.hZoomEnabled || _this.vZoomEnabled) {
                                if (_this.zooming) {
                                    _this.updateSelection();
                                }
                            }
                        }

                        if (show) {
                            _this.showCursor();
                        }
                    }
                }
            }
        },

        updateDrawing: function() {
            var _this = this;
            if (_this.drawing) {
                _this.chart.setMouseCursor("crosshair");
            }
            if (_this.drawingNow) {
                AmCharts.remove(_this.drawingLine);
                var chart = _this.chart;
                var marginTop = chart.marginTop;
                var marginLeft = chart.marginLeft;
                _this.drawingLine = AmCharts.line(_this.container, [_this.drawStartX + marginLeft, _this.mouseX + marginLeft], [_this.drawStartY + marginTop, _this.mouseY + marginTop], _this.cursorColor, 1, 1);
            }
        },

        fixWidth: function(width) {
            var _this = this;
            if (_this.fullWidth) {
                if (_this.prevLineWidth != width) {
                    var vvLine = _this.vvLine;
                    var x = 0;
                    if (vvLine) {
                        vvLine.remove();
                        x = vvLine.x;
                    }

                    vvLine = _this.container.set();
                    vvLine.translate(x, 0);
                    var rect = AmCharts.rect(_this.container, width, _this.height, _this.cursorColor, _this.cursorAlpha, _this.cursorAlpha, _this.cursorColor);
                    AmCharts.setCN(_this.chart, rect, "cursor-fill");
                    rect.translate(-width / 2 - 1, 0);

                    vvLine.push(rect);
                    _this.vvLine = vvLine;
                    _this.fullLines.push(vvLine);

                    _this.prevLineWidth = width;
                }
            }
        },

        fixHeight: function(height) {
            var _this = this;
            if (_this.fullWidth) {
                if (_this.prevLineHeight != height) {

                    var hhLine = _this.hhLine;
                    var y = 0;
                    if (hhLine) {
                        hhLine.remove();
                        y = hhLine.y;
                    }

                    hhLine = _this.container.set();
                    hhLine.translate(0, y);
                    var rect = AmCharts.rect(_this.container, _this.width, height, _this.cursorColor, _this.cursorAlpha);
                    rect.translate(0, -height / 2);
                    hhLine.push(rect);
                    _this.fullLines.push(hhLine);
                    _this.hhLine = hhLine;
                    _this.prevLineHeight = height;
                }
            }
        },

        fixVLine: function(x, y) {
            var _this = this;
            if (!isNaN(x)) {

                if (!isNaN(_this.prevLineX)) {
                    if (_this.prevLineX != x) {
                        _this.vvLine.translate(_this.prevLineX, _this.prevLineY);
                    }
                } else {
                    var yy = 0;
                    var xx = _this.mouseX;

                    if (_this.limitToGraph) {
                        var categoryAxis = _this.chart.categoryAxis;
                        if (categoryAxis) {
                            if (!this.chart.rotate) {
                                if (categoryAxis.position == "bottom") {
                                    yy = _this.height;
                                } else {
                                    yy = -_this.height;
                                }
                            }
                            xx = x;
                        }
                    }

                    _this.vvLine.translate(xx, yy);
                }

                _this.fx = x;

                if (_this.prevLineX != x) {
                    var animationDuration = _this.animationDuration;
                    // while selection, we do not animate to match line with selection
                    if (_this.zooming) {
                        animationDuration = 0;
                    }
                    _this.vvLine.stop();

                    _this.vvLine.animate({
                        "translate": x + "," + y
                    }, animationDuration, "easeOutSine");
                    _this.prevLineX = x;
                    _this.prevLineY = y;
                }
            }
        },

        fixHLine: function(y, x) {
            var _this = this;
            if (!isNaN(y)) {
                if (!isNaN(_this.prevLineY)) {
                    if (_this.prevLineY != y) {
                        _this.hhLine.translate(_this.prevLineX, _this.prevLineY);
                    }
                } else {
                    var xx = 0;
                    var yy = _this.mouseY;
                    if (_this.limitToGraph) {
                        var categoryAxis = _this.chart.categoryAxis;
                        if (categoryAxis) {
                            if (this.chart.rotate) {
                                if (categoryAxis.position == "right") {
                                    xx = _this.width;
                                } else {
                                    xx = -_this.width;
                                }
                            }
                            yy = y;
                        }
                    }

                    _this.hhLine.translate(xx, yy);
                }
                _this.fy = y;

                if (_this.prevLineY != y) {
                    var animationDuration = _this.animationDuration;
                    // while selection, we do not animate to match line with selection
                    if (_this.zooming) {
                        animationDuration = 0;
                    }
                    _this.hhLine.stop();
                    _this.hhLine.animate({
                        "translate": x + "," + y
                    }, animationDuration, "easeOutSine");
                    _this.prevLineY = y;
                    _this.prevLineX = x;
                }
            }
        },

        hideCursor: function(skipEvent) {
            var _this = this;
            _this.forceShow = false;

            if (_this.chart.wasTouched && _this.leaveAfterTouch) {
                return;
            }

            if (!_this.isHidden && !_this.leaveCursor) {
                _this.hideCursorReal();

                if (!skipEvent) {
                    _this.fire({
                        target: _this,
                        chart: _this.chart,
                        type: "onHideCursor"
                    });
                } else {
                    _this.chart.handleCursorHide();
                }

                _this.chart.setMouseCursor("auto");

            }
        },

        hideCursorReal: function() {
            var _this = this;
            _this.hideLines();
            _this.isHidden = true;
            _this.fx = NaN;
            _this.fy = NaN;
            _this.mouseX0 = NaN;
            _this.mouseY0 = NaN;
            _this.prevLineX = NaN;
            _this.prevLineY = NaN;
            _this.index = NaN;
        },

        hideLines: function() {
            var _this = this;
            if (_this.vvLine) {
                _this.vvLine.hide();
            }
            if (_this.hhLine) {
                _this.hhLine.hide();
            }
            if (_this.fullLines) {
                _this.fullLines.hide();
            }
            _this.isHidden = true;
            _this.chart.handleCursorHide();
        },

        showCursor: function(skipEvent) {
            var _this = this;

            if (_this.drawing || !_this.enabled) {
                return;
            }

            if (_this.vLineEnabled) {
                if (_this.vvLine) {
                    _this.vvLine.show();
                }
            }
            if (_this.hLineEnabled) {
                if (_this.hhLine) {
                    _this.hhLine.show();
                }
            }
            _this.isHidden = false;

            _this.updateFullLine();

            if (!skipEvent) {
                _this.fire({
                    target: _this,
                    chart: _this.chart,
                    type: "onShowCursor"
                });
            }

            if (_this.pan) {
                _this.chart.setMouseCursor("move");
            }
        },

        updateFullLine: function() {
            var _this = this;
            if (_this.zooming) {
                if (_this.fullWidth) {
                    if (_this.selection) {
                        if (_this.rotate) {
                            if (_this.selection.height > 0) {
                                _this.hhLine.hide();
                            }
                        } else {
                            if (_this.selection.width > 0) {
                                _this.vvLine.hide();
                            }
                        }
                    }
                }
            }
        },

        updateSelection: function() {

            var _this = this;
            if (!_this.pan && _this.enabled) {
                var x = _this.mouseX;
                var y = _this.mouseY;

                if (!isNaN(_this.fx)) {
                    x = _this.fx;
                }
                if (!isNaN(_this.fy)) {
                    y = _this.fy;
                }

                _this.clearSelection();

                var x0 = _this.mouseX0;
                var y0 = _this.mouseY0;

                var width = _this.width;
                var height = _this.height;

                x = AmCharts.fitToBounds(x, 0, width);
                y = AmCharts.fitToBounds(y, 0, height);

                var temp;

                if (x < x0) {
                    temp = x;
                    x = x0;
                    x0 = temp;
                }

                if (y < y0) {
                    temp = y;
                    y = y0;
                    y0 = temp;
                }

                if (_this.hZoomEnabled) {
                    width = x - x0;
                } else {
                    x0 = 0;
                }

                if (_this.vZoomEnabled) {
                    height = y - y0;
                } else {
                    y0 = 0;
                }

                if (isNaN(_this.mouse2X)) {
                    if (Math.abs(width) > 0 && Math.abs(height) > 0) {
                        var chart = _this.chart;
                        var selection = AmCharts.rect(_this.container, width, height, _this.cursorColor, _this.selectionAlpha);
                        AmCharts.setCN(chart, selection, "cursor-selection");
                        // store values for event
                        selection.width = width;
                        selection.height = height;

                        selection.translate(x0, y0);
                        _this.set.push(selection);
                        _this.selection = selection;
                    }
                }

                _this.updateFullLine();
            }
        },

        mouseIsOver: function() {
            var _this = this;
            var mouseX = _this.mouseX;
            var mouseY = _this.mouseY;

            if (_this.justReleased) {
                _this.justReleased = false;
                return true;
            }

            if (_this.mouseIsDown) {
                return true;
            }

            if (!_this.chart.mouseIsOver) {
                _this.handleMouseOut();
                return false;
            }

            if (mouseX > 0 && mouseX < _this.width && mouseY > 0 && mouseY < _this.height) {
                return true;
            } else {
                _this.handleMouseOut();
            }
        },

        fixPosition: function() {
            var _this = this;
            _this.prevX = NaN;
            _this.prevY = NaN;
        },

        handleMouseDown: function() {
            var _this = this;
            _this.update();
            if (_this.mouseIsOver()) {
                _this.mouseIsDown = true;
                _this.mouseX0 = _this.mouseX;
                _this.mouseY0 = _this.mouseY;

                _this.mouse2X0 = _this.mouse2X;
                _this.mouse2Y0 = _this.mouse2Y;

                if (_this.drawing) {
                    _this.drawStartY = _this.mouseY;
                    _this.drawStartX = _this.mouseX;
                    _this.drawingNow = true;
                    return;
                }

                _this.dispatchMovedEvent(_this.mouseX, _this.mouseY);

                if (!_this.pan && isNaN(_this.mouse2X0)) {
                    if (!isNaN(_this.fx)) {
                        _this.mouseX0 = _this.fx;
                    }
                    if (!isNaN(_this.fy)) {
                        _this.mouseY0 = _this.fy;
                    }
                }

                if (_this.hZoomEnabled || _this.vZoomEnabled) {
                    _this.zooming = true;

                    var e = {
                        chart: _this.chart,
                        target: _this,
                        type: "zoomStarted"
                    };
                    e.x = _this.mouseX / _this.width;
                    e.y = _this.mouseY / _this.height;

                    e.index = _this.index; // this will have value only with serial chart

                    _this.index0 = _this.index;
                    _this.timestamp0 = _this.timestamp;

                    _this.fire(e);
                }
            }
        },

        registerInitialMouse: function() {

        },

        handleReleaseOutside: function() {
            var _this = this;

            _this.mouseIsDown = false;

            if (_this.drawingNow) {
                _this.drawingNow = false;
                AmCharts.remove(_this.drawingLine);
                var drawStartX = _this.drawStartX;
                var drawStartY = _this.drawStartY;
                var mouseX = _this.mouseX;
                var mouseY = _this.mouseY;
                var chart = _this.chart;

                if (Math.abs(drawStartX - mouseX) > 2 || Math.abs(drawStartY - mouseY) > 2) {
                    var drawEvent = {
                        type: "draw",
                        target: _this,
                        chart: chart,
                        initialX: drawStartX,
                        initialY: drawStartY,
                        finalX: mouseX,
                        finalY: mouseY
                    };
                    _this.fire(drawEvent);
                }
            }


            if (_this.zooming) {
                _this.zooming = false;
                if (_this.selectWithoutZooming) {
                    _this.dispatchZoomEvent("selected");
                } else if (_this.hZoomEnabled || _this.vZoomEnabled) {
                    _this.dispatchZoomEvent("zoomed");
                }

                if (_this.rolledOver) {
                    _this.dispatchMovedEvent(_this.mouseX, _this.mouseY);
                }
            }


            _this.mouseX0 = NaN;
            _this.mouseY0 = NaN;
            _this.mouse2X0 = NaN;
            _this.mouse2Y0 = NaN;
        },

        dispatchZoomEvent: function(type) {
            var _this = this;
            if (!_this.pan) {
                var selection = _this.selection;
                if (selection) {

                    if (Math.abs(selection.width) > 3 && Math.abs(selection.height) > 3) {

                        var startIndex = Math.min(_this.index, _this.index0);
                        var endIndex = Math.max(_this.index, _this.index0);

                        var start = startIndex;
                        var end = endIndex;

                        var chart = _this.chart;
                        var chartData = chart.chartData;
                        var categoryAxis = chart.categoryAxis;
                        if (categoryAxis) {
                            if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
                                if (chartData[startIndex]) {
                                    start = chartData[startIndex].time;
                                } else {
                                    start = Math.min(_this.timestamp0, _this.timestamp);
                                }
                                if (chartData[endIndex]) {
                                    end = chart.getEndTime(chartData[endIndex].time);
                                } else {
                                    end = Math.max(_this.timestamp0, _this.timestamp);
                                }
                            }
                        }

                        var e = {
                            type: type,
                            chart: _this.chart,
                            target: _this,
                            end: end,
                            start: start,
                            startIndex: startIndex,
                            endIndex: endIndex,
                            // not actually used, for backwards compatibility only
                            selectionHeight: selection.height,
                            selectionWidth: selection.width,
                            selectionY: selection.y,
                            selectionX: selection.x
                        };
                        var fire;

                        if (_this.hZoomEnabled) {
                            if (Math.abs(_this.mouseX0 - _this.mouseX) > 4) {
                                e.startX = _this.mouseX0 / _this.width;
                                e.endX = _this.mouseX / _this.width;
                                fire = true;
                            }
                        }
                        if (_this.vZoomEnabled) {
                            if (Math.abs(_this.mouseY0 - _this.mouseY) > 4) {
                                e.startY = 1 - _this.mouseY0 / _this.height;
                                e.endY = 1 - _this.mouseY / _this.height;
                                fire = true;
                            }
                        }

                        if (fire) {
                            _this.prevX = NaN;
                            _this.prevY = NaN;
                            _this.fire(e);
                            if (type != "selected") {
                                _this.clearSelection();
                            }
                        }
                        _this.hideCursor();
                    }
                }
            }
        },

        dispatchMovedEvent: function(x, y, type, skipEvent) {
            var _this = this;
            x = Math.round(x);
            y = Math.round(y);

            if (!_this.isHidden) {
                if (x != _this.prevX || y != _this.prevY || type == "changed") {

                    if (!type) {
                        type = "moved";
                    }

                    var fx = _this.fx;
                    var fy = _this.fy;
                    if (isNaN(fx)) {
                        fx = x;
                    }
                    if (isNaN(fy)) {
                        fy = y;
                    }
                    var panning = false;

                    if (_this.zooming && _this.pan) {
                        panning = true;
                    }

                    var e = {
                        hidden: _this.isHidden,
                        type: type,
                        chart: _this.chart,
                        target: _this,
                        x: x,
                        y: y,
                        finalX: fx,
                        finalY: fy,
                        zooming: _this.zooming,
                        panning: panning,
                        mostCloseGraph: _this.mostCloseGraph,
                        index: _this.index,
                        skip: skipEvent,
                        hideBalloons: _this.hideGraphBalloons
                    };
                    _this.prevIndex = _this.index;
                    if (_this.rotate) {
                        e.position = y;
                        e.finalPosition = fy;
                    } else {
                        e.position = x;
                        e.finalPosition = fx;
                    }

                    _this.prevX = x;
                    _this.prevY = y;
                    if (!skipEvent) {
                        _this.fire(e);
                        if (type == "changed") {
                            _this.chart.fire(e);
                        }
                    } else {
                        // not oop style, but we still need this to triger balloons
                        _this.chart.handleCursorMove(e);
                    }
                }
            }
        },
        dispatchPanEvent: function() {
            var _this = this;

            if (_this.mouseIsDown) {

                var deltaX = AmCharts.roundTo((_this.mouseX - _this.mouseX0) / _this.width, 3);
                var deltaY = AmCharts.roundTo((_this.mouseY - _this.mouseY0) / _this.height, 3);

                var delta2X = AmCharts.roundTo((_this.mouse2X - _this.mouse2X0) / _this.width, 3);
                var delta2Y = AmCharts.roundTo((_this.mouse2Y - _this.mouse2Y0) / _this.height, 2);

                var dispatch = false;
                if (Math.abs(deltaX) !== 0 && Math.abs(deltaY) !== 0) {
                    dispatch = true;
                }
                if (_this.prevDeltaX == deltaX || _this.prevDeltaY == deltaY) {
                    dispatch = false;
                }

                if (!isNaN(delta2X) && !isNaN(delta2Y)) {
                    if (Math.abs(delta2X) !== 0 && Math.abs(delta2Y) !== 0) {
                        dispatch = true;
                    }
                    if (_this.prevDelta2X == delta2X || _this.prevDelta2Y == delta2Y) {
                        dispatch = false;
                    }
                }

                if (dispatch) {
                    _this.hideLines();
                    var e = {
                        type: "panning",
                        chart: _this.chart,
                        target: _this,
                        deltaX: deltaX,
                        deltaY: deltaY,
                        delta2X: delta2X,
                        delta2Y: delta2Y,
                        index: _this.index
                    };

                    _this.fire(e);

                    _this.prevDeltaX = deltaX;
                    _this.prevDeltaY = deltaY;
                    _this.prevDelta2X = delta2X;
                    _this.prevDelta2Y = delta2Y;
                }
            }
        },

        clearSelection: function() {
            var _this = this;
            var selection = _this.selection;
            if (selection) {
                selection.width = 0;
                selection.height = 0;
                selection.remove();
            }
        },

        destroy: function() {
            var _this = this;
            _this.clear();

            AmCharts.remove(_this.selection);
            _this.selection = null;

            clearTimeout(_this.syncTO);

            AmCharts.remove(_this.set);
        },

        clear: function() {

        },

        setTimestamp: function(time) {
            this.timestamp = time;
        },

        setIndex: function(index, skipEvent) {
            var _this = this;
            if (index != _this.index) {
                _this.index = index;
                if (!skipEvent && !_this.isHidden) {
                    _this.dispatchMovedEvent(_this.mouseX, _this.mouseY, "changed");
                }
            }
        },

        handleMouseOut: function() {
            var _this = this;
            if (_this.enabled && _this.rolledOver) {
                if (!_this.leaveCursor) {
                    _this.setIndex(undefined);
                }
                _this.forceShow = false;
                _this.hideCursor();
                _this.rolledOver = false;
            }
        },

        showCursorAt: function(category) {
            var _this = this;
            var chart = _this.chart;
            var categoryAxis = chart.categoryAxis;

            if (categoryAxis) {
                _this.setPosition(categoryAxis.categoryToCoordinate(category), category);
            }
        },

        setPosition: function(coordinate, category) {
            var _this = this;
            var chart = _this.chart;
            var categoryAxis = chart.categoryAxis;

            if (categoryAxis) {
                var yCoordinate;
                var xCoordinate;
                if(category === undefined){
                    category = categoryAxis.coordinateToValue(coordinate);
                }

                categoryAxis.showBalloonAt(category, coordinate);
                
                _this.forceShow = true;
                if (categoryAxis.stickBalloonToCategory) {
                    if (chart.rotate) {
                        _this.fixHLine(coordinate, 0);
                    } else {
                        _this.fixVLine(coordinate, 0);
                    }
                } else {
                    _this.showCursor();
                    if (chart.rotate) {
                        _this.hhLine.translate(0, coordinate);
                    } else {
                        _this.vvLine.translate(coordinate, 0);
                    }
                }

                if (chart.rotate) {
                    yCoordinate = coordinate;                    
                } else {
                    xCoordinate = coordinate;
                }
                //_this.dispatchMovedEvent(xCoordinate, yCoordinate);

                if (chart.rotate) {
                    if (_this.vvLine) {
                        _this.vvLine.hide();
                    }
                    if (_this.hhLine) {
                        _this.hhLine.show();
                    }
                } else {
                    if (_this.hhLine) {
                        _this.hhLine.hide();
                    }
                    if (_this.vvLine) {
                        _this.vvLine.show();
                    }
                }
                _this.updateFullLine();
                _this.isHidden = false;

                _this.dispatchMovedEvent(xCoordinate, yCoordinate, "moved", true);
            }
        },

        enableDrawing: function(value) {
            var _this = this;
            _this.enabled = !value;
            _this.hideCursor();
            _this.drawing = value;
        },


        syncWithCursor: function(cursor, hideBalloon) {
            var _this = this;
            clearTimeout(_this.syncTO);
            if (cursor) {
                if (cursor.isHidden) {
                    _this.hideCursor(true);
                    return;
                }

                _this.syncWithCursorReal(cursor, hideBalloon);
            }
        },

        isZooming: function(zooming) {
            this.zooming = zooming;
        },


        syncWithCursorReal: function(cursor, hideBalloon) {
            var _this = this;
            var vvLine = cursor.vvLine;
            var hhLine = cursor.hhLine;
            _this.index = cursor.index;

            _this.forceShow = true;
            if (_this.zooming && _this.pan) {
                // void
            } else {
                _this.showCursor(true);
            }

            _this.hideGraphBalloons = hideBalloon;

            _this.justReleased = cursor.justReleased;
            _this.zooming = cursor.zooming;
            _this.index0 = cursor.index0;
            _this.mouseX0 = cursor.mouseX0;
            _this.mouseY0 = cursor.mouseY0;
            _this.mouse2X0 = cursor.mouse2X0;
            _this.mouse2Y0 = cursor.mouse2Y0;
            _this.timestamp0 = cursor.timestamp0;
            _this.prevDeltaX = cursor.prevDeltaX;
            _this.prevDeltaY = cursor.prevDeltaY;
            _this.prevDelta2X = cursor.prevDelta2X;
            _this.prevDelta2Y = cursor.prevDelta2Y;
            _this.fx = cursor.fx;
            _this.fy = cursor.fy;

            if (cursor.zooming) {
                _this.updateSelection();
            }

            var x = cursor.mouseX;
            var y = cursor.mouseY;

            if (_this.rotate) {
                x = NaN;
                if (_this.vvLine) {
                    _this.vvLine.hide();
                }
                if (_this.hhLine && hhLine) {
                    if (!isNaN(cursor.fy)) {
                        _this.fixHLine(cursor.fy, 0);
                    } else {
                        _this.hhLine.translate(0, cursor.mouseY);
                    }
                }
            } else {
                y = NaN;
                if (_this.hhLine) {
                    _this.hhLine.hide();
                }
                if (_this.vvLine && vvLine) {
                    if (!isNaN(cursor.fx)) {
                        _this.fixVLine(cursor.fx, 0);
                    } else {
                        _this.vvLine.translate(cursor.mouseX, 0);
                    }
                }
            }

            _this.dispatchMovedEvent(x, y, "moved", true);
        }



    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.SimpleChartScrollbar = AmCharts.Class({

        construct: function(theme) {
            var _this = this;

            _this.createEvents("zoomed", "zoomStarted", "zoomEnded");
            _this.backgroundColor = "#D4D4D4";
            _this.backgroundAlpha = 1;
            _this.selectedBackgroundColor = "#EFEFEF";
            _this.selectedBackgroundAlpha = 1;
            _this.scrollDuration = 1;
            _this.resizeEnabled = true;
            _this.hideResizeGrips = false;
            _this.scrollbarHeight = 20;

            _this.updateOnReleaseOnly = false;
            if (document.documentMode < 9) {
                _this.updateOnReleaseOnly = true;
            }
            _this.dragIconWidth = 35;
            _this.dragIconHeight = 35;
            _this.dragIcon = "dragIconRoundBig";
            _this.dragCursorHover = "cursor: cursor: grab; cursor:-moz-grab; cursor:-webkit-grab;";
            _this.dragCursorDown = "cursor: cursor: grab; cursor:-moz-grabbing; cursor:-webkit-grabbing;";

            _this.enabled = true;
            _this.offset = 0;

            _this.percentStart = 0;
            _this.percentEnd = 1;

            AmCharts.applyTheme(_this, theme, "SimpleChartScrollbar");
        },

        getPercents: function() {
            var _this = this;
            var dBBox = _this.getDBox();
            var xx = dBBox.x;
            var yy = dBBox.y;
            var ww = dBBox.width;
            var hh = dBBox.height;

            var start;
            var end;

            if (_this.rotate) {
                end = 1 - yy / _this.height;
                start = 1 - (yy + hh) / _this.height;
            } else {
                start = xx / _this.width;
                end = (xx + ww) / _this.width;
            }
            _this.percentStart = start;
            _this.percentEnd = end;
        },

        draw: function() {
            var _this = this;
            _this.destroy();

            if (_this.enabled) {
                var container = _this.chart.container;
                var rotate = _this.rotate;
                var chart = _this.chart;
                chart.panRequired = true;
                var set = container.set();
                _this.set = set;

                //AmCharts.setCN(chart, set, "scrollbar");

                chart.scrollbarsSet.push(set);

                var width;
                var height;

                if (rotate) {
                    width = _this.scrollbarHeight;
                    height = chart.plotAreaHeight;
                } else {
                    height = _this.scrollbarHeight;
                    width = chart.plotAreaWidth;
                }

                _this.width = width;
                _this.height = height;

                var bcn = "scrollbar-";

                if (height && width) {
                    var bg = AmCharts.rect(container, width, height, _this.backgroundColor, _this.backgroundAlpha, 1, _this.backgroundColor, _this.backgroundAlpha);
                    AmCharts.setCN(chart, bg, bcn + "bg");
                    _this.bg = bg;
                    set.push(bg);

                    var invisibleBg = AmCharts.rect(container, width, height, "#000", 0.005);
                    set.push(invisibleBg);
                    _this.invisibleBg = invisibleBg;

                    invisibleBg.click(function() {
                        _this.handleBgClick();
                    }).mouseover(function() {
                        _this.handleMouseOver();
                    }).mouseout(function() {
                        _this.handleMouseOut();
                    }).touchend(function() {
                        _this.handleBgClick();
                    });

                    var selectedBG = AmCharts.rect(container, width, height, _this.selectedBackgroundColor, _this.selectedBackgroundAlpha);
                    AmCharts.setCN(chart, selectedBG, bcn + "bg-selected");
                    _this.selectedBG = selectedBG;
                    set.push(selectedBG);

                    var dragger = AmCharts.rect(container, width, height, "#000", 0.005);
                    _this.dragger = dragger;
                    set.push(dragger);

                    dragger.mousedown(function(event) {
                        _this.handleDragStart(event);
                    }).mouseup(function() {
                        _this.handleDragStop();
                    }).mouseover(function() {
                        _this.handleDraggerOver();
                    }).mouseout(function() {
                        _this.handleMouseOut();
                    }).touchstart(function(event) {
                        _this.handleDragStart(event);
                    }).touchend(function() {
                        _this.handleDragStop();
                    });

                    // drag icons
                    var dragIconWidth;
                    var dragIconHeight;
                    var pathToImages = chart.pathToImages;

                    var fileName;

                    var dragIcon = _this.dragIcon.replace(/\.[a-z]*$/i, "");

                    if(AmCharts.isAbsolute(dragIcon)){
                        pathToImages = "";
                    }

                    if (rotate) {
                        fileName = pathToImages + dragIcon + "H" + chart.extension;
                        dragIconHeight = _this.dragIconWidth;
                        dragIconWidth = _this.dragIconHeight;
                    } else {
                        fileName = pathToImages + dragIcon + chart.extension;
                        dragIconWidth = _this.dragIconWidth;
                        dragIconHeight = _this.dragIconHeight;
                    }

                    var imgLeft = container.image(fileName, 0, 0, dragIconWidth, dragIconHeight);
                    AmCharts.setCN(chart, imgLeft, bcn + "grip-left");

                    var imgRight = container.image(fileName, 0, 0, dragIconWidth, dragIconHeight);
                    AmCharts.setCN(chart, imgRight, bcn + "grip-right");

                    var iw = 10;
                    var ih = 20;
                    if (chart.panEventsEnabled) {
                        iw = 25;
                        ih = _this.scrollbarHeight;
                    }

                    var rectRight = AmCharts.rect(container, iw, ih, "#000", 0.005);
                    var rectLeft = AmCharts.rect(container, iw, ih, "#000", 0.005);
                    rectLeft.translate(-(iw - dragIconWidth) / 2, -(ih - dragIconHeight) / 2);
                    rectRight.translate(-(iw - dragIconWidth) / 2, -(ih - dragIconHeight) / 2);

                    var iconLeft = container.set([imgLeft, rectLeft]);
                    var iconRight = container.set([imgRight, rectRight]);

                    _this.iconLeft = iconLeft;
                    set.push(_this.iconLeft); // 3.3.4 - this causes bullets not to export

                    _this.iconRight = iconRight;
                    set.push(iconRight); // 3.3.4 - this causes bullets not to export

                    chart.makeAccessible(iconLeft, _this.accessibleLabel);
                    chart.makeAccessible(iconRight, _this.accessibleLabel);
                    chart.makeAccessible(dragger, _this.accessibleLabel);

                    iconLeft.setAttr("role", "menuitem");
                    iconRight.setAttr("role", "menuitem");
                    dragger.setAttr("role", "menuitem");

                    if (_this.tabIndex !== undefined) {
                        iconLeft.setAttr("tabindex", _this.tabIndex);
                        iconLeft.keyup(function(ev) {
                            _this.handleKeys(ev, 1, 0);
                        });
                    }

                    if (_this.tabIndex !== undefined) {
                        dragger.setAttr("tabindex", _this.tabIndex);
                        dragger.keyup(function(ev) {
                            _this.handleKeys(ev, 1, 1);
                        });
                    }

                    if (_this.tabIndex !== undefined) {
                        iconRight.setAttr("tabindex", _this.tabIndex);
                        iconRight.keyup(function(ev) {
                            _this.handleKeys(ev, 0, 1);
                        });
                    }


                    iconLeft.mousedown(function() {
                        _this.leftDragStart();
                    }).mouseup(function() {
                        _this.leftDragStop();
                    }).mouseover(function() {
                        _this.iconRollOver();
                    }).mouseout(function() {
                        _this.iconRollOut();
                    }).touchstart(function() {
                        _this.leftDragStart();
                    }).touchend(function() {
                        _this.leftDragStop();
                    });

                    iconRight.mousedown(function() {
                        _this.rightDragStart();
                    }).mouseup(function() {
                        _this.rightDragStop();
                    }).mouseover(function() {
                        _this.iconRollOver();
                    }).mouseout(function() {
                        _this.iconRollOut();
                    }).touchstart(function() {
                        _this.rightDragStart();
                    }).touchend(function() {
                        _this.rightDragStop();
                    });

                    if (AmCharts.ifArray(chart.chartData)) {
                        set.show();
                    } else {
                        set.hide();
                    }

                    _this.hideDragIcons();
                    _this.clipDragger(false);
                }
                set.translate(_this.x, _this.y);
                set.node.style.msTouchAction = "none";
                set.node.style.touchAction = "none";
            }
        },

        handleKeys: function(ev, leftSign, rightSign) {
            var _this = this;
            _this.getPercents();

            var percentStart = _this.percentStart;
            var percentEnd = _this.percentEnd;

            if (_this.rotate) {
                var tmp = percentEnd;
                percentEnd = percentStart;
                percentStart = tmp;
            }

            if (ev.keyCode == 37 || ev.keyCode == 40) {
                percentStart = percentStart - 0.02 * leftSign;
                percentEnd = percentEnd - 0.02 * rightSign;
            }
            if (ev.keyCode == 39 || ev.keyCode == 38) {
                percentStart = percentStart + 0.02 * leftSign;
                percentEnd = percentEnd + 0.02 * rightSign;
            }
            if (_this.rotate) {
                var tmp2 = percentEnd;
                percentEnd = percentStart;
                percentStart = tmp2;
            }

            if (!isNaN(percentEnd) && !isNaN(percentStart)) {
                _this.percentZoom(percentStart, percentEnd, true);
            }
        },

        updateScrollbarSize: function(pos0, pos1) {
            if (!isNaN(pos0) && !isNaN(pos1)) {
                pos0 = Math.round(pos0);
                pos1 = Math.round(pos1);
                var _this = this;
                var dragger = _this.dragger;
                var clipX;
                var clipY;
                var clipW;
                var clipH;
                var draggerSize;

                if (_this.rotate) {
                    clipX = 0;
                    clipY = pos0;
                    clipW = _this.width + 1;
                    clipH = pos1 - pos0;
                    draggerSize = pos1 - pos0;
                    dragger.setAttr("height", draggerSize);
                    dragger.setAttr("y", clipY);
                } else {
                    clipX = pos0;
                    clipY = 0;
                    clipW = pos1 - pos0;
                    clipH = _this.height + 1;
                    draggerSize = pos1 - pos0;

                    dragger.setAttr("x", clipX);
                    dragger.setAttr("width", draggerSize);
                }

                _this.clipAndUpdate(clipX, clipY, clipW, clipH);
            }
        },

        update: function() {
            var _this = this;
            var dragerWidth;
            var switchHands = false;
            var prevPos;
            var mousePos;
            var x = _this.x;
            var y = _this.y;
            var dragger = _this.dragger;
            var bbox = _this.getDBox();
            if (bbox) {
                var bboxX = bbox.x + x;
                var bboxY = bbox.y + y;
                var bboxWidth = bbox.width;
                var bboxHeight = bbox.height;
                var rotate = _this.rotate;
                var chart = _this.chart;
                var width = _this.width;
                var height = _this.height;
                var mouseX = chart.mouseX;
                var mouseY = chart.mouseY;

                var initialMouse = _this.initialMouse;

                if (_this.forceClip) {
                    _this.clipDragger(true);
                }

                if (chart.mouseIsOver) {
                    if (_this.dragging) {

                        var initialCoord = _this.initialCoord;
                        if (rotate) {
                            var newY = initialCoord + (mouseY - initialMouse);
                            if (newY < 0) {
                                newY = 0;
                            }
                            var bottomB = height - bboxHeight;

                            if (newY > bottomB) {
                                newY = bottomB;
                            }

                            dragger.setAttr("y", newY);
                        } else {
                            var newX = initialCoord + (mouseX - initialMouse);
                            if (newX < 0) {
                                newX = 0;
                            }
                            var rightB = width - bboxWidth;

                            if (newX > rightB) {
                                newX = rightB;
                            }

                            dragger.setAttr("x", newX);
                        }
                        _this.clipDragger(true);
                    }

                    if (_this.resizingRight) {
                        if (rotate) {
                            dragerWidth = mouseY - bboxY;

                           if(!isNaN(_this.maxHeight)){
                                if(dragerWidth > _this.maxHeight){
                                    dragerWidth = _this.maxHeight;
                                }
                            }  

                            if (dragerWidth + bboxY > height + y) {
                                dragerWidth = height - bboxY + y;
                            }

                            if (dragerWidth < 0) {
                                _this.resizingRight = false;
                                _this.resizingLeft = true;
                                switchHands = true;
                            } else {
                                if (dragerWidth === 0 || isNaN(dragerWidth)) {
                                    dragerWidth = 0.1;
                                }
                                dragger.setAttr("height", dragerWidth);
                            }
                        } else {
                            dragerWidth = mouseX - bboxX;
                           if(!isNaN(_this.maxWidth)){
                                if(dragerWidth > _this.maxWidth){
                                    dragerWidth = _this.maxWidth;
                                }
                            }   

                            if (dragerWidth + bboxX > width + x) {
                                dragerWidth = width - bboxX + x;
                            }

                            if (dragerWidth < 0) {
                                _this.resizingRight = false;
                                _this.resizingLeft = true;
                                switchHands = true;
                            } else {
                                if (dragerWidth === 0 || isNaN(dragerWidth)) {
                                    dragerWidth = 0.1;
                                }
                                dragger.setAttr("width", dragerWidth);
                            }
                        }
                        _this.clipDragger(true);
                    }

                    if (_this.resizingLeft) {
                        if (rotate) {
                            prevPos = bboxY;
                            mousePos = mouseY;

                            // if mouse is out to left
                            if (mousePos < y) {
                                mousePos = y;
                            }

                            if (isNaN(mousePos)) {
                                mousePos = y;
                            }

                            //if mouse is out to right
                            if (mousePos > height + y) {
                                mousePos = height + y;
                            }
                            if (switchHands === true) {
                                dragerWidth = prevPos - mousePos;
                            } else {
                                dragerWidth = bboxHeight + prevPos - mousePos;
                            }

                            if(!isNaN(_this.maxHeight)){
                                if(dragerWidth > _this.maxHeight){
                                    dragerWidth = _this.maxHeight;
                                    mousePos = prevPos;
                                }
                            }                              

                            if (dragerWidth < 0) {
                                _this.resizingRight = true;
                                _this.resizingLeft = false;
                                dragger.setAttr("y", prevPos + bboxHeight - y);
                            } else {
                                if (dragerWidth === 0 || isNaN(dragerWidth)) {
                                    dragerWidth = 0.1;
                                }
                                dragger.setAttr("y", mousePos - y);
                                dragger.setAttr("height", dragerWidth);
                            }
                        } else {
                            prevPos = bboxX;
                            mousePos = mouseX;

                            // if mouse is out to left
                            if (mousePos < x) {
                                mousePos = x;
                            }

                            if (isNaN(mousePos)) {
                                mousePos = x;
                            }

                            //if mouse is out to right
                            if (mousePos > width + x) {
                                mousePos = width + x;
                            }

                            if (switchHands === true) {
                                dragerWidth = prevPos - mousePos;
                            } else {
                                dragerWidth = bboxWidth + prevPos - mousePos;
                            }

                            if(!isNaN(_this.maxWidth)){
                                if(dragerWidth > _this.maxWidth){
                                    dragerWidth = _this.maxWidth;
                                    mousePos = prevPos;
                                }
                            }                            

                            if (dragerWidth < 0) {
                                _this.resizingRight = true;
                                _this.resizingLeft = false;
                                dragger.setAttr("x", prevPos + bboxWidth - x);
                            } else {
                                if (dragerWidth === 0 || isNaN(dragerWidth)) {
                                    dragerWidth = 0.1;
                                }

                                dragger.setAttr("x", mousePos - x);
                                dragger.setAttr("width", dragerWidth);
                            }
                        }
                        _this.clipDragger(true);
                    }
                }
            }
        },

        stopForceClip: function() {
            this.forceClip = false;
            this.animating = false;
        },

        clipDragger: function(dispatch) {
            var _this = this;
            var bbox = _this.getDBox();

            if (bbox) {
                var bboxX = bbox.x;
                var bboxY = bbox.y;
                var bboxWidth = bbox.width;
                var bboxHeight = bbox.height;

                var update = false;

                if (_this.rotate) {
                    bboxX = 0;
                    bboxWidth = _this.width + 1;
                    if (_this.clipY != bboxY || _this.clipH != bboxHeight) {
                        update = true;
                    }
                } else {
                    bboxY = 0;
                    bboxHeight = _this.height + 1;
                    if (_this.clipX != bboxX || _this.clipW != bboxWidth) {
                        update = true;
                    }
                }

                if (update) {
                    _this.clipAndUpdate(bboxX, bboxY, bboxWidth, bboxHeight);

                    if (dispatch) {
                        if (!_this.updateOnReleaseOnly) {
                            _this.dispatchScrollbarEvent();
                        }
                    }
                }
            }
        },


        maskGraphs: function() {
            //void
        },

        clipAndUpdate: function(x, y, w, h) {
            var _this = this;
            _this.clipX = x;
            _this.clipY = y;
            _this.clipW = w;
            _this.clipH = h;

            //_this.selectedBG.clipRect(x, y, w, h);
            _this.selectedBG.setAttr("width", w);
            _this.selectedBG.setAttr("height", h);
            _this.selectedBG.translate(x, y);
            _this.updateDragIconPositions();
            _this.maskGraphs(x, y, w, h);
        },

        dispatchScrollbarEvent: function() {
            var _this = this;
            if (_this.skipEvent) {
                _this.skipEvent = false;
            } else {
                var chart = _this.chart;
                chart.hideBalloon();
                var dBBox = _this.getDBox();
                var xx = dBBox.x;
                var yy = dBBox.y;
                var ww = dBBox.width;
                var hh = dBBox.height;

                var draggerPos;
                var draggerSize;
                var multiplier;

                _this.getPercents();

                if (_this.rotate) {
                    draggerPos = yy;
                    draggerSize = hh;
                    multiplier = _this.height / hh;
                } else {
                    draggerPos = xx;
                    draggerSize = ww;
                    multiplier = _this.width / ww;
                }
            
                var event = {
                    type: "zoomed",
                    position: draggerPos,
                    chart: chart,
                    target: _this,
                    multiplier: multiplier,
                    relativeStart: _this.percentStart,
                    relativeEnd: _this.percentEnd
                };

                _this.fire(event);
            }
        },

        updateDragIconPositions: function() {
            var _this = this;
            var bbox = _this.getDBox();
            var xx = bbox.x;
            var yy = bbox.y;
            var iconLeft = _this.iconLeft;
            var iconRight = _this.iconRight;
            var dragIconHeight;
            var dragIconWidth;
            var height = _this.scrollbarHeight;

            if (_this.rotate) {
                dragIconHeight = _this.dragIconWidth;
                dragIconWidth = _this.dragIconHeight;
                iconLeft.translate((height - dragIconWidth) / 2, yy - (dragIconHeight) / 2);
                iconRight.translate((height - dragIconWidth) / 2, yy + bbox.height - (dragIconHeight) / 2);
            } else {
                dragIconHeight = _this.dragIconHeight;
                dragIconWidth = _this.dragIconWidth;
                iconLeft.translate(xx - dragIconWidth / 2, (height - dragIconHeight) / 2);
                iconRight.translate(xx - dragIconWidth / 2 + bbox.width, (height - dragIconHeight) / 2);
            }
        },

        showDragIcons: function() {
            var _this = this;
            if (_this.resizeEnabled) {
                _this.iconLeft.show();
                _this.iconRight.show();
            }
        },

        hideDragIcons: function() {
            var _this = this;
            if (!_this.resizingLeft && !_this.resizingRight && !_this.dragging) {
                if (_this.hideResizeGrips || !_this.resizeEnabled) {
                    _this.iconLeft.hide();
                    _this.iconRight.hide();
                }
                _this.removeCursors();
            }
        },


        removeCursors: function() {
            this.chart.setMouseCursor("auto");
        },


        fireZoomEvent: function(type) {
            var _this = this;
            var event = {
                type: type,
                chart: _this.chart,
                target: _this
            };
            _this.fire(event);
        },

        percentZoom: function(start, end, dispatch) {
            var _this = this;
            start = AmCharts.fitToBounds(start, 0, end);
            end = AmCharts.fitToBounds(end, start, 1);
            if (_this.dragger && _this.enabled) { // safe way to know scrollbar is drawn
                _this.dragger.stop();

                if (isNaN(start)) {
                    start = 0;
                }

                if (isNaN(end)) {
                    end = 1;
                }

                var size;
                var pos0;
                var pos1;
                if (_this.rotate) {
                    size = _this.height;
                    pos0 = size - size * end;
                    pos1 = size - size * start;
                } else {
                    size = _this.width;
                    pos1 = size * end;
                    pos0 = size * start;
                }

                _this.updateScrollbarSize(pos0, pos1);
                _this.clipDragger(false);
                _this.getPercents();
                if (dispatch) {
                    _this.dispatchScrollbarEvent();
                }
            }
        },

        destroy: function() {
            var _this = this;
            _this.clear();
            AmCharts.remove(_this.set);
            AmCharts.remove(_this.iconRight);
            AmCharts.remove(_this.iconLeft);
        },

        clear: function() {

        },

        handleDragStart: function() {
            var _this = this;
            if (_this.enabled) {
                _this.fireZoomEvent("zoomStarted");
                var chart = _this.chart;
                _this.dragger.stop();

                _this.removeCursors();
                if (AmCharts.isModern) {
                    _this.dragger.node.setAttribute("style", _this.dragCursorDown);
                }
                _this.dragging = true;
                var bbox = _this.getDBox();
                if (_this.rotate) {
                    _this.initialCoord = bbox.y;
                    _this.initialMouse = chart.mouseY;
                } else {
                    _this.initialCoord = bbox.x;
                    _this.initialMouse = chart.mouseX;
                }            
            }
        },

        
        handleDragStop: function() {
            var _this = this;
            if (_this.updateOnReleaseOnly) {
                _this.update();
                _this.skipEvent = false;
                _this.dispatchScrollbarEvent();
            }

            _this.dragging = false;

            if (_this.mouseIsOver) {
                _this.removeCursors();
            }
            if (AmCharts.isModern) {
                _this.dragger.node.setAttribute("style", _this.dragCursorHover);
            }
            _this.update();
            _this.fireZoomEvent("zoomEnded");
        },

        handleDraggerOver: function() {
            var _this = this;
            _this.handleMouseOver();
            if (AmCharts.isModern) {
                _this.dragger.node.setAttribute("style", _this.dragCursorHover);
            }
        },

        leftDragStart: function() {
            var _this = this;
            _this.fireZoomEvent("zoomStarted");
            _this.dragger.stop();
            _this.resizingLeft = true;
        },

        leftDragStop: function() {
            var _this = this;
            if(_this.resizingLeft){
                _this.resizingLeft = false;
                if (!_this.mouseIsOver) {
                    _this.removeCursors();
                }            
                _this.updateOnRelease();

                _this.fireZoomEvent("zoomEnded");
            }
        },

        rightDragStart: function() {
            var _this = this;
            _this.fireZoomEvent("zoomStarted");
            _this.dragger.stop();
            _this.resizingRight = true;
        },


        rightDragStop: function() {
            var _this = this;
            if(_this.resizingRight){
                _this.resizingRight = false;
                if (!_this.mouseIsOver) {
                    _this.removeCursors();
                }
                _this.updateOnRelease();
                _this.fireZoomEvent("zoomEnded");
            }
        },

        iconRollOut: function() {
            this.removeCursors();
        },

        iconRollOver: function() {
            var _this = this;
            if (_this.rotate) {
                _this.chart.setMouseCursor("ns-resize");
            } else {
                _this.chart.setMouseCursor("ew-resize");
            }
            _this.handleMouseOver();
        },

        getDBox: function() {
            if (this.dragger) {
                var bbox = this.dragger.getBBox();
                return bbox;
            }
        },

        handleBgClick: function() {
            var _this = this;
            if (!_this.resizingRight && !_this.resizingLeft) {
                _this.zooming = true;
                var property;
                var start;
                var end;
                var duration = _this.scrollDuration;
                var dragger = _this.dragger;
                var bbox = _this.getDBox();
                var bboxHeight = bbox.height;
                var bboxWidth = bbox.width;
                var chart = _this.chart;
                var y = _this.y;
                var x = _this.x;
                var rotate = _this.rotate;

                if (rotate) {
                    property = "y";
                    start = bbox.y;
                    end = chart.mouseY - bboxHeight / 2 - y;
                    end = AmCharts.fitToBounds(end, 0, _this.height - bboxHeight);
                } else {
                    property = "x";
                    start = bbox.x;
                    end = chart.mouseX - bboxWidth / 2 - x;
                    end = AmCharts.fitToBounds(end, 0, _this.width - bboxWidth);
                }
                if (_this.updateOnReleaseOnly) {
                    _this.skipEvent = false;
                    dragger.setAttr(property, end);
                    _this.dispatchScrollbarEvent();
                    _this.clipDragger();
                } else {
                    _this.animating = true;
                    end = Math.round(end);
                    if (rotate) {
                        dragger.animate({
                            "y": end
                        }, duration, ">");
                    } else {
                        dragger.animate({
                            "x": end
                        }, duration, ">");
                    }
                    _this.forceClip = true;
                    clearTimeout(_this.forceTO);
                    _this.forceTO = setTimeout(function() {
                        _this.stopForceClip.call(_this);
                    }, duration * 5000); //3000 is just in case, as animations can take longer on slow computers
                }
            }
        },

        updateOnRelease: function() {
            var _this = this;
            if (_this.updateOnReleaseOnly) {
                _this.update();
                _this.skipEvent = false;
                _this.dispatchScrollbarEvent();
            }
        },

        handleReleaseOutside: function() {
            var _this = this;

            if (_this.set) {
                if (_this.resizingLeft || _this.resizingRight || _this.dragging) {
                    _this.resizingLeft = false;
                    _this.resizingRight = false;
                    _this.dragging = false;                    
                    _this.updateOnRelease();
                    _this.removeCursors();
                }

                _this.mouseIsOver = false;
                _this.animating = false;

                _this.hideDragIcons();
                _this.update();
            }
        },

        handleMouseOver: function() {
            var _this = this;
            _this.mouseIsOver = true;
            _this.showDragIcons();
        },


        handleMouseOut: function() {
            var _this = this;
            _this.mouseIsOver = false;
            _this.hideDragIcons();
            _this.removeCursors();
        }

    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.ChartScrollbar = AmCharts.Class({

        inherits: AmCharts.SimpleChartScrollbar,

        construct: function(theme) {
            var _this = this;
            _this.cname = "ChartScrollbar";
            AmCharts.ChartScrollbar.base.construct.call(_this, theme);
            _this.graphLineColor = "#BBBBBB";
            _this.graphLineAlpha = 0;
            _this.graphFillColor = "#BBBBBB";
            _this.graphFillAlpha = 1;
            _this.selectedGraphLineColor = "#888888";
            _this.selectedGraphLineAlpha = 0;
            _this.selectedGraphFillColor = "#888888";
            _this.selectedGraphFillAlpha = 1;
            _this.gridCount = 0;
            _this.gridColor = "#FFFFFF";
            _this.gridAlpha = 0.7;
            _this.autoGridCount = false;
            _this.skipEvent = false;
            _this.color = "#FFFFFF";
            _this.scrollbarCreated = false;
            _this.oppositeAxis = true;
            _this.accessibleLabel = "Zoom chart using cursor arrows";

            AmCharts.applyTheme(_this, theme, _this.cname);
        },


        init: function() {
            var _this = this;
            var categoryAxis = _this.categoryAxis;
            var chart = _this.chart;
            var gridAxis = _this.gridAxis;

            if (!categoryAxis) {
                if (_this.gridAxis.cname == "CategoryAxis") {
                    _this.catScrollbar = true;
                    categoryAxis = new AmCharts.CategoryAxis();
                    categoryAxis.id = "scrollbar";
                } else {
                    categoryAxis = new AmCharts.ValueAxis();
                    categoryAxis.data = chart.chartData;
                    categoryAxis.id = gridAxis.id;
                    categoryAxis.type = gridAxis.type;
                    categoryAxis.maximumDate = gridAxis.maximumDate;
                    categoryAxis.minimumDate = gridAxis.minimumDate;
                    categoryAxis.minPeriod = gridAxis.minPeriod;
                }
                _this.categoryAxis = categoryAxis;
            }

            categoryAxis.chart = chart;
            var chartCategoryAxis = chart.categoryAxis;
            if (chartCategoryAxis) {
                categoryAxis.firstDayOfWeek = chartCategoryAxis.firstDayOfWeek;
            }
            categoryAxis.dateFormats = gridAxis.dateFormats;
            categoryAxis.markPeriodChange = gridAxis.markPeriodChange;
            categoryAxis.boldPeriodBeginning = gridAxis.boldPeriodBeginning;
            categoryAxis.labelFunction = gridAxis.labelFunction;
            categoryAxis.axisItemRenderer = AmCharts.RecItem;
            categoryAxis.axisRenderer = AmCharts.RecAxis;
            categoryAxis.guideFillRenderer = AmCharts.RecFill;
            categoryAxis.inside = true;
            categoryAxis.fontSize = _this.fontSize;
            categoryAxis.tickLength = 0;
            categoryAxis.axisAlpha = 0;

            if (AmCharts.isString(_this.graph)) {
                _this.graph = AmCharts.getObjById(chart.graphs, _this.graph);
            }

            var graph = _this.graph;

            if (graph && _this.catScrollbar) {
                var valueAxis = _this.valueAxis;
                if (!valueAxis) {
                    valueAxis = new AmCharts.ValueAxis();
                    _this.valueAxis = valueAxis;
                    valueAxis.visible = false;
                    valueAxis.scrollbar = true;
                    valueAxis.axisItemRenderer = AmCharts.RecItem;
                    valueAxis.axisRenderer = AmCharts.RecAxis;
                    valueAxis.guideFillRenderer = AmCharts.RecFill;
                    valueAxis.labelsEnabled = false;
                    valueAxis.chart = chart;
                }

                var unselectedGraph = _this.unselectedGraph;
                if (!unselectedGraph) {
                    unselectedGraph = new AmCharts.AmGraph();
                    unselectedGraph.scrollbar = true;
                    _this.unselectedGraph = unselectedGraph;
                    unselectedGraph.negativeBase = graph.negativeBase;
                    unselectedGraph.noStepRisers = graph.noStepRisers;
                }
                var selectedGraph = _this.selectedGraph;
                if (!selectedGraph) {
                    selectedGraph = new AmCharts.AmGraph();
                    selectedGraph.scrollbar = true;
                    _this.selectedGraph = selectedGraph;
                    selectedGraph.negativeBase = graph.negativeBase;
                    selectedGraph.noStepRisers = graph.noStepRisers;
                }
            }
            _this.scrollbarCreated = true;
        },


        draw: function() {
            var _this = this;
            AmCharts.ChartScrollbar.base.draw.call(_this);
            if (_this.enabled) {
                if (!_this.scrollbarCreated) {
                    _this.init();
                }

                var chart = _this.chart;
                var data = chart.chartData;

                var categoryAxis = _this.categoryAxis;
                var rotate = _this.rotate;
                var x = _this.x;
                var y = _this.y;
                var width = _this.width;
                var height = _this.height;
                var gridAxis = _this.gridAxis;
                var set = _this.set;

                categoryAxis.setOrientation(!rotate);
                categoryAxis.parseDates = gridAxis.parseDates;
                if (_this.categoryAxis.cname == "ValueAxis") {
                    categoryAxis.rotate = !rotate;
                }
                categoryAxis.equalSpacing = gridAxis.equalSpacing;
                categoryAxis.minPeriod = gridAxis.minPeriod;
                categoryAxis.startOnAxis = gridAxis.startOnAxis;
                categoryAxis.width = width - 1;
                categoryAxis.height = height;
                categoryAxis.gridCount = _this.gridCount;
                categoryAxis.gridColor = _this.gridColor;
                categoryAxis.gridAlpha = _this.gridAlpha;
                categoryAxis.color = _this.color;
                categoryAxis.tickLength = 0;
                categoryAxis.axisAlpha = 0;
                categoryAxis.autoGridCount = _this.autoGridCount;

                if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
                    categoryAxis.timeZoom(chart.firstTime, chart.lastTime);
                }

                categoryAxis.minimum = _this.gridAxis.fullMin;
                categoryAxis.maximum = _this.gridAxis.fullMax;
                categoryAxis.strictMinMax = true;
                categoryAxis.zoom(0, data.length - 1);

                var graph = _this.graph;


                if (graph && _this.catScrollbar) {
                    var valueAxis = _this.valueAxis;
                    var graphValueAxis = graph.valueAxis;
                    valueAxis.id = graphValueAxis.id;
                    valueAxis.rotate = rotate;
                    valueAxis.setOrientation(rotate);
                    valueAxis.width = width;
                    valueAxis.height = height;
                    valueAxis.dataProvider = data;
                    valueAxis.reversed = graphValueAxis.reversed;
                    valueAxis.logarithmic = graphValueAxis.logarithmic;
                    valueAxis.gridAlpha = 0;
                    valueAxis.axisAlpha = 0;
                    set.push(valueAxis.set);

                    if (rotate) {
                        valueAxis.y = y;
                        valueAxis.x = 0;
                    } else {
                        valueAxis.x = x;
                        valueAxis.y = 0;
                    }

                    var min = Infinity;
                    var max = -Infinity;
                    var i;
                    for (i = 0; i < data.length; i++) {
                        var values = data[i].axes[graphValueAxis.id].graphs[graph.id].values;
                        var k;
                        for (k in values) {
                            if (values.hasOwnProperty(k)) {
                                if (k != "percents" && k != "total") {
                                    var val = values[k];

                                    if (val < min) {
                                        min = val;
                                    }
                                    if (val > max) {
                                        max = val;
                                    }
                                }
                            }
                        }
                    }

                    if (min != Infinity) {
                        valueAxis.minimum = min;
                    }
                    if (max != -Infinity) {
                        valueAxis.maximum = max + (max - min) * 0.1;
                    }

                    if (min == max) {
                        valueAxis.minimum -= 1;
                        valueAxis.maximum += 1;
                    }

                    if (_this.minimum !== undefined) {
                        valueAxis.minimum = _this.minimum;
                    }

                    if (_this.maximum !== undefined) {
                        valueAxis.maximum = _this.maximum;
                    }

                    valueAxis.zoom(0, data.length - 1);

                    var ug = _this.unselectedGraph;
                    ug.id = graph.id;
                    ug.bcn = "scrollbar-graph-";
                    ug.rotate = rotate;
                    ug.chart = chart;
                    ug.data = data;
                    ug.valueAxis = valueAxis;
                    ug.chart = graph.chart;
                    ug.categoryAxis = _this.categoryAxis;
                    ug.periodSpan = graph.periodSpan;
                    ug.valueField = graph.valueField;
                    ug.openField = graph.openField;
                    ug.closeField = graph.closeField;
                    ug.highField = graph.highField;
                    ug.lowField = graph.lowField;
                    ug.lineAlpha = _this.graphLineAlpha;
                    ug.lineColorR = _this.graphLineColor;
                    ug.fillAlphas = _this.graphFillAlpha;
                    ug.fillColorsR = _this.graphFillColor;
                    ug.connect = graph.connect;
                    ug.hidden = graph.hidden;
                    ug.width = width;
                    ug.height = height;
                    ug.pointPosition = graph.pointPosition;
                    ug.stepDirection = graph.stepDirection;
                    ug.periodSpan = graph.periodSpan;


                    var sg = _this.selectedGraph;
                    sg.id = graph.id;
                    sg.bcn = ug.bcn + "selected-";
                    sg.rotate = rotate;
                    sg.chart = chart;
                    sg.data = data;
                    sg.valueAxis = valueAxis;
                    sg.chart = graph.chart;
                    sg.categoryAxis = categoryAxis;
                    sg.periodSpan = graph.periodSpan;
                    sg.valueField = graph.valueField;
                    sg.openField = graph.openField;
                    sg.closeField = graph.closeField;
                    sg.highField = graph.highField;
                    sg.lowField = graph.lowField;
                    sg.lineAlpha = _this.selectedGraphLineAlpha;
                    sg.lineColorR = _this.selectedGraphLineColor;
                    sg.fillAlphas = _this.selectedGraphFillAlpha;
                    sg.fillColorsR = _this.selectedGraphFillColor;
                    sg.connect = graph.connect;
                    sg.hidden = graph.hidden;
                    sg.width = width;
                    sg.height = height;

                    sg.pointPosition = graph.pointPosition;
                    sg.stepDirection = graph.stepDirection;
                    sg.periodSpan = graph.periodSpan;

                    var graphType = _this.graphType;

                    if (!graphType) {
                        graphType = graph.type;
                    }

                    ug.type = graphType;
                    sg.type = graphType;

                    var lastIndex = data.length - 1;
                    ug.zoom(0, lastIndex);
                    sg.zoom(0, lastIndex);

                    sg.set.click(function() {
                        _this.handleBackgroundClick();
                    }).mouseover(function() {
                        _this.handleMouseOver();
                    }).mouseout(function() {
                        _this.handleMouseOut();
                    });

                    ug.set.click(function() {
                        _this.handleBackgroundClick();
                    }).mouseover(function() {
                        _this.handleMouseOver();
                    }).mouseout(function() {
                        _this.handleMouseOut();
                    });
                    set.push(ug.set);
                    set.push(sg.set);
                }

                set.push(categoryAxis.set);
                set.push(categoryAxis.labelsSet);

                _this.bg.toBack();
                _this.invisibleBg.toFront();
                _this.dragger.toFront();
                _this.iconLeft.toFront();
                _this.iconRight.toFront();
            }
        },

        timeZoom: function(startTime, endTime, dispatch) {
            var _this = this;
            _this.startTime = startTime;
            _this.endTime = endTime;
            _this.timeDifference = endTime - startTime;
            _this.skipEvent = !AmCharts.toBoolean(dispatch);
            _this.zoomScrollbar();

            //if (!_this.skipEvent) {
            _this.dispatchScrollbarEvent();
            //}
        },

        zoom: function(start, end) {
            var _this = this;
            _this.start = start;
            _this.end = end;
            _this.skipEvent = true;
            _this.zoomScrollbar();
        },

        dispatchScrollbarEvent: function() {
            var _this = this;
            if (_this.categoryAxis) {
                if (_this.categoryAxis.cname == "ValueAxis") {
                    AmCharts.ChartScrollbar.base.dispatchScrollbarEvent.call(_this);
                    return;
                }
            }

            if (_this.skipEvent) {
                _this.skipEvent = false;
            } else {
                var data = _this.chart.chartData;
                var draggerPos;
                var draggerSize;
                var dBBox = _this.dragger.getBBox();
                var xx = dBBox.x;
                var yy = dBBox.y;
                var ww = dBBox.width;
                var hh = dBBox.height;

                var chart = _this.chart;

                if (_this.rotate) {
                    draggerPos = yy;
                    draggerSize = hh;
                } else {
                    draggerPos = xx;
                    draggerSize = ww;
                }

                var event = {
                    type: "zoomed"
                };
                event.target = this;
                event.chart = chart;

                var categoryAxis = _this.categoryAxis;
                var stepWidth = _this.stepWidth;

                var minSelectedTime = chart.minSelectedTime;
                var maxSelectedTime = chart.maxSelectedTime;
                var forceUpdate = false;
                if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
                    var lastTime = chart.lastTime;
                    var firstTime = chart.firstTime;

                    var startTime = Math.round(draggerPos / stepWidth) + firstTime;
                    var endTime;

                    if (!_this.dragging) {
                        endTime = Math.round((draggerPos + draggerSize) / stepWidth) + firstTime;
                    } else {
                        endTime = startTime + _this.timeDifference;
                    }

                    if (startTime > endTime) {
                        startTime = endTime;
                    }

                    var middleTime;
                    var delta;
                    if (minSelectedTime > 0 && endTime - startTime < minSelectedTime) {
                        middleTime = Math.round(startTime + (endTime - startTime) / 2);
                        delta = Math.round(minSelectedTime / 2);
                        startTime = middleTime - delta;
                        endTime = middleTime + delta;
                        forceUpdate = true;
                    }

                    if (maxSelectedTime > 0 && endTime - startTime > maxSelectedTime) {
                        middleTime = Math.round(startTime + (endTime - startTime) / 2);
                        delta = Math.round(maxSelectedTime / 2);
                        startTime = middleTime - delta;
                        endTime = middleTime + delta;
                        forceUpdate = true;
                    }

                    if (endTime > lastTime) {
                        endTime = lastTime;
                    }

                    if (endTime - minSelectedTime < startTime) {
                        startTime = endTime - minSelectedTime;
                    }

                    if (startTime < firstTime) {
                        startTime = firstTime;
                    }

                    if (startTime + minSelectedTime > endTime) {
                        endTime = startTime + minSelectedTime;
                    }

                    if (startTime != _this.startTime || endTime != _this.endTime) {
                        _this.startTime = startTime;
                        _this.endTime = endTime;
                        event.start = startTime;
                        event.end = endTime;
                        event.startDate = new Date(startTime);
                        event.endDate = new Date(endTime);
                        _this.fire(event);
                    }
                } else {
                    if (!categoryAxis.startOnAxis) {
                        var halfStep = stepWidth / 2;
                        draggerPos += halfStep;
                    }

                    draggerSize -= _this.stepWidth / 2;

                    var start = categoryAxis.xToIndex(draggerPos);
                    var end = categoryAxis.xToIndex(draggerPos + draggerSize);

                    if (start != _this.start || _this.end != end) {
                        if (categoryAxis.startOnAxis) {
                            if (_this.resizingRight && start == end) {
                                end++;
                            }

                            if (_this.resizingLeft && start == end) {
                                if (start > 0) {
                                    start--;
                                } else {
                                    end = 1;
                                }
                            }
                        }

                        _this.start = start;
                        if (!_this.dragging) {
                            _this.end = end;
                        } else {
                            _this.end = _this.start + _this.difference;
                        }

                        event.start = _this.start;
                        event.end = _this.end;

                        if (categoryAxis.parseDates) {
                            if (data[_this.start]) {
                                event.startDate = new Date(data[_this.start].time);
                            }
                            if (data[_this.end]) {
                                event.endDate = new Date(data[_this.end].time);
                            }
                        }

                        _this.fire(event);
                    }
                    _this.percentStart = start;
                    _this.percentEnd = end;
                }


                /* if this is set when parseDates is false, this causes scrollbar to jump ugly
               as this was done to sync scrollbars well in stock chart, should work fine.
            */
                if (forceUpdate) {
                    _this.zoomScrollbar(true);
                }
            }
        },


        zoomScrollbar: function(force) {
            var _this = this;
            if (_this.dragging || _this.resizingLeft || _this.resizingRight || _this.animating) {
                if (!force) {
                    return;
                }
            }

            if (_this.dragger && _this.enabled) { // safe way to know scrollbar is drawn
                var pos0;
                var pos1;
                var chart = _this.chart;
                var data = chart.chartData;
                var categoryAxis = _this.categoryAxis;
                var stepWidth;

                if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
                    stepWidth = categoryAxis.stepWidth;

                    var firstTime = chart.firstTime;

                    pos0 = stepWidth * (_this.startTime - firstTime);
                    pos1 = stepWidth * (_this.endTime - firstTime);
                } else {
                    pos0 = data[_this.start].x[categoryAxis.id];
                    pos1 = data[_this.end].x[categoryAxis.id];

                    stepWidth = categoryAxis.stepWidth;

                    if (!categoryAxis.startOnAxis) {
                        var halfStep = stepWidth / 2;
                        pos0 -= halfStep;
                        pos1 += halfStep;
                    }
                }
                _this.stepWidth = stepWidth;
                _this.updateScrollbarSize(pos0, pos1);
            }
        },


        maskGraphs: function(x, y, w, h) {
            var _this = this;
            var selectedGraph = _this.selectedGraph;
            if (selectedGraph) {
                selectedGraph.set.clipRect(x, y, w, h);
            }
        },

        handleDragStart: function() {
            var _this = this;
            AmCharts.ChartScrollbar.base.handleDragStart.call(_this);
            _this.difference = _this.end - _this.start;
            _this.timeDifference = _this.endTime - _this.startTime;
            if (_this.timeDifference < 0) {
                _this.timeDifference = 0;
            }
        },

        handleBackgroundClick: function() {
            var _this = this;
            AmCharts.ChartScrollbar.base.handleBackgroundClick.call(_this);

            if (!_this.dragging) {
                _this.difference = _this.end - _this.start;
                _this.timeDifference = _this.endTime - _this.startTime;
                if (_this.timeDifference < 0) {
                    _this.timeDifference = 0;
                }
            }
        }

    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.AmBalloon = AmCharts.Class({

        construct: function(theme) {
            var _this = this;
            _this.cname = "AmBalloon";
            _this.enabled = true;
            _this.fillColor = "#FFFFFF";
            _this.fillAlpha = 0.8;
            _this.borderThickness = 2;
            _this.borderColor = "#FFFFFF";
            _this.borderAlpha = 1;
            _this.cornerRadius = 0;
            _this.maxWidth = 220;
            _this.horizontalPadding = 8;
            _this.verticalPadding = 4;
            _this.pointerWidth = 6;
            _this.pointerOrientation = "V";
            _this.color = "#000000";
            _this.adjustBorderColor = true;
            _this.showBullet = false;
            _this.follow = false;
            _this.show = false;
            _this.bulletSize = 3;
            _this.shadowAlpha = 0.4;
            _this.shadowColor = "#000000";
            _this.animationDuration = 0.3;
            _this.fadeOutDuration = 0.3;
            _this.fixedPosition = true;
            _this.offsetY = 6;
            _this.offsetX = 1;
            _this.textAlign = "center";
            _this.disableMouseEvents = true;

            _this.deltaSignY = 1;
            _this.deltaSignX = 1;

            if (!AmCharts.isModern) {
                _this.offsetY *= 1.5;
            }

            //_this.mainSet;

            _this.sdx = 0;
            _this.sdy = 0;

            AmCharts.applyTheme(_this, theme, _this.cname);
        },

        draw: function() {
            var _this = this;
            var ptx = _this.pointToX;
            var pty = _this.pointToY;
            var PX = "px";

            if (!AmCharts.isModern) {
                _this.drop = false;
            }

            var chart = _this.chart;
            var UNDEFINED;

            if (AmCharts.VML) {
                _this.fadeOutDuration = 0;
            }

            if (_this.xAnim) {
                chart.stopAnim(_this.xAnim);
            }
            if (_this.yAnim) {
                chart.stopAnim(_this.yAnim);
            }

            _this.sdx = 0;
            _this.sdy = 0;

            if (!isNaN(ptx)) {
                var follow = _this.follow;
                var container = chart.container;
                var set = _this.set;
                AmCharts.remove(set);

                _this.removeDiv();

                set = container.set();
                set.node.style.pointerEvents = "none";
                _this.set = set;

                if (_this.mainSet) {
                    _this.mainSet.push(_this.set);
                    _this.sdx = _this.mainSet.x;
                    _this.sdy = _this.mainSet.y;
                } else {
                    chart.balloonsSet.push(set);
                }

                if (_this.show) {
                    var ll = _this.l;
                    var tt = _this.t;
                    var rr = _this.r;
                    var bb = _this.b;

                    var balloonColor = _this.balloonColor;
                    var fillColor = _this.fillColor;
                    var borderColor = _this.borderColor;
                    var pointerColor = fillColor;

                    if (balloonColor != UNDEFINED) {
                        if (_this.adjustBorderColor) {
                            borderColor = balloonColor;
                            pointerColor = borderColor;
                        } else {
                            fillColor = balloonColor;
                        }
                    }

                    var horizontalPadding = _this.horizontalPadding;
                    var verticalPadding = _this.verticalPadding;
                    var pointerWidth = _this.pointerWidth;
                    var pointerOrientation = _this.pointerOrientation;
                    var cornerRadius = _this.cornerRadius;
                    var fontFamily = chart.fontFamily;
                    var textSize = _this.fontSize;

                    if (textSize == UNDEFINED) {
                        textSize = chart.fontSize;
                    }

                    var textDiv = document.createElement("div");
                    var classNamePrefix = chart.classNamePrefix;
                    textDiv.className = classNamePrefix + "-balloon-div";
                    if (_this.className) {
                        textDiv.className = textDiv.className + " " + classNamePrefix + "-balloon-div-" + _this.className;
                    }

                    var divStyle = textDiv.style;
                    if (_this.disableMouseEvents) {
                        divStyle.pointerEvents = "none";
                    }
                    divStyle.position = "absolute";

                    var minWidth = _this.minWidth;
                    var minWidthStyle = "";
                    if (!isNaN(minWidth)) {
                        minWidthStyle = "min-width:" + (minWidth - horizontalPadding * 2) + "px; ";
                    }

                    var text = '<div style="text-align:' + _this.textAlign + '; ' + minWidthStyle + 'max-width:' + _this.maxWidth + 'px; font-size:' + textSize + 'px; color:' + _this.color + '; font-family:' + fontFamily + '">' + _this.text + '</div>';

                    textDiv.innerHTML = text;
                    chart.chartDiv.appendChild(textDiv);

                    _this.textDiv = textDiv;

                    var divWidth = textDiv.offsetWidth;
                    var divHeight = textDiv.offsetHeight;

                    if (textDiv.clientHeight) {
                        divWidth = textDiv.clientWidth;
                        divHeight = textDiv.clientHeight;
                    }

                    var h = divHeight + 2 * verticalPadding;
                    var w = divWidth + 2 * horizontalPadding;


                    if (!isNaN(minWidth) && w < minWidth) {
                        w = minWidth;
                    }

                    if (window.opera) {
                        h += 2;
                    }

                    var cx;
                    var cy;

                    var switched = false;
                    var offsetY = _this.offsetY;
                    if (chart.handDrawn) {
                        offsetY += chart.handDrawScatter + 2;
                    }

                    // position of the balloon
                    if (pointerOrientation != "H") {
                        cx = ptx - w / 2;
                        if (pty < tt + h + 10 && pointerOrientation != "down") {
                            switched = true;
                            if (follow) {
                                pty += offsetY;
                            }
                            cy = pty + pointerWidth;
                            _this.deltaSignY = -1;

                        } else {
                            if (follow) {
                                pty -= offsetY;
                            }
                            cy = pty - h - pointerWidth;
                            _this.deltaSignY = 1;
                            ty = -(pointerWidth + h - verticalPadding);
                        }

                    } else {
                        if (pointerWidth * 2 > h) {
                            pointerWidth = h / 2;
                        }

                        cy = pty - h / 2;
                        if (ptx < ll + (rr - ll) / 2) {
                            cx = ptx + pointerWidth;
                            _this.deltaSignX = -1;
                        } else {
                            cx = ptx - w - pointerWidth;
                            _this.deltaSignX = 1;
                        }

                    }
                    // fit to bounds
                    if (cy + h >= bb) {
                        cy = bb - h;
                    }
                    if (cy < tt) {
                        cy = tt;
                    }
                    if (cx < ll) {
                        cx = ll;
                    }
                    if (cx + w > rr) {
                        cx = rr - w;
                    }


                    var ty = cy + verticalPadding;
                    var tx = cx + horizontalPadding;


                    var shadowAlpha = _this.shadowAlpha;
                    var shadowColor = _this.shadowColor;
                    var borderThickness = _this.borderThickness;
                    //place the ballloon
                    var bg;
                    var bulletSize = _this.bulletSize;
                    var bgShadow;
                    var pointer;
                    var fillAlpha = _this.fillAlpha;
                    var borderAlpha = _this.borderAlpha;

                    if (_this.showBullet) {
                        pointer = AmCharts.circle(container, bulletSize, pointerColor, fillAlpha);
                        set.push(pointer);
                    }

                    if (_this.drop) {
                        var radius = w / 1.6;
                        var angle = 0;

                        if (pointerOrientation == "V") {
                            pointerOrientation = "down";
                        }

                        if (pointerOrientation == "H") {
                            pointerOrientation = "left";
                        }

                        if (pointerOrientation == "down") {
                            cx = ptx + 1;
                            cy = pty - radius - radius / 3;
                        }

                        if (pointerOrientation == "up") {
                            angle = 180;
                            cx = ptx + 1;
                            cy = pty + radius + radius / 3;
                        }

                        if (pointerOrientation == "left") {
                            angle = 270;
                            cx = ptx + radius + radius / 3 + 2;
                            cy = pty;
                        }

                        if (pointerOrientation == "right") {
                            angle = 90;
                            cx = ptx - radius - radius / 3 + 2;
                            cy = pty;
                        }

                        ty = cy - divHeight / 2 + 1;
                        tx = cx - divWidth / 2 - 1;

                        bg = AmCharts.drop(container, radius, angle, fillColor, fillAlpha, borderThickness, borderColor, borderAlpha);
                    } else if (cornerRadius > 0 || pointerWidth === 0) {
                        if (shadowAlpha > 0) {
                            bgShadow = AmCharts.rect(container, w, h, fillColor, 0, borderThickness + 1, shadowColor, shadowAlpha, cornerRadius);
                            if (AmCharts.isModern) {
                                bgShadow.translate(1, 1);
                            } else {
                                bgShadow.translate(4, 4);
                            }

                            set.push(bgShadow);
                        }

                        bg = AmCharts.rect(container, w, h, fillColor, fillAlpha, borderThickness, borderColor, borderAlpha, cornerRadius);

                    } else {
                        var xx = [];
                        var yy = [];
                        if (pointerOrientation != "H") {
                            var zx = ptx - cx; // center of the pointer root
                            if (zx > w - pointerWidth) {
                                zx = w - pointerWidth;
                            }

                            if (zx < pointerWidth) {
                                zx = pointerWidth;
                            }

                            xx = [0, zx - pointerWidth, ptx - cx, zx + pointerWidth, w, w, 0, 0];

                            if (switched) {
                                yy = [0, 0, pty - cy, 0, 0, h, h, 0];
                            } else {
                                yy = [h, h, pty - cy, h, h, 0, 0, h];
                            }
                        } else {
                            var zy = pty - cy; // center of the pointer root
                            if (zy > h - pointerWidth) {
                                zy = h - pointerWidth;
                            }

                            if (zy < pointerWidth) {
                                zy = pointerWidth;
                            }

                            yy = [0, zy - pointerWidth, pty - cy, zy + pointerWidth, h, h, 0, 0];

                            var midX;
                            if (ptx < ll + (rr - ll) / 2) {

                                if (cx < ptx) {
                                    midX = 0;
                                } else {
                                    midX = ptx - cx;
                                }

                                xx = [0, 0, midX, 0, 0, w, w, 0];
                            } else {


                                if (cx + w > ptx) {
                                    midX = w;
                                } else {
                                    midX = ptx - cx;
                                }

                                xx = [w, w, midX, w, w, 0, 0, w];
                            }
                        }

                        if (shadowAlpha > 0) {
                            bgShadow = AmCharts.polygon(container, xx, yy, fillColor, 0, borderThickness, shadowColor, shadowAlpha);
                            bgShadow.translate(1, 1);
                            set.push(bgShadow);
                        }

                        bg = AmCharts.polygon(container, xx, yy, fillColor, fillAlpha, borderThickness, borderColor, borderAlpha);

                    }
                    _this.bg = bg;
                    set.push(bg);
                    bg.toFront();

                    AmCharts.setCN(chart, bg, "balloon-bg");
                    if (_this.className) {
                        AmCharts.setCN(chart, bg, "balloon-bg-" + _this.className);
                    }

                    var dx = 1 * _this.deltaSignX;

                    tx += _this.sdx;
                    ty += _this.sdy;

                    divStyle.left = tx + PX;
                    divStyle.top = ty + PX;

                    set.translate(cx - dx, cy, 1, true);
                    var bgbox = bg.getBBox();
                    _this.bottom = cy + h + 1;
                    _this.yPos = bgbox.y + cy;

                    if (pointer) {
                        pointer.translate(_this.pointToX - cx + dx, pty - cy);
                    }

                    var animationDuration = _this.animationDuration;
                    if (_this.animationDuration > 0 && !follow) {
                        var effect = "easeOutSine";
                        if (!isNaN(_this.prevX)) {

                            var prevX = _this.prevX;
                            set.translate(prevX, _this.prevY, NaN, true);

                            set.animate({
                                "translate": (cx - dx) + "," + cy
                            }, animationDuration, effect);

                            if (textDiv) {
                                divStyle.left = _this.prevTX + PX;
                                divStyle.top = _this.prevTY + PX;
                                _this.xAnim = chart.animate({
                                    node: textDiv
                                }, "left", _this.prevTX, tx, animationDuration, effect, PX);
                                _this.yAnim = chart.animate({
                                    node: textDiv
                                }, "top", _this.prevTY, ty, animationDuration, effect, PX);
                            }
                        }
                    }

                    _this.prevX = cx - dx;
                    _this.prevY = cy;
                    _this.prevTX = tx;
                    _this.prevTY = ty;
                }
            }
        },

        fixPrevious: function() {
            var _this = this;
            _this.rPrevX = _this.prevX;
            _this.rPrevY = _this.prevY;
            _this.rPrevTX = _this.prevTX;
            _this.rPrevTY = _this.prevTY;
        },

        restorePrevious: function() {
            var _this = this;
            _this.prevX = _this.rPrevX;
            _this.prevY = _this.rPrevY;
            _this.prevTX = _this.rPrevTX;
            _this.prevTY = _this.rPrevTY;
        },

        followMouse: function() {
            var _this = this;
            if (_this.follow && _this.show) {
                var ptx = _this.chart.mouseX - (_this.offsetX * _this.deltaSignX) - _this.sdx;
                var pty = _this.chart.mouseY - _this.sdy;
                _this.pointToX = ptx;
                _this.pointToY = pty;

                if (ptx != _this.previousX || pty != _this.previousY) {
                    _this.previousX = ptx;
                    _this.previousY = pty;
                    if (_this.cornerRadius === 0) {
                        _this.draw();
                    } else {
                        var set = _this.set;
                        if (set) {
                            var bb = set.getBBox();

                            var x = ptx - bb.width / 2;
                            var y = pty - bb.height - 10;

                            if (x < _this.l) {
                                x = _this.l;
                            }
                            if (x > _this.r - bb.width) {
                                x = _this.r - bb.width;
                            }

                            if (y < _this.t) {
                                y = pty + 10;
                            }

                            set.translate(x, y);
                            var divStyle = _this.textDiv.style;
                            divStyle.left = x + _this.horizontalPadding + "px";
                            divStyle.top = y + _this.verticalPadding + "px";
                        }
                    }
                }
            }
        },

        changeColor: function(color) {
            this.balloonColor = color;
        },

        setBounds: function(l, t, r, b) {
            var _this = this;
            _this.l = l;
            _this.t = t;
            _this.r = r;
            _this.b = b;
            if (_this.destroyTO) {
                clearTimeout(_this.destroyTO);
            }
        },

        showBalloon: function(value) {
            var _this = this;
            if (_this.text != value || _this.positionChanged) {
                _this.text = value;
                _this.isHiding = false;
                _this.show = true;

                if (_this.destroyTO) {
                    clearTimeout(_this.destroyTO);
                }
                var chart = _this.chart;

                if (_this.fadeAnim1) {
                    chart.stopAnim(_this.fadeAnim1);
                }

                if (_this.fadeAnim2) {
                    chart.stopAnim(_this.fadeAnim2);
                }

                _this.draw();
                _this.positionChanged = false;
            }
        },

        hide: function(fadeOutDuration) {
            var _this = this;
            _this.text = undefined;
            if (isNaN(fadeOutDuration)) {
                fadeOutDuration = _this.fadeOutDuration;
            }

            var chart = _this.chart;
            if (fadeOutDuration > 0 && !_this.isHiding) {
                _this.isHiding = true;
                if (_this.destroyTO) {
                    clearTimeout(_this.destroyTO);
                }

                _this.destroyTO = setTimeout(function() {
                    _this.destroy.call(_this);
                }, fadeOutDuration * 1000);

                _this.follow = false;
                _this.show = false;
                var set = _this.set;

                if (set) {
                    set.setAttr("opacity", _this.fillAlpha);
                    _this.fadeAnim1 = set.animate({
                        opacity: 0
                    }, fadeOutDuration, "easeInSine");
                }

                if (_this.textDiv) {
                    _this.fadeAnim2 = chart.animate({
                        node: _this.textDiv
                    }, "opacity", 1, 0, fadeOutDuration, "easeInSine", "");
                }
            } else {
                _this.show = false;
                _this.follow = false;
                _this.destroy();
            }
        },


        setPosition: function(x, y) {
            var _this = this;
            if (x != _this.pointToX || y != _this.pointToY) {
                _this.previousX = _this.pointToX;
                _this.previousY = _this.pointToY;

                _this.pointToX = x;
                _this.pointToY = y;
                _this.positionChanged = true;
            }
        },

        followCursor: function(value) {
            var _this = this;
            _this.follow = value;

            clearInterval(_this.interval);

            var mouseX = _this.chart.mouseX - _this.sdx;
            var mouseY = _this.chart.mouseY - _this.sdy;

            if (!isNaN(mouseX)) {
                if (value) {
                    _this.pointToX = mouseX - (_this.offsetX * _this.deltaSignX);
                    _this.pointToY = mouseY;

                    _this.followMouse();
                    _this.interval = setInterval(function() {
                        _this.followMouse.call(_this);
                    }, 40);
                }
            }
        },

        removeDiv: function() {
            var _this = this;
            if (_this.textDiv) {
                var parent = _this.textDiv.parentNode;
                if (parent) {
                    parent.removeChild(_this.textDiv);
                }
            }
        },

        destroy: function() {
            var _this = this;
            clearInterval(_this.interval);
            AmCharts.remove(_this.set);
            _this.removeDiv();
            _this.set = null;
        }
    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.AmCoordinateChart = AmCharts.Class({

        inherits: AmCharts.AmChart,

        construct: function(theme) {
            var _this = this;
            AmCharts.AmCoordinateChart.base.construct.call(_this, theme);
            _this.theme = theme;
            _this.createEvents("rollOverGraphItem", "rollOutGraphItem", "clickGraphItem", "doubleClickGraphItem", "rightClickGraphItem", "clickGraph", "rollOverGraph", "rollOutGraph");
            _this.startAlpha = 1;
            _this.startDuration = 0;
            _this.startEffect = "elastic";
            _this.sequencedAnimation = true;
            _this.colors = ["#FF6600", "#FCD202", "#B0DE09", "#0D8ECF", "#2A0CD0", "#CD0D74", "#CC0000", "#00CC00", "#0000CC", "#DDDDDD", "#999999", "#333333", "#990000"];
            _this.balloonDateFormat = "MMM DD, YYYY";
            _this.valueAxes = [];
            _this.graphs = [];
            _this.guides = [];
            _this.gridAboveGraphs = false;

            AmCharts.applyTheme(_this, theme, "AmCoordinateChart");
        },

        initChart: function() {
            var _this = this;
            AmCharts.AmCoordinateChart.base.initChart.call(_this);

            _this.drawGraphs = true;

            var categoryAxis = _this.categoryAxis;
            if (categoryAxis) {
                _this.categoryAxis = AmCharts.processObject(categoryAxis, AmCharts.CategoryAxis, _this.theme);
            }

            _this.processValueAxes();

            _this.createValueAxes();

            _this.processGraphs();

            _this.processGuides();

            if (AmCharts.VML) {
                _this.startAlpha = 1;
            }
            _this.setLegendData(_this.graphs);

            if (_this.gridAboveGraphs) {
                _this.gridSet.toFront();
                _this.bulletSet.toFront();
                _this.balloonsSet.toFront();
            }
        },


        createValueAxes: function() {
            var _this = this;
            if (_this.valueAxes.length === 0) {
                var valueAxis = new AmCharts.ValueAxis();
                _this.addValueAxis(valueAxis);
            }
        },


        parseData: function() {
            var _this = this;
            _this.processValueAxes();
            _this.processGraphs();
        },

        parseSerialData: function(dataProvider) {
            var _this = this;

            _this.chartData = [];

            if (dataProvider) {
                if (_this.processTimeout > 0) {

                    if (_this.processCount < 1) {
                        _this.processCount = 1;
                    }

                    var count = dataProvider.length / _this.processCount;
                    _this.parseCount = Math.ceil(count) - 1;
                    for (var i = 0; i < count; i++) {
                        _this.delayParseSerialData(dataProvider, i);
                    }
                } else {
                    _this.parseCount = 0;
                    _this.parsePartSerialData(dataProvider, 0, dataProvider.length, 0);
                }
            } else {
                _this.onDataUpdated();
            }
        },

        delayParseSerialData: function(dataProvider, index) {
            var _this = this;
            var processCount = _this.processCount;

            setTimeout(function() {
                _this.parsePartSerialData.call(_this, dataProvider, index * processCount, (index + 1) * processCount, index);
            }, _this.processTimeout);
        },


        parsePartSerialData: function(dataProvider, start, end, index) {
            var _this = this;

            if (end > dataProvider.length) {
                end = dataProvider.length;
            }

            var graphs = _this.graphs;
            var graph;
            var emptyObj = {};
            var seriesIdField = _this.seriesIdField;
            if (!seriesIdField) {
                seriesIdField = _this.categoryField;
            }

            var parseDates = false;
            var categoryFunction;
            var categoryAxis = _this.categoryAxis;
            var forceShowField;
            var labelColorField;
            var classNameField;

            if (categoryAxis) {
                parseDates = categoryAxis.parseDates;
                forceShowField = categoryAxis.forceShowField;
                classNameField = categoryAxis.classNameField;
                labelColorField = categoryAxis.labelColorField;
                categoryFunction = categoryAxis.categoryFunction;
            }

            var periodObj;
            var cleanPeriod;
            var periodCount;
            var previousTime = {};
            var periodDuration;

            if (parseDates) {
                periodObj = AmCharts.extractPeriod(categoryAxis.minPeriod);
                cleanPeriod = periodObj.period;
                periodCount = periodObj.count;
                periodDuration = AmCharts.getPeriodDuration(cleanPeriod, periodCount);
            }

            var lookupTable = {};
            _this.lookupTable = lookupTable;

            var i;
            var dataDateFormat = _this.dataDateFormat;
            var previousDataItem = {};


            for (i = start; i < end; i++) {
                var serialDataItem = {};
                var dataItemRaw = dataProvider[i];
                var value = dataItemRaw[_this.categoryField];
                serialDataItem.dataContext = dataItemRaw;

                if (categoryFunction) {
                    serialDataItem.category = categoryFunction(value, dataItemRaw, categoryAxis);
                } else {
                    serialDataItem.category = String(value);
                }

                if (forceShowField) {
                    serialDataItem.forceShow = dataItemRaw[forceShowField];
                }

                if (classNameField) {
                    serialDataItem.className = dataItemRaw[classNameField];
                }

                if (labelColorField) {
                    serialDataItem.labelColor = dataItemRaw[labelColorField];
                }

                var seriesId = dataItemRaw[seriesIdField];
                lookupTable[seriesId] = serialDataItem;

                if (parseDates) {

                    if (categoryAxis.categoryFunction) {
                        value = categoryAxis.categoryFunction(value, dataItemRaw, categoryAxis);
                    } else {
                        if (dataDateFormat && !(value instanceof Date)) {
                            value = value.toString() + " |";
                        }
                        value = AmCharts.getDate(value, dataDateFormat, categoryAxis.minPeriod);
                    }

                    value = AmCharts.resetDateToMin(value, cleanPeriod, periodCount, categoryAxis.firstDayOfWeek);

                    serialDataItem.category = value;
                    serialDataItem.time = value.getTime();

                    if (isNaN(serialDataItem.time)) {
                        continue;
                    }
                }

                var valueAxes = _this.valueAxes;
                serialDataItem.axes = {};
                serialDataItem.x = {};
                var j;
                for (j = 0; j < valueAxes.length; j++) {
                    var axisId = valueAxes[j].id;

                    serialDataItem.axes[axisId] = {};
                    serialDataItem.axes[axisId].graphs = {};
                    var k;
                    for (k = 0; k < graphs.length; k++) {
                        graph = graphs[k];
                        var graphId = graph.id;

                        var gapPeriod = 1.1;
                        if (!isNaN(graph.gapPeriod)) {
                            gapPeriod = graph.gapPeriod;
                        }

                        var periodValue = graph.periodValue;

                        if (graph.valueAxis.id == axisId) {
                            serialDataItem.axes[axisId].graphs[graphId] = {};

                            var graphDataItem = {};
                            graphDataItem.index = i;

                            var rawItem = dataItemRaw;
                            if (graph.dataProvider) {
                                rawItem = emptyObj;
                            }

                            graphDataItem.values = _this.processValues(rawItem, graph, periodValue);

                            if (!graph.connect) {
                                if (previousDataItem) {
                                    if (previousDataItem[graphId]) {
                                        if (gapPeriod > 0) {
                                            if (serialDataItem.time - previousTime[graphId] >= periodDuration * gapPeriod) {
                                                previousDataItem[graphId].gap = true;
                                            }
                                        }
                                    }
                                }
                            }

                            _this.processFields(graph, graphDataItem, rawItem);

                            graphDataItem.category = serialDataItem.category;
                            graphDataItem.serialDataItem = serialDataItem;
                            graphDataItem.graph = graph;
                            serialDataItem.axes[axisId].graphs[graphId] = graphDataItem;

                            previousTime[graphId] = serialDataItem.time;
                            previousDataItem[graphId] = graphDataItem;
                        }
                    }                    
                }
                _this.chartData[i] = serialDataItem;
            }

            if (_this.parseCount == index) {
                var g;
                for (g = 0; g < graphs.length; g++) {
                    graph = graphs[g];
                    if (graph.dataProvider) {
                        _this.parseGraphData(graph);
                    }
                }

                _this.dataChanged = false;
                _this.dispatchDataUpdated = true;
                _this.onDataUpdated();
            }
        },


        processValues: function(dataItemRaw, graph, periodValue) {
            var values = {};
            var val;
            var candle = false;
            if ((graph.type == "candlestick" || graph.type == "ohlc") && periodValue !== "") {
                candle = true;
            }

            var fieldNames = ["value", "error", "open", "close", "low", "high"];

            for (var i = 0; i < fieldNames.length; i++) {
                var f = fieldNames[i];
                if (f != "value" && f != "error") {
                    if (candle) {
                        periodValue = f.charAt(0).toUpperCase() + f.slice(1);
                    }
                }
                var rawValue = dataItemRaw[graph[f + "Field"] + periodValue];

                if (rawValue !== null) {
                    val = Number(rawValue);
                    if (!isNaN(val)) {
                        values[f] = val;
                    }

                    if (graph.valueAxis.type == "date") {
                        if (rawValue !== undefined) {
                            var date = AmCharts.getDate(rawValue, graph.chart.dataDateFormat);
                            values[f] = date.getTime();
                        }
                    }
                }
            }

            return values;
        },


        parseGraphData: function(graph) {
            var _this = this;
            var dataProvider = graph.dataProvider;
            var categoryField = graph.categoryField;
            if (!categoryField) {
                categoryField = _this.categoryField;
            }

            var seriesIdField = graph.seriesIdField;
            if (!seriesIdField) {
                seriesIdField = _this.seriesIdField;
            }
            if (!seriesIdField) {
                seriesIdField = _this.categoryField;
            }
            var i;
            for (i = 0; i < dataProvider.length; i++) {
                var dataItemRaw = dataProvider[i];
                var seriesId = String(dataItemRaw[seriesIdField]);
                var serialDataItem = _this.lookupTable[seriesId];
                var axisId = graph.valueAxis.id;

                if (serialDataItem) {
                    var graphDataItem = serialDataItem.axes[axisId].graphs[graph.id];
                    graphDataItem.serialDataItem = serialDataItem;
                    var periodValue = graph.periodValue;
                    graphDataItem.values = _this.processValues(dataItemRaw, graph, periodValue);
                    _this.processFields(graph, graphDataItem, dataItemRaw);
                }
            }
        },


        addValueAxis: function(axis) {
            var _this = this;
            axis.chart = this;
            _this.valueAxes.push(axis);
            _this.validateData();
        },

        removeValueAxesAndGraphs: function() {
            var _this = this;
            var valueAxes = _this.valueAxes;
            var i;
            for (i = valueAxes.length - 1; i > -1; i--) {
                _this.removeValueAxis(valueAxes[i]);
            }
        },

        removeValueAxis: function(valueAxis) {
            var _this = this;
            var graphs = _this.graphs;
            var i;

            for (i = graphs.length - 1; i >= 0; i--) {
                var graph = graphs[i];
                if (graph) {
                    if (graph.valueAxis == valueAxis) {
                        _this.removeGraph(graph);
                    }
                }
            }

            var valueAxes = _this.valueAxes;

            for (i = valueAxes.length - 1; i >= 0; i--) {
                if (valueAxes[i] == valueAxis) {
                    valueAxes.splice(i, 1);
                }
            }
            _this.validateData();
        },

        addGraph: function(graph) {
            var _this = this;
            _this.graphs.push(graph);
            _this.chooseGraphColor(graph, _this.graphs.length - 1);
            _this.validateData();
        },

        removeGraph: function(graph) {
            var _this = this;
            var graphs = _this.graphs;
            var i;
            for (i = graphs.length - 1; i >= 0; i--) {
                if (graphs[i] == graph) {
                    graphs.splice(i, 1);
                    graph.destroy();
                }
            }
            _this.validateData();
        },

        handleValueAxisZoom: function() {

        },

        processValueAxes: function() {
            var _this = this;
            var valueAxes = _this.valueAxes;
            var i;

            for (i = 0; i < valueAxes.length; i++) {
                var valueAxis = valueAxes[i];
                valueAxis = AmCharts.processObject(valueAxis, AmCharts.ValueAxis, _this.theme);
                valueAxes[i] = valueAxis;
                valueAxis.chart = this;
                valueAxis.init();

                _this.listenTo(valueAxis, "axisIntZoomed", _this.handleValueAxisZoom);

                if (!valueAxis.id) {
                    valueAxis.id = "valueAxisAuto" + i + "_" + new Date().getTime();
                }
                if (valueAxis.usePrefixes === undefined) {
                    valueAxis.usePrefixes = _this.usePrefixes;
                }
            }
        },

        processGuides: function() {
            var _this = this;
            var guides = _this.guides;
            var categoryAxis = _this.categoryAxis;

            if (guides) {

                for (var i = 0; i < guides.length; i++) {
                    var guide = guides[i];
                    if (guide.category !== undefined || guide.date !== undefined) {
                        if (categoryAxis) {
                            categoryAxis.addGuide(guide);
                        }
                    }

                    if (!guide.id) {
                        guide.id = "guideAuto" + i + "_" + new Date().getTime();
                    }

                    var valueAxis = guide.valueAxis;
                    if (valueAxis) {
                        if (AmCharts.isString(valueAxis)) {
                            valueAxis = _this.getValueAxisById(valueAxis);
                        }
                        if (valueAxis) {
                            valueAxis.addGuide(guide);
                        } else {
                            _this.valueAxes[0].addGuide(guide);
                        }
                    } else if (!isNaN(guide.value)) {
                        _this.valueAxes[0].addGuide(guide);
                    }
                }
            }
        },

        processGraphs: function() {
            var _this = this;
            var graphs = _this.graphs;
            var i;
            _this.graphsById = {};
            for (i = 0; i < graphs.length; i++) {
                var graph = graphs[i];

                graph = AmCharts.processObject(graph, AmCharts.AmGraph, _this.theme);
                graphs[i] = graph;

                _this.chooseGraphColor(graph, i);

                graph.chart = this;

                graph.init();

                if (AmCharts.isString(graph.valueAxis)) {
                    graph.valueAxis = _this.getValueAxisById(graph.valueAxis);
                }

                if (!graph.valueAxis) {
                    graph.valueAxis = _this.valueAxes[0];
                }

                if (!graph.id) {
                    graph.id = "graphAuto" + i + "_" + new Date().getTime();
                }

                _this.graphsById[graph.id] = graph;
            }
        },

        formatString: function(text, dItem, noFixBrakes) {
            var graph = dItem.graph;

            // format duration
            var valAxis = graph.valueAxis;
            if (valAxis.duration) {
                if (dItem.values.value) {
                    var duration = AmCharts.formatDuration(dItem.values.value, valAxis.duration, "", valAxis.durationUnits, valAxis.maxInterval, valAxis.numberFormatter);
                    text = text.split("[[value]]").join(duration);
                }
            }

            text = AmCharts.massReplace(text, {
                "[[title]]": graph.title,
                "[[description]]": dItem.description
            });
            if (!noFixBrakes) {
                text = AmCharts.fixBrakes(text);
            } else {
                // balloon
                text = AmCharts.fixNewLines(text);
            }
            text = AmCharts.cleanFromEmpty(text);

            return text;
        },


        getBalloonColor: function(graph, graphDataItem, graphIsPriority) {
            var color = graph.lineColor;
            var balloonColor = graph.balloonColor;

            if (graphIsPriority) {
                balloonColor = color;
            }

            var fillColors = graph.fillColorsR;
            var UNDEFINED;

            if (typeof(fillColors) == "object") {
                color = fillColors[0];
            } else if (fillColors !== UNDEFINED) {
                color = fillColors;
            }

            if (graphDataItem.isNegative) {
                var negativeColor = graph.negativeLineColor;
                var negativeFillColors = graph.negativeFillColors;
                if (typeof(negativeFillColors) == "object") {
                    negativeColor = negativeFillColors[0];
                } else if (negativeFillColors !== UNDEFINED) {
                    negativeColor = negativeFillColors;
                }

                if (negativeColor !== UNDEFINED) {
                    color = negativeColor;
                }
            }

            if (graphDataItem.color !== UNDEFINED) {
                color = graphDataItem.color;
            }

            if (graphDataItem.lineColor !== UNDEFINED) {
                color = graphDataItem.lineColor;
            }

            var itemFillColors = graphDataItem.fillColors;
            if (itemFillColors !== UNDEFINED) {
                color = itemFillColors;
                if (AmCharts.ifArray(itemFillColors)) {
                    color = itemFillColors[0];
                }
            }

            if (balloonColor === UNDEFINED) {
                balloonColor = color;
            }
            return balloonColor;
        },

        getGraphById: function(id) {
            return AmCharts.getObjById(this.graphs, id);
        },

        getValueAxisById: function(id) {
            return AmCharts.getObjById(this.valueAxes, id);
        },

        processFields: function(graph, graphDataItem, dataItemRaw) {
            if (graph.itemColors) {
                var itemColors = graph.itemColors;
                var index = graphDataItem.index;

                if (index < itemColors.length) {
                    graphDataItem.color = itemColors[index];
                } else {
                    graphDataItem.color = AmCharts.randomColor();
                }
            }

            var fields = ["lineColor", "color", "alpha", "fillColors", "description", "bullet", "customBullet", "bulletSize", "bulletConfig", "url", "labelColor", "dashLength", "pattern", "gap", "className", "columnIndex"];
            var i;
            for (i = 0; i < fields.length; i++) {
                var field = fields[i];
                var fieldName = graph[field + "Field"];

                if (fieldName) {
                    var val = dataItemRaw[fieldName];
                    if (AmCharts.isDefined(val)) {
                        graphDataItem[field] = val;
                    }
                }
            }
            graphDataItem.dataContext = dataItemRaw;
        },

        chooseGraphColor: function(graph, index) {

            var _this = this;
            if (!graph.lineColor) {
                var color;
                if (_this.colors.length > index) {
                    color = _this.colors[index];
                } else {
                    if (graph.lineColorR) {
                        color = graph.lineColorR;
                    } else {
                        color = AmCharts.randomColor();
                    }
                }

                graph.lineColorR = color;
            } else {
                graph.lineColorR = graph.lineColor;
            }
            if (!graph.fillColors) {
                graph.fillColorsR = graph.lineColorR;
            } else {
                graph.fillColorsR = graph.fillColors;
            }
            if (!graph.bulletBorderColor) {
                if (graph.useLineColorForBulletBorder) {
                    graph.bulletBorderColorR = graph.lineColorR;
                } else {
                    graph.bulletBorderColorR = graph.bulletColor;
                }
            } else {
                graph.bulletBorderColorR = graph.bulletBorderColor;
            }

            if (!graph.bulletColor) {
                graph.bulletColorR = graph.lineColorR;
            } else {
                graph.bulletColorR = graph.bulletColor;
            }

            var patterns = _this.patterns;
            if (patterns) {
                graph.pattern = patterns[index];
            }
        },

        handleLegendEvent: function(event) {
            var _this = this;
            var type = event.type;
            var dataItem = event.dataItem;
            //if (!_this.legend.data) {
                if (dataItem) {
                    var hidden = dataItem.hidden;
                    var showBalloon = dataItem.showBalloon;

                    switch (type) {
                        case "clickMarker":
                            if (_this.textClickEnabled) {
                                if (showBalloon) {
                                    _this.hideGraphsBalloon(dataItem);
                                } else {
                                    _this.showGraphsBalloon(dataItem);
                                }
                            }
                            break;
                        case "clickLabel":

                            if (showBalloon) {
                                _this.hideGraphsBalloon(dataItem);
                            } else {
                                _this.showGraphsBalloon(dataItem);
                            }
                            break;

                        case "rollOverItem":
                            if (!hidden) {
                                _this.highlightGraph(dataItem);
                            }
                            break;

                        case "rollOutItem":
                            if (!hidden) {
                                _this.unhighlightGraph();
                            }
                            break;

                        case "hideItem":
                            _this.hideGraph(dataItem);
                            break;

                        case "showItem":
                            _this.showGraph(dataItem);
                            break;
                    }
                //}
            }
        },


        highlightGraph: function(thisGraph) {
            var _this = this;
            var graphs = _this.graphs;
            if(graphs){
                var i;
                var alpha = 0.2;

                if (_this.legend) {
                    alpha = _this.legend.rollOverGraphAlpha;
                }

                if (alpha != 1) {
                    for (i = 0; i < graphs.length; i++) {
                        var graph = graphs[i];
                        if (graph != thisGraph) {
                            graph.changeOpacity(alpha);
                        }
                    }
                }
            }
        },

        unhighlightGraph: function() {
            var _this = this;
            var alpha;

            if (_this.legend) {
                alpha = _this.legend.rollOverGraphAlpha;
            }

            if (alpha != 1) {
                var graphs = _this.graphs;
                var i;
                for (i = 0; i < graphs.length; i++) {
                    var graph = graphs[i];
                    graph.changeOpacity(1);
                }
            }
        },

        showGraph: function(graph) {
            var _this = this;
            if (graph.switchable) {
                graph.hidden = false;
                _this.dataChanged = true;
                if (_this.type != "xy") {
                    _this.marginsUpdated = false;
                }
                if (_this.chartCreated) {
                    _this.initChart();
                }
            }
        },

        hideGraph: function(graph) {
            var _this = this;
            if (graph.switchable) {
                _this.dataChanged = true;
                if (_this.type != "xy") {
                    _this.marginsUpdated = false;
                }
                graph.hidden = true;
                if (_this.chartCreated) {
                    _this.initChart();
                }
            }
        },

        hideGraphsBalloon: function(graph) {
            var _this = this;
            graph.showBalloon = false;
            _this.updateLegend();
        },

        showGraphsBalloon: function(graph) {
            var _this = this;
            graph.showBalloon = true;
            _this.updateLegend();
        },

        updateLegend: function() {
            var _this = this;
            if (_this.legend) {
                _this.legend.invalidateSize();
            }
        },

        resetAnimation: function() {
            var _this = this;
            var graphs = _this.graphs;
            if (graphs) {
                var i;
                for (i = 0; i < graphs.length; i++) {
                    graphs[i].animationPlayed = false;
                }
            }
        },

        animateAgain: function() {
            var _this = this;
            _this.resetAnimation();
            _this.validateNow();
        }

    });

})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.TrendLine = AmCharts.Class({

        construct: function(theme) {
            var _this = this;
            _this.cname = "TrendLine";
            _this.createEvents("click");
            _this.isProtected = false;
            _this.dashLength = 0;
            _this.lineColor = "#00CC00";
            _this.lineAlpha = 1;
            _this.lineThickness = 1;
            //_this.finalImage;
            //_this.initialImage;
            AmCharts.applyTheme(_this, theme, _this.cname);
        },

        draw: function() {
            var _this = this;
            _this.destroy();
            var chart = _this.chart;
            var container = chart.container;

            var x1;
            var x2;
            var y1;
            var y2;

            var categoryAxis = _this.categoryAxis;
            var initialDate = _this.initialDate;
            var initialCategory = _this.initialCategory;
            var finalDate = _this.finalDate;
            var finalCategory = _this.finalCategory;
            var valueAxis = _this.valueAxis;
            var valueAxisX = _this.valueAxisX;
            var initialXValue = _this.initialXValue;
            var finalXValue = _this.finalXValue;
            var initialValue = _this.initialValue;
            var finalValue = _this.finalValue;

            var recalculateToPercents = valueAxis.recalculateToPercents;
            var dataDateFormat = chart.dataDateFormat;

            if (categoryAxis) {
                if (initialDate) {
                    initialDate = AmCharts.getDate(initialDate, dataDateFormat, "fff");
                    _this.initialDate = initialDate;
                    x1 = categoryAxis.dateToCoordinate(initialDate);
                }
                if (initialCategory) {
                    x1 = categoryAxis.categoryToCoordinate(initialCategory);
                }
                if (finalDate) {
                    finalDate = AmCharts.getDate(finalDate, dataDateFormat, "fff");
                    _this.finalDate = finalDate;
                    x2 = categoryAxis.dateToCoordinate(finalDate);
                }
                if (finalCategory) {
                    x2 = categoryAxis.categoryToCoordinate(finalCategory);
                }
            }

            if (valueAxisX) {
                if (!recalculateToPercents) {
                    if (!isNaN(initialXValue)) {
                        x1 = valueAxisX.getCoordinate(initialXValue);
                    }
                    if (!isNaN(finalXValue)) {
                        x2 = valueAxisX.getCoordinate(finalXValue);
                    }
                }
            }

            if (valueAxis) {
                if (!recalculateToPercents) {
                    if (!isNaN(initialValue)) {
                        y1 = valueAxis.getCoordinate(initialValue);
                    }
                    if (!isNaN(finalValue)) {
                        y2 = valueAxis.getCoordinate(finalValue);
                    }
                }
            }

            if (!isNaN(x1) && !isNaN(x2) && !isNaN(y1) && !isNaN(y1)) {
                var rotate = chart.rotate;
                var xa;
                var ya;

                if (rotate) {
                    xa = [y1, y2];
                    ya = [x1, x2];
                } else {
                    xa = [x1, x2];
                    ya = [y1, y2];
                }

                var lineColor = _this.lineColor;
                var line = AmCharts.line(container, xa, ya, lineColor, _this.lineAlpha, _this.lineThickness, _this.dashLength);

                var xArray = xa;
                var yArray = ya;

                var a = (xa[1] - xa[0]);
                var b = (ya[1] - ya[0]);
                if (a === 0) {
                    a = 0.01;
                }

                if (b === 0) {
                    b = 0.01;
                }

                var signX = a / Math.abs(a);
                var signY = b / Math.abs(b);

                var sign = (a * b) / Math.abs(a * b);

                var c = sign * Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

                var delta = 5;

                var angle1 = Math.asin(a / c);
                var angle2 = 90 * Math.PI / 180 - angle1;

                var dy = Math.abs(Math.cos(angle2) * delta);
                var dx = Math.abs(Math.sin(angle2) * delta);


                xArray.push(xa[1] - signX * dx, xa[0] - signX * dx);
                yArray.push(ya[1] + signY * dy, ya[0] + signY * dy);

                var hoverLine = AmCharts.polygon(container, xArray, yArray, lineColor, 0.005, 0);

                var set = container.set([hoverLine, line]);
                set.translate(chart.marginLeftReal, chart.marginTopReal);
                chart.trendLinesSet.push(set);

                AmCharts.setCN(chart, line, "trend-line");
                AmCharts.setCN(chart, line, "trend-line-" + _this.id);

                _this.line = line;
                _this.set = set;

                var initialImage = _this.initialImage;
                if (initialImage) {
                    initialImage = AmCharts.processObject(initialImage, AmCharts.Image, _this.theme);
                    initialImage.chart = chart;
                    initialImage.draw();
                    initialImage.translate(xArray[0] + initialImage.offsetX, yArray[0] + initialImage.offsetY);
                    set.push(initialImage.set);
                }

                var finalImage = _this.finalImage;
                if (finalImage) {
                    finalImage = AmCharts.processObject(finalImage, AmCharts.Image, _this.theme);
                    finalImage.chart = chart;
                    finalImage.draw();
                    finalImage.translate(xArray[1] + finalImage.offsetX, yArray[1] + finalImage.offsetY);
                    set.push(finalImage.set);
                }

                hoverLine.mouseup(function() {
                    _this.handleLineClick();
                }).mouseover(function() {
                    _this.handleLineOver();
                }).mouseout(function() {
                    _this.handleLineOut();
                });

                if (hoverLine.touchend) {
                    hoverLine.touchend(function() {
                        _this.handleLineClick();
                    });
                }

                set.clipRect(0, 0, chart.plotAreaWidth, chart.plotAreaHeight);
            }
        },

        handleLineClick: function() {
            var _this = this;
            var event = {
                type: "click",
                trendLine: this,
                chart: _this.chart
            };
            _this.fire(event);
        },

        handleLineOver: function() {
            var _this = this;
            var rollOverColor = _this.rollOverColor;

            if (rollOverColor !== undefined) {
                _this.line.attr({
                    stroke: rollOverColor
                });
            }
            if (_this.balloonText) {
                clearTimeout(_this.chart.hoverInt);
                var bbox = _this.line.getBBox();
                var x = _this.x + bbox.x + bbox.width / 2;
                var y = _this.y + bbox.y + bbox.height / 2;
                _this.chart.showBalloon(_this.balloonText, _this.lineColor, true, x, y);
            }
        },

        handleLineOut: function() {
            var _this = this;
            _this.line.attr({
                stroke: _this.lineColor
            });
            if (_this.balloonText) {
                _this.chart.hideBalloon();
            }
        },

        destroy: function() {
            AmCharts.remove(this.set);
        }
    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.Image = AmCharts.Class({

        construct: function(theme) {
            var _this = this;
            _this.cname = "Image";
            _this.width = 20;
            _this.height = 20;
            _this.offsetX = 0;
            _this.offsetY = 0;
            _this.rotation = 0;
            _this.color = "#000000";
            _this.balloonColor = "#000000";

            _this.opacity = 1;

            AmCharts.applyTheme(_this, theme, _this.cname);
        },

        draw: function() {
            var _this = this;
            if (_this.set) {
                _this.set.remove();
            }

            var container = _this.chart.container;
            _this.set = container.set();

            var sprite;
            var scale;

            if (_this.url) {
                sprite = container.image(_this.url, 0, 0, _this.width, _this.height);
                scale = 1;
            } else if (_this.svgPath) {
                sprite = container.path(_this.svgPath);
                sprite.setAttr("fill", _this.color);
                sprite.setAttr("stroke", _this.outlineColor);

                var bbox = sprite.getBBox();
                var w = bbox.width;
                var h = bbox.height;

                scale = Math.min(_this.width / w, _this.height / h);
            }
            if (sprite) {
                sprite.setAttr("opacity", _this.opacity);
                _this.set.rotate(_this.rotation);
                sprite.translate(-_this.width / 2, -_this.height / 2, scale);

                if (_this.balloonText) {
                    sprite.mouseover(function() {
                        _this.chart.showBalloon(_this.balloonText, _this.balloonColor, true);
                    }).mouseout(function() {
                        _this.chart.hideBalloon();
                    }).touchend(function() {
                        _this.chart.hideBalloon();
                    }).touchstart(function() {
                        _this.chart.showBalloon(_this.balloonText, _this.balloonColor, true);
                    });
                }

                _this.set.push(sprite);
            }
        },

        translate: function(x, y) {
            var _this = this;
            if (_this.set) {
                _this.set.translate(x, y);
            }
        }
    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;



    AmCharts.circle = function(container, r, color, alpha, bwidth, bcolor, balpha, bubble, ry) {
        var UNDEFINED;
        if (r <= 0) {
            r = 0.001;
        }
        if (bwidth == UNDEFINED || bwidth === 0) {
            bwidth = 0.01;
        }
        if (bcolor === UNDEFINED) {
            bcolor = "#000000";
        }
        if (balpha === UNDEFINED) {
            balpha = 0;
        }

        var attr = {
            "fill": color,
            "stroke": bcolor,
            "fill-opacity": alpha,
            "stroke-width": bwidth,
            "stroke-opacity": balpha
        };

        var circle;
        if (isNaN(ry)) {
            circle = container.circle(0, 0, r).attr(attr);
        } else {
            circle = container.ellipse(0, 0, r, ry).attr(attr);
        }

        if (bubble) {
            circle.gradient("radialGradient", [color, AmCharts.adjustLuminosity(color, -0.6)]);
        }

        return circle;
    };

    AmCharts.text = function(container, text, color, fontFamily, fontSize, anchor, bold, alpha) {
        if (!anchor) {
            anchor = "middle";
        }
        if (anchor == "right") {
            anchor = "end";
        }
        if (anchor == "left") {
            anchor = "start";
        }
        if (isNaN(alpha)) {
            alpha = 1;
        }

        if (text !== undefined) {
            text = String(text);
            if (AmCharts.isIE) {
                if (!AmCharts.isModern) {
                    text = text.replace("&amp;", "&");
                    text = text.replace("&", "&amp;");
                }
            }
        }

        var attr = {
            "fill": color,
            "font-family": fontFamily,
            "font-size": fontSize + "px",
            "opacity": alpha
        };

        if (bold === true) {
            attr["font-weight"] = "bold";
        }

        // last as size depends on previous
        attr["text-anchor"] = anchor;

        var txt = container.text(text, attr);

        return txt;
    };



    AmCharts.polygon = function(container, x, y, colors, alpha, bwidth, bcolor, balpha, gradientRotation, noRound, dashLength) {
        if (isNaN(bwidth)) {
            bwidth = 0.01;
        }

        if (isNaN(balpha)) {
            balpha = alpha;
        }
        var color = colors;
        var gradient = false;

        if (typeof(color) == "object") {
            if (color.length > 1) {
                gradient = true;
                color = color[0];
            }
        }

        if (bcolor === undefined) {
            bcolor = color;
        }
        var attr = {
            "fill": color,
            "stroke": bcolor,
            "fill-opacity": alpha,
            "stroke-width": bwidth,
            "stroke-opacity": balpha
        };

        if (dashLength !== undefined && dashLength > 0) {
            attr["stroke-dasharray"] = dashLength;
        }

        var dx = AmCharts.dx;
        var dy = AmCharts.dy;

        if (container.handDrawn) {
            var xy = AmCharts.makeHD(x, y, container.handDrawScatter);
            x = xy[0];
            y = xy[1];
        }

        var round = Math.round;
        if (noRound) {
            x[i] = AmCharts.roundTo(x[i], 5);
            y[i] = AmCharts.roundTo(y[i], 5);
            round = Number;
        }


        var str = "M" + (round(x[0]) + dx) + "," + (round(y[0]) + dy);

        for (var i = 1; i < x.length; i++) {
            if (noRound) {
                x[i] = AmCharts.roundTo(x[i], 5);
                y[i] = AmCharts.roundTo(y[i], 5);
            }

            str += " L" + (round(x[i]) + dx) + "," + (round(y[i]) + dy);
        }
        str += " Z";
        var p = container.path(str).attr(attr);

        if (gradient) {
            p.gradient("linearGradient", colors, gradientRotation);
        }

        return p;
    };


    AmCharts.rect = function(container, w, h, colors, alpha, bwidth, bcolor, balpha, cradius, gradientRotation, dashLength) {
        var UNDEFINED;
        if (isNaN(w) || isNaN(h)) {
            return container.set();
        }

        if (isNaN(bwidth)) {
            bwidth = 0;
        }
        if (cradius === UNDEFINED) {
            cradius = 0;
        }
        if (gradientRotation === UNDEFINED) {
            gradientRotation = 270;
        }
        if (isNaN(alpha)) {
            alpha = 0;
        }
        var color = colors;
        var gradient = false;
        if (typeof(color) == "object") {
            color = color[0];
            gradient = true;
        }
        if (bcolor === UNDEFINED) {
            bcolor = color;
        }
        if (balpha === UNDEFINED) {
            balpha = alpha;
        }

        w = Math.round(w);
        h = Math.round(h);

        var x = 0;
        var y = 0;

        if (w < 0) {
            w = Math.abs(w);
            x = -w;
        }

        if (h < 0) {
            h = Math.abs(h);
            y = -h;
        }

        x += AmCharts.dx;
        y += AmCharts.dy;

        var attr = {
            "fill": color,
            "stroke": bcolor,
            "fill-opacity": alpha,
            "stroke-opacity": balpha
        };

        if (dashLength !== undefined && dashLength > 0) {
            attr["stroke-dasharray"] = dashLength;
        }


        var r = container.rect(x, y, w, h, cradius, bwidth).attr(attr);

        if (gradient) {
            r.gradient("linearGradient", colors, gradientRotation);
        }

        return r;
    };


    AmCharts.bullet = function(container, bulletType, bulletSize, bc, ba, bbt, bbc, bba, originalSize, gradientRotation, pattern, path, dashLength) {
        var bullet;

        if (bulletType == "circle") {
            bulletType = "round";
        }

        switch (bulletType) {
            case "round":
                bullet = AmCharts.circle(container, bulletSize / 2, bc, ba, bbt, bbc, bba);
                break;
            case "square":
                bullet = AmCharts.polygon(container, [-bulletSize / 2, bulletSize / 2, bulletSize / 2, -bulletSize / 2], [bulletSize / 2, bulletSize / 2, -bulletSize / 2, -bulletSize / 2], bc, ba, bbt, bbc, bba, gradientRotation - 180, undefined, dashLength);
                break;
            case "rectangle":
                bullet = AmCharts.polygon(container, [-bulletSize, bulletSize, bulletSize, -bulletSize], [bulletSize / 2, bulletSize / 2, -bulletSize / 2, -bulletSize / 2], bc, ba, bbt, bbc, bba, gradientRotation - 180, undefined, dashLength);
                break;
            case "diamond":
                bullet = AmCharts.polygon(container, [-bulletSize / 2, 0, bulletSize / 2, 0], [0, -bulletSize / 2, 0, bulletSize / 2], bc, ba, bbt, bbc, bba);
                break;
            case "triangleUp":
                bullet = AmCharts.triangle(container, bulletSize, 0, bc, ba, bbt, bbc, bba);
                break;
            case "triangleDown":
                bullet = AmCharts.triangle(container, bulletSize, 180, bc, ba, bbt, bbc, bba);
                break;
            case "triangleLeft":
                bullet = AmCharts.triangle(container, bulletSize, 270, bc, ba, bbt, bbc, bba);
                break;
            case "triangleRight":
                bullet = AmCharts.triangle(container, bulletSize, 90, bc, ba, bbt, bbc, bba);
                break;
            case "bubble":
                bullet = AmCharts.circle(container, bulletSize / 2, bc, ba, bbt, bbc, bba, true);
                break;
            case "line":
                bullet = AmCharts.line(container, [-bulletSize / 2, bulletSize / 2], [0, 0], bc, ba, bbt, bbc, bba);
                break;
            case "yError":
                bullet = container.set();
                bullet.push(AmCharts.line(container, [0, 0], [-bulletSize / 2, bulletSize / 2], bc, ba, bbt));
                bullet.push(AmCharts.line(container, [-originalSize, originalSize], [-bulletSize / 2, -bulletSize / 2], bc, ba, bbt));
                bullet.push(AmCharts.line(container, [-originalSize, originalSize], [bulletSize / 2, bulletSize / 2], bc, ba, bbt));
                break;

            case "xError":
                bullet = container.set();
                bullet.push(AmCharts.line(container, [-bulletSize / 2, bulletSize / 2], [0, 0], bc, ba, bbt));
                bullet.push(AmCharts.line(container, [-bulletSize / 2, -bulletSize / 2], [-originalSize, originalSize], bc, ba, bbt));
                bullet.push(AmCharts.line(container, [bulletSize / 2, bulletSize / 2], [-originalSize, originalSize], bc, ba, bbt));
                break;
        }
        if (bullet) {
            bullet.pattern(pattern, NaN, path);
        }
        return bullet;
    };


    AmCharts.triangle = function(container, w, rotation, color, alpha, bwidth, bcolor, balpha) {
        var UNDEFINED;

        if (bwidth === UNDEFINED || bwidth === 0) {
            bwidth = 1;
        }
        if (bcolor === UNDEFINED) {
            bcolor = "#000";
        }
        if (balpha === UNDEFINED) {
            balpha = 0;
        }

        var attr = {
            "fill": color,
            "stroke": bcolor,
            "fill-opacity": alpha,
            "stroke-width": bwidth,
            "stroke-opacity": balpha
        };

        var half = w / 2;
        var path;
        var comma = ",";
        var l = " L";
        var m = " M";
        var z = " Z";

        if (rotation === 0) {
            path = m + (-half) + comma + half + l + 0 + comma + (-half) + l + half + comma + half + z;
        }
        if (rotation == 180) {
            path = m + (-half) + comma + (-half) + l + 0 + comma + half + l + half + comma + (-half) + z;
        }
        if (rotation == 90) {
            path = m + (-half) + comma + (-half) + l + half + comma + 0 + l + (-half) + comma + half + z;
        }
        if (rotation == 270) {
            path = m + (-half) + comma + 0 + l + half + comma + half + l + half + comma + (-half) + z;
        }

        var triangle = container.path(path).attr(attr);

        return triangle;
    };


    AmCharts.line = function(container, x, y, color, alpha, thickness, dashLength, smoothed, doFix, noRound, noHand) {

        var none = "none";

        if (container.handDrawn && !noHand) {
            return AmCharts.handDrawnLine(container, x, y, color, alpha, thickness, dashLength, smoothed, doFix, noRound, noHand);
        } else {
            var attr = {
                "fill": none,
                "stroke-width": thickness
            };

            if (dashLength !== undefined && dashLength > 0) {
                attr["stroke-dasharray"] = dashLength;
            }

            if (!isNaN(alpha)) {
                attr["stroke-opacity"] = alpha;
            }

            if (color) {
                attr.stroke = color;
            }

            var letter = "L";

            var round = Math.round;

            if (noRound) {
                round = Number;
                x[0] = AmCharts.roundTo(x[0], 5);
                y[0] = AmCharts.roundTo(y[0], 5);
            }

            var dx = AmCharts.dx;
            var dy = AmCharts.dy;
            var str = "M" + (round(x[0]) + dx) + "," + (round(y[0]) + dy);
            var i;
            for (i = 1; i < x.length; i++) {
                x[i] = AmCharts.roundTo(x[i], 5);
                y[i] = AmCharts.roundTo(y[i], 5);
                str += " " + letter + "" + (round(x[i]) + dx) + "," + (round(y[i]) + dy);
            }


            if (AmCharts.VML) {
                return container.path(str, undefined, true).attr(attr);
            } else {
                if (doFix) {
                    str += " M0,0 L0,0";
                }
                return container.path(str).attr(attr);
            }
        }
    };

    AmCharts.makeHD = function(x, y, scatter) {

        var stepSize = 50;

        var xa = [];
        var ya = [];

        for (var i = 1; i < x.length; i++) {

            var x0 = Number(x[i - 1]);
            var y0 = Number(y[i - 1]);
            var x1 = Number(x[i]);
            var y1 = Number(y[i]);

            var distance = Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2));
            var steps = Math.round(distance / stepSize) + 1;

            var stepX = (x1 - x0) / steps;
            var stepY = (y1 - y0) / steps;

            for (var s = 0; s <= steps; s++) {

                var xx = x0 + s * stepX + Math.random() * scatter;
                var yy = y0 + s * stepY + Math.random() * scatter;

                xa.push(xx);
                ya.push(yy);
            }
        }

        return [xa, ya];
    };


    AmCharts.handDrawnLine = function(container, x, y, color, alpha, thickness, dashLength, smoothed, doFix, noRound) {
        var i;
        var set = container.set();

        for (i = 1; i < x.length; i++) {

            var x0 = x[i - 1];
            var y0 = y[i - 1];
            var x1 = x[i];
            var y1 = y[i];

            var xa = [x0, x1];
            var ya = [y0, y1];

            var newXY = AmCharts.makeHD(xa, ya, container.handDrawScatter);
            xa = newXY[0];
            ya = newXY[1];

            for (var j = 1; j < xa.length; j++) {
                set.push(AmCharts.line(container, [xa[j - 1], xa[j]], [ya[j - 1], ya[j]], color, alpha, thickness + Math.random() * container.handDrawThickness - container.handDrawThickness / 2, dashLength, smoothed, doFix, noRound, true));
            }
        }

        return set;
    };

    AmCharts.doNothing = function(value) {
        return value;
    };

    AmCharts.drop = function(container, radius, angle, color, alpha, bwidth, bcolor, balpha) {
        var A = " A";
        var cs = "1000,1000";
        var comma = ",";
        var lf = 1;
        var sf = 1;
        var degToRad = 1 / 180 * Math.PI;
        var startAngle = angle - 20;
        var arc = 40;
        var bx = Math.sin(startAngle * degToRad) * radius;
        var by = Math.cos(startAngle * degToRad) * radius;

        var cx = Math.sin((startAngle + arc) * degToRad) * radius;
        var cy = Math.cos((startAngle + arc) * degToRad) * radius;

        var hradius = radius * 0.8;
        var h = -radius / 3;
        var w = radius / 3;

        if (angle === 0) {
            h = -h;
            w = 0;
        }

        if (angle == 180) {
            w = 0;
        }

        if (angle == 90) {
            h = 0;
        }

        if (angle == 270) {
            h = 0;
            w = -w;
        }

        var mx = Math.sin((startAngle + arc / 2) * degToRad) * radius + w;
        var my = Math.cos((startAngle + arc / 2) * degToRad) * radius + h;

        var attributes = {
            "fill": color,
            "stroke": bcolor,
            "stroke-width": bwidth,
            "stroke-opacity": balpha,
            "fill-opacity": alpha
        };

        var parc = "M" + bx + comma + by + A + radius + comma + radius + comma + 0 + comma + lf + comma + sf + comma + cx + comma + cy;
        parc += A + hradius + comma + hradius + comma + 0 + comma + 0 + comma + 0 + comma + mx + comma + my;
        parc += A + hradius + comma + hradius + comma + 0 + comma + 0 + comma + 0 + comma + bx + comma + by;
        return container.path(parc, undefined, undefined, cs).attr(attributes);
    };

    AmCharts.wedge = function(container, x, y, startAngle, arc, radius, yRadius, innerRadius, h, attributes, gradientRatio, pattern, globalPath, gradientType) {
        var round = Math.round;

        radius = round(radius);
        yRadius = round(yRadius);

        innerRadius = round(innerRadius);
        var yInnerRadius = round((yRadius / radius) * innerRadius);

        var vml = AmCharts.VML;

        // FAILS IF BIGGER, and the smaller radius, the bigger corection
        var edge = 359.5 + radius / 100;
        if (edge > 359.94) {
            edge = 359.94;
        }

        if (arc >= edge) {
            arc = edge;
        }

        /* to understand what each letter means
     c-----------b
      \          /
       \        /
        \      /
         d----a
          \  /
           \/
           x
    */

        var degToRad = 1 / 180 * Math.PI;
        var ax = x + Math.sin(startAngle * degToRad) * innerRadius;
        var ay = y - Math.cos(startAngle * degToRad) * yInnerRadius;

        var bx = x + Math.sin(startAngle * degToRad) * radius;
        var by = y - Math.cos(startAngle * degToRad) * yRadius;

        var cx = x + Math.sin((startAngle + arc) * degToRad) * radius;
        var cy = y - Math.cos((startAngle + arc) * degToRad) * yRadius;

        var dx = x + Math.sin((startAngle + arc) * degToRad) * innerRadius;
        var dy = y - Math.cos((startAngle + arc) * degToRad) * yInnerRadius;

        var hsb = AmCharts.adjustLuminosity(attributes.fill, -0.2);

        var bparams = {
            "fill": hsb,
            "stroke-opacity": 0,
            "fill-opacity": attributes["fill-opacity"]
        };

        var lf = 0;
        var sf = 1;
        if (Math.abs(arc) > 180) {
            lf = 1;
        }

        var slice = container.set();
        var comma = ",";
        var L = " L";
        var A = " A";
        var Z = " Z";
        var M = " M";
        var B = " B";
        var UNDEFINED;
        var cs = "1000,1000";

        var wpath;
        var isSmall;
        var ten = 10;

        if (vml) {
            ax = round(ten * ax);
            bx = round(ten * bx);
            cx = round(ten * cx);
            dx = round(ten * dx);
            ay = round(ten * ay);
            by = round(ten * by);
            cy = round(ten * cy);
            dy = round(ten * dy);
            x = round(ten * x);
            h = round(ten * h);
            y = round(ten * y);
            radius = ten * radius;
            yRadius = ten * yRadius;
            innerRadius = ten * innerRadius;
            yInnerRadius = ten * yInnerRadius;

            if (Math.abs(arc) < 1 && Math.abs(cx - bx) <= 1 && Math.abs(cy - by) <= 1) {
                isSmall = true;
            }
        }
        var parc = "";
        var path;

        if (pattern) {
            bparams["fill-opacity"] = 0;
            bparams["stroke-opacity"] = attributes["stroke-opacity"] / 2;
            bparams.stroke = attributes.stroke;
        }

        if (h > 0) {
            path = M + ax + comma + (ay + h) + L + bx + comma + (by + h);
            if (vml) {
                if (!isSmall) {
                    path += A + (x - radius) + comma + (h + y - yRadius) + comma + (x + radius) + comma + (h + y + yRadius) + comma + (bx) + comma + (by + h) + comma + (cx) + comma + (cy + h);
                }

                path += L + dx + comma + (dy + h);

                if (innerRadius > 0) {
                    if (!isSmall) {
                        path += " B" + (x - innerRadius) + comma + (h + y - yInnerRadius) + comma + (x + innerRadius) + comma + (h + y + yInnerRadius) + comma + dx + comma + (h + dy) + comma + ax + comma + (h + ay);
                    }
                }
            } else {
                path += A + radius + comma + yRadius + comma + 0 + comma + lf + comma + sf + comma + cx + comma + (cy + h) + L + dx + comma + (dy + h);

                if (innerRadius > 0) {
                    path += A + innerRadius + comma + yInnerRadius + comma + 0 + comma + lf + comma + 0 + comma + ax + comma + (ay + h);
                }
            }

            path += Z;

            var hh = h;
            if (vml) {
                hh = hh / 10;
            }

            for (var s = 0; s < hh; s += 10) {
                var c = container.path(path, UNDEFINED, UNDEFINED, cs).attr(bparams);
                slice.push(c);
                c.translate(0, -s);
            }


            var b1 = container.path(M + ax + comma + ay + L + ax + comma + (ay + h) + L + bx + comma + (by + h) + L + bx + comma + by + L + ax + comma + ay + Z, UNDEFINED, UNDEFINED, cs).attr(bparams);
            var b2 = container.path(M + cx + comma + cy + L + cx + comma + (cy + h) + L + dx + comma + (dy + h) + L + dx + comma + dy + L + cx + comma + cy + Z, UNDEFINED, UNDEFINED, cs).attr(bparams);
            slice.push(b1);
            slice.push(b2);
        }

        if (vml) {
            if (!isSmall) {
                parc = A + round(x - radius) + comma + round(y - yRadius) + comma + round(x + radius) + comma + round(y + yRadius) + comma + round(bx) + comma + round(by) + comma + round(cx) + comma + round(cy);
            }
            wpath = M + round(ax) + comma + round(ay) + L + round(bx) + comma + round(by) + parc + L + round(dx) + comma + round(dy);
        } else {
            parc = A + radius + comma + yRadius + comma + 0 + comma + lf + comma + sf + comma + cx + comma + cy;
            wpath = M + ax + comma + ay + L + bx + comma + by + parc + L + dx + comma + dy;
        }


        if (innerRadius > 0) {
            if (vml) {
                if (!isSmall) {
                    wpath += B + (x - innerRadius) + comma + (y - yInnerRadius) + comma + (x + innerRadius) + comma + (y + yInnerRadius) + comma + dx + comma + dy + comma + ax + comma + ay;
                }
            } else {
                wpath += A + innerRadius + comma + yInnerRadius + comma + 0 + comma + lf + comma + 0 + comma + ax + comma + ay;
            }
        }


        if (container.handDrawn) {
            var hdLine = AmCharts.line(container, [ax, bx], [ay, by], attributes.stroke, attributes.thickness * Math.random() * container.handDrawThickness, attributes["stroke-opacity"]);
            slice.push(hdLine);
        }


        wpath += Z;

        var w = container.path(wpath, UNDEFINED, UNDEFINED, cs).attr(attributes);

        if (gradientRatio) {
            var gradient = [];
            var i;
            for (i = 0; i < gradientRatio.length; i++) {
                gradient.push(AmCharts.adjustLuminosity(attributes.fill, gradientRatio[i]));
            }

            if (gradientType == "radial" && !AmCharts.isModern) {
                gradient = [];
            }

            if (gradient.length > 0) {
                w.gradient(gradientType + "Gradient", gradient);
            }
        }

        if (AmCharts.isModern) {
            if (gradientType == "radial") {
                if (w.grad) {
                    w.grad.setAttribute("gradientUnits", "userSpaceOnUse");
                    w.grad.setAttribute("r", radius);
                    //var xx = x - container.width / 2;
                    //var yy = y - container.height / 2;
                    //w.grad.setAttribute("gradientTransform", "translate(" + xx + "," + yy + ")");

                    w.grad.setAttribute("cx", x);
                    w.grad.setAttribute("cy", y);
                }
            }
        }

        w.pattern(pattern, NaN, globalPath);
        slice.wedge = w;
        slice.push(w);
        return slice;
    };

    AmCharts.rgb2hex = function(rgb) {
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : "";
    };

    // Thanks Craig Buckler for this method:
    // http://www.sitepoint.com/javascript-generate-lighter-darker-color/
    AmCharts.adjustLuminosity = function(hex, lum) {
        if (hex) {
            if (hex.indexOf("rgb") != -1) {
                hex = AmCharts.rgb2hex(hex);
            }
        }

        hex = String(hex).replace(/[^0-9a-f]/gi, "");
        if (hex.length < 6) {
            hex = String(hex[0]) + String(hex[0]) + String(hex[1]) + String(hex[1]) + String(hex[2]) + String(hex[2]);
        }

        lum = lum || 0;

        var rgb = "#";
        var c;
        var i;

        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }

        return rgb;
    };

})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.Bezier = AmCharts.Class({
        construct: function(container, x, y, color, alpha, thickness, fillColor, fillAlpha, dashLength, endStr, gradientRotation) {
            var _this = this;
            var fillColors;
            var gradient;
            if (typeof(fillColor) == "object") {
                if (fillColor.length > 1) {
                    gradient = true;
                    fillColors = fillColor;
                    fillColor = fillColor[0];
                }
            }
            if (typeof(fillAlpha) == "object") {
                fillAlpha = fillAlpha[0];
            }
            if (fillAlpha === 0) {
                fillColor = "none";
            }
            var attr = {
                "fill": fillColor,
                "fill-opacity": fillAlpha,
                "stroke-width": thickness
            };

            if (dashLength !== undefined && dashLength > 0) {
                attr["stroke-dasharray"] = dashLength;
            }

            if (!isNaN(alpha)) {
                attr["stroke-opacity"] = alpha;
            }

            if (color) {
                attr.stroke = color;
            }

            var lineStr = "M" + Math.round(x[0]) + "," + Math.round(y[0]);
            var points = [];

            var i;
            for (i = 0; i < x.length; i++) {
                points.push({
                    x: Number(x[i]),
                    y: Number(y[i])
                });
            }

            if (points.length > 1) {
                var interpolatedPoints = _this.interpolate(points);
                lineStr += _this.drawBeziers(interpolatedPoints);
            }

            if (endStr) {
                lineStr += endStr;
            } else {
                if (!AmCharts.VML) {
                    // end string is to create area
                    // this is the fix to solve straight line in chrome problem
                    lineStr += "M0,0 L0,0";
                }
            }

            _this.path = container.path(lineStr).attr(attr);
            _this.node = _this.path.node;

            if (gradient) {
                _this.path.gradient("linearGradient", fillColors, gradientRotation);
            }            
        },


        interpolate: function(points) {
            var interpolatedPoints = [];
            interpolatedPoints.push({
                x: points[0].x,
                y: points[0].y
            });

            var slope_x = points[1].x - points[0].x;
            var slope_y = points[1].y - points[0].y;

            var dal_x = AmCharts.bezierX;
            var dal_y = AmCharts.bezierY;

            interpolatedPoints.push({
                x: points[0].x + slope_x / dal_x,
                y: points[0].y + slope_y / dal_y
            });
            var i;

            for (i = 1; i < points.length - 1; i++) {


                var point1 = points[i - 1];
                var point2 = points[i];
                var point3 = points[i + 1];

                if (isNaN(point3.x)) {
                    point3 = point2;
                }

                if (isNaN(point2.x)) {
                    point2 = point1;
                }

                if (isNaN(point1.x)) {
                    point1 = point2;
                }

                slope_x = point3.x - point2.x;
                slope_y = point3.y - point1.y;

                var slope_x0 = point2.x - point1.x;

                if (slope_x0 > slope_x) {
                    slope_x0 = slope_x;
                }

                interpolatedPoints.push({
                    x: point2.x - slope_x0 / dal_x,
                    y: point2.y - slope_y / dal_y
                });
                interpolatedPoints.push({
                    x: point2.x,
                    y: point2.y
                });
                interpolatedPoints.push({
                    x: point2.x + slope_x0 / dal_x,
                    y: point2.y + slope_y / dal_y
                });
            }

            slope_y = points[points.length - 1].y - points[points.length - 2].y;
            slope_x = points[points.length - 1].x - points[points.length - 2].x;

            interpolatedPoints.push({
                x: points[points.length - 1].x - slope_x / dal_x,
                y: points[points.length - 1].y - slope_y / dal_y
            });
            interpolatedPoints.push({
                x: points[points.length - 1].x,
                y: points[points.length - 1].y
            });

            return interpolatedPoints;
        },

        drawBeziers: function(interpolatedPoints) {
            var str = "";
            var j;
            for (j = 0; j < (interpolatedPoints.length - 1) / 3; j++) {
                str += this.drawBezierMidpoint(interpolatedPoints[3 * j], interpolatedPoints[3 * j + 1], interpolatedPoints[3 * j + 2], interpolatedPoints[3 * j + 3]);
            }
            return str;
        },


        drawBezierMidpoint: function(P0, P1, P2, P3) {
            var round = Math.round;
            // calculates the useful base points
            var PA = this.getPointOnSegment(P0, P1, 3 / 4);
            var PB = this.getPointOnSegment(P3, P2, 3 / 4);

            // get 1/16 of the [P3, P0] segment
            var dx = (P3.x - P0.x) / 16;
            var dy = (P3.y - P0.y) / 16;

            // calculates control point 1
            var Pc_1 = this.getPointOnSegment(P0, P1, 3 / 8);

            // calculates control point 2
            var Pc_2 = this.getPointOnSegment(PA, PB, 3 / 8);
            Pc_2.x -= dx;
            Pc_2.y -= dy;

            // calculates control point 3
            var Pc_3 = this.getPointOnSegment(PB, PA, 3 / 8);
            Pc_3.x += dx;
            Pc_3.y += dy;

            // calculates control point 4
            var Pc_4 = this.getPointOnSegment(P3, P2, 3 / 8);

            // calculates the 3 anchor points
            var Pa_1 = this.getMiddle(Pc_1, Pc_2);
            var Pa_2 = this.getMiddle(PA, PB);
            var Pa_3 = this.getMiddle(Pc_3, Pc_4);

            // draw the four quadratic subsegments
            var comma = ",";

            var str = " Q" + round(Pc_1.x) + comma + round(Pc_1.y) + comma + round(Pa_1.x) + comma + round(Pa_1.y);
            str += " Q" + round(Pc_2.x) + comma + round(Pc_2.y) + comma + round(Pa_2.x) + comma + round(Pa_2.y);
            str += " Q" + round(Pc_3.x) + comma + round(Pc_3.y) + comma + round(Pa_3.x) + comma + round(Pa_3.y);
            str += " Q" + round(Pc_4.x) + comma + round(Pc_4.y) + comma + round(P3.x) + comma + round(P3.y);

            return str;
        },


        getMiddle: function(P0, P1) {
            var point = {
                x: (P0.x + P1.x) / 2,
                y: (P0.y + P1.y) / 2
            };
            return point;
        },

        getPointOnSegment: function(P0, P1, ratio) {
            var point = {
                x: P0.x + (P1.x - P0.x) * ratio,
                y: P0.y + (P1.y - P0.y) * ratio
            };
            return point;
        }

    });

})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.AmDraw = AmCharts.Class({
        construct: function(div, w, h, chart) {
            AmCharts.SVG_NS = "http://www.w3.org/2000/svg";
            AmCharts.SVG_XLINK = "http://www.w3.org/1999/xlink";
            AmCharts.hasSVG = !!document.createElementNS && !!document.createElementNS(AmCharts.SVG_NS, "svg").createSVGRect;

            if (w < 1) {
                w = 10;
            }

            if (h < 1) {
                h = 10;
            }

            var _this = this;
            _this.div = div;
            _this.width = w;
            _this.height = h;
            _this.rBin = document.createElement("div");

            if (AmCharts.hasSVG) {
                AmCharts.SVG = true;
                var svg = _this.createSvgElement("svg");
                div.appendChild(svg);
                _this.container = svg;
                _this.addDefs(chart);
                _this.R = new AmCharts.SVGRenderer(_this);
            } else if (AmCharts.isIE) {
                if (AmCharts.VMLRenderer) {
                    AmCharts.VML = true;
                    if (!AmCharts.vmlStyleSheet) {
                        document.namespaces.add("amvml", "urn:schemas-microsoft-com:vml");
                        var rule = "behavior:url(#default#VML); display:inline-block; antialias:true";

                        if (document.styleSheets.length < 31) {
                            var ss = document.createStyleSheet();
                            ss.addRule(".amvml", rule);
                            AmCharts.vmlStyleSheet = ss;
                        } else {
                            document.styleSheets[0].addRule(".amvml", rule);
                        }
                    }

                    _this.container = div;
                    _this.R = new AmCharts.VMLRenderer(_this, chart);
                    _this.R.disableSelection(div);
                }
            }
        },

        createSvgElement: function(name) {
            return document.createElementNS(AmCharts.SVG_NS, name);
        },

        circle: function(x, y, r, container) {
            var _this = this;

            var c = new AmCharts.AmDObject("circle", _this);
            c.attr({
                r: r,
                cx: x,
                cy: y
            });

            _this.addToContainer(c.node, container);

            return c;
        },

        ellipse: function(x, y, rx, ry, container) {
            var _this = this;

            var c = new AmCharts.AmDObject("ellipse", _this);

            c.attr({
                rx: rx,
                ry: ry,
                cx: x,
                cy: y
            });

            _this.addToContainer(c.node, container);

            return c;
        },

        setSize: function(w, h) {
            if (w > 0 && h > 0) {
                this.container.style.width = w + "px";
                this.container.style.height = h + "px";
            }
        },

        rect: function(x, y, w, h, cr, bw, container) {
            var _this = this;

            var r = new AmCharts.AmDObject("rect", _this);

            if (AmCharts.VML) {
                cr = Math.round(cr * 100 / Math.min(w, h));
                w += bw * 2;
                h += bw * 2;
                r.bw = bw;
                r.node.style.marginLeft = -bw;
                r.node.style.marginTop = -bw;
            }
            if (w < 1) {
                w = 1;
            }

            if (h < 1) {
                h = 1;
            }

            r.attr({
                x: x,
                y: y,
                width: w,
                height: h,
                rx: cr,
                ry: cr,
                "stroke-width": bw
            });
            _this.addToContainer(r.node, container);
            return r;
        },

        image: function(path, x, y, w, h, container) {
            var _this = this;
            var i = new AmCharts.AmDObject("image", _this);
            i.attr({
                x: x,
                y: y,
                width: w,
                height: h
            });
            _this.R.path(i, path);
            _this.addToContainer(i.node, container);
            return i;
        },

        addToContainer: function(node, container) {
            if (!container) {
                container = this.container;
            }
            container.appendChild(node);
        },

        text: function(text, attr, container) {
            return this.R.text(text, attr, container);
        },

        path: function(pathStr, container, parsed, cs) {
            var _this = this;

            var p = new AmCharts.AmDObject("path", _this);

            if (!cs) {
                cs = "100,100";
            }

            p.attr({
                "cs": cs
            });

            if (parsed) {
                p.attr({
                    "dd": pathStr
                });
            } else {
                p.attr({
                    "d": pathStr
                });
            }

            _this.addToContainer(p.node, container);

            return p;
        },

        set: function(arr) {
            return this.R.set(arr);
        },

        remove: function(node) {
            if (node) {
                var rBin = this.rBin;
                rBin.appendChild(node);
                rBin.innerHTML = "";
            }
        },

        renderFix: function() {
            var container = this.container;
            var style = container.style;
            style.top = "0px";
            style.left = "0px";

            // sometimes IE doesn't like this
            try {
                var rect = container.getBoundingClientRect();

                var left = rect.left - Math.round(rect.left);
                var top = rect.top - Math.round(rect.top);

                if (left) {
                    style.left = left + "px";
                }
                if (top) {
                    style.top = top + "px";
                }
            } catch (err) {
                // void
            }
        },

        update: function() {
            this.R.update();
        },

        addDefs: function(chart) {
            if (AmCharts.hasSVG) {
                var _this = this;
                var desc = _this.createSvgElement("desc");

                var svg = _this.container;
                svg.setAttribute("version", "1.1");
                svg.style.position = "absolute";
                _this.setSize(_this.width, _this.height);

                if(chart.accessibleTitle){
                    var title = _this.createSvgElement("text");
                    svg.appendChild(title);
                    title.innerHTML = chart.accessibleTitle;
                    title.style.opacity = 0;
                }

                if (AmCharts.rtl) {
                    svg.setAttribute("direction", "rtl");
                    svg.style.left = "auto";
                    svg.style.right = "0px";
                }
                if (chart) {
                    if (chart.addCodeCredits) {                        
                        desc.appendChild(document.createTextNode("JavaScript chart by amCharts " + chart.version));
                    }

                    svg.appendChild(desc);

                    if (chart.defs) {
                        var defs = _this.createSvgElement("defs");
                        svg.appendChild(defs);
                        AmCharts.parseDefs(chart.defs, defs);
                        _this.defs = defs;
                    }
                }
            }
        }

    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.AmDObject = AmCharts.Class({
        construct: function(name, amDraw) {
            var _this = this;
            _this.D = amDraw;
            _this.R = amDraw.R;
            var node = _this.R.create(this, name);
            _this.node = node;
            _this.x = 0;
            _this.y = 0;
            _this.scale = 1;
        },

        attr: function(attributes) {
            this.R.attr(this, attributes);
            return this;
        },

        getAttr: function(attr) {
            return this.node.getAttribute(attr);
        },

        setAttr: function(attr, value) {
            this.R.setAttr(this, attr, value);
            return this;
        },

        clipRect: function(x, y, w, h) {
            this.R.clipRect(this, x, y, w, h);
        },

        translate: function(x, y, scale, noRound) {
            var _this = this;

            if (!noRound) {
                x = Math.round(x);
                y = Math.round(y);
            }

            this.R.move(this, x, y, scale);
            _this.x = x;
            _this.y = y;

            _this.scale = scale;
            if (_this.angle) {
                _this.rotate(_this.angle);
            }
        },

        rotate: function(angle, bgColor) {
            this.R.rotate(this, angle, bgColor);
            this.angle = angle;
        },

        animate: function(attributes, time, effect) {
            var a;
            for (a in attributes) {
                if (attributes.hasOwnProperty(a)) {
                    var attribute = a;
                    var to = attributes[a];

                    effect = AmCharts.getEffect(effect);

                    this.R.animate(this, attribute, to, time, effect);
                }
            }
        },

        push: function(obj) {
            if (obj) {
                var node = this.node;

                node.appendChild(obj.node);

                var clipPath = obj.clipPath;
                if (clipPath) {
                    node.appendChild(clipPath);
                }

                var grad = obj.grad;
                if (grad) {
                    node.appendChild(grad);
                }
            }
        },

        text: function(str) {
            this.R.setText(this, str);
        },

        remove: function() {
            this.stop();
            this.R.remove(this);
        },

        clear: function() {
            var node = this.node;
            if (node.hasChildNodes()) {
                while (node.childNodes.length >= 1) {
                    node.removeChild(node.firstChild);
                }
            }
        },

        hide: function() {
            this.setAttr("visibility", "hidden");
        },

        show: function() {
            this.setAttr("visibility", "visible");
        },

        getBBox: function() {
            return this.R.getBBox(this);
        },

        toFront: function() {
            var node = this.node;

            if (node) {
                this.prevNextNode = node.nextSibling;
                var parent = node.parentNode;

                if (parent) {
                    parent.appendChild(node);
                }
            }

        },

        toPrevious: function() {
            var node = this.node;
            if (node) {
                if (this.prevNextNode) {
                    var parent = node.parentNode;

                    if (parent) {
                        parent.insertBefore(this.prevNextNode, null);
                    }
                }
            }
        },

        toBack: function() {
            var node = this.node;
            if (node) {
                this.prevNextNode = node.nextSibling;
                var parent = node.parentNode;
                if (parent) {
                    var firstChild = parent.firstChild;
                    if (firstChild) {
                        parent.insertBefore(node, firstChild);
                    }
                }
            }
        },

        mouseover: function(f) {
            this.R.addListener(this, "mouseover", f);
            return this;
        },

        mouseout: function(f) {
            this.R.addListener(this, "mouseout", f);
            return this;
        },

        click: function(f) {
            this.R.addListener(this, "click", f);
            return this;
        },

        dblclick: function(f) {
            this.R.addListener(this, "dblclick", f);
            return this;
        },

        mousedown: function(f) {
            this.R.addListener(this, "mousedown", f);
            return this;
        },

        mouseup: function(f) {
            this.R.addListener(this, "mouseup", f);
            return this;
        },

        touchmove: function(f) {
            this.R.addListener(this, "touchmove", f);
            return this;
        },

        touchstart: function(f) {
            this.R.addListener(this, "touchstart", f);
            return this;
        },

        touchend: function(f) {
            this.R.addListener(this, "touchend", f);
            return this;
        },

        keyup:function(f){
            this.R.addListener(this, "keyup", f);
            return this;            
        },

        focus:function(f){
            this.R.addListener(this, "focus", f);
            return this;            
        },

        blur:function(f){
            this.R.addListener(this, "blur", f);
            return this;            
        },



        contextmenu: function(f) {
            if (this.node.addEventListener) {
                this.node.addEventListener("contextmenu", f, true);
            } else {
                this.R.addListener(this, "contextmenu", f);
            }
            return this;
        },

        stop: function() {
            var _this = this;

            AmCharts.removeFromArray(_this.R.animations, _this.an_translate);
            AmCharts.removeFromArray(_this.R.animations, _this.an_y);
            AmCharts.removeFromArray(_this.R.animations, _this.an_x);
        },


        length: function() {
            return this.node.childNodes.length;
        },

        gradient: function(type, colors, rotation) {
            this.R.gradient(this, type, colors, rotation);
        },

        pattern: function(patternURL, scale, path) {
            if (patternURL) {
                this.R.pattern(this, patternURL, scale, path);
            }
        }

    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.VMLRenderer = AmCharts.Class({
        construct: function(amDraw, chart) {
            var _this = this;
            _this.chart = chart;
            _this.D = amDraw;
            _this.cNames = {
                circle: "oval",
                ellipse: "oval",
                rect: "roundrect",
                path: "shape"
            };
            _this.styleMap = {
                "x": "left",
                "y": "top",
                "width": "width",
                "height": "height",
                "font-family": "fontFamily",
                "font-size": "fontSize",
                "visibility": "visibility"
            };
        },

        create: function(obj, name) {
            var node;
            if (name == "group") {
                node = document.createElement("div");
                obj.type = "div";
            } else if (name == "text") {
                node = document.createElement("div");
                obj.type = "text";
            } else if (name == "image") {
                node = document.createElement("img");
                obj.type = "image";
            } else {
                obj.type = "shape";
                obj.shapeType = this.cNames[name];

                node = document.createElement("amvml:" + this.cNames[name]);
                var stroke = document.createElement("amvml:stroke");
                node.appendChild(stroke);
                obj.stroke = stroke;

                var fill = document.createElement("amvml:fill");
                node.appendChild(fill);
                obj.fill = fill;
                fill.className = "amvml";
                stroke.className = "amvml";
                node.className = "amvml";
            }

            node.style.position = "absolute";
            node.style.top = 0;
            node.style.left = 0;

            return node;
        },

        path: function(obj, p) {
            obj.node.setAttribute("src", p);
        },


        setAttr: function(obj, attr, value) {
            if (value !== undefined) {
                var mode8;
                if (document.documentMode === 8) {
                    mode8 = true;
                }

                var node = obj.node;

                var _this = this;
                var type = obj.type;
                var nodeStyle = node.style;


                // circle radius
                if (attr == "r") {
                    nodeStyle.width = value * 2;
                    nodeStyle.height = value * 2;
                }

                if (obj.shapeType == "oval") {
                    if (attr == "rx") {
                        nodeStyle.width = value * 2;
                    }

                    if (attr == "ry") {
                        nodeStyle.height = value * 2;
                    }
                }

                if (obj.shapeType == "roundrect") {
                    if (attr == "width" || attr == "height") {
                        value -= 1;
                    }
                }

                if (attr == "cursor") {
                    nodeStyle.cursor = value;
                }

                // circle x
                if (attr == "cx") {
                    nodeStyle.left = value - AmCharts.removePx(nodeStyle.width) / 2;
                }
                // circle y
                if (attr == "cy") {
                    nodeStyle.top = value - AmCharts.removePx(nodeStyle.height) / 2;
                }

                var styleName = _this.styleMap[attr];

                if (styleName == "width" || "styleName" == "height") {
                    if (value < 0) {
                        value = 0;
                    }
                }

                if (styleName !== undefined) {
                    nodeStyle[styleName] = value;
                }

                if (type == "text") {
                    if (attr == "text-anchor") {
                        var px = "px";
                        obj.anchor = value;

                        var textWidth = node.clientWidth;

                        if (value == "end") {
                            nodeStyle.marginLeft = -textWidth + px;
                        }
                        if (value == "middle") {
                            nodeStyle.marginLeft = -(textWidth / 2) + px;
                            nodeStyle.textAlign = "center";
                        }
                        if (value == "start") {
                            nodeStyle.marginLeft = 0 + px;
                        }
                    }
                    if (attr == "fill") {
                        nodeStyle.color = value;
                    }
                    if (attr == "font-weight") {
                        nodeStyle.fontWeight = value;
                    }
                }

                var children = obj.children;
                if (children) {
                    var i;
                    for (i = 0; i < children.length; i++) {
                        children[i].setAttr(attr, value);
                    }
                }

                // path
                if (type == "shape") {
                    if (attr == "cs") {
                        node.style.width = "100px";
                        node.style.height = "100px";
                        node.setAttribute("coordsize", value);
                    }

                    if (attr == "d") {
                        node.setAttribute("path", _this.svgPathToVml(value));
                    }

                    if (attr == "dd") {
                        node.setAttribute("path", value);
                    }

                    var stroke = obj.stroke;
                    var fill = obj.fill;

                    if (attr == "stroke") {
                        if (mode8) {
                            stroke.color = value;
                        } else {
                            stroke.setAttribute("color", value);
                        }
                    }

                    if (attr == "stroke-width") {
                        if (mode8) {
                            stroke.weight = value;
                        } else {
                            stroke.setAttribute("weight", value);
                        }
                    }

                    if (attr == "stroke-opacity") {
                        if (mode8) {
                            stroke.opacity = value;
                        } else {
                            stroke.setAttribute("opacity", value);
                        }
                    }
                    if (attr == "stroke-dasharray") {
                        var val = "solid";
                        if (value > 0 && value < 3) {
                            val = "dot";
                        }
                        if (value >= 3 && value <= 6) {
                            val = "dash";
                        }
                        if (value > 6) {
                            val = "longdash";
                        }
                        if (mode8) {
                            stroke.dashstyle = val;
                        } else {
                            stroke.setAttribute("dashstyle", val);
                        }
                    }
                    if (attr == "fill-opacity" || attr == "opacity") {
                        if (value === 0) {
                            if (mode8) {
                                fill.on = false;
                            } else {
                                fill.setAttribute("on", false);
                            }
                        } else {
                            if (mode8) {
                                fill.opacity = value;
                            } else {
                                fill.setAttribute("opacity", value);
                            }
                        }

                    }

                    if (attr == "fill") {
                        if (mode8) {
                            fill.color = value;
                        } else {
                            fill.setAttribute("color", value);
                        }
                    }

                    if (attr == "rx") {
                        if (mode8) {
                            node.arcSize = value + "%";
                        } else {
                            node.setAttribute("arcsize", value + "%");
                        }
                    }
                }
            }
        },

        attr: function(obj, attributes) {
            var _this = this;
            var a;
            for (a in attributes) {
                if (attributes.hasOwnProperty(a)) {
                    _this.setAttr(obj, a, attributes[a]);
                }
            }
        },

        text: function(text, attr, container) {
            var _this = this;

            var t = new AmCharts.AmDObject("text", _this.D);
            var node = t.node;
            node.style.whiteSpace = "pre";
            //var txt = document.createTextNode(text);

            node.innerHTML = text;
            _this.D.addToContainer(node, container);
            _this.attr(t, attr);

            return t;
        },

        getBBox: function(obj) {
            var node = obj.node;
            var box = this.getBox(node);
            return box;
        },

        getBox: function(node) {
            var x = node.offsetLeft;
            var y = node.offsetTop;

            var width = node.offsetWidth;
            var height = node.offsetHeight;

            var bbox;

            if (node.hasChildNodes()) {
                var xs;
                var ys;
                var i;
                for (i = 0; i < node.childNodes.length; i++) {
                    var childNode = node.childNodes[i];
                    bbox = this.getBox(childNode);
                    var xx = bbox.x;

                    if (!isNaN(xx)) {
                        if (isNaN(xs)) {
                            xs = xx;
                        } else if (xx < xs) {
                            xs = xx;
                        }
                    }

                    var yy = bbox.y;

                    if (!isNaN(yy)) {
                        if (isNaN(ys)) {
                            ys = yy;
                        } else if (yy < ys) {
                            ys = yy;
                        }
                    }


                    var ww = bbox.width + xx;

                    if (!isNaN(ww)) {
                        width = Math.max(width, ww);
                    }

                    var hh = bbox.height + yy;

                    if (!isNaN(hh)) {
                        height = Math.max(height, hh);
                    }
                }

                if (xs < 0) {
                    x += xs;
                }
                if (ys < 0) {
                    y += ys;
                }
            }

            return ({
                x: x,
                y: y,
                width: width,
                height: height
            });
        },

        setText: function(obj, str) {
            var node = obj.node;
            if (node) {
                node.innerHTML = str;
            }
            this.setAttr(obj, "text-anchor", obj.anchor);
        },

        addListener: function(obj, event, f) {
            obj.node["on" + event] = f;
        },

        move: function(obj, x, y) {
            var node = obj.node;
            var nodeStyle = node.style;

            if (obj.type == "text") {
                y -= AmCharts.removePx(nodeStyle.fontSize) / 2 - 1;
            }

            if (obj.shapeType == "oval") {
                x -= AmCharts.removePx(nodeStyle.width) / 2;
                y -= AmCharts.removePx(nodeStyle.height) / 2;
            }

            var bw = obj.bw;

            if (!isNaN(bw)) {
                x -= bw;
                y -= bw;
            }

            var px = "px";
            if (!isNaN(x) && !isNaN(y)) {
                node.style.left = x + px;
                node.style.top = y + px;
            }
        },

        svgPathToVml: function(path) {
            var pathArray = path.split(" ");
            path = "";
            var previousArray;
            var round = Math.round;
            var comma = ",";
            var i;
            for (i = 0; i < pathArray.length; i++) {
                var el = pathArray[i];
                var letter = el.substring(0, 1);
                var numbers = el.substring(1);
                var numbersArray = numbers.split(",");

                var rounded = round(numbersArray[0]) + comma + round(numbersArray[1]);

                if (letter == "M") {
                    path += " m " + rounded;
                }
                if (letter == "L") {
                    path += " l " + rounded;
                }
                if (letter == "Z") {
                    path += " x e";
                }
                if (letter == "Q") {
                    var length = previousArray.length;
                    var qp0x = previousArray[length - 2];
                    var qp0y = previousArray[length - 1];

                    var qp1x = numbersArray[0];
                    var qp1y = numbersArray[1];

                    var qp2x = numbersArray[2];
                    var qp2y = numbersArray[3];

                    var cp1x = round(qp0x / 3 + 2 / 3 * qp1x);
                    var cp1y = round(qp0y / 3 + 2 / 3 * qp1y);

                    var cp2x = round(2 / 3 * qp1x + qp2x / 3);
                    var cp2y = round(2 / 3 * qp1y + qp2y / 3);

                    path += " c " + cp1x + comma + cp1y + comma + cp2x + comma + cp2y + comma + qp2x + comma + qp2y;
                }

                if (letter == "A") {
                    path += " wa " + numbers;
                }

                if (letter == "B") {
                    path += " at " + numbers;
                }

                previousArray = numbersArray;
            }

            return path;
        },


        animate: function(obj, attribute, to, time, effect) {
            var _this = this;
            var node = obj.node;
            var chart = _this.chart;
            obj.animationFinished = false;

            if (attribute == "translate") {
                var toA = to.split(",");
                var toX = toA[0];
                var toY = toA[1];

                var fromX = node.offsetLeft;
                var fromY = node.offsetTop;

                chart.animate(obj, "left", fromX, toX, time, effect, "px");
                chart.animate(obj, "top", fromY, toY, time, effect, "px");
            }
        },



        clipRect: function(obj, x, y, w, h) {
            var node = obj.node;
            var PX = "px";
            if (x === 0 && y === 0) {
                node.style.width = w + PX;
                node.style.height = h + PX;
                node.style.overflow = "hidden";
            } else {
                node.style.clip = "rect(" + y + "px " + (x + w) + "px " + (y + h) + "px " + x + "px)";
            }
        },

        rotate: function(obj, deg, bgColor) {
            if (Number(deg) !== 0) {
                var node = obj.node;
                var style = node.style;

                if (!bgColor) {
                    bgColor = this.getBGColor(node.parentNode);
                }

                style.backgroundColor = bgColor;
                style.paddingLeft = 1;

                var rad = deg * Math.PI / 180;
                var costheta = Math.cos(rad);
                var sintheta = Math.sin(rad);

                var left = AmCharts.removePx(style.left);
                var top = AmCharts.removePx(style.top);
                var width = node.offsetWidth;
                var height = node.offsetHeight;

                var sign = deg / Math.abs(deg);

                style.left = left + width / 2 - width / 2 * Math.cos(rad) - sign * height / 2 * Math.sin(rad) + 3;
                style.top = top - sign * width / 2 * Math.sin(rad) + sign * height / 2 * Math.sin(rad);

                style.cssText = style.cssText + "; filter:progid:DXImageTransform.Microsoft.Matrix(M11='" + costheta + "', M12='" + -sintheta + "', M21='" + sintheta + "', M22='" + costheta + "', sizingmethod='auto expand');";
            }
        },


        getBGColor: function(node) {
            var style = node.style;
            var bgColor = "#FFFFFF";

            if (style) {
                var color = node.style.backgroundColor;
                if (color !== "") {
                    bgColor = color;
                } else if (node.parentNode) {
                    bgColor = this.getBGColor(node.parentNode);
                }
            }
            return bgColor;
        },

        set: function(arr) {
            var _this = this;
            var s = new AmCharts.AmDObject("group", _this.D);
            _this.D.container.appendChild(s.node);

            if (arr) {
                var i;
                for (i = 0; i < arr.length; i++) {
                    s.push(arr[i]);
                }
            }
            return s;
        },

        gradient: function(obj, type, colors, rotation) {
            var c = "";

            if (type == "radialGradient") {
                type = "gradientradial";
                colors.reverse();
            }

            if (type == "linearGradient") {
                type = "gradient";
            }
            var i;
            for (i = 0; i < colors.length; i++) {
                var offset = Math.round(i * 100 / (colors.length - 1));

                c += offset + "% " + colors[i];
                if (i < colors.length - 1) {
                    c += ",";
                }
            }

            var fill = obj.fill;

            if (rotation == 90) {
                rotation = 0;
            } else if (rotation == 270) {
                rotation = 180;
            } else if (rotation == 180) {
                rotation = 90;
            } else if (rotation === 0) {
                rotation = 270;
            }

            if (document.documentMode === 8) {
                fill.type = type;
                fill.angle = rotation;
            } else {
                fill.setAttribute("type", type);
                fill.setAttribute("angle", rotation);
            }
            if (c) {
                fill.colors.value = c;
            }
        },

        remove: function(obj) {
            var _this = this;

            if (obj.clipPath) {
                _this.D.remove(obj.clipPath);
            }
            _this.D.remove(obj.node);
        },

        disableSelection: function(target) {
            if (typeof target.onselectstart !== undefined) {
                target.onselectstart = function() {
                    return false;
                };
            }
            target.style.cursor = "default";
        },

        pattern: function(obj, pattern, scale, path) {
            var node = obj.node;

            var fill = obj.fill;
            var type = "tile";

            var color = "none";
            if (pattern.color) {
                color = pattern.color;
            }
            node.fillColor = color;

            var url = pattern.url;
            if (!AmCharts.isAbsolute(url)) {
                url = path + url;
            }

            if (document.documentMode === 8) {
                fill.type = type;
                fill.src = url;
            } else {
                fill.setAttribute("type", type);
                fill.setAttribute("src", url);
            }
        },

        update: function() {
            // void
        }
    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.SVGRenderer = AmCharts.Class({
        construct: function(amDraw) {
            var _this = this;
            _this.D = amDraw;
            _this.animations = [];
        },

        create: function(obj, name) {
            return document.createElementNS(AmCharts.SVG_NS, name);
        },

        attr: function(obj, attributes) {
            var a;
            for (a in attributes) {
                if (attributes.hasOwnProperty(a)) {
                    this.setAttr(obj, a, attributes[a]);
                }
            }
        },

        setAttr: function(obj, attr, value) {
            if (value !== undefined) {
                obj.node.setAttribute(attr, value);
            }
        },

        animate: function(obj, attribute, to, time, effect) {

            var _this = this;
            obj.animationFinished = false;
            var node = obj.node;
            var from;

            if (obj["an_" + attribute]) {
                AmCharts.removeFromArray(_this.animations, obj["an_" + attribute]);
            }

            if (attribute == "translate") {

                from = node.getAttribute("transform");

                if (!from) {
                    from = "0,0";
                } else {
                    from = String(from).substring(10, from.length - 1);
                }

                from = from.split(", ").join(" ");
                from = from.split(" ").join(",");

                if (from === 0) {
                    from = "0,0";
                }
            } else {
                from = Number(node.getAttribute(attribute));
            }

            var animationObj = {
                obj: obj,
                frame: 0,
                attribute: attribute,
                from: from,
                to: to,
                time: time,
                effect: effect
            };

            _this.animations.push(animationObj);

            obj["an_" + attribute] = animationObj;
        },

        update: function() {
            var _this = this;
            var i;

            var animations = _this.animations;
            var count = animations.length - 1;
            for (i = count; i >= 0; i--) {
                var animation = animations[i];

                var totalCount = animation.time * AmCharts.updateRate;
                var frame = animation.frame + 1;
                var obj = animation.obj;
                var attribute = animation.attribute;

                var fromXY;
                var fromX;
                var fromY;
                var toXY;
                var toX;
                var toY;
                var to;

                if (frame <= totalCount) {
                    var value;
                    animation.frame++;

                    if (attribute == "translate") {
                        fromXY = animation.from.split(",");
                        fromX = Number(fromXY[0]);
                        fromY = Number(fromXY[1]);

                        if (isNaN(fromY)) {
                            fromY = 0;
                        }

                        toXY = animation.to.split(",");
                        toX = Number(toXY[0]);
                        toY = Number(toXY[1]);

                        var valueX;
                        if (toX - fromX === 0) {
                            valueX = toX;
                        } else {
                            valueX = Math.round(AmCharts[animation.effect](0, frame, fromX, toX - fromX, totalCount));
                        }

                        var valueY;
                        if (toY - fromY === 0) {
                            valueY = toY;
                        } else {
                            valueY = Math.round(AmCharts[animation.effect](0, frame, fromY, toY - fromY, totalCount));
                        }
                        attribute = "transform";
                        if(isNaN(valueX) || isNaN(valueY)){
                            continue;
                        }
                        value = "translate(" + valueX + "," + valueY + ")";
                    } else {
                        var from = Number(animation.from);
                        to = Number(animation.to);
                        var change = to - from;

                        value = AmCharts[animation.effect](0, frame, from, change, totalCount);

                        if (isNaN(value)) {
                            value = to;
                        }

                        if (change === 0) {
                            _this.animations.splice(i, 1);
                        }
                    }

                    _this.setAttr(obj, attribute, value);
                } else {
                    if (attribute == "translate") {
                        toXY = animation.to.split(",");
                        toX = Number(toXY[0]);
                        toY = Number(toXY[1]);

                        obj.translate(toX, toY);
                    } else {
                        to = Number(animation.to);
                        _this.setAttr(obj, attribute, to);
                    }
                    obj.animationFinished = true;
                    _this.animations.splice(i, 1);
                }
            }
        },

        getBBox: function(obj) {
            var node = obj.node;
            var bbox = {
                width: 0,
                height: 0,
                x: 0,
                y: 0
            };
            if (node) {
                try {
                    return node.getBBox();
                } catch (err) {

                }
            }

            return bbox;
        },

        path: function(obj, p) {
            obj.node.setAttributeNS(AmCharts.SVG_XLINK, "xlink:href", p);
        },

        clipRect: function(obj, x, y, w, h) {
            var _this = this;
            var node = obj.node;

            var old = obj.clipPath;
            if (old) {
                _this.D.remove(old);
            }

            var parent = node.parentNode;
            if (parent) {
                var clipPath = document.createElementNS(AmCharts.SVG_NS, "clipPath");
                var uniqueId = AmCharts.getUniqueId();
                clipPath.setAttribute("id", uniqueId);

                _this.D.rect(x, y, w, h, 0, 0, clipPath);

                parent.appendChild(clipPath);
                var url = "#";
                if (AmCharts.baseHref && !AmCharts.isIE) {
                    url = _this.removeTarget(window.location.href) + url;
                }
                _this.setAttr(obj, "clip-path", "url(" + url + uniqueId + ")");
                _this.clipPathC++;

                // save reference in order not to get by id when removing
                obj.clipPath = clipPath;
            }
        },

        text: function(text, attr, container) {
            var _this = this;
            var t = new AmCharts.AmDObject("text", _this.D);

            var textArray = String(text).split("\n");
            var fontSize = AmCharts.removePx(attr["font-size"]);
            var i;
            for (i = 0; i < textArray.length; i++) {
                var tspan = _this.create(null, "tspan");
                tspan.appendChild(document.createTextNode(textArray[i]));
                tspan.setAttribute("y", (fontSize + 2) * i + Math.round(fontSize / 2));
                tspan.setAttribute("x", 0);
                //tspan.style.fontSize = fontSize + "px";
                t.node.appendChild(tspan);
            }
            t.node.setAttribute("y", Math.round(fontSize / 2));

            _this.attr(t, attr);
            _this.D.addToContainer(t.node, container);

            return t;
        },


        setText: function(obj, str) {
            var node = obj.node;
            if (node) {
                node.removeChild(node.firstChild);
                node.appendChild(document.createTextNode(str));
            }
        },

        move: function(obj, x, y, scale) {
            if (isNaN(x)) {
                x = 0;
            }

            if (isNaN(y)) {
                y = 0;
            }

            var val = "translate(" + x + "," + y + ")";
            if (scale) {
                val = val + " scale(" + scale + ")";
            }

            this.setAttr(obj, "transform", val);
        },


        rotate: function(obj, angle) {
            var node = obj.node;
            var transform = node.getAttribute("transform");
            var val = "rotate(" + angle + ")";
            if (transform) {
                val = transform + " " + val;
            }
            this.setAttr(obj, "transform", val);
        },

        set: function(arr) {
            var _this = this;
            var s = new AmCharts.AmDObject("g", _this.D);
            _this.D.container.appendChild(s.node);

            if (arr) {
                var i;
                for (i = 0; i < arr.length; i++) {
                    s.push(arr[i]);
                }
            }
            return s;
        },

        addListener: function(obj, event, f) {
            obj.node["on" + event] = f;
        },

        gradient: function(obj, type, colors, rotation) {
            var _this = this;
            var node = obj.node;

            var old = obj.grad;
            if (old) {
                _this.D.remove(old);
            }

            var gradient = document.createElementNS(AmCharts.SVG_NS, type);
            
            var uniqueId = AmCharts.getUniqueId();
            gradient.setAttribute("id", uniqueId);

            if (!isNaN(rotation)) {
                var x1 = 0;
                var x2 = 0;
                var y1 = 0;
                var y2 = 0;

                if (rotation == 90) {
                    y1 = 100;
                } else if (rotation == 270) {
                    y2 = 100;
                } else if (rotation == 180) {
                    x1 = 100;
                } else if (rotation === 0) {
                    x2 = 100;
                }

                var p = "%";

                gradient.setAttribute("x1", x1 + p);
                gradient.setAttribute("x2", x2 + p);
                gradient.setAttribute("y1", y1 + p);
                gradient.setAttribute("y2", y2 + p);
            }
            var i;
            for (i = 0; i < colors.length; i++) {
                var stop = document.createElementNS(AmCharts.SVG_NS, "stop");
                var offset = 100 * i / (colors.length - 1);
                if (i === 0) {
                    offset = 0;
                }
                stop.setAttribute("offset", offset + "%");
                stop.setAttribute("stop-color", colors[i]);
                gradient.appendChild(stop);
            }
            node.parentNode.appendChild(gradient);

            var url = "#";
            if (AmCharts.baseHref && !AmCharts.isIE) {
                url = _this.removeTarget(window.location.href) + url;
            }

            node.setAttribute("fill", "url(" + url + uniqueId + ")");

            obj.grad = gradient;
        },

        removeTarget: function(url) {
            var urlArr = url.split("#");
            return urlArr[0];
        },


        pattern: function(obj, pattern, scale, path) {
            var _this = this;
            var node = obj.node;

            if (isNaN(scale)) {
                scale = 1;
            }

            var old = obj.patternNode;
            if (old) {
                _this.D.remove(old);
            }

            var patternNode = document.createElementNS(AmCharts.SVG_NS, "pattern");
            var uniqueId = AmCharts.getUniqueId();
            var url = pattern;
            if (pattern.url) {
                url = pattern.url;
            }

            if (!AmCharts.isAbsolute(url) && url.indexOf("data:image") == -1) {
                url = path + url;
            }

            var width = Number(pattern.width);
            if (isNaN(width)) {
                width = 4;
            }

            var height = Number(pattern.height);
            if (isNaN(height)) {
                height = 4;
            }

            width = width / scale;
            height = height / scale;

            var x = pattern.x;
            if (isNaN(x)) {
                x = 0;
            }
            var randomX = -Math.random() * Number(pattern.randomX);
            if (!isNaN(randomX)) {
                x = randomX;
            }

            var y = pattern.y;
            if (isNaN(y)) {
                y = 0;
            }
            var randomY = -Math.random() * Number(pattern.randomY);
            if (!isNaN(randomY)) {
                y = randomY;
            }

            patternNode.setAttribute("id", uniqueId);
            patternNode.setAttribute("width", width);
            patternNode.setAttribute("height", height);
            patternNode.setAttribute("patternUnits", "userSpaceOnUse");
            patternNode.setAttribute("xlink:href", url);

            if (pattern.color) {
                var rect = document.createElementNS(AmCharts.SVG_NS, "rect");
                rect.setAttributeNS(null, "height", width);
                rect.setAttributeNS(null, "width", height);
                rect.setAttributeNS(null, "fill", pattern.color);
                patternNode.appendChild(rect);
            }

            var image = _this.D.image(url, 0, 0, width, height, patternNode);
            image.translate(x, y);


            url = "#";
            if (AmCharts.baseHref && !AmCharts.isIE) {
                url = _this.removeTarget(window.location.href) + url;
            }

            node.setAttribute("fill", "url(" + url + uniqueId + ")");

            obj.patternNode = patternNode;
            node.parentNode.appendChild(patternNode);
        },


        remove: function(obj) {
            var _this = this;

            if (obj.clipPath) {
                _this.D.remove(obj.clipPath);
            }

            if (obj.grad) {
                _this.D.remove(obj.grad);
            }

            if (obj.patternNode) {
                _this.D.remove(obj.patternNode);
            }

            _this.D.remove(obj.node);
        }

    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.AmLegend = AmCharts.Class({

        construct: function(theme) {
            var _this = this;
            _this.enabled = true;
            _this.cname = "AmLegend";
            _this.createEvents("rollOverMarker", "rollOverItem", "rollOutMarker", "rollOutItem", "showItem", "hideItem", "clickMarker", "clickLabel");
            _this.position = "bottom";
            _this.color = "#000000";
            _this.borderColor = "#000000";
            _this.borderAlpha = 0;
            _this.markerLabelGap = 5;
            _this.verticalGap = 10;
            _this.align = "left";
            _this.horizontalGap = 0;
            _this.spacing = 10;
            _this.markerDisabledColor = "#AAB3B3";
            _this.markerType = "square";
            _this.markerSize = 16;
            _this.markerBorderAlpha = 1;
            _this.markerBorderThickness = 1;
            _this.marginTop = 0;
            _this.marginBottom = 0;
            _this.marginRight = 20;
            _this.marginLeft = 20;
            _this.autoMargins = true;
            _this.valueWidth = 50;
            _this.switchable = true;
            _this.switchType = "x";
            _this.switchColor = "#FFFFFF";
            _this.rollOverColor = "#CC0000";
            _this.reversedOrder = false;
            _this.labelText = "[[title]]";
            _this.valueText = "[[value]]";
            _this.accessibleLabel = "[[title]]";
            _this.useMarkerColorForLabels = false;
            _this.rollOverGraphAlpha = 1;
            _this.textClickEnabled = false;
            _this.equalWidths = true;
            _this.backgroundColor = "#FFFFFF";
            _this.backgroundAlpha = 0;
            _this.useGraphSettings = false;
            _this.showEntries = true;
            //_this.gradientRotation;
            _this.labelDx = 0;
            AmCharts.applyTheme(_this, theme, _this.cname);
        },

        setData: function(data) {
            var _this = this;
            _this.legendData = data;
            _this.invalidateSize();
        },

        invalidateSize: function() {
            var _this = this;
            _this.destroy();
            _this.entries = [];
            _this.valueLabels = [];

            var data = _this.legendData;
            if (_this.enabled) {
                if (AmCharts.ifArray(data) || AmCharts.ifArray(_this.data)) {
                    _this.drawLegend();
                }
            }
        },

        drawLegend: function() {
            var _this = this;

            var chart = _this.chart;
            var position = _this.position;
            var width = _this.width;

            var realWidth = chart.divRealWidth;
            var realHeight = chart.divRealHeight;

            var div = _this.div;

            var data = _this.legendData;

            if (_this.data) {
                if(_this.combineLegend){
                    data = _this.legendData.concat(_this.data);
                }
                else{
                    data = _this.data;
                }
            }

            if (isNaN(_this.fontSize)) {
                _this.fontSize = chart.fontSize;
            }
            _this.maxColumnsReal = _this.maxColumns;
            if (position == "right" || position == "left") {
                _this.maxColumnsReal = 1;

                if (_this.autoMargins) {
                    _this.marginRight = 10;
                    _this.marginLeft = 10;
                }
            } else {
                if (_this.autoMargins) {
                    _this.marginRight = chart.marginRight;
                    _this.marginLeft = chart.marginLeft;
                    var autoMarginOffset = chart.autoMarginOffset;
                    if (position == "bottom") {
                        _this.marginBottom = autoMarginOffset;
                        _this.marginTop = 0;
                    } else {
                        _this.marginTop = autoMarginOffset;
                        _this.marginBottom = 0;
                    }
                }
            }

            var divWidth;

            if (width !== undefined) {
                divWidth = AmCharts.toCoordinate(width, realWidth);
            } else {
                if (position != "right" && position != "left") {
                    divWidth = chart.realWidth;
                } else {
                    if (_this.ieW > 0) {
                        divWidth = _this.ieW;
                    } else {
                        divWidth = chart.realWidth;
                    }
                }
            }

            if (position == "outside") {
                divWidth = div.offsetWidth;
                realHeight = div.offsetHeight;

                if (div.clientHeight) {
                    divWidth = div.clientWidth;
                    realHeight = div.clientHeight;
                }
            } else {
                if (!isNaN(divWidth)) {
                    div.style.width = divWidth + "px";
                }
                div.className = "amChartsLegend " + chart.classNamePrefix + "-legend-div";
            }

            _this.divWidth = divWidth;

            //            if (divWidth > 0 && realHeight > 0) {
            var container = _this.container;
            if (container) {
                container.container.innerHTML = "";
                div.appendChild(container.container);
                container.width = divWidth;
                container.height = realHeight;
                container.setSize(divWidth, realHeight);

                container.addDefs(chart);
            } else {
                container = new AmCharts.AmDraw(div, divWidth, realHeight, chart);
            }
            _this.container = container;

            _this.lx = 0;
            _this.ly = 8;

            var markerSize = _this.markerSize;

            if (markerSize > _this.fontSize) {
                _this.ly = markerSize / 2 - 1;
            }


            if (markerSize > 0) {
                _this.lx += markerSize + _this.markerLabelGap;
            }
            
            _this.titleWidth = 0;
            var title = this.title;
            if (title) {
                var label = AmCharts.text(_this.container, title, _this.color, chart.fontFamily, _this.fontSize, "start", true);
                AmCharts.setCN(chart, label, "legend-title");
                label.translate(_this.marginLeft, _this.marginTop + _this.verticalGap + _this.ly + 1);
                var titleBBox = label.getBBox();
                _this.titleWidth = titleBBox.width + 15;
                _this.titleHeight = titleBBox.height + 6;
            }

            _this.maxLabelWidth = 0;

            _this.index = 0;

            if (_this.showEntries) {
                var i;
                for (i = 0; i < data.length; i++) {
                    _this.createEntry(data[i]);
                }

                _this.index = 0;

                for (i = 0; i < data.length; i++) {
                    _this.createValue(data[i]);
                }
            }
            _this.arrangeEntries();
            _this.updateValues();
            //            }
        },

        arrangeEntries: function() {
            var _this = this;
            var position = _this.position;
            var marginLeft = _this.marginLeft + _this.titleWidth;
            var marginRight = _this.marginRight;
            var marginTop = _this.marginTop;
            var marginBottom = _this.marginBottom;
            var horizontalGap = _this.horizontalGap;
            var div = _this.div;
            var divWidth = _this.divWidth;
            var maxColumns = _this.maxColumnsReal;
            var verticalGap = _this.verticalGap;
            var spacing = _this.spacing;
            var w = divWidth - marginRight - marginLeft;
            var maxWidth = 0;
            var maxHeight = 0;

            var container = _this.container;

            if (_this.set) {
                _this.set.remove();
            }

            var set = container.set();
            _this.set = set;

            var entriesSet = container.set();
            set.push(entriesSet);

            var entries = _this.entries;
            var bbox;
            var i;
            for (i = 0; i < entries.length; i++) {
                bbox = entries[i].getBBox();
                var ew = bbox.width;
                if (ew > maxWidth) {
                    maxWidth = ew;
                }
                var eh = bbox.height;

                if (eh > maxHeight) {
                    maxHeight = eh;
                }
            }

            var PX = "px";
            var row = 0;
            var column = 0;
            var nextX = horizontalGap;
            var y = 0;
            var maxRowHeight = 0;

            for (i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (_this.reversedOrder) {
                    entry = entries[entries.length - i - 1];
                }

                bbox = entry.getBBox();

                var x;
                if (!_this.equalWidths) {
                    x = nextX;
                    nextX = nextX + bbox.width + horizontalGap + spacing;
                } else {
                    x = column * (maxWidth + spacing + _this.markerLabelGap);
                }

                if (bbox.height > maxRowHeight) {
                    maxRowHeight = bbox.height;
                }

                if (x + bbox.width > w && i > 0 && column !== 0) {
                    row++;
                    column = 0;
                    x = 0;
                    nextX = x + bbox.width + horizontalGap + spacing;
                    y = y + maxRowHeight + verticalGap;
                    maxRowHeight = 0;
                }

                entry.translate(x, y);
                column++;

                if (!isNaN(maxColumns)) {
                    if (column >= maxColumns) {
                        column = 0;
                        row++;
                        y = y + maxRowHeight + verticalGap;
                        nextX = horizontalGap;
                        maxRowHeight = 0;
                    }
                }
                entriesSet.push(entry);
            }

            bbox = entriesSet.getBBox();

            var hh = bbox.height + 2 * verticalGap - 1;
            var ww;

            if (position == "left" || position == "right") {
                ww = bbox.width + 2 * horizontalGap;
                divWidth = ww + marginLeft + marginRight;
                div.style.width = divWidth + PX;
                _this.ieW = divWidth;
            } else {
                ww = divWidth - marginLeft - marginRight - 1;
            }

            var bg = AmCharts.polygon(_this.container, [0, ww, ww, 0], [0, 0, hh, hh], _this.backgroundColor, _this.backgroundAlpha, 1, _this.borderColor, _this.borderAlpha);
            AmCharts.setCN(_this.chart, bg, "legend-bg");
            set.push(bg);

            set.translate(marginLeft, marginTop);

            bg.toBack();
            var ex = horizontalGap;
            if (position == "top" || position == "bottom" || position == "absolute" || position == "outside") {
                if (_this.align == "center") {
                    ex = horizontalGap + (ww - bbox.width) / 2;
                } else if (_this.align == "right") {
                    ex = horizontalGap + ww - bbox.width;
                }
            }

            entriesSet.translate(ex, verticalGap + 1);

            if (this.titleHeight > hh) {
                hh = this.titleHeight;
            }

            var divHeight = hh + marginTop + marginBottom + 1;

            if (divHeight < 0) {
                divHeight = 0;
            }

            if (divHeight > _this.chart.divRealHeight) {
                div.style.top = 0 + PX;
            }

            div.style.height = Math.round(divHeight) + PX;
            container.setSize(_this.divWidth, divHeight);
        },

        createEntry: function(dItem) {
            if (dItem.visibleInLegend !== false && !dItem.hideFromLegend) {
                var _this = this;
                var chart = _this.chart;

                var useGraphSettings = _this.useGraphSettings;

                var markerType = dItem.markerType;
                if(markerType){
                    useGraphSettings = false;
                }
                dItem.legendEntryWidth = _this.markerSize;
                if (!markerType) {
                    markerType = _this.markerType;
                }

                var color = dItem.color;
                var alpha = dItem.alpha;

                if (dItem.legendKeyColor) {
                    color = dItem.legendKeyColor();
                }

                if (dItem.legendKeyAlpha) {
                    alpha = dItem.legendKeyAlpha();
                }
                var UNDEFINED;
                var bulletBorderColor;
                if (dItem.hidden === true) {
                    color = _this.markerDisabledColor;
                    bulletBorderColor = color;
                }
                var pattern = dItem.pattern;
                var marker;
                var customMarker = dItem.customMarker;
                if (!customMarker) {
                    customMarker = _this.customMarker;
                }
                var container = _this.container;
                var markerSize = _this.markerSize;
                var dx = 0;
                var dy = 0;
                var markerX = markerSize / 2;
                if (useGraphSettings) {
                    var graphType = dItem.type;
                    _this.switchType = undefined;
                    if (graphType == "line" || graphType == "step" || graphType == "smoothedLine" || graphType == "ohlc") {

                        marker = container.set();

                        if (!dItem.hidden) {
                            color = dItem.lineColorR;
                            bulletBorderColor = dItem.bulletBorderColorR;
                        }

                        var line = AmCharts.line(container, [0, markerSize * 2], [markerSize / 2, markerSize / 2], color, dItem.lineAlpha, dItem.lineThickness, dItem.dashLength);
                        AmCharts.setCN(chart, line, "graph-stroke");
                        marker.push(line);

                        if (dItem.bullet) {
                            if (!dItem.hidden) {
                                color = dItem.bulletColorR;
                            }
                            var bullet = AmCharts.bullet(container, dItem.bullet, dItem.bulletSize, color, dItem.bulletAlpha, dItem.bulletBorderThickness, bulletBorderColor, dItem.bulletBorderAlpha);
                            if (bullet) {
                                AmCharts.setCN(chart, bullet, "graph-bullet");
                                bullet.translate(markerSize + 1, markerSize / 2);
                                marker.push(bullet);
                            }
                        }
                        markerX = 0;
                        dx = markerSize;
                        dy = markerSize / 3;
                    } else {
                        var gradRotation;
                        if (dItem.getGradRotation) {
                            gradRotation = dItem.getGradRotation();
                            if (gradRotation === 0) {
                                gradRotation = 180;
                            }
                        }

                        var fillColors = dItem.fillColorsR;
                        if (dItem.hidden === true) {
                            fillColors = color;
                        }

                        marker = _this.createMarker("rectangle", fillColors, dItem.fillAlphas, dItem.lineThickness, color, dItem.lineAlpha, gradRotation, pattern, dItem.dashLength);
                        if (marker) {
                            markerX = markerSize;
                            marker.translate(markerX, markerSize / 2);
                        }
                        dx = markerSize;
                    }

                    AmCharts.setCN(chart, marker, "graph-" + graphType);
                    AmCharts.setCN(chart, marker, "graph-" + dItem.id);

                } else if (customMarker) {
                    marker = container.image(customMarker, 0, 0, markerSize, markerSize);
                } else {

                    var gradientRotation;
                    if (!isNaN(_this.gradientRotation)) {
                        gradientRotation = 180 + _this.gradientRotation;
                    }

                    marker = _this.createMarker(markerType, color, alpha, UNDEFINED, UNDEFINED, UNDEFINED, gradientRotation, pattern);
                    if (marker) {
                        marker.translate(markerSize / 2, markerSize / 2);
                    }

                }

                AmCharts.setCN(chart, marker, "legend-marker");

                _this.addListeners(marker, dItem);
                var entrySet = container.set([marker]);

                if (_this.switchable && dItem.switchable) {
                    entrySet.setAttr("cursor", "pointer");
                }

                if (dItem.id !== undefined) {
                    AmCharts.setCN(chart, entrySet, "legend-item-" + dItem.id);
                }
                AmCharts.setCN(chart, entrySet, dItem.className, true);

                // switch
                var switchType = _this.switchType;
                var mswitch;
                if (switchType && switchType != "none" && markerSize > 0) {
                    if (switchType == "x") {
                        mswitch = _this.createX();
                        mswitch.translate(markerSize / 2, markerSize / 2);
                    } else {
                        mswitch = _this.createV();
                    }

                    mswitch.dItem = dItem;

                    if (dItem.hidden !== true) {
                        if (switchType == "x") {
                            mswitch.hide();
                        } else {
                            mswitch.show();
                        }
                    } else {
                        if (switchType != "x") {
                            mswitch.hide();
                        }
                    }

                    if (!_this.switchable) {
                        mswitch.hide();
                    }
                    _this.addListeners(mswitch, dItem);
                    dItem.legendSwitch = mswitch;
                    entrySet.push(mswitch);

                    AmCharts.setCN(chart, mswitch, "legend-switch");
                }
                // end of switch
                var tcolor = _this.color;

                if (dItem.showBalloon && _this.textClickEnabled && _this.selectedColor !== undefined) {
                    tcolor = _this.selectedColor;
                }

                if (_this.useMarkerColorForLabels) {
                    tcolor = color;
                }
                if (dItem.hidden === true) {
                    tcolor = _this.markerDisabledColor;
                }

                var txt = AmCharts.massReplace(_this.labelText, {
                    "[[title]]": dItem.title
                });

                if(_this.tabIndex !== undefined){
                    entrySet.setAttr("tabindex", _this.tabIndex);
                    entrySet.setAttr("role", "menuitem");
                    entrySet.keyup(function(ev){
                        if(ev.keyCode == 13){
                            _this.clickMarker(dItem, ev);
                        }
                    });
                }  

                if(chart.accessible){
                    if(_this.accessibleLabel){
                        var accessibleLabel = AmCharts.massReplace(_this.accessibleLabel, {
                            "[[title]]": dItem.title
                        });                        
                        chart.makeAccessible(entrySet, accessibleLabel);
                    }
                }  

                var fontSize = _this.fontSize;

                if (marker) {
                    if (markerSize <= fontSize) {
                        var newY = markerSize / 2 + _this.ly - fontSize / 2 + (fontSize + 2 - markerSize) / 2 - dy;
                        marker.translate(markerX, newY);
                        if (mswitch) {
                            mswitch.translate(mswitch.x, newY);
                        }
                    }
                    dItem.legendEntryWidth = marker.getBBox().width;
                }

                var label;
                if (txt) {
                    txt = AmCharts.fixBrakes(txt);
                    dItem.legendTextReal = txt;
                    var labelWidth = _this.labelWidth;

                    if (isNaN(labelWidth)) {
                        label = AmCharts.text(_this.container, txt, tcolor, chart.fontFamily, fontSize, "start");
                    } else {
                        label = AmCharts.wrappedText(_this.container, txt, tcolor, chart.fontFamily, fontSize, "start", false, labelWidth, 0);
                    }
                    AmCharts.setCN(chart, label, "legend-label");

                    label.translate(_this.lx + dx, _this.ly);
                    entrySet.push(label);
                    _this.labelDx = dx;

                    var bbox = label.getBBox();
                    var lWidth = bbox.width;

                    if (_this.maxLabelWidth < lWidth) {
                        _this.maxLabelWidth = lWidth;
                    }
                }

                _this.entries[_this.index] = entrySet;
                dItem.legendEntry = _this.entries[_this.index];
                dItem.legendMarker = marker;
                dItem.legendLabel = label;
                _this.index++;
            }
        },

        addListeners: function(obj, dItem) {
            var _this = this;

            if (obj) {
                obj.mouseover(function(ev) {
                    _this.rollOverMarker(dItem, ev);
                }).mouseout(function(ev) {
                    _this.rollOutMarker(dItem, ev);
                }).click(function(ev) {
                    _this.clickMarker(dItem, ev);
                });                
            }
        },


        rollOverMarker: function(dItem, ev) {
            var _this = this;
            if (_this.switchable) {
                _this.dispatch("rollOverMarker", dItem, ev);
            }
            _this.dispatch("rollOverItem", dItem, ev);
        },

        rollOutMarker: function(dItem, ev) {
            var _this = this;
            if (_this.switchable) {
                _this.dispatch("rollOutMarker", dItem, ev);
            }
            _this.dispatch("rollOutItem", dItem, ev);
        },

        clickMarker: function(dItem, ev) {
            var _this = this;      

            if (_this.switchable) {
                if (dItem.hidden === true) {
                    _this.dispatch("showItem", dItem, ev);
                } else {
                    _this.dispatch("hideItem", dItem, ev);
                }
            }
            _this.dispatch("clickMarker", dItem, ev);
        },


        rollOverLabel: function(dItem, ev) {
            var _this = this;
            if (!dItem.hidden) {
                if (_this.textClickEnabled) {
                    if (dItem.legendLabel) {
                        dItem.legendLabel.attr({
                            fill: _this.rollOverColor
                        });
                    }
                }
            }
            _this.dispatch("rollOverItem", dItem, ev);            
        },

        rollOutLabel: function(dItem, ev) {
            var _this = this;
            if (!dItem.hidden) {
                if (_this.textClickEnabled) {
                    if (dItem.legendLabel) {
                        var color = _this.color;
                        if (_this.selectedColor !== undefined && dItem.showBalloon) {
                            color = _this.selectedColor;
                        }
                        if (_this.useMarkerColorForLabels) {
                            color = dItem.lineColor;
                            if (color === undefined) {
                                color = dItem.color;
                            }
                        }

                        dItem.legendLabel.attr({
                            fill: color
                        });
                    }
                }
            }
            _this.dispatch("rollOutItem", dItem, ev);            
        },

        clickLabel: function(dItem, ev) {
            var _this = this;

            if (_this.textClickEnabled) {
                if (!dItem.hidden) {
                    _this.dispatch("clickLabel", dItem, ev);
                }
            } else if (_this.switchable) {
                if (dItem.hidden === true) {
                    _this.dispatch("showItem", dItem, ev);
                } else {
                    _this.dispatch("hideItem", dItem, ev);
                }
            }
        },

        dispatch: function(name, dItem, ev) {
            var _this = this;
            var evt = {
                type: name,
                dataItem: dItem,
                target: _this,
                event: ev,
                chart: _this.chart
            };
            if (_this.chart) {
                _this.chart.handleLegendEvent(evt);
            }
            _this.fire(evt);
        },

        createValue: function(dItem) {
            var _this = this;
            var fontSize = _this.fontSize;
            var LEFT = "left";
            var chart = _this.chart;
            if (dItem.visibleInLegend !== false && !dItem.hideFromLegend) {
                var labelWidth = _this.maxLabelWidth;

                if (_this.forceWidth) {
                    labelWidth = _this.labelWidth;
                }

                if (!_this.equalWidths) {
                    _this.valueAlign = LEFT;
                }

                if (_this.valueAlign == LEFT) {
                    if(dItem.legendLabel){
                        var bbox = dItem.legendLabel.getBBox();
                        labelWidth = bbox.width;
                    }
                }

                var hitW = labelWidth;
                if (_this.valueText && _this.valueWidth > 0) {
                    var tcolor = _this.color;
                    if (_this.useMarkerColorForValues) {
                        tcolor = dItem.color;

                        if (dItem.legendKeyColor) {
                            tcolor = dItem.legendKeyColor();
                        }
                    }

                    if (dItem.hidden === true) {
                        tcolor = _this.markerDisabledColor;
                    }

                    var txt = _this.valueText;
                    var x = labelWidth + _this.lx + _this.labelDx + _this.markerLabelGap + _this.valueWidth;

                    var anchor = "end";

                    if (_this.valueAlign == LEFT) {
                        x -= _this.valueWidth;
                        anchor = "start";
                    }

                    var vlabel = AmCharts.text(_this.container, txt, tcolor, _this.chart.fontFamily, fontSize, anchor);
                    AmCharts.setCN(chart, vlabel, "legend-value");
                    vlabel.translate(x, _this.ly);
                    _this.entries[_this.index].push(vlabel);

                    hitW += _this.valueWidth + _this.markerLabelGap * 2;

                    vlabel.dItem = dItem;
                    _this.valueLabels.push(vlabel);
                }

                _this.index++;
                var hitH = _this.markerSize;
                if (hitH < fontSize + 7) {
                    hitH = fontSize + 7;
                    if (AmCharts.VML) {
                        hitH += 3;
                    }
                }
                var hitRect = _this.container.rect(dItem.legendEntryWidth, 0, hitW, hitH, 0, 0).attr({
                    "stroke": "none",
                    "fill": "#fff",
                    "fill-opacity": 0.005
                });

                hitRect.dItem = dItem;

                _this.entries[_this.index - 1].push(hitRect);
                hitRect.mouseover(function(ev) {
                    _this.rollOverLabel(dItem, ev);
                }).mouseout(function(ev) {
                    _this.rollOutLabel(dItem, ev);
                }).click(function(ev) {
                    _this.clickLabel(dItem, ev);
                });
            }
        },

        createV: function() {
            var _this = this;
            var size = _this.markerSize;
            return AmCharts.polygon(_this.container, [size / 5, size / 2, size - size / 5, size / 2], [size / 3, size - size / 5, size / 5, size / 1.7], _this.switchColor);
        },

        createX: function() {
            var _this = this;
            var size = (_this.markerSize - 4) / 2;

            var attr = {
                stroke: _this.switchColor,
                "stroke-width": 3
            };
            var container = _this.container;
            var line1 = AmCharts.line(container, [-size, size], [-size, size]).attr(attr);
            var line2 = AmCharts.line(container, [-size, size], [size, -size]).attr(attr);
            return _this.container.set([line1, line2]);
        },

        createMarker: function(type, color, alpha, thickness, lineColor, lineAlpha, gradientRotation, pattern, dashLength) {
            var _this = this;
            var size = _this.markerSize;
            var c = _this.container;
            var marker;

            if (!lineColor) {
                lineColor = _this.markerBorderColor;
            }
            if (!lineColor) {
                lineColor = color;
            }
            if (isNaN(thickness)) {
                thickness = _this.markerBorderThickness;
            }

            if (isNaN(lineAlpha)) {
                lineAlpha = _this.markerBorderAlpha;
            }

            marker = AmCharts.bullet(c, type, size, color, alpha, thickness, lineColor, lineAlpha, size, gradientRotation, pattern, _this.chart.path, dashLength);

            return marker;
        },


        validateNow: function() {
            this.invalidateSize();
        },

        updateValues: function() {

            var _this = this;
            var valueLabels = _this.valueLabels;
            var chart = _this.chart;

            var i;

            var data = _this.data;
            if (valueLabels) {
                for (i = 0; i < valueLabels.length; i++) {
                    var label = valueLabels[i];
                    var dataItem = label.dItem;
                    dataItem.periodDataItem = undefined;
                    dataItem.periodPercentDataItem = undefined;
                    var formattedText = " ";
                    // all except slices

                    if (!data) {
                        var currentDataItem = null;
                        if (dataItem.type !== undefined) {
                            currentDataItem = dataItem.currentDataItem;

                            var periodValueText = _this.periodValueText;
                            if (dataItem.legendPeriodValueText) {
                                periodValueText = dataItem.legendPeriodValueText;
                            }

                            // one value
                            if (currentDataItem) {
                                formattedText = _this.valueText;

                                if (dataItem.legendValueText) {
                                    formattedText = dataItem.legendValueText;
                                }

                                formattedText = chart.formatString(formattedText, currentDataItem);
                            }
                            // period values
                            else if (periodValueText) {
                                if (chart.formatPeriodString) {
                                    periodValueText = AmCharts.massReplace(periodValueText, {
                                        "[[title]]": dataItem.title
                                    });
                                    formattedText = chart.formatPeriodString(periodValueText, dataItem);
                                }
                            }
                        }
                        // slices
                        else {
                            formattedText = chart.formatString(_this.valueText, dataItem);
                        }

                        var attr = dataItem;
                        if (currentDataItem) {
                            attr = currentDataItem;
                        }

                        var valueFunction = _this.valueFunction;
                        if (valueFunction) {
                            formattedText = valueFunction(attr, formattedText, chart.periodDataItem);
                        }
                        var color;

                        if(_this.useMarkerColorForLabels && !currentDataItem){
                            if(dataItem.lastDataItem){
                                currentDataItem = dataItem.lastDataItem;
                            }
                        }

                        if (currentDataItem) {
                            color = chart.getBalloonColor(dataItem, currentDataItem);
                        } else {
                            if (dataItem.legendKeyColor) {
                                color = dataItem.legendKeyColor();
                            }
                        }

                        if(dataItem.legendColorFunction){
                            color = dataItem.legendColorFunction(attr, formattedText, dataItem.periodDataItem, dataItem.periodPercentDataItem);
                        }
                                
                        label.text(formattedText);
                        if (_this.useMarkerColorForValues) {
                            label.setAttr("fill", color);
                        }

                        if (_this.useMarkerColorForLabels) {
                            var legendMarker = dataItem.legendMarker;
                            if (legendMarker) {
                                legendMarker.setAttr("fill", color);
                                legendMarker.setAttr("stroke", color);
                            }
                            var legendLabel = dataItem.legendLabel;
                            if (legendLabel) {
                                legendLabel.setAttr("fill", color);
                            }
                        }

                    } else {
                        if (dataItem.value) {
                            label.text(dataItem.value);
                        } else {
                            label.text("");
                        }
                    }
                }
            }
        },

        renderFix: function() {
            if (!AmCharts.VML && this.enabled) {
                var container = this.container;
                if (container) {
                    container.renderFix();
                }
            }
        },

        destroy: function() {
            var _this = this;
            _this.div.innerHTML = "";
            AmCharts.remove(_this.set);
        }
    });
})();
(function() {
    "use strict";
    var AmCharts = window.AmCharts;
    AmCharts.formatMilliseconds = function(string, date) {
        if (string.indexOf("fff") != -1) {
            var milliseconds = date.getMilliseconds();
            var mString = String(milliseconds);
            if (milliseconds < 10) {
                mString = "00" + milliseconds;
            }
            if (milliseconds >= 10 && milliseconds < 100) {
                mString = "0" + milliseconds;
            }

            string = string.replace(/fff/g, mString);
        }

        return string;
    };

    AmCharts.extractPeriod = function(period) {
        var cleanPeriod = AmCharts.stripNumbers(period);
        var count = 1;
        if (cleanPeriod != period) {
            count = Number(period.slice(0, period.indexOf(cleanPeriod)));
        }
        return {
            period: cleanPeriod,
            count: count
        };
    };


    AmCharts.getDate = function(value, dateFormat, minPeriod) {
        var date;
        if (value instanceof Date) {
            date = AmCharts.newDate(value, minPeriod);
        } else if (dateFormat && isNaN(value)) {
            date = AmCharts.stringToDate(value, dateFormat);
        } else {
            date = new Date(value);
        }
        return date;
    };


    AmCharts.daysInMonth = function(date) {
        return new Date(date.getYear(), date.getMonth() + 1, 0).getDate();
    };


    AmCharts.newDate = function(rawDate, period) {
        var date;
        if (!period || period.indexOf("fff") != -1) {
            //            if (AmCharts.useUTC) {
            //                date = new Date(rawDate.getUTCFullYear(), rawDate.getUTCMonth(), rawDate.getUTCDate(), rawDate.getUTCHours(), rawDate.getUTCMinutes(), rawDate.getUTCSeconds(), rawDate.getUTCMilliseconds());
            //            } else {
            date = new Date(rawDate.getFullYear(), rawDate.getMonth(), rawDate.getDate(), rawDate.getHours(), rawDate.getMinutes(), rawDate.getSeconds(), rawDate.getMilliseconds());
            //            }
        } else {
            date = new Date(rawDate);
        }
        return date;
    };



    // RESET DATE'S LOWER PERIODS TO MIN
    AmCharts.resetDateToMin = function(date, period, count, firstDateOfWeek) {
        if (firstDateOfWeek === undefined) {
            firstDateOfWeek = 1;
        }

        var year;
        var month;
        var day;
        var hours;
        var minutes;
        var seconds;
        var milliseconds;
        var week_day;

        if (AmCharts.useUTC) {
            year = date.getUTCFullYear();
            month = date.getUTCMonth();
            day = date.getUTCDate();
            hours = date.getUTCHours();
            minutes = date.getUTCMinutes();
            seconds = date.getUTCSeconds();
            milliseconds = date.getUTCMilliseconds();
            week_day = date.getUTCDay();
        } else {
            year = date.getFullYear();
            month = date.getMonth();
            day = date.getDate();
            hours = date.getHours();
            minutes = date.getMinutes();
            seconds = date.getSeconds();
            milliseconds = date.getMilliseconds();
            week_day = date.getDay();
        }

        switch (period) {
            case "YYYY":
                year = Math.floor(year / count) * count;
                month = 0;
                day = 1;
                hours = 0;
                minutes = 0;
                seconds = 0;
                milliseconds = 0;
                break;

            case "MM":
                month = Math.floor(month / count) * count;
                day = 1;
                hours = 0;
                minutes = 0;
                seconds = 0;
                milliseconds = 0;
                break;

            case "WW":
                if (week_day >= firstDateOfWeek) {
                    day = day - week_day + firstDateOfWeek;
                } else {
                    day = day - (7 + week_day) + firstDateOfWeek;
                }

                hours = 0;
                minutes = 0;
                seconds = 0;
                milliseconds = 0;
                break;

            case "DD":
                //day = Math.floor(day / count) * count;
                day = day;
                hours = 0;
                minutes = 0;
                seconds = 0;
                milliseconds = 0;
                break;

            case "hh":
                hours = Math.floor(hours / count) * count;
                minutes = 0;
                seconds = 0;
                milliseconds = 0;
                break;

            case "mm":
                minutes = Math.floor(minutes / count) * count;
                seconds = 0;
                milliseconds = 0;
                break;

            case "ss":
                seconds = Math.floor(seconds / count) * count;
                milliseconds = 0;
                break;

            case "fff":
                milliseconds = Math.floor(milliseconds / count) * count;
                break;
        }

        if (AmCharts.useUTC) {
            date = new Date();
            date.setUTCFullYear(year, month, day);
            date.setUTCHours(hours, minutes, seconds, milliseconds);

        } else {
            date = new Date(year, month, day, hours, minutes, seconds, milliseconds);
        }

        return date;
    };

    AmCharts.getPeriodDuration = function(period, count) {
        if (count === undefined) {
            count = 1;
        }
        var duration;
        switch (period) {
            case "YYYY":
                duration = 31622400000;
                break;
            case "MM":
                duration = 2678400000;
                break;
            case "WW":
                duration = 604800000;
                break;
            case "DD":
                duration = 86400000;
                break;
            case "hh":
                duration = 3600000;
                break;
            case "mm":
                duration = 60000;
                break;
            case "ss":
                duration = 1000;
                break;
            case "fff":
                duration = 1;
                break;
        }
        return duration * count;
    };


    AmCharts.intervals = {
        s: {
            nextInterval: "ss",
            contains: 1000
        },
        ss: {
            nextInterval: "mm",
            contains: 60,
            count: 0
        },
        mm: {
            nextInterval: "hh",
            contains: 60,
            count: 1
        },
        hh: {
            nextInterval: "DD",
            contains: 24,
            count: 2
        },
        DD: {
            nextInterval: "",
            contains: Infinity,
            count: 3
        }
    };

    AmCharts.getMaxInterval = function(duration, interval) {
        var intervals = AmCharts.intervals;
        if (duration >= intervals[interval].contains) {
            duration = Math.round(duration / intervals[interval].contains);
            interval = intervals[interval].nextInterval;

            return AmCharts.getMaxInterval(duration, interval);
        } else {
            if (interval == "ss") {
                return intervals[interval].nextInterval;
            } else {
                return interval;
            }
        }
    };


    AmCharts.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    AmCharts.shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    AmCharts.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    AmCharts.shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


    AmCharts.getWeekNumber = function(d) {
        d = new Date(d);
        d.setHours(0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        var yearStart = new Date(d.getFullYear(), 0, 1);
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    };


    AmCharts.stringToDate = function(str, format) {
        var values = {};

        var patterns = [{
                pattern: "YYYY",
                period: "year"
            }, {
                pattern: "YY",
                period: "year"
            }, {
                pattern: "MM",
                period: "month"
            }, {
                pattern: "M",
                period: "month"
            },

            {
                pattern: "DD",
                period: "date"
            }, {
                pattern: "D",
                period: "date"
            },

            {
                pattern: "JJ",
                period: "hours"
            }, {
                pattern: "J",
                period: "hours"
            }, {
                pattern: "HH",
                period: "hours"
            }, {
                pattern: "H",
                period: "hours"
            }, {
                pattern: "KK",
                period: "hours"
            }, {
                pattern: "K",
                period: "hours"
            }, {
                pattern: "LL",
                period: "hours"
            }, {
                pattern: "L",
                period: "hours"
            },

            {
                pattern: "NN",
                period: "minutes"
            }, {
                pattern: "N",
                period: "minutes"
            },

            {
                pattern: "SS",
                period: "seconds"
            }, {
                pattern: "S",
                period: "seconds"
            },

            {
                pattern: "QQQ",
                period: "milliseconds"
            }, {
                pattern: "QQ",
                period: "milliseconds"
            }, {
                pattern: "Q",
                period: "milliseconds"
            }
        ];

        var am = true;
        var amIndex = format.indexOf("AA");
        if (amIndex != -1) {
            str.substr(amIndex, 2);
            if (str.toLowerCase == "pm") {
                am = false;
            }
        }

        var realFormat = format;
        var pattern;
        var period;
        var i;
        for (i = 0; i < patterns.length; i++) {
            pattern = patterns[i].pattern;
            period = patterns[i].period;

            values[period] = 0;
            if (period == "date") {
                values[period] = 1;
            }
        }
        for (i = 0; i < patterns.length; i++) {
            pattern = patterns[i].pattern;
            period = patterns[i].period;

            if (format.indexOf(pattern) != -1) {
                var value = AmCharts.getFromDateString(pattern, str, realFormat);

                format = format.replace(pattern, "");

                if (pattern == "KK" || pattern == "K" || pattern == "LL" || pattern == "L") {
                    if (!am) {
                        value += 12;
                    }
                }
                values[period] = value;
            }
        }

        var date; // = new Date(values.year, values.month, values.date, values.hours, values.minutes, values.seconds, values.milliseconds);

        if (AmCharts.useUTC) {
            date = new Date();
            date.setUTCFullYear(values.year, values.month, values.date);
            date.setUTCHours(values.hours, values.minutes, values.seconds, values.milliseconds);
        } else {
            date = new Date(values.year, values.month, values.date, values.hours, values.minutes, values.seconds, values.milliseconds);
        }

        return date;
    };

    AmCharts.getFromDateString = function(what, date, format) {
        if (date !== undefined) {
            var i = format.indexOf(what);

            date = String(date);

            var valueStr = date.substr(i, what.length);

            if (valueStr.charAt(0) == "0") {
                valueStr = valueStr.substr(1, valueStr.length - 1);
            }

            var value = Number(valueStr);

            if (isNaN(value)) {
                value = 0;
            }

            if (what.indexOf("M") != -1) {
                value--;
            }

            return value;
        }
    };



    AmCharts.formatDate = function(d, f, chart) {

        if (!chart) {
            chart = AmCharts;
        }

        var year;
        var month;
        var date;
        var day;
        var hours;
        var minutes;
        var seconds;
        var milliseconds;
        var weekNo = AmCharts.getWeekNumber(d);

        if (AmCharts.useUTC) {
            year = d.getUTCFullYear();
            month = d.getUTCMonth();
            date = d.getUTCDate();
            day = d.getUTCDay();
            hours = d.getUTCHours();
            minutes = d.getUTCMinutes();
            seconds = d.getUTCSeconds();
            milliseconds = d.getUTCMilliseconds();
        } else {
            year = d.getFullYear();
            month = d.getMonth();
            date = d.getDate();
            day = d.getDay();
            hours = d.getHours();
            minutes = d.getMinutes();
            seconds = d.getSeconds();
            milliseconds = d.getMilliseconds();
        }


        var shortYear = String(year).substr(2, 2);



        var dayStr = "0" + day;

        // WEAK NUMBER
        f = f.replace(/W/g, weekNo);

        // HOURS
        var jhours = hours;
        if (jhours == 24) {
            jhours = 0;
        }
        var jjhours = jhours;
        if (jjhours < 10) {
            jjhours = "0" + jjhours;
        }

        f = f.replace(/JJ/g, jjhours);
        f = f.replace(/J/g, jhours);

        var hhours = hours;
        if (hhours === 0) {
            hhours = 24;
            if (f.indexOf("H") != -1) {
                date--;
                if (date === 0) {
                    var tempDate = new Date(d);
                    tempDate.setDate(tempDate.getDate() - 1);
                    month = tempDate.getMonth();
                    date = tempDate.getDate();
                    year = tempDate.getFullYear();
                }
            }
        }

        var monthStr = month + 1;

        if (month < 9) {
            monthStr = "0" + monthStr;
        }


        var dateStr = date;
        if (date < 10) {
            dateStr = "0" + date;
        }

        var hhhours = hhours;
        if (hhhours < 10) {
            hhhours = "0" + hhhours;
        }
        f = f.replace(/HH/g, hhhours);
        f = f.replace(/H/g, hhours);

        var khours = hours;
        if (khours > 11) {
            khours -= 12;
        }
        var kkhours = khours;
        if (kkhours < 10) {
            kkhours = "0" + kkhours;
        }
        f = f.replace(/KK/g, kkhours);
        f = f.replace(/K/g, khours);


        var lhours = hours;
        if (lhours === 0) {
            lhours = 12;
        }

        if (lhours > 12) {
            lhours -= 12;
        }
        var llhours = lhours;
        if (llhours < 10) {
            llhours = "0" + llhours;
        }
        f = f.replace(/LL/g, llhours);
        f = f.replace(/L/g, lhours);

        // MINUTES
        var nnminutes = minutes;
        if (nnminutes < 10) {
            nnminutes = "0" + nnminutes;
        }
        f = f.replace(/NN/g, nnminutes);
        f = f.replace(/N/g, minutes);

        var ssseconds = seconds;
        if (ssseconds < 10) {
            ssseconds = "0" + ssseconds;
        }
        f = f.replace(/SS/g, ssseconds);
        f = f.replace(/S/g, seconds);


        var qqqms = milliseconds;
        if (qqqms < 10) {
            qqqms = "00" + qqqms;
        }
        else if (qqqms < 100) {
            qqqms = "0" + qqqms;
        }

        var qqms = milliseconds;
        if (qqms < 10) {
            qqms = "00" + qqms;
        }

        f = f.replace(/A/g, "@A@");

        f = f.replace(/QQQ/g, qqqms);
        f = f.replace(/QQ/g, qqms);
        f = f.replace(/Q/g, milliseconds);


        f = f.replace(/YYYY/g, "@IIII@");
        f = f.replace(/YY/g, "@II@");

        f = f.replace(/MMMM/g, "@XXXX@");
        f = f.replace(/MMM/g, "@XXX@");
        f = f.replace(/MM/g, "@XX@");
        f = f.replace(/M/g, "@X@");

        f = f.replace(/DD/g, "@RR@");
        f = f.replace(/D/g, "@R@");

        f = f.replace(/EEEE/g, "@PPPP@");
        f = f.replace(/EEE/g, "@PPP@");
        f = f.replace(/EE/g, "@PP@");
        f = f.replace(/E/g, "@P@");

        f = f.replace(/@IIII@/g, year);
        f = f.replace(/@II@/g, shortYear);

        f = f.replace(/@XXXX@/g, chart.monthNames[month]);
        f = f.replace(/@XXX@/g, chart.shortMonthNames[month]);
        f = f.replace(/@XX@/g, monthStr);
        f = f.replace(/@X@/g, (month + 1));

        f = f.replace(/@RR@/g, dateStr);
        f = f.replace(/@R@/g, date);

        f = f.replace(/@PPPP@/g, chart.dayNames[day]);
        f = f.replace(/@PPP@/g, chart.shortDayNames[day]);
        f = f.replace(/@PP@/g, dayStr);
        f = f.replace(/@P@/g, day);

        if (hours < 12) {
            f = f.replace(/@A@/g, chart.amString);
        } else {
            f = f.replace(/@A@/g, chart.pmString);
        }        

        return f;
    };


    AmCharts.changeDate = function(date, period, count, forward, full) {

        if (AmCharts.useUTC) {
            return AmCharts.changeUTCDate(date, period, count, forward, full);
        }

        var k = -1;

        if (forward === undefined) {
            forward = true;
        }

        if (full === undefined) {
            full = false;
        }

        if (forward === true) {
            k = 1;
        }

        switch (period) {
            case "YYYY":
                date.setFullYear(date.getFullYear() + count * k);
                if (!forward && !full) {
                    date.setDate(date.getDate() + 1);
                }
                break;

            case "MM":
                var previousMonth = date.getMonth();
                date.setMonth(date.getMonth() + count * k);
                if (date.getMonth() > previousMonth + count * k) {
                    date.setDate(date.getDate() - 1);
                }
                if (!forward && !full) {
                    date.setDate(date.getDate() + 1);
                }
                break;

            case "DD":
                date.setDate(date.getDate() + count * k);
                break;

            case "WW":
                date.setDate(date.getDate() + count * k * 7);
                break;

            case "hh":
                date.setHours(date.getHours() + count * k);
                break;

            case "mm":
                date.setMinutes(date.getMinutes() + count * k);
                break;

            case "ss":
                date.setSeconds(date.getSeconds() + count * k);
                break;

            case "fff":
                date.setMilliseconds(date.getMilliseconds() + count * k);
                break;
        }
        return date;
    };

    AmCharts.changeUTCDate = function(date, period, count, forward, full) {
        var k = -1;

        if (forward === undefined) {
            forward = true;
        }

        if (full === undefined) {
            full = false;
        }

        if (forward === true) {
            k = 1;
        }

        switch (period) {
            case "YYYY":
                date.setUTCFullYear(date.getUTCFullYear() + count * k);
                if (!forward && !full) {
                    date.setUTCDate(date.getUTCDate() + 1);
                }
                break;

            case "MM":
                var previousMonth = date.getUTCMonth();
                date.setUTCMonth(date.getUTCMonth() + count * k);
                if (date.getUTCMonth() > previousMonth + count * k) {
                    date.setUTCDate(date.getUTCDate() - 1);
                }
                if (!forward && !full) {
                    date.setUTCDate(date.getUTCDate() + 1);
                }
                break;

            case "DD":
                date.setUTCDate(date.getUTCDate() + count * k);
                break;

            case "WW":
                date.setUTCDate(date.getUTCDate() + count * k * 7);
                break;

            case "hh":
                date.setUTCHours(date.getUTCHours() + count * k);
                break;

            case "mm":
                date.setUTCMinutes(date.getUTCMinutes() + count * k);
                break;

            case "ss":
                date.setUTCSeconds(date.getUTCSeconds() + count * k);
                break;

            case "fff":
                date.setUTCMilliseconds(date.getUTCMilliseconds() + count * k);
                break;
        }
        return date;
    };

})();