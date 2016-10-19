sap.ui.define([
	"sap/ui/core/mvc/Controller", 
	"com/ittumi/compgastos/anticipos/Formatter",	
	"sap/m/MessageToast",
	"sap/m/MessageBox"	
], function(Controller, Formatter, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("com.ittumi.compgastos.anticipos.controller.DetailAnticipo", {

		onInit : function() {
			console.log("onInit called - com.ittumi.compgastos.anticipos.controller.DetailAnticipo");

			var today = new Date();
			
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			this._oRouter = this._oComponent.getRouter();

			var oView = this.getView();

			sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {

				oView.setModel(new sap.ui.model.json.JSONModel(sap.ui.getCore().User),'context');

	        	var sRoute = oEvent.getParameter("name");
	        	console.log("DetailAnticipo - attachRouteMatched called with route:" + sRoute);
	        	if ("update-anticipo" === sRoute) {
	        		console.log("DetailAnticipo - attachRouteMatched with route " + sRoute + " matches!");
		        	if (oEvent.getParameter("arguments").Expenseid) {
		        		
		        		var Expenseid = oEvent.getParameter("arguments").Expenseid; //"0000000550";//
		        		var Bukrs = oEvent.getParameter("arguments").Bukrs;
		        		var Reqlin = oEvent.getParameter("arguments").Reqlin;
		        		var StatusA = oEvent.getParameter("arguments").StatusA;
		        		
			        	oView.byId('fechadocBox').setDateValue(null);
			        	oView.byId('fechacontBox').setDateValue(null);
			        	oView.byId('statusAnticipoBox').setSelectedKey(null);
			        	
			        	var oPathAnticipo = "/AdvanceItemSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Reqlin='"+Reqlin+"',Langu='S')"
			        	var oFormAnticipo = oView.byId('anticipoForm');
		        		oFormAnticipo.unbindElement('anticipos');	
			        	oFormAnticipo.bindElement("anticipos>" + oPathAnticipo);			        				        
			        	
			        	var oPathSolicitud = "/RequestHeaderSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Langu='S')"
			        	var oFormSolicitud = oView.byId('solicitudForm');
			        	oFormSolicitud.unbindElement('anticipos');
			        	oFormSolicitud.bindElement("anticipos>" + oPathSolicitud);			        	
			        	
			        	var writeMode = false;
			        	if ("01" == StatusA || "05" === StatusA) {
			        		writeMode = true;
			        	}
			        	
			        	var oModel = new sap.ui.model.json.JSONModel();  
			        	oModel.setData({writeMode:writeMode});
			        	oView.setModel(oModel,'helper');
		        	}	        		        		
	        	}	
	        	
	        	if ("new-anticipo" === sRoute) {
	        		console.log("DetailAnticipo - attachRouteMatched with route " + sRoute + " matches!");
		        	if (oEvent.getParameter("arguments").Expenseid) {
		        		oView.getModel('anticipos').refresh(true);
		        		var oFormAnticipo = oView.byId('anticipoForm');
		        		var oFormSolicitud = oView.byId('solicitudForm');
	        		
		        		oFormSolicitud.unbindElement('anticipos');
		        		oFormAnticipo.unbindElement('anticipos');	        		
	        		
		        		var Expenseid = oEvent.getParameter("arguments").Expenseid;
		        		var Bukrs = oEvent.getParameter("arguments").Bukrs;
		        		
			        	var oPathSolicitud = "/RequestHeaderSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Langu='S')"
			        	oFormSolicitud.bindElement("anticipos>" + oPathSolicitud);			        				        
		        			        		
			        	var oModel = new sap.ui.model.json.JSONModel();  
			        	oModel.setData({writeMode:true});			        	
			        	oView.setModel(oModel,'helper');
			        	oView.byId('fechadocBox').setDateValue(today);
			        	oView.byId('fechacontBox').setDateValue(today);
			        	oView.byId('statusAnticipoBox').setSelectedKey("01");
			        	
		        	}
	        	}		        	
	        	
			});
		},

		onChange: function(oEvent) {
			var comprobacion = oEvent.getParameter('value');
			comprobacion = Formatter.pad(comprobacion,10);
			var oView = this.getView();
    		var Expenseid = comprobacion;
    		var Bukrs = "1000";// oEvent.getParameter("arguments").Bukrs;
        	var oPathSolicitud = "/RequestHeaderSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Langu='S')"
        	var oFormSolicitud = oView.byId('solicitudForm');
        	oFormSolicitud.bindElement("anticipos>" + oPathSolicitud);	
		},

		saveAnticipo : function(oEvent) {
			
			console.log('saveAnticipo clicked:' +  oEvent);
			
			var oView = this.getView();
			var Expenseid = oView.byId('comprobacion').getValue();
			var Bukrs = "1000";
			var oDataHeader = oView.getModel("anticipos").getProperty("/RequestHeaderSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Langu='ES')");
			
			var importe = oView.byId('importe');
			var tipoMonedaBox = oView.byId('tipoMonedaBox');
			var fechadocBox = oView.byId('fechadocBox');
			var fechacontBox = oView.byId('fechacontBox');
			var Reqlin = oView.byId("Reqlin").getValue();
			var action = "";
			
			if (Reqlin && Reqlin != "") {
				console.log("update anticipo");
				action = "update";
			} else {
				console.log("create anticipo");
				action = "create";
			}
			
			oView.getModel('anticipos').resetChanges(function(){},function(){});

			if ("create" === action) {
				
			    var oContext = oView.getModel('anticipos').createEntry("AdvanceItemSet",
			    		{
			    		    "Bukrs" : oDataHeader.Bukrs,
			    		    "Expenseid" : oDataHeader.Expenseid,
			    		    "Reqlin" : "0000",
			    		    "Bldat" : fechadocBox.getDateValue(),
			    		    "Budat" : fechacontBox.getDateValue(),
			    		    "Wrbtr" : importe.getValue(), 
			    		    "Waers" : tipoMonedaBox.getSelectedKey(),  
			    		    "Status" : "01", 
			    		    "Langu" : "S" 		    	
			    		}
				    );	
				    
			    var callBacks = {
			    	success :function (oData, oResponse) {
			    		var newExpenseid = oData.Expenseid;
			    		var newBukrs = oData.Bukrs;
			    		var newReqlin = oData.Reqlin; 
			        	var oPathAnticipo = "/AdvanceItemSet(Bukrs='"+newBukrs+"',Expenseid='"+newExpenseid+"',Reqlin='"+newReqlin+"',Langu='S')"
			        	var oFormAnticipo = oView.byId('anticipoForm');
			        	oFormAnticipo.bindElement("anticipos>" + oPathAnticipo);
			        	MessageBox.success("Anticipo " +  oData.Expenseid + " - " + oData.Reqlin + " creado satisfactoriamente.");
			    	},
			    	error : function (oError) {
			    		console.log('error');
			    		oView.getModel('anticipos').deleteCreatedEntry(oContext); // a must, when submitChanges returns error
			    		MessageBox.error("Error al grabar datos. ");
			    	}
		    	}
			    oView.getModel('anticipos').submitChanges(callBacks.success, callBacks.error);
			    
			} else if ("update" === action) {
				
			    var callBacks = {
			    	success :function (oData, oResponse) {
			        	var oPathAnticipo = "/AdvanceItemSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Reqlin='"+Reqlin+"',Langu='S')"
			        	var oFormAnticipo = oView.byId('anticipoForm');
			        	oFormAnticipo.bindElement("anticipos>" + oPathAnticipo);
			        	MessageBox.success("Anticipo " +  Expenseid + " - " + Reqlin + " grabado satisfactoriamente.");
			    	},
			    	error : function (oError) {
			    		console.log('error:' + oError);
			    		MessageBox.error("Error al grabar datos. ");
			    	}
		    	}
			    
			    var amount = Formatter.amount(importe.getValue());
			    
			    oView.getModel('anticipos').update("/AdvanceItemSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Reqlin='"+Reqlin+"',Langu='S')",
				    	{
			    		  "d" : {
				    		    "Bukrs" : oDataHeader.Bukrs,
				    		    "Expenseid" : oDataHeader.Expenseid,
				    		    "Reqlin" : Reqlin,
				    		    "Bldat" : fechadocBox.getDateValue(),
				    		    "Budat" : fechacontBox.getDateValue(),
				    		    "Wrbtr" : amount + "", 
				    		    "Waers" : tipoMonedaBox.getSelectedKey(),  
				    		    //"Status" : "01", 
				    		    "Langu" : "S" 		    	
				    		}
			    		},
				    	{
					    	context : null,
					    	success : callBacks.success,
					    	error : callBacks.error
				    	}
				    );				    
			}

			   
		},
		
		resetAnticipo : function(){
			var oView = this.getView();
			var oFormAnticipo = oView.byId('anticipoForm');
			oFormAnticipo.unbindElement('anticipos');
		},
		
		createContent : function() {
			console.log('createContent called -  com.ittumi.compgastos.anticipos.controller.DetailAnticipo');
		},

		exitAnticipo : function() {
			window.history.go(-1);
		},
		
		onNavBack : function() {
			window.history.go(-1);
		}

	});

});
