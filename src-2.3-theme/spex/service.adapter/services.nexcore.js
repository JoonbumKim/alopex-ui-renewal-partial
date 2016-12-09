(function($) {
	
	// 모든 플랫폼이 공통으로 사용하는 로직.
	// 비즈니스 단에서는 해당 로직이 공통으로 사용됨.
	$.alopex.service.setup({
		before : [function(id, data, success, fail, error) { // data
			// parameter 생성.
			this.data = {};
			this.data["attributes"] = {};
			this.data["dataSet"] = {
				"fields" : $.extend(true, {}, data),
				"recordSets" : {}
			};
		}, [true, function() {
			// 서비스 전송 전에 추가 바인딩하는 데이터가 있을 경우 data를 조립
			var dataSet = this.data["dataSet"];
			var args = $.makeArray(arguments);

			$.each(args, function(idx, meta) {
				if (typeof meta === "string" || (meta && meta.jquery && meta.prop('nodeType'))) {
					// 일반 form selector이거나 또는 grid selector. grid selector일땐 id를 자동추출한다 또는 일반 엘리먼트이거나 그리드 엘리먼트 이거나
					var $elem = $(meta);
					if (!$elem.length || !$elem.prop('nodeType'))
						return;
					if (!$elem.prop('id')) {
						// 엘리먼트 ID가 없을때엔 향후 bind-extract를 위해 임의의 id를 배정한다.
						$elem.prop(id, randomId());
					}
					if ($elem.attr('data-alopexgrid')) {
						// 그리드일때의 바인딩은 recordSets에서 추출
						dataSet.recordSets = $.extend(true, dataSet.recordSets, {});
						var recordSets = dataSet.recordSets;
						recordSets[$elem.prop('id')] = gridToRecordSet($elem);
					} else {
						// 일반엘리먼트일 때의 바인딩은 fields에서 추출
						dataSet.fields = $.extend(true, dataSet.fields, {});
						elementToFields($elem, dataSet.fields);
					}
				}
				if ($.isPlainObject(meta)) {
					// id가 지정된 grid
					// selector
					var recordSets = response.data.recordSets;
					if (!recordSets) {
						return;
					}
					$.each(meta, function(id, selector) {
						if ($(selector).attr('data-alopexgrid')) {
							dataSet.recordSets = $.extend(true, dataSet.recordSets, {});
							dataSet.recordSets[$elem.prop('id')] = gridToRecordSet($elem);
						}
					});
				}
			});
		}]],
		after : [],
		success : [
			[true, function() { // define meta processor
		
			// sample implementation
			var response = this;
			var args = $.makeArray(arguments);

			$.each(args, function(idx, meta) {
				if (typeof meta === "string" || (meta && meta.jquery && meta.prop('nodeType'))) {
					// 일반 form selector이거나 또는
					// grid selector. grid
					// selector일땐 id를 자동추출한다
					// 또는 일반 엘리먼트이거나 그리드 엘리먼트
					// 이거나
					var $elem = $(meta);
					if (!$elem.length || !$elem.prop('nodeType'))
						return;
					if (!$elem.prop('id')) {
						// 엘리먼트 ID가 없을때엔 향후
						// bind-extract를 위해 임의의
						// id를 배정한다.
						$elem.prop(id, randomId());
					}
					if ($elem.attr('data-alopexgrid')) {
						// 그리드일때의 바인딩은
						// recordSets에서 추출
						var recordSets = response.data.recordSets;
						if (!recordSets) {
							return;
						}
						if (recordSets.hasOwnProperty($elem.prop('id'))) {
							recordSetToGrid(recordSets[$elem.prop('id')], $elem);
						}
					} else {
						// 일반엘리먼트일 때의 바인딩은
						// fields에서 추출
						var id = $elem.attr('id');
						fieldsToElement(formDataFromData(response.data, id), $elem);
					}
				}
				if ($.isPlainObject(meta)) {
					// id가 지정된 grid selector
					var recordSets = response.data.recordSets;
					if (!recordSets) {
						return;
					}
					$.each(meta, function(id, selector) {
						if (recordSets.hasOwnProperty(id) && $(selector).attr('data-alopexgrid')) {
							recordSetToGrid(recordSets[id], $(selector));
						}
					});
				}
			});
		}]]
	});
	
	// 메타 프로세스에서 사용하는 함수들.
	// 클라이언트에서 작업 시 J2EE와 동일한 데이터 형식으로 작업하는 것을 표준으로 함.

	var seed = (Math.random() * 1000) | 0;
	function randomId() {
		return "J2EE" + seed++;
	}
	// 수신된 recordSet을 grid에 매핑시킨다
	function recordSetToGrid(rs, $elem) {
		var $target = $elem.jquery ? $elem : $($elem);
		if (!isValidElem($elem))
			return;
		if (!rs || !$elem)
			return;
		//
		$elem = $elem || $('#' + tableObject["TableName"]);
		if (!$elem.prop('nodeType'))
			return;
		if (!$elem.attr('data-alopexgrid'))
			return;
		var pobj = rs;
		// DOTO dataSet을 하면서 pagingObject를 넘기게 되면 이후에는 동적 페이징으로 작동한다.
		// 만일 동적 페이징을 사용하지 않고 한번에 모든 데이터를 로드하여 사용한다면
		// dataSet의 두번째 파라메터로 pagingObject를 넘기지 않는다.
		var dynamicpaging = pobj.hasOwnProperty('nc_pageNo') && (pobj['nc_pageNo'] > 0) && pobj.hasOwnProperty('nc_totalRecordCount') && pobj.hasOwnProperty('nc_recordCountPerPage');

		$target.alopexGrid('dataSet', $.isArray(pobj.nc_list) ? pobj.nc_list : [], dynamicpaging ? {
			current : pobj.nc_pageNo,
			total : Math.ceil(1.0 * pobj.nc_totalRecordCount / pobj.nc_recordCountPerPage) | 0,
			perPage : pobj.nc_recordCountPerPage,
			dataLength : pobj.nc_totalRecordCount
		} : null);
	}
	// 그리드로부터 recordSet을 추출한다.
	function recordSetToRecordSets(id, rs, rss) {
		if ($.isPlainObject(rss) && $.isPlainObject(rs) && typeof id === "string") {
			rss[id] = rs;
			return rss;
		}
	}
	function recordSetFromRecordSets(id, rss) {
		if ($.isPlainObject(rss) && typeof id === "string" && rss.hasOwnProperty(id)) {
			return rss[id];
		}
	}
	function gridToRecordSet(grid, rs) {
		var $target = grid.jquery ? grid : $(grid);
		var m_rs = {};
		var nc_list = $target.alopexGrid('dataGet');
		for ( var i = 0, l = nc_list.length; i < l; i++) {
			nc_list[i] = AlopexGrid.trimData(nc_list[i]);
		}
		var pageinfo = $target.alopexGrid('pageInfo');
		m_rs["nc_recordCount"] = nc_list.length;
		m_rs["nc_pageNo"] = pageinfo.current;
		m_rs["nc_recordCountPerPage"] = pageinfo.perPage;
		m_rs["nc_totalRecordCount"] = pageinfo.dataLength;
		m_rs["nc_list"] = nc_list;
		if ($.isPlainObject(rs)) {
			$.extend(true, rs, m_rs);
			return rs;
		}
		return m_rs;
	}

	// recordset을 grid외의 요소에 매핑시킬때의 규칙
	function recordSetToElement(rs, elem) {

	}
	function elementToRecordSet(elem, rs) {

	}

	// dataSet.fields의 값을 일반 databind로 적용
	function fieldsToElement(fields, elem) {
		// $.alopex.page[idselector] = $.alopex.databind(response.data.fields,
		// $target[0]);
		var $elem = (elem && elem.jquery) ? elem : $(elem);
		if (!$elem.length || !$elem.prop('nodeType')) {
			return;
		}
		if($.alopex.page['#' + $elem.prop('id')]) { // 이미 model이 생성된 경우.
			$.alopex.page['#' + $elem.prop('id')].set(fields);
		} else {
			$.alopex.page['#' + $elem.prop('id')] = $.alopex.datamodel($elem, true);
		    $.alopex.page['#' + $elem.prop('id')].set(fields);
		}
		
	}
	function elementToFields(elem, fields) {
		var $elem = (elem && elem.jquery) ? elem : $(elem);
		if (!$elem.length || !$elem.prop('nodeType'))
			return;
		if (!$.alopex.page['#' + $elem.prop('id')]) {
			$.alopex.page['#' + $elem.prop('id')] = $.alopex.datamodel('#' + $elem.prop('id'));
		}
		var model = $.alopex.page['#' + $elem.prop('id')].get();
		if ($.isPlainObject(fields)) {
			$.extend(true, fields, model);
		}
		return model;
	}
	// .NET에서 formdata를 DataSet에 넣는 케이스 고려.
	function formDataFromData(data, id) {
		var fields = $.extend(true, {}, data.fields);
		if (!id) {
			id = 'Table';
		}
		// .NET의 경우, form data의 경우도 datatable로 넘기는 경우가 다수 발생.
		if (data["recordSets"] && data["recordSets"][id] && $.isArray(data["recordSets"][id]["nc_list"])) {
			$.extend(true, fields, data["recordSets"][id]["nc_list"][0]);
		}
		return fields;
	}
	function isValidElem($elem) {
		if (!$elem || !$elem.prop('nodeType'))
			return false;
		return true;
	}
	
})(jQuery);