namespace DropShipment.db;

using {
    cuid,
    managed,
    temporal,
    Currency
} from '@sap/cds/common';

context master {
    entity Destination {
        key TITLE : String(35);
    }

    entity Shipping {
        key TITLE                  : String(8);
            SHIP_TO_ADDRESS        : String(250);
            SOLD_TO_ADDRESS        : String(250);
            SHIP_TO_COUNTRY        : String(30);
            SHIP_TO_POSTAL_CODE    : String(15);
            INVOICE_TO_COUNTRY     : String(30);
            INVOICE_TO_POSTAL_CODE : String(15);
            INCOTERM_VALUE         : String(40);
    }

    entity Carrier {
        key TITLE      : String(8);
            INCOTERM   : String(42);
            PAID_BY    : String(40);
            CARRIER    : String(45);
            SHIPTOCODE : String(8);
            SITE       : String(4);
    }

}
