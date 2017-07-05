var sinon = require('sinon');

import React from "react";
import chai from "chai";
import {shallow, mount} from "enzyme";
import {LoginDialog} from "../../../main/javascript/components/loginDialog";
import getMuiTheme from 'material-ui/styles/getMuiTheme';

describe('<LoginDialog/>', function () {

    it('is hidden when menuMode is not LOGIN', function () {
        const props = createProps();

        const wrapper = shallow(<LoginDialog {...props}/>);

        chai.expect(wrapper.type()).to.equal('div');

        chai.expect(wrapper.find('Dialog').props().open).to.equal(false);
        chai.expect(wrapper.find('Snackbar').props().open).to.equal(false);
    });

    it('does not display error message when menuMode is not LOGIN', function () {
        const props = createProps();

        props.loginErrorMessage = 'thats an error';

        const wrapper = shallow(<LoginDialog {...props}/>);

        chai.expect(wrapper.find('Dialog').props().open).to.equal(false);
        chai.expect(wrapper.find('Snackbar').props().open).to.equal(false);
    });

    it('is displayed when menuMode is LOGIN', function () {
        const props = createProps();

        props.menuMode = 'LOGIN';

        const wrapper = shallow(<LoginDialog {...props}/>);

        chai.expect(wrapper.find('Dialog').props().open).to.equal(true);
        chai.expect(wrapper.find('Dialog').props().title).to.equal('Login to SeLaVi');
        chai.expect(wrapper.find('Snackbar').props().open).to.equal(false);
    });

    it('calls onSubmit function with values from text fields', function () {
        const props = createProps();

        props.menuMode = 'LOGIN';

        const wrapper = mount(<LoginDialog {...props}/>, {
            context: {
                muiTheme: getMuiTheme(),
            },
            childContextTypes: {
                muiTheme: React.PropTypes.object.isRequired,
            },
        });

        wrapper.ref('input_username').find('input').getDOMNode().value = "foobar";
        wrapper.ref('input_password').find('input').getDOMNode().value = "baz";

        wrapper.instance().onSubmit();

        sinon.assert.calledOnce(props.onSubmit);
        sinon.assert.calledWith(props.onSubmit, { entity: { password: "baz", username: "foobar" } });
    });

    it('displays snackbar with error message when present', function () {
        const props = createProps();

        props.menuMode = 'LOGIN';
        props.loginErrorMessage = 'heute leider nur fuer stammgaeste';

        const wrapper = shallow(<LoginDialog {...props}/>);

        chai.expect(wrapper.find('Snackbar').props().open).to.equal(true);
        chai.expect(wrapper.find('Snackbar').props().message).to.equal('heute leider nur fuer stammgaeste');
    });

    it('displays spinner when login is in progress (and hides it when login dialog is closed)', function () {
        const props = createProps();

        props.menuMode = 'LOGIN';

        const wrapper = shallow(<LoginDialog {...props}/>);

        // fake refs
        wrapper.instance().refs = {
            input_username: { getValue: () => {} },
            input_password: { getValue: () => {} }
        };

        chai.expect(wrapper.find('CircularProgress').length).to.equal(0);

        wrapper.instance().onSubmit();

        chai.expect(wrapper.find('CircularProgress').length).to.equal(1);

        wrapper.setProps({
            menuMode: 'something_else'
        });

        chai.expect(wrapper.find('CircularProgress').length).to.equal(0);
    });

    it('attaches keyboard event handler on mount, submits login on enter key', function () {
        const props = createProps();

        props.menuMode = 'LOGIN';

        let keyboardHandlerFn;

        sinon.stub(document, 'addEventListener', (type, listener, useCapture) => {
            if (type === 'keydown') {
                keyboardHandlerFn = listener;
            }
        });

        const wrapper = shallow(<LoginDialog {...props}/>);

        chai.expect(keyboardHandlerFn).to.be.defined;

        // fake refs
        wrapper.instance().refs = {
            input_username: { getValue: () => "login" },
            input_password: { getValue: () => "using_keyboard" }
        };

        keyboardHandlerFn({
            key: 'Enter'
        });

        // make sure onSubmit is not called twice by accident
        keyboardHandlerFn({
            key: 'Enter'
        });

        sinon.assert.calledOnce(props.onSubmit);
        sinon.assert.calledWith(props.onSubmit, { entity: { username: "login", password: "using_keyboard" } });
        
        document.addEventListener.restore();
    });

    it('brings username text field into focus', function () {
        const props = createProps();

        const wrapper = mount(<LoginDialog {...props}/>, {
            context: {
                muiTheme: getMuiTheme(),
            },
            childContextTypes: {
                muiTheme: React.PropTypes.object.isRequired,
            },
        });

        let callbackFn;

        sinon.stub(window, "setTimeout", (cb, timeout, param) => {
            callbackFn = cb;
        });

        wrapper.setProps({
            menuMode: 'LOGIN'
        });

        chai.expect(callbackFn).to.be.defined;

        chai.expect(wrapper.instance().refs.input_username.state.isFocused).to.be.false;

        callbackFn(wrapper.instance());

        chai.expect(wrapper.instance().refs.input_username.state.isFocused).to.be.true;

        window.setTimeout.restore();
    });
});

function createProps() {
    const props = {
        onCancel: sinon.spy(),
        onSubmit: sinon.spy(),
        menuMode: undefined,
        deleteServiceId: undefined,
        deleteServiceErrorMessage: undefined
    };

    return props;
}
