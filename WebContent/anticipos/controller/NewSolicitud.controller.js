sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"com/ittumi/compgastos/anticipos/Formatter"
], function(Controller, MessageToast, MessageBox, Formatter) {
	"use strict";
	
	return Controller.extend("com.ittumi.compgastos.anticipos.controller.NewSolicitud", {
		
		onInit : function () {
			var today = new Date();
			
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			this._oRouter = this._oComponent.getRouter();		
			
			var oView = this.getView();

			sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {

				oView.setModel(new sap.ui.model.json.JSONModel(sap.ui.getCore().User),'context');
				
	        	var sRoute = oEvent.getParameter("name");
	        	console.log("NewSolicitud - attachRouteMatched called with route:" + sRoute);
	        	if ("new-solicitud" === sRoute) {
	        		console.log("NewSolicitud - attachRouteMatched with route " + sRoute + " matches!");
		        	var oForm = oView.byId('solicitudForm');
		        	oView.getModel('anticipos').refresh(true);
		        	oView.byId('comprobacion').setValueState(sap.ui.core.ValueState.None);
		        	oView.byId('departamento').setValueState(sap.ui.core.ValueState.None);
		        	oView.byId('centroCoste').setValueState(sap.ui.core.ValueState.None);
		        	oView.byId('fechaSolicitudBox').setDateValue(today);
		        	oView.byId('grabar').setEnabled(true);
		        	
		        	try {
		        		if (oView.getModel('reference').oData.SociedadList.length == 1) {
		        			var sociedad = oView.getModel('reference').oData.SociedadList[0].Bukrs;
		        			oView.byId('sociedadBox').setSelectedKey(sociedad);
		        		}
		        	} catch(e) {}
		        	
	        	}
	        });
		},
		
		createContent: function() {
			console.log('createContent called -  com.ittumi.compgastos.anticipos.controller.DetailAnticipo');
		},
		
		saveSolicitud : function(oEvent) {
			console.log('saveSolicitud clicked:' +  oEvent);
			
//			   <d:Bukrs>1000</d:Bukrs>
//			   <d:Expenseid>0000000000</d:Expenseid>
//			   <d:Expensedoc>1</d:Expensedoc>
//			   <d:Lifnr>10006811</d:Lifnr>
//			   <d:Reqexpdat>2016-02-02T00:00:00</d:Reqexpdat>
//			   <d:Erdat>2016-02-02T00:00:00</d:Erdat>
//			   <d:Erzet>PT15H26M13S</d:Erzet>
//			   <d:Comment>Prueba Creación WEB</d:Comment>
//			   <d:Userweb>GWAY</d:Userweb>
//			   <d:Langu>S</d:Langu>
//			   <d:Status>01</d:Status>
			
			 
			var oView = this.getView();
			
			var sociedadBox = oView.byId('sociedadBox');
			var tipoDocumentoBox = oView.byId('tipoDocumentoBox');
			var creadoElBox = oView.byId('creadoElBox');
			var fechaSolicitudBox = oView.byId('fechaSolicitudBox');
			var comments = oView.byId('comments');
			var userWeb = sap.ui.getCore().User.userWeb;
			
			oView.getModel('anticipos').resetChanges(function(){},function(){});
			
		    var oContext = oView.getModel('anticipos').createEntry("RequestHeaderSet",
	    		{
	    		    "Bukrs" : sociedadBox.getSelectedKey(), // From comboBox Screen
	    		    "Expenseid" : "0000000000", // Hardcoded
	    		    "Expensedoc" : tipoDocumentoBox.getSelectedKey(), // From comboBox Screen
//	    		    "Lifnr" : "10006811", // related to user
	    		    "Reqexpdat" : fechaSolicitudBox.getDateValue(),  // From comboBox Screen
//	    		    "Erdat" : new Date(), //creadoElBox.getDateValue(),  // From comboBox Screen
//	    		    "Erzet" : "PT15H26M13S", //Hardcoded for Now
	    		    "Userweb" : userWeb, // From oContext
	    		    "Comment" : comments.getValue(),  // From textArea Screen
	    		    "Status" : "01", // // Hardcoded
	    		    "Langu" : "S", // Hardcoded
	    		    "Webact" : "S"
//	    		    "Bukrs" : "1000", // From comboBox Screen
//	    		    "Expenseid" : "0000000000", // Hardcoded
//	    		    "Expensedoc" : "1", // From comboBox Screen
//	    		    "Lifnr" : "10006811", 
//	    		    "Reqexpdat" : "/Date(1454630400000)/",  // From comboBox Screen
//	    		    "Erdat" : "/Date(1454630400000)/",  // From comboBox Screen
//	    		    "Erzet" : "PT15H26M13S", //Hardcoded for Now
//	    		    "Userweb" : "GWAY", // From oContext
//	    		    "Comment" : "test creacion",  // From textArea Screen
//	    		    "Status" : "01", // // From comboBox Screen
//	    		    "Langu" : "S" // Hardcoded
	    		}
		    );	
		    
		    var callBacks = {
		    	success :function (oData, oResponse) {
		    		oView.byId('comprobacion').setValue(oData.Expenseid);
		    		oView.byId('departamento').setValue(oData.Deptxt+'/'+oData.Subdeptxt);
		    		oView.byId('centroCoste').setValue(oData.Deptkostl);
		    		oView.byId('comprobacion').setValueState(sap.ui.core.ValueState.Success);
		    		oView.byId('departamento').setValueState(sap.ui.core.ValueState.Success);
		    		oView.byId('centroCoste').setValueState(sap.ui.core.ValueState.Success);
		    		//oView.byId('fechaSolicitudBox').setDateValue(oData.Reqexpdat);
		    		//oView.byId('creadoElBox').setDateValue(oData.Erdat);
		    		oView.byId('grabar').setEnabled(false);
		    		MessageBox.success("Solicitud " +  oData.Expenseid + " creada satisfactoriamente.");
		    	},
		    	error : function (oError) {
		    		console.log('error');
		    		oView.getModel('anticipos').deleteCreatedEntry(oContext); // a must, when submitChanges returns error
		    		MessageBox.error("Error al grabar datos. ");
		    	}
	    	}
		    
		    oView.getModel('anticipos').submitChanges(callBacks.success, callBacks.error);
			   
		},
		
		resetSolicitud : function(){
			var oView = this.getView();
        	oView.byId('comprobacion').setValueState(sap.ui.core.ValueState.None);
        	oView.byId('departamento').setValueState(sap.ui.core.ValueState.None);
        	oView.byId('centroCoste').setValueState(sap.ui.core.ValueState.None);			
			oView.getModel('anticipos').refresh(true);
		},
		
		onNavBack: function() {  
			window.history.go(-1); 
		},
		
		exitSolicitud: function() {  
			window.history.go(-1); 
		}
		
	});

});
	
