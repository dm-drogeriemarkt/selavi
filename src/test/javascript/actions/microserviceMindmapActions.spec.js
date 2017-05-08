import chai from "chai";
import {
    onSelectMicroserviceNode,
    onContextMenuOpen,
    onAddLink
} from "../../../main/javascript/actions/microserviceMindmapActions";
const sinon = require('sinon');

const rest = require('rest');

describe('microserviceMindmapActions', function () {

    describe('onSelectMicroserviceNode', function() {
        var thenHandler, errorHandler, clientStub;

        before(function() {
            const thenSpy = function(handlerParam, errorHandlerParam) {
                thenHandler = handlerParam;
                errorHandler = errorHandlerParam;
            }
            clientStub = sinon.stub().returns({
                then: sinon.spy(thenSpy)
            });

            sinon.stub(rest, 'wrap').returns(clientStub);
        });

        afterEach(function() {
            clientStub.reset();

            // cleanup, make sure tests don't interfere with each other
            thenHandler = undefined;
            errorHandler = undefined;
            rest.wrap.reset()
        })

        after(function() {
            rest.wrap.restore();
        });

        it('fetches bitbucket committers from backend, and dispatches FETCH_MICROSERVICES_SUCCESS event', function() {
            const dispatchSpy = sinon.spy();

            const selectMicroserviceNodeFn = onSelectMicroserviceNode({
                nodes: ['my_service_id']
            });
            selectMicroserviceNodeFn(dispatchSpy);

            sinon.assert.calledOnce(clientStub);
            sinon.assert.calledWith(clientStub, {method: 'GET', path: "/selavi/bitbucket/my_service_id"});

            thenHandler('response_to_get_bitbucket_committers');

            sinon.assert.calledOnce(dispatchSpy);
            sinon.assert.calledWith(dispatchSpy, { response: 'response_to_get_bitbucket_committers', type: 'MICROSERVICE_NODE_SELECTED', selectedServiceId: 'my_service_id' });
        });
    });

    describe('onContextMenuOpen', function() {
        it('dispatches CONTEXT_MENU_OPEN for services', function() {
            const result = onContextMenuOpen({nodeId: 42, top: 100, left: 200});

            chai.expect(result.type).to.equal('CONTEXT_MENU_OPEN');
            chai.expect(result.contextMenuServiceId).to.equal(42);
            chai.expect(result.contextMenuFromId).to.be.undefined;
            chai.expect(result.contextMenuToId).to.be.undefined;
            chai.expect(result.top).to.equal(100);
            chai.expect(result.left).to.equal(200);
        });

        it('dispatches CONTEXT_MENU_OPEN for relations', function() {
            const result = onContextMenuOpen({edgeFromId: 42, edgeToId: 43, top: 100, left: 200});

            chai.expect(result.type).to.equal('CONTEXT_MENU_OPEN');
            chai.expect(result.contextMenuServiceId).to.be.undefined;
            chai.expect(result.contextMenuFromId).to.equal(42);
            chai.expect(result.contextMenuToId).to.equal(43);
            chai.expect(result.top).to.equal(100);
            chai.expect(result.left).to.equal(200);
        });

        it('dispatches CONTEXT_MENU_OPEN when nothing is selected', function() {
            const result = onContextMenuOpen({top: 100, left: 200});

            chai.expect(result.type).to.equal('CONTEXT_MENU_OPEN');
            chai.expect(result.contextMenuServiceId).to.be.undefined;
            chai.expect(result.contextMenuFromId).to.be.undefined;
            chai.expect(result.contextMenuToId).to.be.undefined;
            chai.expect(result.top).to.equal(-1);
            chai.expect(result.left).to.equal(-1);
        });
    });

    describe('onAddLink', function() {
        it('dispatches ADD_RELATION', function() {
            const dispatchSpy = sinon.spy();

            const addLinkFn = onAddLink({
                from: 'my_service_id', to: 'my_target_id'
            });
            addLinkFn(dispatchSpy);

            sinon.assert.calledOnce(dispatchSpy);
            sinon.assert.calledWith(dispatchSpy, { type: 'ADD_RELATION', consumerId: 'my_service_id', consumedServiceId: 'my_target_id' });
        });
    });
});