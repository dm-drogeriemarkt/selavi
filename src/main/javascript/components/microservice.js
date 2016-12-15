const React = require('react');

export default class Microservice extends React.Component {
    render() {
        var selected = this.props.selected ? "selected" : "";
        var filterHit = this.props.filterHit ? "filterHit" : "";
        var className = `microserviceListEntry ${selected} ${filterHit}`;
        return (
            <tr className={className}>
                <td>{this.props.microservice.id}</td>
                <td><a href={this.props.microservice['microservice-url']}>{this.props.microservice['microservice-url']}</a></td>
            </tr>
        )
    }
}
