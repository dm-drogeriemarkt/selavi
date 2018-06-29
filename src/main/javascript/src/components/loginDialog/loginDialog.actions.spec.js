import rest from 'rest';
import sinon from 'sinon';
import chai from 'chai';

import { onCancel, onSubmit } from './loginDialog.actions';

describe('loginDialogActions', () => {
  describe('onCancel', () => {
    it('dispatches CANCEL_MENU_ACTION', () => {
      const result = onCancel();

      chai.expect(result.type)
        .to
        .equal('CANCEL_MENU_ACTION');
    });
  });

  describe('onSubmit', () => {
    let thenHandler;
    let errorHandler;
    let clientStub;

    before(() => {
      const thenSpy = (handlerParam, errorHandlerParam) => {
        thenHandler = handlerParam;
        errorHandler = errorHandlerParam;
      };
      clientStub = sinon.stub()
        .returns({
          then: sinon.spy(thenSpy)
        });
      const wrapStub = {
        wrap: sinon.stub()
          .returns(clientStub)
      };

      sinon.stub(rest, 'wrap')
        .returns(wrapStub);
    });

    afterEach(() => {
      clientStub.reset();

      // cleanup, make sure tests don't interfere with each other
      thenHandler = undefined;
      errorHandler = undefined;
      rest.wrap.reset();
    });

    after(() => {
      rest.wrap.restore();
    });

    it('POSTs /login request and dispatches LOGIN_SUCCESS event on success', () => {
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
        entity: { password: 'bar', username: 'foo' },
        method: 'POST',
        path: '/selavi/login',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const loggedInUser = {
        displayName: 'foo'
      };

      thenHandler({
        entity: loggedInUser
      });

      sinon.assert.calledOnce(dispatchSpy);
      sinon.assert.calledWith(dispatchSpy, { loggedInUser, type: 'LOGIN_SUCCESS' });
    });

    it('POSTs /login request and dispatches LOGIN_FAILED event on error', () => {
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
        entity: { password: 'baz', username: 'foo' },
        method: 'POST',
        path: '/selavi/login',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      errorHandler({
        entity: {
          message: 'heute leider nur fuer stammgaeste'
        }
      });

      sinon.assert.calledOnce(dispatchSpy);
      sinon.assert.calledWith(dispatchSpy, {
        message: 'heute leider nur fuer stammgaeste',
        type: 'LOGIN_FAILED'
      });
    });
  });
});
