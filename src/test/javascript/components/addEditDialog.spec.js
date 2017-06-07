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
            external: true,
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
            external: true,
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

    it('disables all input fields when menuMode is SHOW_SERVICE', function () {

        let props = createProps();
        props.inputTabs.push({
            label: "my_input_tab",
            inputFields: {
                "id": {label: "Service ID *", hint: "eg. \"ZOE\"", required: true},
                "label": {label: "Label *", hint: "eg. \"ZOE\"", required: true}
            }});
        props.menuMode = 'SHOW_SERVICE';
        props.showMenuMode = 'SHOW_SERVICE';

        const wrapper = shallow(<AddEditDialog {...props}/>);

        chai.expect(wrapper.find('TextField').length).to.equal(2);
        chai.expect(wrapper.find('TextField').at(0).props().floatingLabelText).to.equal("Service ID *");
        chai.expect(wrapper.find('TextField').at(0).props().disabled).to.equal(true);
        chai.expect(wrapper.find('TextField').at(1).props().floatingLabelText).to.equal("Label *");
        chai.expect(wrapper.find('TextField').at(1).props().disabled).to.equal(true);
    });

    it('displays "show..." as title when menuMode is SHOW_SERVICE', function () {

        let props = createProps();
        props.menuMode = 'SHOW_SERVICE';
        props.showMenuMode = 'SHOW_SERVICE';
        props.entity = {
            label: 'hello_world'
        }

        const wrapper = shallow(<AddEditDialog {...props}/>);

        chai.expect(wrapper.find('Dialog').props().title).to.equal('Show hello_world');
    });


    it('renders multi-line text fields', function () {

        let props = createProps();
        props.inputTabs.push({
            label: "my_input_tab",
            inputFields: {
                "id": {label: "Service ID *", hint: "eg. \"ZOE\"", required: true},
                "label": {label: "Label *", hint: "eg. \"ZOE\"", required: true, multiLine: true}
            }});

        const wrapper = shallow(<AddEditDialog {...props}/>);

        chai.expect(wrapper.find('TextField').length).to.equal(2);
        chai.expect(wrapper.find('TextField').at(1).props().floatingLabelText).to.equal("Label *");
        chai.expect(wrapper.find('TextField').at(1).props().multiLine).to.equal(true);
        chai.expect(wrapper.find('TextField').at(1).props().style.width).to.equal("33em");
    });

    it('renders link text fields', function () {

        let props = createProps();
        props.inputTabs.push({
            label: "my_input_tab",
            inputFields: {
                "id": {label: "Service ID *", hint: "eg. \"ZOE\"", required: true},
                "label": {label: "Label *", hint: "eg. \"ZOE\"", required: true, isLink: true}
            }});

        const wrapper = shallow(<AddEditDialog {...props}/>);

        chai.expect(wrapper.find('LinkTextField').length).to.equal(1);
        chai.expect(wrapper.find('LinkTextField').at(0).props().floatingLabelText).to.equal("Label *");
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

    xit('marks tabs containing invalid fields', function () {

        let props = createProps();
        props.inputTabs.push({
                label: "my_valid_tab",
                inputFields: {
                    "id": {label: "Service ID *", hint: "eg. \"ZOE\"", required: false}
                }
            },
            {
                label: "my_invalid_tab",
                inputFields: {
                    "label": {label: "Label *", hint: "eg. \"ZOE\"", required: true}
                }
            });

        const wrapper = mount(<AddEditDialog {...props}/>, {
            context: {
                muiTheme: getMuiTheme(),
            },
            childContextTypes: {
                muiTheme: React.PropTypes.object.isRequired,
            },
        });

        wrapper.instance()._handleOnSubmit();
        
        // TODO: fix this test
        // currently, its not possible to test anything on the children of material ui's Dialog component (eg, the Tab)
        // when using enzyme's mount(): https://github.com/callemall/material-ui/issues/6290

        chai.expect(wrapper.find('Tab').length).to.equal(2);
        chai.expect(wrapper.find('Tab').at(0).props().style).to.be.undefined
        chai.expect(wrapper.find('Tab').at(1).style).to.equal({ color: "rgb(244, 67, 54)" });
    });

    it('creates entity object and calls props.onSubmit() when validation succeeds', function () {

        let props = createProps();
        props.inputTabs.push({
            label: "my_input_tab",
            inputFields: {
                "id": {label: "Service ID *", hint: "eg. \"ZOE\"", required: true},
                "label": {label: "Label *", hint: "eg. \"ZOE\"", required: true}
            }});
        props.entity = {
            id: "foo",
            label: "bar"
        };
        props.addEditDialogFormAction = "/myBackendUrl"

        const wrapper = mount(<AddEditDialog {...props}/>, {
            context: {
                muiTheme: getMuiTheme(),
            },
            childContextTypes: {
                muiTheme: React.PropTypes.object.isRequired,
            },
        });

        wrapper.instance()._handleOnSubmit();

        sinon.assert.calledOnce(props.onSubmit);
        sinon.assert.calledWith(props.onSubmit, { id: "foo", label: "bar" }, "/myBackendUrl", "PUT");
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
        chai.expect(wrapper.find('Tab').at(0).props().label).to.equal("Top Committers");
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
        editMenuMode: undefined,
        onCancel: sinon.spy(),
        onSubmit: sinon.spy()
    };

    return props;
}
