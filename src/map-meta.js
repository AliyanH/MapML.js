export class MapMeta extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'content'];
  }
  get name() {
    return this.getAttribute('name');
  }
  set name(val) {
    if (['projection', 'extent', 'cs', 'zoom'].includes(val)) {
      this.setAttribute('name', val);
    }
  }
  get content() {
    return this.getAttribute('content');
  }
  set content(val) {
    // improve this
    if (
      this.name === 'cs' &&
      !['tcrs', 'tilematrix', 'pcrs', 'gcrs', 'map', 'tile'].includes(val)
    ) {
      return;
    }
    this.setAttribute('content', val);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'name': {
        if (oldValue !== newValue) {
          // handle side effects
        }
        break;
      }
      case 'content': {
        if (oldValue !== newValue) {
          // handle side effects
        }
        break;
      }
    }
  }
  constructor() {
    // Always call super first in constructor
    super();
  }
  connectedCallback() {}
  disconnectedCallback() {}

  getMapEl() {
    // TODO: not fully developed/tested
    return this.getRootNode() instanceof ShadowRoot
      ? this.getRootNode().host.closest('mapml-viewer,map[is=web-map]')
      : this.closest('mapml-viewer,map[is=web-map]');
  }
  getLayerEl() {
    // TODO: not fully developed/tested
    return this.getRootNode() instanceof ShadowRoot
      ? this.getRootNode().host.closest('layer-')
      : this.closest('layer-');
  }

  getCS() {
    if (this.name.toLowerCase() !== 'extent' || !this.content) return;
    let cs,
      metaKeys = Object.keys(M._metaContentToObject(this.content));
    for (let i = 0; i < metaKeys.length; i++) {
      if (!metaKeys[i].includes('zoom')) {
        cs = M.axisToCS(metaKeys[i].split('-')[2]);
        break;
      }
    }
    return cs;
  }

  getBounds() {
    let map = this.getMapEl()._map,
      content = M._metaContentToObject(this.content),
      cs = this.getCS(),
      axes = M.csToAxes(cs),
      zoom = content.zoom;

    console.log(cs);

    let pcrsBound = M.getBoundsFromMeta(this.parentElement);
    console.log(pcrsBound);
    return pcrsBound;
  }

  zoomTo() {
    if (this.name.toLowerCase() !== 'extent' || !this.content) return;
    let map = this.getMapEl()._map,
      content = M._metaContentToObject(this.content),
      cs = this.getCS(),
      axes = M.csToAxes(cs),
      zoom = content.zoom;

    let pcrsBound = this.getBounds();

    let center = map.options.crs.unproject(pcrsBound.getCenter(true));
    console.log(center);
    map.setView(center, M.getMaxZoom(pcrsBound, map, 0, 25), {
      animate: false
    });
  }

  addRender() {
    if (this.name.toLowerCase() !== 'extent' || !this.content) return;
    let map = this.getMapEl()._map;
    var latlngs = [
      [-109.48254653178076, 52.47059875953394],
      [-109.37693300847174, 49.20016441284969],
      [-102.68294934753119, 49.22957571102691],
      [-102.67548191604418, 52.456365408222894]
    ];
    this.render = L.polygon(latlngs, { color: 'red' }).addTo(map);
  }
  removeRendering() {
    if (this.name.toLowerCase() !== 'extent' || !this.content) return;
    if (this.render) {
      let map = this.getMapEl()._map;
      map.removeLayer(this.render);
      this.render = null;
    }
  }
}
