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

const rest = require('rest');
const mime = require('rest/interceptor/mime');

const mapStateToProps = (state) => {
    return {
        menuMode: state.menuMode,
        entity: state.entity,
        topComitters: state.topComitters,
        addEditDialogFormAction: state.addEditDialogFormAction,
        autocompleteDataSource: state.autocompleteDataSource
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onCancel: function () {
            dispatch({
                type: 'CANCEL_MENU_ACTION',
            });
        },
        onSubmit: function () {
            let entity = {};

            for (var key in this.refs) {
                if (key.substr(0, 6) === "input_") {
                    if (this.refs[key] instanceof TextField) {
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

            var request = {
                entity: entity,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (this.props.menuMode === this.props.editMenuMode) {
                request.path = this.props.addEditDialogFormAction;
                request.method = 'PUT';
            } else if (this.props.menuMode === this.props.addMenuMode) {
                request.path = this.props.addEditDialogFormAction;
                request.method = 'POST';
            }

            var client = rest.wrap(mime);
            client(request).then(response => {
                client({path: '/selavi/services'}).then(response => {
                    dispatch({
                        type: 'FETCH_MICROSERVICES_SUCCESS',
                        response: response
                    });
                });
            });
        }
    };
};

export class AddEditDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {validationMessages: {}, autocompleteDataSource: []};
    }

    _handleOnSubmit() {
        if (this._validate()) {
            this.props.onSubmit.apply(this);
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

    _addTextField(options) {
        const rightcolumn = ((options.textFields.length - 1) % 3 === 0);

        let style;
        if (rightcolumn) {
            style = {marginLeft: "1em"};
        }

        if (options.searchEndpoint) {
            options.textFields.push(<AutoComplete key={"add_edit_dialog_" + options.key}
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
        } else {
            options.textFields.push(<TextField key={"add_edit_dialog_" + options.key}
                                               style={style}
                                               ref={"input_" + options.key}
                                               floatingLabelText={options.label}
                                               hintText={options.hint}
                                               errorText={this.state.validationMessages[options.key]}
                                               defaultValue={options.value}
                                               disabled={options.disabled}
                                               multiLine={options.multiLine}></TextField>);
        }

        if (rightcolumn) {
            options.textFields.push(<br key={"add_edit_dialog_br_" + options.textFields.length}/>);
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

                    this._addTextField({
                        textFields: inputs,
                        key: key,
                        label: textField.label,
                        hint: textField.hint,
                        multiLine: textField.multiLine,
                        value: value,
                        disabled: textField.disabled,
                        searchEndpoint: textField.searchEndpoint
                    });
                }
            }

            defaultPropertyInputTabs.push(<Tab label={this.props.inputTabs[i].label} >
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
                    this._addTextField({
                        textFields: customPropertyInputs,
                        key: key,
                        label: key,
                        hint: key,
                        value: _entity[key]
                    });
                } else if (typeof(_entity[key]) === "boolean") {
                    customPropertyInputs.push(<Toggle ref={"input_" + key}
                                                      label={key}
                                                      defaultToggled={_entity[key]}
                                                      style={{marginTop: "2em", maxWidth: "23em"}}/>)
                } else {
                    console.log("unkown property type for key \"" + key + "\" with value \"" + _entity[key] + "\"");
                }
            }

            customPropertiesTab = <Tab label="Misc" >
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

            topComittersTab = <Tab label="Top Committers" >
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
