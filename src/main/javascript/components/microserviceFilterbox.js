const React = require('react');
import { connect } from 'react-redux';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onType: function(eventProxy, value) {
            dispatch({
                type: 'FILTERBOX_TYPE',
                filterString: value
            });
        }
    };
};

class MicroserviceFilterbox extends React.Component {
    render() {
        return (
            <Toolbar>
                <ToolbarGroup firstChild={true} style={{marginLeft: "0.5em"}}>
                    <TextField hintText="Filter services..." onChange={this.props.onType.bind(this)}></TextField>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceFilterbox);