import React from 'react';
import PropTypes from 'prop-types';
import MicroserviceMindmapContextMenu from './microserviceMindmapContextMenu';
import MicroserviceCountLabel from './microserviceCountLabel';
import MicroserviceDocumentationLink from './microserviceDocumentationLink';
import StageSelector from './stageSelector';
import { shouldFilterOut } from '../shared/filterUtils';
import { hasAllRequiredProperties } from '../shared/requiredPropertyUtil';


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


const propTypes = {
  microserviceListResizeCount: PropTypes.number,
  filterString: PropTypes.string,
  microservices: PropTypes.array,
  menuMode: PropTypes.string,
  onAddLink: PropTypes.func.isRequired,
  onSelectMicroserviceNode: PropTypes.func.isRequired,
  onContextMenuOpen: PropTypes.func.isRequired,
  stage: PropTypes.string,
  showVersions: PropTypes.bool.isRequired,
  debugMode: PropTypes.bool.isRequired,
  serviceRequiredProperties: PropTypes.array.isRequired
};

const defaultProps = {
  microserviceListResizeCount: undefined,
  filterString: undefined,
  stage: undefined,
  microservices: undefined,
  menuMode: undefined
};

class MicroserviceMindmapComponent extends React.Component {

  componentDidMount() {
    this.updateMindmap();
    window.addEventListener('resize', this.resize.bind(this));
  }


  shouldComponentUpdate(nextProps) {
    const {
      microserviceListResizeCount, filterString, microservices, menuMode
    } = this.props;
    if (nextProps.microserviceListResizeCount !== microserviceListResizeCount) {
      // service list was resized, no need to re-draw the graph itself
      this.resize();

      return false;
    } if (nextProps.filterString !== filterString) {
      // we are filtering, no need to re-draw the graph itself
      const mappedMicroservices = microservices.map(microservice => this.addColorData(microservice, nextProps));
      this.network.body.data.nodes.update(mappedMicroservices);

      return false;
    } if (nextProps.menuMode === 'ADD_LINK') {
      // we adding a connection between services, no need to re-draw the graph itself
      this.network.addEdgeMode();

      return false;
    } if (menuMode === 'ADD_LINK' && !nextProps.menuMode) {
      // we just added a connection between services, no need to re-draw the graph itself
      this.network.disableEditMode();

      return false;
    }

    return true;
  }

  componentDidUpdate() {
    this.updateMindmap();
  }


  onContextMenuHandler = (params) => {
    const { onContextMenuOpen } = this.props;

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
        [edgeFromId, edgeToId] = edgeFromToIds;
      }
    }

    onContextMenuOpen({
      top: params.event.clientY,
      left: params.event.clientX,
      nodeId,
      edgeFromId,
      edgeToId
    });
  }

  onClickHandler = (options) => {
    const { onContextMenuOpen } = this.props;
    if (options.event.srcEvent.ctrlKey) {
      // macbook touchpad right-click using ctrl key?
      return;
    }

    onContextMenuOpen({
      top: -1,
      left: -1,
      nodeId: undefined
    });
  }

  onAddLinkHandler = (edgeData, callback) => {
    const { onAddLink } = this.props;
    callback(edgeData);
    onAddLink(edgeData);
  }

  onSelectMicroserviceNodeHandler = (params) => {
    const { onSelectMicroserviceNode, stage } = this.props;
    onSelectMicroserviceNode({ nodes: params.nodes, stage });
  }

  setMicroserviceMindmapRef = (ref) => {
    this.microserviceMindmapRef = ref;
  }

  setVizcontainerRef=(ref) => {
    this.vizcontainerRef = ref;
  }

  setDebugcontainerRef = (ref) => {
    this.debugcontainerRef = ref;
  }


  addVersionData = (microservice) => {
    const microserviceWithVersion = Object.assign({}, microservice);

    if (microserviceWithVersion.version && !microserviceWithVersion.label.includes('@')) {
      microserviceWithVersion.label = `${microserviceWithVersion.label}@${microserviceWithVersion.version}`;
    }

    return microserviceWithVersion;
  };


  addColorData = (microservice, props) => {
    const coloredMicroservice = { ...microservice };

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
  };

  resize = () => {
    if (this.network && this.microserviceMindmapRef) {
      this.network.setSize('100%', `${this.microserviceMindmapRef.offsetHeight - 4}px`);
      this.network.redraw();
    }
  }


  updateMindmap = () => {
    const { microservices, showVersions, debugMode } = this.props;
    let mappedMicroservices = microservices.map(microservice => this.addColorData(microservice, this.props));


    if (showVersions) {
      mappedMicroservices = mappedMicroservices.map(microservice => this.addVersionData(microservice));
    }

    // create an array with nodes
    const nodes = new vis.DataSet(mappedMicroservices);

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

      if (debugMode) {
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
    const { debugMode, serviceRequiredProperties } = this.props;

    return (
      <div className="microserviceMindmap" ref={this.setMicroserviceMindmapRef}>
        <MicroserviceMindmapContextMenu/>
        {debugMode && <div ref={this.setDebugcontainerRef} className="debugContainer"/>}
        <div ref={this.setVizcontainerRef} className="vizContainer"/>
        <StageSelector/>
        <MicroserviceCountLabel serviceRequiredProperties={serviceRequiredProperties}/>
        <MicroserviceDocumentationLink />
      </div>
    );
  }
}

MicroserviceMindmapComponent.network = undefined;
MicroserviceMindmapComponent.propTypes = propTypes;
MicroserviceMindmapComponent.defaultProps = defaultProps;

export default MicroserviceMindmapComponent;
