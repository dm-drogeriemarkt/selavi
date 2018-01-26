import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { hasAllRequiredProperties } from './../shared/requiredPropertyUtil';

const mapStateToProps = (state) => ({
  microservices: state.microservices
});

const propTypes = {
  microservices: PropTypes.array.isRequired,
  serviceRequiredProperties: PropTypes.array.isRequired
};

export const MicroserviceCountLabelComponent = props => {

  const externalCount = props.microservices.filter((microservice) => microservice.external).length;
  const internalCount = props.microservices.length - externalCount;

  const internalLabel = (internalCount === 1 ? 'microservice' : 'microservices');

  const servicesMissingReqPropsCount = props.microservices.filter((microservice) => !hasAllRequiredProperties(microservice, props.serviceRequiredProperties)).length;
  const servicesMissingReqPropsLabel = `${servicesMissingReqPropsCount === 1 ? 'service' : 'services'} missing req. props`;

  return (
    <span style={{ color: 'rgba(0, 0, 0, 0.4)', zIndex: 999, position: 'absolute', left: '0.5em', bottom: '0.5em' }}>
      {internalCount} {internalLabel} <span style={{ color: '#19c786' }}>&#x0272A;</span> | {externalCount} external <span style={{ color: '#f69805' }}>&#x0272A;</span>
      {servicesMissingReqPropsCount > 0 && <span> | <span
        style={{ textShadow: '0 0 4px #e50f03' }}
      >
        {servicesMissingReqPropsCount} {servicesMissingReqPropsLabel}</span></span>}
    </span>
  );
};

MicroserviceCountLabelComponent.propTypes = propTypes;

export const MicroserviceCountLabel = connect(mapStateToProps)(MicroserviceCountLabelComponent);
