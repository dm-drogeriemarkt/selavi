import React from 'react';
import { connect } from 'react-redux';
import MicroserviceMindmapContextMenu from './microserviceMindmapContextMenu';
import MicroserviceCountLabel from './microserviceCountLabel';
import MicroserviceDocumentationLink from './microserviceDocumentationLink';
import StageSelector from './stageSelector';
import { onAddLink, onContextMenuOpen, onSelectMicroserviceNode } from './../actions/microserviceMindmapActions';
import { shouldFilterOut } from './../shared/filterUtils';
import { hasAllRequiredProperties } from './../shared/requiredPropertyUtil';

const mapStateToProps = (state) => {
    return {
        microservices: state.microservices,
        menuMode: state.menuMode,
        filterString: state.filterString,
        microserviceListResizeCount: state.microserviceListResizeCount,
        debugMode: state.debugMode,
        showVersions: state.showVersions,
        stage: state.stage
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
};

export class MicroserviceMindmap extends React.Component {

    onContextMenuHandler(params) {
        params.event.preventDefault();

        const nodeId = this._network.getNodeAt(params.pointer.DOM);
        let edgeFromId, edgeToId;

        if (nodeId) {
            // right click does not select node!
            this._network.selectNodes([nodeId]);
            // network.selectNodes(...) does _not_ fire events!
            this.onSelectMicroserviceNodeHandler({ nodes: [nodeId] });
        } else {
            this._network.unselectAll();

            const edgeId = this._network.getEdgeAt(params.pointer.DOM);
            if (edgeId) {
                const edgeFromToIds = this._network.getConnectedNodes(edgeId);
                edgeFromId = edgeFromToIds[0];
                edgeToId = edgeFromToIds[1];
            }
        }

        this.props.onContextMenuOpen({
            top: params.event.clientY,
            left: params.event.clientX,
            nodeId: nodeId,
            edgeFromId: edgeFromId,
            edgeToId: edgeToId
        });
    }

    onClickHandler(options) {
        if (options.event.srcEvent.ctrlKey) {
            // macbook touchpad right-click using ctrl key?
            return;
        }

        this.props.onContextMenuOpen({
            top: -1,
            left: -1,
            nodeId: undefined
        });
    }

    onAddLinkHandler(edgeData, callback) {
        callback(edgeData);
        this.props.onAddLink(edgeData);
    }

    onSelectMicroserviceNodeHandler(params) {
        this.props.onSelectMicroserviceNode({ nodes: params.nodes, stage: this.props.stage });
    }

    componentDidMount() {
        this.updateMindmap();
        window.addEventListener("resize", this._resize.bind(this));
    }

    _resize() {
        if (this._network && this.refs.microserviceMindmap) {
            this._network.setSize("100%", (this.refs.microserviceMindmap.offsetHeight - 4) + "px");
            this._network.redraw();
        }
    }

    _filterChanged(filterString, nextFilterString) {
        return filterString !== nextFilterString;
    }

    _showVersionsChanged(showVersions, nextShowVersions) {
        return (showVersions !== nextShowVersions)
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.microserviceListResizeCount !== this.props.microserviceListResizeCount) {
            // service list was resized, no need to re-draw the graph itself
            this._resize();

            return false;
        } else if (this._filterChanged(this.props.filterString, nextProps.filterString)
            || this._showVersionsChanged(this.props.showVersions, nextProps.showVersions)) {

            // we are filtering or changing showVersions, no need to re-draw the graph itself
            let microservices = this.props.microservices.map(microservice => this._addColorData(microservice, nextProps));

            if (nextProps.showVersions) {
                microservices = microservices.map(microservice => this._addVersionData(microservice));
            }

            this._network.body.data.nodes.update(microservices);

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

    _addColorData(microservice, props) {
        let coloredMicroservice = Object.assign({}, microservice);

        if (shouldFilterOut(coloredMicroservice, props.filterString)) {
          coloredMicroservice.group = "filteredOut";

            if (!hasAllRequiredProperties(coloredMicroservice, props.serviceRequiredProperties)) {
              coloredMicroservice.shadow = {
                    color: "#c4c3c6"
                }
            }
        } else {
            if (coloredMicroservice.external) {
              coloredMicroservice.group = "external";
            } else {
              coloredMicroservice.group = "microservice";
            }

            if (!hasAllRequiredProperties(coloredMicroservice, props.serviceRequiredProperties)) {
              coloredMicroservice.shadow = {
                    color: "#e50f03"
                }
            }
        }

        return coloredMicroservice;
    }

    _addVersionData(microservice) {
        let microserviceWithVersion = Object.assign({}, microservice);

        if (microserviceWithVersion.version && !microserviceWithVersion.label.includes('@')) {
          microserviceWithVersion.label = microserviceWithVersion.label + '@' + microserviceWithVersion.version;
        }

        return microserviceWithVersion;
    }

    updateMindmap() {
        let microservices = this.props.microservices.map(microservice => this._addColorData(microservice, this.props))


        if (this.props.showVersions) {
            microservices = microservices.map(microservice => this._addVersionData(microservice));
        }

        // create an array with nodes
        let nodes = new vis.DataSet(microservices);

        // create a network
        let data = {
            nodes: nodes
        };

        if (!this._network) {
            let options = {
                autoResize: false,
                nodes: {
                    borderWidth: 2,
                    shape: "box"
                },
                edges: {
                    width: 2,
                    arrows: "to"
                },
                groups: {
                    "microservice": {
                        color: _colors.MICROSERVICE,
                        font: { color: "#000000" }
                    },
                    "external": {
                        color: _colors.EXTERNAL,
                        font: { color: "#000000" }
                    },
                    "filteredOut": {
                        color: _colors.GREY,
                        font: { color: "#c4c3c6" }
                    }
                },
                layout: {
                    randomSeed: 2
                },
                manipulation: {
                    enabled: false,
                    addEdge: this.onAddLinkHandler.bind(this)
                },
                physics: {
                    barnesHut: {
                        // how much are nodes allowed to overlap? 1 = maximum, 0 = minimum distance
                        avoidOverlap: 0.8,
                        // damping slows things down, keeps nodes from floating away, 1 = maximum, 0 = minimum
                        damping: 0.7
                    },
                    // speed at which simulation stops. the lower the value, the longer the nodes keep floating around
                    minVelocity: 2.5
                }
            };

            if (this.props.debugMode) {
                options.configure = {
                    enabled: true,
                    container: this.refs.debugcontainer
                }
            }

            this._network = new vis.Network(this.refs.vizcontainer, data, options);

            let boundOnSelectMicroserviceNode = this.onSelectMicroserviceNodeHandler.bind(this);
            let boundOnContextMenuOpen = this.onContextMenuHandler.bind(this);
            let boundOnClick = this.onClickHandler.bind(this);

            this._network.on("selectNode", boundOnSelectMicroserviceNode);
            this._network.on("oncontext", boundOnContextMenuOpen);
            this._network.on("click", boundOnClick);
            this._network.on("select", boundOnClick);
            this._network.on("dragStart", boundOnClick);
        } else {
            this._network.setData(data);
            this._resize();
        }

        // add edges to existing network (a lot faster than adding them with the node data)
        microservices.filter(function (el) {
            return el.consumes;
        }).forEach(function (el) {
            el.consumes.forEach(function (consumer) {
                this._network.body.data.edges.add({
                    from: el.id,
                    to: consumer.target,
                    label: consumer.type !== null ? consumer.type : "",
                    font: { align: 'middle' }
                });
            }, this);
        }, this);

        // because we add the edges to an existing network, things are kind of tangled up, so we start a simulation manually (to un-tangle everything)
        this._network.startSimulation();
    }

    render() {
        return (
          <div className="microserviceMindmap" ref="microserviceMindmap">
              <MicroserviceMindmapContextMenu/>
              {this.props.debugMode && <div ref="debugcontainer" className="debugContainer"/>}
              <div ref="vizcontainer" className="vizContainer"/>
              <StageSelector/>
              <MicroserviceCountLabel serviceRequiredProperties={this.props.serviceRequiredProperties}/>
              <MicroserviceDocumentationLink />
          </div>
        );
    }
}

MicroserviceMindmap._network = undefined;

export default connect(mapStateToProps, mapDispatchToProps)(MicroserviceMindmap);
