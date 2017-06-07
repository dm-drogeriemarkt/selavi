var sinon = require('sinon');

import React from "react";
import chai from "chai";
import {shallow} from "enzyme";
import {MicroserviceMindmapContextMenu} from "../../../main/javascript/components/microserviceMindmapContextMenu";

describe('<MicroserviceMindmapContextMenu/>', function () {

    it('is hidden when contextMenuServiceId, contextMenuFromId and contextMenuToId are undefined', function () {
        const props = createProps();

        const wrapper = shallow(<MicroserviceMindmapContextMenu {...props}/>);

        chai.expect(wrapper.find('nav').props().hidden).to.equal(true);
    });

    describe('when a user is logged in', function () {
        describe('for services', function () {
            it('displays Edit Service / Delete Service buttons when contextMenuServiceId is set', function () {
                const props = createProps();
                props.loggedInUser = 'my_user_id';
                props.contextMenuServiceId = 1337;

                const wrapper = shallow(<MicroserviceMindmapContextMenu {...props}/>);

                chai.expect(wrapper.find('nav').props().hidden).to.be.undefined;
                chai.expect(wrapper.find('button').at(0).text()).to.equal('Edit Service');
                chai.expect(wrapper.find('button').at(1).text()).to.equal('Delete Service');
            });

            it('calls onAddProperty action when Edit Service button is clicked', function () {
                const props = createProps();
                props.loggedInUser = 'my_user_id';
                props.contextMenuServiceId = 1337;

                const wrapper = shallow(<MicroserviceMindmapContextMenu {...props}/>);

                wrapper.find('button').at(0).simulate('click');

                sinon.assert.calledOnce(props.onAddProperty);
            });

            it('calls onDeleteService action when Edit Service button is clicked', function () {
                const props = createProps();
                props.loggedInUser = 'my_user_id';
                props.contextMenuServiceId = 1337;

                const wrapper = shallow(<MicroserviceMindmapContextMenu {...props}/>);

                wrapper.find('button').at(1).simulate('click');

                sinon.assert.calledOnce(props.onDeleteService);
            });
        });

        describe('for relations', function () {
            it('displays Edit Link / Delete Link buttons when contextMenuFromId & contextMenuToId are set', function () {
                const props = createProps();
                props.loggedInUser = 'my_user_id';
                props.contextMenuFromId = 42;
                props.contextMenuToId = 43;

                const wrapper = shallow(<MicroserviceMindmapContextMenu {...props}/>);

                chai.expect(wrapper.find('nav').props().hidden).to.be.undefined;
                chai.expect(wrapper.find('button').at(0).text()).to.equal('Delete Link');
                chai.expect(wrapper.find('button').at(1).text()).to.equal('Edit Link');
            });

            it('calls onDeleteLink action when Edit Link button is clicked', function () {
                const props = createProps();
                props.loggedInUser = 'my_user_id';
                props.contextMenuFromId = 42;
                props.contextMenuToId = 43;

                const wrapper = shallow(<MicroserviceMindmapContextMenu {...props}/>);

                wrapper.find('button').at(0).simulate('click');

                sinon.assert.calledOnce(props.onDeleteLink);
            });

            it('calls onEditLink action when Edit Link button is clicked', function () {
                const props = createProps();
                props.loggedInUser = 'my_user_id';
                props.contextMenuFromId = 42;
                props.contextMenuToId = 43;

                const wrapper = shallow(<MicroserviceMindmapContextMenu {...props}/>);

                wrapper.find('button').at(1).simulate('click');

                sinon.assert.calledOnce(props.onEditLink);
            });
        });
    });

    describe('when no user is logged in', function () {
        describe('for services', function () {
            it('displays Show Service buttons when contextMenuServiceId is set', function () {
                const props = createProps();
                props.contextMenuServiceId = 1337;

                const wrapper = shallow(<MicroserviceMindmapContextMenu {...props}/>);

                chai.expect(wrapper.find('nav').props().hidden).to.be.undefined;
                chai.expect(wrapper.find('button').at(0).text()).to.equal('Show Service');
            });

            it('calls onAddProperty action when Show Service button is clicked', function () {
                const props = createProps();
                props.contextMenuServiceId = 1337;

                const wrapper = shallow(<MicroserviceMindmapContextMenu {...props}/>);

                wrapper.find('button').at(0).simulate('click');

                sinon.assert.calledOnce(props.onShowService);
            });
        });

        describe('for relations', function () {
            it('displays nothing at all when contextMenuFromId & contextMenuToId are set', function () {
                const props = createProps();
                props.contextMenuFromId = 42;
                props.contextMenuToId = 43;

                const wrapper = shallow(<MicroserviceMindmapContextMenu {...props}/>);

                chai.expect(wrapper.find('nav').props().hidden).to.be.true;
                chai.expect(wrapper.find('button').length).to.equal(0);
            });
        });
    });
});

function createProps() {
    const props = {
        contextMenuServiceId: undefined,
        contextMenuFromId: undefined,
        contextMenuToId: undefined,
        onAddProperty: sinon.spy(),
        onShowService: sinon.spy(),
        onDeleteService: sinon.spy(),
        onDeleteLink: sinon.spy(),
        onEditLink: sinon.spy(),
        loggedInUser: undefined
    };

    return props;
}
