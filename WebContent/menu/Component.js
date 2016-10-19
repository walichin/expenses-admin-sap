sap.ui.define([
	'sap/ui/core/UIComponent'
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("com.ittumi.compgastos.menu.Component", {
		metadata : {
			dependencies : {
				libs : [
					"sap.ui.table",
					"sap.ui.unified",
					"sap.m",
					"sap.ui.layout"
				]
			},
			routing: {
				config: {
					"routerClass": "sap.m.routing.Router",
					"viewType": "XML",
					"viewPath": "com.ittumi.compgastos.menu.view",
					"targetControl": "MenuPage", // This is the control in which new views are placed
					"targetAggregation": "pages", // This is the aggregation in which the new views will be placed
					"clearTarget": false
				},
				routes: [{
					pattern: "menu/",
					name: "menu",
					view: "Menu"
				}]
			}			
		},
		
		/**
		 * Initialize the application
		 *
		 * @returns {sap.ui.core.Control} the content
		 */
		createContent: function() {
			console.log('createContent called -  com.ittumi.compgastos.menu.Component');
			return new sap.m.App ("MenuPage",{});
		},
		
		init: function() {
			console.log('init called -  com.ittumi.compgastos.menu.Component');
			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
			
			var oModel = new sap.ui.model.json.JSONModel("menu/data.json");
			sap.ui.getCore().setModel(oModel,'menu');
			this.setModel(oModel,'menu');
			
			var router = this.getRouter();
			this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
			router.initialize();
		},		
		
		destroy: function() {
			console.log('destroy called -  com.ittumi.compgastos.menu.Component');
			sap.ui.core.routing.Router.prototype.destroy.apply(this, arguments);
			this._oRouteMatchedHandler.destroy();
		}
	});

});
