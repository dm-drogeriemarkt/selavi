import React from 'react';
import chai from 'chai';
import { shallow } from 'enzyme';
import { MicroserviceCountLabel } from '../../../main/javascript/components/microserviceCountLabel';

describe('<MicroserviceCountLabel/>', function () {

    it('displays count of (external) services', function () {
        const props = createProps();

        const wrapper = shallow(<MicroserviceCountLabel {...props}/>);
        chai.expect(wrapper.text()).to.equal('1 microservice ✪ | 1 external ✪');
    });

    it('displays count of services that are missing required properties', function () {
        const props = createProps();
        props.serviceRequiredProperties.push('consumes');

        const wrapper = shallow(<MicroserviceCountLabel {...props}/>);
        chai.expect(wrapper.text()).to.equal('1 microservice ✪ | 1 external ✪ | 1 service missing req. props');
    });

});

function createProps() {
    return {
        microservices: [
            {
                id: "foo-service",
                label: "foo-service"
            },
            {
                id: "bar-consumer",
                label: "bar-consumer",
                external: true,
                consumes: [
                    { "target": "foo-service", "type": "REST" }
                ]
            }
        ],
        serviceRequiredProperties: []
    };
}
