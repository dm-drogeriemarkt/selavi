import sinon from 'sinon';
import chai from 'chai';
import microserviceStore from '../../../main/javascript/stores/microserviceStore';

describe('microserviceStore', () => {

  beforeEach(() => {
    sinon.stub(URLSearchParams.prototype, 'get');
  });

  afterEach(() => {
    URLSearchParams.prototype.get.restore();
  });

  it('parses filter string from url search param for initial state', () => {

    URLSearchParams.prototype.get.withArgs('filter').returns('foobar');

    const store = microserviceStore;

    const initialState = store.updateStore(undefined, { type: 'no_op' });

    chai.expect(initialState.filterString).to.equal('foobar');
  });

  describe('FETCH_AVAILABLE_STAGES_SUCCESS', () => {

    let store;

    beforeEach(() => {
      store = microserviceStore;
    });

    it('pre-selects stage from url search param if set', () => {

      URLSearchParams.prototype.get.withArgs('stage').returns('foobar');

      const newState = store.updateStore({}, {
        type: 'FETCH_AVAILABLE_STAGES_SUCCESS',
        response: { entity: ['dev', 'stage', 'foobar'] }
      });

      chai.expect(newState.stage).to.equal('foobar');
    });
    it('pre-selects dev stage if present', () => {

      const newState = store.updateStore({}, {
        type: 'FETCH_AVAILABLE_STAGES_SUCCESS',
        response: { entity: ['stage', 'foobar', 'dev'] }
      });

      chai.expect(newState.stage).to.equal('dev');
    });
    it('pre-selects first stage in list otherwise', () => {

      const newState = store.updateStore({}, {
        type: 'FETCH_AVAILABLE_STAGES_SUCCESS',
        response: { entity: ['stage', 'foobar', 'prod'] }
      });

      chai.expect(newState.stage).to.equal('stage');
    });
  });

  describe('HIDE_SERVICE / UNHIDE_SERVICES', () => {

    let store;

    beforeEach(() => {
      store = microserviceStore;
    });

    it('hides services', () => {

      const initialState = {
        microservices: [{ id: 1337 }],
        hiddenMicroServices: []
      };

      const firstState = store.updateStore(initialState, {
        type: 'CONTEXT_MENU_OPEN',
        contextMenuServiceId: 1337
      });

      chai.expect(firstState.contextMenuServiceId).to.equal(1337);

      const secondState = store.updateStore(firstState, {
        type: 'HIDE_SERVICE'
      });

      chai.expect(secondState.hiddenMicroServices).to.have.lengthOf(1);
      chai.expect(secondState.hiddenMicroServices[0].id).to.equal(1337);
      chai.expect(secondState.microservices).to.have.lengthOf(0);
    });

    it('shows hidden services', () => {

      const initialState = {
        microservices: [],
        hiddenMicroServices: [{ id: 1337 }]
      };

      const firstState = store.updateStore(initialState, {
        type: 'UNHIDE_SERVICES'
      });

      chai.expect(firstState.microservices).to.have.lengthOf(1);
      chai.expect(firstState.microservices[0].id).to.equal(1337);
      chai.expect(firstState.hiddenMicroServices).to.have.lengthOf(0);
    });
  });
});
