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
