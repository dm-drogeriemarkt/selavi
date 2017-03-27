const React = require('react');
import { connect } from 'react-redux';

const rest = require('rest');
const mime = require('rest/interceptor/mime');

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';

const mapStateToProps = (state) => {
    return {
        menuMode: state.menuMode,
        addPropertyServiceId: state.addPropertyServiceId,
        microservices: state.microservices
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onCancel: function() {
            dispatch({
                type: 'CANCEL_MENU_ACTION',
            });
        },
        onSubmit: function() {
            let entity = {};

            for (var key in this.refs) {
                if (key.substr(0, 6) === "input_") {
                    if (this.refs[key] instanceof TextField) {
                        entity[key.substr(6)] = this.refs[key].getValue();
                    } else if (this.refs[key] instanceof Toggle) {
                        entity[key.substr(6)] = this.refs[key].isToggled();
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
            }

            if (this.props.menuMode === "EDIT_SERVICE") {
                request.path = '/selavi/services/' + this.props.addPropertyServiceId + '/properties';
                request.method = 'PUT';
            } else if (this.props.menuMode === "ADD_SERVICE") {
                request.path = '/selavi/services';
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

class MicroserviceAddServiceDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {validationMessages: {}};
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

    _validate() {

        var validationMessages = {};
        var isValid = true;

        for (var key in this.props.textFields) {
            if (this.props.textFields[key].required) {
                if (!this.refs["input_" + key].getValue()) {
                    validationMessages[key] = "Field is required!";
                    isValid = false;
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
            style = { marginLeft: "1em" };
        }

        options.textFields.push(<TextField key={"add_edit_dialog_" + options.key}
                                           style={style}
                                           ref={"input_" + options.key}
                                           floatingLabelText={options.label}
                                           hintText={options.hint}
                                           errorText={this.state.validationMessages[options.key]}
                                           defaultValue={options.value}></TextField>);

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
            />,
        ];

        var isOpen = false;
        var microservice = {};
        var title = "";

        if (this.props.menuMode === "ADD_SERVICE") {
            isOpen = true;
            title = "Add Service";
        } else if (this.props.menuMode === "EDIT_SERVICE") {
            isOpen = true;
            title = "Edit Service";
            microservice = this.props.microservices.filter((microservice) => microservice.id === this.props.addPropertyServiceId)[0];
        }

        let textFields = [];
        let toggles = [];

        let editableProperties = Object.keys(microservice);
        
        for (var key in this.props.textFields) {
            let textField = this.props.textFields[key];

            let value = "";
            if (typeof(microservice[key]) === "string") {
                value = microservice[key];

                editableProperties.splice(editableProperties.indexOf(key), 1);
            }

            this._addTextField({
                textFields: textFields,
                key: key,
                label: textField.label,
                hint: textField.hint,
                value: value
            });
        }

        for (var key in this.props.toggles) {
            let toggle = this.props.toggles[key];

            let value = false;
            if (typeof(microservice[key]) === "boolean") {
                value = microservice[key];

                editableProperties.splice(editableProperties.indexOf(key), 1);
            }

            toggles.push(<Toggle key={"add_edit_dialog_" + key}
                                 ref={"input_" + key}
                                 label={toggle.label}
                                 defaultToggled={value}
                                 style={{marginTop: "2em", maxWidth: "23em"}}/>)
        }

        for (var idx in editableProperties) {
            const key = editableProperties[idx];

            if (typeof(microservice[key]) === "string") {
                this._addTextField({
                    textFields: textFields,
                    key: key,
                    label: key,
                    hint: key,
                    value: microservice[key]
                });
            } else if (typeof(microservice[key]) === "boolean") {
                toggles.push(<Toggle ref={"input_" + key}
                                     label={key}
                                     defaultToggled={microservice[key]}
                                     style={{marginTop: "2em", maxWidth: "23em"}}/>)
            } else {
                console.log("unkown property type for key \"" + key + "\" with value \"" + microservice[key] + "\"");
            }
        }

        return (
            <Dialog
                title={title}
                actions={actions}
                modal={true}
                open={isOpen}>
                {textFields}
                {toggles}
            </Dialog>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceAddServiceDialog);