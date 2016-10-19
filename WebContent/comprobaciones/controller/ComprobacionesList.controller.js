sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"	
], function(Controller, MessageBox) {
	"use strict";
 
	return Controller.extend("com.ittumi.compgastos.comprobaciones.controller.ComprobacionesList", {
		
		onInit : function () {
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			this._oRouter = this._oComponent.getRouter();		
			
			var oView = this.getView();
			var doSearch = this.doSearch;
			
	        sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
	        	
	        	oView.setModel(new sap.ui.model.json.JSONModel(sap.ui.getCore().User),'context');

	        	var sRoute = oEvent.getParameter("name");
	        	console.log("attachRouteMatched called sRoute1:" + sRoute);
	        	if ("list" === sRoute) {
		        	// New Implementation : oData for Entity : Using filter object
		        	var oModel = oView.getModel('comprobaciones');
		        	var oTable = oView.byId('ExpenseListTable');
					var oBinding = oTable.getBinding("items");
					
				    // Hack - Start
				    var statusC = oView.byId('statusComprobacionBox').getProperty('selectedKey');
				    if (statusC === '00') statusC = '  '; 
				    // Hack - end
				    
					var oFilter1 = new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, oView.byId('sociedadBox').getProperty('selectedKey'));
					var oFilter2 = new sap.ui.model.Filter("Userweb", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().User.userWeb);
					var oFilter3 = new sap.ui.model.Filter("Langu", sap.ui.model.FilterOperator.EQ, "S");
					var oFilter4 = new sap.ui.model.Filter("StatusC", sap.ui.model.FilterOperator.EQ, statusC);
					var oFilter5 = new sap.ui.model.Filter("Reqexpdat", sap.ui.model.FilterOperator.BT, 
							oView.byId('dateRangeBox').getProperty('dateValue'), oView.byId('dateRangeBox').getProperty('secondDateValue'));
					
					oBinding.filter([oFilter1,oFilter2,oFilter3,oFilter4,oFilter5]); 
	        	}
	        });			
			
		},
		
		createContent: function() {

		},
		
		onSearch : function(oEvent) {
			console.log('onSearch clicked:' +  oEvent);
		    var oView = this.getView();
		    var aFilters = oEvent.getParameter("selectionSet");
		    
        	// New Implementation : oData for Entity : Using filter object
        	var oModel = oView.getModel('comprobaciones');
        	var oTable = oView.byId('ExpenseListTable');
			var oBinding = oTable.getBinding("items");
			
		    // Hack - Start
		    var statusC = oView.byId('statusComprobacionBox').getProperty('selectedKey');
		    if (statusC === '00') statusC = '  '; 
		    // Hack - end
		    
			var oFilter1 = new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, oView.byId('sociedadBox').getProperty('selectedKey'));
			var oFilter2 = new sap.ui.model.Filter("Userweb", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().User.userWeb);
			var oFilter3 = new sap.ui.model.Filter("Langu", sap.ui.model.FilterOperator.EQ, "S");
			var oFilter4 = new sap.ui.model.Filter("StatusC", sap.ui.model.FilterOperator.EQ, statusC);
			var oFilter5 = new sap.ui.model.Filter("Reqexpdat", sap.ui.model.FilterOperator.BT, 
					oView.byId('dateRangeBox').getProperty('dateValue'), oView.byId('dateRangeBox').getProperty('secondDateValue'));
			
			oBinding.filter([oFilter1,oFilter2,oFilter3,oFilter4,oFilter5]); 
			
		},
		
		crearSolicitud: function(oEvent) {
			console.log('crearSolicitud clicked:' +  oEvent);
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("new-solicitud",{},false);
		},
		
		modificarSolicitud: function(oEvent) {
			console.log('modificarSolicitud clicked:' +  oEvent);
		    var oView = this.getView();
        	var oTable = oView.byId('ExpenseListTable'); 
        	var items = oTable.getSelectedItems();
        	
        	if (items.length < 1) {
        		MessageBox.warning("Seleccione un registro para modificar Solicitud.");
        		return;
        	}
        	
        	var Expenseid = items[0].getBindingContext('comprobaciones').getProperty('Expenseid');
        	var Bukrs = items[0].getBindingContext('comprobaciones').getProperty('Bukrs');
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("update-solicitud",{Expenseid: Expenseid, Bukrs: Bukrs},false);
			
		},		
		
		consultarSolicitud: function(oEvent) {
			console.log('consultarSolicitud clicked:' +  oEvent);
		    var oView = this.getView();
        	var oTable = oView.byId('ExpenseListTable'); 
        	var items = oTable.getSelectedItems();
        	
        	if (items.length < 1) {
        		MessageBox.warning("Seleccione un registro para consultar Solicitud.");
        		return;
        	}
        	
        	var Expenseid = items[0].getBindingContext('comprobaciones').getProperty('Expenseid');
        	var Bukrs = items[0].getBindingContext('comprobaciones').getProperty('Bukrs');
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("show-solicitud",{Expenseid: Expenseid, Bukrs: Bukrs},false);
		},
		
		anularComprobacion: function(oEvent) {
			console.log('anularComprobacion clicked:' +  oEvent);
			
			// Userweb='walejos'&Bukrs='1000'&ExpenseId='0000000550'&Language='S'&$format=json
			
		    var oView = this.getView();
        	var oTable = oView.byId('ExpenseListTable'); 
        	var items = oTable.getSelectedItems();
        	
        	if (items.length < 1) {
        		MessageBox.warning("Seleccione un registro");
        		return;
        	}
        	
        	var Expenseid = items[0].getBindingContext('comprobaciones').getProperty('Expenseid');
        	var Bukrs = items[0].getBindingContext('comprobaciones').getProperty('Bukrs');

        	MessageBox.confirm("Desea anular la Comprobación?", {

				title : "Anular Comprobación",

				onClose : function(oAction) {
					console.log(oAction);

					if ("OK" === oAction) {

						oView.getModel('comprobaciones').callFunction("AnnullmentExpense", {
							method : "GET",
							urlParameters : {
								'ExpenseId' : Expenseid,
								'Bukrs' : Bukrs,
								'Userweb' : sap.ui.getCore().User.userWeb,
								'Language' : 'S'
							},
							context : null,
							success : function(oData, oResponse) {
								console.log(oData);
								MessageBox.confirm("Se realizó la anulación de la comprobación " + Expenseid);
							},
							error : function(oError) {
								console.log(oError);
								try {
									var obj = jQuery.parseJSON(oError.response.body);
									MessageBox.error(obj.error.message.value);
								} catch (e) {
									MessageBox.error("Error en la anulación de la comprobación");
								}
							}
						});
					}
				}
			});
        	
		},		
		
		enviarAprobacion: function(oEvent) {
			console.log('enviarAprobacion clicked:' +  oEvent);
			
			// Bukrs='1000'&ExpenseId='550'&Language='S'&Userweb='GWAY'
			
		    var oView = this.getView();
        	var oTable = oView.byId('ExpenseListTable'); 
        	var items = oTable.getSelectedItems();
        	
        	if (items.length < 1) {
        		MessageBox.warning("Seleccione un registro");
        		return;
        	}
        	
        	var Expenseid = items[0].getBindingContext('comprobaciones').getProperty('Expenseid');
        	var Bukrs = items[0].getBindingContext('comprobaciones').getProperty('Bukrs');

        	MessageBox.confirm("Desea enviar para aprobación la comprobación?", {

				title : "Enviar Aprobación",

				onClose : function(oAction) {
					console.log(oAction);

					if ("OK" === oAction) {

						oView.getModel('comprobaciones').callFunction("ApproveExpense", {
							method : "GET",
							urlParameters : {
								'ExpenseId' : Expenseid,
								'Bukrs' : Bukrs,
								'Userweb' : sap.ui.getCore().User.userWeb,
								'Language' : 'S'
							},
							context : null,
							success : function(oData, oResponse) {
								console.log(oData);
								MessageBox.confirm("Se realizó el envío para aprobación de la comprobación " + Expenseid);
							},
							error : function(oError) {
								console.log(oError);
								try {
									var obj = jQuery.parseJSON(oError.response.body);
									MessageBox.error(obj.error.message.value);
								} catch (e) {
									MessageBox.error("Error en el envío de la aprobación");
								}
							}
						});
					}
				}
			});			
		},
		
		onNavBack : function (oEvent) {
			console.log('onNavBack clicked:' +  oEvent);
			window.history.go(-1); 
		},
		
		onLogout : function (oEvent) {
			var oRouter = sap.ui.core.routing.Router.getRouter("app");
			oRouter.navTo("_login",{},false);	
		},
		
		
		onPressItemSelect: function (oEvent) {
			// ir a la sgte vista de detalle
			console.log('onPressItemSelect clicked' +  oEvent);
			
			var bindingContext = oEvent.getSource().getBindingContext('comprobaciones');
        	var Expenseid = bindingContext.getProperty('Expenseid');
        	var Bukrs = bindingContext.getProperty('Bukrs');
        	var Langu = bindingContext.getProperty('Langu');
        	(Langu == '') ? Langu='S' : Langu='E';
        	
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("details",{Expenseid: Expenseid, Bukrs: Bukrs, Langu: Langu},false);		
        	
		}

		
	});
 
});