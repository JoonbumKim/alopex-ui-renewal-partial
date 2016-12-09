$.alopex.service.setup({
	platform : "NEXCORE.J2EE", // TODO to common code
	url : "/service",
	method : "POST",
	after : [function(res) {
		if (res) {
			var menuInfo = res.__MENUINFO__;
			if (menuInfo !== undefined) {

				MenuHelper.saveResponse(menuInfo);
				$a.view('base/header').render();
				$a.view('base/left').render();
			}
		} else {
			console.log('[after] invalid response!');
		}
	}]
});


