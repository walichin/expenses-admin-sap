sap.ui.define([
	'sap/ui/core/UIComponent'
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("com.ittumi.compgastos.login.Component", {
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
					"viewPath": "com.ittumi.compgastos.login.view",
					"targetControl": "LoginPage", // This is the control in which new views are placed
					"targetAggregation": "pages", // This is the aggregation in which the new views will be placed
					"clearTarget": false
				},
				routes: [{
					pattern: "",
					name: "login",
					view: "Login"
				}]
			}			
		},
		
		/**
		 * Initialize the application
		 *
		 * @returns {sap.ui.core.Control} the content
		 */
		createContent: function() {
			console.log('createContent called -  com.ittumi.compgastos.login.Component');
			return new sap.m.App ("LoginPage",{});
		},
		
		init: function() {
			console.log('init called -  com.ittumi.compgastos.login.Component');
			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
			
			var oDataUrl = "proxy/sap/opu/odata/sap/Y10_EXPMAN_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(oDataUrl, true);
			
			sap.ui.getCore().setModel(oModel,'login');
			this.setModel(oModel,'login');
			
			// set i18n model
			var sRootPath = jQuery.sap.getModulePath("com.ittumi.compgastos.anticipos");
			var i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: [sRootPath, "i18n/messageBundle.properties"].join("/")
			});
			
			var bundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp")
			bundle._enhance(i18nModel.getResourceBundle());
			
			var router = this.getRouter();
			this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
			router.initialize();
		},		
		
		destroy: function() {
			console.log('destroy called -  com.ittumi.compgastos.login.Component');
			sap.ui.core.routing.Router.prototype.destroy.apply(this, arguments);
			this._oRouteMatchedHandler.destroy();
		}
	});

});
