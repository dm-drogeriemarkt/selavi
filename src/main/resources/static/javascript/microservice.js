const React = require('react');

export default class Microservice extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.microservice.label}</td>
            </tr>
        )
    }
}
