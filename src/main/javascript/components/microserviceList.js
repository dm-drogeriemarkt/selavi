const React = require('react');
import { connect } from 'react-redux';

import Microservice from "./microservice";

const mapStateToProps = (state) => {
    return {
        microservices: state.microservices,
        selectedService: state.selectedService,
        filterString: state.filterString
    };
};

class MicroserviceList extends React.Component {
    render() {
        var microservices = this.props.microservices.map(microservice => {
            var selected = (this.props.selectedService === microservice.id);
            var filterHit = (this.props.filterString && microservice.label) ? (microservice.label.toLowerCase().indexOf(this.props.filterString.toLowerCase()) != -1) : false;
            return <Microservice key={microservice.id} microservice={microservice} selected={selected} filterHit={filterHit} />
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