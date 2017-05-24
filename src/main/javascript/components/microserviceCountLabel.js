const React = require('react');
import { connect } from 'react-redux';

import {hasAllRequiredProperties} from "./../shared/requiredPropertyUtil";

const mapStateToProps = (state) => {
    return {
        microservices: state.microservices
    };
};

export class MicroserviceCountLabel extends React.Component {
    render() {

        const externalCount = this.props.microservices.filter((microservice) => microservice.isExternal).length;
        const internalCount = this.props.microservices.length - externalCount;

        const internalLabel = (internalCount === 1 ? "microservice" : "microservices");

        const servicesMissingReqPropsCount = this.props.microservices.filter((microservice) => !hasAllRequiredProperties(microservice, this.props.serviceRequiredProperties)).length;
        const servicesMissingReqPropsLabel = (servicesMissingReqPropsCount === 1 ? "service" : "services") + " missing req. props";

        return (
            <span style={{color: "rgba(0, 0, 0, 0.4)", zIndex: 999, position: 'absolute', left: '0.5em', bottom: '0.5em'}}>
                {internalCount} {internalLabel} <span style={{color: "#19c786"}}>&#x0272A;</span> | {externalCount} external <span style={{color: "#f69805"}}>&#x0272A;</span>{servicesMissingReqPropsCount > 0 && <span> | <span style={{textShadow: "0 0 4px #e50f03"}}>{servicesMissingReqPropsCount} {servicesMissingReqPropsLabel}</span></span>}
            </span>
        );
    }
}

export default connect(mapStateToProps) (MicroserviceCountLabel);