sap.ui.define([
	'sap/ui/core/UIComponent' 
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("com.ittumi.compgastos.comprobaciones.Component", {
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
					"viewPath": "com.ittumi.compgastos.comprobaciones.view",
					"targetControl": "ComprobacionesPage", // This is the control in which new views are placed
					"targetAggregation": "pages", // This is the aggregation in which the new views will be placed
					"clearTarget": false
				},
				routes: [{
					name: "list",
					pattern: "comprobaciones/",
					view: "ComprobacionesList"
				}, {
					name: "details",
					pattern: "comprobaciones/detail/{Expenseid}/{Bukrs}/{Langu}",
					view: "DetailComprobacion",
				},{
					name: "modify",
					pattern: "comprobaciones/modify/{Expenseid}/{Bukrs}/{Expenseline}/{Langu}/{Idx}",
					view: "ModifyComprobacion",
				},{
					name: "detailSolicitud",
					pattern: "detailSolicitud/",
					view: "DetailSolicitud",
				},{
					name: "show-solicitud",
					pattern: "comprobaciones/ver-solicitud/{Expenseid}/{Bukrs}",
					view: "DetailSolicitud",
				},{
					name: "update-solicitud",
					pattern: "comprobaciones/mod-solicitud/{Expenseid}/{Bukrs}",
					view: "DetailSolicitud",
				},{
					name: "new-solicitud",
					pattern: "comprobaciones/crear-solicitud/",
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
			console.log('createContent called -  com.ittumi.compgastos.comprobaciones.Component');
			return new sap.m.App ("ComprobacionesPage",{});
		},
		
		onAfterRendering: function() {
			console.log('onAfterRendering called -  com.ittumi.compgastos.comprobaciones.Component');
			
			var oReferenceModel = new sap.ui.model.json.JSONModel({});
			this.setModel(oReferenceModel,'reference');		
			
			var oModel = this.getModel('reference');
			
			this.getModel('comprobaciones').callFunction("GetExpenseStatus", "GET", {'Language':'S'}, null, function(oData, oResponse) {
				oModel.setData({'StatusComprobacionList':oData.results},true);
			}, function(oError) {
				console.log(oError);
			});
			
			this.getModel('comprobaciones').callFunction("GetExpenseDocument", "GET", {'Language':'S'}, null, function(oData, oResponse) {
				oModel.setData({'TipoDocumentoList':oData.results},true);
			}, function(oError) {
				console.log(oError);
			});
			
			this.getModel('comprobaciones').callFunction("CompanyList", "GET", {'Userweb':sap.ui.getCore().User.userWeb, 'Language':'S'}, null, function(oData, oResponse) {
				oModel.setData({'SociedadList':oData.results},true);
			}, function(oError) {
				console.log(oError);
			});	
			
		},
		
		init: function() {
			console.log('init called -  com.ittumi.compgastos.comprobaciones.Component');
			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
			
			var oDataUrl = "proxy/sap/opu/odata/sap/Y10_EXPMAN_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(oDataUrl, true);
			
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			sap.ui.getCore().setModel(oModel,'comprobaciones');
			this.setModel(oModel,'comprobaciones');	
			
			// Model par5a los combos
			var oLisCombosModel =  new sap.ui.model.json.JSONModel();  
			oLisCombosModel.setSizeLimit(1000);
        	sap.ui.getCore().setModel(oLisCombosModel,'mCombos');
        	this.setModel(oLisCombosModel,'mCombos');
        	
			// Model par5a los combos
			var oLisTablesModel =  new sap.ui.model.json.JSONModel();  
			oLisTablesModel.setSizeLimit(1000);
        	sap.ui.getCore().setModel(oLisTablesModel,'mTables');
        	this.setModel(oLisTablesModel,'mTables');	
        	
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
			sap.ui.getCore().setModel(oParametersModel,'params');
			this.setModel(oParametersModel,'params');				
			
			var router = this.getRouter();
			this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
			router.initialize();
		},		
		
		destroy: function() {
			console.log('destroy called -  com.ittumi.compgastos.comprobaciones.Component');
			sap.ui.core.routing.Router.prototype.destroy.apply(this, arguments);
			this._oRouteMatchedHandler.destroy();
		}
	});

});