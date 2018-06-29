import rest from 'rest';
import sinon from 'sinon';
import onStageSelected from '../../../main/javascript/actions/stageSelectorActions';

describe('stageSelectorActions', () => {
  describe('onStageSelected', () => {
    let thenHandler;
    let clientStub;

    before(() => {
      const thenSpy = (handlerParam) => {
        thenHandler = handlerParam;
      };
      clientStub = sinon.stub().returns({
        then: sinon.spy(thenSpy)
      });
      const wrapStub = {
        wrap: sinon.stub().returns(clientStub)
      };

      sinon.stub(rest, 'wrap').returns(wrapStub);
    });

    afterEach(() => {
      clientStub.reset();

      // cleanup, make sure tests don't interfere with each other
      thenHandler = undefined;
      rest.wrap.reset();
    });

    after(() => {
      rest.wrap.restore();
    });

    it('requests services for given stage, and passes stage to dispatched action', () => {
      const dispatchSpy = sinon.spy();

      const submitFn = onStageSelected('dev');
      submitFn(dispatchSpy);

      sinon.assert.calledOnce(clientStub);
      sinon.assert.calledWith(clientStub, { path: '/selavi/services/dev' });

      thenHandler('response_to_get_services');

      sinon.assert.calledOnce(dispatchSpy);
      sinon.assert.calledWith(dispatchSpy, {
        response: 'response_to_get_services',
        type: 'FETCH_MICROSERVICES_SUCCESS',
        stage: 'dev'
      });
    });
  });
});
