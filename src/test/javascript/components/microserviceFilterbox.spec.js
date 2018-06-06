import sinon from 'sinon';
import React from 'react';
import chai from 'chai';
import {shallow} from 'enzyme';
import {MicroserviceFilterbox} from '../../../main/javascript/components/microserviceFilterbox';

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


    it('displays login, show versions & share link button in menu when no user is logged in', function () {
        const props = createProps();

        const wrapper = shallow(<MicroserviceFilterbox {...props}/>);

        chai.expect(wrapper.find('MenuItem').length).to.equal(3);
        chai.expect(wrapper.find('MenuItem').at(0).props().primaryText).to.equal('Login');
        chai.expect(wrapper.find('MenuItem').at(1).props().primaryText).to.equal('Show versions');
        chai.expect(wrapper.find('MenuItem').at(2).props().primaryText).to.equal('Share link');
    });

    it('displays logout, add service, add link, show versions & share link buttons in menu when a user is logged in', function () {
        const props = createProps();
        props.loggedInUser = "my_user_id";

        const wrapper = shallow(<MicroserviceFilterbox {...props}/>);

        chai.expect(wrapper.find('MenuItem').length).to.equal(5);
        chai.expect(wrapper.find('MenuItem').at(0).props().primaryText).to.equal('Logout');
        chai.expect(wrapper.find('MenuItem').at(1).props().primaryText).to.equal('Add Service');
        chai.expect(wrapper.find('MenuItem').at(2).props().primaryText).to.equal('Add link');
        chai.expect(wrapper.find('MenuItem').at(3).props().primaryText).to.equal('Show versions');
        chai.expect(wrapper.find('MenuItem').at(4).props().primaryText).to.equal('Share link');
    });

    it('displays show hidden services button when there are hidden services', function () {
        const props = createProps();
        props.hiddenMicroServices = [{ id: 1337 }];

        const wrapper = shallow(<MicroserviceFilterbox {...props}/>);

        chai.expect(wrapper.find('MenuItem').at(1).props().primaryText).to.equal('Show Hidden');
    });

    it('shows selavi share link in alert dialog', function () {
        const props = createProps();
        props.filterString = "foobar";
        props.stage = "baz";

        const wrapper = shallow(<MicroserviceFilterbox {...props}/>);

        chai.expect(wrapper.find('Dialog').at(0).props().open).to.equal(false);

        wrapper.find('MenuItem').at(2).simulate('touchTap');

        chai.expect(wrapper.find('Dialog').at(0).props().open).to.equal(true);
        chai.expect(wrapper.find('Dialog').find('span').text()).to.equal("http://localhost/?stage=baz&filter=foobar")
    });

    it('dispatches UNHIDE_SERVICE action', function () {
        const props = createProps();
        props.hiddenMicroServices = [{ id: 1337 }];

        const wrapper = shallow(<MicroserviceFilterbox {...props}/>);

        wrapper.find('MenuItem').at(1).simulate('touchTap');

        sinon.assert.calledOnce(props.onUnhideServices);
    });

    it('dispatches SHOW_VERSIONS action', function () {
        const props = createProps();

        const wrapper = shallow(<MicroserviceFilterbox {...props}/>);

        wrapper.find('MenuItem').at(1).simulate('touchTap');

        sinon.assert.calledOnce(props.onShowVersions);
    });

    it('dispatches HIDE_VERSIONS action', function () {
        const props = createProps();
        props.showVersions = true;

        const wrapper = shallow(<MicroserviceFilterbox {...props}/>);

        wrapper.find('MenuItem').at(1).simulate('touchTap');

        sinon.assert.calledOnce(props.onHideVersions);
    });
});

function createProps() {
    return {
        loggedInUser: undefined,
        showVersions: false,
        onLogin: sinon.spy(),
        onLogout: sinon.spy(),
        onShowVersions: sinon.spy(),
        onHideVersions: sinon.spy(),
        onAddLink: sinon.spy(),
        onAddService: sinon.spy(),
        onType: sinon.spy(),
        onUnhideServices: sinon.spy(),
        hiddenMicroServices: []
    };
}
