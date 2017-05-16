const React = require('react');
import { connect } from 'react-redux';

import Snackbar from 'material-ui/Snackbar';

const mapStateToProps = (state) => {
    return {
        menuMode: state.menuMode,
        globalErrorMessage: state.globalErrorMessage
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRequestClose: function() {
            dispatch({
                type: 'CANCEL_MENU_ACTION'
            });
        }
    };
};

class MicroserviceSnackbar extends React.Component {
    render() {

        var open = false;
        var message= "";

        if (this.props.menuMode === 'ADD_LINK') {
            open = true;
            message = "Add link mode: draw connection between services!"
        } else if (this.props.globalErrorMessage) {
            open = true;
            message = this.props.globalErrorMessage
        }
        
        return (
            <Snackbar
                open={open}
                message={message}
                autoHideDuration={0}
                onRequestClose={this.props.onRequestClose.bind(this)}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceSnackbar);