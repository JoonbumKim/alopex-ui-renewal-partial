//window.aa = function(){
//	console.log(111);
//};
		
$a.page(function() {
    // 초기화 함수
    this.init = function(id, param) {
    	var chart_pupup = AmCharts.makeChart("chartdiv_pupup", {
			"theme": "light",
		    "type": "serial",
		    "dataProvider": param.chartData,
		    "startDuration": 0,
		    "graphs": [{
		        "balloonText": "<b>[[category]]</b><br>starts at [[startTime]]<br>ends at [[endTime]]",
		        "colorField": "color",
		        "fillAlphas": 0.8,
		        "lineAlpha": 0,
		        "openField": "startTime",
		        "type": "column",
		        "valueField": "endTime"
		    }],
		    "rotate": true,
		    "columnWidth": 1,
		    "categoryField": "name",
		    "categoryAxis": {
		        "gridPosition": "start",
		        "axisAlpha": 0,
		        "gridAlpha": 0.1,
		        "position": "left"
		    },
		    "export": {
		    	"enabled": true
		     }
		});
		
		
	}; // init end
}); // $a.page end