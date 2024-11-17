sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet"
],
    function (Controller, Busy, MessageToast, exportLibrary, Spreadsheet) {
        "use strict";

        return Controller.extend("shipment.controller.UpdateTables", {
            onInit: function () {
                this.i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            },

            onUpload: function () {
                var oFileUploader = this.getView().byId("fUploader");
                var oUpld = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
                if (oFileUploader.getValue()) {
                    this.fnReadData(oUpld);
                } else {
                    sap.m.MessageToast.show("Choose a File");
                }
            },
            fnReadData: function (file) {
                var aRowdata = [];
                var aRowDataRef = [];
                var vRowdata = [];
                if (file && window.FileReader) {
                    var reader = new FileReader();
                    var result = {};
                    var data;
                    var oBusy = new sap.m.BusyDialog();
                    oBusy.open();
                    reader.onload = function (e) {
                        var data = e.target.result;
                        var wb = XLSX.read(data, {
                            type: 'binary'
                        });
                        var that = this;
                        wb.SheetNames
                            .forEach(function (sheetName) {
                                if ((sheetName === this.i18n.getText("ShipToCode") && this.getView().byId("RB1-1").getSelected() === true) ||
                                    (sheetName === this.i18n.getText("CarrierAccount2") && this.getView().byId("RB1-2").getSelected() === true) ||
                                    (sheetName === this.i18n.getText("OriginDestinationPoint2") && this.getView().byId("RB1-3").getSelected() === true)) {
                                    aRowDataRef = XLSX.utils
                                        .sheet_to_row_object_array(wb.Sheets[sheetName]);
                                    if (aRowDataRef.length > 0) {
                                        result[sheetName] = aRowDataRef;
                                        Object.keys(aRowDataRef).forEach(function (item) {
                                            Object.keys(aRowDataRef[item]).forEach(function (key) {
                                                var replaced = key.replace(/ /g, '_');
                                                if (key !== replaced) {
                                                    aRowDataRef[item][replaced] = aRowDataRef[item][key];
                                                    delete aRowDataRef[item][key];
                                                }
                                            });
                                            aRowdata.push(aRowDataRef[item]);
                                        });
                                    }
                                }

                            }.bind(this));
                        if (aRowdata.length !== 0) {
                            oBusy.close();
                            if (this.getView().byId("RB1-1").getSelected() === true) {
                                this._handleBatchProcess(this, aRowdata, "ZIMACIPO_DS_SHIP");
                            } else if (this.getView().byId("RB1-2").getSelected() === true) {
                                this._handleBatchProcess(this, aRowdata, "ZIMACIPO_DS_CAR");
                            } else if (this.getView().byId("RB1-3").getSelected() === true) {
                                this._handleBatchProcess(this, aRowdata, "ZIMACIPO_DS_DEST");
                            }

                        } else {
                            oBusy.close();
                            sap.m.MessageToast.show("No Data");
                        }
                    }.bind(this);
                    reader.readAsBinaryString(file);
                }
            },

            // _handleBatchProcess: function (that, oRowData) {
            //     Busy.show();
            //     var url = "/odata/v2/CatalogService/";
            //     var oModel = new sap.ui.model.odata.v2.ODataModel(url, {
            //         useBatch: true,
            //         defaultBindingMode: "TwoWay",
            //         defaultGroupId: "$auto", // Default group for automatic processing
            //         deferredGroups: ["batchGroup1"] // Define the custom deferred group

            //     });

            //     var batchGroupId = "batchGroup1";
            //     var changeSetId = "changeSet1";

            //     // Determine the entity set based on the selected radio button
            //     var entitySet = "";
            //     if (that.getView().byId("RB1-1").getSelected()) {
            //         entitySet = "/ShippingSet";
            //     } else if (that.getView().byId("RB1-2").getSelected()) {
            //         entitySet = "/CarrierSet";
            //     } else if (that.getView().byId("RB1-3").getSelected()) {
            //         entitySet = "/DestinationSet";
            //     }

            //     // Iterate over the row data to create each entry in the batch
            //     oRowData.forEach(function (item) {
            //         var data = {};

            //         if (entitySet === "/ShippingSet") {
            //             data = {
            //                 TITLE: item.Title,
            //                 SHIP_TO_ADDRESS: item.Ship_to_address,
            //                 SOLD_TO_ADDRESS: item.Sold_to_address,
            //                 SHIP_TO_COUNTRY: item.Ship_To_Country,
            //                 SHIP_TO_POSTAL_CODE: item.Ship_To_Postal_Code,
            //                 INVOICE_TO_COUNTRY: item.Invoice_To_Country,
            //                 INVOICE_TO_POSTAL_CODE: item.Invoice_To_Postal_Code,
            //                 INCOTERM_VALUE: item.Incoterm_Value
            //             };
            //         } else if (entitySet === "/CarrierSet") {
            //             data = {
            //                 TITLE: item.Title,
            //                 INCOTERM: item.Incoterm,
            //                 PAID_BY: item.Paid_By,
            //                 CARRIER: item.Carrier,
            //                 SHIPTOCODE: item.Ship_To_Code,
            //                 SITE: item.SITE
            //             };
            //         } else if (entitySet === "/DestinationSet") {
            //             data = {
            //                 TITLE: item.Title
            //             };
            //         }

            //         // Add each item to the batch
            //         oModel.create(entitySet, data, {
            //             batchGroupId: batchGroupId,
            //             changeSetId: changeSetId
            //         });
            //     });

            //     // Submit the batch group
            //     oModel.submitChanges({
            //         batchGroupId: batchGroupId,
            //         success: function (oData) {
            //             Busy.hide();
            //             sap.m.MessageToast.show("Batch request successful.");
            //         },
            //         error: function (error) {
            //             Busy.hide();
            //             console.error("Batch request failed:", error);
            //         }
            //     });
            // },

            _handleBatchProcess: function (that, oRowData) {
                Busy.show();
                var url = "/odata/v2/CatalogService/";
                
                // Create ODataModel with batch enabled
                var oModel = new sap.ui.model.odata.v2.ODataModel(url, {
                    useBatch: true,
                    defaultBindingMode: "TwoWay",
                    defaultGroupId: "$auto", // Default group for automatic processing
                    deferredGroups: ["batchGroup1"] // Define the custom deferred group
                });
            
                var batchGroupId = "batchGroup1";
                var changeSetId = "changeSet1"; // Use the same change set for all requests in the batch
            
                // Determine the entity set based on the selected radio button
                var entitySet = "";
                if (that.getView().byId("RB1-1").getSelected()) {
                    entitySet = "/ShippingSet";
                } else if (that.getView().byId("RB1-2").getSelected()) {
                    entitySet = "/CarrierSet";
                } else if (that.getView().byId("RB1-3").getSelected()) {
                    entitySet = "/DestinationSet";
                }
            
                // Grouping data based on the entity set
                var groupedData = [];
                oRowData.forEach(function (item) {
                    var data = {};
            
                    if (entitySet === "/ShippingSet") {
                        data = {
                            TITLE: item.Title,
                            SHIP_TO_ADDRESS: item.Ship_to_address,
                            SOLD_TO_ADDRESS: item.Sold_to_address,
                            SHIP_TO_COUNTRY: item.Ship_To_Country,
                            SHIP_TO_POSTAL_CODE: item.Ship_To_Postal_Code,
                            INVOICE_TO_COUNTRY: item.Invoice_To_Country,
                            INVOICE_TO_POSTAL_CODE: item.Invoice_To_Postal_Code,
                            INCOTERM_VALUE: item.Incoterm_Value
                        };
                    } else if (entitySet === "/CarrierSet") {
                        data = {
                            TITLE: item.Title,
                            INCOTERM: item.Incoterm,
                            PAID_BY: item.Paid_By,
                            CARRIER: item.Carrier,
                            SHIPTOCODE: item.Ship_To_Code,
                            SITE: item.SITE
                        };
                    } else if (entitySet === "/DestinationSet") {
                        data = {
                            TITLE: item.Title
                        };
                    }
            
                    // Add each item to the batch with the same changeSetId
                    oModel.create(entitySet, data, {
                        batchGroupId: batchGroupId,
                        changeSetId: changeSetId
                    });
                });
            
                // Submit the batch request
                oModel.submitChanges({
                    batchGroupId: batchGroupId,
                    success: function (oData) {
                        Busy.hide();
                        sap.m.MessageToast.show("Batch request successful.");
                    },
                    error: function (error) {
                        Busy.hide();
                        console.error("Batch request failed:", error);
                    }
                });
            },
            

            onDownloadExcel: function (oData) {
                var aCols, aData, oSettings, oSheet, fileName, sheetName;
                aData = [];

                if (this.getView().byId("RB1-1").getSelected() === true) {
                    aCols = this.createColumnZIMACIPO_DS_SHIP();
                    fileName = this.i18n.getText("ZIMACIPO_DS_SHIP");
                    sheetName = this.i18n.getText("ShipToCode");
                    oData.results.forEach(function (Item) {
                        aData.push({
                            Title: Item.TITLE,
                            ShipToAddress: Item.SHIP_TO_ADDRESS,
                            SoldToAddress: Item.SOLD_TO_ADDRESS,
                            ShipToCountry: Item.SHIP_TO_COUNTRY,
                            ShipToPostalCode: Item.SHIP_TO_POSTAL_CODE,
                            InvoiceToCountry: Item.INVOICE_TO_COUNTRY,
                            InvoiceToPostalCode: Item.INVOICE_TO_POSTAL_CODE,
                            IncotermValue: Item.INCOTERM_VALUE
                        });
                    });
                } else if (this.getView().byId("RB1-2").getSelected() === true) {
                    aCols = this.createColumnZIMACIPO_DS_CAR();
                    fileName = this.i18n.getText("ZIMACIPO_DS_CAR");
                    sheetName = this.i18n.getText("CarrierAccount2");
                    oData.results.forEach(function (Item) {
                        aData.push({
                            Title: Item.TITLE,
                            Incoterm: Item.INCOTERM,
                            Carrier: Item.CARRIER,
                            PaidBy: Item.PAID_BY,
                            ShipToCode: Item.SHIPTOCODE,
                            Site: Item.SITE
                        });
                    });
                } else if (this.getView().byId("RB1-3").getSelected() === true) {
                    aCols = this.createColumnZIMACIPO_DS_DEST();
                    fileName = this.i18n.getText("ZIMACIPO_DS_DEST");
                    sheetName = this.i18n.getText("OriginDestinationPoint2");
                    oData.results.forEach(function (Item) {
                        aData.push({
                            Title: Item.TITLE
                        });
                    });
                }
                fileName = fileName + ".xlsx";
                oSettings = {
                    workbook: {
                        columns: aCols,
                        context: {
                            sheetName: sheetName
                        }

                    },
                    dataSource: aData,
                    fileName: fileName

                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build()
                    .then(function () {

                    })
                    .finally(oSheet.destroy);

            },
            createColumnZIMACIPO_DS_SHIP: function () {
                var EdmType = exportLibrary.EdmType;
                return [{
                    label: this.i18n.getText("Title"),
                    property: "Title",
                    type: EdmType.String,
                    width: "10"
                }, {
                    label: this.i18n.getText("ShipToAddress"),
                    property: "ShipToAddress",
                    type: EdmType.String,
                    width: "60"
                }, {
                    label: this.i18n.getText("SoldToAddress"),
                    property: "SoldToAddress",
                    type: EdmType.String,
                    width: "60"
                }, {
                    label: this.i18n.getText("ShipToCountry"),
                    property: "ShipToCountry",
                    type: EdmType.String,
                    width: "20"
                }, {
                    label: this.i18n.getText("ShipToPostalCode"),
                    property: "ShipToPostalCode",
                    type: EdmType.String,
                    width: "20"
                }, {
                    label: this.i18n.getText("InvoiceToCountry"),
                    property: "InvoiceToCountry",
                    type: EdmType.String,
                    width: "20"
                }, {
                    label: this.i18n.getText("InvoiceToPostalCode"),
                    property: "InvoiceToPostalCode",
                    type: EdmType.String,
                    width: "20"
                }, {
                    label: this.i18n.getText("IncotermValue"),
                    property: "IncotermValue",
                    type: EdmType.String,
                    width: "20"
                }];
            },
            createColumnZIMACIPO_DS_CAR: function () {
                var EdmType = exportLibrary.EdmType;
                return [{
                    label: this.i18n.getText("Title"),
                    property: "Title",
                    type: EdmType.String,
                    width: "20"
                }, {
                    label: this.i18n.getText("Incoterm2"),
                    property: "Incoterm",
                    type: EdmType.String,
                    width: "60"
                }, {
                    label: this.i18n.getText("PaidBy"),
                    property: "PaidBy",
                    type: EdmType.String,
                    width: "20"
                }, {
                    label: this.i18n.getText("Carrier"),
                    property: "Carrier",
                    type: EdmType.String,
                    width: "50"
                }, {
                    label: this.i18n.getText("ShipToCode"),
                    property: "ShipToCode",
                    type: EdmType.String,
                    width: "20"
                }, {
                    label: this.i18n.getText("Site"),
                    property: "Site",
                    type: EdmType.String,
                    width: "10"
                }];
            },
            createColumnZIMACIPO_DS_DEST: function () {
                var EdmType = exportLibrary.EdmType;
                return [{
                    label: this.i18n.getText("Title"),
                    property: "Title",
                    type: EdmType.String,
                    width: "40"
                }];
            }
        });
    });
