const React = require('react');
import { connect } from 'react-redux';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Subheader from 'material-ui/Subheader';

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
        },
        onNestedListToggle: function() {
            dispatch({
                type: 'MICROSERVICE_LIST_RESIZE'
            });
        }
    };
};

class MicroserviceList extends React.Component {

    _shouldFilterOut(microservice, filterString) {
        return (filterString && microservice.label) ? (microservice.label.toLowerCase().indexOf(filterString.toLowerCase()) === -1) : false;
    }

    _getPropertyList(microservice) {
        var propertyList = [<Subheader key={microservice.id + '_propHeader'}>Properties</Subheader>];

        for (var propertyName in microservice) {
            if (!microservice.hasOwnProperty(propertyName)) continue;

            var value = JSON.stringify(microservice[propertyName]);
            var nestedItems = [];

            if (Array.isArray(microservice[propertyName])) {
                microservice[propertyName].forEach((propValue, index) => {
                    var nestedValue = JSON.stringify(propValue);

                    nestedItems.push(<ListItem key={microservice.id + '_' + propertyName + '_' + index}
                                               primaryText={nestedValue}/>);
                });
            }

            propertyList.push(<ListItem key={microservice.id + '_' + propertyName}
                                        primaryText={propertyName}
                                        secondaryText={value}
                                        nestedItems={nestedItems}
                                        secondaryTextLines={2}/>);
        }
        return propertyList;
    }

    _onNestedListToggle(listItem) {
        if (listItem.state.open) {
            this.refs.microserviceList.parentElement.classList.add("wide");
        } else {
            this.refs.microserviceList.parentElement.classList.remove("wide");
        }
    }

    componentDidMount() {
        this.refs.microserviceList.parentElement.addEventListener("transitionend", this.props.onNestedListToggle.bind(this));
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

                var properties = this._getPropertyList(microservice);

                return (
                    <ListItem selected={selected}
                              className="microserviceListEntry"
                              key={microservice.id}
                              style={style}
                              primaryText={microservice.id}
                              secondaryText={microservice['microservice-url']}
                              leftCheckbox={<Checkbox checked={selected} onCheck={(event, isInputChecked) => this.props.onSelectService(microservice.id, isInputChecked)}/>}
                              nestedItems={properties}
                              onNestedListToggle={this._onNestedListToggle.bind(this)}
                              primaryTogglesNestedList={true}/>
                )
            });
        return (
            <div className="microserviceList" ref="microserviceList">
                <List>
                    <Subheader>Services</Subheader>
                    {microservices}
                </List>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceList);