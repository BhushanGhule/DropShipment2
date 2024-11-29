using {DropShipment.db.master} from '../db/data-model';

service CatlogService @(path: 'CatalogService') {

    entity DestinationSet as projection on master.Destination;
    entity ShippingSet    as projection on master.Shipping;
    entity CarrierSet     as projection on master.Carrier;
    entity VendorSet      as projection on master.Vendor;
    entity DSHeaderSet    as projection on master.DSHeader;
    entity DSItemSet      as projection on master.DSItem;
}
