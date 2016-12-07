const React = require('react');
import { connect } from 'react-redux';

import Microservice from "./microservice";

const mapStateToProps = (state) => {
    return {
        microservices: state.microservices,
        selectedService: state.selectedService
    };
};

class MicroserviceList extends React.Component {
    render() {
        var microservices = this.props.microservices.map(microservice => {
            var selected = (this.props.selectedService === microservice.id);
            return <Microservice key={microservice.id} microservice={microservice} selected={selected} />
        });
        return (
            <div className="microserviceList">
                <table >
                    <tbody>
                    <tr>
                        <th>id</th>
                        <th>url</th>
                    </tr>
                    {microservices}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default connect(mapStateToProps) (MicroserviceList);