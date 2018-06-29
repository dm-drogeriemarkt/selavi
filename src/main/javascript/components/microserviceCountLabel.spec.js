import React from 'react';
import chai from 'chai';
import { shallow } from 'enzyme';
import { MicroserviceCountLabelComponent } from '../../../main/javascript/components/microserviceCountLabel';


function createProps() {
  return {
    microservices: [
      {
        id: 'foo-service',
        label: 'foo-service'
      },
      {
        id: 'bar-consumer',
        label: 'bar-consumer',
        external: true,
        consumes: [
          { target: 'foo-service', type: 'REST' }
        ]
      }
    ],
    serviceRequiredProperties: [],
    hiddenMicroServices: []
  };
}

describe('<MicroserviceCountLabel/>', () => {

  it('displays count of (external) services', () => {
    const props = createProps();

    const wrapper = shallow(<MicroserviceCountLabelComponent {...props}/>);
    chai.expect(wrapper.text()).to.equal('1 microservice ✪ | 1 external ✪');
  });

  it('displays count of services that are missing required properties', () => {
    const props = createProps();
    props.serviceRequiredProperties.push('consumes');

    const wrapper = shallow(<MicroserviceCountLabelComponent {...props}/>);
    chai.expect(wrapper.text()).to.equal('1 microservice ✪ | 1 external ✪ | 1 service missing req. props');
  });

  it('displays count of hidden services', () => {
    const props = createProps();

    const wrapper = shallow(<MicroserviceCountLabelComponent {...props}/>);
    chai.expect(wrapper.text()).to.equal('1 microservice ✪ | 1 external ✪');

    wrapper.setProps({ hiddenMicroServices: ['this is a service'] });
    chai.expect(wrapper.text()).to.equal('1 microservice ✪ | 1 external ✪ | 1 services hidden');
  });

});

