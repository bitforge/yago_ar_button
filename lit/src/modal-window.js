import {LitElement, html, css} from 'lit';

export class ModalWindow extends LitElement {
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
        I am modal window
      </div>
    `;
  }
}

window.customElements.define('modal-window', ModalWindow);
