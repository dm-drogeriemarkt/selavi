const React = require('react');
const ReactDOM = require('react-dom');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

import {Provider} from "react-redux";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from "react-tap-event-plugin";

import MicroserviceFilterBox from "./components/microserviceFilterbox";
import MicroserviceList from "./components/microserviceList";
import MicroserviceMindmap from "./components/microserviceMindmap";
import MicroserviceSnackbar from "./components/microserviceSnackbar";
import AddEditDialog from "./components/addEditDialog";
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

        const serviceBusinessInputFields = {
            "id": {label: "Service ID *", hint: "eg. \"ZOE\"", required: true},
            "label": {label: "Label *", hint: "eg. \"ZOE\"", required: true},
            "description": {label: "Description", hint: "eg. \"ZKDB Online Echtzeitf\u00e4hig\"", required: false},
            "team": {label: "Development Team *", hint: "eg. \"ZOE-Team\"", required: true},
            "dmOwner": {label: "dm-Owner", hint: "eg. \"Erik Altmann\"", required: false, searchEndpoint: "/selavi/person/search"},
            "fdOwner": {label: "Filiadata-Owner *", hint: "eg. \"Altmann, Erik\"", required: true, searchEndpoint: "/selavi/person/search"},
            "documentationLink": {
                label: "Link to documentation",
                hint: "eg. \"https://wiki.dm.de/ZOE\"",
                required: false
            },
            "microserviceUrl": {label: "URL", hint: "eg. \"https://zoe.dm.de\"", required: false},
            "ipAddress": {label: "IP address", hint: "eg. \"172.23.68.213\"", required: false},
            "networkZone": {label: "Network zone", hint: "eg. \"LAN\"", required: false},
            "bitbucketProject": {label: "Bitbucket project", hint: "eg. \"ZOE\"", required: false},
            "bitbucketRepo": {label: "Bitbucket Repository", hint: "eg. \"zoe\"", required: false}
        };

        const serviceTechInputFields = {
            "isExternal": {type: "toggle", label: "External service (eg., not a microservice)"}
        };

        const serviceInputTabs = [
            { label: "Business", inputFields: serviceBusinessInputFields },
            { label: "Technical", inputFields: serviceTechInputFields }
        ];

        const relationBasicFields = {
            "target": {label: "Consumed service", required: true, disabled: true},
            "type": {label: "Type of relation", hint: "eg. \"REST\", \"SOAP\"", required: false}
        };

        const relationInputTabs = [
            { label: "Basic", inputFields: relationBasicFields }
        ];

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
                    <AddEditDialog inputTabs={serviceInputTabs}
                                                  addMenuMode="ADD_SERVICE"
                                                  editMenuMode="EDIT_SERVICE"
                                                  entityDisplayName="Service"/>
                    <AddEditDialog inputTabs={relationInputTabs}
                                                  addMenuMode="ADD_RELATION"
                                                  editMenuMode="EDIT_RELATION"
                                                  entityDisplayName="Link"/>
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
