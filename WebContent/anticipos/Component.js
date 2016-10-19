sap.ui.define([
	"sap/ui/core/UIComponent"
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("com.ittumi.compgastos.anticipos.Component", {
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
					"viewPath": "com.ittumi.compgastos.anticipos.view",
					"targetControl": "AnticiposPage", // This is the control in which new views are placed
					"targetAggregation": "pages", // This is the aggregation in which the new views will be placed
					"clearTarget": false
				},
				routes: [{
					name: "list",
					pattern: "anticipos/",
					view: "AnticiposList"
				}, {
					name: "new-anticipo",
					pattern: "anticipos/crear-anticipo/{Expenseid}/{Bukrs}",					
					view: "DetailAnticipo",
				}, {
					name: "update-anticipo",
					pattern: "anticipos/mod-anticipo/{Expenseid}/{Bukrs}/{Reqlin}/{StatusA}",
					view: "DetailAnticipo",
				}, {
					name: "show-solicitud",
					pattern: "anticipos/ver-solicitud/{Expenseid}/{Bukrs}",
					view: "DetailSolicitud",
				}, {
					name: "update-solicitud",
					pattern: "anticipos/mod-solicitud/{Expenseid}/{Bukrs}",
					view: "DetailSolicitud",
				},{
					name: "new-solicitud",
					pattern: "anticipos/crear-solicitud/",
					view: "NewSolicitud",
				}]
			}			
		},
		
		/**
		 * Initialize the application
		 *
		 * @returns {sap.ui.core.Control} the content
		 */
		createContent: function() {
			console.log('createContent called -  com.ittumi.compgastos.anticipos.Component');
			return new sap.m.App ("AnticiposPage",{});
		},
		
		onAfterRendering: function() {
			console.log('onAfterRendering called -  com.ittumi.compgastos.anticipos.Component');
			
			var oReferenceDataModel = new sap.ui.model.json.JSONModel({});
			this.setModel(oReferenceDataModel,'reference');		
			
			var oModel = this.getModel('reference');
			
			this.getModel('anticipos').callFunction("GetRequestStatus", "GET", {'Language':'S'}, null, function(oData, oResponse) {
				oModel.setData({'StatusAnticipoList':oData.results},true);
			}, function(oError) {
				console.log(oError);
			});
			
			this.getModel('anticipos').callFunction("GetCurrencyList", "GET", {'Language':'S'}, null, function(oData, oResponse) {
				oModel.setData({'CurrencyList':oData.results},true);
			}, function(oError) {
				console.log(oError);
			});			
			//http://localhost:8088/CompGastos/proxy/sap/opu/odata/sap/Y10_EXPMAN_SRV/GetCurrencyList?Language=%27S%27
			
			this.getModel('anticipos').callFunction("GetExpenseDocument", "GET", {'Language':'S'}, null, function(oData, oResponse) {
				oModel.setData({'TipoDocumentoList':oData.results},true);
			}, function(oError) {
				console.log(oError);
			});
			
			this.getModel('anticipos').callFunction("CompanyList", "GET", {'Userweb':sap.ui.getCore().User.userWeb, 'Language':'S'}, null, function(oData, oResponse) {
				oModel.setData({'SociedadList':oData.results},true);
			}, function(oError) {
				console.log(oError);
			});	
			
//			var oReferenceModel = new sap.ui.model.json.JSONModel("anticipos/reference.json");
//			this.setModel(oReferenceModel,'referencex');		
			
		},
		
		init: function() {
			console.log('init called -  com.ittumi.compgastos.anticipos.Component');
			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
			
			var oDataUrl = "proxy/sap/opu/odata/sap/Y10_EXPMAN_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(oDataUrl, true);
			
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			this.setModel(oModel,'anticipos');	
			
			// Model para parametros iniciales oDateRangeModel
			var dateTo = new Date();
			var dateFrom = new Date();
			dateFrom.setDate(dateTo.getDate()-60);
			
			var oParametersModel = new sap.ui.model.json.JSONModel();
			oParametersModel.setData({
				rangeDelimiterDRS1: "-",
				rangeDateValueDRS1: dateFrom,
				rangeSecondDateValueDRS1: dateTo,
				rangeDateFormatDRS1: 'dd.MM.yy',
				bukrs : '1000',
				status : '00'
			});
			this.setModel(oParametersModel,'params');				

			var router = this.getRouter();
			this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
			router.initialize();
		},		
		
		destroy: function() {
			console.log('destroy called -  com.ittumi.compgastos.anticipos.Component');
			sap.ui.core.routing.Router.prototype.destroy.apply(this, arguments);
			this._oRouteMatchedHandler.destroy();
		}
	});

});
