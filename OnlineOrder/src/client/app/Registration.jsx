import React from 'react';
import { render } from 'react-dom';
import { Form, Panel, Well, Button, Collapse } from 'react-bootstrap';

import styles from "./../css/Registration.css";

class RegistrationForm extends React.Component {

    render() {
       return (
        <Form className="mainForm">
            <Panel>
               <div className="inline">
                  <label className="desc">Email Address</label>
                  <input type="email" className="signupInput" name="email" placeholder="email@example.com">
                  </input>
              </div>
              <div>
              <div className="inline">
                <label className="desc">Password</label>
                 <input  type="password" className="signupInput" name="password" placeholder="Password"> 
                 </input>
                 </div>
                 <div className="inline">
                  <label className="desc">Confirm Password</label>
                  <input  type="password" className="signupInput" name="Confirm password" placeholder="Confirm password"> 
                  </input>
                 </div>
                 </div>

                 <div className="inline">
                 <label className="desc">Secret question for password recovery</label>
                <input name="secretQuestion" className="signupInput" placeholder="Secret question"> 
                </input>
                </div>
                <div className="inline">

                <label className="desc">Answer for secret question</label>
                <input name="secretAnswer" className="signupInput" placeholder="Secret question answer">
                 </input>
                 </div>
            </Panel>

            <Panel>
                <div>
               <div className="inline">
                 <label className="desc">First Name</label>
                 <input name="firstName" className="signupInput" placeholder="First name"> 
                  </input>
                  </div>
                  <div className="inline">

               <label className="desc">Last Name</label>
                <input name="lastName" className="signupInput" placeholder="Last name"> 
                </input>
                </div>
                </div>
                <div>
                <div className="inline">
                <label className="desc">Mobile Number</label>
                <input name="mobileNumber" className="signupInput" placeholder="Mobile number"> 
                </input>
                </div>
                </div>

                <div>
                <div className="inline">
                <label className="desc">Address Line1</label>
                <input name="addressLine1" className="signupInput" placeholder="Address Line1"> 
                </input>
                </div>
                <div className="inline">
                <label className="desc">Address Line2</label>
                <input name="addressLine2" className="signupInput" placeholder="Address Line2">
                 </input>
                 </div>
                 <div className="inline">
                 <label className="desc">Address Line3</label>
                <input name="addressLine3" className="signupInput" placeholder="Address Line3">
                 </input>
                 </div>
                 </div>

                 <div>
                 <div className="inline">
                 <label className="desc">City/Town/Village</label>
                <input name="city" className="signupInput" placeholder="City/Town/Village">
                 </input>
                 </div>
                 <div className="inline">
                 <label className="desc">District</label>
                <input name="district" className="signupInput" placeholder="District"> 
                </input>
                </div>
                <div className="inline">
                <label className="desc">State</label>
                <input name="state"  className="signupInput" placeholder="State"> 
                </input>
                </div>
                <div className="inline">
                <label className="desc">Country</label>
                <input name="country" className="signupInput"placeholder="country"> 
                </input>
                </div>
                </div>
                <div className="inline">
                <label className="desc">Pincode</label>
                <input name="pincode" className="signupInput" placeholder="Pincode"> 
                </input>
                </div>

                </Panel>

              
                
                <input type="submit" value="submit"> 
                </input>    
            </Form>
        );
    }
}

export default RegistrationForm;
