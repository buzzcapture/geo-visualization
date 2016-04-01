import React from "react";
import LeafletMap from "./leafletmap";
import _ from "lodash";

export default React.createClass({
  displayName: "Geo Visualization React Component",

  propTypes: {
    id: React.PropTypes.string.isRequired,
    data: React.PropTypes.object,
    onMove: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      colorSlices: 5,
      onMove: function () {},
      data: {
        type: "FeatureCollection",
        features: []
      }
    }
  },

  shouldComponentUpdate: function () {
    return false;
  },

  componentDidMount: function () {
    this.map = LeafletMap.create(this.props.id, _.pick(this.props, "colorSlices"));
    this.map.update(this.props.data);
    this.map.map.on("moveend", _.debounce(this.onUpdate, 1000));
  },

  componentWillUnmount: function () {
    this.map.destroy();
  },

  componentWillReceiveProps: function (nextProps) {
    this.map.update(nextProps.data);
  },

  getPrecision: function (zoom) {
    var precision;

    if (zoom <= 7) {
      precision = 3
    } else if (zoom <= 9) {
      precision = 4
    } else if (zoom <= 12) {
      precision = 5
    } else if (zoom <= 13) {
      precision = 6
    } else {
      precision = 6
    }

    return precision;
  },

  onUpdate: function () {
    var zoom = this.map.map.getZoom();

    this.props.onMove(this.getPrecision(zoom));
  },

  render: function () {
    return (<div ref="container" id={this.props.id} className="geo-visualization-chart"></div>)
  }
})