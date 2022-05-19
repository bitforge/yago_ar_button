import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { styles } from './styles';
//import QRCodeStyling, { Options } from 'qr-code-styling';

@customElement('ar-modal')
export class ArModal extends LitElement {
    static styles = styles;

    @property()
    qrTitle = 'Default qr title Text';

    @property()
    qrText = 'Default qr Text';

    @property()
    qrSize = 300;

    @query('#qr1')
    qrCodeElement: any;

    qrCodeRef = createRef();

    qrOptions = {
        width: this.qrSize - 24,
        height: this.qrSize - 24,
        type: 'svg',
        data: '',
        margin: 10,
        errorCorrectionLevel: 'Q',
        image: undefined,
    };

    render() {
        return html`
            <div class="ar-button-modal">
                <div class="modal-inner" role="dialog">  
                    <div class="ar-modal-header">
                        <h2 class="ar-modal-content">${this.qrTitle}</h2> 
                        <button type="button" class="button-close" @click="${this.closeModalWindow}">✕</button>
                    </div>
                    <section class="ar-modal-body">
                        <div ${ref(this.qrCodeRef)} class="qr-element" ></div>
                        <p class="ar-modal-content" style="{ width: ${this.qrSize}px }">
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

    updated() {
        if (!this.qrCodeRef.value) {
            console.error('QR Element is null you potato');
            return;
        }

        console.log('after return brudda 222');
        //const a = new QRCodeStyling(this.qrOptions as Options)
        
    
        //this.qrCode = new QRCodeStyling(this.qrOptions);
        //this.qrCode.append(this.qrCodeRef.value as HTMLElement);
    }

    closeModalWindow(): void {
        const event = new CustomEvent('modal-close', { bubbles: true, });
        this.dispatchEvent(event);
    }
}