
!function($) {
	if(!window.alopexController) { // alopex_controller polyfill
		function isValid(arg) {
			if (arg == undefined || arg == null) {
				return false;
			} else {
				return true;
			}
		}
		function MemoryPreference() {
			this.data;
			if(!sessionStorage.alopex) {
				sessionStorage.alopex = "";
			}
			this.data = sessionStorage.alopex;
		}

		MemoryPreference.prototype.setData = function(data) {
			this.data = data;
			sessionStorage.alopex = data;
		}
		MemoryPreference.prototype.contains = function(key) {
			if (isValid(key)) {
				if (this.data.indexOf("ù") != -1) {
					var keys = this.data.split("ù")[0];
					var keyArray = keys.split("♠");

					for ( var i = 0; i < keyArray.length; i++) {
						if (keyArray[i] == "mp-" + key || keyArray[i] == "mp-json-" + key) {
							return true;
						}
					}
				}
				return false;
			}
		};
		MemoryPreference.prototype.get = function(key) {
			if (isValid(key)) {
				if (this.data.indexOf("ù") != -1) {
					var keys = this.data.split("ù")[0];
					var values = this.data.split("ù")[1];
					var keyArray = keys.split("♠");
					var valueArray = values.split("♠");

					for ( var i = 0; i < keyArray.length; i++) {
						if (keyArray[i] == "mp-" + key) {
							return valueArray[i];
						}
						else if(keyArray[i] == "mp-json-" + key){
							return _parseJsonWithValidation(valueArray[i]);
						}
					}
				}
				return "undefined";
			} else {
				return "undefined";
			}
		};
		MemoryPreference.prototype.put = function(key, value) {
			if (isValid(key) && isValid(value)) {
				
				if(!(Object.prototype.toString.call(value) === '[object String]') && ($.isArray(value) || value.constructor == Object)){
					value = _stringifyJsonWithValidation(value);
					key = "json-" + key;
				}
					if (this.data.indexOf("ù") != -1) {
						var keys = this.data.split("ù")[0];
						var values = this.data.split("ù")[1];
						var keyArray = keys.split("♠");
						var valueArray = values.split("♠");

						for ( var i = 0; i < keyArray.length; i++) {
							if (keyArray[i] == "mp-" + key) {
								valueArray[i] = value;
								this.setData(keyArray.join("♠") + "ù" +	valueArray.join("♠"));
								return;
							}
						}
						keyArray.push("mp-" + key);
						valueArray.push(value);

						this.setData(keyArray.join("♠") + "ù" +	valueArray.join("♠"));
					} else {
						this.setData("mp-" + key + "ù" + value);
					}
				
			}
		};

		MemoryPreference.prototype.remove = function(key) {
			if (isValid(key)) {

				var keys = this.data.split("ù")[0];
				var values = this.data.split("ù")[1];

				if (keys != null && values != null) {
					var keyArray = keys.split("♠");
					var valueArray = values.split("♠");

					for ( var i = 0; i < keyArray.length; i++) {
						if (keyArray[i] == ("mp-" + key) || keyArray[i] == "mp-json-" + key) {
							keyArray.splice(i, 1);
							valueArray.splice(i, 1);
							this.setData(keyArray.join("♠") + "ù" + valueArray.join("♠"));
							return;
						}
					}
				}
			}
		};

		MemoryPreference.prototype.removeAll = function() {
			var keys = this.data.split("ù")[0];
			var values = this.data.split("ù")[1];

			if (keys != null && values != null) {
				var keyArray = keys.split("♠");
				var valueArray = values.split("♠");

				var len = keyArray.length;
				for ( var i = 0; i < len; i++) {
					if (keyArray[i] != null) {
						if (keyArray[i].substring(0, 3) == "mp-" || keyArray[i].substring(0, 8) == "mp-json-") {
							keyArray.splice(i, 1);
							valueArray.splice(i, 1);
							i--;
							len--;
						}
					}
				}
				this.setData(keyArray.join("♠") + "ù" + valueArray.join("♠"));
			}
		};
		
		if(!window.memoryPreference) {
			window.memoryPreference = new MemoryPreference();
		}
		

		function Preference() {
		}

		Preference.prototype.contains = function(key) {
			if (isValid(key)) {
				return (preference.get(key) !== undefined && preference.get(key) !== 'undefined');
			}
			return false;
		};

		/*
		 * source from jQuery Cookie Plugin v1.3(MIT)
		 * https://github.com/carhartl/jquery-cookie
		 */

		Preference.prototype.get = function(key) {

			if (isValid(key)) {

				var decode = function(s) {
					return decodeURIComponent(s.replace(/\+/g, ' '));
				}

				var cookies = document.cookie.split('; ');
				for ( var i = 0, l = cookies.length; i < l; i++) {
					var parts = cookies[i].split('=');
					var part = parts.shift();
					if (decode(part) === key) {
						var cookie = decode(parts.join('='));
						return cookie;
					}
				}

				return undefined;
			}
		};

		Preference.prototype.put = function(key, value, expires) {

			if (isValid(key)) {
				if (typeof expires === 'number') {
					var days = expires, t = expires = new Date();
					t.setDate(t.getDate() + days);
				}
				document.cookie = [encodeURIComponent(key), '=',
						encodeURIComponent(value),
						expires ? '; expires=' + expires.toUTCString() : '' // use expires attribute, max-age is not supported by IE
				].join('');

			}
		};

		Preference.prototype.remove = function(key) {
//			console.log("[Preference/remove]");
			if (isValid(key)) {
				if (preference.get(key) !== undefined) {
					preference.put(key, undefined);
				}
			}
		};

		Preference.prototype.removeAll = function() {
//			console.log("[Preference/removeAll]");
			notSupported("Preference.removeAll");
		};
		
		if(!window.preference) {
			window.preference = new Preference();
		}
		
		function _parseJsonWithValidation(jsonString){
			var result = null;
			try{
				result = JSON.parse(jsonString);
				return result; 
			}catch(err){
				console.error("JSON.parse() error : " + jsonString);
				return false;
			}
		}
		
		function _stringifyJsonWithValidation(jsonObject){
			var result = null;
			try{
				result = JSON.stringify(jsonObject);
				return result; 
			}catch(err){
				console.error("JSON.stringify() error");
				console.error(jsonObject);
				return false;
			}
		}
	}
	
}(jQuery);
