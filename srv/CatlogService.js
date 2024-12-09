const cds = require('@sap/cds');
module.exports = cds.service.impl(async function () {

    const { DestinationSet, CarrierSet, ShippingSet, DSHeaderSet, DSItemSet } = this.entities;

    //generic handler - developer get flexibility to attach their 
    //own code on top of what CAPM already offers

    this.on(['CREATE'], DestinationSet, async (req) => {
        const tx = cds.tx(req);
        try {
            await tx.create(DestinationSet, req.data);
            await tx.commit();

        } catch (error) {
            await tx.rollback(error);
        }
    });

    this.on(['CREATE'], ShippingSet, async (req) => {
        const tx = cds.tx(req);
        try {

            await tx.create(ShippingSet, req.data);
            await tx.commit();

        } catch (error) {
            await tx.rollback(error);
        }
    });

    this.on(['CREATE'], CarrierSet, async (req) => {
        const tx = cds.tx(req);
        try {

            await tx.create(CarrierSet, req.data);
            await tx.commit();

        } catch (error) {
            await tx.rollback(error);
        }
    });

    this.before(['CREATE'], DSHeaderSet, async (req) => {
        req.data.CreatedOn = new Date().toISOString();
        req.data.LastChangedOn = new Date().toISOString();
    });


    this.on(['CREATE'], DSHeaderSet, async (req) => {
        const tx = cds.tx(req);
        try {

            await tx.create(DSHeaderSet, req.data);
            await tx.commit();
            const result = await next(); // Proceed with the default handler
            return result; // Return the result to the client
        } catch (error) {
            await tx.rollback(error);
        }
    });

    this.on(['CREATE'], DSItemSet, async (req) => {
        const tx = cds.tx(req);
        try {

            await tx.create(DSItemSet, req.data);
            await tx.commit();

        } catch (error) {
            await tx.rollback(error);
        }
    });


    this.on(['CreateDestination'], async (req) => {
        const { Destination } = req.data; // Extract the data payload from the request

        // Validate the incoming data
        if (!Destination || !Array.isArray(Destination)) {
            return req.reject(400, 'Invalid payload. Provide an array of Destination objects.');
        }

        const tx = cds.transaction(req); // Start a transaction

        try {
            // Step 1: Delete all existing records in the DestinationSet
            await tx.run(DELETE.from(this.entities.DestinationSet));
            console.log('All existing records in DestinationSet have been deleted.');

            // Step 2: Insert the new records into the DestinationSet
            const result = await tx.run(
                INSERT.into(this.entities.DestinationSet).entries(Destination)
            );

            // Step 3: Commit the transaction
            await tx.commit();

            // Return success message with the number of created records
            return {
                message: `All existing records deleted. ${result.results.changes} new Destination records created successfully.`,
                createdRecords: result,
            };
        } catch (error) {
            console.error('Error during CreateDestination:', error);

            // Rollback the transaction in case of any error
            await tx.rollback();
            req.error(500, `Failed to process CreateDestination: ${error.message}`);
        }
    });

    this.on(['CreateShipping'], async (req) => {
        const { Shipping } = req.data; // Extract the data payload from the request

        // Validate the incoming data
        if (!Shipping || !Array.isArray(Shipping)) {
            return req.reject(400, 'Invalid payload. Provide an array of Shipping objects.');
        }

        const tx = cds.transaction(req); // Start a transaction

        try {
            // Step 1: Delete all existing records in the ShippingSet
            await tx.run(DELETE.from(this.entities.ShippingSet));
            console.log('All existing records in ShippingSet have been deleted.');

            // Step 2: Insert the new records into the ShippingSet
            const result = await tx.run(
                INSERT.into(this.entities.ShippingSet).entries(Shipping)
            );

            // Step 3: Commit the transaction
            await tx.commit();

            // Return success message with the number of created records
            return {
                message: `All existing records deleted. ${result.results.changes} new Shipping records created successfully.`,
                createdRecords: result,
            };
        } catch (error) {
            console.error('Error during CreateShipping:', error);

            // Rollback the transaction in case of any error
            await tx.rollback();
            req.error(500, `Failed to process CreateShipping: ${error.message}`);
        }
    });

    this.on(['CreateCarrier'], async (req) => {
        const { Carrier } = req.data; // Extract the data payload from the request

        // Validate the incoming data
        if (!Carrier || !Array.isArray(Carrier)) {
            return req.reject(400, 'Invalid payload. Provide an array of Carrier objects.');
        }

        const tx = cds.transaction(req); // Start a transaction

        try {
            // Step 1: Delete all existing records in the CarrierSet
            await tx.run(DELETE.from(this.entities.CarrierSet));
            console.log('All existing records in CarrierSet have been deleted.');

            // Step 2: Insert the new records into the CarrierSet
            const result = await tx.run(
                INSERT.into(this.entities.CarrierSet).entries(Carrier)
            );

            // Step 3: Commit the transaction
            await tx.commit();

            // Return success message with the number of created records
            return {
                message: `All existing records deleted. ${result.results.changes} new Carrier records created successfully.`,
                createdRecords: result,
            };
        } catch (error) {
            console.error('Error during CreateCarrier:', error);

            // Rollback the transaction in case of any error
            await tx.rollback();
            req.error(500, `Failed to process CreateCarrier: ${error.message}`);
        }
    });

    this.on('CreateDSRequest', async (req) => {
        const { DSHeader, DSItems } = req.data;
    
        // Validate that DSHeader is provided and is an object
        if (!DSHeader || typeof DSHeader !== 'object') {
            req.error(400, 'DSHeader must be a valid object.');
        }
    
        // Start a transaction
        const tx = cds.transaction(req);
    
        try {
            // Insert the DSHeader record into DSHeaderSet using tx.create
            const dsHeaderResult = await tx.create('DSHeaderSet', DSHeader);
    
            // Validate insertion of DSHeader
            if (!dsHeaderResult) {
                req.error(400, 'Failed to create DSHeader.');
            }
    
            // Check if DSItems are provided
            if (Array.isArray(DSItems) && DSItems.length > 0) {
                // Add RequestNumber from DSHeader to each DSItem
                const dsItemsWithRequestNumber = DSItems.map((item, index) => ({
                    ...item,
                    RequestNumber: DSHeader.RequestNumber, // Use the RequestNumber from DSHeader
                    SequenceNumber: index + 1 // Assign sequence number
                }));
    
                // Insert DSItems into DSItemSet using tx.create
                const dsItemsResults = await Promise.all(
                    dsItemsWithRequestNumber.map(item => tx.create('DSItemSet', item))
                );
    
                // Validate insertion of DSItems
                if (dsItemsResults.length !== DSItems.length) {
                    req.error(400, 'Failed to create one or more DSItems.');
                }
            }
    
            // Commit the transaction
            await tx.commit();
    
            // Return success message
            return {
                message: 'Drop Shipment request created successfully.',
                RequestNumber: DSHeader.RequestNumber
            };
        } catch (error) {
            // Rollback transaction in case of failure
            await tx.rollback();
            req.error(500, `Error in CreateDSRequest action: ${error.message}`);
        }
    });
    

    this.on('MyFunction', async (req) => {
        let result = {};
        if (req.data.category === 1) {
            result.category = 'Category 1';
            result.field1 = "Random Field Value";
            result.field2 = [{ "f1": "f1 Value1" }]
        } else {
            result.category = { "Info": "Category2" };
            result.field1 = "Random Field Value";
            result.field2 = [{ "f1": "f1 Value1" }, { "f1": "f1 Value2", "f2": "f2 Value2" }];
        }
        return result;
    });

    this.on('MyAction', async (req) => {
        req.data["AdditionalField"] = "AdditionalFieldValue";
        return req.data;
    });

});

