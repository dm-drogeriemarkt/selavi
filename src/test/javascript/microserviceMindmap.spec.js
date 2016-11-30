import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import MicroserviceMindmap from '../../main/javascript/microserviceMindmap';

describe('<MicroserviceMindmap/>', function () {
    it('can be instantiated', function () {

        const wrapper = shallow(<MicroserviceMindmap />);

        expect(wrapper.type()).to.equal('div');
    });
});