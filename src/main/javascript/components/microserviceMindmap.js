import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MicroserviceMindmapContextMenu from './microserviceMindmapContextMenu';
import MicroserviceCountLabel from './microserviceCountLabel';
import MicroserviceDocumentationLink from './microserviceDocumentationLink';
import StageSelector from './stageSelector';
import { onAddLink, onContextMenuOpen, onSelectMicroserviceNode } from './../actions/microserviceMindmapActions';
import { shouldFilterOut } from './../shared/filterUtils';
import { hasAllRequiredProperties } from './../shared/requiredPropertyUtil';

const mapStateToProps = (state) => ({
  microservices: state.microservices,
  menuMode: state.menuMode,
  filterString: state.filterString,
  microserviceListResizeCount: state.microserviceListResizeCount,
  debugMode: state.debugMode,
  showVersions: state.showVersions,
  stage: state.stage
});

const mapDispatchToProps = {
  onSelectMicroserviceNode,
  onContextMenuOpen,
  onAddLink
};

const colors = {
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


const propTypes = {
  microserviceListResizeCount: PropTypes.number.isRequired,
  filterString: PropTypes.string.isRequired,
  microservices: PropTypes.array.isRequired,
  menuMode: PropTypes.string.isRequired,
  onAddLink: PropTypes.func.isRequired,
  onSelectMicroserviceNode: PropTypes.func.isRequired,
  stage: PropTypes.string.isRequired,
  onContextMenuOpen: PropTypes.func.isRequired,
  showVersions: PropTypes.bool.isRequired,
  debugMode: PropTypes.bool.isRequired,
  serviceRequiredProperties: PropTypes.array.isRequired
};

class MicroserviceMindmapComponent extends React.Component {

  componentDidMount() {
    this.updateMindmap();
    window.addEventListener('resize', this.resize.bind(this));
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

  onAddLinkHandler(edgeData, callback) {
    callback(edgeData);
    this.props.onAddLink(edgeData);
  }

  onSelectMicroserviceNodeHandler(params) {
    this.props.onSelectMicroserviceNode({ nodes: params.nodes, stage: this.props.stage });
  }

  setMicroserviceMindmapRef = (ref) => {
    this.microserviceMindmapRef = ref;
  }

  setVizcontainerRef = (ref) => {
    this.vizcontainerRef = ref;
  }

  setDebugcontainerRef = (ref) => {
    this.debugcontainerRef = ref;
  }

  resize() {
    if (this.network && this.microserviceMindmapRef) {
      this.network.setSize('100%', `${this.microserviceMindmapRef.offsetHeight - 4}px`);
      this.network.redraw();
    }
  }


  addColorData = (microservice, props) => {
    const coloredMicroservice = Object.assign({}, microservice);

    if (shouldFilterOut(coloredMicroservice, props.filterString)) {
      coloredMicroservice.group = 'filteredOut';

      if (!hasAllRequiredProperties(coloredMicroservice, props.serviceRequiredProperties)) {
        coloredMicroservice.shadow = {
          color: '#c4c3c6'
        };
      }
    } else {
      if (coloredMicroservice.external) {
        coloredMicroservice.group = 'external';
      } else {
        coloredMicroservice.group = 'microservice';
      }

      if (!hasAllRequiredProperties(coloredMicroservice, props.serviceRequiredProperties)) {
        coloredMicroservice.shadow = {
          color: '#e50f03'
        };
      }
    }

    return coloredMicroservice;
  }

  addVersionData = (microservice) => {
    const microserviceWithVersion = Object.assign({}, microservice);

    if (microserviceWithVersion.version && !microserviceWithVersion.label.includes('@')) {
      microserviceWithVersion.label = `${microserviceWithVersion.label}@${microserviceWithVersion.version}`;
    }

    return microserviceWithVersion;
  }


  updateMindmap() {
    let microservices = this.props.microservices.map(microservice => addColorData(microservice, this.props));


    if (this.props.showVersions) {
      microservices = microservices.map(microservice => this.addVersionData(microservice));
    }

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
            color: colors.MICROSERVICE,
            font: { color: '#000000' }
          },
          external: {
            color: colors.EXTERNAL,
            font: { color: '#000000' }
          },
          filteredOut: {
            color: colors.GREY,
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
          container: this.debugcontainerRef
        };
      }

      this.network = new vis.Network(this.vizcontainerRef, data, options);

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
    microservices.filter((el) => el.consumes).forEach((el) => {
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
      <div className="microserviceMindmap" ref={this.setMicroserviceMindmapRef}>
        <MicroserviceMindmapContextMenu/>
        {this.props.debugMode && <div ref={this.setDebugcontainerRef} className="debugContainer"/>}
        <div ref={this.setVizcontainerRef} className="vizContainer"/>
        <StageSelector/>
        <MicroserviceCountLabel serviceRequiredProperties={this.props.serviceRequiredProperties}/>
        <MicroserviceDocumentationLink />
      </div>
    );
  }
}

MicroserviceMindmapComponent.network = undefined;
MicroserviceMindmapComponent.propTypes = propTypes;
export { MicroserviceMindmapComponent };

const MicroserviceMindmap = connect(mapStateToProps, mapDispatchToProps)(MicroserviceMindmapComponent);
export default MicroserviceMindmap;
