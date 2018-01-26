import sinon from 'sinon';
import React from 'react';
import chai from 'chai';
import { shallow } from 'enzyme';
import { MicroserviceDeleteServiceDialogComponent } from '../../../main/javascript/components/microserviceDeleteServiceDialog';

function createProps() {
  return {
    onCancel: sinon.spy(),
    onSubmit: sinon.spy(),
    menuMode: '',
    deleteServiceId: '',
    deleteServiceErrorMessage: '',
    state: 'dev',
    deleteLinkFromId: '',
    deleteLinkToId: '',
    stage: 'dev'
  };
}

describe('<MicroserviceDeleteServiceDialogComponent/>', () => {

  it('is hidden when menuMode is not DELETE_SERVICE or DELETE_LINK', () => {
    const props = createProps();

    const wrapper = shallow(<MicroserviceDeleteServiceDialogComponent {...props}/>);

    chai.expect(wrapper.type()).to.equal('div');

    chai.expect(wrapper.find('Dialog').props().open).to.equal(false);
    chai.expect(wrapper.find('Snackbar').props().open).to.equal(false);
  });

  it('does not display error message when menuMode is not DELETE_SERVICE or DELETE_LINK', () => {
    const props = createProps();

    props.deleteServiceErrorMessage = 'thats an error';

    const wrapper = shallow(<MicroserviceDeleteServiceDialogComponent {...props}/>);

    chai.expect(wrapper.find('Dialog').props().open).to.equal(false);
    chai.expect(wrapper.find('Snackbar').props().open).to.equal(false);
  });

  describe('delete services', () => {

    it('displays delete confirmation dialog when menuMode is DELETE_SERVICE', () => {
      const props = createProps();

      props.menuMode = 'DELETE_SERVICE';
      props.deleteServiceId = 'foobar';

      const wrapper = shallow(<MicroserviceDeleteServiceDialogComponent {...props}/>);

      chai.expect(wrapper.find('Dialog').props().open).to.equal(true);
      chai.expect(wrapper.find('Dialog').props().title).to.equal('Confirm deletion of service with id foobar');
      chai.expect(wrapper.find('Snackbar').props().open).to.equal(false);
    });

    it('displays error message when deleteServiceErrorMessage is set', () => {
      const props = createProps();

      props.menuMode = 'DELETE_SERVICE';

      props.deleteServiceErrorMessage = 'thats an error';

      const wrapper = shallow(<MicroserviceDeleteServiceDialogComponent {...props}/>);

      chai.expect(wrapper.find('Dialog').props().open).to.equal(true);
      chai.expect(wrapper.find('Snackbar').props().open).to.equal(true);
      chai.expect(wrapper.find('Snackbar').props().message).to.equal('thats an error');
    });
  });

  describe('delete links', () => {

    it('displays delete confirmation dialog when menuMode is DELETE_LINK', () => {
      const props = createProps();

      props.menuMode = 'DELETE_LINK';
      props.deleteLinkFromId = 'foobar';
      props.deleteLinkToId = 'baz';

      const wrapper = shallow(<MicroserviceDeleteServiceDialogComponent {...props}/>);

      chai.expect(wrapper.find('Dialog').props().open).to.equal(true);
      chai.expect(wrapper.find('Dialog').props().title).to
        .equal('Confirm deletion of link between services foobar and baz');
      chai.expect(wrapper.find('Snackbar').props().open).to.equal(false);
    });

    it('displays error message when deleteServiceErrorMessage is set', () => {
      const props = createProps();

      props.menuMode = 'DELETE_LINK';

      props.deleteServiceErrorMessage = 'thats a link-error';

      const wrapper = shallow(<MicroserviceDeleteServiceDialogComponent {...props}/>);

      chai.expect(wrapper.find('Dialog').props().open).to.equal(true);
      chai.expect(wrapper.find('Snackbar').props().open).to.equal(true);
      chai.expect(wrapper.find('Snackbar').props().message).to.equal('thats a link-error');
    });
  });
});

