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
                <TextField ref="inputServiceId"
                           floatingLabelText="Service ID *"
                           hintText="eg. &quot;ZOE&quot;" ></TextField>
                <TextField style={{ marginLeft: "1em" }}
                           ref="inputLabel"
                           floatingLabelText="Label *"
                           hintText="eg. &quot;ZOE&quot;" ></TextField><br />

                <TextField ref="inputDescription"
                           floatingLabelText="Description"
                           hintText="eg. &quot;ZKDB Online Echtzeitfähig&quot;"></TextField>
                <TextField style={{ marginLeft: "1em" }}
                           ref="inputTeam"
                           floatingLabelText="Team responsible for this service"
                           hintText="eg. &quot;ZOE-Team&quot;"></TextField><br />

                <TextField ref="inputDocumentationLink"
                           floatingLabelText="Link to documentation"
                           hintText="eg. &quot;https://wiki.dm.de/ZOE&quot;"></TextField>
                <TextField style={{ marginLeft: "1em" }}
                           ref="inputMicroserviceUrl"
                           floatingLabelText="URL"
                           hintText="eg. &quot;https://zoe.dm.de&quot;"></TextField><br />

                <TextField ref="inputIpAddress"
                           floatingLabelText="IP address"
                           hintText="eg. &quot;172.23.68.213&quot;"></TextField>
                <TextField style={{ marginLeft: "1em" }}
                           ref="inputNetworkZone"
                           floatingLabelText="Network zone"
                           hintText="eg. &quot;LAN&quot;"></TextField>
            </Dialog>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceAddServiceDialog);