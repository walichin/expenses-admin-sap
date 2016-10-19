sap.ui.define([
	'sap/ui/core/UIComponent'
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("com.ittumi.compgastos.estadocuenta.Component", {
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
					"viewType": "XML",
					"viewPath": "com.ittumi.compgastos.estadocuenta.view",
					"targetControl": "EstadoCuentaPage", // This is the control in which new views are placed
					"targetAggregation": "pages", // This is the aggregation in which the new views will be placed
					"clearTarget": false
				},
				routes: [{
					name: "list",
					pattern: "estadocuenta/",
					view: "EstadoCuentaList"
				}, {
					name: "details",
					pattern: "estadocuenta/{entity}",
					view: "DetailEstadoCuenta",
				}]
			}			
		},
		
		/**
		 * Initialize the application
		 *
		 * @returns {sap.ui.core.Control} the content
		 */
		createContent: function() {
			console.log('createContent called -  com.ittumi.compgastos.estadocuenta.Component');
			return new sap.m.App ("EstadoCuentaPage",{});
		},
		
		onAfterRendering: function() {
			console.log('onAfterRendering called -  com.ittumi.compgastos.estadocuenta.Component');
			
			var oReferenceModel = new sap.ui.model.json.JSONModel({});
			this.setModel(oReferenceModel,'reference');		
			
			var oModel = this.getModel('reference');
			
			this.getModel('estadocuenta').callFunction("CompanyList", "GET", {'Userweb':sap.ui.getCore().User.userWeb, 'Language':'S'}, null, function(oData, oResponse) {
				oModel.setData({'SociedadList':oData.results},true);
			}, function(oError) {
				console.log(oError);
			});	
			
		},		
		
		init: function() {
			console.log('init called -  com.ittumi.compgastos.estadocuenta.Component');
			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
			
			var oDataUrl = "proxy/sap/opu/odata/sap/Y10_EXPMAN_SRV/";			
			var oModel = new sap.ui.model.odata.ODataModel(oDataUrl, true);
			
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			sap.ui.getCore().setModel(oModel,'estadocuenta');
			this.setModel(oModel,'estadocuenta');	
			
			// Model para parametros iniciales
			var oParametersModel = new sap.ui.model.json.JSONModel();
			oParametersModel.setData({
				bukrs : '1000'
			});
			sap.ui.getCore().setModel(oParametersModel,'params');
			this.setModel(oParametersModel,'params');	
			
			var router = this.getRouter();
			this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
			router.initialize();
		},		
		
		destroy: function() {
			console.log('destroy called -  com.ittumi.compgastos.estadocuenta.Component');
			sap.ui.core.routing.Router.prototype.destroy.apply(this, arguments);
			this._oRouteMatchedHandler.destroy();
		}
	});

});
