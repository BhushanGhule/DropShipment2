module.exports = cds.service.impl(async function () {

    const { DestinationSet, CarrierSet, ShippingSet } = this.entities;


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
        try {

            const tx = cds.tx(req);
            await tx.create(ShippingSet, req.data);
            await tx.commit();

        } catch (error) {
            await tx.rollback(error);
        }
    });

    this.on(['CREATE'], CarrierSet, async (req) => {
        try {

            const tx = cds.tx(req);
            await tx.create(CarrierSet, req.data);
            await tx.commit();

        } catch (error) {
            await tx.rollback(error);
        }
    });


});