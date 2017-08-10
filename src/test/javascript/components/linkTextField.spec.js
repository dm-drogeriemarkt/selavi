import sinon from 'sinon';
import React from 'react';
import chai from 'chai';
import { mount, shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import LinkTextField from '../../../main/javascript/components/linkTextField';

describe('<LinkTextField/>', function () {

    before(function () {
        sinon.spy(window, "open");
    });

    afterEach(function () {
        window.open.reset();
    });

    after(function () {
        window.open.restore();
    });

    it('renders text field and passes props along', function () {
        const props = createProps();
        props.defaultValue = "bonjour monde";

        const wrapper = shallow(<LinkTextField {...props}/>);

        chai.expect(wrapper.find('TextField').at(0).props().defaultValue).to.equal("bonjour monde");
        chai.expect(wrapper.find('TextField').at(0).props().style.width).to.equal("31em");
    });

    it('renders an in-active button when the text field has no value', function () {
        const props = createProps();

        const wrapper = mount(<LinkTextField {...props}/>, {
            context: {
                muiTheme: getMuiTheme(),
            },
            childContextTypes: {
                muiTheme: React.PropTypes.object.isRequired,
            },
        });

        chai.expect(wrapper.find('IconButton').at(0).props().tooltip).to.be.undefined;
        chai.expect(wrapper.find('ActionOpenInNew').at(0).props().color).to.equal("#e0e0e0");

        wrapper.instance()._onTouchTap();

        sinon.assert.notCalled(window.open);
    });

    it('activates previously in-active button when text is entered in text field', function () {
        const props = createProps();

        const wrapper = mount(<LinkTextField {...props}/>, {
            context: {
                muiTheme: getMuiTheme(),
            },
            childContextTypes: {
                muiTheme: React.PropTypes.object.isRequired,
            },
        });

        chai.expect(wrapper.find('IconButton').at(0).props().tooltip).to.be.undefined;
        chai.expect(wrapper.find('ActionOpenInNew').at(0).props().color).to.equal("#e0e0e0");

        wrapper.instance()._onTouchTap();

        sinon.assert.notCalled(window.open);

        // setting the text fields value 'enables' submit button
        wrapper.ref('textField').find('input').getDOMNode().value = "http://foo.bar.baz";

        wrapper.instance()._onTouchTap();

        sinon.assert.calledOnce(window.open);
        sinon.assert.calledWith(window.open, "http://foo.bar.baz");
    });

    it('renders an active button when the text field has a default value', function () {
        const props = createProps();
        props.defaultValue = "http://foo.bar.baz";

        const wrapper = mount(<LinkTextField {...props}/>, {
            context: {
                muiTheme: getMuiTheme(),
            },
            childContextTypes: {
                muiTheme: React.PropTypes.object.isRequired,
            },
        });

        chai.expect(wrapper.find('IconButton').at(0).props().tooltip).to.equal("Open link...");

        wrapper.instance()._onTouchTap();

        sinon.assert.calledOnce(window.open);
        sinon.assert.calledWith(window.open, "http://foo.bar.baz");
    });
});

function createProps() {
    return {
        defaultValue: undefined,
        style: {}
    };
}
