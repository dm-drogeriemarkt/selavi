const React = require('react');
import { connect } from 'react-redux';

const rest = require('rest');
const mime = require('rest/interceptor/mime');
const errorCode = require('rest/interceptor/errorCode');

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

const mapStateToProps = (state) => {
    return {
        menuMode: state.menuMode,
        deleteServiceId: state.deleteServiceId,
        deleteServiceErrorMessage: state.deleteServiceErrorMessage
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
                path: '/selavi/services/' + this.props.deleteServiceId,
                method: 'DELETE'
            }

            var client = rest.wrap(mime).wrap(errorCode);
            client(request).then(response => {
                client({path: '/selavi/services'}).then(response => {
                    dispatch({
                        type: 'FETCH_MICROSERVICES_SUCCESS',
                        response: response
                    });
                });
            }, response => {
                dispatch({
                    type: 'DELETE_SERVICE_FAILED',
                    message: response.entity.message
                });
            });
        }
    };
};

export class MicroserviceDeleteServiceDialog extends React.Component {

    render() {

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.props.onCancel.bind(this)}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onTouchTap={this.props.onSubmit.bind(this)}
            />,
        ];

        const isOpen = (this.props.menuMode === 'DELETE_SERVICE');
        const title = 'Confirm deletion of service with id ' + this.props.deleteServiceId;

        const isErrorMessageOpen = (isOpen && !!this.props.deleteServiceErrorMessage);
        const errorMessage = '' + this.props.deleteServiceErrorMessage;

        return (
            <div>
                <Dialog
                    title={title}
                    actions={actions}
                    modal={true}
                    open={isOpen}>
                </Dialog>
                <Snackbar
                    open={isErrorMessageOpen}
                    message={errorMessage}
                    autoHideDuration={0}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceDeleteServiceDialog);