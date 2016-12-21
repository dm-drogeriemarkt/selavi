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

        if (!this.refs.inputServiceId.getValue()) {
            validationMessages.inputServiceId = "Field is required!";
            isValid = false;
        }

        if (!this.refs.inputLabel.getValue()) {
            validationMessages.inputLabel = "Field is required!";
            isValid = false;
        }

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

        return (
            <Dialog
                title={title}
                actions={actions}
                modal={true}
                open={isOpen}>
                <TextField ref="inputServiceId"
                           floatingLabelText="Service ID *"
                           hintText="eg. &quot;ZOE&quot;"
                           errorText={this.state.validationMessages.inputServiceId}
                           defaultValue={microservice.id}></TextField>
                <TextField style={{ marginLeft: "1em" }}
                           ref="inputLabel"
                           floatingLabelText="Label *"
                           hintText="eg. &quot;ZOE&quot;"
                           errorText={this.state.validationMessages.inputLabel}
                           defaultValue={microservice.label}></TextField><br />

                <TextField ref="inputDescription"
                           floatingLabelText="Description"
                           hintText="eg. &quot;ZKDB Online Echtzeitfähig&quot;"
                           defaultValue={microservice.description}></TextField>
                <TextField style={{ marginLeft: "1em" }}
                           ref="inputTeam"
                           floatingLabelText="Team responsible for this service"
                           hintText="eg. &quot;ZOE-Team&quot;"
                           defaultValue={microservice.team}></TextField><br />

                <TextField ref="inputDocumentationLink"
                           floatingLabelText="Link to documentation"
                           hintText="eg. &quot;https://wiki.dm.de/ZOE&quot;"
                           defaultValue={microservice.documentationLink}></TextField>
                <TextField style={{ marginLeft: "1em" }}
                           ref="inputMicroserviceUrl"
                           floatingLabelText="URL"
                           hintText="eg. &quot;https://zoe.dm.de&quot;"
                           defaultValue={microservice['microservice-url']}></TextField><br />

                <TextField ref="inputIpAddress"
                           floatingLabelText="IP address"
                           hintText="eg. &quot;172.23.68.213&quot;"
                           defaultValue={microservice.ipAddress}></TextField>
                <TextField style={{ marginLeft: "1em" }}
                           ref="inputNetworkZone"
                           floatingLabelText="Network zone"
                           hintText="eg. &quot;LAN&quot;"
                           defaultValue={microservice.networkZone}></TextField><br />

                <Toggle ref="inputIsExternal"
                        label="External service (eg., not a microservice)"
                        defaultToggled={microservice.isExternal}
                        style={{marginTop: "2em", maxWidth: "23em"}}/>

            </Dialog>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceAddServiceDialog);