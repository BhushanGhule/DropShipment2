module.exports = cds.service.impl(async function(){

    const {DestinationSet} = this.entities;

    //generic handler - developer get flexibility to attach their 
    //own code on top of what CAPM already offers
    this.before(['CREATE','GET'], DestinationSet, (req) => {

    });



});