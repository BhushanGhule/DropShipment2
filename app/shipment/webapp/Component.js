/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "shipment/model/models",
    "sap/ui/model/json/JSONModel",
    "sap/f/FlexibleColumnLayoutSemanticHelper"
],
    function (UIComponent, Device, models, JSONModel, FlexibleColumnLayoutSemanticHelper) {
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
            }
        });
    }
);