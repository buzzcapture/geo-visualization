"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _color = require("color");

var _color2 = _interopRequireDefault(_color);

var _leaflet = require("leaflet");

var _leaflet2 = _interopRequireDefault(_leaflet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var TILE_LAYER_URL = 'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ3ZpZG8iLCJhIjoiZGI1NmFhNmViNzZlZGNkMjQ3ZjdlMjVkZTMwNmFkNmEifQ.wnMrAkxOObDfpS1-KvPkqw';

var Utils = {
  getStandardDeviation: function getStandardDeviation(values, mean) {
    var variance = 0;

    values.forEach(function (amount) {
      variance += Math.pow(mean - amount, 2);
    });

    return Math.sqrt(variance /= values.length);
  }
};

var LeafletMap = function LeafletMap() {
  this.init.apply(this, arguments);
};

LeafletMap.prototype = {
  init: function init(id) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    this.options = _lodash2.default.assign({
      zoom: 6,
      center: [52.374030, 4.8896900],
      colorSlices: 5,
      baseColor: "#A32020"
    }, options);

    this.map = _leaflet2.default.map(id).setView(this.options.center, this.options.zoom);

    _leaflet2.default.tileLayer(TILE_LAYER_URL).addTo(this.map);
  },

  getStyle: function getStyle(bounds, feature) {
    return {
      fillColor: this.getColor(this.options.baseColor, feature.properties.amount, bounds),
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7
    };
  },

  update: function update(data) {
    // If the geojson layer already exists remove it first before adding the new one.
    if (this.map.hasLayer(this.geojson)) {
      this.map.removeLayer(this.geojson);
    }

    if (data.features.length) {
      this.postingBounds = this.getBounds(data.features);

      this.geojson = _leaflet2.default.geoJson(data, {
        pointToLayer: this.pointToLayer.bind(this)
      }).addTo(this.map);
    }
  },

  getBounds: function getBounds(items) {
    var mean, lowestAmount, // the lowest amount of postings
    highestAmount, // the highest amount of postings
    standardDeviation, // the standard deviation
    values, // all of the values from the response, used for working with the values easier;
    trimmedValues; // the values after being trimmed

    values = [];
    items.forEach(function (item) {
      return values.push(item.properties.amount);
    });

    mean = _lodash2.default.mean(values);
    standardDeviation = Utils.getStandardDeviation(values, mean);

    // get a box to use for number trimming
    lowestAmount = mean - standardDeviation;
    highestAmount = mean + standardDeviation;

    // console.log("High:", highestAmount, "Low:", lowestAmount);

    trimmedValues = _lodash2.default.filter(values, function (value) {
      return lowestAmount < value && highestAmount > value;
    });

    //get the new lowest and highest posting amounts
    lowestAmount = Math.min.apply(Math, _toConsumableArray(trimmedValues));
    highestAmount = Math.max.apply(Math, _toConsumableArray(trimmedValues));

    return {
      lowest: lowestAmount,
      highest: highestAmount
    };
  },

  getColor: function getColor(baseColor, amount, bounds) {
    var total, part, color, offset, percentage, slices;

    color = (0, _color2.default)(baseColor);

    // variables for the percentage calculation
    total = Math.max(bounds.highest - bounds.lowest, 1);
    part = amount - bounds.lowest;

    slices = this.options.colorSlices; // Temporary, will be provided by the user.
    offset = 100 / slices;

    // Calculate the percentage
    percentage = Math.floor(part / total * 100);
    // get the percentage to be between 0-100
    percentage = Math.min(Math.max(percentage, 0), 100);
    // Get the the color brackets the percentage is in
    percentage = Math.floor(percentage / offset);

    return color.lighten(1 - percentage / slices).hexString();
  },

  pointToLayer: function pointToLayer(feature, latlng) {
    var divText, iconWidth, iconHeight, icon, color, style;

    color = this.getColor(this.options.baseColor, feature.properties.amount, this.postingBounds);
    divText = feature.properties.amount.toString();
    iconWidth = 5 * divText.length + 10;
    style = 'style="text-align: center; background-color:' + color + '"';

    icon = _leaflet2.default.divIcon({
      iconSize: [iconWidth, iconWidth],
      iconAnchor: [iconWidth / 2, iconWidth / 2],
      className: "custom-leaflet-marker",
      html: "<div " + style + "><b>" + feature.properties.amount + "</b></div>"
    });

    return _leaflet2.default.marker(latlng, {
      icon: icon
    });
  },

  destroy: function destroy() {}
};

LeafletMap.create = function () {
  return new (Function.prototype.bind.apply(LeafletMap, [null].concat(Array.prototype.slice.call(arguments))))();
};

exports.default = LeafletMap;