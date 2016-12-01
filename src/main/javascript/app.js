const React = require('react');
const ReactDOM = require('react-dom');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

import { Provider } from 'react-redux'

import MicroserviceList from "./components/microserviceList";
import MicroserviceMindmap from "./components/microserviceMindmap";

import store from "./stores/microserviceStore";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            microservices: [],
            consumers: []
        };
    }

    componentDidMount() {

        var client = rest.wrap(mime);
        client({path: '/services'}).then(response => {
            store.dispatch({
                type: 'FETCH_MICROSERVICES_SUCCESS',
                response: response
            });
        });
        client({path: '/data/consumers.json'}).then(response => {
            store.dispatch({
                type: 'FETCH_CONSUMERS_SUCCESS',
                response: response
            });
        });
    }

    render() {
        return (
            <div className="appcontainer">
                <MicroserviceMindmap/>
                <MicroserviceList/>
            </div>
        )
    }
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('react')
);
