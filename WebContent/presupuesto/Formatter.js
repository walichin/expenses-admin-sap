sap.ui.define([
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/format/NumberFormat"
	], function(DateFormat, NumberFormat) {
	"use strict";

	var Formatter = {};

	Formatter.time = function(value) {
		//console.log(value);
		if (value) {

			var date = new Date(value.ms);
			// console.log("date po value.ms: "+ date);
			var timeinmiliseconds = date.getTime(); // date.getTime();
			// //date.getSeconds();
			// //date.getTime();
			// console.log(timeinmiliseconds);
			var oTimeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
				pattern : "KK:mm a" // "KK:mm:ss a"
			});
			var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
			// console.log(TZOffsetMs);
			var timeStr = oTimeFormat.format(new Date(timeinmiliseconds + TZOffsetMs));
			// console.log(timeStr);

			return timeStr;
		} else {
			return value;
		}
	};

	Formatter.total = function(results) {
		if (results) return results.length;
		return "0";
	};
	
	Formatter.pad = function(str, max) {
		str = str.toString();
		return str.length < max ? Formatter.pad("0" + str, max) : str;
	};

	Formatter.amount = function(str) {
		var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
		  maxFractionDigits: 2,
		  groupingEnabled: true,
		  groupingSeparator: ",",
		  decimalSeparator: "."
		});
		
		var value = oNumberFormat.parse(str);
		return value;
		
	};
	
	return Formatter;

}, true);
