import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';

@customElement('ar-modal')
export class ArModal extends LitElement {
    static styles = styles;

    @property()
    modalClass = '';

    render() {
        return html`
            <div class="modal-inner  ${this.modalClass}" role="dialog">  
                <div class="ar-modal-header">
                    <slot name="header"></slot>
                    <button type="button" class="button-close" @click="${this.closeModalWindow}">✕</button>
                </div>
                <div class="ar-modal-body">
                    <slot name="default"></slot>
                </div>
                <div class="ar-modal-footer">
                    <p>
                        Powered by
                        <a href="https://yago.cloud/">
                            Yago
                            <img src="https://yago.cloud/static/yago/img/yago_icon.png" />
                        </a>
                    </p>
                </div>
            </div>
        `;
    }

    closeModalWindow(): void {
        const event = new CustomEvent('modal-close', { bubbles: true, });
        this.dispatchEvent(event);
    }
}