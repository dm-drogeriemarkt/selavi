const rest = require('rest');

const sinon = require('sinon');
import chai from 'chai';

import { onCancel, onSubmit } from '../../../main/javascript/actions/loginDialogActions';

describe('loginDialogActions', function () {
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

        it('POSTs /login request and dispatches LOGIN_SUCCESS event on success', function() {
            const dispatchSpy = sinon.spy();

            const submitFn = onSubmit({
                entity: {
                    username: 'foo',
                    password: 'bar'
                }
            });
            submitFn(dispatchSpy);

            sinon.assert.calledOnce(clientStub);
            sinon.assert.calledWith(clientStub, {
                entity: { password: "bar", username: "foo" },
                method: 'POST',
                path: "/selavi/login",
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });

            thenHandler('response_to_login');

            sinon.assert.calledOnce(dispatchSpy);
            sinon.assert.calledWith(dispatchSpy, { loggedInUser: 'foo', type: "LOGIN_SUCCESS" });
        });

        it('POSTs /login request and dispatches LOGIN_FAILED event on error', function() {
            const dispatchSpy = sinon.spy();

            const submitFn = onSubmit({
                entity: {
                    username: 'foo',
                    password: 'baz'
                }
            });
            submitFn(dispatchSpy);

            sinon.assert.calledOnce(clientStub);
            sinon.assert.calledWith(clientStub, {
                entity: { password: "baz", username: "foo" },
                method: 'POST',
                path: "/selavi/login",
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });

            errorHandler({
                entity: {
                    message: 'heute leider nur fuer stammgaeste'
                }
            });

            sinon.assert.calledOnce(dispatchSpy);
            sinon.assert.calledWith(dispatchSpy, { message: 'heute leider nur fuer stammgaeste', type: "LOGIN_FAILED" });
        });
    });
});