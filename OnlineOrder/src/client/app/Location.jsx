
import React from 'react';
import { render } from 'react-dom';

import AutoSuggestList from "./AutoSuggestList.jsx";
import Select from 'react-select';

import 'react-select/dist/react-select.css';

/*

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
                                pincode: '445304'
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
*/
class Location extends React.Component {
    constructor(props) {

        super();
        this.state = {
            onLocationChange: props.onLocationChange,
            countryList: props.CountryList,
            cstateList: props.CountryList[0].States,
            cstate: '',
            district: '',
            districts: [{ label: '' }],
            area: '',
            areas: [{ label: '' }]
        }
    }

    locationChanged() {
        this.state.onLocationChange(this.state.area);
        return;
    }

    updateCState = (cstate) => {
        if (cstate === this.state.cstate) {
            return;
        }
        //  alert("cstate " + JSON.stringify(cstate));
        this.setState({
            cstate: cstate,
            districts: cstate.districts,
            district: '',
            area: '',
        }, this.locationChanged);
    }

    updateDistrict = (district) => {

        if (district == this.state.district) {
            return;
        }
        this.setState({
            district: district,
            areas: district.areas,
            area: '',
        }, this.locationChanged);
    }

    updateArea = (area) => {

        if (area == this.state.area) {
            return;
        }

        this.setState({
            area: area
        }, this.locationChanged);



    }
    render() {

        return (
            <div>
                <div className="inline">
                    <span className="desc">State</span>
                    <Select
                        className='locationSelect'
                        options={this.state.cstateList}
                        onChange={this.updateCState}
                        key="cstates"
                        name="cstates"
                        value={this.state.cstate} />
                </div>
                <div className="inline">
                    <span className="desc">District</span>
                    <Select
                        className='locationSelect'
                        options={this.state.districts}
                        onChange={this.updateDistrict}
                        key="district"
                        name="district"
                        value={this.state.district}
                    />
                </div>
                <div className="inline">
                    <span className="desc">City/Town/Village</span>
                    <Select
                        className='locationSelect'
                        options={this.state.areas}
                        onChange={this.updateArea}
                        key="area"
                        name="area"
                        value={this.state.area}
                    />
                </div>

            </div >

        );
    }
};


export default Location;
