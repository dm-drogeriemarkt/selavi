const React = require('react');
const rest = require('rest');
const mime = require('rest/interceptor/mime');
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        contextMenuVisible: state.contextMenuVisible
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: function() {
            var client = rest.wrap(mime);
            client({
                path: '/services',
                method: 'POST',
                entity: {
                    id: this.refs.textbox.value,
                    label: this.refs.textbox.value
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
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

class MicroserviceMindmapPopup extends React.Component {

    render() {
        if (this.props.contextMenuVisible) {
            return (
                <div className="popup">
                    <input type="text" ref="textbox"></input>
                    <button onClick={this.props.onSubmit.bind(this)}>Submit</button>
                </div>
            );
        } else {
            return <div hidden className="popup"></div>;
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceMindmapPopup);