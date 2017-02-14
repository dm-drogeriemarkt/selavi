const React = require('react');

import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        top: state.contextMenuTop,
        left: state.contextMenuLeft,
        contextMenuServiceId: state.contextMenuServiceId,
        contextMenuFromId: state.contextMenuFromId,
        contextMenuToId: state.contextMenuToId
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        onAddProperty: function() {
            dispatch({
                type: 'EDIT_SERVICE'
            });
        },
        onDeleteService: function() {
            dispatch({
                type: 'DELETE_SERVICE'
            });
        },
        onDeleteLink: function() {
            dispatch({
                type: 'DELETE_LINK'
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
                    <button onClick={this.props.onAddProperty}>Edit Service</button>
                    <button onClick={this.props.onDeleteService}>Delete Service</button>
                </nav>
            );
        } else if (this.props.contextMenuFromId && this.props.contextMenuToId) {
            return (
                <nav style={style} className="contextMenu">
                    <button onClick={this.props.onDeleteLink}>Delete Link</button>
                </nav>
            );
        } else {
            return <nav hidden className="contextMenu"></nav>;
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceMindmapContextMenu);