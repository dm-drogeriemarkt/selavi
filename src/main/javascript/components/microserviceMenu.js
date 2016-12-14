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
        onAddLink: function() {
            dispatch({
                type: 'ADD_LINK',
            });
        },
        onSubmit: function(event) {
            event.preventDefault();

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
                        id: this.refs.inputServiceId.value,
                        label: this.refs.inputLabel.value,
                        description: this.refs.inputDescription.value,
                        team: this.refs.inputTeam.value,
                        documentationLink: this.refs.inputDocumentationLink.value,
                        'microservice-url': this.refs.inputMicroserviceUrl.value,
                        ipAddress: this.refs.inputIpAddress.value,
                        networkZone: this.refs.inputNetworkZone.value
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
        },
        onCancel: function() {
            dispatch({
                type: 'CANCEL_MENU_ACTION',
            });
        }
    };
};

class MicroserviceMenu extends React.Component {

    render() {
        switch (this.props.menuMode) {
            case 'ADD_SERVICE':
                return (
                    <div className="microserviceMenu">
                        <div>Add Service</div>
                        <form onSubmit={this.props.onSubmit.bind(this)}>
                            <input type="text" ref="inputServiceId" placeholder="Service ID *" required></input>
                            <input type="text" ref="inputLabel" placeholder="Label *" required></input>
                            <input type="text" ref="inputDescription" placeholder="Description"></input>
                            <input type="text" ref="inputTeam" placeholder="Team responsible for this service"></input>
                            <input type="text" ref="inputDocumentationLink" placeholder="Link to documentation"></input>
                            <input type="text" ref="inputMicroserviceUrl" placeholder="URL"></input>
                            <input type="text" ref="inputIpAddress" placeholder="IP address"></input>
                            <input type="text" ref="inputNetworkZone" placeholder="Network zone"></input>
                            <div className="formButtons">
                                <input type="submit" value="Submit"></input>
                                <input type="button" onClick={this.props.onCancel} value="Cancel"></input>
                            </div>
                        </form>
                    </div>
                );
            case 'ADD_PROPERTY':
                return (
                    <div className="microserviceMenu">
                        <div>Add Property for Service {this.props.addLinkConsumerId}</div>
                        <form onSubmit={this.props.onSubmit.bind(this)}>
                            <input type="text" ref="propertyId" placeholder="Property ID *" required></input>
                            <input type="text" ref="propertyValue" placeholder="Property Value *" required></input>
                            <div className="formButtons">
                                <input type="submit" value="Submit"></input>
                                <input type="button" onClick={this.props.onCancel} value="Cancel"></input>
                            </div>
                        </form>
                    </div>
                );
            case 'ADD_LINK':
                return (
                    <div className="microserviceMenu">
                        <div>Add Link Mode: Draw line between nodes!</div>
                        <div className="buttons">
                            <button onClick={this.props.onCancel}>Cancel</button>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="microserviceMenu">
                        <div>SeLaVi - Service Landscape Visualizer</div>
                        <div className="buttons">
                            <button onClick={this.props.onAddService}>Add Service</button>
                            <button onClick={this.props.onAddLink}>Add Link</button>
                        </div>
                    </div>
                );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceMenu);