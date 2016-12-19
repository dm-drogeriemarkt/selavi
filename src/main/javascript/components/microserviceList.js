const React = require('react');
import { connect } from 'react-redux';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import SubHeader from 'material-ui/SubHeader';
import CloudQueue from 'material-ui/svg-icons/file/cloud-queue';
import Cloud from 'material-ui/svg-icons/file/cloud';

const mapStateToProps = (state) => {
    return {
        microservices: state.microservices,
        selectedService: state.selectedService,
        filterString: state.filterString
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSelectService: function(selectedServiceId, isInputChecked) {
            dispatch({
                type: 'MICROSERVICE_NODE_SELECTED',
                selectedServiceId: isInputChecked ? selectedServiceId : undefined
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

        var microservices = filterHits.concat(filteredOut)
            .map(wrapper => {
                var microservice = wrapper.microservice;

                var selected = (this.props.selectedService === microservice.id);

                var style = {};

                if (wrapper.filteredOut) {
                    style.color = "lightgrey"
                }

                var icon = microservice.isExternal ? (<CloudQueue/>) : (<Cloud/>)

                return (
                    <ListItem selected={selected}
                              className="microserviceListEntry"
                              key={microservice.id}
                              style={style}
                              primaryText={microservice.id}
                              secondaryText={microservice['microservice-url']}
                              leftCheckbox={<Checkbox checked={selected} onCheck={(isInputChecked) => this.props.onSelectService(microservice.id, isInputChecked)}/>}
                              rightIcon={icon}/>
                )
            });
        return (
            <div className="microserviceList">
                <List>
                    <SubHeader>Services</SubHeader>
                    {microservices}
                </List>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceList);