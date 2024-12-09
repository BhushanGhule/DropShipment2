using {DropShipment.db.master} from '../db/data-model';


service CatlogService @(path: 'CatalogService') {

    @open
    type object {};

    entity DestinationSet as projection on master.Destination;
    entity ShippingSet    as projection on master.Shipping;
    entity CarrierSet     as projection on master.Carrier;
    entity VendorSet      as projection on master.Vendor;
    entity DSHeaderSet    as projection on master.DSHeader;
    entity DSItemSet      as projection on master.DSItem;

    action CreateDSRequest(DSHeader : DSHeaderSet, DSItem : array of DSItemSet) returns object;
    action CreateDestination(Destination : array of DestinationSet)             returns object;
    action CreateShipping(Shipping : array of ShippingSet)                   returns object;
    action CreateCarrier(Carrier : array of CarrierSet)                     returns object;
    action TestRequest(DSHeader : DSHeaderSet, DSItem : array of DSItemSet)     returns object;
    action MyAction(input1 : object, input2 : array of object, )                returns object;

}
