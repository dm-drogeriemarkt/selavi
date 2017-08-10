import React from 'react';
import { connect } from 'react-redux';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
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
import { onAddLink, onAddService, onCancel, onLogin, onLogout, onType } from '../actions/microserviceFilderboxActions';

const mapStateToProps = (state) => {
    return {
        menuMode: state.menuMode,
        loggedInUser: state.loggedInUser,
        filterString: state.filterString,
        stage: state.stage
    };
};

const mapDispatchToProps = {
    onType,
    onLogin,
    onLogout,
    onAddLink,
    onAddService,
    onCancel
};

export class MicroserviceFilterbox extends React.Component {

    constructor(props) {
        super(props);
        this.state = { linkUrl: undefined }
    }

    handleLinkAlertOpen() {
        let url = document.location.origin + document.location.pathname + "?stage=" + this.props.stage;

        if (this.props.filterString) {
            url += ("&filter=" + this.props.filterString);
        }

        this.setState({ linkUrl: url });
    }

    handleLinkAlertClose() {
        this.setState({ linkUrl: undefined });
    }

    render() {

        let avatarToolGroup;
        const avatarStyle = { margin: 5 };

        let loginLogoutMenuItem;
        let addServiceMenuItem;
        let linkMenuItem;

        if (this.props.loggedInUser) {
            let avatar;

            if (this.props.loggedInUser.thumbnailPhoto) {
                avatar =
                  <Avatar src={"data:image/png;base64," + this.props.loggedInUser.thumbnailPhoto} style={avatarStyle}/>;
            } else {
                avatar = <Avatar icon={<SentimentVerySatisfiedIcon/>} style={avatarStyle}/>;
            }

            avatarToolGroup = (<ToolbarGroup>
                {avatar}{this.props.loggedInUser.displayName}
            </ToolbarGroup>);

            loginLogoutMenuItem = (<MenuItem primaryText="Logout" onTouchTap={this.props.onLogout}/>);

            if (this.props.menuMode === 'ADD_LINK') {
                linkMenuItem = (<MenuItem primaryText="Cancel add link" onTouchTap={this.props.onCancel}/>);
            } else {
                linkMenuItem = (<MenuItem primaryText="Add link" onTouchTap={this.props.onAddLink}/>);
            }

            addServiceMenuItem = (
              <MenuItem primaryText="Add Service" onTouchTap={this.props.onAddService}/>);
        } else {
            avatarToolGroup = (<ToolbarGroup>
                <Avatar icon={<SentimentNeutralIcon/>} style={avatarStyle}/>Not logged in
            </ToolbarGroup>);

            loginLogoutMenuItem = (<MenuItem primaryText="Login" onTouchTap={this.props.onLogin}/>);
        }

        return (
          <Toolbar>
              {avatarToolGroup}
              <ToolbarGroup>
                  <ToolbarTitle text="SeLaVi - Service Landscape Visualizer"/>
              </ToolbarGroup>
              <ToolbarGroup>
                  <TextField hintText="Filter services... (label, tags)" value={this.props.filterString}
                             onChange={this.props.onType.bind(this)}/>
              </ToolbarGroup>
              <ToolbarGroup>
                  <IconMenu iconButtonElement={<IconButton touch={true}><NavigationExpandMoreIcon /></IconButton>}>
                      {loginLogoutMenuItem}
                      {addServiceMenuItem}
                      {linkMenuItem}
                      <MenuItem primaryText="Share link" onTouchTap={this.handleLinkAlertOpen.bind(this)}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(MicroserviceFilterbox);