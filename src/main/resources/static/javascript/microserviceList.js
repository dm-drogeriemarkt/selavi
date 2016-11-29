const React = require('react');

import Microservice from "./microservice";

export default class MicroserviceList extends React.Component {
    render() {
        var microservices = this.props.microservices.map(microservice =>
            <Microservice key={microservice.id} microservice={microservice}/>
        );
        return (
            <table>
                <tbody>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Description</th>
                </tr>
                {microservices}
                </tbody>
            </table>
        )
    }
}