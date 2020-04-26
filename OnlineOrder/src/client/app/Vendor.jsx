
import React from 'react';
import AutoSuggestList from "./AutoSuggestList.jsx";
import Select from 'react-select';

//import styles from "./../css/autosuggestion.css";
/*
const Vendors = [
  {
    PinCode:
    [
      {
        label: "445304",
        businessCategory: [
          {
            label: "Pharmaceutical", 
            vendor:[
              {
                label: "Mahesh Traders",
                details:
                {

                }
             }
            ]              
            
          }
        ]
      }
    ]
  }  
    
];*/

class Vendor extends React.Component {
  constructor(props) {

    super();
    this.state = {
      onVendorChange: props.onVendorChange,
      bCategoryList: props.bCategoryList,
      bCategoryValue: '',
      vendorList: [{ 'label': '' }],
      vendorValue: ''
    },

      this.onBusinessCategoryChange = this.onBusinessCategoryChange.bind(this);
    this.onVendorDetailsChange = this.onVendorDetailsChange.bind(this);
  }


  vendorChanged() {
    this.state.onVendorChange(this.state.vendorValue);
  }

  onBusinessCategoryChange(businessCategory) {
    //alert("businessCategory :  "+JSON.stringify(businessCategory));
    if (businessCategory == this.state.bCategoryValue) {
      return;
    }

    this.setState({
      bCategoryValue: businessCategory,
      vendorList: businessCategory.vendor
    });

  }

  onVendorDetailsChange(myVendor) {
    this.setState({
      vendorValue: myVendor
    }, this.vendorChanged);

  }

  render() {
    return (
      <div>
        <div className="inline">

          <span className="desc">Business Category</span>
          <Select
            className="vendorBCategorySelect"
            options={this.state.bCategoryList}
            key="businessCategory"
            name="businessCategory"
            onChange={this.onBusinessCategoryChange}
            value={this.state.bCategoryValue} />
        </div>

        <div className="inline">
          <span className="desc">Vendor</span>
          <Select
            className="vendorSelect"
            onChange={this.onVendorDetailsChange}

            options={this.state.vendorList}
            value={this.state.vendorValue}
          />
        </div>
      </div>





    );
  }
}

export default Vendor;
