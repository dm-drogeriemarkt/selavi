const React = require('react');
import { connect } from 'react-redux';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';

const mapStateToProps = (state) => {
    return {
        menuMode: state.menuMode
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onType: function(eventProxy, value) {
            dispatch({
                type: 'FILTERBOX_TYPE',
                filterString: value
            });
        },
        onAddLink: function() {
            dispatch({
                type: 'ADD_LINK',
            });
        },
        onCancel: function() {
            dispatch({
                type: 'CANCEL_MENU_ACTION',
            });
        }
    };
};

class MicroserviceFilterbox extends React.Component {
    render() {

        var linkMenuItem;

        if (this.props.menuMode === 'ADD_LINK') {
            linkMenuItem = (<MenuItem primaryText="Cancel add link" onTouchTap={this.props.onCancel.bind(this)} />);
        } else {
            linkMenuItem = (<MenuItem primaryText="Add link" onTouchTap={this.props.onAddLink.bind(this)} />);
        }

        return (
            <Toolbar>
                <ToolbarGroup>
                    <ToolbarTitle text="SeLaVi - Service Landscape Visualizer" />
                </ToolbarGroup>
                <ToolbarGroup>
                    <TextField hintText="Filter services..." onChange={this.props.onType.bind(this)}></TextField>
                </ToolbarGroup>
                <ToolbarGroup>
                    <IconMenu iconButtonElement={<IconButton touch={true}><NavigationExpandMoreIcon /></IconButton>}>
                        <MenuItem primaryText="Add Service" />
                        {linkMenuItem}
                    </IconMenu>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceFilterbox);