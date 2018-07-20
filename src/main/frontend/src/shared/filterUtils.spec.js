import chai from 'chai';

import { isFilterHit, shouldFilterOut } from './filterUtils';

describe('filterUtils', () => {
  describe('shouldFilterOut', () => {
    it('returns false if filter string is empty', () => {

      const service = {
        label: 'foobar'
      };

      const filterString = '';

      const result = shouldFilterOut(service, filterString);

      chai.expect(result).to.be.false;
    });
    it('returns false if label matches filter string, and its the only field', () => {

      const service = {
        label: 'foobar'
      };

      const filterString = 'foo';

      const result = shouldFilterOut(service, filterString);

      chai.expect(result).to.be.false;
    });
    it('returns true if label does not match filter string, and its the only field', () => {

      const service = {
        label: 'foobar'
      };

      const filterString = 'dickbutt';

      const result = shouldFilterOut(service, filterString);

      chai.expect(result).to.be.true;
    });
    it('returns false if tags matches filter string, and its the only field', () => {

      const service = {
        tags: 'team foo'
      };

      const filterString = 'foo';

      const result = shouldFilterOut(service, filterString);

      chai.expect(result).to.be.false;
    });
    it('returns true if tags does not match filter string, and its the only field', () => {

      const service = {
        tags: 'team bar'
      };

      const filterString = 'foo';

      const result = shouldFilterOut(service, filterString);

      chai.expect(result).to.be.true;
    });
    it('returns true if the service contains none of the searched fields', () => {

      const service = {
        id: 'foobar',
        description: 'this is service foobar'
      };

      const filterString = 'foo';

      const result = shouldFilterOut(service, filterString);

      chai.expect(result).to.be.true;
    });
    it('returns true if none of the searched fields contains a string', () => {

      const service = {
        tags: {
          teamName: 'team foo'
        }
      };

      const filterString = 'foo';

      const result = shouldFilterOut(service, filterString);

      chai.expect(result).to.be.true;
    });
    it('throws an exception when filterString is defined, but not a string', () => {

      const service = {
        label: 'foobar'
      };

      const filterString = {
        value: 'foo'
      };

      chai.expect(() => {
        shouldFilterOut(service, filterString);
      }).to.throw('filterString.toLowerCase is not a function');
    });
  });

  describe('isFilterHit', () => {
    it('returns false if fieldName is not one of the searched fields', () => {
      const result = isFilterHit('description');

      chai.expect(result).to.be.false;
    });
    it('returns true if fieldValue matches filterString', () => {
      const result = isFilterHit('label', 'foobar', 'foo');

      chai.expect(result).to.be.true;
    });
    it('returns false if fieldValue does not match filterString', () => {
      const result = isFilterHit('label', 'foobar', 'baz');

      chai.expect(result).to.be.false;
    });
    it('returns false if filterString is undefined', () => {
      const result = isFilterHit('label', 'foobar', undefined);

      chai.expect(result).to.be.false;
    });
    it('returns false if filterString is empty', () => {
      const result = isFilterHit('label', 'foobar', '');

      chai.expect(result).to.be.false;
    });
    it('throws an exception when filterString parameter is defined, but not a string', () => {
      const filterString = {
        value: 'foo'
      };

      chai.expect(() => {
        isFilterHit('label', 'foobar', filterString);
      }).to.throw('filterString.toLowerCase is not a function');
    });
  });
});
