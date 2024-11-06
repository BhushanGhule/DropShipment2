sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("shipment.controller.Master", {
        onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
        }
    });
});
