const React = require('react');
import { connect } from 'react-redux';

import Snackbar from 'material-ui/Snackbar';

const mapStateToProps = (state) => {
    return {
        menuMode: state.menuMode,
        logoutErrorMessage: state.logoutErrorMessage
    };
};

class MicroserviceSnackbar extends React.Component {
    render() {

        var open = false;
        var message= "";

        if (this.props.menuMode === 'ADD_LINK') {
            open = true;
            message = "Add link mode: draw connection between services!"
        } else if (this.props.logoutErrorMessage) {
            open = true;
            message = this.props.logoutErrorMessage
        }
        
        return (
            <Snackbar
                open={open}
                message={message}
                autoHideDuration={0}
            />
        );
    }
}

export default connect(mapStateToProps) (MicroserviceSnackbar);