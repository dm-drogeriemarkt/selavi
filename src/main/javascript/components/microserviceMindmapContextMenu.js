const React = require('react');
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        top: state.contextMenuTop,
        left: state.contextMenuLeft,
        contextMenuServiceId: state.contextMenuServiceId
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        onAddLink: function() {
            dispatch({
                type: 'ADD_LINK'
            });
        }
    };
};

class MicroserviceMindmapContextMenu extends React.Component {

    render() {
        const { top, left } = this.props;
        const style = {position: 'fixed', top, left, zIndex: 999};

        if (this.props.contextMenuServiceId) {
            return (
                <nav style={style} className="contextMenu">
                    <button onClick={this.props.onAddLink.bind(this)}>Add Link</button>
                </nav>
            );
        } else {
            return <nav hidden className="contextMenu"></nav>;
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceMindmapContextMenu);