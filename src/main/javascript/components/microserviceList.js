const React = require('react');
import {connect} from "react-redux";
import {List, ListItem} from "material-ui/List";
import Checkbox from "material-ui/Checkbox";
import Subheader from "material-ui/Subheader";

import {isFilterHit, shouldFilterOut} from "./../shared/filterUtils";

const mapStateToProps = (state) => {
    return {
        microservices: state.microservices,
        selectedService: state.selectedService,
        filterString: state.filterString,
        bitbucketDetails: state.bitbucketDetails
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSelectService: function (selectedServiceId, isInputChecked) {
            dispatch({
                type: 'MICROSERVICE_NODE_SELECTED',
                selectedServiceId: isInputChecked ? selectedServiceId : undefined
            });
        },
        onNestedListToggle: function () {
            dispatch({
                type: 'MICROSERVICE_LIST_RESIZE'
            });
        }
    };
};

class MicroserviceList extends React.Component {

    _getPropertyList(microservice, filterString) {
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

            var style = {};

            if (isFilterHit(propertyName, microservice[propertyName], filterString)) {
                style = {backgroundColor: "rgb(0, 188, 212)"}
            }

            propertyList.push(<ListItem key={microservice.id + '_' + propertyName}
                                        primaryText={propertyName}
                                        secondaryText={value}
                                        nestedItems={nestedItems}
                                        style={style}
                                        secondaryTextLines={2}/>);
        }
        return propertyList;
    }

    _onNestedListToggle(listItem) {
        if (listItem.state.open) {
            this.refs.microserviceList.classList.add("wide");
        } else {
            this.refs.microserviceList.classList.remove("wide");
        }
    }

    componentDidMount() {
        this.refs.microserviceList.addEventListener("transitionend", this.props.onNestedListToggle.bind(this));
    }

    render() {
        var filterHits = [];
        var filteredOut = [];

        this.props.microservices.forEach(microservice => {
            if (shouldFilterOut(microservice, this.props.filterString)) {
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

                var primaryText;

                if (wrapper.filteredOut) {
                    style.color = "lightgrey"
                    primaryText = <span>{microservice.id} &#x0272A;</span>
                } else {
                    if (microservice.external) {
                        primaryText = <span>{microservice.id} <span style={{color: "#f69805"}}>&#x0272A;</span></span>
                    } else {
                        primaryText = <span>{microservice.id} <span style={{color: "#19c786"}}>&#x0272A;</span></span>
                    }
                }

                var properties = this._getPropertyList(microservice, this.props.filterString);

                var nestedItems = [];
                if (Array.isArray(this.props.bitbucketDetails[this.props.selectedService])) {
                    this.props.bitbucketDetails[this.props.selectedService].forEach((propValue, index) => {
                        nestedItems.push(<ListItem key={microservice.id + '_bitbucket_' + index}
                                                   primaryText={propValue.emailAddress}
                                                   secondaryText={propValue.numberOfCommits}/>);
                    });
                }
                properties.push(<ListItem key={microservice.id + '_' + "bitbucketDetails"}
                                          primaryText="Bitbucket"
                                          nestedItems={nestedItems}
                                          style={style}
                                          secondaryTextLines={2}/>);

                return (
                    <ListItem selected={selected}
                              className="microserviceListEntry"
                              key={microservice.id}
                              style={style}
                              primaryText={primaryText}
                              secondaryText={microservice['microservice-url']}
                              leftCheckbox={<Checkbox checked={selected}
                                                      onCheck={(event, isInputChecked) => this.props.onSelectService(microservice.id, isInputChecked)}/>}
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

export default connect(mapStateToProps, mapDispatchToProps)(MicroserviceList);
