# Chart

## Basic

### amCharts

차트 컴퍼넌트는 [amCharts](https://www.amcharts.com/)사의 [Javascript Charts v3](https://www.amcharts.com/javascript-charts/) 제품을 통해 제공됩니다.  
JavaScript/HTML5 기반으로 다양한 차트(column, bar, line, area, step line, step without risers, smoothed line, candlestick and ohlc graphs), pie/donut, radar/polar, y/scatter/bubble, Funnel/Pyramid charts and Angular Gauges)를 제공합니다.  

> 차트를 이용한 [대쉬보드 sample](/2.3/demo/alopex-dashboard/view/dashboard1.html)


<div class="eg">
<div class="egview">

<h5>Column With Rotated Series</h5>
<div id="chartdiv01" style="height:300px;"></div>

</div>
</div>

<script>
var chart01 = AmCharts.makeChart("chartdiv01", {
  "type": "serial",
  "theme": "light",
  "marginRight": 70,
  "dataProvider": [{
    "country": "USA",
    "visits": 3025,
    "color": "#FF0F00"
  }, {
    "country": "China",
    "visits": 1882,
    "color": "#FF6600"
  }, {
    "country": "Japan",
    "visits": 1809,
    "color": "#FF9E01"
  }, {
    "country": "Germany",
    "visits": 1322,
    "color": "#FCD202"
  }, {
    "country": "UK",
    "visits": 1122,
    "color": "#F8FF01"
  }, {
    "country": "France",
    "visits": 1114,
    "color": "#B0DE09"
  }, {
    "country": "India",
    "visits": 984,
    "color": "#04D215"
  }, {
    "country": "Spain",
    "visits": 711,
    "color": "#0D8ECF"
  }, {
    "country": "Netherlands",
    "visits": 665,
    "color": "#0D52D1"
  }, {
    "country": "Russia",
    "visits": 580,
    "color": "#2A0CD0"
  }, {
    "country": "South Korea",
    "visits": 443,
    "color": "#8A0CCF"
  }, {
    "country": "Canada",
    "visits": 441,
    "color": "#CD0D74"
  }],
  "valueAxes": [{
    "axisAlpha": 0,
    "position": "left",
    "title": "Visitors from country"
  }],
  "startDuration": 0,
  "graphs": [{
    "balloonText": "<b>[[category]]: [[value]]</b>",
    "fillColorsField": "color",
    "fillAlphas": 0.9,
    "lineAlpha": 0.2,
    "type": "column",
    "valueField": "visits"
  }],
  "chartCursor": {
    "categoryBalloonEnabled": false,
    "cursorAlpha": 0,
    "zoomable": false
  },
  "categoryField": "country",
  "categoryAxis": {
    "gridPosition": "start",
    "labelRotation": 45
  },
  "export": {
    "enabled": true
  }

});
</script>





<div class="eg">
<div class="egview">

<h5>Stacked Bar Chart</h5>
<div id="chartdiv02" style="height:300px;"></div>

</div>
</div>

<script>
var chart02 = AmCharts.makeChart("chartdiv02", {
    "type": "serial",
	"theme": "light",
    "legend": {
        "horizontalGap": 10,
        "maxColumns": 1,
        "position": "right",
		"useGraphSettings": true,
		"markerSize": 10
    },
    "dataProvider": [{
        "year": 2003,
        "europe": 2.5,
        "namerica": 2.5,
        "asia": 2.1,
        "lamerica": 0.3,
        "meast": 0.2,
        "africa": 0.1
    }, {
        "year": 2004,
        "europe": 2.6,
        "namerica": 2.7,
        "asia": 2.2,
        "lamerica": 0.3,
        "meast": 0.3,
        "africa": 0.1
    }, {
        "year": 2005,
        "europe": 2.8,
        "namerica": 2.9,
        "asia": 2.4,
        "lamerica": 0.3,
        "meast": 0.3,
        "africa": 0.1
    }],
    "valueAxes": [{
        "stackType": "regular",
        "axisAlpha": 0.5,
        "gridAlpha": 0
    }],
    "graphs": [{
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "Europe",
        "type": "column",
		"color": "#000000",
        "valueField": "europe"
    }, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "North America",
        "type": "column",
		"color": "#000000",
        "valueField": "namerica"
    }, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "Asia-Pacific",
        "type": "column",
		"color": "#000000",
        "valueField": "asia"
    }, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "Latin America",
        "type": "column",
		"color": "#000000",
        "valueField": "lamerica"
    }, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "Middle-East",
        "type": "column",
		"color": "#000000",
        "valueField": "meast"
    }, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "Africa",
        "type": "column",
		"color": "#000000",
        "valueField": "africa"
    }],
    "rotate": true,
    "categoryField": "year",
    "categoryAxis": {
        "gridPosition": "start",
        "axisAlpha": 0,
        "gridAlpha": 0,
        "position": "left"
    },
    "export": {
    	"enabled": true
     }
});
</script>







<div class="eg">
<div class="egview">

<h5>Stacked Bar Chart</h5>
<div id="chartdiv03" style="height:300px;"></div>

</div>
</div>

<script>
var chart03 = AmCharts.makeChart("chartdiv03", {
    "type": "serial",
    "theme": "light",
    "legend": {
        "equalWidths": false,
        "useGraphSettings": true,
        "valueAlign": "left",
        "valueWidth": 120
    },
    "dataProvider": [{
        "date": "2012-01-01",
        "distance": 227,
        "townName": "New York",
        "townName2": "New York",
        "townSize": 25,
        "latitude": 40.71,
        "duration": 408
    }, {
        "date": "2012-01-02",
        "distance": 371,
        "townName": "Washington",
        "townSize": 14,
        "latitude": 38.89,
        "duration": 482
    }, {
        "date": "2012-01-03",
        "distance": 433,
        "townName": "Wilmington",
        "townSize": 6,
        "latitude": 34.22,
        "duration": 562
    }, {
        "date": "2012-01-04",
        "distance": 345,
        "townName": "Jacksonville",
        "townSize": 7,
        "latitude": 30.35,
        "duration": 379
    }, {
        "date": "2012-01-05",
        "distance": 480,
        "townName": "Miami",
        "townName2": "Miami",
        "townSize": 10,
        "latitude": 25.83,
        "duration": 501
    }, {
        "date": "2012-01-06",
        "distance": 386,
        "townName": "Tallahassee",
        "townSize": 7,
        "latitude": 30.46,
        "duration": 443
    }, {
        "date": "2012-01-07",
        "distance": 348,
        "townName": "New Orleans",
        "townSize": 10,
        "latitude": 29.94,
        "duration": 405
    }, {
        "date": "2012-01-08",
        "distance": 238,
        "townName": "Houston",
        "townName2": "Houston",
        "townSize": 16,
        "latitude": 29.76,
        "duration": 309
    }, {
        "date": "2012-01-09",
        "distance": 218,
        "townName": "Dalas",
        "townSize": 17,
        "latitude": 32.8,
        "duration": 287
    }, {
        "date": "2012-01-10",
        "distance": 349,
        "townName": "Oklahoma City",
        "townSize": 11,
        "latitude": 35.49,
        "duration": 485
    }, {
        "date": "2012-01-11",
        "distance": 603,
        "townName": "Kansas City",
        "townSize": 10,
        "latitude": 39.1,
        "duration": 890
    }, {
        "date": "2012-01-12",
        "distance": 534,
        "townName": "Denver",
        "townName2": "Denver",
        "townSize": 18,
        "latitude": 39.74,
        "duration": 810
    }, {
        "date": "2012-01-13",
        "townName": "Salt Lake City",
        "townSize": 12,
        "distance": 425,
        "duration": 670,
        "latitude": 40.75,
        "dashLength": 8,
        "alpha": 0.4
    }, {
        "date": "2012-01-14",
        "latitude": 36.1,
        "duration": 470,
        "townName": "Las Vegas",
        "townName2": "Las Vegas"
    }, {
        "date": "2012-01-15"
    }, {
        "date": "2012-01-16"
    }, {
        "date": "2012-01-17"
    }, {
        "date": "2012-01-18"
    }, {
        "date": "2012-01-19"
    }],
    "valueAxes": [{
        "id": "distanceAxis",
        "axisAlpha": 0,
        "gridAlpha": 0,
        "position": "left",
        "title": "distance"
    }, {
        "id": "latitudeAxis",
        "axisAlpha": 0,
        "gridAlpha": 0,
        "labelsEnabled": false,
        "position": "right"
    }, {
        "id": "durationAxis",
        "duration": "mm",
        "durationUnits": {
            "hh": "h ",
            "mm": "min"
        },
        "axisAlpha": 0,
        "gridAlpha": 0,
        "inside": true,
        "position": "right",
        "title": "duration"
    }],
    "graphs": [{
        "alphaField": "alpha",
        "balloonText": "[[value]] miles",
        "dashLengthField": "dashLength",
        "fillAlphas": 0.7,
        "legendPeriodValueText": "total: [[value.sum]] mi",
        "legendValueText": "[[value]] mi",
        "title": "distance",
        "type": "column",
        "valueField": "distance",
        "valueAxis": "distanceAxis"
    }, {
        "balloonText": "latitude:[[value]]",
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "useLineColorForBulletBorder": true,
        "bulletColor": "#FFFFFF",
        "bulletSizeField": "townSize",
        "dashLengthField": "dashLength",
        "descriptionField": "townName",
        "labelPosition": "right",
        "labelText": "[[townName2]]",
        "legendValueText": "[[description]]/[[value]]",
        "title": "latitude/city",
        "fillAlphas": 0,
        "valueField": "latitude",
        "valueAxis": "latitudeAxis"
    }, {
        "bullet": "square",
        "bulletBorderAlpha": 1,
        "bulletBorderThickness": 1,
        "dashLengthField": "dashLength",
        "legendValueText": "[[value]]",
        "title": "duration",
        "fillAlphas": 0,
        "valueField": "duration",
        "valueAxis": "durationAxis"
    }],
    "chartCursor": {
        "categoryBalloonDateFormat": "DD",
        "cursorAlpha": 0.1,
        "cursorColor":"#000000",
         "fullWidth":true,
        "valueBalloonsEnabled": false,
        "zoomable": false
    },
    "dataDateFormat": "YYYY-MM-DD",
    "categoryField": "date",
    "categoryAxis": {
        "dateFormats": [{
            "period": "DD",
            "format": "DD"
        }, {
            "period": "WW",
            "format": "MMM DD"
        }, {
            "period": "MM",
            "format": "MMM"
        }, {
            "period": "YYYY",
            "format": "YYYY"
        }],
        "parseDates": true,
        "autoGridCount": false,
        "axisColor": "#555555",
        "gridAlpha": 0.1,
        "gridColor": "#FFFFFF",
        "gridCount": 50
    },
    "export": {
    	"enabled": true
     }
});
</script>





<div class="eg">
<div class="egview">

<h5>3D Donut Chart</h5>
<div id="chartdiv04" style="height:300px;"></div>

</div>
</div>

<script>
var chart04 = AmCharts.makeChart( "chartdiv04", {
  "type": "pie",
  "theme": "light",
  "titles": [ {
    "text": "Visitors countries",
    "size": 16
  } ],
  "dataProvider": [ {
    "country": "United States",
    "visits": 7252
  }, {
    "country": "China",
    "visits": 3882
  }, {
    "country": "Japan",
    "visits": 1809
  }, {
    "country": "Germany",
    "visits": 1322
  }, {
    "country": "United Kingdom",
    "visits": 1122
  }, {
    "country": "France",
    "visits": 414
  }, {
    "country": "India",
    "visits": 384
  }, {
    "country": "Spain",
    "visits": 211
  } ],
  "valueField": "visits",
  "titleField": "country",
  "startEffect": "elastic",
  "startDuration": 0,
  "labelRadius": 15,
  "innerRadius": "50%",
  "depth3D": 10,
  "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
  "angle": 15,
  "export": {
    "enabled": true
  }
} );
jQuery( '.chart-input' ).off().on( 'input change', function() {
  var property = jQuery( this ).data( 'property' );
  var target = chart;
  var value = Number( this.value );
  chart.startDuration = 0;

  if ( property == 'innerRadius' ) {
    value += "%";
  }

  target[ property ] = value;
  chart.validateNow();
} );
</script>









<div class="eg">
<div class="egview">

<h5>Angular Gauge</h5>
<div id="chartdiv05" style="height:300px;"></div>

</div>
</div>

<script>
var gaugeChart = AmCharts.makeChart( "chartdiv05", {
  "type": "gauge",
  "theme": "light",
  "axes": [ {
    "axisThickness": 1,
    "axisAlpha": 0.2,
    "tickAlpha": 0.2,
    "valueInterval": 20,
    "bands": [ {
      "color": "#84b761",
      "endValue": 90,
      "startValue": 0
    }, {
      "color": "#fdd400",
      "endValue": 130,
      "startValue": 90
    }, {
      "color": "#cc4748",
      "endValue": 220,
      "innerRadius": "95%",
      "startValue": 130
    } ],
    "bottomText": "0 km/h",
    "bottomTextYOffset": -20,
    "endValue": 220
  } ],
  "arrows": [ {} ],
  "export": {
    "enabled": true
  }
} );

setInterval( randomValue, 2000 );

// set random value
function randomValue() {
  var value = Math.round( Math.random() * 200 );
  if ( gaugeChart ) {
    if ( gaugeChart.arrows ) {
      if ( gaugeChart.arrows[ 0 ] ) {
        if ( gaugeChart.arrows[ 0 ].setValue ) {
          gaugeChart.arrows[ 0 ].setValue( value );
          gaugeChart.axes[ 0 ].setBottomText( value + " km/h" );
        }
      }
    }
  }
}
</script>


### 디렉토리 구조

amcharts 라이브러리 전체 구성은 아래와 같습니다.

```
* 라이브러리 내 amCharts 폴더 위치

AlopexUI_library
    ┣━ css
	┗━ script
	       ┗━━ src
	             ┗━ amcharts (folder)


* amCharts 폴더 구조

amcharts (folder)
	┣━ amcharts.js
	┣━ funnel.js
	┣━ gantt.js
	┣━ gauge.js
	┣━ pie.js
	┣━ radar.js
	┣━ serial.js
	┣━ xy.js
	┣━ images (folder)
	┣━ lang (folder)
	┣━ patterns (folder)
	┣━ plugins (folder)
	┗━ themes (folder)	             
```

### 적용

amcharts 라이브러리 적용 방법입니다.  
아래와 같이 필수/선택적으로 적용하도록 합니다.  

#### serial 차트 구현 시
```
<script src="{path}/script/lib/alopex/src/amcharts/amcharts.js"></script> <!-- 공통 (필수) -->
<script src="{path}/script/lib/alopex/src/amcharts/serial.js"></script> <!-- serial 차트 (선택) -->
<script src="{path}/script/lib/alopex/src/amcharts/themes/light.js"></script> <!-- 테마 (선택) -->
```

#### pie 차트 구현 시
```
<script src="{path}/script/lib/alopex/src/amcharts/amcharts.js"></script> <!-- 공통 (필수) -->
<script src="{path}/script/lib/alopex/src/amcharts/pie.js"></script> <!-- pie 차트 (선택) -->
<script src="{path}/script/lib/alopex/src/amcharts/themes/light.js"></script> <!-- 테마 (선택) -->
```

#### gauge 차트 구현 시
```
<script src="{path}/script/lib/alopex/src/amcharts/amcharts.js"></script> <!-- 공통 (필수) -->
<script src="{path}/script/lib/alopex/src/amcharts/gauge.js"></script> <!-- gauge 차트 (선택) -->
<script src="{path}/script/lib/alopex/src/amcharts/themes/light.js"></script> <!-- 테마 (선택) -->
```

