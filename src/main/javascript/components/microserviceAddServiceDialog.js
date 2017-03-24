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
            var request = {
                entity: {
                    id: this.refs.inputServiceId.getValue(),
                    label: this.refs.inputLabel.getValue(),
                    description: this.refs.inputDescription.getValue(),
                    team: this.refs.inputTeam.getValue(),
                    dmOwner: this.refs.inputDmOwner.getValue(),
                    fdOwner: this.refs.inputFdOwner.getValue(),
                    documentationLink: this.refs.inputDocumentationLink.getValue(),
                    'microservice-url': this.refs.inputMicroserviceUrl.getValue(),
                    ipAddress: this.refs.inputIpAddress.getValue(),
                    networkZone: this.refs.inputNetworkZone.getValue(),
                    isExternal: this.refs.inputIsExternal.isToggled()
                },
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

        // TODO: make validation dynamic
        // if (!this.refs.inputServiceId.getValue()) {
        //     validationMessages.inputServiceId = "Field is required!";
        //     isValid = false;
        // }
        //
        // if (!this.refs.inputLabel.getValue()) {
        //     validationMessages.inputLabel = "Field is required!";
        //     isValid = false;
        // }
        //
        // if (!this.refs.inputTeam.getValue()) {
        //     validationMessages.inputTeam = "Field is required!";
        //     isValid = false;
        // }
        //
        // if (!this.refs.inputFdOwner.getValue()) {
        //     validationMessages.inputFdOwner = "Field is required!";
        //     isValid = false;
        // }

        this.setState({validationMessages: validationMessages});
        return isValid;
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

        for (var key in microservice) {
            if (typeof(microservice[key]) === "string") {
                const rightcolumn = ((textFields.length - 1) % 3 === 0);

                let style;
                if (rightcolumn) {
                    style = { marginLeft: "1em" };
                }

                textFields.push(<TextField key={"add_edit_dialog_" + key}
                                           style={style}
                                           ref={"input_" + key}
                                           floatingLabelText={key}
                                           hintText={key}
                                           errorText={this.state.validationMessages[key]}
                                           defaultValue={microservice[key]}></TextField>);

                if (rightcolumn) {
                    textFields.push(<br key={"add_edit_dialog_br_" + textFields.length}/>);
                }

            } else if (typeof(microservice[key]) === "boolean") {

                toggles.push(<Toggle ref={"input_" + key}
                                     label={key}
                                     defaultToggled={microservice[key]}
                                     style={{marginTop: "2em", maxWidth: "23em"}}/>)
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