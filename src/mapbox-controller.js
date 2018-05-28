import { Controller } from "stimulus";
import mapboxgl from "mapbox-gl";

export class MapboxController extends Controller {

  initialize() {
    this.__controls = {}
    if (this.defaultConfig) {
      var userDefaults = this.defaultConfig();
    } else {
      var userDefaults = {};
    }

    var defaults = Object.assign({
      controls: {navigation: {}, attribution: {}},
      layers: {},
      sources: {}
    }, userDefaults);

    if (this.element.dataset.mapConfig) {
      var localConfig = JSON.parse(this.element.dataset.mapConfig);
      this.__mapConfig = Object.assign(defaults, localConfig);
    } else {
      this.__mapConfig = defaults;
    }

    // Expand "style" from getStyleUrl() if it's defined.
    if (this.__mapConfig.style && this.getStyleUrl) {
      this.__mapConfig.style = this.getStyleUrl(this.__mapConfig.style);
    }

  }

  connect() {
    var mapConfig = this.__mapConfig;
    var controls = this.__controls;

    console.log("adding map", mapConfig);

    this.__map = new mapboxgl.Map(Object.assign(mapConfig, {
      container: this.element
    }));

    var map = this.__map;

    // Navigation controls
    if (mapConfig.controls.navigation) {
      var options = Object.assign({
        showCompass: true,
        showZoom: true,
        position: "top-right"
      }, mapConfig.controls.navigation)
      controls.navigation = new mapboxgl.NavigationControl();
      map.addControl(controls.navigation, options.position);
    }

    // Attribution controls
    if (mapConfig.controls.attribution) {
      var options = Object.assign({
        compact: true
      }, mapConfig.controls.attribution);
      controls.attribution = new mapboxgl.AttributionControl(options);
      map.addControl(controls.attribution);
    }

    // Add geolocate control to the map.
    if (mapConfig.controls.geolocate) {
      var options = Object.assign({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }, mapConfig.controls.geolocation)
      controls.geolocate = new mapboxgl.GeolocateControl(options);
      map.addControl(controls.geolocateControl)
    }

    // Scale controls
    if (mapConfig.controls.scale) {
      var options = Object.assign({
        maxWidth: 80,
        unit: "metric"
      }, mapConfig.controls.scale)
      controls.scale = new mapboxgl.ScaleControl(options);
      map.addControl(controls.scale)
    }

    map.on('load', () => { this.__map_onLoad() })
  }

  disconnect() {
    this.__map.remove();
    this.__map = undefined;
  }

  __map_onLoad() {
    var mapConfig = this.__mapConfig;
    var map = this.__map;
    Object.keys(mapConfig.datas || {}).forEach((id) => {
      console.log("adding source", id, mapConfig.datas[id]);
      map.addSource(id, mapConfig.datas[id])
    })
    Object.keys(mapConfig.layers || {}).forEach((id) => {
      console.log("adding layer", id, mapConfig.layers[id]);
      map.addLayer(Object.assign(mapConfig.layers[id], {id: id}))
    })
  }

}

