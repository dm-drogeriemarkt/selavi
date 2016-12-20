const React = require('react');
import { connect } from 'react-redux';

import Snackbar from 'material-ui/Snackbar';

const mapStateToProps = (state) => {
    return {
        menuMode: state.menuMode
    };
};

class MicroserviceSnackbar extends React.Component {
    render() {

        var open = (this.props.menuMode === 'ADD_LINK');

        return (
            <Snackbar
                open={open}
                message="Add link mode: draw connection between services!"
                autoHideDuration={0}
            />
        );
    }
}

export default connect(mapStateToProps) (MicroserviceSnackbar);