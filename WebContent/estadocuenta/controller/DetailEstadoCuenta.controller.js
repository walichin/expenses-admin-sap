sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	
	return Controller.extend("com.ittumi.compgastos.anticipos.controller.DetailAnticipo", {
		
		onInit : function () {
			console.log("onInit called - com.ittumi.compgastos.anticipos.controller.DetailAnticipo");
			
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			this._oRouter = this._oComponent.getRouter();		
			
			var oView = this.getView();
			
	        sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
	        	console.log('attachRouteMatched called -  com.ittumi.compgastos.anticipos.controller.DetailAnticipo');
	        	
	        	if (oEvent.getParameter("arguments").entity) {
	        		var entityPath = "/" + oEvent.getParameter("arguments").entity; // '/Product(4)'
		        	console.log('DetailAnticipo: entity:' + entityPath)
		        	oView.bindElement(entityPath);
		        	
		        	var oModel = oView.getModel();
		        	var oData = oView.getModel().getData(entityPath);
		        	
		        	// jalejos - we should use "dataReceived" event to only 
	//	        	oView.getElementBinding().attachEvent("dataReceived", jQuery.proxy(function() {
	//					var oData = oView.getModel().getData(entityPath);
	//					if (!oData) {
	//
	//					}
	//				}, this));	        	
	        	}
	        });
		},
		
		createContent: function() {
			console.log('createContent called -  com.ittumi.compgastos.anticipos.controller.DetailAnticipo');

		},
		
		onListItemPress : function(oEvent) {
			console.log("onListItemPress called - com.ittumi.compgastos.anticipos.controller.DetailAnticipo");
		},

		onNavBack: function() {  
			window.history.go(-1); 
		}
		
	});

});
	