> 다른 여러 가지 차트에 대한 필수/선택적 적용 방법은 [amCharts Demo](https://www.amcharts.com/demos/) 화면을 통해 확인하신 후,  
> 구현하고자 하는 차트에 필요한 라이브러리만 적용할 수 있도록 해야 합니다.

## Attribute

- AmCharts.makeChart() API 를 통해 차트를 생성 합니다.  
- AmCharts.makeChart() API 첫 번째 인자는 차트를 생성하고자하는 DIV 엘리먼트의 ID(string type) 입니다. 이러한 DIV를 container라 부릅니다.  
- AmCharts.makeChart() API 두 번째 인자는 차트 설정(object type)입니다.  설정은 크게 아래와 같이 구분할 수 있겠습니다.  
- 아래의 serial 차트 샘플 코드를 통해 차트 설정 부분을 확인하시기 바랍니다. 
 
	- **전체 차트 설정 부분** - "type": "serial", "marginRight": 70, ...
	- **차트 data 부분** - "dataProvider": [ ... ]
	- **그래프 설정 부분** - "graphs": [ ... ]
	- **axis(축) 설정 부분** : "categoryField": "country", "categoryAxis": { ... }  
	
	


```
// serial 차트 샘플 코드
var chart = AmCharts.makeChart("chartdiv", {
  "type": "serial",
  "theme": "light",
  "marginRight": 70,
  "dataProvider": [{
    "country": "USA",
    "visits": 3025,
    "color": "#FF0F00"
  }, {
    "country": "China",
    "visits": 1882,
    "color": "#FF6600"
  }, {
    "country": "Japan",
    "visits": 1809,
    "color": "#FF9E01"
  }, {
    "country": "Germany",
    "visits": 1322,
    "color": "#FCD202"
  }, {
    "country": "UK",
    "visits": 1122,
    "color": "#F8FF01"
  }, {
    "country": "France",
    "visits": 1114,
    "color": "#B0DE09"
  }, {
    "country": "India",
    "visits": 984,
    "color": "#04D215"
  }, {
    "country": "Spain",
    "visits": 711,
    "color": "#0D8ECF"
  }, {
    "country": "Netherlands",
    "visits": 665,
    "color": "#0D52D1"
  }, {
    "country": "Russia",
    "visits": 580,
    "color": "#2A0CD0"
  }, {
    "country": "South Korea",
    "visits": 443,
    "color": "#8A0CCF"
  }, {
    "country": "Canada",
    "visits": 441,
    "color": "#CD0D74"
  }],
  "valueAxes": [{
    "axisAlpha": 0,
    "position": "left",
    "title": "Visitors from country"
  }],
  "startDuration": 0,
  "graphs": [{
    "balloonText": "<b>[[category]]: [[value]]</b>",
    "fillColorsField": "color",
    "fillAlphas": 0.9,
    "lineAlpha": 0.2,
    "type": "column",
    "valueField": "visits"
  }],
  "chartCursor": {
    "categoryBalloonEnabled": false,
    "cursorAlpha": 0,
    "zoomable": false
  },
  "categoryField": "country",
  "categoryAxis": {
    "gridPosition": "start",
    "labelRotation": 45
  },
  "export": {
    "enabled": true
  }

});
```


### type {string}

- 해당 차트 종류를 설정합니다. serial, pie, gauge, ...

### theme {string}

- 해당 차트의 테마를 설정합니다. light, dark, chalk, patterns

### dataProvider {array}

- 해당 차트의 데이터를 set 합니다. 특정 데이터의 key가 차트의 categoryField 및 valueField 가 될 수 있습니다.


### startDuration {number}

- 해당 차트를 그릴 때 애니메이션 효과의 시간을 설정합니다.  
- startDuration: 0.5 (0.5초) / startDuration: 1 (1초) 

### chartCursor {object}

- 해당 차트 상의 마우스 움직임에 대한 커서 형태를 설정합니다. [chartCursor 상세](https://docs.amcharts.com/3/javascriptcharts/ChartCursor) 참고.

```
var chart = AmCharts.makeChart("chartdiv",{
  ...
  "chartCursor": {
    "oneBalloonOnly": true
  }
});
```

### graphs {object}

- 해당 차트의 데이터 시각화(line, column, step line, smoothed line, olhc and candlestick) 설정입니다. [graphs 상세](https://docs.amcharts.com/3/javascriptcharts/AmGraph) 참고.

```
var chart = AmCharts.makeChart("chartdiv",{
  ...
  "graphs": [
    {
      "id"      : "AmGraph-1",
      "title"   : "Column graph",
      "type"    : "column",
      "valueField"  : "column-1",
      "fillAlphas"  : 1
    }
  ]
});
```


### valueAxes {object}

- 해당 차트의 x,y 축 중 value 축 관련 설정입니다. [valueAxes 상세](https://docs.amcharts.com/3/javascriptcharts/ValueAxis) 참고.

```
var chart = AmCharts.makeChart("chartdiv",{
  ...
  "valueAxes": [
    {
      "title": "Axis title"
    }
  ]
});
```



### categoryField {string}

- 해당 차트의 x,y 축 중 category 축을 설정합니다. dataProvider 상의 특정 key 값을 지정할 수 있습니다.  
- country 를 category 로 지정한 예시 입니다.

```
var chart = AmCharts.makeChart("chartdiv",{
  ...
    "dataProvider": [{
    "country": "USA",
    "visits": 3025,
    "color": "#FF0F00"
    }],
    "categoryField" : "country"
});
```

### categoryAxis {string}

- 해당 차트의 x,y 축 중 category 축 관련 설정입니다. [categoryAxis 상세](https://docs.amcharts.com/3/javascriptcharts/CategoryAxis) 참고.

```
var chart = AmCharts.makeChart("chartdiv",{
  ...
  "categoryAxis": {
    "gridPosition": "start"
  }
});
```

### export {string}

- image/data 등을 추출 및 annotation/print 기능 추가를 위한 설정입니다.  

```
var chart_export = AmCharts.makeChart("chartdiv_export",{
  ...
  "export": {
    "enabled": true
  }
});
```
<br/>
- export 라이브러리가 필요합니다.  

```
<link rel="stylesheet" href="{path}/script/src/amcharts/plugins/export/export.css" />
<script src="{path}/script/src/amcharts/plugins/export/export.js"></script>
```  

<br/>
- export 코드 샘플의 우측 다운로드 버튼을 확인해 보시기 바랍니다.

<div class="eg">
<div class="egview">
	<div id="chartdiv_export" style="height:300px;"></div>
</div>
```
<div id="chartdiv_export" style="height:300px;"></div>
```
```
var chart_export = AmCharts.makeChart( "chartdiv_export", {
  "type": "serial",
  "theme": "light",
  "dataProvider": [ {
    "country": "USA",
    "visits": 2025
  }, {
    "country": "China",
    "visits": 1882
  }, {
    "country": "Japan",
    "visits": 1809
  }, {
    "country": "Germany",
    "visits": 1322
  }, {
    "country": "UK",
    "visits": 1122
  }, {
    "country": "France",
    "visits": 1114
  }, {
    "country": "India",
    "visits": 984
  }, {
    "country": "Spain",
    "visits": 711
  }, {
    "country": "Netherlands",
    "visits": 665
  }, {
    "country": "Russia",
    "visits": 580
  }, {
    "country": "South Korea",
    "visits": 443
  }, {
    "country": "Canada",
    "visits": 441
  }, {
    "country": "Brazil",
    "visits": 395
  } ],
  "valueAxes": [ {
    "gridColor": "#FFFFFF",
    "gridAlpha": 0.2,
    "dashLength": 0
  } ],
  "gridAboveGraphs": true,
  "startDuration": 0,
  "graphs": [ {
    "balloonText": "[[category]]: <b>[[value]]</b>",
    "fillAlphas": 0.8,
    "lineAlpha": 0.2,
    "type": "column",
    "valueField": "visits"
  } ],
  "chartCursor": {
    "categoryBalloonEnabled": false,
    "cursorAlpha": 0,
    "zoomable": false
  },
  "categoryField": "country",
  "categoryAxis": {
    "gridPosition": "start",
    "gridAlpha": 0,
    "tickPosition": "start",
    "tickLength": 20
  },
  "export": {
    "enabled": true
  }

} );
```
</div>

<script>
var chart_export = AmCharts.makeChart( "chartdiv_export", {
  "type": "serial",
  "theme": "light",
  "dataProvider": [ {
    "country": "USA",
    "visits": 2025
  }, {
    "country": "China",
    "visits": 1882
  }, {
    "country": "Japan",
    "visits": 1809
  }, {
    "country": "Germany",
    "visits": 1322
  }, {
    "country": "UK",
    "visits": 1122
  }, {
    "country": "France",
    "visits": 1114
  }, {
    "country": "India",
    "visits": 984
  }, {
    "country": "Spain",
    "visits": 711
  }, {
    "country": "Netherlands",
    "visits": 665
  }, {
    "country": "Russia",
    "visits": 580
  }, {
    "country": "South Korea",
    "visits": 443
  }, {
    "country": "Canada",
    "visits": 441
  }, {
    "country": "Brazil",
    "visits": 395
  } ],
  "valueAxes": [ {
    "gridColor": "#FFFFFF",
    "gridAlpha": 0.2,
    "dashLength": 0
  } ],
  "gridAboveGraphs": true,
  "startDuration": 0,
  "graphs": [ {
    "balloonText": "[[category]]: <b>[[value]]</b>",
    "fillAlphas": 0.8,
    "lineAlpha": 0.2,
    "type": "column",
    "valueField": "visits"
  } ],
  "chartCursor": {
    "categoryBalloonEnabled": false,
    "cursorAlpha": 0,
    "zoomable": false
  },
  "categoryField": "country",
  "categoryAxis": {
    "gridPosition": "start",
    "gridAlpha": 0,
    "tickPosition": "start",
    "tickLength": 20
  },
  "export": {
    "enabled": true
  }

} );
</script>

### Etc.

- 기타 다양한 설정 방법은 [amCharts API Reference](https://docs.amcharts.com/3/javascriptcharts) 화면을 참고하시기 바랍니다.


## Alopex UI FWK - amCharts 연동


### Request/Response & Chart

form 데이터, chart 데이터를 각각 get 하고, $a.request() API 의 통신 파라미터로 전송하는 예제 입니다.  
response로 받은 데이터를 이용하여 Chart를 갱신 합니다.
		

<div class="eg">
<div class="egview">
	<input id="textId" class="Textinput" value="expenses">
	<button class="Button" id="btn_request">Request</button>
	<br>
	<textarea id="textarea_request" class="Textarea" rows="6" cols="30"></textarea>
	<textarea id="textarea_response" class="Textarea" rows="6" cols="30"></textarea>
	<textarea id="textarea_chart" class="Textarea" rows="6" cols="30"></textarea>
	<div id="chartdiv_request" style="height:300px;"></div>	
</div>
```
	<input id="textId" class="Textinput" value="expenses">
	<button class="Button" id="btn_request">Request</button>
	<div id="chartdiv_request"></div>
```
```
		chart_request = AmCharts.makeChart("chartdiv_request", {
			"type": "serial",
		     "theme": "light",
			"categoryField": "year",
			"rotate": true,
			"startDuration": 0,
			"categoryAxis": {
				"gridPosition": "start",
				"position": "left"
			},
			"trendLines": [],
			"graphs": [
				{
					"balloonText": "Income:[[value]]",
					"fillAlphas": 0.8,
					"id": "AmGraph-1",
					"lineAlpha": 0.2,
					"title": "Income",
					"type": "column",
					"valueField": "income"
				},
				{
					"balloonText": "Expenses:[[value]]",
					"fillAlphas": 0.8,
					"id": "AmGraph-2",
					"lineAlpha": 0.2,
					"title": "Expenses",
					"type": "column",
					"valueField": "expenses"
				}
			],
			"guides": [],
			"valueAxes": [
				{
					"id": "ValueAxis-1",
					"position": "top",
					"axisAlpha": 0
				}
			],
			"allLabels": [],
			"balloon": {},
			"titles": [],
			"dataProvider": [
				{
					"year": 2005,
					"income": 23.5,
					"expenses": 18.1
				},
				{
					"year": 2006,
					"income": 26.2,
					"expenses": 22.8
				},
				{
					"year": 2007,
					"income": 30.1,
					"expenses": 23.9
				},
				{
					"year": 2008,
					"income": 29.5,
					"expenses": 25.1
				},
				{
					"year": 2009,
					"income": 24.6,
					"expenses": 25
				}
			],
		    "export": {
		    	"enabled": true
		     }

		});

		$("#btn_request").click(function(){
			
		    $a.request.setup({
		        url : function(id, param) {
		           return 'http://' + location.host + '/2.3/dev-thirdparty/chart/' + id; // $a.request 서비스 ID가 적용될 것이다
		        },
		        method: 'post',
		        timeout: 30000,
		        before: function(id, option) {
		            $("#textarea_request").val("request data :\n\n" + JSON.stringify(this.data));
		        }
		    });	
		    
		    $a.request('chartData01.json', { // 서비스 ID
		    	
		        data : {textData : $("#textId").val(), chartData : chart_request.dataProvider},
		        success : function(res) {
		            // 통신이 성공적으로 이루어 진 경우 호출되는 콜백함수
		            
		            $("#textarea_response").val("success response data :: \n\n" + JSON.stringify(res));
		            
		            $("#textId").val(res.textData);
		            
		            chart_request = AmCharts.makeChart("chartdiv_request", {
							"type": "serial",
						     "theme": "light",
							"categoryField": "year",
							"rotate": true,
							"startDuration": 0,
							"categoryAxis": {
								"gridPosition": "start",
								"position": "left"
							},
							"trendLines": [],
							"graphs": [
								{
									"balloonText": "Income:[[value]]",
									"fillAlphas": 0.8,
									"id": "AmGraph-1",
									"lineAlpha": 0.2,
									"title": "Income",
									"type": "column",
									"valueField": "income"
								},
								{
									"balloonText": "Expenses:[[value]]",
									"fillAlphas": 0.8,
									"id": "AmGraph-2",
									"lineAlpha": 0.2,
									"title": "Expenses",
									"type": "column",
									"valueField": "expenses"
								}
							],
							"guides": [],
							"valueAxes": [
								{
									"id": "ValueAxis-1",
									"position": "top",
									"axisAlpha": 0
								}
							],
							"allLabels": [],
							"balloon": {},
							"titles": [],
							"dataProvider": res.chartData,
						    "export": {
						    	"enabled": true
						     }
				
						});

		        },

		        fail : function(res) {
		            // 통신은 성공적으로 이루어 졌으나, 서버오류가 발생한 경우 호출되는 콜백함수
		            alert("fail!!\n\nres :: \n\n" + JSON.stringify(errObject));
		        },

		        error : function(errObject) {
		            // 통신이 실패한 경우 호출되는 콜백함수
		            alert("error!!\n\nres :: \n\n" + JSON.stringify(errObject));
		        }
		    });
		    
		    
		});	
	
```
</div>
<script>
		chart_request = AmCharts.makeChart("chartdiv_request", {
			"type": "serial",
		     "theme": "light",
			"categoryField": "year",
			"rotate": true,
			"startDuration": 0,
			"categoryAxis": {
				"gridPosition": "start",
				"position": "left"
			},
			"trendLines": [],
			"graphs": [
				{
					"balloonText": "Income:[[value]]",
					"fillAlphas": 0.8,
					"id": "AmGraph-1",
					"lineAlpha": 0.2,
					"title": "Income",
					"type": "column",
					"valueField": "income"
				},
				{
					"balloonText": "Expenses:[[value]]",
					"fillAlphas": 0.8,
					"id": "AmGraph-2",
					"lineAlpha": 0.2,
					"title": "Expenses",
					"type": "column",
					"valueField": "expenses"
				}
			],
			"guides": [],
			"valueAxes": [
				{
					"id": "ValueAxis-1",
					"position": "top",
					"axisAlpha": 0
				}
			],
			"allLabels": [],
			"balloon": {},
			"titles": [],
			"dataProvider": [
				{
					"year": 2005,
					"income": 23.5,
					"expenses": 18.1
				},
				{
					"year": 2006,
					"income": 26.2,
					"expenses": 22.8
				},
				{
					"year": 2007,
					"income": 30.1,
					"expenses": 23.9
				},
				{
					"year": 2008,
					"income": 29.5,
					"expenses": 25.1
				},
				{
					"year": 2009,
					"income": 24.6,
					"expenses": 25
				}
			],
		    "export": {
		    	"enabled": true
		     }

		});

		$("#btn_request").click(function(){
			
		    $a.request.setup({
		        url : function(id, param) {
		           return 'http://' + location.host + '/2.3/dev-thirdparty/chart/' + id; // $a.request 서비스 ID가 적용될 것이다
		        },
		        method: 'post',
		        timeout: 30000,
		        before: function(id, option) {
		           $("#textarea_request").val("request data :\n\n" + JSON.stringify(this.data));
		        }
		    });	
		    
		    $a.request('chartData01.json', { // 서비스 ID
		    	
		        data : {textData : $("#textId").val(), chartData : chart_request.dataProvider},
		        success : function(res) {
		            // 통신이 성공적으로 이루어 진 경우 호출되는 콜백함수
		            $("#textarea_response").val("success response data :: \n\n" + JSON.stringify(res));
		            
		            $("#textId").val(res.textData);
		            
		            chart_request = AmCharts.makeChart("chartdiv_request", {
							"type": "serial",
						     "theme": "light",
							"categoryField": "year",
							"rotate": true,
							"startDuration": 0,
							"categoryAxis": {
								"gridPosition": "start",
								"position": "left"
							},
							"trendLines": [],
							"graphs": [
								{
									"balloonText": "Income:[[value]]",
									"fillAlphas": 0.8,
									"id": "AmGraph-1",
									"lineAlpha": 0.2,
									"title": "Income",
									"type": "column",
									"valueField": "income"
								},
								{
									"balloonText": "Expenses:[[value]]",
									"fillAlphas": 0.8,
									"id": "AmGraph-2",
									"lineAlpha": 0.2,
									"title": "Expenses",
									"type": "column",
									"valueField": "expenses"
								}
							],
							"guides": [],
							"valueAxes": [
								{
									"id": "ValueAxis-1",
									"position": "top",
									"axisAlpha": 0
								}
							],
							"allLabels": [],
							"balloon": {},
							"titles": [],
							"dataProvider": res.chartData,
						    "export": {
						    	"enabled": true
						     }
				
						});
						
						$("#textarea_chart").val("get chart data :: \n\n" + JSON.stringify(chart_request.dataProvider));
		        },

		        fail : function(res) {
		            // 통신은 성공적으로 이루어 졌으나, 서버오류가 발생한 경우 호출되는 콜백함수
		           $("#textarea_response").val("fail!! :: \n\n" + JSON.stringify(errObject));
		           $("#textarea_chart").val("get chart data :: \n\n" + JSON.stringify(chart_request.dataProvider));
		        },

		        error : function(errObject) {
		            // 통신이 실패한 경우 호출되는 콜백함수
		            $("#textarea_response").val("error!! :: \n\n" + JSON.stringify(errObject));
		            $("#textarea_chart").val("get chart data :: \n\n" + JSON.stringify(chart_request.dataProvider));
		        }
		    });
		    
		    
		});	
</script>



### Popup & Chart

통신 response의 success callback에서 받은 parameter를 이용하여 chart를 생성 합니다.
	
<div class="eg">
<div class="egview">
	<button class="Button" id="btn_popup">Popup</button>	
</div>
```
	<button class="Button" id="btn_popup">Popup</button>	
```

```
	$("#btn_popup").click(function(){
		$a.popup({
				title: "Chart in Popup",
		        url: "/2.3/dev-thirdparty/chart/chart_popup.html",
		        width: 600,
		        height: 600,
		        data : {
		        	chartData : [{
							        "name": "John",
							        "startTime": 8,
							        "endTime": 11,
							        "color": "#FF0F00"
							    }, {
							        "name": "Joe",
							        "startTime": 10,
							        "endTime": 13,
							        "color": "#FF9E01"
							    }, {
							        "name": "Susan",
							        "startTime": 11,
							        "endTime": 18,
							        "color": "#F8FF01"
							    }, {
							        "name": "Eaton",
							        "startTime": 15,
							        "endTime": 19,
							        "color": "#04D215"
							    }]
		        }
		});
	});
	
```
</div>
<script>
	$("#btn_popup").click(function(){
		$a.popup({
				title: "Chart in Popup",
		        url: "/2.3/dev-thirdparty/chart/chart_popup.html",
		        iframe: false,
		        width: 600,
		        height: 350,
		        data : {
		        	chartData : [{
							        "name": "John",
							        "startTime": 8,
							        "endTime": 11,
							        "color": "#FF0F00"
							    }, {
							        "name": "Joe",
							        "startTime": 10,
							        "endTime": 13,
							        "color": "#FF9E01"
							    }, {
							        "name": "Susan",
							        "startTime": 11,
							        "endTime": 18,
							        "color": "#F8FF01"
							    }, {
							        "name": "Eaton",
							        "startTime": 15,
							        "endTime": 19,
							        "color": "#04D215"
							    }]
		        }
		});
	});
	
</script>