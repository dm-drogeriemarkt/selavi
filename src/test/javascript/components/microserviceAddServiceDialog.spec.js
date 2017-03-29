var sinon = require('sinon');

import React from "react";
import chai from "chai";
import {shallow, mount} from "enzyme";
import {MicroserviceAddServiceDialog} from "../../../main/javascript/components/microserviceAddServiceDialog";
import getMuiTheme from 'material-ui/styles/getMuiTheme';

describe('<MicroserviceAddServiceDialog/>', function () {

    it('renders text fields for all elements in textFields prop', function () {

        let props = createProps();
        props.textFields = {
            "id": {label: "Service ID *", hint: "eg. &quot;ZOE&quot;", required: true},
            "label": {label: "Label *", hint: "eg. &quot;ZOE&quot;", required: true}
        };

        const wrapper = shallow(<MicroserviceAddServiceDialog {...props}/>);

        chai.expect(wrapper.find('TextField').length).to.equal(2);
        chai.expect(wrapper.find('TextField').at(0).props().floatingLabelText).to.equal("Service ID *");
        chai.expect(wrapper.find('TextField').at(0).props().defaultValue).to.equal("");
        chai.expect(wrapper.find('TextField').at(1).props().floatingLabelText).to.equal("Label *");
        chai.expect(wrapper.find('TextField').at(1).props().defaultValue).to.equal("");
    });

    it('renders text fields for fields in selected service, and sets their default values', function () {

        let props = createProps();
        props.microservices.push(        {
            id: "bar-consumer",
            label: "bar-consumer",
            isExternal: true,
            consumes: [
                "foo-service"
            ]
        });
        props.addPropertyServiceId = 'bar-consumer';
        props.menuMode = 'MY_MENU_MODE';
        props.editMenuMode = 'MY_MENU_MODE';

        const wrapper = shallow(<MicroserviceAddServiceDialog {...props}/>);

        chai.expect(wrapper.find('TextField').length).to.equal(2);
        chai.expect(wrapper.find('TextField').at(0).props().floatingLabelText).to.equal("id");
        chai.expect(wrapper.find('TextField').at(0).props().defaultValue).to.equal("bar-consumer");
        chai.expect(wrapper.find('TextField').at(1).props().floatingLabelText).to.equal("label");
        chai.expect(wrapper.find('TextField').at(1).props().defaultValue).to.equal("bar-consumer");
    });

    it('mixes pre-defined and dynamic fields / properties', function () {

        let props = createProps();
        props.textFields = {
            "id": {label: "Service ID *", hint: "eg. &quot;ZOE&quot;", required: true},
            "label": {label: "Label *", hint: "eg. &quot;ZOE&quot;", required: true}
        };
        props.microservices.push({
            id: "bar-consumer",
            label: "bar-consumer",
            isExternal: true,
            consumes: [
                "foo-service"
            ]
        });
        props.addPropertyServiceId = 'bar-consumer';
        props.menuMode = 'MY_MENU_MODE';
        props.editMenuMode = 'MY_MENU_MODE';

        const wrapper = shallow(<MicroserviceAddServiceDialog {...props}/>);

        chai.expect(wrapper.find('TextField').length).to.equal(2);
        chai.expect(wrapper.find('TextField').at(0).props().floatingLabelText).to.equal("Service ID *");
        chai.expect(wrapper.find('TextField').at(0).props().defaultValue).to.equal("bar-consumer");
        chai.expect(wrapper.find('TextField').at(1).props().floatingLabelText).to.equal("Label *");
        chai.expect(wrapper.find('TextField').at(1).props().defaultValue).to.equal("bar-consumer");
    });

    it('validates text fields with required=true on submit', function () {

        let props = createProps();
        props.textFields = {
            "id": {label: "Service ID *", hint: "eg. &quot;ZOE&quot;", required: true},
            "label": {label: "Label *", hint: "eg. &quot;ZOE&quot;", required: true}
        };

        const wrapper = mount(<MicroserviceAddServiceDialog {...props}/>, {
            context: {
                muiTheme: getMuiTheme(),
            },
            childContextTypes: {
                muiTheme: React.PropTypes.object.isRequired,
            },
        });

        wrapper.instance()._handleOnSubmit();

        chai.expect(wrapper.state().validationMessages.id).to.equal("Field is required!");
        chai.expect(wrapper.state().validationMessages.label).to.equal("Field is required!");

        chai.expect(wrapper.instance().refs.input_id.props.errorText).to.equal("Field is required!");
        chai.expect(wrapper.instance().refs.input_label.props.errorText).to.equal("Field is required!");
    });
});

function createProps() {
    const props = {
        menuMode: undefined,
        textFields: undefined,
        toggles: undefined,
        microservices: [],
        addPropertyServiceId: undefined,
        menuMode: undefined,
        editMenuMode: undefined,
        context: {
            muiTheme: getMuiTheme(),
        },
        childContextTypes: {
            muiTheme: React.PropTypes.object.isRequired,
        }
    };

    return props;
}
