import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import Config from './interfaces/config';
import { styles } from './styles';
import './components/ar-icon/ar-icon';
import './components/ar-modal/ar-modal';

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
            </ar-modal>
        </div>
        `;
    }

    async connectedCallback(): Promise<void> {
        super.connectedCallback();
        
        // Fetch config from yago server and update when ready
        this.config = await this.getConfig();

        console.log('after get conifg');    

        this.showButton = true;

        console.log('show button is true');
        
    }

    startAr(e: Event): void {
        e.preventDefault();
        
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
