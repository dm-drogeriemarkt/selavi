const React = require('react');
import { connect } from 'react-redux';

const rest = require('rest');
const mime = require('rest/interceptor/mime');
const errorCode = require('rest/interceptor/errorCode');

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import SentimentNeutralIcon from 'material-ui/svg-icons/social/sentiment-neutral';
import SentimentVerySatisfiedIcon from 'material-ui/svg-icons/social/sentiment-very-satisfied';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const mapStateToProps = (state) => {
    return {
        menuMode: state.menuMode,
        loggedInUser: state.loggedInUser,
        filterString: state.filterString,
        stage: state.stage
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
        onLogin: function() {
            dispatch({
                type: 'LOGIN',
            });
        },
        onLogout: function() {
            var request = {
                method: 'POST',
                path: '/selavi/logout'
            }

            var client = rest.wrap(mime).wrap(errorCode);
            client(request).then(response => {
                dispatch({
                    type: 'LOGOUT_SUCCESS'
                });
            }, response => {
                dispatch({
                    type: 'LOGOUT_FAILED',
                    message: response.entity.message
                });
            });
        },
        onAddLink: function() {
            dispatch({
                type: 'ADD_LINK',
            });
        },
        onAddService: function() {
            dispatch({
                type: 'ADD_SERVICE',
            });
        },
        onCancel: function() {
            dispatch({
                type: 'CANCEL_MENU_ACTION',
            });
        }
    };
};

export class MicroserviceFilterbox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {linkUrl: undefined}
    }

    handleLinkAlertOpen() {
        var url = document.location.origin + document.location.pathname + "?stage=" + this.props.stage;

        if (this.props.filterString) {
            url += ("&filter=" + this.props.filterString);
        }

        this.setState({linkUrl: url});
    }

    handleLinkAlertClose() {
        this.setState({linkUrl: undefined});
    }

    render() {

        var avatarToolGroup;
        const avatarStyle = {margin: 5};

        var loginLogoutMenuItem;
        var addServiceMenuItem;
        var linkMenuItem;

        if (this.props.loggedInUser) {
            var avatar;

            if (this.props.loggedInUser.thumbnailPhoto) {
                avatar = <Avatar src={"data:image/png;base64," + this.props.loggedInUser.thumbnailPhoto} style={avatarStyle}/>;
            } else {
                avatar = <Avatar icon={<SentimentVerySatisfiedIcon/>} style={avatarStyle}/>;
            }

            avatarToolGroup = (<ToolbarGroup>
                {avatar}{this.props.loggedInUser.displayName}
            </ToolbarGroup>);

            loginLogoutMenuItem = (<MenuItem primaryText="Logout" onTouchTap={this.props.onLogout.bind(this)} />);

            if (this.props.menuMode === 'ADD_LINK') {
                linkMenuItem = (<MenuItem primaryText="Cancel add link" onTouchTap={this.props.onCancel.bind(this)} />);
            } else {
                linkMenuItem = (<MenuItem primaryText="Add link" onTouchTap={this.props.onAddLink.bind(this)} />);
            }

            addServiceMenuItem = (<MenuItem primaryText="Add Service" onTouchTap={this.props.onAddService.bind(this)} />);
        } else {
            avatarToolGroup = (<ToolbarGroup>
                <Avatar icon={<SentimentNeutralIcon/>} style={avatarStyle}/>Not logged in
            </ToolbarGroup>);

            loginLogoutMenuItem = (<MenuItem primaryText="Login" onTouchTap={this.props.onLogin.bind(this)} />);
        }

        return (
            <Toolbar>
                {avatarToolGroup}
                <ToolbarGroup>
                    <ToolbarTitle text="SeLaVi - Service Landscape Visualizer" />
                </ToolbarGroup>
                <ToolbarGroup>
                    <TextField hintText="Filter services..." value={this.props.filterString} onChange={this.props.onType.bind(this)}></TextField>
                </ToolbarGroup>
                <ToolbarGroup>
                    <IconMenu iconButtonElement={<IconButton touch={true}><NavigationExpandMoreIcon /></IconButton>}>
                        {loginLogoutMenuItem}
                        {addServiceMenuItem}
                        {linkMenuItem}
                        <MenuItem primaryText="Share link" onTouchTap={this.handleLinkAlertOpen.bind(this)} />
                    </IconMenu>
                </ToolbarGroup>
                <Dialog
                    title="Link to current SeLaVi view"
                    actions={<FlatButton
                        label="Ok"
                        primary={true}
                        onTouchTap={this.handleLinkAlertClose.bind(this)}
                    />}
                    modal={false}
                    open={!!this.state.linkUrl}
                    onRequestClose={this.handleLinkAlertClose.bind(this)}
                >
                    <span>{this.state.linkUrl}</span>
                </Dialog>
            </Toolbar>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceFilterbox);