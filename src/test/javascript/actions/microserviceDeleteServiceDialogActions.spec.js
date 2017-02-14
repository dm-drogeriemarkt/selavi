const rest = require('rest');

const sinon = require('sinon');
import chai from 'chai';

import { onCancel, onSubmit } from '../../../main/javascript/actions/microserviceDeleteServiceDialogActions';

describe('filterUtils', function () {
    describe('onCancel', function() {
        it('dispatches CANCEL_MENU_ACTION', function() {
            const result = onCancel();

            chai.expect(result.type).to.equal('CANCEL_MENU_ACTION');
        });
    });

    describe('onSubmit', function() {
        it('makes backed delete request, fetches services from backend on success, and dispatches FETCH_MICROSERVICES_SUCCESS event', function() {
            var thenHandler;

            const thenSpy = function(handler) {
                thenHandler = handler;
            }
            const clientStub = sinon.stub().returns({
                then: sinon.spy(thenSpy)
            });
            const wrapStub = {
                wrap: sinon.stub().returns(clientStub)
            }

            // TODO: not sure why 'rest' doesn't need to be stubbed, see if maybe it implements the same api as sinon (returns method)
            rest.wrap.returns(wrapStub);

            const dispatchSpy = sinon.spy();

            const submitFn = onSubmit({
                type: 'DELETE_SERVICE'
            });
            submitFn(dispatchSpy);

            sinon.assert.calledOnce(clientStub);
            sinon.assert.calledWith(clientStub, { method: 'DELETE', path: "/selavi/services/undefined" });

            thenHandler('response_to_delete_service');

            sinon.assert.calledTwice(clientStub);
            sinon.assert.calledWith(clientStub, { path: "/selavi/services" });

            // different handler function than before!
            thenHandler('response_to_get_services');

            sinon.assert.calledOnce(dispatchSpy);
            sinon.assert.calledWith(dispatchSpy, { response: 'response_to_get_services', type: "FETCH_MICROSERVICES_SUCCESS" });
        });

        it('makes backed delete request and dispatches DELETE_SERVICE_FAILED event on error', function() {
            var thenHandler, errorHandler;

            const thenSpy = function(handlerParam, errorHandlerParam) {
                thenHandler = handlerParam;
                errorHandler = errorHandlerParam;
            }
            const clientStub = sinon.stub().returns({
                then: sinon.spy(thenSpy)
            });
            const wrapStub = {
                wrap: sinon.stub().returns(clientStub)
            }

            // TODO: not sure why 'rest' doesn't need to be stubbed, see if maybe it implements the same api as sinon (returns method)
            rest.wrap.returns(wrapStub);

            const dispatchSpy = sinon.spy();

            const submitFn = onSubmit({
                type: 'DELETE_SERVICE'
            });
            submitFn(dispatchSpy);

            sinon.assert.calledOnce(clientStub);
            sinon.assert.calledWith(clientStub, { method: 'DELETE', path: "/selavi/services/undefined" });

            errorHandler({ entity: {message: 'response_to_delete_failure'}});

            sinon.assert.calledOnce(dispatchSpy);
            sinon.assert.calledWith(dispatchSpy, { message: 'response_to_delete_failure', type: "DELETE_SERVICE_FAILED" });
        });
    });
});