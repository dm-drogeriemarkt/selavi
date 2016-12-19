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

    _shouldFilterOut(microservice, filterString) {
        return (filterString && microservice.label) ? (microservice.label.toLowerCase().indexOf(filterString.toLowerCase()) === -1) : false;
    }

    render() {
        var filterHits = [];
        var filteredOut = [];

        this.props.microservices.forEach(microservice => {
            if (this._shouldFilterOut(microservice, this.props.filterString)) {
                filteredOut.push({microservice: microservice, filteredOut: true})
            } else {
                filterHits.push({microservice: microservice});
            }
        });

        var microservices =
            filterHits.concat(filteredOut)
            .map(wrapper => {
                var microservice = wrapper.microservice;

                var selected = (this.props.selectedService === microservice.id);

                var style = {};

                if (wrapper.filteredOut) {
                    style.color = "lightgrey"
                }

                return (
                    <TableRow selected={selected} className="microserviceListEntry" key={microservice.id} style={style}>
                        <TableRowColumn>{microservice.id}</TableRowColumn>
                        <TableRowColumn><a
                            href={microservice['microservice-url']}>{microservice['microservice-url']}</a></TableRowColumn>
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