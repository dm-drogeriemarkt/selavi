const React = require('react');
const ReactDOM = require('react-dom');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

import MicroserviceList from "./microserviceList";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {microservices: []};
    }

    componentDidMount() {

        var client = rest.wrap(mime);
        client({path: '/data/microservices.json'}).then(response => {
            this.setState({microservices: response.entity});
        });
    }

    render() {
        return (
            <MicroserviceList microservices={this.state.microservices}/>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
);
