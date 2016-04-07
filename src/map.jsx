import React from "react";
import LeafletMap from "./leafletmap";
import _ from "lodash";

export default React.createClass({
  displayName: "Geo Visualization React Component",

  propTypes: {
    id: React.PropTypes.string.isRequired,
    data: React.PropTypes.object,
    onMove: React.PropTypes.func,
    onIconClick: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      colorSlices: 5,
      onMove: function () {},
      onIconClick: function () {},
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
    var mapOptions = _.pick(this.props, "colorSlices", "onIconClick");

    this.map = LeafletMap.create(this.props.id, mapOptions);
    this.map.update(this.props.data);
    this.map.map.on("moveend", _.debounce(this.onUpdate, 1000));
  },

  componentWillUnmount: function () {
    this.map.destroy();
  },

  componentWillReceiveProps: function (nextProps) {
    this.map.update(nextProps.data);
  },

  getPrecision: function getPrecision(zoom) {
    var precision;

    if (zoom <= 5) {
      precision = 3;
    } else if (zoom <= 8) {
      precision = 4;
    } else if (zoom <= 10) {
      precision = 5;
    } else if (zoom <= 12) {
      precision = 6;
    } else {
      precision = 7;
    }
    return precision;
  },

  onUpdate: function onUpdate() {
    var zoom, bounds, leafletBounds;

    zoom = this.map.map.getZoom();

    bounds = {
      top_left: {},
      bottom_right: {}
    };

    leafletBounds = this.map.map.getBounds();

    bounds.top_left.lat = leafletBounds.getNorthWest().lat;
    bounds.top_left.lon = leafletBounds.getNorthWest().lng;
    bounds.bottom_right.lat = leafletBounds.getSouthEast().lat;
    bounds.bottom_right.lon = leafletBounds.getSouthEast().lng;

    this.props.onMove(this.getPrecision(zoom), bounds);
  },

  render: function () {
    return (<div ref="container" id={this.props.id} className="geo-visualization-chart"></div>)
  }
})