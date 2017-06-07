var sinon = require('sinon');

import React from "react";
import chai from "chai";
import {shallow} from "enzyme";
import {MicroserviceFilterbox} from "../../../main/javascript/components/microserviceFilterbox";

describe('<MicroserviceFilterbox/>', function () {

    it('displays application name', function () {
        const props = createProps();

        const wrapper = shallow(<MicroserviceFilterbox {...props}/>);
        chai.expect(wrapper.find('ToolbarTitle').props().text).to.equal('SeLaVi - Service Landscape Visualizer');
    });

    it('displays only login button in menu when no user is logged in', function () {
        const props = createProps();

        const wrapper = shallow(<MicroserviceFilterbox {...props}/>);

        chai.expect(wrapper.find('MenuItem').length).to.equal(1);
        chai.expect(wrapper.find('MenuItem').at(0).props().primaryText).to.equal('Login');
    });

    it('displays logout, add service & add link buttons in menu when a user is logged in', function () {
        const props = createProps();
        props.loggedInUser = "my_user_id";

        const wrapper = shallow(<MicroserviceFilterbox {...props}/>);

        chai.expect(wrapper.find('MenuItem').length).to.equal(3);
        chai.expect(wrapper.find('MenuItem').at(0).props().primaryText).to.equal('Logout');
        chai.expect(wrapper.find('MenuItem').at(1).props().primaryText).to.equal('Add Service');
        chai.expect(wrapper.find('MenuItem').at(2).props().primaryText).to.equal('Add link');
    });
});

function createProps() {
    const props = {
        loggedInUser: undefined,
        onLogin: sinon.spy(),
        onLogout: sinon.spy(),
        onAddLink: sinon.spy(),
        onAddService: sinon.spy(),
        onType: sinon.spy()
    };

    return props;
}
