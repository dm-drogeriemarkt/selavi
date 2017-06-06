var sinon = require('sinon');

import React from "react";
import chai from "chai";
import {shallow} from "enzyme";
import {MicroserviceDocumentationLink} from "../../../main/javascript/components/microserviceDocumentationLink";


describe('<MicroserviceDocumentationLink/>', function () {

    it('check documentation link', function () {
        const wrapper = shallow(<MicroserviceDocumentationLink />);
        chai.expect(wrapper.text()).to.contains('Doku');
    });


});

