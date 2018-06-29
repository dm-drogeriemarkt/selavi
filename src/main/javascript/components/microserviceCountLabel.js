import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { hasAllRequiredProperties } from './../shared/requiredPropertyUtil';

const mapStateToProps = (state) => ({
  microservices: state.microservices,
  hiddenMicroServices: state.hiddenMicroServices
});

const propTypes = {
  microservices: PropTypes.array.isRequired,
  serviceRequiredProperties: PropTypes.array.isRequired,
  hiddenMicroServices: PropTypes.array.isRequired
};

const MicroserviceCountLabelComponent = props => {

  const externalCount = props.microservices.filter((microservice) => microservice.external).length;
  const internalCount = props.microservices.length - externalCount;

  const internalLabel = (internalCount === 1 ? 'microservice' : 'microservices');

  const servicesMissingReqPropsCount = props.microservices.filter((microservice) => !hasAllRequiredProperties(microservice, props.serviceRequiredProperties)).length;
  const servicesMissingReqPropsLabel = `${servicesMissingReqPropsCount === 1 ? 'service' : 'services'} missing req. props`;

  const hiddenServicesLabel = props.hiddenMicroServices.length > 0 ? ` | ${props.hiddenMicroServices.length} services hidden` : '';

  return (
    <span style={{ color: 'rgba(0, 0, 0, 0.4)', zIndex: 999, position: 'absolute', left: '0.5em', bottom: '0.5em' }}>
      {internalCount} {internalLabel} <span style={{ color: '#19c786' }}>&#x0272A;</span> | {externalCount} external <span style={{ color: '#f69805' }}>&#x0272A;</span>
      {servicesMissingReqPropsCount > 0 && <span> | <span style={{ textShadow: '0 0 4px #e50f03' }}>{servicesMissingReqPropsCount} {servicesMissingReqPropsLabel}</span></span>}
      {hiddenServicesLabel}
    </span>
  );
};

MicroserviceCountLabelComponent.propTypes = propTypes;
export { MicroserviceCountLabelComponent };

const MicroserviceCountLabel = connect(mapStateToProps)(MicroserviceCountLabelComponent);
export default MicroserviceCountLabel;
