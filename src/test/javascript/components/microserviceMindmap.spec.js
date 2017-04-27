var sinon = require('sinon');

import React from "react";
import chai from "chai";
import {shallow} from "enzyme";
import {MicroserviceMindmap} from "../../../main/javascript/components/microserviceMindmap";

describe('<MicroserviceMindmap/>', function () {

    var networkOnSpy = sinon.spy(function (event, handler) {
        if (event === 'click') {
            clickEventHandler = handler;
        } else if (event === 'oncontext') {
            oncontextEventHandler = handler;
        }
    });
    var networkSetDataSpy = sinon.spy();
    var networkAddEdgeModeSpy = sinon.spy();
    var networkDisableEditModeSpy = sinon.spy();
    var networkGetNodeAtSpy = sinon.stub();
    var networkSelectNodesSpy = sinon.spy();
    var networkUnselectAllSpy = sinon.spy();
    var networkGetEdgeAtSpy = sinon.stub();
    var networkGetConnectedNodes = sinon.stub();

    var windowAddEventListenerSpy = sinon.spy();

    var clickEventHandler, oncontextEventHandler;

    before(function () {
        // global is node.js' window
        global.vis = {
            DataSet: sinon.spy(),
            Network: sinon.stub().returns({
                on: networkOnSpy,
                setData: networkSetDataSpy,
                addEdgeMode: networkAddEdgeModeSpy,
                disableEditMode: networkDisableEditModeSpy,
                getNodeAt: networkGetNodeAtSpy,
                selectNodes: networkSelectNodesSpy,
                unselectAll: networkUnselectAllSpy,
                getEdgeAt: networkGetEdgeAtSpy,
                getConnectedNodes: networkGetConnectedNodes
            })
        };

        global.window = {
            addEventListener: windowAddEventListenerSpy
        }
    });

    afterEach(function () {
        global.vis.DataSet.reset();
        global.vis.Network.reset();
        networkOnSpy.reset();
        networkSetDataSpy.reset();
        networkAddEdgeModeSpy.reset();
        networkDisableEditModeSpy.reset();
        networkGetNodeAtSpy.reset();
        networkSelectNodesSpy.reset();
        networkUnselectAllSpy.reset();
        networkGetEdgeAtSpy.reset();
        networkGetConnectedNodes.reset();
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
        const wrapper = shallow(<MicroserviceMindmap {...props} />, {lifecycleExperimental: true});

        const expectedAllNodes = [
            {
                id: "foo-service",
                label: "foo-service",
                group: "microservice"
            },
            {
                id: "bar-consumer",
                label: "bar-consumer",
                isExternal: true,
                consumes: [
                    {"target": "foo-service", "type": "REST"}
                ],
                group: "external"
            }
        ]

        const expectedEdges = [
            {
                from: "bar-consumer",
                to: "foo-service",
                label: "REST",
                font: {align: 'middle'}
            }
        ]

        sinon.assert.calledTwice(global.vis.DataSet);
        sinon.assert.calledWith(global.vis.DataSet, expectedAllNodes);
        sinon.assert.calledWith(global.vis.DataSet, expectedEdges);

        sinon.assert.calledOnce(global.vis.Network);

        chai.expect(global.vis.Network.args[0][2].nodes.borderWidth).to.equal(2);
        chai.expect(global.vis.Network.args[0][2].edges.width).to.equal(2);
        chai.expect(global.vis.Network.args[0][2].layout.randomSeed).to.equal(2);
        chai.expect(global.vis.Network.args[0][2].groups.microservice.color.background).to.equal("#bef24d");
        chai.expect(global.vis.Network.args[0][2].groups.external.color.background).to.equal("#f2d12d");

        sinon.assert.callCount(networkOnSpy, 5);
        sinon.assert.calledWith(networkOnSpy, "selectNode", sinon.match.func);
        sinon.assert.calledWith(networkOnSpy, "oncontext"); // we did not define a handler function in this test!
        sinon.assert.calledWith(networkOnSpy, "click");
        sinon.assert.calledWith(networkOnSpy, "select");

        sinon.assert.calledWith(windowAddEventListenerSpy, "resize", sinon.match.func);
    });

    it('highlights services that are missing a required property', function () {

        const props = createProps();
        props.serviceRequiredProperties = ['consumes'];

        shallow(<MicroserviceMindmap {...props} />, {lifecycleExperimental: true});

        const expectedAllNodes = [
            {
                id: "foo-service",
                label: "foo-service",
                group: "microservice",
                shadow: {
                    color: "#e50f03"
                }
            },
            {
                id: "bar-consumer",
                label: "bar-consumer",
                isExternal: true,
                consumes: [
                    {"target": "foo-service", "type": "REST"}
                ],
                group: "external",
            }
        ]

        sinon.assert.calledWith(global.vis.DataSet, expectedAllNodes);
    });

    it('only creates vis network once', function () {

        const props = createProps();

        const wrapper = shallow(<MicroserviceMindmap {...props} />, {lifecycleExperimental: true});

        sinon.assert.calledTwice(global.vis.DataSet);
        sinon.assert.calledOnce(global.vis.Network);

        global.vis.DataSet.reset();
        global.vis.Network.reset();

        props.microservices.push({id: "fart-service"});

        wrapper.setProps(props);

        sinon.assert.calledTwice(global.vis.DataSet);
        sinon.assert.calledOnce(networkSetDataSpy);
        sinon.assert.notCalled(global.vis.Network);
    });

    it('adding a connection does not re-draw the graph', function () {

        var props = createProps();

        const wrapper = shallow(<MicroserviceMindmap {...props} />);

        /* we force a call to componentDidUpdate() here, because shallow-rendering does not call componentDidMount()

         we cannot use {lifecycleExperimental: true} in this test case (which would call componentDidMount()),
         because it does not update the components props if shouldComponentUpdate returns false

         see https://github.com/airbnb/enzyme/issues/805
         */
        wrapper.instance().forceUpdate();

        global.vis.DataSet.reset();
        global.vis.Network.reset();

        props.menuMode = "ADD_LINK";
        wrapper.setProps(props);

        sinon.assert.calledOnce(networkAddEdgeModeSpy);
        sinon.assert.notCalled(global.vis.DataSet);
        sinon.assert.notCalled(networkSetDataSpy);
        sinon.assert.notCalled(global.vis.Network);

        props.menuMode = undefined;
        wrapper.setProps(props);

        sinon.assert.calledOnce(networkDisableEditModeSpy);
        sinon.assert.notCalled(global.vis.DataSet);
        sinon.assert.notCalled(networkSetDataSpy);
        sinon.assert.notCalled(global.vis.Network);
    });

    it('opens context menu on right-click on a service, and selects the service', function () {

        var props = createProps();

        const wrapper = shallow(<MicroserviceMindmap {...props}/>);
        wrapper.instance().forceUpdate();

        chai.expect(wrapper.type()).to.equal('div');

        chai.expect(oncontextEventHandler).to.be.a('function');

        const domPointer = 'i_am_a_top_left_value_pair';

        const eventParams = {
            pointer: {
                DOM: domPointer
            },
            event: {
                preventDefault: sinon.spy(),
                clientY: 'clientY',
                clientX: 'clientX'
            }
        }

        networkGetNodeAtSpy.withArgs(domPointer).returns('my_node_id');

        oncontextEventHandler(eventParams);

        sinon.assert.calledOnce(props.onContextMenuOpen);
        sinon.assert.calledWith(props.onContextMenuOpen, {
            top: 'clientY',
            left: 'clientX',
            nodeId: 'my_node_id',
            edgeFromId: undefined,
            edgeToId: undefined
        });

        sinon.assert.calledOnce(networkSelectNodesSpy);
        sinon.assert.calledWith(networkSelectNodesSpy, ['my_node_id']);

        sinon.assert.calledOnce(props.onSelectMicroserviceNode);
        sinon.assert.calledWith(props.onSelectMicroserviceNode, {
            nodes: ['my_node_id']
        });
    });

    it('opens context menu on right-click on a link, and unselects all services', function () {

        var props = createProps();

        const wrapper = shallow(<MicroserviceMindmap {...props}/>);
        wrapper.instance().forceUpdate();

        chai.expect(wrapper.type()).to.equal('div');

        chai.expect(oncontextEventHandler).to.be.a('function');

        const domPointer = 'i_am_a_top_left_value_pair';

        const eventParams = {
            pointer: {
                DOM: domPointer
            },
            event: {
                preventDefault: sinon.spy(),
                clientY: 'clientY',
                clientX: 'clientX'
            }
        }

        networkGetNodeAtSpy.withArgs(domPointer).returns(undefined);
        networkGetEdgeAtSpy.withArgs(domPointer).returns('my_link_id');
        networkGetConnectedNodes.withArgs('my_link_id').returns(['my_from_id', 'my_to_id']);

        oncontextEventHandler(eventParams);

        sinon.assert.calledOnce(props.onContextMenuOpen);
        sinon.assert.calledWith(props.onContextMenuOpen, {
            top: 'clientY',
            left: 'clientX',
            nodeId: undefined,
            edgeFromId: 'my_from_id',
            edgeToId: 'my_to_id'
        });

        sinon.assert.calledOnce(networkUnselectAllSpy);
    });

    it('closes context menu on left-click', function () {

        var props = createProps();

        const wrapper = shallow(<MicroserviceMindmap {...props}/>);
        wrapper.instance().forceUpdate();

        chai.expect(wrapper.type()).to.equal('div');

        chai.expect(clickEventHandler).to.be.a('function');

        clickEventHandler({
            event: {
                srcEvent: {}
            }
        });

        sinon.assert.calledOnce(props.onContextMenuOpen);
        sinon.assert.calledWith(props.onContextMenuOpen, {
            top: -1,
            left: -1,
            nodeId: undefined
        });
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
                {"target": "foo-service", "type": "REST"}
            ]
        }
    ];

    const props = {
        onSelectMicroserviceNode: sinon.spy(),
        onAddLink: sinon.spy(),
        onContextMenuOpen: sinon.spy(),
        microservices: microservices,
        serviceRequiredProperties: []
    };

    return props;
}
