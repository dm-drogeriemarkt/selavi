const React = require('react');
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onType: function() {
            dispatch({
                type: 'FILTERBOX_TYPE',
                filterString: ''
            });
        }
    };
};

class MicroserviceFilterbox extends React.Component {
    render() {
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

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceFilterbox);