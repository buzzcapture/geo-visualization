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
    onMove: _react2.default.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      colorSlices: 5,
      onMove: function onMove() {},
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
    this.map = _leafletmap2.default.create(this.props.id);
    this.map.update(this.props.data);
    this.map.map.on("moveend", _lodash2.default.debounce(this.onUpdate, 1000));
  },

  componentWillUnmount: function componentWillUnmount() {
    this.map.destroy();
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.map.update(nextProps.data);
  },

  getPrecision: function getPrecision(zoom) {
    var precision;

    if (zoom <= 7) {
      precision = 3;
    } else if (zoom <= 9) {
      precision = 4;
    } else if (zoom <= 12) {
      precision = 5;
    } else if (zoom <= 13) {
      precision = 6;
    } else {
      precision = 6;
    }

    return precision;
  },

  onUpdate: function onUpdate() {
    var zoom = this.map.map.getZoom();

    this.props.onMove(this.getPrecision(zoom));
  },

  render: function render() {
    return _react2.default.createElement("div", { ref: "container", id: this.props.id, className: "geo-visualization-chart" });
  }
});