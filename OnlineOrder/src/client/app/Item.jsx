
import React from 'react';

import AutoSuggestList from "./AutoSuggestList.jsx";
import Select from 'react-select';
import { Well, Button, Collapse } from 'react-bootstrap';
;

/*
const Items = [
  {
    name: 'C',
    year: 1972
  },
  {
    name: 'C#',
    year: 2000
  },
  {
    name: 'C++',
    year: 1983
  },
  {
    name: 'Clojure',
    year: 2007
  },
  {
    name: 'Elm',
    year: 2012
  },
  {
    name: 'Go',
    year: 2009
  },
  {
    name: 'Haskell',
    year: 1990
  },
  {
    name: 'Java',
    year: 1995
  },
  {
    name: 'Javascript',
    year: 1995
  },
  {
    name: 'Perl',
    year: 1987
  },
  {
    name: 'PHP',
    year: 1995
  },
  {
    name: 'Python',
    year: 1991
  },
  {
    name: 'Ruby',
    year: 1995
  },
  {
    name: 'Scala',
    year: 2003
  },

  {
    name: 'Fat Go',
    year: 2003
  }
];
*/
class Item extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      vendorCode: props.vendorCode,
      itemList: props.itemList,
      itemTypes: '',
      itemTypeValue: '',
      itemListByType: [{ name: 'test' }]
    };

    this.onItemTypeChange = this.onItemTypeChange.bind(this);
    this.getItemListByType = this.getItemListByType.bind(this);
  }
  componentWillMount() {

    if (typeof this.state.itemList !== typeof undefined) {
      //alert(JSON.stringify(this.state.itemList)+":  \n" +this.state.vendorCode);

      const itemTypeByVendorCode = this.state.itemList.filter(({ vendorCode }) => vendorCode === this.state.vendorCode);

      if (typeof itemTypeByVendorCode[0] === typeof undefined) {
        console.warn("No items(products) found in JSON for vendorCode: " + this.state.vendorCode);
        return;
      }
      //alert(JSON.stringify(itemTypeByVendorCode) +":  \n" +this.state.vendorCode);

      this.setState({
        itemTypes: itemTypeByVendorCode[0].itemTypes
      });

      // alert( JSON.stringify(itemTypeByVendorCode[0].itemTypes));
    }
  }

  getItemListByType() {
    return this.state.itemListByType;
  }

  onChange(id, newValue) {
    console.log(`${id} changed to ${newValue}`);
  }

  onItemTypeChange(type) {
    if (this.state.itemTypeValue === type) {
      return;
    }

    //alert("type" + JSON.stringify(type.items));    

    this.setState({
      itemTypeValue: type,
      itemListByType: type.items
    });
  }

  render() {
    return (

      <div className="itemContainer">
        <Select
          className="itemType"
          options={this.state.itemTypes}
          onChange={this.onItemTypeChange}
          value={this.state.itemTypeValue}
        />
        <div className="itemName">
          <AutoSuggestList getSuggestionListCallBack={this.getItemListByType}

            id="item"
            placeholder="Please type item..."
            onChange={this.onChange}
          />
        </div>


        <input
          className="itemQuantity"
          placeholder="Qty"
        >
        </input>
        <input className="defalutInput"
          placeholder="remark..."
        >
        </input>
      </div>


    );
  }
}

export default Item;
