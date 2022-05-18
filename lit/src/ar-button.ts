import {html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import Config from './interfaces/config';
import { styles } from './styles';
import './components/ar-icon';
import './components/ar-modal';

@customElement('ar-button')
export class ArButton extends LitElement {
    static styles = styles;

    @property()
    model = 'chair';

    @property()
    qrTitle = 'Default Btn Text';

    @property()
    qrText = 'Default QR Title';

    @property()
    buttonText = 'Default QR Text';

    baseUrl = 'https://dev.yago.cloud';

    modelLink = '';

    config: Config = {
        site_url: null,
        quicklook_link: null,
        qr_config: null,
        ar_button_config: null,
    };

    @state()
    showQrCode = false;

    @state()
    showButton = false;

    @property(  )
    testVar = 'Hansueli!';

    modalHtml = html`
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


    render() { 
        return html`
        <div
            id="${this.elementId}" 
            class="ar-button ${!this.showButton ? 'hidden' : ''}">

            <ar-modal></ar-modal>

            <a
                rel="ar"
                href="${this.modelLink}"
                @click=${this.startAr}
                class="ar-link external">
                    <!-- image tag as first child is required for iOS -->
                    <img />
                    <ar-icon></ar-icon>
                    ${this.buttonText}
            </a>
            
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
        </div>
        `;
    }

    async connectedCallback(): Promise<void> {
        super.connectedCallback();
        
        // Fetch config from yago server and update when ready
        this.config = await this.getConfig();

        this.showButton = true;
    }

    changeVariable(): void {
        this.testVar = 'Peter meier ueli sepp!!!!!';
    }

    startAr(e: Event): void {
        console.log('showing qr code?'); 

        
        e.preventDefault();

        console.log('showing qr code?');
        
        this.showQrCode = true;
    }
    
    closeModalWindow(): void {
        this.showQrCode = false;
    }
    
    async getConfig(): Promise<Config> {
        const url = `${this.baseUrl}/api/models/${this.model}/embed/options/`;
        
        try {
            const configResponse = await fetch(url);
            if (!configResponse.ok) throw configResponse;
            return await configResponse.json();
        } catch (e) {
            // Fallback to fixed scaling
            return this.config;
        }
    }
      
    get elementId(): string {
        return 'ar-button-' + this.model; 
    }
}
