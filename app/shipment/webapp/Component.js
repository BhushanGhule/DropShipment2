/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "shipment/model/models",
    "sap/f/FlexibleColumnLayoutSemanticHelper",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator"
],
    function (UIComponent, Device, models, FlexibleColumnLayoutSemanticHelper, JSONModel, Busy) {
        "use strict";

        return UIComponent.extend("shipment.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // Setting Component Model - for setting UI States
                var oModel = new JSONModel();
                this.setModel(oModel, "ComponentModel");

                // Setting Global Model - for setting View properties
                this.setModel(models.createGlobalModel(), "GlobalModel");

                //Fetch User Details
                this.getUserDetails();
                this.readVendorList(this);
                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            },
            getHelper: function () {
                var oFCL = this.getRootControl().byId("shipment"),
                    oParams = jQuery.sap.getUriParameters(),
                    oSettings = {
                        defaultTwoColumnLayoutType: sap.f.LayoutType.TwoColumnsMidExpanded,
                        defaultThreeColumnLayoutType: sap.f.LayoutType.ThreeColumnsMidExpanded,
                        mode: oParams.get("mode"),
                        initialColumnsCount: oParams.get("initial"),
                        maxColumnsCount: oParams.get("max")
                    };

                return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
            },

            getUserDetails: function () {
                var UserDetails = new JSONModel({
                    Uname: "Bhushan Ghule",
                    Buyer: true,
                    PuMgr: false,
                    PuLogLeader: false,
                    LogisticsMgr: false,
                    LogisticsAnalyst: false,
                    SME: false
                });
                this.setModel(UserDetails, "UserDetailsModel");
                //Set My Inbox Model 	
                var oMyInboxModel = new JSONModel({
                    "MyInboxRequests": 0,
                    items: []
                });
                oMyInboxModel.setSizeLimit(10000);
                this.setModel(oMyInboxModel, "MyInboxRequestModel");
            },
            readVendorList: function (that) {
                that.getModel().read("/VendorSet", {
                    success: function (oData, oResponse) {
                        var oVendorListModel = new JSONModel({});
                        oVendorListModel.setSizeLimit(10000);
                        that.setModel(oVendorListModel, "VendorListModel");
                        oData.results.sort(function (a, b) {
                            return a.VendorCode - b.VendorCode;
                        });
                        that.getModel("VendorListModel").setProperty("/VendorList", oData.results);
                        Busy.hide();
                    }.bind(that),
                    error: function (oError) {
                        if (oError.responseText) {
                            var sErrorText = JSON.parse(oError.responseText).error.message.value;
                            sap.m.MessageBox.error(sErrorText);
                        }
                    }.bind(that)
                });
            }	

        });
    }
);