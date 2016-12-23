var sinon = require('sinon');

import chai from 'chai';

import { shouldFilterOut, isFilterHit } from '../../../main/javascript/shared/filterUtils';

describe('filterUtils', function () {
    describe('shouldFilterOut', function () {
        it('returns false if filter string is empty', function () {

            const service = {
                label: 'foobar'
            };

            const filterString = '';

            const result = shouldFilterOut(service, filterString);

            chai.expect(result).to.be.false;
        });
        it('returns false if label matches filter string, and its the only field', function () {

            const service = {
                label: 'foobar'
            };

            const filterString = 'foo';

            const result = shouldFilterOut(service, filterString);

            chai.expect(result).to.be.false;
        });
        it('returns true if label does not match filter string, and its the only field', function () {

            const service = {
                label: 'foobar'
            };

            const filterString = 'dickbutt';

            const result = shouldFilterOut(service, filterString);

            chai.expect(result).to.be.true;
        });
        it('returns false if team matches filter string, and its the only field', function () {

            const service = {
                team: 'team foo'
            };

            const filterString = 'foo';

            const result = shouldFilterOut(service, filterString);

            chai.expect(result).to.be.false;
        });
        it('returns true if team does not match filter string, and its the only field', function () {

            const service = {
                team: 'team bar'
            };

            const filterString = 'foo';

            const result = shouldFilterOut(service, filterString);

            chai.expect(result).to.be.true;
        });
        it('returns true if the service contains none of the searched fields', function () {

            const service = {
                id: "foobar",
                description: "this is service foobar"
            };

            const filterString = 'foo';

            const result = shouldFilterOut(service, filterString);

            chai.expect(result).to.be.true;
        });
        it('returns true if none of the searched fields contains a string', function () {

            const service = {
                team: {
                    teamName: 'team foo'
                }
            };

            const filterString = 'foo';

            const result = shouldFilterOut(service, filterString);

            chai.expect(result).to.be.true;
        });
        it('throws an exception when filterString is defined, but not a string', function () {

            const service = {
                label: "foobar"
            };

            const filterString = {
                value: 'foo'
            };

            chai.expect(function() {
                shouldFilterOut(service, filterString)
            }).to.throw('filterString.toLowerCase is not a function');
        });
    });

    describe('isFilterHit', function () {
        it('returns false if fieldName is not one of the searched fields', function () {
            const result = isFilterHit("description");

            chai.expect(result).to.be.false;
        });
        it('returns true if fieldValue matches filterString', function () {
            const result = isFilterHit("label", "foobar", "foo");

            chai.expect(result).to.be.true;
        });
        it('returns false if fieldValue does not match filterString', function () {
            const result = isFilterHit("label", "foobar", "baz");

            chai.expect(result).to.be.false;
        });
        it('returns false if filterString is undefined', function () {
            const result = isFilterHit("label", "foobar", undefined);

            chai.expect(result).to.be.false;
        });
        it('returns false if filterString is empty', function () {
            const result = isFilterHit("label", "foobar", "");

            chai.expect(result).to.be.false;
        });
        it('throws an exception when filterString parameter is defined, but not a string', function () {
            const filterString = {
                value: 'foo'
            };

            chai.expect(function() {
                isFilterHit("label", "foobar", filterString)
            }).to.throw('filterString.toLowerCase is not a function');
        });
    });
});