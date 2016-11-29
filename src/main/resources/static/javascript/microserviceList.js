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
                    <th>id</th>
                    <th>label</th>
                    <th>url</th>
                </tr>
                {microservices}
                </tbody>
            </table>
        )
    }
}