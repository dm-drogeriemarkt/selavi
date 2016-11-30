const React = require('react');

export default class Microservice extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.microservice.id}</td>
                <td>{this.props.microservice.label}</td>
                <td>{this.props.microservice['microservice-url']}</td>
            </tr>
        )
    }
}
