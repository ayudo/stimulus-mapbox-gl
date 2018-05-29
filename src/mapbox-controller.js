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
      controls: {
        attribution: {}
      },
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

    if (mapConfig.accessToken) {
      mapboxgl.accessToken = mapConfig.accessToken;
    }

    this.__map = new mapboxgl.Map(Object.assign(mapConfig, {
      container: this.element
    }));

    var map = this.__map;

    this.__addControl("attribution");
    this.__addControl("navigation");
    this.__addControl("geolocate");
    this.__addControl("scale");

    map.on('load', () => { this.__onMapLoaded() })
  }

  disconnect() {
    this.__map.remove();
    this.__map = undefined;
    if (this.onDisconnect) { this.onMapUnloaded() };
  }

  __onMapLoaded() {
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
    if (this.onMapLoaded) { this.onMapLoaded(map) };
  }

  __addControl(control) {
    if (this.__mapConfig.controls[control]) {
      var klass = null;
      switch (control) {
        case "navigation":
          klass = mapboxgl.NavigationControl;
          break;
        case "attribution":
          klass = mapboxgl.AttributionControl;
          break;
        case "scale":
          klass = mapboxgl.ScaleControl;
          break
        case "geolocate":
          klass = mapboxgl.GeolocateControl;
          break
        default:
          null
      }
      var options = this.__mapConfig.controls[control];
      console.log("adding control", control, options);
      var ctrl = this.__controls[control] = new klass(options);
      if (options.position) {
        this.__map.addControl(ctrl, options.position);
      } else {
        this.__map.addControl(ctrl);
      }
    }
  }



}

