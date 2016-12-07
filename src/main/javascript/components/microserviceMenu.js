const React = require('react');
const rest = require('rest');
const mime = require('rest/interceptor/mime');
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        menuMode: state.menuMode,
        addLinkConsumerId: state.addLinkConsumerId,
        addPropertyServiceId: state.addPropertyServiceId
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAddService: function() {
            dispatch({
                type: 'ADD_SERVICE',
            });
        },
        onSubmit: function() {
            var request;

            if (this.props.menuMode === 'ADD_PROPERTY') {
                var entity = {};
                entity[this.refs.propertyId.value] = this.refs.propertyValue.value;

                request = {
                    path: '/services/' + this.props.addPropertyServiceId + '/properties',
                    method: 'PUT',
                    entity: entity,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            } else if (this.props.menuMode === 'ADD_SERVICE') {
                request = {
                    path: '/services',
                    method: 'POST',
                    entity: {
                        id: this.refs.serviceId.value,
                        label: this.refs.serviceId.value
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
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

class MicroserviceMindmapPopup extends React.Component {

    render() {
        switch (this.props.menuMode) {
            case 'ADD_SERVICE':
                return (
                    <div className="microserviceMenu">
                        <div>Add Service: Service ID:</div>
                        <input type="text" ref="serviceId"></input>
                        <button onClick={this.props.onSubmit.bind(this)}>Submit</button>
                    </div>
                );
            case 'ADD_PROPERTY':
                return (
                    <div className="microserviceMenu">
                        <div>Add Property: ID / Value</div>
                        <input type="text" ref="propertyId"></input>
                        <input type="text" ref="propertyValue"></input>
                        <button onClick={this.props.onSubmit.bind(this)}>Submit</button>
                    </div>
                );
            case 'ADD_LINK':
                return (
                    <div className="microserviceMenu">
                        <div>Add Link for Service {this.props.addLinkConsumerId}: select consumed Service!</div>
                    </div>
                );
            default:
                return (
                    <div className="microserviceMenu">
                        <button onClick={this.props.onAddService}>Add Service</button>
                    </div>
                );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceMindmapPopup);