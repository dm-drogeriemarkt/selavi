const rest = require('rest');

const sinon = require('sinon');
import React from "react";
import chai from "chai";
import {shallow, mount} from "enzyme";
import {AddEditDialog} from "../../../main/javascript/components/addEditDialog";
import getMuiTheme from 'material-ui/styles/getMuiTheme';

describe('<AddEditDialog/>', function () {

    it('renders tabs with text fields for all elements in inputTabs prop', function () {

        let props = createProps();
        props.inputTabs.push({
            label: "my_input_tab",
            inputFields: {
                "id": {label: "Service ID *", hint: "eg. \"ZOE\"", required: true},
                "label": {label: "Label *", hint: "eg. \"ZOE\"", required: true}
        }});

        const wrapper = shallow(<AddEditDialog {...props}/>);


        chai.expect(wrapper.find('Tab').length).to.equal(1);
        chai.expect(wrapper.find('Tab').at(0).props().label).to.equal("my_input_tab");

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

        const wrapper = shallow(<AddEditDialog {...props}/>);

        chai.expect(wrapper.find('TextField').length).to.equal(2);
        chai.expect(wrapper.find('TextField').at(0).props().floatingLabelText).to.equal("id");
        chai.expect(wrapper.find('TextField').at(0).props().defaultValue).to.equal("bar-consumer");
        chai.expect(wrapper.find('TextField').at(1).props().floatingLabelText).to.equal("label");
        chai.expect(wrapper.find('TextField').at(1).props().defaultValue).to.equal("bar-consumer");
    });

    it('mixes pre-defined and dynamic fields / properties', function () {

        let props = createProps();
        props.inputTabs.push({
            label: "my_input_tab",
            inputFields: {
                "id": {label: "Service ID *", hint: "eg. \"ZOE\"", required: true},
                "label": {label: "Label *", hint: "eg. \"ZOE\"", required: true}
        }});
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

        const wrapper = shallow(<AddEditDialog {...props}/>);

        chai.expect(wrapper.find('TextField').length).to.equal(2);
        chai.expect(wrapper.find('TextField').at(0).props().floatingLabelText).to.equal("Service ID *");
        chai.expect(wrapper.find('TextField').at(0).props().defaultValue).to.equal("bar-consumer");
        chai.expect(wrapper.find('TextField').at(1).props().floatingLabelText).to.equal("Label *");
        chai.expect(wrapper.find('TextField').at(1).props().defaultValue).to.equal("bar-consumer");
    });

    it('renders disabled text fields', function () {

        let props = createProps();
        props.inputTabs.push({
            label: "my_input_tab",
            inputFields: {
                "id": {label: "Service ID *", hint: "eg. \"ZOE\"", required: true, disabled: true},
                "label": {label: "Label *", hint: "eg. \"ZOE\"", required: true}
        }});

        const wrapper = shallow(<AddEditDialog {...props}/>);

        chai.expect(wrapper.find('TextField').length).to.equal(2);
        chai.expect(wrapper.find('TextField').at(0).props().floatingLabelText).to.equal("Service ID *");
        chai.expect(wrapper.find('TextField').at(0).props().disabled).to.equal(true);
        chai.expect(wrapper.find('TextField').at(1).props().floatingLabelText).to.equal("Label *");
        chai.expect(wrapper.find('TextField').at(1).props().disabled).to.equal(false);
    });

    it('validates text fields with required=true on submit', function () {

        let props = createProps();
        props.inputTabs.push({
            label: "my_input_tab",
            inputFields: {
                "id": {label: "Service ID *", hint: "eg. \"ZOE\"", required: true},
                "label": {label: "Label *", hint: "eg. \"ZOE\"", required: true}
        }});

        const wrapper = mount(<AddEditDialog {...props}/>, {
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

        const wrapper = shallow(<AddEditDialog {...props}/>);

        chai.expect(wrapper.find('Tab').length).to.equal(1);
        chai.expect(wrapper.find('Tab').at(0).props().label).to.equal("Bitbucket");
        chai.expect(wrapper.find('Tab').at(0).find('ListItem').length).to.equal(2);
        chai.expect(wrapper.find('Tab').at(0).find('ListItem').at(0).props().primaryText).to.equal("foo@bar.baz");
        chai.expect(wrapper.find('Tab').at(0).find('ListItem').at(0).props().secondaryText).to.equal(42);
        chai.expect(wrapper.find('Tab').at(0).find('ListItem').at(1).props().primaryText).to.equal("moo@cow.biz");
        chai.expect(wrapper.find('Tab').at(0).find('ListItem').at(1).props().secondaryText).to.equal(1337);
    });

    describe('autocomplete feature', function() {
        var thenHandler, clientStub;

        before(function() {
            const thenSpy = function (handlerParam) {
                thenHandler = handlerParam;
            };
            clientStub = sinon.stub().returns({
                then: sinon.spy(thenSpy)
            });

            sinon.stub(rest, 'wrap').returns(clientStub);
        });

        afterEach(function () {
            clientStub.reset();

            // cleanup, make sure tests don't interfere with each other
            thenHandler = undefined;
            rest.wrap.reset()
        });

        after(function() {
            rest.wrap.restore();
        });

        it('renders autocomplete textField', function () {

            let props = createProps();
            props.inputTabs.push({
                label: "my_input_tab",
                inputFields: {
                    "id": {label: "Service ID *", hint: "eg. \"ZOE\"", required: true},
                    "label": {label: "Label *", hint: "eg. \"ZOE\"", required: true},
                    "fdOwner": {label: "Filiadata-Owner *", required: true, searchEndpoint: "/selavi/person/search"}
            }});

            const wrapper = shallow(<AddEditDialog {...props}/>);

            chai.expect(wrapper.find('AutoComplete').length).to.equal(1);
        });

        it('fetches autocomplete data and creates autocomplete list', function () {

            let props = createProps();
            props.inputTabs.push({
                label: "my_input_tab",
                inputFields: {
                    "id": {label: "Service ID *", hint: "eg. \"ZOE\"", required: true},
                    "label": {label: "Label *", hint: "eg. \"ZOE\"", required: true},
                    "fdOwner": {label: "Filiadata-Owner *", required: true, searchEndpoint: "/selavi/person/search"}
            }});

            const wrapper = shallow(<AddEditDialog {...props}/>);

            wrapper.find('AutoComplete').simulate('updateInput', "Mül");

            sinon.assert.calledOnce(clientStub);
            sinon.assert.calledWith(clientStub, { path: "/selavi/person/search?searchQuery=M%C3%BCl" });

            thenHandler({entity:[
                    { displayName: "Müller, Sven" },
                    { displayName: "Müller, Thomas", thumbnailPhoto: "i_am_a_base64_encoded_png" }
                ]});
            

            chai.expect(wrapper.find('AutoComplete').at(0).props().dataSource.length).to.equal(2);
            chai.expect(wrapper.find('AutoComplete').at(0).props().dataSource[0].value.props.primaryText).to.equal("Müller, Sven");
            chai.expect(wrapper.find('AutoComplete').at(0).props().dataSource[0].value.props.rightAvatar).to.be.undefined;
            chai.expect(wrapper.find('AutoComplete').at(0).props().dataSource[1].value.props.primaryText).to.equal("Müller, Thomas");
            chai.expect(wrapper.find('AutoComplete').at(0).props().dataSource[1].value.props.rightAvatar.props.src).to.equal("data:image/png;base64,i_am_a_base64_encoded_png");
        });

    });

});

function createProps() {
    const props = {
        menuMode: undefined,
        inputTabs: [],
        entity: undefined,
        menuMode: undefined,
        editMenuMode: undefined
    };

    return props;
}
