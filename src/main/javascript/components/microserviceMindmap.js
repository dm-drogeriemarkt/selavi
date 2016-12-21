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

const _colors = {
    'MICROSERVICE': {
        background: "#bef24d",
        border: "#19c786"
    },
    'EXTERNAL': {
        background: "#f2d12d",
        border: "#f69805"
    },
    'GREY': {
        background: "#f0f0f0",
        border: "#c4c3c6"
    }
}

export class MicroserviceMindmap extends React.Component {

    _shouldFilterOut(microservice, filterString) {
        return (filterString && microservice.label) ? (microservice.label.toLowerCase().indexOf(filterString.toLowerCase()) === -1) : false;
    }

    onContextMenuHandler(params) {
        params.event.preventDefault();

        const nodeId = this._network.getNodeAt(params.pointer.DOM);

        if (nodeId) {
            // right click does not select node!
            this._network.selectNodes([nodeId]);
        } else {
            this._network.unselectAll();
        }

        this.props.onContextMenuOpen({
            top: this.refs.vizcontainer.offsetTop + params.pointer.DOM.y,
            left: this.refs.vizcontainer.offsetLeft + params.pointer.DOM.x,
            nodeId: nodeId
        });
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
                if (this._shouldFilterOut(microservice, nextProps.filterString)) {
                    this._network.body.data.nodes.update([{
                        id: microservice.id,
                        color: _colors.GREY,
                        font: { color: "#c4c3c6" }
                    }]);
                } else {
                    this._network.body.data.nodes.update([{
                        id: microservice.id,
                        color: microservice.isExternal ? _colors.EXTERNAL : _colors.MICROSERVICE,
                        font: { color: "#000000" }
                    }]);
                }
            }, this);

            return false;
        } else if (nextProps.menuMode === 'ADD_LINK') {
            // we adding a connection between services, no need to re-draw the graph itself
            this._network.addEdgeMode();

            return false;
        } else if (this.props.menuMode === 'ADD_LINK' && !nextProps.menuMode) {
            // we just added a connection between services, no need to re-draw the graph itself
            this._network.disableEditMode();

            return false;
        }

        return true;
    }

    componentDidUpdate() {
        this.updateMindmap();
    }

    updateMindmap() {
        var microservices = this.props.microservices.map(microservice => {
            if (microservice.isExternal) {
                microservice.color = _colors.EXTERNAL;
            } else {
                microservice.color = _colors.MICROSERVICE;
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
                    shape: "box"
                },
                edges: {
                    width: 2
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