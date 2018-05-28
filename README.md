# Stimulus Controllers for Mapbox GL

You need to create a controller which extends `MapboxController`.

For example `controllers/mapController.js`:

```javascript
import { MapboxController } from "stimulus-mapbox-gl";
export default class extends MapboxController {

  // Optional
  defaultConfig() {
    return {
      /* your specific mapbox configuration */
    }
  }

  // Optional. Will expand from the "style" config value.
  // If this callback is not present, the "style" needs to have a full URL.
  getStyleUrl(style) {
    return "https://some.tileserver.org/styles/"+style"/style.json";
  }


  // Do something when the map has loaded.
  onMapLoaded(map) {
  }

  // Cleanup if needed
  onMapUnloaded(map) {
  }

}
```

```html
<div data-controller="mapboxgl" data-map-config="json"></div>
```

The JSON configuration object is similar to the object you'll pass to `mapboxgl.Map()`, with a few notable additions:

* `style` can be expanded by the `getStyleUrl()` callback,
* `sources` can be an object of multiples sources you'd normally add with `map.addSource`,
* `layers` can be an object of multiples layers you'd normally add with `map.addLayer`,
* `controls` can be an object to add an configure the different controls. Unset a key to disable the control:
  * with an extra option `position` : the position of the control, passed as a second argument to map.addControl

```json
{
  …
  "controls": {
    "scale": {},
    "geolocate": {"trackUserLocation": false}
  }
}
```

