import React, {Component} from 'react';
import {connect} from 'react-redux';
import {loadFrontendConfig} from '../actions/frontendConfigActions';

const style = {color: '#f69805'};

const documentationStyle = {
    color: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999,
    position: 'absolute',
    right: '0.5em',
    bottom: '0.5em'
};

const mapStateToProps = (state) => {
    return {
        frontendConfig: state.frontendConfig,
    };
};

const mapDispatchToProps = {
    loadFrontendConfig
};

export class MicroserviceDocumentationLink extends Component {

    constructor(props) {
        super(props);
        this.props.loadFrontendConfig();
    }

    render() {

        if (this.props.frontendConfig === null) {
            return <span/>;
        }

        return (
            <span style={documentationStyle}>
                <a href={this.props.frontendConfig.documentationUrl} target="_blank"
                   alt="Zur Dokumentation" style={{textDecoration: 'none'}}><span
                    style={style}>&#x025A4;</span><span style={style}>Doku</span></a>
            </span>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MicroserviceDocumentationLink);