import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MicroserviceDocumentationLink from './microserviceDocumentationLink';
import { onAddLink, onContextMenuOpen, onSelectMicroserviceNode } from './../actions/microserviceMindmapActions';
import { shouldFilterOut } from './../shared/filterUtils';
import { hasAllRequiredProperties } from './../shared/requiredPropertyUtil';
import { MicroserviceMindmapContextMenu } from './microserviceMindmapContextMenu';
import { StageSelector } from './stageSelector';
import { MicroserviceCountLabel } from './microserviceCountLabel';

const mapStateToProps = (state) => ({
  microservices: state.microservices,
  menuMode: state.menuMode,
  filterString: state.filterString,
  microserviceListResizeCount: state.microserviceListResizeCount,
  debugMode: state.debugMode,
  stage: state.stage
});

const mapDispatchToProps = {
  onSelectMicroserviceNode,
  onContextMenuOpen,
  onAddLink
};

const color = {
  MICROSERVICE: {
    background: '#bef24d',
    border: '#19c786'
  },
  EXTERNAL: {
    background: '#f2d12d',
    border: '#f69805'
  },
  GREY: {
    background: '#f0f0f0',
    border: '#c4c3c6'
  }
};

const propTypes = {
  microserviceListResizeCount: PropTypes.number.isRequired,
  filterString: PropTypes.string.isRequired,
  microservices: PropTypes.array.isRequired,
  menuMode: PropTypes.string.isRequired,
  onAddLink: PropTypes.func.isRequired,
  onSelectMicroserviceNode: PropTypes.func.isRequired,
  stage: PropTypes.string.isRequired,
  onContextMenuOpen: PropTypes.func.isRequired,
  debugMode: PropTypes.bool.isRequired,
  serviceRequiredProperties: PropTypes.array.isRequired
};

const addColorData = (microservice, props) => {
  if (shouldFilterOut(microservice, props.filterString)) {
    microservice.group = 'filteredOut';
    if (!hasAllRequiredProperties(microservice, props.serviceRequiredProperties)) {
      microservice.shadow = {
        color: '#c4c3c6'
      };
    }
  } else {
    if (microservice.external) {
      microservice.group = 'external';
    } else {
      microservice.group = 'microservice';
    }

    if (!hasAllRequiredProperties(microservice, props.serviceRequiredProperties)) {
      microservice.shadow = {
        color: '#e50f03'
      };
    }
  }

  return microservice;
};

export class MicroserviceMindmap extends React.Component {

  componentDidMount() {
    this.updateMindmap();
    window.addEventListener('resize', () => this.resize);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.microserviceListResizeCount !== this.props.microserviceListResizeCount) {
      // service list was resized, no need to re-draw the graph itself
      this.resize();

      return false;
    } else if (nextProps.filterString !== this.props.filterString) {
      // we are filtering, no need to re-draw the graph itself
      const microservices = this.props.microservices.map(microservice => addColorData(microservice, nextProps));
      this.network.body.data.nodes.update(microservices);

      return false;
    } else if (nextProps.menuMode === 'ADD_LINK') {
      // we adding a connection between services, no need to re-draw the graph itself
      this.network.addEdgeMode();

      return false;
    } else if (this.props.menuMode === 'ADD_LINK' && !nextProps.menuMode) {
      // we just added a connection between services, no need to re-draw the graph itself
      this.network.disableEditMode();

      return false;
    }

    return true;
  }

  componentDidUpdate() {
    this.updateMindmap();
  }

  onAddLinkHandler(edgeData, callback) {
    callback(edgeData);
    this.props.onAddLink(edgeData);
  }

  onSelectMicroserviceNodeHandler(params) {
    this.props.onSelectMicroserviceNode({ nodes: params.nodes, stage: this.props.stage });
  }

  onContextMenuHandler(params) {
    params.event.preventDefault();

    const nodeId = this.network.getNodeAt(params.pointer.DOM);
    let edgeFromId;
    let edgeToId;

    if (nodeId) {
      // right click does not select node!
      this.network.selectNodes([nodeId]);
      // network.selectNodes(...) does _not_ fire events!
      this.onSelectMicroserviceNodeHandler({ nodes: [nodeId] });
    } else {
      this.network.unselectAll();

      const edgeId = this.network.getEdgeAt(params.pointer.DOM);
      if (edgeId) {
        const edgeFromToIds = this.network.getConnectedNodes(edgeId);
        edgeFromId = edgeFromToIds[0];
        edgeToId = edgeFromToIds[1];
      }
    }

    this.props.onContextMenuOpen({
      top: params.event.clientY,
      left: params.event.clientX,
      nodeId,
      edgeFromId,
      edgeToId
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

  resize() {
    if (this.network && this.microserviceMindmap) {
      this.network.setSize('100%', `${this.microserviceMindmap.offsetHeight - 4}px`);
      this.network.redraw();
    }
  }

  updateMindmap() {
    const microservices = this.props.microservices.map(microservice => addColorData(microservice, this.props));

    // create an array with nodes
    const nodes = new vis.DataSet(microservices);

    // create a network
    const data = {
      nodes
    };

    if (!this.network) {
      const options = {
        autoResize: false,
        nodes: {
          borderWidth: 2,
          shape: 'box'
        },
        edges: {
          width: 2,
          arrows: 'to'
        },
        groups: {
          microservice: {
            color: color.MICROSERVICE,
            font: { color: '#000000' }
          },
          external: {
            color: color.EXTERNAL,
            font: { color: '#000000' }
          },
          filteredOut: {
            color: color.GREY,
            font: { color: '#c4c3c6' }
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
          container: this.debuggingContainer
        };
      }

      this.network = new vis.Network(this.visualizationContainer, data, options);

      const boundOnSelectMicroserviceNode = this.onSelectMicroserviceNodeHandler.bind(this);
      const boundOnContextMenuOpen = this.onContextMenuHandler.bind(this);
      const boundOnClick = this.onClickHandler.bind(this);

      this.network.on('selectNode', boundOnSelectMicroserviceNode);
      this.network.on('oncontext', boundOnContextMenuOpen);
      this.network.on('click', boundOnClick);
      this.network.on('select', boundOnClick);
      this.network.on('dragStart', boundOnClick);
    } else {
      this.network.setData(data);
      this.resize();
    }

    // add edges to existing network (a lot faster than adding them with the node data)
    microservices.filter((el) => el.consumes)
      .forEach((el) => {
        el.consumes.forEach((consumer) => {
          this.network.body.data.edges.add({
            from: el.id,
            to: consumer.target,
            label: consumer.type !== null ? consumer.type : '',
            font: { align: 'middle' }
          });
        }, this);
      }, this);

    // because we add the edges to an existing network, things are kind of tangled up, so we start a simulation manually (to un-tangle everything)
    this.network.startSimulation();
  }

  render() {
    return (
      <div
        className="microserviceMindmap"
        ref={(ref) => {
          this.microserviceMindmap = ref;
        }}
      >
        <MicroserviceMindmapContextMenu/>
        {this.props.debugMode &&
        <div
          ref={(ref) => {
            this.debuggingContainer = ref;
          }}
          className="debugContainer"
        />
        }
        <div
          ref={(ref) => {
            this.visualizationContainer = ref;
          }}
          className="vizContainer"
        />
        <StageSelector/>
        <MicroserviceCountLabel serviceRequiredProperties={this.props.serviceRequiredProperties}/>
        <MicroserviceDocumentationLink/>
      </div>
    );
  }
}

MicroserviceMindmap.propTypes = propTypes;
MicroserviceMindmap.network = undefined;

export default connect(mapStateToProps, mapDispatchToProps)(MicroserviceMindmap);
