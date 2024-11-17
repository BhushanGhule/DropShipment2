// module.exports = cds.service.impl(async function () {

//     const { DestinationSet, CarrierSet, ShippingSet } = this.entities;

//     //generic handler - developer get flexibility to attach their 
//     //own code on top of what CAPM already offers

//     this.on(['CREATE'], DestinationSet, async (req) => {
//         const tx = cds.tx(req);
//         try {
//             await tx.create(DestinationSet, req.data);
//             await tx.commit();

//         } catch (error) {
//             await tx.rollback(error);
//         }
//     });

//     this.on(['CREATE'], ShippingSet, async (req) => {
//         const tx = cds.tx(req);
//         try {

//             await tx.create(ShippingSet, req.data);
//             await tx.commit();

//         } catch (error) {
//             await tx.rollback(error);
//         }
//     });

//     this.on(['CREATE'], CarrierSet, async (req) => {
//         const tx = cds.tx(req);
//         try {

//             await tx.create(CarrierSet, req.data);
//             await tx.commit();

//         } catch (error) {
//             await tx.rollback(error);
//         }
//     });


// });



module.exports = cds.service.impl(async function () {
    const { DestinationSet, CarrierSet, ShippingSet } = this.entities;

    // Batch CREATE handling
    this.on(['CREATE'], async (req) => {
        const tx = cds.tx(req);
        const payload = Array.isArray(req.data) ? req.data : [req.data];

        // Group data by entity set
        const groupedData = {
            ShippingSet: [],
            CarrierSet: [],
            DestinationSet: []
        };

        payload.forEach((item) => {
            if (item.SHIP_TO_ADDRESS || item.TITLE) {
                groupedData.ShippingSet.push(item);
            } else if (item.CARRIER || item.SITE) {
                groupedData.CarrierSet.push(item);
            } else {
                groupedData.DestinationSet.push(item);
            }
        });

        // Process the grouped data
        try {
            const results = [];

            if (groupedData.ShippingSet.length > 0) {
                const shippingResults = await Promise.all(
                    groupedData.ShippingSet.map((item) => tx.create(ShippingSet, item))
                );
                results.push(...shippingResults);
            }

            if (groupedData.CarrierSet.length > 0) {
                const carrierResults = await Promise.all(
                    groupedData.CarrierSet.map((item) => tx.create(CarrierSet, item))
                );
                results.push(...carrierResults);
            }

            if (groupedData.DestinationSet.length > 0) {
                const destinationResults = await Promise.all(
                    groupedData.DestinationSet.map((item) => tx.create(DestinationSet, item))
                );
                results.push(...destinationResults);
            }

            await tx.commit(); // Commit the transaction
            return results; // Return all created records
        } catch (error) {
            await tx.rollback(); // Rollback in case of error
            req.error(500, `Failed to process batch: ${error.message}`);
        }
    });
});
