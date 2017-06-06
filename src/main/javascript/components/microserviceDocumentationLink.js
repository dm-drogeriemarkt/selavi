const React = require('react');
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        microservices: state.microservices
    };
};

export class MicroserviceDocumentationLink extends React.Component {
    render() {

        return (
            <span style={{color: "rgba(0, 0, 0, 0.4)", zIndex: 999, position: 'absolute', right: '0.5em', bottom: '0.5em'}}>
                <a href="https://example.com/display/ZOE/Anbindung+neuer+Webservices" target="_blank" alt="Zur Dokumentation" style={{textDecoration: 'none'}}><span style={{color: "#f69805"}}>&#x025A4;</span><span style={{color: "#f69805"}}>Doku</span></a>
            </span>

        );
    }
}

export default connect(mapStateToProps) (MicroserviceDocumentationLink);