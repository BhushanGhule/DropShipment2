sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createGlobalModel: function () {
			var sUserId = "bhushan.ghule@gmail.com";
			var sUserFName = "Bhushan",  // DEFAULT
				sUserLName = "Ghule"; // USER
			var oModel = new JSONModel({
				"Refresh": false,
				"Load": true,
				"UserId": sUserId,
				"UserName": sUserFName + " " + sUserLName,
				"MyInbox": true,
				"MessageFilters": {
					items: [{
						"Key": "S",
						"Text": "Success"
					}, {
						"Key": "E",
						"Text": "Error"
					}]
				}
			});
			return oModel;
		},

	};
});