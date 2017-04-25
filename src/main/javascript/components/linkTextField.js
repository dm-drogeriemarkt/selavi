const React = require('react');

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import OpenInNew from 'material-ui/svg-icons/action/open-in-new';
import {grey300} from 'material-ui/styles/colors'

class LinkTextField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {linkActive: !!props.defaultValue};
    }

    _onChange(event, newValue) {
        this.setState({linkActive: !!event.target.value});
    }

    _onTouchTap() {
        let value = this.refs["textField"].getValue();
        if (value) {
            window.open(value);
        }
    }

    getValue() {
        return this.refs["textField"].getValue();
    }

    render() {

        let textFieldProps = Object.assign({}, this.props, {
            ref: "textField"
        });
        textFieldProps.style.width =  "31em";

        let buttonProps = {};
        let iconProps = {
            onTouchTap: this._onTouchTap.bind(this)
        }

        if (!this.state.linkActive) {
            iconProps.color = grey300;
        } else {
            buttonProps.tooltip = "Open link...";
        }

        return (
            <div>
                <TextField {...textFieldProps} id="usefull" onChange={this._onChange.bind(this)}></TextField>
                <IconButton {...buttonProps}>
                    <OpenInNew {...iconProps}/>
                </IconButton>
            </div>
        );
    }
}

export default LinkTextField;