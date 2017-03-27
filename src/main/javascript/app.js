const React = require('react');
const ReactDOM = require('react-dom');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

import {Provider} from "react-redux";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import MicroserviceFilterBox from "./components/microserviceFilterbox";
import MicroserviceList from "./components/microserviceList";
import MicroserviceMindmap from "./components/microserviceMindmap";
import MicroserviceSnackbar from "./components/microserviceSnackbar";
import MicroserviceAddServiceDialog from "./components/microserviceAddServiceDialog";
import MicroserviceDeleteServiceDialog from "./components/microserviceDeleteServiceDialog";
import store from "./stores/microserviceStore";

// see http://www.material-ui.com/#/get-started/installation
injectTapEventPlugin();

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
        client({path: '/selavi/services'}).then(response => {
            store.dispatch({
                type: 'FETCH_MICROSERVICES_SUCCESS',
                response: response
            });
        });
    }

    render() {

        const textFields = {
            "id": {label: "Service ID *", hint: "eg. &quot;ZOE&quot;", required: false},
            "label": {label: "Label *", hint: "eg. &quot;ZOE&quot;", required: false},
            "description": {label: "Description", hint: "eg. &quot;ZKDB Online Echtzeitfähig&quot;", required: false},
            "team": {label: "Development Team", hint: "eg. &quot;ZOE-Team&quot;", required: false},
            "dmOwner": {label: "dm-Owner", hint: "eg. &quot;Erik Altmann&quot;", required: false},
            "fdOwner": {label: "Filiadata-Owner", hint: "eg. &quot;Erik Altmann&quot;", required: false},
            "documentationLink": {label: "Link to documentation", hint: "eg. &quot;https://wiki.dm.de/ZOE&quot;", required: false},
            "microserviceUrl": {label: "URL", hint: "eg. &quot;https://zoe.dm.de&quot;", required: false},
            "ipAddress": {label: "IP address", hint: "eg. &quot;172.23.68.213&quot;", required: false},
            "networkZone": {label: "Network zone", hint: "eg. &quot;LAN&quot;", required: false}
        };

        const toggles = {
            "isExternal": {label: "External service (eg., not a microservice)"}
        };

        return (
            <div className="appcontainer">
                <div className="appheader">
                    <MicroserviceFilterBox/>
                </div>
                <div className="appcontent">
                    <MicroserviceMindmap/>
                    <MicroserviceList/>
                </div>
                <div className="appfooter">
                    <MicroserviceSnackbar/>
                    <MicroserviceAddServiceDialog textFields={textFields} toggles={toggles}/>
                    <MicroserviceDeleteServiceDialog/>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <MuiThemeProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('react')
);
