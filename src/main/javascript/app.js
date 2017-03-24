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

        const microserviceAddServiceDialogProps = {
            textFields: {
                "id": {label: "Service ID *", hint: "eg. &quot;ZOE&quot;", default: "", required: false},
                "label": {label: "", hint: "", default: "", required: false},
                "description": {label: "", hint: "", default: "", required: false},
                "team": {label: "", hint: "", default: "", required: false},
                "dmOwner": {label: "", hint: "", default: "", required: false},
                "fdOwner": {label: "", hint: "", default: "", required: false},
                "documentationLink": {label: "", hint: "", default: "", required: false},
                "microserviceUrl": {label: "", hint: "", default: "", required: false},
                "ipAddress": {label: "", hint: "", default: "", required: false},
                "networkZone": {label: "", hint: "", default: "", required: false},
                "isExternal": {label: "", hint: "", default: "", required: false}
            },
            toggles: [
                {id:"isExternal", label:"", default: true}
            ]
        }

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
                    <MicroserviceAddServiceDialog/>
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
