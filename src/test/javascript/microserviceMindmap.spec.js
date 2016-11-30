import React from 'react';
import chai from 'chai';
import { shallow } from 'enzyme';

var spies = require('chai-spies');
chai.use(spies);

var expect = chai.expect;

import MicroserviceMindmap from '../../main/javascript/microserviceMindmap';

describe('<MicroserviceMindmap/>', function () {
    it('can be instantiated', function () {

        const wrapper = shallow(<MicroserviceMindmap />);

        expect(wrapper.type()).to.equal('div');
    });

    it('creates vis js graph', function () {

        // enzyme's shallow rendering does not call all lifecycle methods of the component, unless
        // lifecycleExperimental is set to 'true'. in our case, componentDidUpdate() was not called.
        // this might be resolved in the future, see https://github.com/airbnb/enzyme/pull/318
        const wrapper = shallow(<MicroserviceMindmap />, { lifecycleExperimental: true });

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
        global.vis = chai.spy.object([ 'DataSet', 'Network' ]);

        wrapper.setProps({ microservices: microservices,
                           consumers: consumers});

        expect(global.vis.DataSet).to.have.been.called.with(expectedAllNodes);
    });
});