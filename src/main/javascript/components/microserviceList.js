const React = require('react');
import { connect } from 'react-redux';

import Microservice from "./microservice";

const mapStateToProps = (state) => {
    return {
        microservices: state.microservices
    };
};

class MicroserviceList extends React.Component {
    render() {
        var microservices = this.props.microservices.map(microservice =>
            <Microservice key={microservice.id} microservice={microservice}/>
        );
        return (
            <table className="microserviceList">
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

export default connect(mapStateToProps) (MicroserviceList);