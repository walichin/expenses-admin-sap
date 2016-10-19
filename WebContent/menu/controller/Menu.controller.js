sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	
	return Controller.extend("com.ittumi.compgastos.menu.controller.Menu", {
		
		onInit : function () {
			console.log("onInit called - com.ittumi.compgastos.menu.controller.Menu");
			
			var oView = this.getView();
			
	        sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
	        	var sRoute = oEvent.getParameter("name");
	        	console.log("sRoute:" + sRoute);
	        	if ("menu" === sRoute) {
		        	oView.setModel(new sap.ui.model.json.JSONModel(sap.ui.getCore().User),'context');
	        	}
	        });	
	        
		},
		
		createContent: function() {
			console.log('createContent called -  com.ittumi.compgastos.menu.controller.Menu');
		},
		
		onPress: function(evt) {
			console.log('onPress called -  com.ittumi.compgastos.menu.controller.Menu');
			console.log('component:' + evt.getSource().getProperty('title'));
			
			var title = evt.getSource().getProperty('title');
			var oRouter = sap.ui.core.routing.Router.getRouter("app");
			
			if ("Anticipos" === title) {
				oRouter.navTo("_anticipos",{},false);	
			} else if("Comprobaciones" === title) {
				oRouter.navTo("_comprobaciones",{},false);
			} else if ("Estado Cuenta" === title) {
				oRouter.navTo("_estadocuenta",{},false);
			} else if ("Presupuesto" === title) {
				oRouter.navTo("_presupuesto",{},false);
			}
			
		},
	
		onLogout: function(evt) {
			console.log('onLogout called -  com.ittumi.compgastos.menu.controller.Menu');
			var oRouter = sap.ui.core.routing.Router.getRouter("app");
			oRouter.navTo("_login",{},false);			
		}
	});

});
	
