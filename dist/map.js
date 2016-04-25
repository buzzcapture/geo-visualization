"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _leafletmap = require("./leafletmap");

var _leafletmap2 = _interopRequireDefault(_leafletmap);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: "Geo Visualization React Component",

  propTypes: {
    id: _react2.default.PropTypes.string.isRequired,
    data: _react2.default.PropTypes.object,
    onMove: _react2.default.PropTypes.func,
    onIconClick: _react2.default.PropTypes.func,
    onDeselect: _react2.default.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      colorSlices: 5,
      onMove: function onMove() {},
      onIconClick: function onIconClick() {},
      onDeselect: function onDeselect() {},
      data: {
        type: "FeatureCollection",
        features: []
      }
    };
  },

  shouldComponentUpdate: function shouldComponentUpdate() {
    return false;
  },

  componentDidMount: function componentDidMount() {
    var mapOptions = _lodash2.default.pick(this.props, "colorSlices", "onIconClick", "onDeselect");

    this.leafletMap = _leafletmap2.default.create(this.props.id, mapOptions);
    this.leafletMap.update(this.props.data);
    this.leafletMap.map.on("moveend", _lodash2.default.debounce(this.onUpdate, 1000));
    this.leafletMap.map.on("locationfound", this.onLocationFound);
    this.leafletMap.map.on("locationerror", this.onLocationError);
    this.leafletMap.map.locate();
  },

  onLocationFound: function onLocationFound(ev) {
    this.leafletMap.map.setView(ev.latlng);
    this.onUpdate();
  },

  onLocationError: function onLocationError() {
    this.onUpdate();
  },

  componentWillUnmount: function componentWillUnmount() {
    this.leafletMap.destroy();
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.leafletMap.update(nextProps.data);
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

    zoom = this.leafletMap.map.getZoom();

    bounds = {
      top_left: {},
      bottom_right: {}
    };

    leafletBounds = this.leafletMap.map.getBounds();

    bounds.top_left.lat = leafletBounds.getNorthWest().lat;
    bounds.top_left.lon = leafletBounds.getNorthWest().lng;
    bounds.bottom_right.lat = leafletBounds.getSouthEast().lat;
    bounds.bottom_right.lon = leafletBounds.getSouthEast().lng;

    this.props.onMove(this.getPrecision(zoom), bounds);
  },

  render: function render() {
    return _react2.default.createElement("div", { ref: "container", id: this.props.id, className: "geo-visualization-chart" });
  }
});