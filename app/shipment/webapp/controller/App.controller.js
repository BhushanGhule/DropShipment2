sap.ui.define(
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (BaseController) {
    "use strict";

    return BaseController.extend("shipment.controller.App", {
      onInit: function () {
        this.oRouter = this.getOwnerComponent().getRouter();
        this.oRouter.attachRouteMatched(this.onRouteMatched, this);
        this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
      },
      onBeforeRouteMatched: function (oEvent) {

        var oModel = this.getOwnerComponent().getModel("ComponentModel"),
          sLayout = oEvent.getParameters().arguments.layout;
  
        // If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
        if (!sLayout) {
          var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
          sLayout = oNextUIState.layout;
        }
  
        // Update the layout of the FlexibleColumnLayout
        if (sLayout) {
          oModel.setProperty("/layout", sLayout);
        }
      },
  
      onRouteMatched: function (oEvent) {
        var sRouteName = oEvent.getParameter("name"),
          // oArguments = oEvent.getParameter("arguments"),
          sLayout = oEvent.getParameters().arguments.layout,
          oModel = this.getOwnerComponent().getModel("ComponentModel");
  
        if (!sLayout) {
          var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
          sLayout = oNextUIState.layout;
        }
        // Update the layout of the FlexibleColumnLayout
        if (sLayout) {
          sLayout = "TwoColumnsMidExpanded";
          oModel.setProperty("/layout", sLayout);
        }
        this._updateUIElements();
        // Save the current route name
        this.currentRouteName = sRouteName;
      },
  
      onStateChanged: function (oEvent) {
        /*var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
          sLayout = oEvent.getParameter("layout");*/
        this._updateUIElements();
  
        // Replace the URL with the new layout if a navigation arrow was used
        /*if (bIsNavigationArrow) {
          this.oRouter.navTo(this.currentRouteName, {
            layout: sLayout
          }, true);
        }*/
      },
  
      // Update the close/fullscreen buttons visibility
      _updateUIElements: function () {
        var oModel = this.getOwnerComponent().getModel("ComponentModel");
        var oUIState = this.getOwnerComponent().getHelper().getCurrentUIState();
        oModel.setData(oUIState);
      },
  
      onExit: function () {
        this.oRouter.detachRouteMatched(this.onRouteMatched, this);
        this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
      }
    });
  }
);
