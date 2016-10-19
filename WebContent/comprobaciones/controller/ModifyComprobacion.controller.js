jQuery.sap.require("util.Formatter");
var oDetailItemGastComprobacionModel;
var oContComprobacionModel;
var oCeCoComprobacionModel;
var oAdjuntosComprobacionModel;
var idTableCeCo;

sap.ui.define([
    'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/m/Dialog',
	'sap/m/BusyDialog',
	'sap/m/Button',
    'sap/m/Text',
    'sap/m/Select',
    'sap/m/Input',
    'sap/ui/layout/form/SimpleForm',
    'sap/ui/core/Item',
    'sap/m/Label',
    "sap/m/MessageBox",
    "sap/ui/unified/FileUploader",
    "sap/m/CustomListItem",
    "sap/m/HBox",
    "sap/ui/core/Icon",
    "sap/m/List",
], function(jQuery, Controller, Dialog, BusyDialog, Button, Text, Select, Input, SimpleForm, Item, Label, MessageBox, FileUploader, CustomListItem, HBox, Icon, List) {
    "use strict";
	
	var Expenseid;
	var Bukrs;
	var Expenseline;
	var Langu;
	var Idx;

	var header_xcsrf_token;
	var oView;
	var Importe;
	var oPathAdjuntos;
	
	var SPathClaseGato_Gastos;
	
	return Controller.extend("com.ittumi.compgastos.comprobaciones.controller.ModifyComprobacion", {
		
		onInit : function () {
			console.log("onInit called - com.ittumi.compgastos.comprobaciones.controller.ModifyComprobacion");
			        	
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			this._oRouter = this._oComponent.getRouter();
			
			oView = this.getView();

			idTableCeCo = oView.byId("idTableCeCo");

			oCeCoComprobacionModel =  new sap.ui.model.json.JSONModel();  
			oDetailItemGastComprobacionModel =  new sap.ui.model.json.JSONModel(); 
			oContComprobacionModel =  new sap.ui.model.json.JSONModel();
			oAdjuntosComprobacionModel =  new sap.ui.model.json.JSONModel();
        	
        	var oModelCombos = sap.ui.getCore().getModel('mCombos');
			
	        sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
	        	console.log('attachRouteMatched called -  com.ittumi.compgastos.comprobaciones.controller.ModifyComprobacion');
	        	
	        	oView.setModel(new sap.ui.model.json.JSONModel(sap.ui.getCore().User),'context');
	        	
	        	var sRoute = oEvent.getParameter("name");
	        	console.log("sRoute2:" + sRoute);
	        	
	        	if ("modify" === sRoute) {
	        		
	        		if(idStatus==1 || idStatus==4){
	        			oView.byId("idButSave").setVisible(true);
	        			oView.byId("idTableContab").setMode(sap.m.ListMode.SingleSelectLeft);
	        			oView.byId("id_d2_Adicionar").setVisible(true);
	        			oView.byId("id_d2_Eliminar").setVisible(true);
	        			oView.byId("id_d2_Mofificar").setVisible(true);
	        			oView.byId("id_d2_Grabar").setVisible(true);
	        			oView.byId("idTableCeCo").setMode(sap.m.ListMode.SingleSelectLeft);
	        			oView.byId("id_d3_Adicionar").setVisible(true);
	        			oView.byId("id_d3_Eliminar").setVisible(true);
	        			oView.byId("id_d3_Iguales").setVisible(true);
	        			oView.byId("id_d3_Mofificar").setVisible(true);
	        			oView.byId("id_d3_Grabar").setVisible(true);
	        			oView.byId("idTableDoc").setMode(sap.m.ListMode.SingleSelectLeft);
	        			oView.byId("id_d4_Adicionar").setVisible(true);
	        			oView.byId("id_d4_Eliminar").setVisible(true);
					}else{
						oView.byId("idButSave").setVisible(false);
						oView.byId("idTableContab").setMode(sap.m.ListMode.None);
						oView.byId("id_d2_Adicionar").setVisible(false);
						oView.byId("id_d2_Eliminar").setVisible(false);
						oView.byId("id_d2_Mofificar").setVisible(false);
						oView.byId("id_d2_Grabar").setVisible(false);
						oView.byId("idTableCeCo").setMode(sap.m.ListMode.None);
						oView.byId("id_d3_Adicionar").setVisible(false);
						oView.byId("id_d3_Eliminar").setVisible(false);
						oView.byId("id_d3_Iguales").setVisible(false);
						oView.byId("id_d3_Mofificar").setVisible(false);
						oView.byId("id_d3_Grabar").setVisible(false);
						oView.byId("idTableDoc").setMode(sap.m.ListMode.None);
						oView.byId("id_d4_Adicionar").setVisible(false);
						oView.byId("id_d4_Eliminar").setVisible(false);
					}
	        		
		        	if (oEvent.getParameter("arguments").Expenseid) {
		        		
		        		Expenseid = oEvent.getParameter("arguments").Expenseid; 
		        		Bukrs = oEvent.getParameter("arguments").Bukrs;
		        		Expenseline = oEvent.getParameter("arguments").Expenseline;
		        		Langu = oEvent.getParameter("arguments").Langu;
		        		Idx = oEvent.getParameter("arguments").Idx;
		        		
			        	var oPathDetGastItem = "/ExpenseItemSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Expenseline='"+Expenseline+"',Langu='"+Langu+"')"
			        	var oPathCont="/ExpenseItemSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Expenseline='"+Expenseline+"',Langu='"+Langu+"')/ToExpenseItemAcco";
			        	var oPathCeCo="/ExpenseItemSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Expenseline='"+Expenseline+"',Langu='"+Langu+"')/ToExpenseItemKostl"; 
			        	oPathAdjuntos = "/ExpenseItemSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Expenseline='"+Expenseline+"',Langu='"+Langu+"')/ToExpenseItemDoc"
			        	
			        	
			        	var oModel = sap.ui.getCore().getModel('comprobaciones');
						oModel.oHeaders = {
			        			"X-CSRF-Token":"Fetch",
			            };
			        	
			        	oModel.read(oPathDetGastItem,  
					             null,  
					             null,  
					             false,  
					             function _OnSuccess(oData, response) {
			        		
			        			 header_xcsrf_token = response.headers['x-csrf-token'];
			        		
			        			 oDetailItemGastComprobacionModel.setData({temp_DetailItem: oData});
					             oView.byId("DtItemCmp1").setText("Detalle Item "+Expenseid+" - "+ Expenseline);
					             oView.setModel(oDetailItemGastComprobacionModel,'mDetItem');
					             
					             Importe = oDetailItemGastComprobacionModel.getData().temp_DetailItem.Wrbtr;
					     		},
					     		function _OnError(oError){    
					     			oDetailItemGastComprobacionModel.setData();
		                        }
					    );
			        	
			        	oModel.read(oPathCont,  
					             null,  
					             null,  
					             false,  
					             function _OnSuccess(oData, response) {
			        			
			        			 header_xcsrf_token = response.headers['x-csrf-token'];
			        		
			        			 oContComprobacionModel.setData({temp_Cont: oData.results});  
			        			 var items = oContComprobacionModel.oData.temp_Cont.length;
			        			 oView.byId("idHeaderTableContab").setText("Items ("+items+")");
			        			 oView.setModel(oContComprobacionModel,'mContGast');   
					     		},
					     		function _OnError(oError){    
					     			oContComprobacionModel.setData();
					     			oView.byId("idHeaderTableContab").setText("Items (0)");
		                        }
					     );
			        	
			        	oModel.read(oPathCeCo,  
					             null,  
					             null,  
					             false,  
					             function _OnSuccess(oData, response) {
			        			
			        			 header_xcsrf_token = response.headers['x-csrf-token'];
			        		
			        			 oCeCoComprobacionModel.setData({temp_CeCo: oData.results});   
			        			 var items = oCeCoComprobacionModel.oData.temp_CeCo.length;
			        			 oView.byId("idHeaderTableCeCo").setText("Items ("+items+")");
			        			 oView.setModel(oCeCoComprobacionModel,'mCeCoGast');   
					     		},
					     		function _OnError(oError){    
					     			oCeCoComprobacionModel.setData();
					     			oView.byId("idHeaderTableCeCo").setText("Items (0)");
		                        }
			        	);
			        	
			        	oModel.read(oPathAdjuntos,  
					             null,  
					             null,  
					             false,  
					             function _OnSuccess(oData, response) {
			        			
			        			 oAdjuntosComprobacionModel.setData({temp_Adjuntos: oData.results});   
			        			 var items = oAdjuntosComprobacionModel.oData.temp_Adjuntos.length;
			        			 oView.byId("idHeaderTableAttach").setText("Items ("+items+")");
			        			 oView.setModel(oAdjuntosComprobacionModel,'mAttachments');
					     		},
					     		function _OnError(oError){    
					     			oAdjuntosComprobacionModel.setData();
					     			oView.byId("idHeaderTableCeCo").setText("Items (0)");
		                        }
			        	);			        	
		        	}	        		        		
	        	}	
	        	
	        });
		},
		
		onNavBack: function() {  
			window.history.go(-1); 
			this.getView().byId("idIconTabBarModfComp").setSelectedKey("d1");
		},
		
		OnPressIconTabBar : function(oEvent) {
			
			var oButtonGrabar = this.getView().byId("idButSave");
			
			if(oEvent.getSource().getSelectedKey()=="d1"){
				if(idStatus==1 || idStatus==4){
					oButtonGrabar.setVisible(true);
					this.getView().byId("idTableContab").setMode(sap.m.ListMode.SingleSelectLeft);
					this.getView().byId("id_d2_Adicionar").setVisible(true);
					this.getView().byId("id_d2_Eliminar").setVisible(true);
					this.getView().byId("id_d2_Mofificar").setVisible(true);
					this.getView().byId("id_d2_Grabar").setVisible(true);
					this.getView().byId("idTableCeCo").setMode(sap.m.ListMode.SingleSelectLeft);
					this.getView().byId("id_d3_Adicionar").setVisible(true);
					this.getView().byId("id_d3_Eliminar").setVisible(true);
					this.getView().byId("id_d3_Iguales").setVisible(true);
					this.getView().byId("id_d3_Mofificar").setVisible(true);
					this.getView().byId("id_d3_Grabar").setVisible(true);
					this.getView().byId("idTableDoc").setMode(sap.m.ListMode.SingleSelectLeft);
					this.getView().byId("id_d4_Adicionar").setVisible(true);
					this.getView().byId("id_d4_Eliminar").setVisible(true);
				}else{
					oButtonGrabar.setVisible(false);
					this.getView().byId("idTableContab").setMode(sap.m.ListMode.None);
					this.getView().byId("id_d2_Adicionar").setVisible(false);
					this.getView().byId("id_d2_Eliminar").setVisible(false);
					this.getView().byId("id_d2_Mofificar").setVisible(false);
					this.getView().byId("id_d2_Grabar").setVisible(false);
					this.getView().byId("idTableCeCo").setMode(sap.m.ListMode.None);
					this.getView().byId("id_d3_Adicionar").setVisible(false);
					this.getView().byId("id_d3_Eliminar").setVisible(false);
					this.getView().byId("id_d3_Iguales").setVisible(false);
					this.getView().byId("id_d3_Mofificar").setVisible(false);
					this.getView().byId("id_d3_Grabar").setVisible(false);
					this.getView().byId("idTableDoc").setMode(sap.m.ListMode.None);
					this.getView().byId("id_d4_Adicionar").setVisible(false);
					this.getView().byId("id_d4_Eliminar").setVisible(false);
				}
			}
			else {
				oButtonGrabar.setVisible(false);
			}
		},
		
		onPressDelDatCon:function() {
			//eliminar gasto (linea)
			oView = this.getView();
        	var oTable = oView.byId('idTableContab'); 
        	var items = oTable.getSelectedItems();
        	
        	if (items.length < 1) {
        		MessageBox.warning("Seleccione un registro");
        		return;
        	}

        	var dialog = new Dialog({
				title: 'Anular Línea de la Cuenta Mayor',
				type: 'Message',
				content: [
				          new Label({ text: 'Desea anular línea  de la Cuenta Mayor?' })							
				          ],
				beginButton: new Button({
					text: 'Confirmar',
					press: function () {
						
						var sPath = items[0].getBindingContext('mContGast').getPath();
						
						var idx = sPath.split("/")[2];
				        var data = oContComprobacionModel.oData;
				        var removed = data.temp_Cont.splice(idx, 1);
				        oContComprobacionModel.setData(data);
						
						MessageBox.success("Se realizó la anulación de la línea de Cuenta Mayor");
						dialog.close();
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
		
		onPressModDatCon:function() {
			//modificar gasto (linea)
			var oView = this.getView();
        	var oTable = oView.byId('idTableContab'); 
        	var items = oTable.getSelectedItems();
        	
        	if (items.length < 1) {
        		MessageBox.warning("Seleccione un registro");
        		return;
        	}
        	
        	var sPath = items[0].getBindingContext('mContGast').getPath();
        	
        	var idx = parseInt(sPath.split("/")[2]);
			//var oDataTemp = oContComprobacionModel.oData.temp_Cont[idx];
        	
        	//Clone the data
			var oDataTemp = jQuery.extend({}, oContComprobacionModel.getData().temp_Cont[idx]);
			
        	//Dialog
        	var oHkont = oContComprobacionModel.getProperty(sPath).Hkont;
        	var oMwskz = oContComprobacionModel.getProperty(sPath).Mwskz;
        	
			var sPathCML;
			var sPathIIL;
			
			for(var i=0; i < sap.ui.getCore().getModel('mTables').oData.ClaseGastoList.length; i++){
				if(sap.ui.getCore().getModel('mTables').oData.ClaseGastoList[i].Hkont == oHkont){
					sPathCML = "/ClaseGastoList/"+i;
					break;
				}
			}
			
			for(var i=0; i < sap.ui.getCore().getModel('mCombos').oData.IndImpuestoList.length; i++){
				if(sap.ui.getCore().getModel('mCombos').oData.IndImpuestoList[i].Mwskz == oMwskz){
					sPathIIL = "/IndImpuestoList/"+i;
					break;
				}
			}
			//var sPathIIL = "/IndImpuestoList/0";
			var StringInputTexto;
			
			var fValueListClass= function(evt) {
				
				var InputCuentaM = evt.getSource();
				var StringInputCuentaM = "";
				
				var dialog_CeuntaMay = new Dialog({
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
									    		var binding = dialog_CeuntaMay.getContent()[0].getBinding("items");
									    		binding.filter(aFilters);
									    	}
									    })
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
						    selectionChange: function (oEvent) {
						    	sPathCML = oEvent.getParameter('listItem').getBindingContext("mTables").getPath();
						    	StringInputCuentaM = 
						    		sap.ui.getCore().getModel('mTables').getProperty(sPathCML).Hkont + 
						    		" " +
						    		sap.ui.getCore().getModel('mTables').getProperty(sPathCML).Expenseclassdes;
						    	
						    	//Texto
						    	StringInputTexto = 
						    		sap.ui.getCore().getModel('mTables').getProperty(sPathCML).Expenseclass + 
							    	"-" +
							    	sap.ui.getCore().getModel('mTables').getProperty(sPathCML).Expenseclassdes;
						    }
						})
					],
					beginButton: new Button({
						text: 'Ok',
						press: function () {
							if(StringInputCuentaM != ""){
								InputCuentaM.setValue(StringInputCuentaM);
								dialog.getContent()[0].getContent()[11].setValue(StringInputTexto);
								dialog_CeuntaMay.close();
							}
							else sap.m.MessageToast.show("Seleccione un item de la lista.");
						}
					}),
					endButton: new Button({
						text: 'Cancel',
						press: function () {
							dialog_CeuntaMay.close();
						}
					}),
					afterClose: function() {
						dialog_CeuntaMay.destroy();
					}
				});
				
				dialog_CeuntaMay.getContent()[0].getHeaderToolbar().getContent()[0].setText( "Items ("+sap.ui.getCore().getModel("mTables").oData.ClaseGastoList.length+")" );
				dialog_CeuntaMay.open();
			};
			
			var dialog = new Dialog({
				title: 'Datos Contables',
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
											new Label({ text: 'Item' }),
											new Text({ text: "{mContGast>Accolin}" }),
											new Label({ text: 'Cuenta Mayor'}),
											new Input({ value:"{mContGast>Hkont} {mContGast>Txt20}", showValueHelp: true, valueHelpRequest: fValueListClass }),
											new Label({ text: 'Importe' }),
											new Input({ value:"{mContGast>Wrbtr}" , width:"50%", textAlign:"End", type:"Number",
														liveChange: function(oEvt) {
															
															var sPercent = sap.ui.getCore().getModel('mCombos').getProperty(sPathIIL).Taxper/100;
															var oImporte = parseFloat(dialog.getContent()[0].getContent()[5].getValue());
															
															dialog.getContent()[0].getContent()[9].setValue( sPercent * oImporte );
															
												    	}
											}),
											new Label({ text: 'Indicador Impuesto' }),
											new Select({
												selectedKey:"{mContGast>Mwskz}",
												items: {
										            path: "mCombos>/IndImpuestoList",
										            template: new Item({
										            	key:"{mCombos>Mwskz}",
										            	text:"{mCombos>Mwskz} {mCombos>Text1}" })
												},
												change: function(oEvent) {
													
													sPathIIL = oEvent.getParameter("selectedItem").getBindingContext("mCombos").getPath();

													var sPercent = sap.ui.getCore().getModel('mCombos').getProperty(sPathIIL).Taxper/100;
													var oImporte = parseFloat(dialog.getContent()[0].getContent()[5].getValue());
													
													dialog.getContent()[0].getContent()[9].setValue( sPercent * oImporte );
													
												}
											}),
											new Label({ text: 'Impuesto' }),
											new Input({ value:"{mContGast>Wmwst}" , width:"50%", textAlign:"End", enabled:false }),
											new Label({ text: 'Texto' }),
											new Input({ value:"{mContGast>Sgtxt}" }),
										]
				          			})
				],
				beginButton: new Button({
					text: 'Confirmar',
					press: function () {
						
						var inputs = [
						              dialog.getContent()[0].getContent()[3],
						              dialog.getContent()[0].getContent()[5]
								    ];

					    jQuery.each(inputs, function (i, input) {
					      if(!input.getValue()) {
					        input.setValueState("Error");
					      }
					      else {
					    	input.setValueState("None");  
					      }
					    });
					    
					    var canContinue = true;
					    jQuery.each(inputs, function (i, input) {
					      if(input.getValueState() == "Error") {
					        canContinue = false;
					      }
					    });
						
					    if (canContinue) {
							
							var oNewObject = {
								Accolin:dialog.getContent()[0].getContent()[1].getText(),
								Bukrs: Bukrs,
								Expenseid: Expenseid,
								Expenseline: Expenseline,
								Hkont: sap.ui.getCore().getModel('mTables').getProperty(sPathCML).Hkont,//2da
								Txt20: sap.ui.getCore().getModel('mTables').getProperty(sPathCML).Expenseclassdes,//3era
	
								Langu: "S",
								Wrbtr: dialog.getContent()[0].getContent()[5].getValue(),//4ta
								Mwskz: sap.ui.getCore().getModel('mCombos').getProperty(sPathIIL).Mwskz,//5ta IndImp
								Wmwst: dialog.getContent()[0].getContent()[9].getValue(), //6ta Importe Impuesto
								Sgtxt: dialog.getContent()[0].getContent()[11].getValue(),//7ma TEXTO
								Taxper: sap.ui.getCore().getModel('mCombos').getProperty(sPathIIL).Taxper,
							};
							
							var idx = parseInt(sPath.split("/")[2]);
					        
					        oContComprobacionModel.oData.temp_Cont[idx] = oNewObject;
					        oContComprobacionModel.refresh(true);
					        
							dialog.close();
					    }
					    else sap.m.MessageToast.show("Complete sus campos de entrada primero.");
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function () {
						
						var oModel = oContComprobacionModel;
						var oData = oModel.getData();
			 
						oData.temp_Cont[idx] = oDataTemp;
			 
						oModel.setData(oData);
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			
			dialog.setModel(oContComprobacionModel, "mContGast");
			dialog.bindContext("mContGast>"+sPath);
			dialog.open();
        	//End Dialog
		},
		
		onPressAddDatCon:function() {
			
			var sPathCML;
			var sPathIIL = "/IndImpuestoList/0";
			var StringInputTexto;
			
			var fValueListClass= function(evt) {
				
				var InputCuentaM = evt.getSource();
				var StringInputCuentaM = "";
				
				var dialog_CeuntaMay = new Dialog({
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
									    		var binding = dialog_CeuntaMay.getContent()[0].getBinding("items");
									    		binding.filter(aFilters);
									    	}
									    })
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
						    selectionChange: function (oEvent) {
						    	sPathCML = oEvent.getParameter('listItem').getBindingContext("mTables").getPath();
						    	StringInputCuentaM = 
						    		sap.ui.getCore().getModel('mTables').getProperty(sPathCML).Hkont + 
						    		" " +
						    		sap.ui.getCore().getModel('mTables').getProperty(sPathCML).Expenseclassdes;
						    	
						    	//Texto
						    	StringInputTexto = 
						    		sap.ui.getCore().getModel('mTables').getProperty(sPathCML).Expenseclass + 
							    	"-" +
							    	sap.ui.getCore().getModel('mTables').getProperty(sPathCML).Expenseclassdes;
						    }
						})
					],
					beginButton: new Button({
						text: 'Ok',
						press: function () {
							if(StringInputCuentaM != ""){
								InputCuentaM.setValue(StringInputCuentaM);
								dialog.getContent()[0].getContent()[11].setValue(StringInputTexto);
								dialog_CeuntaMay.close();
							}
							else sap.m.MessageToast.show("Seleccione un item de la lista.");
						}
					}),
					endButton: new Button({
						text: 'Cancel',
						press: function () {
							dialog_CeuntaMay.close();
						}
					}),
					afterClose: function() {
						dialog_CeuntaMay.destroy();
					}
				});
				
				dialog_CeuntaMay.getContent()[0].getHeaderToolbar().getContent()[0].setText( "Items ("+sap.ui.getCore().getModel("mTables").oData.ClaseGastoList.length+")" );

				dialog_CeuntaMay.open();
			};
			
			//agregar gasto (linea)
			var dialog = new Dialog({
				title: 'Datos Contables',
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
											new Label({ text: 'Item' }),
											new Text({text: '' }),
											new Label({ text: 'Cuenta Mayor'}),
											new Input({ value:"", showValueHelp: true, valueHelpRequest: fValueListClass }),
											new Label({ text: 'Importe' }),
											new Input({ value:"" , width:"50%", textAlign:"End", type:"Number",
														liveChange: function(oEvt) {
															
															var sPercent = sap.ui.getCore().getModel('mCombos').getProperty(sPathIIL).Taxper/100;
															var oImporte = parseFloat(dialog.getContent()[0].getContent()[5].getValue());
															
															dialog.getContent()[0].getContent()[9].setValue( sPercent * oImporte );
															
												    	}
											}),
											new Label({ text: 'Indicador Impuesto' }),
											new Select({
												items: {
										            path: "mCombos>/IndImpuestoList",
										            template: new Item({
										            	key:"{mCombos>Mwskz}",
										            	text:"{mCombos>Mwskz} {mCombos>Text1}" })
												},
												change: function(oEvent) {

													sPathIIL = oEvent.getParameter("selectedItem").getBindingContext("mCombos").getPath();
													
													var sPercent = sap.ui.getCore().getModel('mCombos').getProperty(sPathIIL).Taxper/100;
													var oImporte = parseFloat(dialog.getContent()[0].getContent()[5].getValue());
													
													dialog.getContent()[0].getContent()[9].setValue( sPercent * oImporte );

												}
											}),
											new Label({ text: 'Impuesto' }),
											new Input({ value:"0.00" , width:"50%", textAlign:"End", enabled:false }),
											new Label({ text: 'Texto' }),
											new Input({ value:"" }),
										]
				          			})
				],
				beginButton: new Button({
					text: 'Confirmar',
					press: function () {
						
						var inputs = [
						              dialog.getContent()[0].getContent()[3],
						              dialog.getContent()[0].getContent()[5]
						];
						
					    jQuery.each(inputs, function (i, input) {
					      if(!input.getValue()) {
					        input.setValueState("Error");
					      }
					      else {
					    	input.setValueState("None");  
					      }
					    });
					    
					    var canContinue = true;
					    jQuery.each(inputs, function (i, input) {
					      if(input.getValueState() == "Error") {
					        canContinue = false;
					      }
					    });
					    
					    if (canContinue) {
							
							var oNewObject = {
								Bukrs: Bukrs,
								Expenseid: Expenseid,
								Expenseline: Expenseline,
								Hkont: sap.ui.getCore().getModel('mTables').getProperty(sPathCML).Hkont,//2da
								Txt20: sap.ui.getCore().getModel('mTables').getProperty(sPathCML).Expenseclassdes,//3era
	
								Langu: "S",
								Wrbtr: dialog.getContent()[0].getContent()[5].getValue(),//4ta
								Mwskz: sap.ui.getCore().getModel('mCombos').getProperty(sPathIIL).Mwskz,//5ta IndImp
								Wmwst: dialog.getContent()[0].getContent()[9].getValue(), //6ta Importe Impuesto
								Sgtxt: dialog.getContent()[0].getContent()[11].getValue(),//7ma TEXTO
								Taxper: sap.ui.getCore().getModel('mCombos').getProperty(sPathIIL).Taxper,
							}
							
							oContComprobacionModel.oData.temp_Cont.push(oNewObject);
							oContComprobacionModel.refresh(true);
	

							dialog.close();
					    }
					    else sap.m.MessageToast.show("Complete sus campos de entrada primero.");
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
		
		onPressAddCeCo:function() {
			
			var sPathCCL = "";

			var fValueListClass= function(evt) {
				
				var InputCentroC = evt.getSource();
				var StringInputCentroC = "";
				
				var dialog_CentroCoste = new Dialog({
					title: 'Seleccionar Centro Coste',
					type: 'Standard',
					contentWidth: '700px',
					content: [
						new sap.m.Table({
						    mode: 'SingleSelectLeft',
						    includeItemInSelection: true,
						    growing: true, 
						    growingScrollToLoad: false,
						    growingThreshold: 20,
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
									    			var filter = new sap.ui.model.Filter("Kostl", sap.ui.model.FilterOperator.Contains, sQuery);
									    			aFilters.push(filter);
									    		}

									    		// update list binding
									    		var binding = dialog_CentroCoste.getContent()[0].getBinding("items");
									    		binding.filter(aFilters);
									    	}
									    }),
						    	]
						    }),
						    columns: [
						      new sap.m.Column({ width: "8em", header: new sap.m.Label({text: 'Centro Coste'})}),
						      new sap.m.Column({ width: "10em", header: new sap.m.Label({text: 'Descripción'})}),
						      new sap.m.Column({ header: new sap.m.Label({text: 'Responsable'})}),
						
						    ],
						    items: {
						      path: 'mTables>/CentroCostoList',
						      template: new sap.m.ColumnListItem({
						    	//type: "Active",
						        cells: [
						          new sap.m.Text({ text: '{mTables>Kostl}' }),
						          new sap.m.Text({ text: '{mTables>Mctxt}' }),
						          new sap.m.Text({ text: '{mTables>Verak}' })
						        ]
						      })
						    },
						    selectionChange: function (oEvent) {
						    	sPathCCL = oEvent.getParameter('listItem').getBindingContext("mTables").getPath();
						    	StringInputCentroC = 
						    		sap.ui.getCore().getModel('mTables').getProperty(sPathCCL).Kostl + 
						    		" " +
						    		sap.ui.getCore().getModel('mTables').getProperty(sPathCCL).Mctxt;
						    	
						    }
						})
					],
					beginButton: new Button({
						text: 'Ok',
						press: function () {
							if(StringInputCentroC != ""){
								InputCentroC.setValue(StringInputCentroC);
								dialog_CentroCoste.close();
							}
							else sap.m.MessageToast.show("Seleccione un item de la lista.");
						}
					}),
					endButton: new Button({
						text: 'Cancel',
						press: function () {
							dialog_CentroCoste.close();
						}
					}),
					afterClose: function() {
						dialog_CentroCoste.destroy();
					}
				});
				
				dialog_CentroCoste.getContent()[0].getHeaderToolbar().getContent()[0].setText( "Items ("+sap.ui.getCore().getModel("mTables").oData.CentroCostoList.length+")" );
				
				dialog_CentroCoste.open();
			};
			
			//agregar centro de coste (linea)
			var dialog = new Dialog({
				title: 'Datos Centro Coste',
				contentHeigth:"5000px",
				contentWidth:"750px",
				content: [

				          new SimpleForm({
										maxContainerCols:2,
										layout:"ResponsiveGridLayout",
										class:"editableForm",
										editable:true,
										content: [
											new Label({ text: 'Item' }),
											new Text({ text: '' }),
											new Label({ text: 'Centro Coste'}),
											//3
											new Input({ value:'', showValueHelp: true, valueHelpRequest: fValueListClass }),
											new Label({ text: '% Distribución' }),
											//5
											new Input({ value:'' , /*width:"50%",*/ textAlign:'Right', type:'Number', maxLength:4,
														liveChange: function (oEvent) {
															
															var oPorcentaje = parseFloat(oEvent.getParameters().value)/100;
															var oValorPorcentaje = (parseFloat(Importe) * oPorcentaje).toFixed(2);
															dialog.getContent()[0].getContent()[8].setText( oValorPorcentaje );
										                }
											}),
											new Text({ text: '%'}),
											new Label({ text: 'Importe' }),
											//8
											new Text({ text: '', textAlign:'End', width:'50%' })
										]
				          			})
				],
				beginButton: new Button({
					text: 'Confirmar',
					press: function () {
						
						var inputs = [
						              dialog.getContent()[0].getContent()[3],
						              dialog.getContent()[0].getContent()[5]
								    ];

					    jQuery.each(inputs, function (i, input) {
					      if(!input.getValue()) {
					        input.setValueState("Error");
					      }
					      else {
					    	input.setValueState("None");  
					      }
					    });
					    
					    var canContinue = true;
					    jQuery.each(inputs, function (i, input) {
					      if(input.getValueState() == "Error") {
					        canContinue = false;
					      }
					    });
					    
					    if (canContinue) {
						
							var oCostPercent = parseFloat(dialog.getContent()[0].getContent()[5].getValue()).toFixed(2);
							
							var oNewObject = {
										Bukrs: Bukrs,
										Expenseid: Expenseid,
										Expenseline: Expenseline,
										CostPercent: oCostPercent.toString(),
										Appdmbtr: dialog.getContent()[0].getContent()[8].getText(),
										Distlin: "",
										Kostl: sap.ui.getCore().getModel('mTables').getProperty(sPathCCL).Kostl,
										KostlDesc: sap.ui.getCore().getModel('mTables').getProperty(sPathCCL).Mctxt,
										Langu: "S",
										Operflag: ""
							};
							


							oCeCoComprobacionModel.oData.temp_CeCo.push(oNewObject);
							oCeCoComprobacionModel.refresh(true);
							

							dialog.close();
					    }
					    else sap.m.MessageToast.show("Complete sus campos de entrada primero.");
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
		
		onPressDelCeCo:function() {
			//eliminar Centro de coste (linea)
			oView = this.getView();
        	var oTable = oView.byId('idTableCeCo'); 
        	var items = oTable.getSelectedItems();
        	
        	if (items.length < 1) {
        		MessageBox.warning("Seleccione un registro");
        		return;
        	}

        	var dialog = new Dialog({
				title: 'Anular Línea de Centro Coste',
				type: 'Message',
				content: [
				          new Label({ text: 'Desea anular línea  de la Centro Coste?' })							
				          ],
				beginButton: new Button({
					text: 'Confirmar',
					press: function () {
						
						var sPath = items[0].getBindingContext('mCeCoGast').getPath();
						
						var idx = sPath.split("/")[2];
				        var data = oCeCoComprobacionModel.oData;
				        var removed = data.temp_CeCo.splice(idx, 1);
				        oCeCoComprobacionModel.setData(data);
						
						MessageBox.success("Se realizó la anulación línea de Centro Coste");
						dialog.close();
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
		
		onPressIgualesCeCo:function() {
			/*
			var SumPorcentajes = 0.00;
			
			var data = oCeCoComprobacionModel.oData.temp_CeCo;
			
			//for(var i = 0; i < idTableCeCo.getItems().length; i++){
			for(var i = 0; i < data.length; i++){
				// Columna  "% Dis"
				//var percent = idTableCeCo.getItems()[i].getCells()[3].getText();
				var percent = data[i].CostPercent;
				SumPorcentajes += parseFloat(percent);
			}
			
			// Validar procentajes al 100%
			if(SumPorcentajes <= 100){
				
			}
			else MessageBox.warning("La suma de los porcentajes de los items no debe ser mayor al 100.00%");
			*/
			var data = oCeCoComprobacionModel.oData.temp_CeCo;
			var nCant = data.length;
			
			if(nCant%2==0){
				// Porcentaje % Iguales
				var ValorPercent = (100/data.length).toFixed(2);
				
				for(var i = 0; i < data.length; i++){
					data[i].CostPercent = ValorPercent;
					data[i].Appdmbtr = ((ValorPercent/100) * Importe).toFixed(2);
				}
			}
			else{
				var sValorPercent = (100/data.length).toString();
				
				var parteDecimal = sValorPercent.substring((sValorPercent.indexOf('.')+1));
				parteDecimal = parteDecimal.substring(0,2);
				
				var parteEntera = sValorPercent.substring(0, sValorPercent.indexOf('.'))
				
				// Porcentaje % Iguales
				var ValorPercent = parseFloat(parteEntera+"."+parteDecimal);
				var res = 100 - (ValorPercent*nCant);
				
				for(var i = 0; i < data.length; i++){
					data[i].CostPercent = ValorPercent;
					data[i].Appdmbtr = ((ValorPercent/100) * Importe).toFixed(2);
					
					if(i == (data.length-1)){
						data[i].CostPercent = ValorPercent + res;
						data[i].Appdmbtr = ((data[i].CostPercent/100) * Importe).toFixed(2);
					}
					
				}
			}
			
			//Refresh model
			oCeCoComprobacionModel.refresh(true);
		},
		
		onPressModCeCo:function() {
			//modificar Centro de coste (linea)
			var oView = this.getView();
        	var oTable = oView.byId('idTableCeCo'); 
        	var items = oTable.getSelectedItems();
        	
        	if (items.length < 1) {
        		MessageBox.warning("Seleccione un registro");
        		return;
        	}

        	var sPath = items[0].getBindingContext('mCeCoGast').getPath();
        	
        	var idx = parseInt(sPath.split("/")[2]);
			//var oDataTemp = oContComprobacionModel.oData.temp_Cont[idx];
        	
        	//Clone the data
			var oDataTemp = jQuery.extend({}, oCeCoComprobacionModel.getData().temp_CeCo[idx]);
			
        	//Dialog
        	var oKostl = oCeCoComprobacionModel.getProperty(sPath).Kostl;
        	var sPathCCL = "";
			
			for(var i=0; i < sap.ui.getCore().getModel('mTables').oData.CentroCostoList.length; i++){
				if(sap.ui.getCore().getModel('mTables').oData.CentroCostoList[i].Kostl == oKostl){
					sPathCCL = "/CentroCostoList/"+i;
					break;
				}
			}
        	
			var fValueListClass= function(evt) {
				
				var InputCentroC = evt.getSource();
				var StringInputCentroC = "";
				
				var dialog_CentroCoste = new Dialog({
					title: 'Seleccionar Centro Coste',
					type: 'Standard',
					contentWidth: '700px',
					content: [
						new sap.m.Table({
						    mode: 'SingleSelectLeft',
						    includeItemInSelection: true,
						    growing: true, 
						    growingScrollToLoad: false,
						    growingThreshold: 20,
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
									    			var filter = new sap.ui.model.Filter("Kostl", sap.ui.model.FilterOperator.Contains, sQuery);
									    			aFilters.push(filter);
									    		}

									    		// update list binding
									    		var binding = dialog_CentroCoste.getContent()[0].getBinding("items");
									    		binding.filter(aFilters);
									    	}
									    }),
						    	]
						    }),
						    columns: [
						      new sap.m.Column({ width: "8em", header: new sap.m.Label({text: 'Centro Coste'})}),
						      new sap.m.Column({ width: "10em", header: new sap.m.Label({text: 'Descripción'})}),
						      new sap.m.Column({ header: new sap.m.Label({text: 'Responsable'})}),
						
						    ],
						    items: {
						      path: 'mTables>/CentroCostoList',
						      template: new sap.m.ColumnListItem({
						    	//type: "Active",
						        cells: [
						          new sap.m.Text({ text: '{mTables>Kostl}' }),
						          new sap.m.Text({ text: '{mTables>Mctxt}' }),
						          new sap.m.Text({ text: '{mTables>Verak}' })
						        ]
						      })
						    },
						    selectionChange: function (oEvent) {
						    	sPathCCL = oEvent.getParameter('listItem').getBindingContext("mTables").getPath();
						    	StringInputCentroC = 
						    		sap.ui.getCore().getModel('mTables').getProperty(sPathCCL).Kostl + 
						    		" " +
						    		sap.ui.getCore().getModel('mTables').getProperty(sPathCCL).Mctxt;
						    	
						    }
						})
					],
					beginButton: new Button({
						text: 'Ok',
						press: function () {
							if(StringInputCentroC != ""){
								InputCentroC.setValue(StringInputCentroC);
								dialog_CentroCoste.close();
							}
							else sap.m.MessageToast.show("Seleccione un item de la lista.");
						}
					}),
					endButton: new Button({
						text: 'Cancel',
						press: function () {
							dialog_CentroCoste.close();
						}
					}),
					afterClose: function() {
						dialog_CentroCoste.destroy();
					}
				});
				
				dialog_CentroCoste.getContent()[0].getHeaderToolbar().getContent()[0].setText( "Items ("+sap.ui.getCore().getModel("mTables").oData.CentroCostoList.length+")" );
				dialog_CentroCoste.open();
			};
			
			//agregar centro de coste (linea)
			var dialog = new Dialog({
				title: 'Datos Centro Coste',
				contentHeigth:"5000px",
				contentWidth:"750px",
				content: [

				          new SimpleForm({
										maxContainerCols:2,
										layout:"ResponsiveGridLayout",
										class:"editableForm",
										editable:true,
										content: [
											new Label({ text: 'Item' }),
											new Text({ text: "{mCeCoGast>Distlin}" }),
											new Label({ text: 'Centro Coste'}),
											//3
											new Input({ value:'{mCeCoGast>Kostl} {mCeCoGast>KostlDesc}', showValueHelp: true, valueHelpRequest: fValueListClass }),
											new Label({ text: '% Distribución' }),
											//5
											new Input({ value:"{mCeCoGast>CostPercent}" , /*width:"50%",*/ textAlign:'Right', type:'Number',
												liveChange: function (oEvent) {
													
													var oPorcentaje = parseFloat(oEvent.getParameters().value)/100;
													var oValorPorcentaje = (parseFloat(Importe) * oPorcentaje).toFixed(2);
													dialog.getContent()[0].getContent()[8].setText( oValorPorcentaje );
								                }
											}),
											new Text({ text: '%'}),
											new Label({ text: 'Importe' }),
											//8
											new Text({ text: "{mCeCoGast>Appdmbtr}", textAlign:'End', width:'50%' })
										]
				          			})
				],
				beginButton: new Button({
					text: 'Confirmar',
					press: function () {
						
						var inputs = [
						              dialog.getContent()[0].getContent()[3],
						              dialog.getContent()[0].getContent()[5]
								    ];

					    jQuery.each(inputs, function (i, input) {
					      if(!input.getValue()) {
					        input.setValueState("Error");
					      }
					      else {
					    	input.setValueState("None");  
					      }
					    });
					    
					    var canContinue = true;
					    jQuery.each(inputs, function (i, input) {
					      if(input.getValueState() == "Error") {
					        canContinue = false;
					      }
					    });
					    
					    if (canContinue) {
							
							var oCostPercent = parseFloat(dialog.getContent()[0].getContent()[5].getValue()).toFixed(2);
							
							var oNewObject = {
										
										Bukrs: Bukrs,
										Expenseid: Expenseid,
										Expenseline: Expenseline,
										CostPercent: oCostPercent.toString(),
										Appdmbtr: dialog.getContent()[0].getContent()[8].getText(),
										Distlin: dialog.getContent()[0].getContent()[1].getText(),
										Kostl: sap.ui.getCore().getModel('mTables').getProperty(sPathCCL).Kostl,
										KostlDesc: sap.ui.getCore().getModel('mTables').getProperty(sPathCCL).Mctxt,
										Langu: "S",
										Operflag: ""
							};
							
							var idx = parseInt(sPath.split("/")[2]);
					        
							oCeCoComprobacionModel.oData.temp_CeCo[idx] = oNewObject;
							oCeCoComprobacionModel.refresh(true);
							
							dialog.close();
					    }
					    else sap.m.MessageToast.show("Complete sus campos de entrada primero.");
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function () {
						
						var oModel = oCeCoComprobacionModel;
						var oData = oModel.getData();
			 
						oData.temp_CeCo[idx] = oDataTemp;
			 
						oModel.setData(oData);
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			
			dialog.setModel(oCeCoComprobacionModel, "mCeCoGast");
			dialog.bindElement("mCeCoGast>"+sPath);
			dialog.open();
        	//End Dialog
		},

		onPressAddDoc:function() {
			//var oView = this.getView();
			//agregar documento (linea)
			var dialog = new Dialog({
				title: 'Adicionar Documento',
				contentHeigth:"5000px",
				contentWidth:"750px",
				content: [

				          new SimpleForm({
										maxContainerCols:2,
										layout:"ResponsiveGridLayout",
										class:"editableForm",
										editable:true,
										content: [
											new Label({ text: 'Ubicación Documento:' }),
											new FileUploader({
												width:"100%", 
												fileType: ["xml", "pdf"],
												buttonText: "Seleccione...",
												typeMissmatch: function(){
													MessageBox.error("Solo se permite subir archivos con formato PDF y XML.");
												}
											}),
								]
				          })
				],
				beginButton: new Button({
					text: 'Confirmar',
					press: function () {
						var busyDialog = new BusyDialog();
						busyDialog.open();
						setTimeout(function(){
						// Obtenemos el contenido del FileUploader.
						var oFUploadDocGen = dialog.getContent()[0].getContent()[1].oFileUpload.files[0];
						if(oFUploadDocGen){
							// Se obtuvo el archivo.
							// Iniciamos la lectura.
							var r = new FileReader();
							r.onload = function(e) {
								// TODO:Process fileContent Document  .
								var fileContentDocument = e.target.result;
								var oDataUrl = "proxy/sap/opu/odata/sap/Y10_EXPMAN_SRV/ExpenseItemDocSet";
								// Realizamos la consulta
								if(oFUploadDocGen.type=='application/xml' || oFUploadDocGen.type=='text/xml')
								{
									jQuery.ajax({
									type	: "POST",
								    url		: oDataUrl,
								    headers	: {
								    	"X-CSRF-Token"	: header_xcsrf_token,  
										"slug"			: Bukrs+""+Expenseid+""+Expenseline+""+Langu,
										"Content-Type"	: oFUploadDocGen.type
								    },
								    data	: btoa(unescape(encodeURIComponent(fileContentDocument))),
								    success	: function(oData, oResponse) {
								    	oView.getController().updateTableDocuments();
										console.log('success');
										busyDialog.close();
										MessageBox.success("Se registró una nueva comprobación.");
										dialog.close();
								    },
								    error	: function (oError){
								    	// Cerramos el Dialog.
								    	var xml2Json=function xmlToJson( xml ) {
							        		  // Crear Objeto
							        		  var obj = {};
							        		  if ( xml.nodeType == 1 ) { // element
							        		    // do attributes
							        		    if ( xml.attributes.length > 0 ) {
							        		    obj["@attributes"] = {};
							        		      for ( var j = 0; j < xml.attributes.length; j++ ) {
							        		        var attribute = xml.attributes.item( j );
							        		        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
							        		      }
							        		    }
							        		  } else if ( xml.nodeType == 3 ) { // text
							        		    obj = xml.nodeValue;
							        		  }
							        		  // do children
							        		  if ( xml.hasChildNodes() ) {
							        		    for( var i = 0; i < xml.childNodes.length; i++ ) {
							        		      var item = xml.childNodes.item(i);
							        		      var nodeName = item.nodeName;
							        		      if ( typeof(obj[nodeName] ) == "undefined" ) {
							        		        obj[nodeName] = xmlToJson( item );
							        		      } else {
							        		        if ( typeof( obj[nodeName].push ) == "undefined" ) {
							        		          var old = obj[nodeName];
							        		          obj[nodeName] = [];
							        		          obj[nodeName].push( old );
							        		        }
							        		        obj[nodeName].push( xmlToJson( item ) );
							        		      }
							        		    }
							        		  }
							        		  return obj;
							        		};


							        		var mi_json = xml2Json(oError.responseXML.documentElement.children[2].children[4]);
							        		var newJson={message:[]};
							        		
							        		for(var i=0; i<mi_json.errordetail.length; i++){
							        			var data		= {};
							        			var ojsonpadremessage 	= mi_json.errordetail[i].message;
							        			var jsonhijomessage 	= ojsonpadremessage["#text"];
							        			data.message=jsonhijomessage;
							        			
							        			var ojsonpadreseverity 	=  mi_json.errordetail[0].severity;
							        			var jsonhijoseverity 	= ojsonpadreseverity["#text"];
							        			data.severity=jsonhijoseverity;
							        			
							        			newJson.message.push(data);
							        		}
							        		
							        	// Creamos Modelo de Mensajes.
							        	var moLogErrores = new sap.ui.model.json.JSONModel();
								    	moLogErrores.setData(newJson.message);
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
								    	}
									});
								}else{
									var fd = new FormData();
								    fd.append("files", oFUploadDocGen);
								    var xhr = new XMLHttpRequest();
								    xhr.open("POST", oDataUrl );
								    xhr.setRequestHeader("X-CSRF-Token"	, header_xcsrf_token);
								    xhr.setRequestHeader("slug"	, Bukrs+""+Expenseid+""+Expenseline+""+Langu);
								    xhr.setRequestHeader("Content-Type"	, oFUploadDocGen.type);
								    xhr.onreadystatechange = function () {
								        if (xhr.readyState == 4) {
								        	oView.getController().updateTableDocuments();
											console.log('success');
											busyDialog.close();
											MessageBox.success("Se registró una nueva comprobación.");
											dialog.close();
								        }
								    };
								    xhr.send(fd);
								}
							};  
							r.readAsText(oFUploadDocGen); //Start read process  
						}else{
							// Mostramos mensaje de Error.
							// Mostramos mensaje de Error.
							busyDialog.close();
							MessageBox.error("No hay archivo adjunto.");
						}
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
		
		onPressDelDoc:function() {
			   //eliminar documento (linea)
			   var oView = this.getView();
			         var oTable = oView.byId('idTableDoc'); 
			         var items = oTable.getSelectedItems();
			         
			         if (items.length < 1) {
			          MessageBox.warning("Seleccione un registro");
			          return;
			         }
			         
			         var busyDialog = new BusyDialog();

			         var dialog = new Dialog({
			    title: 'Anular Documento',
			    type: 'Message',
			    content: [
			              new Label({ text: 'Desea anular documento?' })       
			              ],
			    beginButton: new Button({
			     text: 'Confirmar',
			     press: function () {
			    	 busyDialog.open();
			      // Iniciamos el proceso de eliminación.
			      // Creamos un Entry.
			      var oEntry = {};
			      // Armamos el registro.
			      var Class = items[0].getBindingContext('mAttachments').getProperty('Class');
			      var Objid = items[0].getBindingContext('mAttachments').getProperty('Objid');
			      // Invocamos al modelo de Comprobaciones.
			      var oModel = sap.ui.getCore().getModel('comprobaciones');
			      oModel.oHeaders={
			                          "X-CSRF-Token": header_xcsrf_token,  
			      };
			      var oPathDeleteDoc = "/ExpenseItemDocSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Expenseline='"+Expenseline+"',Class='"+Class+"',Objid='"+Objid+"',Langu='"+Langu+"')";
			      
			      setTimeout(function(){
			      oModel.remove(oPathDeleteDoc,  
			      {
			       context:null,
			       success:function (oData, oResponse) {
						// Actualizamos la Tabla.
						oView.getController().updateTableDocuments();
						busyDialog.close();
						// Mostramos Mensaje.
						MessageBox.success("Se realizó la anulación del documento");
						dialog.close();
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
			           dialog.close();
			           dialogLogOper.open();
			       }
			      });
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
		
		onPressListClass:function(oEvent) {
			
			var oExpenseclass = oDetailItemGastComprobacionModel.oData.temp_DetailItem.Expenseclass;
			
			for(var i=0;i < sap.ui.getCore().getModel('mTables').oData.ClaseGastoList.length; i++){
				if(sap.ui.getCore().getModel('mTables').oData.ClaseGastoList[i].Expenseclass == oExpenseclass){
					SPathClaseGato_Gastos = "/ClaseGastoList/"+i;
					break;
				}
			}
			
			var Input = oEvent.getSource();
			var StringInput = "";
			
			var dialog = new Dialog({
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
								    		var binding = dialog.getContent()[0].getBinding("items");
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
					    selectionChange: function (oEvent) {
					    	SPathClaseGato_Gastos = oEvent.getParameter('listItem').getBindingContext("mTables").getPath();
					    	StringInput = 
					    		sap.ui.getCore().getModel('mTables').getProperty(SPathClaseGato_Gastos).Expenseclass + 
					    		" " +
					    		sap.ui.getCore().getModel('mTables').getProperty(SPathClaseGato_Gastos).Expenseclassdes;
					    	
					    }
					})
				],
				beginButton: new Button({
					text: 'Ok',
					press: function () {
						if(StringInput != ""){
							Input.setValue(StringInput);
							dialog.close();
						}
						else sap.m.MessageToast.show("Seleccione un item de la lista.");
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
			
			dialog.getContent()[0].getHeaderToolbar().getContent()[0].setText( "Items ("+sap.ui.getCore().getModel("mTables").oData.ClaseGastoList.length+")" );
			
			dialog.open();
		},
		
		onPressListCoins: function(oEvt) {
			
			var InputMoneda = oEvt.getSource();
			var codCoin = -1;
			
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
		},
		
		updateTableDocuments: function(){
			var oPathAdjuntos = "/ExpenseItemSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Expenseline='"+Expenseline+"',Langu='"+Langu+"')/ToExpenseItemDoc"
        	
			var oModel = sap.ui.getCore().getModel('comprobaciones');
			oModel.oHeaders = {
					"X-CSRF-Token":"Fetch",
			};
        	
        	oModel.read(oPathAdjuntos,  
		             null,  
		             null,  
		             false,  
		             function _OnSuccess(oData, response) {
        		
        			header_xcsrf_token = response.headers['x-csrf-token'];
        			
        			oAdjuntosComprobacionModel.setData({temp_Adjuntos: oData.results});   
        			var items = oAdjuntosComprobacionModel.oData.temp_Adjuntos.length;
        			oView.byId("idHeaderTableAttach").setText("Items ("+items+")");
        			oView.setModel(oAdjuntosComprobacionModel,'mAttachments');
		     		
        	},
		     		function _OnError(oError){    
		     			oAdjuntosComprobacionModel.setData();
		     			oView.byId("idHeaderTableCeCo").setText("Items (0)");
                    }
        	);	
		},
		
		onPressModifyComprobacion: function() {
			
			var busyDialog = new BusyDialog();
			busyDialog.open();
			
			oView = this.getView();
			
			var oPathCabComp = "/ExpenseItemSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Expenseline='"+Expenseline+"',Langu='"+Langu+"')";
			
			var oModel = sap.ui.getCore().getModel('comprobaciones');
			   
			oModel.oHeaders={
					"X-CSRF-Token": header_xcsrf_token,
			};
			
			var vExpenseclass;
			(sap.ui.getCore().getModel('mTables').getProperty(SPathClaseGato_Gastos)===null) ? vExpenseclass=oView.getModel("mDetItem").getData().temp_DetailItem.Expenseclass : vExpenseclass = sap.ui.getCore().getModel('mTables').getProperty(SPathClaseGato_Gastos).Expenseclass;
			
			setTimeout(function(){
			oModel.update(oPathCabComp,
			{
			     "d" : {
			            "Bukrs" 		: Bukrs,
						"Expenseid" 	: Expenseid,
						"Expenseline" 	: Expenseline,
						"Expensetype" 	: oView.byId("idComExpensetype").getSelectedKey(),
						"Expenseclass" 	: vExpenseclass,
						"Expenquan" 	: oView.byId("idInpExpenquan").getValue(),
						"Unit" 			: oView.byId("idComUnidadMedida").getSelectedKey(),
						"Paymet" 		: oView.byId("idComPaymet").getSelectedKey(),
						"Waers" 		: oView.byId("idInpMoneda").getValue(),
						"Wrbtr"			: oView.byId("idInpImporte").getValue(),
						"Mwskz"			: oView.byId("idComIndImpuesto").getSelectedKey(),
						"Kursf"			: oView.byId("idInpTipoCambio").getValue(),
						"Iconpdf"		: oDetailComprobacionPosModel.oData.temp_listaPosComp[Idx].Iconpdf,
						"Iconxml"		: oDetailComprobacionPosModel.oData.temp_listaPosComp[Idx].Iconxml,
						"Bldat"			: oView.byId("idDatFechaComprobante").getDateValue(),
						"Langu" 		: Langu
			          }
			   },
			   {
				   context:null,
				   success :function () {
					   console.log('success');
					   var oModelModify = sap.ui.getCore().getModel('mDetItem'); 
					   //oModelModify.refresh(true);
					   oView.getController().updateItemGast();
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
				           //dialog.close();
				           dialogLogOper.open();
				       }
			   }
			);
			
			}, 1000);

		},
		
		onPressHrefDoc: function(oEvent) {
			
		     var oView = this.getView();
				
			var sPathDoc = oEvent.getSource().oPropagatedProperties.oBindingContexts.mAttachments.sPath;
	        var vClass = oAdjuntosComprobacionModel.getProperty(sPathDoc).Class;
	        var vObjid = oAdjuntosComprobacionModel.getProperty(sPathDoc).Objid;

	        var oPathDocDown ="/ExpenseItemDocSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Expenseline='"+Expenseline+"',Class='"+vClass+"',Objid='"+vObjid+"',Langu='"+Langu+"')/$value";
	       
	        //var oPathDocDown="/ExpenseItemDocSet(Bukrs='1000',Expenseid='633',Expenseline='0079',Class='BDS_LOC1',Objid='E5DFF53FE09197F19324E61F13FFF6EF',Langu='S')/$value";

	         var oModel = sap.ui.getCore().getModel('comprobaciones');
        	
	         oModel.read(oPathDocDown,  
		             null,  
		             null,  
		             true,  
		             function _OnSuccess(oData, response, status, xhr) {
        				console.log('succes');
        				
        				var tipoarchivo = response.headers["Content-Type"];
        				var datauri;
        				if(tipoarchivo==='application/xml'){
        					datauri='data:application/xml,'+encodeURIComponent(response.body);
        					var win = window.open(datauri,'mywindow' ,'_blank');
        					win.focus();
        				}else{
        					datauri=response.requestUri;
        					var win = window.open(datauri);
        					win.focus();
        				}
        			    
		     		},
		     		function _OnError(oError){    
		     			console.log(oError);
                    }
		    );
		     
		},
		
		exitModifyComprobacion: function() {
			window.history.go(-1);
			this.getView().byId("idIconTabBarModfComp").setSelectedKey("d1");
		},
		
		updateItemGast : function(){
			var oView = this.getView();
			
			var oPathDetGastItem = "/ExpenseItemSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Expenseline='"+Expenseline+"',Langu='"+Langu+"')";
        	
        	var oModel = sap.ui.getCore().getModel('comprobaciones');
			oModel.oHeaders = {
        			"X-CSRF-Token":"Fetch",
            };
        	
        	oModel.read(oPathDetGastItem,  
		             null,  
		             null,  
		             false,  
		             function _OnSuccess(oData, response) {
        		
        			 header_xcsrf_token = response.headers['x-csrf-token'];
        		
        			 oDetailItemGastComprobacionModel.setData({temp_DetailItem: oData});
		             oView.byId("DtItemCmp1").setText("Detalle Item "+Expenseid+" - "+ Expenseline);
		             oView.setModel(oDetailItemGastComprobacionModel,'mDetItem');
		             
		             Importe = oDetailItemGastComprobacionModel.getData().temp_DetailItem.Wrbtr;
		     		},
		     		function _OnError(oError){    
		     			oDetailItemGastComprobacionModel.setData();
                    }
		    );
		},
		
		updateItemCeCo : function(){
			var oView = this.getView();
			
			var oPathCeCo="/ExpenseItemSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Expenseline='"+Expenseline+"',Langu='"+Langu+"')/ToExpenseItemKostl";
        	
        	var oModel = sap.ui.getCore().getModel('comprobaciones');
			oModel.oHeaders = {
        			"X-CSRF-Token":"Fetch",
            };
        	
			oModel.read(oPathCeCo,  
		             null,  
		             null,  
		             false,  
		             function _OnSuccess(oData, response) {
       			
       			 header_xcsrf_token = response.headers['x-csrf-token'];
       		
       			 oCeCoComprobacionModel.setData({temp_CeCo: oData.results});   
       			 var items = oCeCoComprobacionModel.oData.temp_CeCo.length;
       			 oView.byId("idHeaderTableCeCo").setText("Items ("+items+")");
       			 oView.setModel(oCeCoComprobacionModel,'mCeCoGast');   
		     		},
		     		function _OnError(oError){    
		     			oCeCoComprobacionModel.setData();
		     			oView.byId("idHeaderTableCeCo").setText("Items (0)");
                   }
			);
		},
		
		updateItemCont : function(){
			var oView = this.getView();
			
			var oPathCont="/ExpenseItemSet(Bukrs='"+Bukrs+"',Expenseid='"+Expenseid+"',Expenseline='"+Expenseline+"',Langu='"+Langu+"')/ToExpenseItemAcco";
        	
        	var oModel = sap.ui.getCore().getModel('comprobaciones');
			oModel.oHeaders = {
        			"X-CSRF-Token":"Fetch",
            };
        	
			oModel.read(oPathCont,  
		             null,  
		             null,  
		             false,  
		             function _OnSuccess(oData, response) {
       			
       			 header_xcsrf_token = response.headers['x-csrf-token'];
       		
       			 oContComprobacionModel.setData({temp_Cont: oData.results});  
       			 var items = oContComprobacionModel.oData.temp_Cont.length;
       			 oView.byId("idHeaderTableContab").setText("Items ("+items+")");
       			 oView.setModel(oContComprobacionModel,'mContGast');   
		     		},
		     		function _OnError(oError){    
		     			oContComprobacionModel.setData();
		     			oView.byId("idHeaderTableContab").setText("Items (0)");
                   }
		     );
		},
		
		onPressSaveContab : function(){
			var busyDialog = new BusyDialog();
			busyDialog.open();

			var oView = this.getView();
        	var oTable = oView.byId('idTableContab');
        	var oDatosCont = oTable.getModel("mContGast").getData();
			var batchChanges = [];  
			
			var oDataUrl = "proxy/sap/opu/odata/sap/Y10_EXPMAN_SRV/";			
			// Model para Cont
			var oModel = new sap.ui.model.odata.ODataModel(oDataUrl, true);
			
			oModel.oHeaders={
					"X-CSRF-Token": header_xcsrf_token,
			};
			
			setTimeout(function(){
			for (var i = 0; i < oDatosCont.temp_Cont.length; i++) {
			    batchChanges.push(oModel.createBatchOperation("ExpenseItemAccoSet", "POST", oDatosCont.temp_Cont[i]));
			}
			
			oModel.addBatchChangeOperations(batchChanges); 
			oModel.setUseBatch(true);
			oModel.submitBatch(function _OnSuccess(oData, response) {
				console.log(oData);
				console.log(response);
			    
			    if(response.data.__batchResponses[0].message=='HTTP request failed'){
			    	// Creamos Modelo de Mensajes.
		               var moLogErrores = new sap.ui.model.json.JSONModel();
		               var oJSONData  = $.parseJSON(response.data.__batchResponses[0].response.body);
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
			            	  oView.getController().updateItemCont();
			            	  dialogLogOper.close();
			              }
			            }),
			            afterClose: function() {
			            	dialogLogOper.destroy();
						}
		               });
		               busyDialog.close();
		               dialogLogOper.open();
			    }
			    if(response.data.__batchResponses[0].__changeResponses[0].statusText='Created'){
			    	oView.getController().updateItemCont();
			    	busyDialog.close();
			    	MessageBox.success("Datos grabados satisfactoriamente.");
			    }
			    
	     	},
	     	function _OnError(oError){  
	     		busyDialog.close();
	     		console.log(oError);
            }); 
			
			}, 1000);
		},
		
		onPressSaveCeCo: function(){
			
			var SumPorcentajes = 0.00;
			
			var data = oCeCoComprobacionModel.oData.temp_CeCo;
			
			//for(var i = 0; i < idTableCeCo.getItems().length; i++){
			for(var i = 0; i < data.length; i++){
				// Columna  "% Dis"
				//var percent = idTableCeCo.getItems()[i].getCells()[3].getText();
				var percent = data[i].CostPercent;
				SumPorcentajes += parseFloat(percent);
			}
			
			// Validar procentajes al 100%
			if(SumPorcentajes <= 100){
				
				var busyDialog = new BusyDialog();
				busyDialog.open();
				
				var oView = this.getView();
	        	var oTable = oView.byId('idTableCeCo');
	        	var oDatosCeCo = oTable.getModel("mCeCoGast").getData();
				var batchChanges = [];  
				
				var oDataUrl = "proxy/sap/opu/odata/sap/Y10_EXPMAN_SRV/";			
				// Model para CeCo
				var oModel = new sap.ui.model.odata.ODataModel(oDataUrl, true);
								
				oModel.oHeaders={
						"X-CSRF-Token": header_xcsrf_token,
						"Content-Type": "application/atom+xml",
				};
				
				setTimeout(function(){

				for (var i = 0; i < oDatosCeCo.temp_CeCo.length; i++) {
					
					var oObject = {
							Bukrs: oDatosCeCo.temp_CeCo[i].Bukrs,
							Expenseid: oDatosCeCo.temp_CeCo[i].Expenseid,
							Expenseline: oDatosCeCo.temp_CeCo[i].Expenseline,
							Distlin: oDatosCeCo.temp_CeCo[i].Distlin,
							Kostl: oDatosCeCo.temp_CeCo[i].Kostl,
							KostlDesc: oDatosCeCo.temp_CeCo[i].KostlDesc,
							CostPercent: oDatosCeCo.temp_CeCo[i].CostPercent,
							Appdmbtr: oDatosCeCo.temp_CeCo[i].Appdmbtr,
							Operflag: oDatosCeCo.temp_CeCo[i].Operflag,
							Langu: "S"
					};
				    batchChanges.push(oModel.createBatchOperation("ExpenseItemKostlSet", "post", oObject));
				}
				
				oModel.addBatchChangeOperations(batchChanges); 
				oModel.setUseBatch(true);
				oModel.submitBatch(function _OnSuccess(oData, response) {
					console.log(oData);
					console.log(response);
					oView.getController().updateItemCeCo();
					busyDialog.close();
				    MessageBox.success("Datos grabados satisfactoriamente.");
		     	},
		     	function _OnError(oError){   
		     		busyDialog.close();
		     		console.log(oError);
                }); 
				
				}, 1000);
				
			}
			else MessageBox.warning("La suma de los porcentajes de los items no debe ser mayor al 100.00%");

		},
		
	});

});