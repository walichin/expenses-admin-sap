sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
 
	return Controller.extend("com.ittumi.compgastos.estadocuenta.controller.EstadoCuentaList", {
		
		onInit : function () {
			console.log("onInit called - com.ittumi.compgastos.estadocuenta.controller.EstadoCuentaList");
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			this._oRouter = this._oComponent.getRouter();		
			
			var oView = this.getView();
			
	        sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
	        	
	        	oView.setModel(new sap.ui.model.json.JSONModel(sap.ui.getCore().User),'context');
	        	
	        	var oModel = oView.getModel('estadocuenta');
	        	
	        	var oTable = oView.byId('ListOpenTable');
				var oBinding = oTable.getBinding("items");
				var oFilter1 = new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, oView.byId('sociedadBox').getProperty('selectedKey'));
				var oFilter2 = new sap.ui.model.Filter("Userweb", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().User.userWeb);
				var oFilter3 = new sap.ui.model.Filter("Langu", sap.ui.model.FilterOperator.EQ, "S");
				oBinding.filter([oFilter1,oFilter2,oFilter3]); 
				
	        	var oTable1 = oView.byId('ListClearedTable');
				var oBinding1 = oTable1.getBinding("items");
				var oFilter4 = new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, oView.byId('sociedadBox').getProperty('selectedKey'));
				var oFilter5 = new sap.ui.model.Filter("Userweb", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().User.userWeb);
				var oFilter6 = new sap.ui.model.Filter("Langu", sap.ui.model.FilterOperator.EQ, "S");
				oBinding1.filter([oFilter4,oFilter5,oFilter6]); 				
	        	
	        });			
			
		},
		
		createContent: function() {
			console.log('createContent called -  com.ittumi.compgastos.estadocuenta.controller.EstadoCuentaList');
		},
		
		onListItemPress : function(oEvent) {
			console.log("onListItemPress called - com.ittumi.compgastos.estadocuenta.controller.EstadoCuentaList");
			var bindingContext = oEvent.getSource().getBindingContext();
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("details",{entity: oEvent.getSource().getBindingContext().getPath().substr(1)},false);
		},
		
		onSearch : function(oEvent) {
			console.log('onSearch clicked:' +  oEvent);
			
			var oView = this.getView();
        	var oModel = oView.getModel('estadocuenta');
        	
        	var oTable = oView.byId('ListOpenTable');
			var oBinding = oTable.getBinding("items");
			var oFilter1 = new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, oView.byId('sociedadBox').getProperty('selectedKey'));
			var oFilter2 = new sap.ui.model.Filter("Userweb", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().userWeb);
			var oFilter3 = new sap.ui.model.Filter("Langu", sap.ui.model.FilterOperator.EQ, "S");		
			oBinding.filter([oFilter1,oFilter2,oFilter3]); 
			
        	var oTable1 = oView.byId('ListOpenTable');
			var oBinding1 = oTable1.getBinding("items");
			var oFilter4 = new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, oView.byId('sociedadBox').getProperty('selectedKey'));
			var oFilter5 = new sap.ui.model.Filter("Userweb", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().userWeb);
			var oFilter6 = new sap.ui.model.Filter("Langu", sap.ui.model.FilterOperator.EQ, "S");		
			oBinding1.filter([oFilter4,oFilter5,oFilter6]); 			
			
		},
		
		crearAnticipo :  function(oEvent) {
			console.log('crearAnticipo clicked:' +  oEvent);
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("details",{entity: 0},false);			
		},
		
		onNavBack : function (oEvent) {
			console.log('onNavBack clicked:' +  oEvent);
			window.history.go(-1); 
		},
		
		onLogout : function (oEvent) {
			console.log('onLogout called -  com.ittumi.compgastos.anticipos.controller.AnticiposList');
			var oRouter = sap.ui.core.routing.Router.getRouter("app");
			oRouter.navTo("_login",{},false);	
		}		
		
		
		
	});

});
