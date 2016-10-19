sap.ui.define([
	"sap/ui/core/UIComponent"
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("com.ittumi.compgastos.presupuesto.Component", {
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
					"viewPath": "com.ittumi.compgastos.presupuesto.view",
					"targetControl": "PresupuestoPage", // This is the control in which new views are placed
					"targetAggregation": "pages", // This is the aggregation in which the new views will be placed
					"clearTarget": false
				},
				routes: [{
					name: "list",
					pattern: "presupuesto/",
					view: "PresupuestoList"
				}]
			}			
		},
		
		/**
		 * Initialize the application
		 *
		 * @returns {sap.ui.core.Control} the content
		 */
		createContent: function() {
			console.log('createContent called -  com.ittumi.compgastos.presupuesto.Component');
			return new sap.m.App ("PresupuestoPage",{});
		},
		
		onAfterRendering: function() {
			console.log('onAfterRendering called -  com.ittumi.compgastos.presupuesto.Component');
			
			var oReferenceDataModel = new sap.ui.model.json.JSONModel({});
			this.setModel(oReferenceDataModel,'reference');		
			
			var oModel = this.getModel('reference');
			
			this.getModel('presupuesto').callFunction("GetRegionalDescription", "GET", {'Bukrs':'1000', 'Userweb':sap.ui.getCore().User.userWeb, 'Language':'S'}, null, function(oData, oResponse) {
				oModel.setData({'SucursalList':oData},true);
			}, function(oError) {
				console.log(oError);
			});	
			
		},
		
		init: function() {
			console.log('init called -  com.ittumi.compgastos.presupuesto.Component');
			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
			
			var oDataUrl = "proxy/sap/opu/odata/sap/Y10_EXPMAN_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(oDataUrl, true);
			
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			this.setModel(oModel,'presupuesto');	
			
			// Model para parametros iniciales oDateRangeModel
			var oParametersModel = new sap.ui.model.json.JSONModel();
			oParametersModel.setData({
				bukrs : '1000'
			});
			this.setModel(oParametersModel,'params');				

			var router = this.getRouter();
			this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
			router.initialize();
		},		
		
		destroy: function() {
			console.log('destroy called -  com.ittumi.compgastos.presupuesto.Component');
			sap.ui.core.routing.Router.prototype.destroy.apply(this, arguments);
			this._oRouteMatchedHandler.destroy();
		}
	});

});
