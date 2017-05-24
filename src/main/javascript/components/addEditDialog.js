const React = require('react');
import {connect} from "react-redux";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import Toggle from "material-ui/Toggle";
import {List, ListItem} from "material-ui/List";
import {Tabs, Tab} from 'material-ui/Tabs';
import AutoComplete from 'material-ui/AutoComplete';
import Avatar from 'material-ui/Avatar';
import MenuItem from 'material-ui/MenuItem';

import LinkTextField from "./linkTextField";
import {onCancel, onSubmit} from "./../actions/addEditDialogActions";

const rest = require('rest');
const mime = require('rest/interceptor/mime');

const mapStateToProps = (state) => {
    return {
        menuMode: state.menuMode,
        entity: state.entity,
        topComitters: state.topComitters,
        addEditDialogFormAction: state.addEditDialogFormAction,
        autocompleteDataSource: state.autocompleteDataSource,
        stage: state.stage
    };
};

const mapDispatchToProps = {
    onCancel,
    onSubmit
};

export class AddEditDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {validationMessages: {}, autocompleteDataSource: []};
    }

    _handleOnSubmit() {
        if (this._validate()) {
            let entity = {};

            for (var key in this.refs) {
                if (key.substr(0, 6) === "input_") {
                    if (this.refs[key] instanceof TextField || this.refs[key] instanceof LinkTextField) {
                        entity[key.substr(6)] = this.refs[key].getValue();
                    } else if (this.refs[key] instanceof Toggle) {
                        entity[key.substr(6)] = this.refs[key].isToggled();
                    } else if (this.refs[key] instanceof AutoComplete) {
                        entity[key.substr(6)] = this.refs[key].refs.searchTextField.getValue();
                    } else {
                        console.log("unkown input type " + this.refs[key]);
                    }
                }
            }

            let method;

            if (this.props.menuMode === this.props.editMenuMode) {
                method = 'PUT';
            } else if (this.props.menuMode === this.props.addMenuMode) {
                method = 'POST';
            }

            this.props.onSubmit(entity, this.props.addEditDialogFormAction, method, this.props.stage);
        }
    }

    _handleOnCancel() {
        this.setState({validationMessages: {}});
        this.props.onCancel();
    }

    _handleAutocompleteInput(searchText, searchEndpoint) {
        if (searchText && searchText.length > 2) {
            var client = rest.wrap(mime);
            let encodedSearchUri = encodeURI(searchEndpoint + "?searchQuery=" + searchText);
            client({path: encodedSearchUri}).then(response => {
                this.setState({
                    autocompleteDataSource: response.entity.map((person) => {
                        let avatar = person.thumbnailPhoto && <Avatar src={"data:image/png;base64," + person.thumbnailPhoto} />;

                        return {
                            text: person.displayName,
                            value: (
                                <MenuItem
                                    primaryText={person.displayName}
                                    rightAvatar={avatar}
                                />
                            ),
                        }
                    })
                });
            });
        } else {
            this.setState({
                autocompleteDataSource: []
            });
        }
    }

    _validate() {

        var validationMessages = {};
        var isValid = true;

        for (var i = 0; i < this.props.inputTabs.length; i++) {
            for (var key in this.props.inputTabs[i].inputFields) {
                if (this.props.inputTabs[i].inputFields[key].required) {
                    if (typeof this.refs["input_" + key].getValue === "function") {
                        if (!this.refs["input_" + key].getValue()) {
                            validationMessages[key] = "Field is required!";
                            isValid = false;
                        }
                    } else if (typeof this.refs["input_" + key].refs.searchTextField.getValue === "function") {
                        if (!this.refs["input_" + key].refs.searchTextField.getValue()) {
                            validationMessages[key] = "Field is required!";
                            isValid = false;
                        }
                    }
                }
            }
        }

        this.setState({validationMessages: validationMessages});
        return isValid;
    }

    _createTextField(options) {
        let style = {marginLeft: "1em"};

        if (options.multiLine) {
            style.width = "33em"
        }

        if (options.searchEndpoint) {
            return (<AutoComplete key={"add_edit_dialog_" + options.key}
                                                  style={style}
                                                  ref={"input_" + options.key}
                                                  floatingLabelText={options.label}
                                                  hintText={options.hint}
                                                  errorText={this.state.validationMessages[options.key]}
                                                  searchText={options.value}
                                                  disabled={options.disabled}
                                                  multiLine={options.multiLine}
                                                  dataSource={this.state.autocompleteDataSource}
                                                  onUpdateInput={(searchText) => {
                                                      this._handleAutocompleteInput(searchText, options.searchEndpoint);
                                                  }}
                                                  filter={AutoComplete.caseInsensitiveFilter}/>);
        } else if (options.isLink) {
            return (<LinkTextField key={"add_edit_dialog_" + options.key}
                                                   style={style}
                                                   ref={"input_" + options.key}
                                                   floatingLabelText={options.label}
                                                   hintText={options.hint}
                                                   errorText={this.state.validationMessages[options.key]}
                                                   defaultValue={options.value}
                                                   disabled={options.disabled}></LinkTextField>);
        } else {
            return (<TextField key={"add_edit_dialog_" + options.key}
                                               style={style}
                                               ref={"input_" + options.key}
                                               floatingLabelText={options.label}
                                               hintText={options.hint}
                                               errorText={this.state.validationMessages[options.key]}
                                               defaultValue={options.value}
                                               disabled={options.disabled}
                                               multiLine={options.multiLine}></TextField>);
        }
    }

    render() {

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this._handleOnCancel.bind(this)}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onTouchTap={this._handleOnSubmit.bind(this)}
            />
        ];

        var isOpen = false;
        var _entity = this.props.entity || {};
        var title = "";

        if (this.props.menuMode === this.props.addMenuMode) {
            isOpen = true;
            title = "Add " + this.props.entityDisplayName;
        } else if (this.props.menuMode === this.props.editMenuMode) {
            isOpen = true;
            title = "Edit " + _entity.label;
        } else {
            // dialog is closed, we can short-cut here
            return null;
        }

        let customProperties = Object.keys(_entity);

        // pre-defined input field tabs
        let defaultPropertyInputTabs = [];

        for (var i = 0; i < this.props.inputTabs.length; i++) {

            let inputs = [];

            for (var key in this.props.inputTabs[i].inputFields) {

                if (this.props.inputTabs[i].inputFields[key].type === "toggle") {
                    let toggle = this.props.inputTabs[i].inputFields[key];

                    let value = false;
                    if (typeof(_entity[key]) === "boolean") {
                        value = _entity[key];

                        customProperties.splice(customProperties.indexOf(key), 1);
                    }

                    inputs.push(<Toggle key={"add_edit_dialog_" + key}
                                                       ref={"input_" + key}
                                                       label={toggle.label}
                                                       defaultToggled={value}
                                                       style={{marginTop: "2em", maxWidth: "23em"}}/>)

                } else {
                    // default to "text"

                    let textField = this.props.inputTabs[i].inputFields[key];

                    let value = "";
                    if (typeof(_entity[key]) === "string") {
                        value = _entity[key];

                        customProperties.splice(customProperties.indexOf(key), 1);
                    }

                    inputs.push(this._createTextField({
                        key: key,
                        label: textField.label,
                        hint: textField.hint,
                        multiLine: textField.multiLine,
                        value: value,
                        disabled: textField.disabled,
                        searchEndpoint: textField.searchEndpoint,
                        isLink: textField.isLink
                    }));
                }
            }

            defaultPropertyInputTabs.push(<Tab key={"add_edit_dialog_tab_" + i}
                                               label={this.props.inputTabs[i].label} >
                {inputs}
            </Tab>);
        }

        // custom input field tab (contains all properties defined for entity that are _not_ included in pre-defined input fields)
        let customPropertiesTab = undefined;

        if (customProperties.length > 0) {
            let customPropertyInputs = [];

            for (var idx in customProperties) {
                const key = customProperties[idx];

                if (typeof(_entity[key]) === "string") {
                    customPropertyInputs.push(this._createTextField({
                        key: key,
                        label: key,
                        hint: key,
                        value: _entity[key]
                    }));
                } else if (typeof(_entity[key]) === "boolean") {
                    customPropertyInputs.push(<Toggle ref={"input_" + key}
                                                      label={key}
                                                      defaultToggled={_entity[key]}
                                                      style={{marginTop: "2em", maxWidth: "23em"}}/>)
                } else {
                    console.log("unkown property type for key \"" + key + "\" with value \"" + JSON.stringify(_entity[key]) + "\"");
                }
            }

            customPropertiesTab = <Tab key="add_edit_dialog_tab_custom_props"
                                       label="Misc" >
                    {customPropertyInputs}
            </Tab>
        }

        // bitbucket top comitters tab
        let topComittersTab = undefined;

        if (Array.isArray(this.props.topComitters)) {
            let topComittersList = [];
            this.props.topComitters.forEach((propValue, index) => {
                topComittersList.push(<ListItem key={_entity.id + '_bitbucket_' + index}
                                           primaryText={propValue.emailAddress}
                                           secondaryText={propValue.numberOfCommits}/>);
            });

            topComittersTab = <Tab key="add_edit_dialog_tab_top_committers"
                                   label="Top Committers" >
                <List>
                    {topComittersList}
                </List>
            </Tab>
        }

        return (
            <Dialog
                title={title}
                actions={actions}
                modal={true}
                open={isOpen}
                repositionOnUpdate={false}>
                <Tabs>
                    {defaultPropertyInputTabs}
                    {topComittersTab}
                    {customPropertiesTab}
                </Tabs>
            </Dialog>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditDialog);
