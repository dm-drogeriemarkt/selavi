const React = require('react');
import {connect} from "react-redux";
import MicroserviceMindmapContextMenu from "./microserviceMindmapContextMenu";

import { onSelectMicroserviceNode, onContextMenuOpen, onAddLink } from './../actions/microserviceMindmapActions'

const mapStateToProps = (state) => {
    return {
        microservices: state.microservices,
        menuMode: state.menuMode,
        filterString: state.filterString
    };
};

const mapDispatchToProps = {
    onSelectMicroserviceNode,
    onContextMenuOpen,
    onAddLink
};

export class MicroserviceMindmap extends React.Component {

    onContextMenuHandler(params) {
        params.event.preventDefault();

        const nodeId = this._network.getNodeAt(params.pointer.DOM);

        if (nodeId) {
            // right click does not select node!
            this._network.selectNodes([nodeId]);
        } else {
            this._network.unselectAll();
        }
        this.props.onContextMenuOpen(params, nodeId);
    }

    onAddLinkHandler(edgeData, callback) {
        callback(edgeData);
        this.props.onAddLink(edgeData);
    }

    componentDidMount() {
        this.updateMindmap();
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.filterString !== this.props.filterString) {
            // we are filtering, no need to re-draw the graph itself
            this.props.microservices.forEach(microservice => {
                var filterHit = (nextProps.filterString && microservice.label) ? (microservice.label.toLowerCase().indexOf(nextProps.filterString.toLowerCase()) != -1) : false;

                if (filterHit) {
                    this._network.body.data.nodes.update([{
                        id: microservice.id,
                        shadow: {
                            color: "#15ff8d"
                        }
                    }]);
                } else {
                    this._network.body.data.nodes.update([{
                        id: microservice.id,
                        shadow: {
                            color: "grey"
                        }
                    }]);
                }
            }, this);

            return false;
        } else if (nextProps.menuMode === 'ADD_LINK') {
            // we adding a connection between services, no need to re-draw the graph itself
            this._network.addEdgeMode();

            return false;
        }

        return true;
    }

    componentDidUpdate() {
        this._network.disableEditMode();
        this.updateMindmap();
    }

    updateMindmap() {
        var microservices = this.props.microservices.map(microservice => {
            if (microservice.isExternal) {
                microservice.color = "orange";
            } else {
                microservice.color = "lightblue";
            }
            return microservice;
        });

        // create an array with nodes
        var nodes = new vis.DataSet(microservices);

        var edgeArray = [];

        microservices.filter(function (el) {
            return el.consumes;
        }).forEach(function (el) {
            el.consumes.forEach(function (consumer) {
                edgeArray.push({
                    from: el.id,
                    to: consumer
                });
            });
        });

        var edges = new vis.DataSet(edgeArray);

        // create a network
        var data = {
            nodes: nodes,
            edges: edges
        };

        if (!this._network) {
            var options = {
                nodes: {
                    borderWidth: 2,
                    shadow: true,
                    font: {color: "white"}
                },
                edges: {
                    width: 2,
                    shadow: true
                },
                layout: {
                    randomSeed: 2
                },
                manipulation: {
                    enabled: false,
                    addEdge: this.onAddLinkHandler.bind(this)
                }
            };

            this._network = new vis.Network(this.refs.vizcontainer, data, options);

            var boundOnSelectMicroserviceNode = this.props.onSelectMicroserviceNode.bind(this);
            var boundOnContextMenuOpen = this.onContextMenuHandler.bind(this);

            this._network.on("selectNode", boundOnSelectMicroserviceNode);
            this._network.on("oncontext", boundOnContextMenuOpen);
        } else {
            this._network.setData(data);
        }
    }

    render() {
        return (
            <div className="microserviceMindmap">
                <MicroserviceMindmapContextMenu/>
                <div ref="vizcontainer"></div>
            </div>
        );
    }
}

MicroserviceMindmap._network = undefined;

export default connect(mapStateToProps, mapDispatchToProps)(MicroserviceMindmap);