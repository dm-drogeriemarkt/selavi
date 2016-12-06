var sinon = require('sinon');

import React from 'react';
import chai from 'chai';
import { shallow } from 'enzyme';

import { MicroserviceMindmap } from '../../main/javascript/components/microserviceMindmap';

describe('<MicroserviceMindmap/>', function () {

    before(function() {
        // global is node.js' window
        global.vis = {
            DataSet: sinon.spy(),
            Network: sinon.stub().returns({
                on: sinon.spy()
            })
        };
    });

    it('can be instantiated', function () {

        const wrapper = shallow(<MicroserviceMindmap />);

        chai.expect(wrapper.type()).to.equal('div');
    });

    it('creates vis js graph', function () {

        const props = createProps();

        const wrapper = shallow(<MicroserviceMindmap {...props}/>);

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

        chai.expect(global.vis.DataSet.calledWith(expectedAllNodes));
    });
});

function createProps() {
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

    const props = {
        onSelectMicroserviceNode: sinon.spy(),
        microservices: microservices,
        consumers: consumers
    };

    return props;
}
