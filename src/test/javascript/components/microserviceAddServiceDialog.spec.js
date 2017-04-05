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
            "id": {label: "Service ID *", hint: "eg. \"ZOE\"", required: true},
            "label": {label: "Label *", hint: "eg. \"ZOE\"", required: true}
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
        props.entity =        {
            id: "bar-consumer",
            label: "bar-consumer",
            isExternal: true,
            consumes: [
                "foo-service"
            ]
        };
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
            "id": {label: "Service ID *", hint: "eg. \"ZOE\"", required: true},
            "label": {label: "Label *", hint: "eg. \"ZOE\"", required: true}
        };
        props.entity =        {
            id: "bar-consumer",
            label: "bar-consumer",
            isExternal: true,
            consumes: [
                "foo-service"
            ]
        };
        props.menuMode = 'MY_MENU_MODE';
        props.editMenuMode = 'MY_MENU_MODE';

        const wrapper = shallow(<MicroserviceAddServiceDialog {...props}/>);

        chai.expect(wrapper.find('TextField').length).to.equal(2);
        chai.expect(wrapper.find('TextField').at(0).props().floatingLabelText).to.equal("Service ID *");
        chai.expect(wrapper.find('TextField').at(0).props().defaultValue).to.equal("bar-consumer");
        chai.expect(wrapper.find('TextField').at(1).props().floatingLabelText).to.equal("Label *");
        chai.expect(wrapper.find('TextField').at(1).props().defaultValue).to.equal("bar-consumer");
    });

    it('renders disabled text fields', function () {

        let props = createProps();
        props.textFields = {
            "id": {label: "Service ID *", hint: "eg. \"ZOE\"", required: true, disabled: true},
            "label": {label: "Label *", hint: "eg. \"ZOE\"", required: true}
        }

        const wrapper = shallow(<MicroserviceAddServiceDialog {...props}/>);

        chai.expect(wrapper.find('TextField').length).to.equal(2);
        chai.expect(wrapper.find('TextField').at(0).props().floatingLabelText).to.equal("Service ID *");
        chai.expect(wrapper.find('TextField').at(0).props().disabled).to.equal(true);
        chai.expect(wrapper.find('TextField').at(1).props().floatingLabelText).to.equal("Label *");
        chai.expect(wrapper.find('TextField').at(1).props().disabled).to.equal(false);
    });

    it('validates text fields with required=true on submit', function () {

        let props = createProps();
        props.textFields = {
            "id": {label: "Service ID *", hint: "eg. \"ZOE\"", required: true},
            "label": {label: "Label *", hint: "eg. \"ZOE\"", required: true}
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

    it('renders bitbucket top comitters in separate tab, when present', function () {

        let props = createProps();
        props.topComitters = [
            {
                emailAddress: "foo@bar.baz",
                numberOfCommits: 42
            },
            {
                emailAddress: "moo@cow.biz",
                numberOfCommits: 1337
            },
        ]

        const wrapper = shallow(<MicroserviceAddServiceDialog {...props}/>);

        chai.expect(wrapper.find('Tab').length).to.equal(3);
        chai.expect(wrapper.find('Tab').at(2).props().label).to.equal("Bitbucket");
        chai.expect(wrapper.find('Tab').at(2).find('ListItem').length).to.equal(2);
        chai.expect(wrapper.find('Tab').at(2).find('ListItem').at(0).props().primaryText).to.equal("foo@bar.baz");
        chai.expect(wrapper.find('Tab').at(2).find('ListItem').at(0).props().secondaryText).to.equal(42);
        chai.expect(wrapper.find('Tab').at(2).find('ListItem').at(1).props().primaryText).to.equal("moo@cow.biz");
        chai.expect(wrapper.find('Tab').at(2).find('ListItem').at(1).props().secondaryText).to.equal(1337);
    });
});

function createProps() {
    const props = {
        menuMode: undefined,
        textFields: undefined,
        toggles: undefined,
        entity: undefined,
        menuMode: undefined,
        editMenuMode: undefined
    };

    return props;
}
