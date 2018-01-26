import sinon from 'sinon';
import React from 'react';
import chai from 'chai';
import { shallow } from 'enzyme';
import { MicroserviceMindmapContextMenuComponent } from '../../../main/javascript/components/microserviceMindmapContextMenu';

function createProps() {
  return {
    contextMenuServiceId: -1,
    contextMenuFromId: -1,
    contextMenuToId: -1,
    onAddProperty: sinon.spy(),
    onShowService: sinon.spy(),
    onDeleteService: sinon.spy(),
    onDeleteLink: sinon.spy(),
    onEditLink: sinon.spy(),
    loggedInUser: {},
    top: 1,
    left: 1
  };
}

describe('<MicroserviceMindmapContextMenuComponent/>', () => {

  it('is hidden when contextMenuServiceId, contextMenuFromId and contextMenuToId are -1', () => {
    const props = createProps();

    const wrapper = shallow(<MicroserviceMindmapContextMenuComponent {...props}/>);

    chai.expect(wrapper.find('nav').props().hidden).to.equal(true);
  });

  describe('when a user is logged in', () => {
    describe('for services', () => {
      it('displays Edit Service / Delete Service buttons when contextMenuServiceId is set', () => {
        const props = createProps();
        props.loggedInUser = 'my_user_id';
        props.contextMenuServiceId = 'foo';

        const wrapper = shallow(<MicroserviceMindmapContextMenuComponent {...props}/>);

        chai.expect(wrapper.find('nav').props().hidden).to.be.undefined;
        chai.expect(wrapper.find('button').at(0).text()).to.equal('Edit Service');
        chai.expect(wrapper.find('button').at(1).text()).to.equal('Delete Service');
      });

      it('calls onAddProperty action when Edit Service button is clicked', () => {
        const props = createProps();
        props.loggedInUser = 'my_user_id';
        props.contextMenuServiceId = 'foo';

        const wrapper = shallow(<MicroserviceMindmapContextMenuComponent {...props}/>);

        wrapper.find('button').at(0).simulate('click');

        sinon.assert.calledOnce(props.onAddProperty);
      });

      it('calls onDeleteService action when Edit Service button is clicked', () => {
        const props = createProps();
        props.loggedInUser = 'my_user_id';
        props.contextMenuServiceId = 'foo';

        const wrapper = shallow(<MicroserviceMindmapContextMenuComponent {...props}/>);

        wrapper.find('button').at(1).simulate('click');

        sinon.assert.calledOnce(props.onDeleteService);
      });
    });

    describe('for relations', () => {
      it('displays Edit Link / Delete Link buttons when contextMenuFromId & contextMenuToId are set', () => {
        const props = createProps();
        props.loggedInUser = 'my_user_id';
        props.contextMenuFromId = 42;
        props.contextMenuToId = 43;

        const wrapper = shallow(<MicroserviceMindmapContextMenuComponent {...props}/>);

        chai.expect(wrapper.find('nav').props().hidden).to.be.undefined;
        chai.expect(wrapper.find('button').at(0).text()).to.equal('Delete Link');
        chai.expect(wrapper.find('button').at(1).text()).to.equal('Edit Link');
      });

      it('calls onDeleteLink action when Edit Link button is clicked', () => {
        const props = createProps();
        props.loggedInUser = 'my_user_id';
        props.contextMenuFromId = 42;
        props.contextMenuToId = 43;

        const wrapper = shallow(<MicroserviceMindmapContextMenuComponent {...props}/>);

        wrapper.find('button').at(0).simulate('click');

        sinon.assert.calledOnce(props.onDeleteLink);
      });

      it('calls onEditLink action when Edit Link button is clicked', () => {
        const props = createProps();
        props.loggedInUser = 'my_user_id';
        props.contextMenuFromId = 42;
        props.contextMenuToId = 43;

        const wrapper = shallow(<MicroserviceMindmapContextMenuComponent {...props}/>);

        wrapper.find('button').at(1).simulate('click');

        sinon.assert.calledOnce(props.onEditLink);
      });
    });
  });

  describe('when no user is logged in', () => {
    describe('for services', () => {
      it('displays Show Service buttons when contextMenuServiceId is set', () => {
        const props = createProps();
        props.contextMenuServiceId = 'foo';

        const wrapper = shallow(<MicroserviceMindmapContextMenuComponent {...props}/>);

        chai.expect(wrapper.find('nav').props().hidden).to.be.undefined;
        chai.expect(wrapper.find('button').at(0).text()).to.equal('Show Service');
      });

      it('calls onAddProperty action when Show Service button is clicked', () => {
        const props = createProps();
        props.contextMenuServiceId = 'foo';

        const wrapper = shallow(<MicroserviceMindmapContextMenuComponent {...props}/>);

        wrapper.find('button').at(0).simulate('click');

        sinon.assert.calledOnce(props.onShowService);
      });
    });

    describe('for relations', () => {
      it('displays nothing at all when contextMenuFromId & contextMenuToId are set', () => {
        const props = createProps();
        props.contextMenuFromId = 42;
        props.contextMenuToId = 43;

        const wrapper = shallow(<MicroserviceMindmapContextMenuComponent {...props}/>);

        chai.expect(wrapper.find('nav').props().hidden).to.be.true;
        chai.expect(wrapper.find('button').length).to.equal(0);
      });
    });
  });
});

