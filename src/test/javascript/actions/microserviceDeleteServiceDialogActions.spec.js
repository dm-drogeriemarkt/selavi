const rest = require('rest');

const sinon = require('sinon');
import chai from 'chai';

import { onCancel, onSubmit } from '../../../main/javascript/actions/microserviceDeleteServiceDialogActions';

describe('microserviceDeleteServiceDialogActions', function () {
    describe('onCancel', function() {
        it('dispatches CANCEL_MENU_ACTION', function() {
            const result = onCancel();

            chai.expect(result.type).to.equal('CANCEL_MENU_ACTION');
        });
    });

    describe('onSubmit', function() {
        var thenHandler, errorHandler, clientStub;

        before(function() {
            const thenSpy = function(handlerParam, errorHandlerParam) {
                thenHandler = handlerParam;
                errorHandler = errorHandlerParam;
            }
            clientStub = sinon.stub().returns({
                then: sinon.spy(thenSpy)
            });
            const wrapStub = {
                wrap: sinon.stub().returns(clientStub)
            }

            sinon.stub(rest, 'wrap').returns(wrapStub);
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

        it('makes backed delete request, fetches services from backend on success, and dispatches FETCH_MICROSERVICES_SUCCESS event', function() {
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