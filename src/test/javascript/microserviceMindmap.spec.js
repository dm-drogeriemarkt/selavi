var sinon = require('sinon');

import React from 'react';
import chai from 'chai';
import { shallow } from 'enzyme';

import { MicroserviceMindmap } from '../../main/javascript/components/microserviceMindmap';

describe('<MicroserviceMindmap/>', function () {

    var networkOnSpy = sinon.spy();

    before(function() {
        // global is node.js' window
        global.vis = {
            DataSet: sinon.spy(),
            Network: sinon.stub().returns({
                on: networkOnSpy
            })
        };
    });

    it('can be instantiated', function () {

        const wrapper = shallow(<MicroserviceMindmap />);

        chai.expect(wrapper.type()).to.equal('div');
    });

    it('creates vis js graph', function () {

        const props = createProps();

        // enzyme's shallow rendering does not call all lifecycle methods of the component, unless
        // lifecycleExperimental is set to 'true'. in our case, componentDidUpdate() was not called.
        // this might be resolved in the future, see https://github.com/airbnb/enzyme/pull/318
        const wrapper = shallow(<MicroserviceMindmap {...props} />, { lifecycleExperimental: true });

        const expectedAllNodes = [
            {
                id: "foo-service",
                label: "foo-service",
                color: "lightblue"
            },
            {
                id: "bar-consumer",
                label: "bar-consumer",
                isExternal: true,
                consumes: [
                    "foo-service"
                ],
                color: "orange"
            }
        ]

        const expectedEdges = [
            {
                from: "bar-consumer",
                to: "foo-service"
            }
        ]

        sinon.assert.calledTwice(global.vis.DataSet);
        sinon.assert.calledWith(global.vis.DataSet, expectedAllNodes);
        sinon.assert.calledWith(global.vis.DataSet, expectedEdges);

        sinon.assert.calledOnce(global.vis.Network);

        chai.expect(global.vis.Network.args[0][2].nodes.borderWidth).to.equal(2);
        chai.expect(global.vis.Network.args[0][2].edges.width).to.equal(2);
        chai.expect(global.vis.Network.args[0][2].layout.randomSeed).to.equal(2);

        sinon.assert.calledTwice(networkOnSpy);
        sinon.assert.calledWith(networkOnSpy, "selectNode", sinon.match.func);
        sinon.assert.calledWith(networkOnSpy, "oncontext"); // we did not define a handler function in this test!
    });
});

function createProps() {
    const microservices = [
        {
            id: "foo-service",
            label: "foo-service"
        },
        {
            id: "bar-consumer",
            label: "bar-consumer",
            isExternal: true,
            consumes: [
                "foo-service"
            ]
        }
    ];

    const props = {
        onSelectMicroserviceNode: sinon.spy(),
        onAddLink: sinon.spy(),
        microservices: microservices
    };

    return props;
}
