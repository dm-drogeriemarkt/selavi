const React = require('react');
import { connect } from 'react-redux';

const rest = require('rest');
const mime = require('rest/interceptor/mime');

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const mapStateToProps = (state) => {
    return {
        menuMode: state.menuMode
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
                path: '/services',
                method: 'POST',
                entity: {
                    id: this.refs.inputServiceId.getValue(),
                    label: this.refs.inputLabel.getValue(),
                    description: this.refs.inputDescription.getValue(),
                    team: this.refs.inputTeam.getValue(),
                    documentationLink: this.refs.inputDocumentationLink.getValue(),
                    'microservice-url': this.refs.inputMicroserviceUrl.getValue(),
                    ipAddress: this.refs.inputIpAddress.getValue(),
                    networkZone: this.refs.inputNetworkZone.getValue()
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            var client = rest.wrap(mime);
            client(request).then(response => {
                client({path: '/services'}).then(response => {
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

    _isInvalid() {
        // TODO: validation
        return false;
    }

    render() {

        var isInvalid = this._isInvalid();

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.props.onCancel.bind(this)}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                disabled={isInvalid}
                onTouchTap={this.props.onSubmit.bind(this)}
            />,
        ];

        var isOpen = (this.props.menuMode === "ADD_SERVICE");

        return (
            <Dialog
                title="Add Service"
                actions={actions}
                modal={true}
                open={isOpen}>
                <TextField ref="inputServiceId" hintText="Service ID *" required></TextField>
                <TextField style={{ marginLeft: "1em" }} ref="inputLabel" hintText="Label *" required></TextField><br />

                <TextField ref="inputDescription" hintText="Description"></TextField>
                <TextField style={{ marginLeft: "1em" }} ref="inputTeam" hintText="Team responsible for this service"></TextField><br />

                <TextField ref="inputDocumentationLink" hintText="Link to documentation"></TextField>
                <TextField style={{ marginLeft: "1em" }} ref="inputMicroserviceUrl" hintText="URL"></TextField><br />

                <TextField ref="inputIpAddress" hintText="IP address"></TextField>
                <TextField style={{ marginLeft: "1em" }} ref="inputNetworkZone" hintText="Network zone"></TextField>
            </Dialog>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceAddServiceDialog);