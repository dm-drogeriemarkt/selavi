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

    it('displays user name and avatar when user is logged in', function () {
        const props = createProps();
        props.loggedInUser = {
            displayName: "my_user_id",
            thumbnailPhoto: "i_am_a_byte_array"
        };

        const wrapper = shallow(<MicroserviceFilterbox {...props}/>);
        chai.expect(wrapper.find('Avatar').props().src).to.equal('data:image/png;base64,i_am_a_byte_array');
        chai.expect(wrapper.find('ToolbarGroup').at(0).childAt(1).text()).to.equal('my_user_id');
    });

    it('displays fallback icon when user has no photo', function () {
        const props = createProps();
        props.loggedInUser = {
            displayName: "my_user_id",
            thumbnailPhoto: undefined
        };

        const wrapper = shallow(<MicroserviceFilterbox {...props}/>);
        chai.expect(wrapper.find('Avatar').props().icon.type.displayName).to.equal('SocialSentimentVerySatisfied');
        chai.expect(wrapper.find('ToolbarGroup').at(0).childAt(1).text()).to.equal('my_user_id');
    });


    it('displays login & share link button in menu when no user is logged in', function () {
        const props = createProps();

        const wrapper = shallow(<MicroserviceFilterbox {...props}/>);

        chai.expect(wrapper.find('MenuItem').length).to.equal(2);
        chai.expect(wrapper.find('MenuItem').at(0).props().primaryText).to.equal('Login');
        chai.expect(wrapper.find('MenuItem').at(1).props().primaryText).to.equal('Share link');
    });

    it('displays logout, add service, add link & share link buttons in menu when a user is logged in', function () {
        const props = createProps();
        props.loggedInUser = "my_user_id";

        const wrapper = shallow(<MicroserviceFilterbox {...props}/>);

        chai.expect(wrapper.find('MenuItem').length).to.equal(4);
        chai.expect(wrapper.find('MenuItem').at(0).props().primaryText).to.equal('Logout');
        chai.expect(wrapper.find('MenuItem').at(1).props().primaryText).to.equal('Add Service');
        chai.expect(wrapper.find('MenuItem').at(2).props().primaryText).to.equal('Add link');
        chai.expect(wrapper.find('MenuItem').at(3).props().primaryText).to.equal('Share link');
    });

    it('shows selavi share link in alert dialog', function () {
        const props = createProps();
        props.filterString = "foobar";
        props.stage = "baz";

        const wrapper = shallow(<MicroserviceFilterbox {...props}/>);

        chai.expect(wrapper.find('Dialog').at(0).props().open).to.equal(false);

        wrapper.find('MenuItem').at(1).simulate('touchTap');

        chai.expect(wrapper.find('Dialog').at(0).props().open).to.equal(true);
        chai.expect(wrapper.find('Dialog').find('span').text()).to.equal("http://localhost/?stage=baz&filter=foobar")
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
