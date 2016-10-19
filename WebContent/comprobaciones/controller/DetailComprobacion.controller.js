jQuery.sap.require("util.Formatter");
var oDetailComprobacionCabModel;
var oDetailComprobacionPosModel;

var fechaDoc;
var fechaCont;

var oLisCombosModel;
var idStatus = -1;

// Contenido de Archivos XML/PDF.
var fileContentXML;
var fileContentPDF;

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	'sap/m/BusyDialog',
	'sap/m/Button',
	'sap/m/Text',
	'sap/m/Select',
	'sap/m/Input',
	'sap/m/DatePicker',
	'sap/ui/layout/form/SimpleForm',
	'sap/ui/core/Item',
	'sap/m/Label',
	 "sap/ui/unified/FileUploader",
	 "sap/m/MessageBox",
	 "sap/m/CustomListItem",
	 "sap/m/HBox",
	 "sap/ui/core/Icon",
	 "sap/m/List"
], function(Controller, Dialog, BusyDialog, Button, Text, Select, Input, DatePicker, SimpleForm, Item, Label, FileUploader, MessageBox, CustomListItem, HBox, Icon, List) {
	"use strict";
	
	var Expenseid;
	var Bukrs;
	var Langu;
	var header_xcsrf_token;
	var Expenseline;
	
	return Controller.extend("com.ittumi.compgastos.comprobaciones.controller.DetailComprobacion", {
		
		onInit : function () {
			console.log("onInit called - com.ittumi.compgastos.comprobaciones.controller.DetailComprobacion");
			
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			this._oRouter = this._oComponent.getRouter();	
			
			var oView = this.getView();

			var oModelCombos = sap.ui.getCore().getModel('mCombos');
			var oModelTables = sap.ui.getCore().getModel('mTables');
			
			oDetailComprobacionPosModel =  new sap.ui.model.json.JSONModel();
			oDetailComprobacionCabModel =  new sap.ui.model.json.JSONModel();
			
			var inputs = [
			              oView.byId("idFechaDoc"),
			              oView.byId("idFechaCont"),
			                       ];
			          
			var buttons = [
			              oView.byId("idButSave"),
			              oView.byId("idButDelGasto"),
			              oView.byId("idButAddGasto"),
			];
			
			sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
	        	console.log('attachRouteMatched called -  com.ittumi.compgastos.comprobaciones.controller.DetailComprobacion');
	        	
	        	oView.setModel(new sap.ui.model.json.JSONModel(sap.ui.getCore().User),'context');

	        	var sRoute = oEvent.getParameter("name");
	        	console.log("sRoute2:" + sRoute);
	        	
	        	if ("details" === sRoute) {
		        	if (oEvent.getParameter("arguments").Expenseid) {
		        		
		        		Expenseid = oEvent.getParameter("arguments").Expenseid;
		        		Bukrs = oEvent.getParameter("arguments").Bukrs;
		        		Langu = oEvent.getParameter("arguments").Langu;
		        		
			        	var oPathCabComp = "/RequestHeaderSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Langu='"+Langu+"')"
			        	
			        	var oPathPosComp = "/RequestHeaderSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Langu='"+Langu+"')/ToExpenseItem"
			        	
			        	var oModel = sap.ui.getCore().getModel('comprobaciones');
			        	oModel.oHeaders = {
			        			"X-CSRF-Token":"Fetch",
			            };
			        	
			        	oModel.read(oPathCabComp,  
					             null,  
					             null,  
					             false,  
					             function _OnSuccess(oData, response) {
			        		
			        			 header_xcsrf_token = response.headers['x-csrf-token'];
			        		
			        			 oDetailComprobacionCabModel.setData({temp_CabeceraComp: oData});
					             oView.byId("DtCmp1").setText("Detalle Comprobaci\u00f3n "+Expenseid); 
					             oView.byId("comprobacionCabForm").setModel(oDetailComprobacionCabModel,"mComCab");
					             oView.byId("comprobacionPosForm").setModel(oDetailComprobacionCabModel,"mComCab");
					             
					             idStatus = oDetailComprobacionCabModel.getData().temp_CabeceraComp.Status;
					             
					             if(idStatus==1 || idStatus==4){
					            	 console.log('Estatus: '+idStatus);
					            	 
					            	 jQuery.each(inputs, function (i, input) {
					            		 input.setEnabled(true);
					                      });
					            	 
					            	 jQuery.each(buttons, function (i, button) {
					            		 button.setVisible(true);
					                      });
					            	 if(fechaDoc!=undefined){
						            		oView.byId("idFechaDoc").setValue(fechaDoc);
						            	 }
						            	 if(fechaCont!=undefined){
						            		oView.byId("idFechaCont").setValue(fechaCont); 
						            	 }
						            	 
					             }
					             else{
					            	 console.log('Estatus: '+idStatus);
					            	 
					            	 jQuery.each(inputs, function (i, input) {
					            		 input.setEnabled(false);
					                      });
					            	 
					            	 jQuery.each(buttons, function (i, button) {
					            		 button.setVisible(false);
					                      });
					             }
					             
					     		},
					     		function _OnError(oError){    
					     			oDetailComprobacionCabModel.setData();
		                        }
			        	); 
			        	
			        	oModel.read(oPathPosComp,  
					             null,  
					             null,  
					             false,  
					             function _OnSuccess(oData, response) {
			        		
				        			 oDetailComprobacionPosModel.setData({temp_listaPosComp: oData.results});
				        			 var items = oDetailComprobacionPosModel.oData.temp_listaPosComp.length;
				        			 oView.byId("idHeaderTableDetComp").setText("Items ("+items+")");
						             oView.byId("idTableDetComp").setModel(oDetailComprobacionPosModel,"mComPos"); 
		                        },  
		                        function _OnError(oError){    
		                        	oDetailComprobacionPosModel.setData();
		                        	oView.byId("idHeaderTableDetComp").setText("Items (0)");
		                        }                               
			        	
			        	);
			        	
			        	oModel.callFunction("GetExpenseStatus", "GET", {'Language':Langu}, null, function(oData, oResponse) {
			        		
			        		var myData = oModelCombos.getData();
			        		myData.StatusList = oData.results;
			        		
			        		oModelCombos.setData(myData);
			        		
						}, function(oError) {
							console.log(oError);
						});

			        	oModel.callFunction("GetExpenseClassList", "GET", {'Language':Langu,'Bukrs':Bukrs}, null, function(oData, oResponse) {
			        		
			        		var myData = oModelTables.getData();
			        		myData.ClaseGastoList = oData.results;
			        		
			        		oModelTables.setData(myData);
							
						}, function(oError) {
							console.log(oError);
						});

			        	oModel.callFunction("GetAccountList", "GET", {'Language':Langu,'Bukrs':Bukrs,'Search':'M'}, null, function(oData, oResponse) {
			        		
			        		var myData = oModelTables.getData();
			        		myData.CuentaMayorList = oData.results;
			        		
			        		oModelTables.setData(myData);
							
						}, function(oError) {
							console.log(oError);
						});

			        	oModel.callFunction("GetBudgetList", "GET", {'Bukrs':Bukrs,'ExpenseId':Expenseid,'Language':Langu}, null, function(oData, oResponse) {
			        		
			        		var myData = oModelTables.getData();
			        		myData.PresupuestosList = oData.results;
			        		
			        		oModelTables.setData(myData);
							
						}, function(oError) {
							console.log(oError);
						});
			        	
			        	oModel.callFunction("GetCenterCostList", "GET", {'Language':Langu,'Bukrs':Bukrs,'Search':''}, null, function(oData, oResponse) {
			        		
			        		var myData = oModelTables.getData();
			        		myData.CentroCostoList = oData.results;
			        		
			        		oModelTables.setData(myData);
						}, function(oError) {
							console.log(oError);
						});
			        	
			        	oModel.callFunction("GetCurrencyList", "GET", {'Language':Langu}, null, function(oData, oResponse) {
			        		
			        		var myData = oModelCombos.getData();
			        		myData.MonedasList = oData.results;
			        		
			        		oModelCombos.setData(myData);
			        		
						}, function(oError) {
							console.log(oError);
						});

			        	oModel.callFunction("GetTaxList", "GET", {'Language':Langu,'Bukrs':Bukrs}, null, function(oData, oResponse) {
			        		
			        		var myData = oModelCombos.getData();
			        		myData.IndImpuestoList = oData.results;
			        		
			        		oModelCombos.setData(myData);
							
						}, function(oError) {
							console.log(oError);
						});
			        	
			        	oModel.callFunction("GetPaymentMethods", "GET", {'Language':Langu}, null, function(oData, oResponse) {
			        		
			        		var myData = oModelCombos.getData();
			        		myData.MetodPagoList = oData.results;
			        		
			        		oModelCombos.setData(myData);
							
						}, function(oError) {
							console.log(oError);
						});
			        	
			        	oModel.callFunction("GetExpenseType", "GET", {'Language':Langu}, null, function(oData, oResponse) {
			        		
			        		var myData = oModelCombos.getData();
			        		myData.TipoGastoList = oData.results;
			        		
			        		oModelCombos.setData(myData);
							
						}, function(oError) {
							console.log(oError);
						});
			        	
			        	oModel.callFunction("GetMeasureUnits", "GET", {'Language':Langu}, null, function(oData, oResponse) {
			        		
			        		var myData = oModelCombos.getData();
			        		myData.UnidadMedidaList = oData.results;
			        		
			        		oModelCombos.setData(myData);
							
						}, function(oError) {
							console.log(oError);
						});
			        	/*
			        	oModel.callFunction("GetRequestStatus", "GET", {'Language':Langu}, null, function(oData, oResponse) {
			        		
			        		var myData = oModelCombos.getData();
			        		myData.ReqStatusList = oData.results;
			        		// Pendiente - Aprobación - Aprobado/Doc Anticipo - Pagado/Contabilizado - Rechazado - Anulado
			        		
			        		oModelCombos.setData(myData);
			        		
						}, function(oError) {
							console.log(oError);
						});*/
		        	}	        		        		
	        	}	
	        	
	        });
		},
		
		OnPressIconTabBar : function(oEvent) {
			
			var oButtonGrabar = this.getView().byId("idButSave");
			
			if(oEvent.getSource().getSelectedKey()=="key1"){
				
				
				if(idStatus==1 || idStatus==4){
	            	 oButtonGrabar.setVisible(true);
	             }
	             else{
	            	 oButtonGrabar.setVisible(false);
	             }
			}
			else {
				oButtonGrabar.setVisible(false);
			}
		},
		
		OnchangeFechaDoc: function(oEvent) {
			fechaDoc=this.getView().byId("idFechaDoc").getValue();
		},
		
		OnchangeFechaCont: function(oEvent) {
			fechaCont=this.getView().byId("idFechaCont").getValue();
		},
		
		createContent: function() {
			console.log('createContent called -  com.ittumi.compgastos.comprobaciones.controller.DetailComprobacion');

		},
		
		onListItemPress : function(oEvent) {
			console.log("onListItemPress called - com.ittumi.compgastos.comprobaciones.controller.DetailComprobacion");
		},

		onNavBack: function() {  
			window.history.go(-1); 
			this.getView().byId("idIconTabBarDetComp").setSelectedKey("key1");
			fechaDoc=undefined; 
			fechaCont=undefined;
		},
					
		onPressAddGasto:function() {
			var oView = this.getView();
			var sPathCGL;
			var codCoin;
			//var dialog;
			
			var fValueListClass= function(oEvt) {
				
				var InputClaseG = oEvt.getSource();
				var StringInputClaseG = "";
				
				var dialog_ClssGasto = new Dialog({
					title: 'Seleccionar Clase Gasto',
					type: 'Standard',
					contentWidth: '700px',
					content: [
						new sap.m.Table({
						    mode: 'SingleSelectLeft',
						    includeItemInSelection: true,
						    headerToolbar: new sap.m.Toolbar({
						    	content:[
									    new sap.m.Title({
									         width: '200px',
									    	 text: 'Items (---)', 
									    	 level: 'H2'
									    }),
									    new sap.m.SearchField({
									    	selectOnFocus: false,
									    	liveChange: function(oEvt) {
									    		// add filter for search
									    		var aFilters = [];
									    		var sQuery = oEvt.getSource().getValue();
									    		if (sQuery && sQuery.length > 0) {
									    			var filter = new sap.ui.model.Filter("Expenseclassdes", sap.ui.model.FilterOperator.Contains, sQuery);
									    			aFilters.push(filter);
									    		}

									    		// update list binding
									    		var binding = dialog_ClssGasto.getContent()[0].getBinding("items");
									    		binding.filter(aFilters);
									    	}
									    }),
						    	]
						    }),
						    columns: [
						      new sap.m.Column({ width: "8em", header: new sap.m.Label({text: 'ClaGas'})}),
						      new sap.m.Column({ width: "8em", header: new sap.m.Label({text: 'Cuenta Mayor'})}),
						      new sap.m.Column({ header: new sap.m.Label({text: 'Descripción'})}),
						
						    ],
						    items: {
						      path: 'mTables>/ClaseGastoList',
						      template: new sap.m.ColumnListItem({
						    	//type: "Active",
						        cells: [
						          new sap.m.Text({ text: '{mTables>Expenseclass}' }),
						          new sap.m.Text({ text: '{mTables>Hkont}' }),
						          new sap.m.Text({ text: '{mTables>Expenseclassdes}' })
						        ]
						      })
						    },
						    selectionChange : function (oEvent) {
						    	sPathCGL = oEvent.getParameter('listItem').getBindingContext("mTables").getPath();
						    	StringInputClaseG = 
						    		sap.ui.getCore().getModel('mTables').getProperty(sPathCGL).Expenseclass+
						    		" "+
						    		sap.ui.getCore().getModel('mTables').getProperty(sPathCGL).Expenseclassdes;
						    }
						})
					],
					beginButton: new Button({
						text: 'Ok',
						press: function () {
							if(StringInputClaseG != ""){
								InputClaseG.setValue(StringInputClaseG);
								dialog_ClssGasto.close();
							}
							else sap.m.MessageToast.show("Seleccione un item de la lista.");
							
						}
					}),
					endButton: new Button({
						text: 'Cancel',
						press: function () {
							dialog_ClssGasto.close();
						}
					}),
					afterClose: function() {
						dialog_ClssGasto.destroy();
					}
				});
				
				dialog_ClssGasto.getContent()[0].getHeaderToolbar().getContent()[0].setText( "Items ("+sap.ui.getCore().getModel("mTables").oData.ClaseGastoList.length+")" );
				
				dialog_ClssGasto.open();
			};
			
			var fValueListCoins= function(evt) {
				
				var InputMoneda = evt.getSource();
				codCoin = -1;
				
				var dialog_ListCoins = new Dialog({
					title: 'Seleccionar Moneda',
					type: 'Standard',
					contentWidth: '500px',
					content: [
						new sap.m.Table({
						    mode: 'SingleSelectLeft',
						    includeItemInSelection: true,
						    headerToolbar: new sap.m.Toolbar({
						    	content:[
									    new sap.m.Title({
									         width: '200px',
									    	 text: 'Items (---)', 
									    	 level: 'H2'
									    }),
									    new sap.m.SearchField({
									    	selectOnFocus: false,
									    	liveChange: function(oEvt) {
									    		// add filter for search
									    		var aFilters = [];
									    		var sQuery = oEvt.getSource().getValue();
									    		if (sQuery && sQuery.length > 0) {
									    			var filter = new sap.ui.model.Filter("Ltext", sap.ui.model.FilterOperator.Contains, sQuery);
									    			aFilters.push(filter);
									    		}

									    		// update list binding
									    		var binding = dialog_ListCoins.getContent()[0].getBinding("items");
									    		binding.filter(aFilters);
									    	}
									    }),
						    	]
						    }),
						    columns: [
								new sap.m.Column({ header: new sap.m.Label({text: 'C\u00f3digo'})}),
								new sap.m.Column({ header: new sap.m.Label({text: 'Moneda'})})
						    ],
						    items: {
						    	path: 'mCombos>/MonedasList',
							      template: new sap.m.ColumnListItem({
							    	//type: "Active",
							        cells: [
							          new sap.m.Text({ text: '{mCombos>Waers}' }),
							          new sap.m.Text({ text: '{mCombos>Ltext}' })
							        ]
						      })
						    },
						    selectionChange : function (oEvent) {
						    	var sPath = oEvent.getParameter('listItem').getBindingContext("mCombos").getPath();
						    	codCoin = sap.ui.getCore().getModel('mCombos').getProperty(sPath).Waers;
						    }
						})
					],
					beginButton: new Button({
						text: 'Ok',
						press: function (oEvent) {
							if(codCoin != -1){
								InputMoneda.setValue(codCoin);
								dialog_ListCoins.close();
							}
							else sap.m.MessageToast.show("Seleccione un tipo de moneda.");
						}
					}),
					endButton: new Button({
						text: 'Cancel',
						press: function (oEvent) {
							dialog_ListCoins.close();
						}
					}),
					afterClose: function() {
						dialog_ListCoins.destroy();
					}
				});
				
				dialog_ListCoins.getContent()[0].getHeaderToolbar().getContent()[0].setText( "Items ("+sap.ui.getCore().getModel('mCombos').oData.MonedasList.length+")" );
				
				dialog_ListCoins.open();
			};
			
			var fChangeSelect= function(evt) {
				
				// Deshabilitar 4 InPuts Moneda,Importe, Ind. Impuesto, Fecha Compr.
				
				// evt.getSource().getItems()[0].getText().indexOf('Todo')!= -1
				if(evt.getSource().getSelectedKey() == "0001"){
					dialog.getContent()[0].getContent()[7].setEnabled(true);
					dialog.getContent()[0].getContent()[9].setEnabled(true);
					//dialog.getContent()[0].getContent()[11].setEnabled(false);
					dialog.getContent()[0].getContent()[13].setEnabled(false);
					dialog.getContent()[0].getContent()[15].setEnabled(false);
					dialog.getContent()[0].getContent()[17].setEnabled(false);
				}
				else {
					dialog.getContent()[0].getContent()[7].setEnabled(false);
					//dialog.getContent()[0].getContent()[9].setEnabled(false);
					//dialog.getContent()[0].getContent()[11].setEnabled(true);
					dialog.getContent()[0].getContent()[13].setEnabled(true);
					dialog.getContent()[0].getContent()[15].setEnabled(true);
					dialog.getContent()[0].getContent()[17].setEnabled(true);
				}
				
				//dialog.getContent()[0].getContent()[7].setEnabled(true);
				//dialog.getContent()[0].getContent()[9].setEnabled(true);
			};
			
			var fChangeInputMoneda= function(evt) {
				dialog.getContent()[0].getContent()[11].setValue("");
			};
			
			var dialog = new Dialog({
				title: 'Crear Item Comprobación',
				//type: 'Message',
				contentHeigth:"5000px",
				contentWidth:"750px",
				content: [

				          new SimpleForm({
										//minWidth:1024,
										maxContainerCols:2,
										layout:"ResponsiveGridLayout",
										class:"editableForm",
										editable:true,
										content: [
										    // 0
											new Label({ text: 'Tipo Comprobante' }),
											new Select({
												change: fChangeSelect,
												items: {
										            path: "mCombos>/TipoGastoList",
										            template: new Item({
										            	key:"{mCombos>FixedValued}",
										            	text:"{mCombos>FixedValued} {mCombos>DescText}" })
										        }
											}),
										    // 2
											new Label({ text: 'Clase Gasto',
													   //layoutData:[new GridData({span:"L2 M1 S4"})]
													}),
											new Input({ value:"", showValueHelp: true, valueHelpRequest: fValueListClass
														//layoutData:[new GridData({span:"L2 M3 S4"})]
													   }),
											// 4
											new Label({ text: 'Forma de Pago' }),
											new Select({
														items: {
												            path: "mCombos>/MetodPagoList",
												            template: new Item({
												            	key:"{mCombos>Paymet}",
												            	text:"{mCombos>Paymet} {mCombos>Paymetdes}" })
											}}),
										    // 6
											new Label({ text: 'XML CFDI' }),
											new FileUploader({ 	id: 'fileUploaderXML',
																value:'',
																width:"100%", fileType: "xml",
																buttonText: "Browse..."
												   }),
											// 8
											new Label({ text: 'PDF' }),
											new FileUploader({ 	id: 'fileUploaderPDF',
																value:'',
																width:"100%", fileType: "pdf",
																buttonText: "Browse..."
													   }),
											// 10 //
											new Label({ text: 'Moneda' }),
											/*
											new Select({
														selectedKey: "MXN",
														items: {
												            path: "mCombos>/MonedasList",
												            template: new Item({
												            	key:"{mCombos>Waers}",
												            	text:"{mCombos>Ltext}" })
												        }
													}),
											*/
											new Input({ value:"", showValueHelp: true, valueHelpRequest: fValueListCoins,
														liveChange: fChangeInputMoneda}),
											// 12
											new Label({ text: 'Importe'}),
											new Input({ value:"", textAlign:"Right", enabled: false }),
											// 14
											new Label({ text: 'Ind. Impuesto'}),
											new Select({
												enabled: false,
												items: {
										            path: "mCombos>/IndImpuestoList",
										            template: new Item({
										            	key:"{mCombos>Mwskz}",
										            	text:"{mCombos>Mwskz} {mCombos>Text1}" })
											}}),
											// 16
											new Label({ text: 'Fecha Comprobante'}),
											new DatePicker({ displayFormat:"dd.MM.yyyy",
															 valueFormat:"dd.MM.yyyy", UTC:"true", placeholder: " ",
															 enabled: false,
											}),
													   
										]
				          			})
				],
				beginButton: new Button({
					text: 'Confirmar',
					press: function () {
						
						var busyDialog = new BusyDialog();
						busyDialog.open();
						
						var oPathAddComp = "/ExpenseItemSet";
						
						var oEntry = {};
						oEntry.Bukrs = Bukrs;
						oEntry.Expenseid = Expenseid;
						oEntry.Langu = Langu;
						var vExpensetype = dialog.getContent()[0].getContent()[1].getSelectedKey();
						oEntry.Expensetype = vExpensetype;
						(sap.ui.getCore().getModel('mTables').getProperty(sPathCGL)===null) ? oEntry.Expenseclass=' ' : oEntry.Expenseclass = sap.ui.getCore().getModel('mTables').getProperty(sPathCGL).Expenseclass;
						oEntry.Expenquan='1';
						oEntry.Paymet = dialog.getContent()[0].getContent()[5].getSelectedKey();
						oEntry.Waers = codCoin;
						
						// Obtenemos el FileUploader del XML.
						var fileUploadXML = sap.ui.getCore().byId('fileUploaderXML').oFileUpload.files[0];
						// Obtenemos el FileUploader del PDF.
						var fileUploadPDF = sap.ui.getCore().byId('fileUploaderPDF').oFileUpload.files[0];
						if(vExpensetype == '0001'){
							if(fileUploadXML && fileUploadPDF){
								// Procedemos a iniciar el Registro
								var r = new FileReader();  
								r.onload = function(e) {
									// TODO: Procesamiento del contenido del XML.
									// Se debe de convertir el valor en Binario (No UTF-8).
									fileContentXML = e.target.result;
									var r2 = new FileReader();  
									r2.onload = function(e){
										//TODO:Process fileContent  
										fileContentPDF = e.target.result;
										// Enviamos la información vía POST.
										// Contenido en Base 64.
										oEntry.Binxml	= btoa(fileContentXML);

										oEntry.Binpdf	= btoa(fileContentPDF);

										var oModel = sap.ui.getCore().getModel('comprobaciones');
											
										oModel.oHeaders={
												"X-CSRF-Token": header_xcsrf_token,  
										};
											
										oModel.create(oPathAddComp, oEntry, null, function(oData, oResponse){
											oView.getController().updateTableComprobaciones();
											console.log('success');
											
											setTimeout(function(){
												busyDialog.close();
												dialog.close();
												MessageBox.success("Se registró una nueva comprobación.");
											}, 1000);
											
										},function(oError){
											    	// Creamos Modelo de Mensajes.
											    	var moLogErrores = new sap.ui.model.json.JSONModel();
											    	var oJSONData	 = $.parseJSON(oError.response.body);
											    	moLogErrores.setData(oJSONData.error.innererror.errordetails);
											    	var oIMessageTemplate = new CustomListItem({
														content: [
														          new HBox({
															       		items:[
																				//Icono del Tipo de Mensaje.
																				new Icon({
																					src: {
																						path: "severity",
																				        formatter: function(fValue){
																				        	var oValueReturn;
																				        	switch (fValue){
																				        		case "error":
																				        			oValueReturn = "sap-icon://message-error";
																				        			break;
																				        	}
																				        	return oValueReturn;
																				        }
																					},
																					color: {
																						path: "severity",
																				        formatter: function(fValue){
																				        	var oValueReturn;
																				        	switch (fValue){
																				        		case "error":
																				        			oValueReturn = "#cc1919";
																				        			break;
																				        	}
																				        	return oValueReturn;
																				        }
																					}
																				}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom"),
																				// Texto del Mensaje.
																				new Label({
																					text: "{message}"
																				}).addStyleClass("sapUiResponsiveMargin")
															       		]
															       	})
														          ]
													});
											    	
											    	// Creamos el Template de Mensaje
											    	var ListLog = new List({
														items: {
															path: '/',
															template: oIMessageTemplate
														}
													});
											    	
											    	// Agregamos el modelo.
											    	ListLog.setModel(moLogErrores);
											    	
											    	// Armamos el Dialog para mostrar los mensajes de Error.
											    	var dialogLogOper = new Dialog({
														title: 'Mensaje',
														//type: 'Message',
														contentHeigth:"5000px",
														contentWidth:"750px",
														content: ListLog,
														beginButton: new Button({
															text: 'Cerrar',
															press: function () {
																dialogLogOper.close();
															}
														}),
											            afterClose: function() {
											            	dialogLogOper.destroy();
														}
											    	});
											    	setTimeout(function(){
											    		busyDialog.close();
											    		dialog.close();
											    		dialogLogOper.open();
											    	}, 1000);
											    	
										});
											
										oModel.refresh(true);
									};
									r2.readAsBinaryString(fileUploadPDF); //Start read process  
								};  
								r.readAsText(fileUploadXML); //Start read process  
							}else{
								// No se están enviando los dos archivos.
								MessageBox.error("No se han enviado los archivos XML y PDF.");
								busyDialog.close();
							}
						}else{
							// Seleccionó diferente a CFDI.
							// Procedemos a iniciar el Registro
							if(fileUploadPDF != undefined){
								//sube un pdf
								var r2 = new FileReader();  
								r2.onload = function(e){
								//TODO:Process fileContent  
								fileContentPDF = e.target.result;
								// Enviamos la información vía POST.
								// Contenido en Base 64.
								oEntry.Wrbtr = dialog.getContent()[0].getContent()[13].getValue();
								oEntry.Mwskz = dialog.getContent()[0].getContent()[15].getSelectedKey();
								oEntry.Bldat = dialog.getContent()[0].getContent()[17].getDateValue();
								oEntry.Binpdf	= btoa(fileContentPDF);

								var oModel = sap.ui.getCore().getModel('comprobaciones');
										
								oModel.oHeaders={
												"X-CSRF-Token": header_xcsrf_token,  
								};
								
								oModel.create(oPathAddComp, oEntry, null, function(oData, oResponse){
									oView.getController().updateTableComprobaciones();
									console.log('success');
									
									setTimeout(function(){
										busyDialog.close();
										//dialog.close();
										MessageBox.success("Se registró una nueva comprobación.");
									}, 1000);
									
									
							    },function(oError){
						               // Creamos Modelo de Mensajes.
						               var moLogErrores = new sap.ui.model.json.JSONModel();
						               var oJSONData  = $.parseJSON(oError.response.body);
						               moLogErrores.setData(oJSONData.error.innererror.errordetails);
						               var oIMessageTemplate = new CustomListItem({
						             content: [
						                       new HBox({
						                       items:[
						                   //Icono del Tipo de Mensaje.
						                   new Icon({
						                    src: {
						                     path: "severity",
						                           formatter: function(fValue){
						                            var oValueReturn;
						                            switch (fValue){
						                             case "error":
						                              oValueReturn = "sap-icon://message-error";
						                              break;
						                            }
						                            return oValueReturn;
						                           }
						                    },
						                    color: {
						                     path: "severity",
						                           formatter: function(fValue){
						                            var oValueReturn;
						                            switch (fValue){
						                             case "error":
						                              oValueReturn = "#cc1919";
						                              break;
						                            }
						                            return oValueReturn;
						                           }
						                    }
						                   }).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom"),
						                   // Texto del Mensaje.
						                   new Label({
						                    text: "{message}"
						                   }).addStyleClass("sapUiResponsiveMargin")
						                       ]
						                      })
						                       ]
						            });
						               
						               // Creamos el Template de Mensaje
						               var ListLog = new List({
						             items: {
						              path: '/',
						              template: oIMessageTemplate
						             }
						            });
						               
						               // Agregamos el modelo.
						               ListLog.setModel(moLogErrores);
						               
						               // Armamos el Dialog para mostrar los mensajes de Error.
						               var dialogLogOper = new Dialog({
							             title: 'Mensaje',
							             //type: 'Message',
							             contentHeigth:"5000px",
							             contentWidth:"750px",
							             content: ListLog,
							             beginButton: new Button({
							              text: 'Cerrar',
							              press: function() {
							               dialogLogOper.close();
							              }
							            }),
							            afterClose: function() {
							            	dialogLogOper.destroy();
										}
						               });
						               
						               setTimeout(function(){
						            	   busyDialog.close();
						               	   //dialog.close();
						               	   dialogLogOper.open();
											
										}, 1000);
						               
						         });
											
								var oTable = oView.byId('idTableDetComp'); 
				                oTable.getModel('mComPos').refresh(true);
										
								dialog.close();
											
								};  
								r2.readAsBinaryString(fileUploadPDF); //Start read process  
								
							}else{
								// No se están enviando los dos archivos.
								busyDialog.close();
								MessageBox.error("No se ha enviado el archivo PDF.");
							}
							
						}
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
			
		},
		
		onPressItemsSelect: function (oEvent) {
			// ir a la sgte vista de detalle
			
			var bindingContext = oEvent.getSource().getBindingContext('mComPos');
        	var Expenseid = bindingContext.getProperty('Expenseid');
        	var Bukrs = bindingContext.getProperty('Bukrs');
        	var Expenseline = bindingContext.getProperty('Expenseline');
        	var Langu = bindingContext.getProperty('Langu');
        	(Langu == '') ? Langu='S' : Langu='I';
        	
        	var oView = this.getView();
        	var oTable = oView.byId('idTableDetComp');
        	var items = oTable.getSelectedItems();
        	var sPath= items[0].getBindingContext('mComPos').getPath();
        	var idx = parseInt(sPath.split("/")[2]);
        	
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("modify",{Expenseid: Expenseid, Bukrs: Bukrs, Expenseline: Expenseline,Langu: Langu, Idx:idx},false);
		},
		
		onPressDelGasto: function (oEvent) {
			//eliminar item de comprobacion
			var oView = this.getView();
        	var oTable = oView.byId('idTableDetComp'); 
        	var items = oTable.getSelectedItems();
        	
        	if (items.length < 1) {
        		MessageBox.warning("Seleccione un registro");
        		return;
        	}
        	
			Expenseline = items[0].getBindingContext('mComPos').getProperty('Expenseline');
			
			var oPathDelComp = "/ExpenseItemSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Expenseline='"+Expenseline+"',Langu='"+Langu+"')";
			var oModel = sap.ui.getCore().getModel('comprobaciones');
			
			oModel.oHeaders={
                    			"X-CSRF-Token": header_xcsrf_token,  
			};
        	var busyDialog = new BusyDialog();
			var dialog = new Dialog({
				title: 'Anular Item Comprobación',
				type: 'Message',


				content: [
				          new Label({ text: 'Desea anular item?' })							
				          ],
				beginButton: new Button({
					text: 'Confirmar',
					press: function () {

						busyDialog.open();
						
						setTimeout(function(){
						oModel.remove(oPathDelComp,  
						{
					        context:null,
					        success :function () {
					        	oView.getController().updateTableComprobaciones();
					        },
					        error : function () {
							        busyDialog.close();	
							        console.log('error');
					        }
					       }                            
			        	
			        	);
						
						//oModel.refresh(true, true);
						//oModel.setRefreshAfterChange(false);
						
							busyDialog.close();
							MessageBox.success("Se realizó la anulación del item "+Expenseline);
							dialog.close();
						}, 1000);
						
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		},
		
		saveComprobacion: function(oEvent) {
			
			var busyDialog = new BusyDialog();
			busyDialog.open();
			
			   //Update Comprobacion
			   var oView = this.getView();
			   var oPathCabComp = "/RequestHeaderSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Langu='"+Langu+"')";
			   var oModel = sap.ui.getCore().getModel('comprobaciones');
			         
			   oModel.oHeaders={
					   "X-CSRF-Token": header_xcsrf_token,
					   
			   };
			   
			   setTimeout(function(){
			   oModel.update(oPathCabComp,
			   {
			     "d" : {
			    	 	"Webact" : "C",
			            "Bukrs" : Bukrs,
			            "Expenseid" : Expenseid,
			            "Buktx" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Buktx,
			            "Expensedoc" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Expensedoc, // From comboBox Screen
			            "Expensedocdes" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Expensedocdes,
			            "Lifnr" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Lifnr,
			            "Lifnam" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Lifnam,
			            "Deptcode" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Deptcode,
			            "Subdeptcode" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Subdeptcode,
			            "Deptxt" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Deptxt,
			            "Subdeptxt" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Subdeptxt,
			            "Deptkostl" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Deptkostl,
			            "Reqexpdat" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Reqexpdat,  
			            //"Reqexpdat" : oView.byId("idFechaDoc").getDateValue(),
			            "Budat" : oView.byId("idFechaCont").getDateValue(),
			            "Bldat" : oView.byId("idFechaDoc").getDateValue(),
			            "Erdat" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Erdat,
			            "Erzet" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Erzet,//"PT15H26M13S",
			            "Ernam" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Ernam,
			            "Aedat" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Aedat,
			            "Waers" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Waers,
			            "Reqind" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Reqind,
			            "Expind" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Expind,
			            "Userweb" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Userweb,
			            "Approver" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Approver,
			            "Apprdate" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Apprdate,
			            "Postedby" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Postedby,
			            "Postdate" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Postdate,
			            "Comment" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Comment,
			            "Status" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Status,
			            "Admin" : oView.byId("comprobacionCabForm").getModel("mComCab").getData().temp_CabeceraComp.Admin,
			            "Langu" : Langu
			          }
			        },
			       {
			        context:null,
			        success :function () {
			         console.log('success');
			         var oForm = oView.byId('comprobacionCabForm'); 
			         oForm.getModel('mComCab').refresh(true);
			         oView.getController().updateTableComprobacionesCab();
			         busyDialog.close();	
			         MessageBox.success("Datos grabados satisfactoriamente.");
			        },
			        error : function (oError) {
				        // Creamos Modelo de Mensajes.
				           var moLogErrores = new sap.ui.model.json.JSONModel();
				           var oJSONData  = $.parseJSON(oError.response.body);
				           moLogErrores.setData(oJSONData.error.innererror.errordetails);
				           var oIMessageTemplate = new CustomListItem({
				         content: [
				                   new HBox({
				                   items:[
				               //Icono del Tipo de Mensaje.
				               new Icon({
				                src: {
				                 path: "severity",
				                       formatter: function(fValue){
				                        var oValueReturn;
				                        switch (fValue){
				                         case "error":
				                          oValueReturn = "sap-icon://message-error";
				                          break;
				                        }
				                        return oValueReturn;
				                       }
				                },
				                color: {
				                 path: "severity",
				                       formatter: function(fValue){
				                        var oValueReturn;
				                        switch (fValue){
				                         case "error":
				                          oValueReturn = "#cc1919";
				                          break;
				                        }
				                        return oValueReturn;
				                       }
				                }
				               }).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom"),
				               // Texto del Mensaje.
				               new Label({
				                text: "{message}"
				               }).addStyleClass("sapUiResponsiveMargin")
				                   ]
				                  })
				                   ]
				        });
				           
				           // Creamos el Template de Mensaje
				           var ListLog = new List({
				         items: {
				          path: '/',
				          template: oIMessageTemplate
				         }
				        });
				           
				           // Agregamos el modelo.
				           ListLog.setModel(moLogErrores);
				           
				           // Armamos el Dialog para mostrar los mensajes de Error.
				           var dialogLogOper = new Dialog({
						         title: 'Mensaje',
						         //type: 'Message',
						         contentHeigth:"5000px",
						         contentWidth:"750px",
						         content: ListLog,
						         beginButton: new Button({
						          text: 'Cerrar',
						          press: function () {
						           dialogLogOper.close();
						          }
						         })
				           });
				           busyDialog.close();
				           dialogLogOper.open();
				       }
			       }
			      );
			   }, 1000);
			         
		},
		
		exitDetailComprobacion: function() {  
			window.history.go(-1);
			this.getView().byId("idIconTabBarDetComp").setSelectedKey("key1");
			fechaDoc=undefined;
			fechaCont=undefined;
		},
		
		updateTableComprobaciones: function(){
			var oView = this.getView();
			var oPathPosComp = "/RequestHeaderSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Langu='"+Langu+"')/ToExpenseItem"
        	
        	var oModel = sap.ui.getCore().getModel('comprobaciones');
        	oModel.oHeaders = {
        			"X-CSRF-Token":"Fetch",
            };
        	
        	oModel.read(oPathPosComp,  
		             null,  
		             null,  
		             false,  
		             function _OnSuccess(oData, response) {
	        			 oDetailComprobacionPosModel.setData({temp_listaPosComp: oData.results});
	        			 var items = oDetailComprobacionPosModel.oData.temp_listaPosComp.length;
	        			 oView.byId("idHeaderTableDetComp").setText("Items ("+items+")");
			             oView.byId("idTableDetComp").setModel(oDetailComprobacionPosModel,"mComPos"); 
                    },  
                    function _OnError(oError){    
                    	oDetailComprobacionPosModel.setData();
                    	oView.byId("idHeaderTableDetComp").setText("Items (0)");
                    }                               
        	
        	);
		},
		
		updateTableComprobacionesCab : function(){
			var oView = this.getView();
			
			var inputs = [
			              oView.byId("idFechaDoc"),
			              oView.byId("idFechaCont"),
			                       ];
			          
			var buttons = [
			              oView.byId("idButSave"),
			              oView.byId("idButDelGasto"),
			              oView.byId("idButAddGasto"),
			];
			
			var oPathCabComp = "/RequestHeaderSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Langu='"+Langu+"')"
        	
        	var oModel = sap.ui.getCore().getModel('comprobaciones');
        	oModel.oHeaders = {
        			"X-CSRF-Token":"Fetch",
            };
        	
        	oModel.read(oPathCabComp,  
		             null,  
		             null,  
		             false,  
		             function _OnSuccess(oData, response) {
        		
        			 header_xcsrf_token = response.headers['x-csrf-token'];
        		
        			 oDetailComprobacionCabModel.setData({temp_CabeceraComp: oData});
		             oView.byId("DtCmp1").setText("Detalle Comprobaci\u00f3n "+Expenseid); 
		             oView.byId("comprobacionCabForm").setModel(oDetailComprobacionCabModel,"mComCab");
		             oView.byId("comprobacionPosForm").setModel(oDetailComprobacionCabModel,"mComCab");
		             
		             idStatus = oDetailComprobacionCabModel.getData().temp_CabeceraComp.Status;
		             
		             if(idStatus==1 || idStatus==4){
		            	 console.log('Estatus: '+idStatus);
		            	 
		            	 jQuery.each(inputs, function (i, input) {
		            		 input.setEnabled(true);
		                      });
		            	 
		            	 jQuery.each(buttons, function (i, button) {
		            		 button.setVisible(true);
		                      });
		             }
		             else{
		            	 console.log('Estatus: '+idStatus);
		            	 
		            	 jQuery.each(inputs, function (i, input) {
		            		 input.setEnabled(false);
		                      });
		            	 
		            	 jQuery.each(buttons, function (i, button) {
		            		 button.setVisible(false);
		                      });
		             }
		             
		     		},
		     		function _OnError(oError){    
		     			oDetailComprobacionCabModel.setData();
                    }
        	); 
		},
		
	});

});