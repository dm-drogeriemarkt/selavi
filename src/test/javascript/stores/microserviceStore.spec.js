import sinon from 'sinon';
import chai from 'chai';
import { updateStore } from '../../../main/javascript/stores/microserviceStore';

describe('microserviceStore', () => {

  beforeEach(() => {
    sinon.stub(URLSearchParams.prototype, 'get');
  });

  afterEach(() => {
    URLSearchParams.prototype.get.restore();
  });

  describe('FETCH_AVAILABLE_STAGES_SUCCESS', () => {

    it('pre-selects stage from url search param if set', () => {

      URLSearchParams.prototype.get.withArgs('stage').returns('foobar');

      const newState = updateStore({}, {
        type: 'FETCH_AVAILABLE_STAGES_SUCCESS',
        response: { entity: ['dev', 'stage', 'foobar'] }
      });

      chai.expect(newState.stage).to.equal('foobar');
    });
    it('pre-selects dev stage if present', () => {

      const newState = updateStore({}, {
        type: 'FETCH_AVAILABLE_STAGES_SUCCESS',
        response: { entity: ['stage', 'foobar', 'dev'] }
      });

      chai.expect(newState.stage).to.equal('dev');
    });
    it('pre-selects first stage in list otherwise', () => {

      const newState = updateStore({}, {
        type: 'FETCH_AVAILABLE_STAGES_SUCCESS',
        response: { entity: ['stage', 'foobar', 'prod'] }
      });

      chai.expect(newState.stage).to.equal('stage');
    });
  });
});
