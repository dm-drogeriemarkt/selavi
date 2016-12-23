const React = require('react');
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        microservices: state.microservices
    };
};

class MicroserviceCountLabel extends React.Component {
    render() {

        const externalCount = this.props.microservices.filter((microservice) => microservice.isExternal).length;
        const internalCount = this.props.microservices.length - externalCount;

        const externalLabel = (externalCount === 1 ? "external service" : "external services");
        const internalLabel = (internalCount === 1 ? "microservice" : "microservices");

        return (
            <span style={{color: "rgba(0, 0, 0, 0.4)"}}>
                {internalCount} {internalLabel} <span style={{color: "#19c786"}}>&#x0272A;</span>, {externalCount} {externalLabel} <span style={{color: "#f69805"}}>&#x0272A;</span>
            </span>
        );
    }
}

export default connect(mapStateToProps) (MicroserviceCountLabel);