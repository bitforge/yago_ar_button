import {LitElement, html, css} from 'lit';

export class BrowserUnsupported extends LitElement {
  static get styles() {
    return css`
      :host {
        
      }
    `;
  }


  constructor() {
    super();
  }

  render() {
    return html`
      <div>
        I am browser unsupported
      </div>
    `;
  }
}

window.customElements.define('browser-unsupported', BrowserUnsupported);
