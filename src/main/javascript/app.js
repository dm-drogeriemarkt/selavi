const React = require('react');
const ReactDOM = require('react-dom');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

import {Provider} from "react-redux";
import MicroserviceList from "./components/microserviceList";
import MicroservicePropertyList from "./components/microservicePropertyList";
import MicroserviceMindmap from "./components/microserviceMindmap";
import MicroserviceMenu from "./components/microserviceMenu";
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
    }

    render() {
        return (
            <div className="appcontainer">
                <MicroserviceMindmap/>
                <div className="microserviceRightPanel">
                    <MicroserviceList/>
                    <MicroserviceMenu/>
                    <MicroservicePropertyList/>
                </div>
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
