import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './styles';

@customElement('ar-modal')
export class ArModal extends LitElement {
    static styles = styles;

    @property()
    showQrCode = false;

    @property()
    qrTitle = 'Default qr title Text';

    @property()
    qrText = 'Default qr Text';

    render() {
        console.log('rener ar modal');
        

        console.log('these are the propss');
        console.log(this.showQrCode);

        return html`
            <div class="ar-button-modal ${!this.showQrCode ? 'hidden' : ''}">
                <div class="modal-inner" role="dialog">  
                    <div class="ar-modal-header">
                        <h2 class="ar-modal-content">${this.qrTitle}</h2>
                        <button type="button" class="button-close" @click="${this.closeModalWindow}">✕</button>
                    </div>
                    <section class="ar-modal-body">
                        <div class="qr-element"></div>
                        <p class="ar-modal-content" :style="{ width: qrSize + 'px' }">
                            ${this.qrText}
                        </p>
                    </section>
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
            </div>
        `;
    }

    closeModalWindow(): void {
        this.showQrCode = false;
    }
}