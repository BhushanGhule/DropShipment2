namespace DropShipment.db;

using {
    cuid,
    managed,
    temporal,
    Currency
} from '@sap/cds/common';

context master {
    entity Destination : cuid {
        TITLE : String(35) @title: '{i18n>TITLE}';
    }

    entity Shipping : cuid {
        TITLE                  : String(8)   @title: '{i18n>TITLE}';
        SHIP_TO_ADDRESS        : String(250) @title: '{i18n>SHIP_TO_ADDRESS}';
        SOLD_TO_ADDRESS        : String(250) @title: '{i18n>SOLD_TO_ADDRESS}';
        SHIP_TO_COUNTRY        : String(30)  @title: '{i18n>SHIP_TO_COUNTRY}';
        SHIP_TO_POSTAL_CODE    : String(15)  @title: '{i18n>SHIP_TO_PS}';
        INVOICE_TO_COUNTRY     : String(30)  @title: '{i18n>INVOICE_TO_COUNTRY}';
        INVOICE_TO_POSTAL_CODE : String(15)  @title: '{i18n>INVOICE_TO_PC}';
        INCOTERM_VALUE         : String(40)  @title: '{i18n>INCOTERM_VAL}';
    }

    entity Carrier : cuid {
        TITLE      : String(8)  @title: '{i18n>TITLE}';
        INCOTERM   : String(42) @title: '{i18n>INCOTERM}';
        PAID_BY    : String(40) @title: '{i18n>PAID_BY}';
        CARRIER    : String(45) @title: '{i18n>CARRIER}';
        SHIPTOCODE : String(8)  @title: '{i18n>SHIPTOCODE}';
        SITE       : String(4)  @title: '{i18n>SITE}';
    }

    entity Vendor {
        key VendorCode : String(10) @title: '{i18n>VendorCode}';
            VendorName : String(50) @title: '{i18n>VENDOR_NAME}';

    }

    entity DSHeader {
        key RequestNumber           : String(10)     @title: '{i18n>REQUESTNUMBER}}';
            VendorCode              : String(10)     @title: '{i18n>VENDOR_CODE}}}';
            Plant                   : String(4)      @title: '{i18n>PLANT}}';
            VendorName              : String(35)     @title: '{i18n>VENDOR_NAME}';
            ShipperName             : String(80)     @title: '{i18n>SHIPPERNAME}';
            ShipperAddress          : String(150)    @title: '{i18n>SHIPPERADDRESS}';
            InvoiceType             : String(13)     @title: '{i18n>INVOICETYPE}';
            ShipToCode              : String(8)      @title: '{i18n>SHIPTOCODE}';
            FreightPayableBy        : String(8)      @title: '{i18n>FREIGHTPAYABLEBY}';
            PaidBy                  : String(40)     @title: '{i18n>PAIDBY}';
            Incoterm                : String(42)     @title: '{i18n>INCOTERM}';
            FinalIncoterms          : String(42)     @title: '{i18n>FINALINCOTERMS}';
            CarrierAccountNumber    : String(45)     @title: '{i18n>CARRIERACCOUNTNUMBER}';
            OriginDestinationPoint  : String(26)     @title: '{i18n>ORIGINDESTINATIONPOINT}';
            MethodOfTransport       : String(10)     @title: '{i18n>METHODOFTRANSPORT}';
            ServiceType             : String(8)      @title: '{i18n>SERVICETYPE}';
            DateShipped             : Date           @title: '{i18n>DATESHIPPED}';
            Currency                : String(5)      @title: '{i18n>CURRENCY}';
            CINumber                : String(16)     @title: '{i18n>CINUMBER}';
            ShipToAddress           : String(250)    @title: '{i18n>SHIPTOADDRESS}';
            SoldToAddress           : String(250)    @title: '{i18n>SOLDTOADDRESS}';
            PalletCarton            : String(7)      @title: '{i18n>PALLETCARTON}';
            TotalShipmentCarton     : String(3)      @title: '{i18n>TOTALSHIPMENTCARTON}';
            TotalGrossWeight        : Decimal(10, 3) @title: '{i18n>TOTALGROSSWEIGHT}';
            TotalVolumeMetricWeight : Decimal(10, 3) @title: '{i18n>TOTALVOLUMEMETRICWEIGHT}';
            Measurement             : String(250)    @title: '{i18n>MEASUREMENT}';
            Status                  : String(3)      @title: '{i18n>STATUS}';
            UserName                : String(80)     @title: '{i18n>USERNAME}';
            Author                  : String(80)     @title: '{i18n>AUTHOR}';
            CreatedOn               : DateTime       @title: '{i18n>CREATEDON}';
            LastChangedBy           : String(80)     @title: '{i18n>LASTCHANGEDBY}';
            LastChangedOn           : DateTime       @title: '{i18n>LASTCHANGEDON}';
            Remarks                 : String(250)    @title: '{i18n>REMARKS}';
    }

    entity DSItem {
        RequestNumber  : String(10)     @title: '{i18n>REQUESTNUMBER}}';
        SequenceNumber : Int16          @title: '{i18n>SequenceNumber}';
        POLineItem     : String(10)     @title: '{i18n>POLineItem}';
        SitePO         : String(10)     @title: '{i18n>SitePO}';
        ImacPO         : String(10)     @title: '{i18n>ImacPO}';
        PackingList    : String(30)     @title: '{i18n>PackingList}';
        Material       : String(40)     @title: '{i18n>Material}';
        Description    : String(40)     @title: '{i18n>Description}';
        Quantity       : Decimal(10, 0) @title: '{i18n>Quantity}';
        UOM            : String(2)      @title: '{i18n>UOM}';
        HS             : String(10)     @title: '{i18n>HS}';
        ECN            : String(5)      @title: '{i18n>ECN}';
        COO            : String(10)     @title: '{i18n>COO}';
        UnitPrice      : Decimal(10, 5) @title: '{i18n>UnitPrice}';
        NetWeight      : Decimal(7, 3)  @title: '{i18n>NetWeight}';
        ExtendedPrice  : Decimal(10, 2) @title: '{i18n>ExtendedPrice}';
        Z03            : String(10)     @title: '{i18n>Z03}';
        Z411k          : String(10)     @title: '{i18n>Z411k}';
        Dn             : String(10)     @title: '{i18n>Dn}';
        Z643           : String(10)     @title: '{i18n>Z643}';

    }

}
