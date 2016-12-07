const React = require('react');
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        microservices: state.microservices,
        selectedService: state.selectedService
    };
};

class MicroservicePropertyList extends React.Component {

    getSelectedService() {
        const selectedService = this.props.microservices.filter(microservice => {
            return this.props.selectedService === microservice.id;
        })[0];

        return selectedService;
    }

    getPropertyList(selectedService) {
        var propertyList = [];

        for (var propertyName in selectedService) {
            if (!selectedService.hasOwnProperty(propertyName)) continue;

            var value = selectedService[propertyName];
            propertyList.push({id: propertyName, value: value});
        }
        return propertyList;
    }

    render() {
        var selectedService = this.getSelectedService();
        var propertyHtmlList = this.getPropertyList(selectedService).map(property => {
            return (
                <tr key={property.id}>
                    <td>{property.id}</td>
                    <td>{property.value}</td>
                </tr>
            )
        });

        if (!selectedService) {
            return (
                <div className="microservicePropertyList">
                    <div>Click on a service to display its properties</div>
                </div>
            )
        }

        return (
            <div className="microservicePropertyList">
                <div>Properties from service {selectedService.id}</div>
                <table >
                    <tbody>
                    <tr>
                        <th>name</th>
                        <th>value</th>
                    </tr>
                    {propertyHtmlList}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default connect(mapStateToProps)(MicroservicePropertyList);