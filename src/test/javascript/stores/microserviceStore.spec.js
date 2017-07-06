var sinon = require('sinon');
import chai from 'chai';

describe('microserviceStore', function () {

    beforeEach(function() {
        sinon.stub(URLSearchParams.prototype, 'get');
    });

    afterEach(function() {
        URLSearchParams.prototype.get.restore();
    });

    it('parses filter string from url search param for initial state', function () {

        URLSearchParams.prototype.get.withArgs('filter').returns('foobar');

        const store = require("../../../main/javascript/stores/microserviceStore");

        const initialState = store.updateStore(undefined, {type: "no_op"});

        chai.expect(initialState.filterString).to.equal("foobar");
    });

    describe('FETCH_AVAILABLE_STAGES_SUCCESS', function () {

        var store;

        beforeEach(function() {
            store = require("../../../main/javascript/stores/microserviceStore");
        });

        it('pre-selects stage from url search param if set', function () {

            URLSearchParams.prototype.get.withArgs('stage').returns('foobar');

            const newState = store.updateStore({}, {type: 'FETCH_AVAILABLE_STAGES_SUCCESS', response: {entity: ['dev', 'stage', 'foobar']}});

            chai.expect(newState.stage).to.equal("foobar");
        });
        it('pre-selects dev stage if present', function () {

            const newState = store.updateStore({}, {type: 'FETCH_AVAILABLE_STAGES_SUCCESS', response: {entity: ['stage', 'foobar', 'dev']}});

            chai.expect(newState.stage).to.equal("dev");
        });
        it('pre-selects first stage in list otherwise', function () {

            const newState = store.updateStore({}, {type: 'FETCH_AVAILABLE_STAGES_SUCCESS', response: {entity: ['stage', 'foobar', 'prod']}});

            chai.expect(newState.stage).to.equal("stage");
        });
    });
});