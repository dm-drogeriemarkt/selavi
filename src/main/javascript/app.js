const React = require('react');
const ReactDOM = require('react-dom');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

import MicroserviceList from "./microserviceList";
import MicroserviceMindmap from "./microserviceMindmap";

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
            this.setState({microservices: response.entity});
        });
        client({path: '/data/consumers.json'}).then(response => {
            this.setState({consumers: response.entity});
        });
    }

    render() {
        return (
            <div>
                <MicroserviceMindmap microservices={this.state.microservices}
                                     consumers={this.state.consumers}/>
                <MicroserviceList microservices={this.state.microservices}/>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
);
