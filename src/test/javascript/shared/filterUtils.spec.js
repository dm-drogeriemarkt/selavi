var sinon = require('sinon');

import chai from 'chai';

import { shouldFilterOut } from '../../../main/javascript/shared/filterUtils';

describe('filterUtils', function () {
    describe('shouldFilterOut', function () {
        it('returns false if label matches filter string', function () {

            const service = {
                label: 'foobar'
            };

            const filterString = 'foo';

            const result = shouldFilterOut(service, filterString);

            chai.expect(result).to.be.false;
        });
        it('returns true if label does not match filter string', function () {

            const service = {
                label: 'foobar'
            };

            const filterString = 'dickbutt';

            const result = shouldFilterOut(service, filterString);

            chai.expect(result).to.be.true;
        });
    });
});