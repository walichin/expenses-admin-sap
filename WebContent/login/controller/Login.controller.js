sap.ui.define(["jquery.sap.global", "sap/ui/core/mvc/Controller", "sap/m/MessageBox"], function(jQuery, Controller, MessageBox) {
	"use strict";

	return Controller.extend("com.ittumi.compgastos.login.controller.Login", {

		onInit : function() {
			console.log("onInit called - com.ittumi.compgastos.login.controller.Login");

	        sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
	        	var sRoute = oEvent.getParameter("name");
	        	console.log("sRoute:" + sRoute);
	        	if ("login" === sRoute) {
	        		sap.ui.getCore().User = new Object(); // Clear user data
	        	}
	        });	
	        
			// attach handlers for validation errors
			sap.ui.getCore().attachValidationError(function(evt) {
				var control = evt.getParameter("element");
				if (control && control.setValueState) {
					control.setValueState("Error");
				}
			});
			sap.ui.getCore().attachValidationSuccess(function(evt) {
				var control = evt.getParameter("element");
				if (control && control.setValueState) {
					control.setValueState("None");
				}
			});

		},

		createContent : function() {
			console.log('createContent called -  com.ittumi.compgastos.login.controller.Login');
		},
		
		onPasswordChange : function(evt) {
			console.log('onPasswordChange called -  com.ittumi.compgastos.login.controller.Login');
			var oView = this.getView();
			this.doLogin(oView);			
		},

		onPress : function(evt) {
			console.log('onPress called -  com.ittumi.compgastos.login.controller.Login');
			var oView = this.getView();
			this.doLogin(oView);
		},
		
		doLogin : function(oView) {
			console.log('doLogin called -  com.ittumi.compgastos.login.controller.Login');
			var oRouter = sap.ui.core.routing.Router.getRouter('app');
			//var oView = this.getView();
			var oModel = oView.getModel('login');

			// collect input controls
			var inputs = [oView.byId('myUser'), oView.byId('myPassword')];

			jQuery.each(inputs, function(i, input) {
				input.setValueState("None");
			});
			
			// check that inputs are not empty
			// this does not happen during data
			// binding as this is only triggered
			// by changes
			jQuery.each(inputs, function(i, input) {
				if (!input.getValue()) {
					input.setValueState("Error");
				}
			});

			// check states of inputs
			var canContinue = true;
			jQuery.each(inputs, function(i, input) {
				if ("Error" === input.getValueState()) {
					canContinue = false;
					return false;
				}
			});

			// output result
			if (canContinue) {
				var oparameters = {
					Userweb : oView.byId('myUser').getValue(),
					Password : oView.byId('myPassword').getValue(),
					Language : 'S'
				};

				console.log(oparameters);
				console.log(oView.byId('myUser').getValue());
				console.log(oView.byId('myPassword').getValue());

				oView.setBusy(true);
				
				oModel.callFunction("PassCheck", "GET", oparameters, null, function(oData, oResponse) {
					
					oView.setBusy(false);
					
					console.log(oResponse);
					console.log(oResponse.body);

					var loginOK = false;

					// check oResponse body for errors
					if (oData && oData.PassCheck && oData.PassCheck.Lifnr) {
						loginOK = true;
						sap.ui.getCore().User = new Object();
						sap.ui.getCore().User.userName = oData.PassCheck.Lifnam;
						sap.ui.getCore().User.userWeb = oData.PassCheck.Userweb;
						sap.ui.getCore().User.userLifnr = oData.PassCheck.Lifnr;																		
					}

					if (loginOK) {
						oRouter.navTo("_menu", {}, false);
					} else {
						MessageBox.error("Error obteniendo datos del usuario.");
					}

				}, function(oError) {
					oView.setBusy(false);
					try {
						var obj = jQuery.parseJSON(oError.response.body);
						MessageBox.error(obj.error.message.value);
					} catch (e) {
						MessageBox.error("Nombre de usuario o clave incorrectos.");
					}
					console.log(oError);
				});
			}			
		}

	});

});