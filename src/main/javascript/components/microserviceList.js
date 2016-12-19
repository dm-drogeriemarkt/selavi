const React = require('react');
import { connect } from 'react-redux';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

const mapStateToProps = (state) => {
    return {
        microservices: state.microservices,
        selectedService: state.selectedService,
        filterString: state.filterString
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSelectService: function(selectedRows) {

            var selectedServiceId = (selectedRows && selectedRows.length === 1) ?
                this.props.microservices[selectedRows[0]].id : undefined;

            dispatch({
                type: 'MICROSERVICE_NODE_SELECTED',
                selectedServiceId: selectedServiceId
            });
        }
    };
};

class MicroserviceList extends React.Component {
    render() {
        var microservices = this.props.microservices.map(microservice => {
            var selected = (this.props.selectedService === microservice.id);
            var filterHit = (this.props.filterString && microservice.label) ? (microservice.label.toLowerCase().indexOf(this.props.filterString.toLowerCase()) != -1) : false;

            var filterHitClass = this.props.filterHit ? "filterHit" : "";
            var className = `microserviceListEntry ${filterHitClass}`;

            return (
                <TableRow selected={selected} className={className} key={microservice.id}>
                    <TableRowColumn>{microservice.id}</TableRowColumn>
                    <TableRowColumn><a href={microservice['microservice-url']}>{microservice['microservice-url']}</a></TableRowColumn>
                    <TableRowColumn>{microservice.isExternal + ""}</TableRowColumn>
                </TableRow>
            )
        });
        return (
            <div className="microserviceList">
                <Table onRowSelection={this.props.onSelectService.bind(this)}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>ID</TableHeaderColumn>
                            <TableHeaderColumn>Url</TableHeaderColumn>
                            <TableHeaderColumn>External?</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {microservices}
                    </TableBody>
                </Table>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceList);