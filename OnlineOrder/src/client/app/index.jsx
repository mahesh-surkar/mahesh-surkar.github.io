
import React from 'react';
import { render } from 'react-dom';

import OnlineOrder from './onlineorder.jsx';
import Item from './Item.jsx';
import OrderGenerator from './OrderGenerator.jsx';
import RegistrationPage from './Registration.jsx';

class App extends React.Component {
    render() {
        return (
            <div>
                <p> Online Order System</p>
                <OrderGenerator />
                <RegistrationPage />
            </div>
        );
    }
}

render(<App />, document.getElementById('app'));