import React from 'react';
import { render } from 'react-dom';

import Item from './Item.jsx';
import Vendor from './Vendor.jsx';
import Location from './Location.jsx'
import Select from 'react-select';
import { Well, Button, Collapse } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';



const Countries = [
    {
        name: 'India',
        States: [
            {
                label: 'Maharshtra',
                districts:
                [
                    {
                        label: 'Yavatmal',
                        areas:
                        [
                            {
                                label: 'Wani',
                                pincode: '445304'
                            }
                        ]
                    },
                    {
                        label: 'Pune',
                        areas: [
                            {
                                label: 'Pimple Saudagar',
                                pincode: '411027'
                            }
                        ]
                    }
                ]
            },
            {
                label: "Gujarat",
                districts:
                [
                    {
                        label: 'Ahmdabad',
                        areas:
                        [
                            {
                                label: 'G1',
                                pincode: '445304'
                            }
                        ]
                    },
                    {
                        label: 'Surat',
                        areas: [
                            {
                                label: 'G2',
                                pincode: '445304'
                            }
                        ]
                    }
                ]
            }
        ]

    }
];

const Vendors = [
    {
        PinCode: "445304",
        businessCategory: [
            {
                label: "Pharmaceutical",
                vendor: [
                    {
                        label: "Mahesh Traders",
                        vendorCode: "445304_1",
                        address: "Wani, Yavatmal"
                    }
                ]

            }
        ]

    },
    {
        PinCode: "411027",
        businessCategory: [
            {
                label: "Pharmaceutical",
                vendor: [
                    {
                        label: "Vaishali Traders",
                        vendorCode: "411027_1",
                        address: "A-503, Ganeesham Phase-1, Behind Hotel Govind Garden, Pimple Saudagar, Pune, 27"
                    }
                ]

            }
        ]

    },


];

const Products = [
    {
        vendorCode: "411027_1",
        itemTypes: [
            {
                label: "Tablet",
                items: [
                    {
                        name: "Amlodac AT",
                        info: {

                        }
                    },
                    {
                        name: "Amlokind AT",
                        info: {

                        }
                    }
                ]
            },
            {
                label: "syrup",
                items: [
                    {
                        name: "Bendril",
                        info: {

                        }

                    }

                ]
            }
        ]

    }
]
class OrderGenerator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //itemList: [<Item key={0} itemList={[{ 'label': '' }]} />],
            itemList: [],

            vendorList: [<Vendor key={0} bCategoryList={[{ 'label': '' }]} />],
            vendorInfo: [<div className="vendorInfo" key={0}>Please select vendor...</div>],
            vendorCode: ''
        };

        this.addItem = this.addItem.bind(this);
        this.onVendorChange = this.onVendorChange.bind(this);
        this.onLocationChange = this.onLocationChange.bind(this);
        this.vendorDetailsClicked = this.vendorDetailsClicked.bind(this);

    }

    addItem() {
        const itemList = this.state.itemList;

        this.setState({
            itemList: itemList.concat(<Item key={this.state.itemList.length + 1} vendorCode={this.state.vendorCode} itemList={Products} />)
        });

    }

    vendorDetailsClicked() {
        this.setState(
            { open: !this.state.open }
        );
    }

    onVendorChange(vendor) {

        if (this.state.vendorCode == vendor.vendorCode) {

            this.setState({ open: false, });
            //nothing is changed
            return;
        }

        //alert("vendor changed :   " + JSON.stringify(vendor));

        this.setState({
            open: false,
            vendorCode: vendor.vendorCode,
            vendorInfo: [<div className="vendorInfo" key={1}>{vendor.label}, {vendor.address}, {vendor.vendorCode}</div>],
            itemList: [<Item key={this.state.itemList.length} vendorCode={vendor.vendorCode} itemList={Products} />],
        });

    }
    onLocationChange(location) {
        if (location) {
            //alert("Location changed :   " + JSON.stringify(location));
            const vendorList = this.state.vendorList;
            const vendorByPincode = Vendors.filter(({ PinCode }) => PinCode === location.pincode)
            //alert(JSON.stringify(vendorByPincode[0].businessCategory)+" :ii" + location.pincode)
            this.setState({
                vendorList: [<Vendor key={1}
                    bCategoryList={vendorByPincode[0].businessCategory}
                    onVendorChange={this.onVendorChange}
                />]
            });

        }
        else {

            this.setState({
                //  itemList: [<Item key={0} itemList={[{ 'label': '' }]} />],
                itemList: [],
                vendorList: [<Vendor key={2} bCategoryList={[]} />],
                vendorCode: '',
                vendorInfo: [<div className="vendorInfo" key={1}>Please select vendor...</div>]

            });
        }
    }
    render() {
        return (
            <div className="mainForm">
                <p>Generate Order</p>

                <span className="desc">Order to vendor</span>

                <Button bsStyle="link" onClick={this.vendorDetailsClicked}>
                    {this.state.vendorInfo}
                </Button>
                <Collapse in={this.state.open}>
                    <div>
                        <Well>
                            <Location CountryList={Countries} onLocationChange={this.onLocationChange} />
                            <div className="hspace"> </div>
                            {this.state.vendorList}
                        </Well>
                    </div>
                </Collapse>
                <div className="hspace"> </div>

                <span className="desc">Items </span>

                <well>
                    {this.state.itemList}
                </well>
                <div className="hspace"> </div>

                <button onClick={this.addItem}>Item...</button>

                <div className="hspace"> </div>

                <button>Place Order</button>
                <button>Cancel</button>
            </div >
        );
    }
}

export default OrderGenerator;
