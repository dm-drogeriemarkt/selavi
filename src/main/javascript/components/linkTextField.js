const React = require('react');

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import OpenInNew from 'material-ui/svg-icons/action/open-in-new';

class LinkTextField extends React.Component {

    _onTouchTap() {
        window.open(this.refs["textField"].getValue());
    }

    getValue() {
        return this.refs["textField"].getValue();
    }

    render() {

        let textFieldProps = Object.assign({}, this.props, {
            style: {width: "230px"},
            ref: "textField"
        });

        return (
            <div>
                <TextField {...textFieldProps}></TextField>
                <IconButton tooltip="Open link...">
                    <OpenInNew onTouchTap={this._onTouchTap.bind(this)}/>
                </IconButton>
            </div>
        );
    }
}

export default LinkTextField;