import './leaflet.js';
import "./leaflet.toolbar.js";
import "./leaflet.distortableimage.js";

/* 
implemented for both mapml-viewer and web-map; however web-map does not focus on map element in the browser resulting in NVDA 
not being able to read out map-caption and stating that it's an interactive map region
*/
export class MapImage extends HTMLElement {
    static get observedAttributes() {
      return ['src', 'bbox'];
    }

    get src() {
      return this.getAttribute('src');
    }
    set src(URI) {
      this.changeSrc(URI);
    }

    get bbox() {
      return this.getAttribute('bbox');
    }
    set bbox(arr) {
      this.changebbox(arr);
    }

    constructor() {
        super();
    }

    // called when element is inserted into DOM (setup code)
    connectedCallback() {
        if (this.parentElement.nodeName === "LAYER-") {
            this._createImageLayer();
        }
    }
    disconnectedCallback() {
        this.observer.disconnect();
    }
    attributeChangedCallback(name, oldValue, newValue) {
      switch(name) {
        case 'src': 
          if (oldValue !== newValue) {
            this.changeSrc(newValue);
          }
        break;  
        case 'bbox': 
          if (oldValue !== newValue) {
            this.changebbox(newValue);
          }
        break;
      }
    }

    changeSrc(src) {
        if (src) {
            this.setAttribute('src', src);
        }
    }

    changebbox(bbox) {
        if (bbox) {
            this.setAttribute('bbox', bbox);
            console.log(bbox.split(','));
        }
    }

    _createImageLayer() {
      this._layer = L.distortableImageOverlay(this.src, {
        actions: []
      });
      this._layer.addTo(this.parentElement._layer._map);
      this._layer._image.style.zIndex = '2';
      this._layer._image.style.visibility = 'visible';
      //this._layer._image.removeEventListener("mousedown");
    }
}
