var sinon = require('sinon');

import React from 'react';
import chai from 'chai';
import { shallow } from 'enzyme';

import { MicroserviceMindmap } from '../../main/javascript/components/microserviceMindmap';

describe('<MicroserviceMindmap/>', function () {
    it('can be instantiated', function () {

        const wrapper = shallow(<MicroserviceMindmap />);

        chai.expect(wrapper.type()).to.equal('div');
    });

    it('creates vis js graph', function () {

        const props = {
            onSelectMicroserviceNode: sinon.spy()
        }

        // enzyme's shallow rendering does not call all lifecycle methods of the component, unless
        // lifecycleExperimental is set to 'true'. in our case, componentDidUpdate() was not called.
        // this might be resolved in the future, see https://github.com/airbnb/enzyme/pull/318
        const wrapper = shallow(<MicroserviceMindmap {...props}/>, { lifecycleExperimental: true });

        const microservices = [
            {
                id: "foo-service",
                label: "foo-service"
            }
        ];

        const consumers = [
            {
                id: "bar-consumer",
                label: "bar-consumer",
                consumes: [
                    "foo-service"
                ]
            }
        ];

        const expectedAllNodes = [
            {
                id: "foo-service",
                label: "foo-service",
                color: "lightblue"
            },
            {
                id: "bar-consumer",
                label: "bar-consumer",
                consumes: [
                    "foo-service"
                ],
                color: "orange"
            }
        ]

        // global is node.js' window
        global.vis = {
            DataSet: sinon.spy(),
            Network: sinon.stub().returns({
                on: sinon.spy()
            })
        };

        wrapper.setProps({ microservices: microservices,
                           consumers: consumers});

        chai.expect(global.vis.DataSet.calledWith(expectedAllNodes));
    });
});
