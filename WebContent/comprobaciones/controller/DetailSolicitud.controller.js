sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"com/ittumi/compgastos/comprobaciones/Formatter"
], function(Controller, MessageToast, MessageBox, Formatter) {
	"use strict";
	
	return Controller.extend("com.ittumi.compgastos.comprobaciones.controller.DetailSolicitud", {
		
		onInit : function () {
			
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			this._oRouter = this._oComponent.getRouter();		
			
			var oView = this.getView();

			sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {

				oView.setModel(new sap.ui.model.json.JSONModel(sap.ui.getCore().User),'context');
				
	        	var sRoute = oEvent.getParameter("name");
	        	console.log("sRoute2:" + sRoute);
	        	
	        	if ("show-solicitud" === sRoute) {
		        	if (oEvent.getParameter("arguments").Expenseid) {
		        		var Expenseid = oEvent.getParameter("arguments").Expenseid; //"0000000550";//
		        		var Bukrs = oEvent.getParameter("arguments").Bukrs;
			        	var oPath = "/RequestHeaderSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Langu='S')"
			        	var oForm = oView.byId('solicitudForm');
			        	oView.bindElement("comprobaciones>" + oPath);
			        	var oModel = new sap.ui.model.json.JSONModel();  
			        	oModel.setData({enabled:false});
			        	oView.setModel(oModel,'helper');
		        	}	        		        		
	        	}
	        	if ("update-solicitud" === sRoute) {
		        	if (oEvent.getParameter("arguments").Expenseid) {
		        		var Expenseid = oEvent.getParameter("arguments").Expenseid; //"0000000550";//
		        		var Bukrs = oEvent.getParameter("arguments").Bukrs;
			        	var oPath = "/RequestHeaderSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Langu='S')"
			        	var oForm = oView.byId('solicitudForm');
			        	oView.bindElement("comprobaciones>" + oPath);
			        	var oModel = new sap.ui.model.json.JSONModel();  
			        	oModel.setData({enabled:true});
			        	oView.setModel(oModel,'helper');
		        	}	        		        		
	        	}
	        });
		},
		
		updateMode : function() {
			
		},
		
		createContent: function() {
			console.log('createContent called -  com.ittumi.compgastos.comprobaciones.controller.DetailAnticipo');

		},
		
		saveSolicitud : function(oEvent) {
			console.log('saveSolicitud clicked:' +  oEvent);
		    var oView = this.getView();
		    var comment = oView.byId('comment');
		    var tipoDocumentoBox = oView.byId('tipoDocumentoBox');
		    var fechaSolicitudBox = oView.byId('fechaSolicitudBox');
		    var Bukrs = oView.byId('Bukrs') || '1000';
		    var Expenseid = oView.byId('Expenseid').getValue();  //"0000000550"; //
		    console.log(comment);
		    
		    var oData = oView.getBindingContext("comprobaciones").getProperty("/RequestHeaderSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Langu='ES')");
		    
		    console.log(oData.Buktx);
		    
		    oView.getModel('comprobaciones').update("/RequestHeaderSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Langu='ES')",
		    		{
		    		  "d" : {
		    		    "Bukrs" : oData.Bukrs,
		    		    "Expenseid" : Expenseid,
		    		    "Buktx" : oData.Buktx,
		    		    "Expensedoc" : tipoDocumentoBox.getSelectedKey(), // From comboBox Screen
		    		    "Expensedocdes" : oData.Expensedocdes,
		    		    "Lifnr" : oData.Lifnr,
		    		    "Lifnam" : oData.Lifnam,
		    		    "Deptcode" : oData.Deptcode,
		    		    "Subdeptcode" : oData.Subdeptcode,
		    		    "Deptxt" : oData.Deptxt,
		    		    "Subdeptxt" : oData.Subdeptxt,
		    		    "Deptkostl" : oData.Deptkostl,
		    		    "Reqexpdat" : fechaSolicitudBox.getDateValue(),  // From comboBox Screen
		    		    "Budat" : oData.Budat,
		    		    "Bldat" : oData.Bldat,
		    		    "Erdat" : oData.Erdat,
		    		    "Erzet" : oData.Erzet,//"PT15H26M13S",
		    		    "Ernam" : oData.Ernam,
		    		    "Aedat" : oData.Aedat,
		    		    "Waers" : oData.Waers,
		    		    "Reqind" : oData.Reqind,
		    		    "Expind" : oData.Expind,
		    		    "Userweb" : oData.Userweb,
		    		    "Admin" : oData.Admin,
		    		    "Approver" : oData.Approver,
		    		    "Apprdate" : oData.Apprdate,
		    		    "Postedby" : oData.Postedby,
		    		    "Postdate" : oData.Postdate,
		    		    "Comment" : comment.getValue(),
		    		    "Status" : oData.Status,
		    		    "Langu" : oData.Langu
		    		  }
		    		},
		    	{
			    	context:null,
			    	success :function () {
			    		console.log('success');
			    		MessageBox.success("Datos grabados satisfactioramente.");
			    	},
			    	error : function () {
			    		console.log('error');
			    		MessageBox.error("Error al grabar datos. ");
			    	}
		    	}
		    );
		},
		
		onNavBack: function() {  
			window.history.go(-1); 
		},
		
		exitSolicitud: function() {  
			window.history.go(-1); 
		}
		
	});

});
	
