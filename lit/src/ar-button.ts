import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import Config from './interfaces/config';
import { styles } from './styles';
import './components/ar-icon/ar-icon';
import './components/ar-modal/ar-modal';
import { createRef, ref } from 'lit/directives/ref.js';
import QRCodeStyling, { DrawType } from 'qr-code-styling';

@customElement('ar-button')
export class ArButton extends LitElement {
    static styles = styles;

    @property()
    model = process.env.YAGO_MODEL;

    @property()
    qrTitle = 'Default Btn Text';

    @property()
    qrText = 'Default QR Title';

    @property()
    buttonText = 'Default QR Text';

    baseUrl = process.env.YAGO_BASE_URL;

    modelLink: URL | null = null;

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

    @property()
    qrSize = 300;

    qrCode: QRCodeStyling | null = null;

    qrCodeRef = createRef();

    qrOptions = {
        width: this.qrSize - 24,
        height: this.qrSize - 24,
        type: 'svg' as DrawType,
        data: '',
        margin: 10,
        errorCorrectionLevel: 'Q',
        image: undefined,
    };

    render() { 
        return html`
        <div
            id="${this.elementId}" 
            class="ar-button ${!this.showButton ? 'hidden' : ''}">

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
            
            <ar-modal
                @modal-close=${this.closeModalWindow}
                class="${!this.showQrCode ? 'hidden' : ''}"
                qrTitle="${this.qrTitle}"
                qrText="${this.qrText}">
                <h2 class="ar-modal-content">${this.qrTitle}</h2> 
                <div ${ref(this.qrCodeRef)} class="qr-element" ></div>
                <p class="ar-modal-content" style="{ width: ${this.qrSize}px }">
                    ${this.qrText}
                </p>
            </ar-modal>
        </div>
        `;
    }

    updated() {
        if (!this.qrCodeRef.value) {
            console.error('QR Element is emtpy.');
            return;
        }

        this.qrCode = new QRCodeStyling(this.qrOptions);
        this.qrCode.append(this.qrCodeRef.value as HTMLElement);
    }

    async connectedCallback(): Promise<void> {
        super.connectedCallback();
        
        this.config = await this.getConfig();

        this.modelLink = new URL(`/v/${this.model}`, this.baseUrl);

        this.showButton = true;
    }

    startAr(e: Event): void {
        e.preventDefault();

        // if (!this.isBrowserSupported) {
        //     e.preventDefault();
        //     this.showBrowserHint = true;
        //     return;
        // }

        //if (!this.isArSupported) {
        // Pass current document url in QR code as page_url parameter
        // This ensures correct return urls in single page apps

        if (!this.modelLink) {
            console.error('ArButton: StartAr: ModelLink is empty.')
            return;
        }

        const encodedUrl = encodeURIComponent(window.location.toString());
        const qrUrl = new URL('?page_url=' + encodedUrl, this.modelLink);
        console.log('qr url');
        
        this.renderQrCode(qrUrl);
        this.showQrCode = true;
    }

    renderQrCode(url: URL) {
        console.log('rendering qr code');
        
        this.qrOptions['data'] = url.toString();
        //this.qrCode?.update(this.qrOptions);
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
