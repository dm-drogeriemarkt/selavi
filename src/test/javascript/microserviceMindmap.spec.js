var sinon = require('sinon');

import React from 'react';
import chai from 'chai';
import { shallow } from 'enzyme';

import { MicroserviceMindmap } from '../../main/javascript/components/microserviceMindmap';

describe('<MicroserviceMindmap/>', function () {

    var networkOnSpy = sinon.spy();
    var networkSetDataSpy = sinon.spy();
    var networkAddEdgeModeSpy = sinon.spy();
    var networkDisableEditModeSpy = sinon.spy();

    before(function() {
        // global is node.js' window
        global.vis = {
            DataSet: sinon.spy(),
            Network: sinon.stub().returns({
                on: networkOnSpy,
                setData: networkSetDataSpy,
                addEdgeMode: networkAddEdgeModeSpy,
                disableEditMode: networkDisableEditModeSpy
            })
        };
    });

    afterEach(function() {
        global.vis.DataSet.reset();
        global.vis.Network.reset();
        networkOnSpy.reset();
        networkSetDataSpy.reset();
        networkAddEdgeModeSpy.reset();
        networkDisableEditModeSpy.reset();
    })

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
                color: {
                    background: "#bef24d",
                    border: "#19c786"
                }
            },
            {
                id: "bar-consumer",
                label: "bar-consumer",
                isExternal: true,
                consumes: [
                    "foo-service"
                ],
                color: {
                    background: "#f2d12d",
                    border: "#f69805"
                }
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

    it('only creates vis network once', function () {

        const props = createProps();

        const wrapper = shallow(<MicroserviceMindmap {...props} />, { lifecycleExperimental: true });

        sinon.assert.calledTwice(global.vis.DataSet);
        sinon.assert.calledOnce(global.vis.Network);

        global.vis.DataSet.reset();
        global.vis.Network.reset();

        props.microservices.push({ id: "fart-service" });

        wrapper.setProps(props);

        sinon.assert.calledTwice(global.vis.DataSet);
        sinon.assert.calledOnce(networkSetDataSpy);
        sinon.assert.notCalled(global.vis.Network);
    });

    xit('adding a connection does not re-draw the graph', function () {

        /*
         TODO: fix this test

         enzymes lifecycleExperimental feature, which triggers all react lifecycle methods
         on shallow-rendered components, has different behaviour than 'real' react:

         when a component implements shouldComponentUpdate(), and returns false, the components props
         are NOT updated! react itself does update the props in this case, it simply does not call render()

         possible fixes:
          * dont use shallow rendering here. use jsdom or a 'real' browser (eg. phantomjs) to provide a DOM
          * wait for enzyme to fix this issue
         */

        var props = createProps();

        const wrapper = shallow(<MicroserviceMindmap {...props} />, {lifecycleExperimental: true});

        global.vis.DataSet.reset();
        global.vis.Network.reset();

        props.menuMode = "ADD_LINK";
        wrapper.setProps(props);

        sinon.assert.calledOnce(networkAddEdgeModeSpy);
        sinon.assert.notCalled(global.vis.DataSet);
        sinon.assert.notCalled(networkSetDataSpy);
        sinon.assert.notCalled(global.vis.Network);

        delete props.menuMode;
        wrapper.setProps(props);

        sinon.assert.calledOnce(networkDisableEditModeSpy);
        sinon.assert.notCalled(global.vis.DataSet);
        sinon.assert.notCalled(networkSetDataSpy);
        sinon.assert.notCalled(global.vis.Network);
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
