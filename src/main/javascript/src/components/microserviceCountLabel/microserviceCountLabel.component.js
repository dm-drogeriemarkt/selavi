import React from 'react';
import PropTypes from 'prop-types';
import { hasAllRequiredProperties } from '../../shared/requiredPropertyUtil';


const propTypes = {
  microservices: PropTypes.array.isRequired,
  serviceRequiredProperties: PropTypes.array.isRequired,
  hiddenMicroServices: PropTypes.array.isRequired
};

const MicroserviceCountLabelComponent = props => {
  const { microservices, serviceRequiredProperties, hiddenMicroServices } = props;

  const externalCount = microservices ? microservices.filter((microservice) => microservice.external).length : 0;
  const internalCount = microservices ? microservices.length - externalCount : 0;

  const internalLabel = (internalCount === 1 ? 'microservice' : 'microservices');

  const servicesMissingReqPropsCount = microservices ? microservices.filter((microservice) => !hasAllRequiredProperties(microservice, serviceRequiredProperties)).length : 0;
  const servicesMissingReqPropsLabel = `${servicesMissingReqPropsCount === 1 ? 'service' : 'services'} missing req. props`;
  const getServicesMissingReqPropsCount = () => (
    <div>
      <span>
        {' | '}
        <span style={{ textShadow: '0 0 4px #e50f03' }}>
          {`${servicesMissingReqPropsCount} ${servicesMissingReqPropsLabel}`}
        </span>
      </span>
    </div>);

  const hiddenServicesLabel = hiddenMicroServices && hiddenMicroServices.length ? ` | ${hiddenMicroServices.length} services hidden` : '';

  return (
    <span style={{
      color: 'rgba(0, 0, 0, 0.4)', zIndex: 999, position: 'absolute', left: '0.5em', bottom: '0.5em'
    }}
    >
      {`${`${internalCount} ${internalLabel}`} `}
      <span style={{ color: '#19c786' }}>
&#x0272A;
      </span>
      {` | ${externalCount} external `}
      <span style={{ color: '#f69805' }}>
&#x0272A;
      </span>
      {
        servicesMissingReqPropsCount
          ? getServicesMissingReqPropsCount()
          : null
    }
      {hiddenServicesLabel}
    </span>
  );
};

MicroserviceCountLabelComponent.propTypes = propTypes;
export default MicroserviceCountLabelComponent;
