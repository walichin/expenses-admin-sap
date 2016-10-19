jQuery.sap.declare("util.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("sap.ui.core.format.NumberFormat");

util.Formatter = {};

util.Formatter.imgXmlPdf = function(oValue){
	
	//application/xml
	if(oValue.indexOf('xml')!= -1){
		return "img/xml.png";
	}
	else if(oValue.indexOf('pdf')!= -1){
		return "img/pdf.png";
	}
	else return null;
	
};

util.Formatter.check_Archivo = function(oValue){
	
	if(oValue == "@5B@")
		return true;
	else
		return false;
};


util.Formatter.time = function(oValue){
	if (oValue) {
		var date = new Date(oValue.ms);
		// console.log("date po value.ms: "+ date);
		var timeinmiliseconds = date.getTime(); // date.getTime();
		var oTimeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
			pattern : "KK:mm a" // "KK:mm:ss a"
		});
		var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
		// console.log(TZOffsetMs);
		var timeStr = oTimeFormat.format(new Date(timeinmiliseconds + TZOffsetMs));
		// console.log(timeStr);
		return timeStr;
	} else {
		return oValue;
	}
};