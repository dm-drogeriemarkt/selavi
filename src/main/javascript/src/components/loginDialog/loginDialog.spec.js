import sinon from 'sinon';
import React from 'react';
import chai from 'chai';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { mount, shallow } from 'enzyme';
import { LoginDialogComponent } from 'components/loginDialog.component';

function createProps() {
  return {
    onCancel: sinon.spy(),
    onSubmit: sinon.spy(),
    menuMode: '',
    deleteServiceId: 1,
    deleteServiceErrorMessage: '',
    loginErrorMessage: '',
    deleteLinkFromId: 1
  };
}

describe('<LoginDialogComponent/>', () => {

  it('is hidden when menuMode is not LOGIN', () => {
    const props = createProps();

    const wrapper = shallow(<LoginDialogComponent {...props}/>);

    chai.expect(wrapper.type()).to.equal('div');

    chai.expect(wrapper.find('Dialog').props().open).to.equal(false);
    chai.expect(wrapper.find('Snackbar').props().open).to.equal(false);
  });

  it('does not display error message when menuMode is not LOGIN', () => {
    const props = createProps();

    props.loginErrorMessage = 'thats an error';

    const wrapper = shallow(<LoginDialogComponent {...props}/>);

    chai.expect(wrapper.find('Dialog').props().open).to.equal(false);
    chai.expect(wrapper.find('Snackbar').props().open).to.equal(false);
  });

  it('is displayed when menuMode is LOGIN', () => {
    const props = createProps();

    props.menuMode = 'LOGIN';

    const wrapper = shallow(<LoginDialogComponent {...props}/>);

    chai.expect(wrapper.find('Dialog').props().open).to.equal(true);
    chai.expect(wrapper.find('Dialog').props().title).to.equal('Login to SeLaVi');
    chai.expect(wrapper.find('Snackbar').props().open).to.equal(false);
  });

  it('calls onSubmit function with values from text fields', () => {
    const props = createProps();

    props.menuMode = 'LOGIN';

    const wrapper = mount(<LoginDialogComponent {...props}/>, {
      context: {
        muiTheme: getMuiTheme()
      },
      childContextTypes: {
        muiTheme: React.PropTypes.object.isRequired
      }
    });

    wrapper.instance().usernameInput.input.value = 'foobar';
    wrapper.instance().passwordInput.input.value = 'baz';

    wrapper.instance().onSubmit();

    sinon.assert.calledOnce(props.onSubmit);
    sinon.assert.calledWith(props.onSubmit, { entity: { password: 'baz', username: 'foobar' } });
  });

  it('displays snackbar with error message when present', () => {
    const props = createProps();

    props.menuMode = 'LOGIN';
    props.loginErrorMessage = 'heute leider nur fuer stammgaeste';

    const wrapper = shallow(<LoginDialogComponent {...props}/>);

    chai.expect(wrapper.find('Snackbar').props().open).to.equal(true);
    chai.expect(wrapper.find('Snackbar').props().message).to.equal('heute leider nur fuer stammgaeste');
  });

  it('displays spinner when login is in progress (and hides it when login dialog is closed)', () => {
    const props = createProps();

    props.menuMode = 'LOGIN';

    const wrapper = shallow(<LoginDialogComponent {...props}/>);

    // fake refs
    wrapper.instance().refs = {
      input_username: {
        getValue: () => {
        }
      },
      input_password: {
        getValue: () => {
        }
      }
    };

    chai.expect(wrapper.find('CircularProgress').length).to.equal(0);

    wrapper.instance().onSubmit();

    chai.expect(wrapper.find('CircularProgress').length).to.equal(1);

    wrapper.setProps({
      menuMode: 'something_else'
    });

    chai.expect(wrapper.find('CircularProgress').length).to.equal(0);
  });

  it('attaches keyboard event handler on mount, submits login on enter key', () => {
    const props = createProps();

    props.menuMode = 'LOGIN';

    let keyboardHandlerFn;

    sinon.stub(document, 'addEventListener', (type, listener) => {
      if (type === 'keydown') {
        keyboardHandlerFn = listener;
      }
    });

    const wrapper = shallow(<LoginDialogComponent {...props}/>);

    chai.expect(keyboardHandlerFn).to.be.defined;

    // fake refs
    wrapper.instance().usernameInput = { getValue: () => 'login' };
    wrapper.instance().passwordInput = { getValue: () => 'using_keyboard' };

    keyboardHandlerFn({
      key: 'Enter'
    });

    // make sure onSubmit is not called twice by accident
    keyboardHandlerFn({
      key: 'Enter'
    });

    sinon.assert.calledOnce(props.onSubmit);
    sinon.assert.calledWith(props.onSubmit, { entity: { username: 'login', password: 'using_keyboard' } });

    document.addEventListener.restore();
  });

  it('brings username text field into focus', () => {
    const props = createProps();

    const wrapper = mount(<LoginDialogComponent {...props}/>, {
      context: {
        muiTheme: getMuiTheme()
      },
      childContextTypes: {
        muiTheme: React.PropTypes.object.isRequired
      }
    });

    let callbackFn;

    sinon.stub(window, 'setTimeout', (cb) => {
      callbackFn = cb;
    });

    wrapper.setProps({
      menuMode: 'LOGIN'
    });

    chai.expect(callbackFn).to.be.defined;

    chai.expect(wrapper.instance().usernameInput.state.isFocused).to.be.false;

    callbackFn(wrapper.instance());

    chai.expect(wrapper.instance().usernameInput.state.isFocused).to.be.true;
    chai.expect(wrapper.instance().passwordInput.state.isFocused).to.be.false;

    window.setTimeout.restore();
  });
});
