import React from 'react';
import chai from 'chai';
import {shallow} from 'enzyme';
import {MicroserviceDocumentationLink} from '../../../main/javascript/components/microserviceDocumentationLink';
import sinon from 'sinon';


describe('<MicroserviceDocumentationLink/>', function () {

    it('check documentation link', function () {
        const props = createProps();

        const wrapper = shallow(<MicroserviceDocumentationLink {...props} />);
        chai.expect(wrapper.text()).to.contains('Doku');
        chai.expect(wrapper.find('a').props().href).to.equal(props.frontendConfig.documentationUrl);
    });
});

function createProps() {
    return {
        loadFrontendConfig: sinon.spy(),
        frontendConfig: {
            documentationUrl: 'https://example.com/docu'
        }
    };
}
