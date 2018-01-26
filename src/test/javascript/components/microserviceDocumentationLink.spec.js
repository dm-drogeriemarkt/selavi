import React from 'react';
import chai from 'chai';
import { shallow } from 'enzyme';
import MicroserviceDocumentationLink from '../../../main/javascript/components/microserviceDocumentationLink';


describe('<MicroserviceDocumentationLink/>', () => {

  it('check documentation link', () => {
    const wrapper = shallow(<MicroserviceDocumentationLink />);
    chai.expect(wrapper.text()).to.contains('Doku');
  });


});

