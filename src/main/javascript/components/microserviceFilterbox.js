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
                filterString: this.refs.filterbox.value
            });
        }
    };
};

class MicroserviceFilterbox extends React.Component {
    render() {
        return (
            <div className="microserviceFilterbox">
                <input ref="filterbox" placeholder="Filter services..." onInput={this.props.onType.bind(this)}></input>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceFilterbox);