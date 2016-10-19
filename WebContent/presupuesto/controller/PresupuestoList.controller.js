sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/ittumi/compgastos/presupuesto/Formatter",
	"sap/m/MessageBox"
], function(Controller, Formatter, MessageBox) {
	"use strict";
 
	return Controller.extend("com.ittumi.compgastos.presupuesto.controller.PresupuestoList", {
		
		onInit : function () {
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			this._oRouter = this._oComponent.getRouter();		
			
			var oView = this.getView();
			var doSearch = this.doSearch;
			
	        sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {

	        	oView.setModel(new sap.ui.model.json.JSONModel(sap.ui.getCore().User),'context');
	        	
	        	var sRoute = oEvent.getParameter("name");
	        	console.log("PresupuestoList - attachRouteMatched called with route:" + sRoute);
	        	if ("list" === sRoute) {
	        		console.log("PresupuestoList - attachRouteMatched with route " + sRoute + " matches!");
	        		
		        	var oModel = oView.getModel('presupuesto');
		        	var oTable = oView.byId('PresupuestoListTable');
					var oBinding = oTable.getBinding("items");
					
					var oFilter1 = new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, "1000");
					var oFilter2 = new sap.ui.model.Filter("Userweb", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().User.userWeb);
					var oFilter3 = new sap.ui.model.Filter("Branchoffice", sap.ui.model.FilterOperator.EQ, oView.byId('sucursalBox').getProperty('selectedKey'));
					var oFilter4 = new sap.ui.model.Filter("Langu", sap.ui.model.FilterOperator.EQ, "S");

					oBinding.filter([oFilter1,oFilter2,oFilter3,oFilter4]);
					
//		        	try {
//		        		if (oView.getModel('reference').oData.SucursalList.length == 1) {
//		        			var Deptcode = oView.getModel('reference').oData.SucursalList[0].Deptcode;
//		        			oView.byId('sucursalBox').setSelectedKey(Deptcode);
//		        		}
//		        	} catch(e) {}					
	        	}
				
	        });			
			
		},
		
		createContent: function() {

		},

		onSearch : function(oEvent) {
			console.log('onSearch clicked:' +  oEvent);
		    var oView = this.getView();
		    
        	var oModel = oView.getModel('presupuesto');
        	var oTable = oView.byId('PresupuestoListTable');
			var oBinding = oTable.getBinding("items");

			var oFilter1 = new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, "1000");
			var oFilter2 = new sap.ui.model.Filter("Userweb", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().User.userWeb);
			var oFilter3 = new sap.ui.model.Filter("Branchoffice", sap.ui.model.FilterOperator.EQ, oView.byId('sucursalBox').getProperty('selectedKey'));
			var oFilter4 = new sap.ui.model.Filter("Langu", sap.ui.model.FilterOperator.EQ, "S");
			
			oBinding.filter([oFilter1,oFilter2,oFilter3,oFilter4]);			
			
		},

		crearAnticipo :  function(oEvent) {
			console.log('crearAnticipo clicked:' +  oEvent);
		    var oView = this.getView();
        	var oTable = oView.byId('AdvancesListTable'); 
        	var items = oTable.getSelectedItems();
        	
        	if (items.length < 1) {
        		MessageBox.warning("Seleccione un registro para modificar Solicitud.");
        		return;
        	}

        	var Expenseid = items[0].getBindingContext('anticipos').getProperty('Expenseid');
        	var Bukrs = items[0].getBindingContext('anticipos').getProperty('Bukrs');
        	
//			var bindingContext = oEvent.getSource().getBindingContext('anticipos');
//        	var Expenseid = bindingContext.getProperty('Expenseid');
//        	var Bukrs = bindingContext.getProperty('Bukrs');			
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("new-anticipo",{Expenseid: Expenseid, Bukrs: Bukrs},false);						
		},
		
		modificarAnticipo : function(oEvent) {
			console.log('modificarAnticipo clicked:' +  oEvent);			
			var bindingContext = oEvent.getSource().getBindingContext('anticipos');
        	var Expenseid = bindingContext.getProperty('Expenseid');
        	var Bukrs = bindingContext.getProperty('Bukrs');
        	var Reqlin = bindingContext.getProperty('Reqlin');
        	var StatusA = bindingContext.getProperty('StatusA');//
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("update-anticipo",{Expenseid: Expenseid, Bukrs: Bukrs, Reqlin: Reqlin, StatusA: StatusA},false);		
		},
		
		crearSolicitud: function(oEvent) {
			console.log('crearSolicitud clicked:' +  oEvent);
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("new-solicitud",{},false);			
		},
		
		modificarSolicitud: function(oEvent) {
			console.log('modificarSolicitud clicked:' +  oEvent);
		    var oView = this.getView();
        	var oTable = oView.byId('AdvancesListTable'); 
        	var items = oTable.getSelectedItems();
        	
        	if (items.length < 1) {
        		MessageBox.warning("Seleccione un registro para modificar Solicitud.");
        		return;
        	}
        	
        	var Expenseid = items[0].getBindingContext('anticipos').getProperty('Expenseid');
        	var Bukrs = items[0].getBindingContext('anticipos').getProperty('Bukrs');
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("update-solicitud",{Expenseid: Expenseid, Bukrs: Bukrs},false);			
		},		
		
		consultarSolicitud: function(oEvent) {
			console.log('consultarSolicitud clicked:' +  oEvent);
		    var oView = this.getView();
        	var oTable = oView.byId('AdvancesListTable'); 
        	var items = oTable.getSelectedItems();
        	
        	if (items.length < 1) {
        		MessageBox.warning("Seleccione un registro para consultar Solicitud.");
        		return;
        	}
        	
        	var Expenseid = items[0].getBindingContext('anticipos').getProperty('Expenseid');
        	var Bukrs = items[0].getBindingContext('anticipos').getProperty('Bukrs');
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("show-solicitud",{Expenseid: Expenseid, Bukrs: Bukrs},false);			
		},
		
		anularAnticipo: function(oEvent) {
			console.log('anularAnticipo clicked:' +  oEvent);
			
			// Userweb='walejos'&Bukrs='1000'&ExpenseId='0000000550'&Language='E'&ReqLin='0001'
			
		    var oView = this.getView();
        	var oTable = oView.byId('AdvancesListTable'); 
        	var items = oTable.getSelectedItems();
        	
        	if (items.length < 1) {
        		MessageBox.warning("Seleccione un registro");
        		return;
        	}
        	
        	var Expenseid = items[0].getBindingContext('anticipos').getProperty('Expenseid');
        	var Bukrs = items[0].getBindingContext('anticipos').getProperty('Bukrs');
        	var Reqlin = items[0].getBindingContext('anticipos').getProperty('Reqlin');        	

        	var controller = this;
        	
        	MessageBox.confirm("Desea anular el anticipo?", {

				title : "Anular Anticipo",

				onClose : function(oAction) {
					console.log(oAction);

					if ("OK" === oAction) {

						oView.getModel('anticipos').callFunction("AnnullmentRequest", {
							method : "GET",
							urlParameters : {
								'ExpenseId' : Expenseid,
								'Bukrs' : Bukrs,
								'ReqLin' : Reqlin,
								'Userweb' : sap.ui.getCore().User.userWeb,
								'Language' : 'E'
							},
							context : null,
							success : function(oData, oResponse) {
								console.log(oData);
								MessageBox.confirm("Se realizó la anulación de la comprobación " + Expenseid + " Anticipo " + Reqlin);
								controller.onSearch();
							},
							error : function(oError) {
								console.log(oError);
								try {
									var obj = jQuery.parseJSON(oError.response.body);
									MessageBox.error(obj.error.message.value);
								} catch (e) {
									MessageBox.error("Error en la anulación del anticipo");
								}
							}
						});
					}
				}
			});
		},
		
		enviarAprobacion: function(oEvent) { 
			console.log('enviarAprobacion clicked 2:' +  oEvent);

			// Userweb='walejos'&Bukrs='1000'&ExpenseId='0000000550'&Language='E'&ReqLin='0001'
			// Bukrs='1000'&ExpenseId='550'&LineNumber='0003'&Userweb='GWAY'&Language='S'
			
		    var oView = this.getView();
        	var oTable = oView.byId('AdvancesListTable'); 
        	var items = oTable.getSelectedItems();
        	
        	if (items.length < 1) {
        		MessageBox.warning("Seleccione un registro");
        		return;
        	}
        	
        	var Expenseid = items[0].getBindingContext('anticipos').getProperty('Expenseid');
        	var Bukrs = items[0].getBindingContext('anticipos').getProperty('Bukrs');
        	var Reqlin = items[0].getBindingContext('anticipos').getProperty('Reqlin');        	

        	var controller = this;
        	
        	MessageBox.confirm("Desea enviar para aprobación el anticipo?", {

				title : "Enviar Aprobación",

				onClose : function(oAction) {
					console.log(oAction);

					if ("OK" === oAction) {

						oView.getModel('anticipos').callFunction("ApproveAdvance", {
							method : "GET",
							urlParameters : {
								'ExpenseId' : Expenseid,
								'Bukrs' : Bukrs,
								'LineNumber' : Reqlin,
								'Userweb' : sap.ui.getCore().User.userWeb,
								'Language' : 'S'
							},
							context : null,
							success : function(oData, oResponse) {
								console.log(oData);
								MessageBox.confirm("Se realizó el envío para aprobación de la comprobación " + Expenseid + " Anticipo " + Reqlin );
								controller.onSearch();
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
		}
		
	});

});
