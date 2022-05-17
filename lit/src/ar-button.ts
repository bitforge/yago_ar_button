import {html, css, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import Config from './interfaces/config';

@customElement('ar-button')
export class ArButton extends LitElement {
    static styles = css`
        .ar-button {
            display: inline-block;
            font-family: var(--font-family, Avenir, Helvetica, Arial, sans-serif);
        }
        
        .ar-button > .ar-link {
            background-color: var(--background-color, #074e68);
            color: var(--color, #ffffff);
            text-decoration: var(--text-decoration, none);
            border: var(--border, none);
            border-radius: var(--border-radius, 8px);
            padding: var(--padding, 8px 16px);
            display: inline-flex;
            align-items: center;

            transition: background-color 0.2s ease;
        }

        .hidden {
            display: none !important;
        }

        .ar-button-modal {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.3);
            padding: 10px;

            transition: .3s opacity ease;
            opacity: 1;
        }
        
        .ar-button-modal .modal-inner {
            display: flex;
            flex-direction: column;
            border-radius: 1em;
            background: #ffffff;
            box-shadow: 1px 1px 20px 1px #838383;
            overflow-x: auto;
            /*flex: 1;
            max-width: 520px;*/
        }
        
        .ar-button-modal .ar-modal-header {
            display: flex;
            justify-content: flex-end;
            padding: 15px;
        }
        
        .ar-button-modal .button-close {
            border: none;
            font-size: 38px;
            cursor: pointer;
            color: #a99fa4;
            background: transparent;
            font-weight: normal;
            margin: 0;
            padding: 0;
        }
        
        .ar-button-modal .button-close:focus {
            outline: none;
        }
        
        .ar-button-modal .ar-modal-body {
            position: relative;
            margin: 20px 60px;
        }
        
        .ar-button-modal .ar-modal-footer {
            color: #000000;
            border-top: 1px solid #888888;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
        }
        
        @media (-webkit-min-device-pixel-ratio: 2) {
            .ar-button-modal .ar-modal-footer {
                border-top: 0.5px solid #888888;
            }
        }
        
        .ar-button-modal .ar-modal-footer a {
            color: inherit;
            text-decoration: none;
        }
        
        .ar-button-modal .ar-modal-footer img {
            position: relative;
            top: 2px;
            margin: 0 4px;
            height: 16px;
        }
        
        .ar-button-modal .ar-modal-footer p {
            font-family: var(--font-family, Avenir, Helvetica, Arial, sans-serif);
            font-size: 16px;
            margin: 0;
            padding: 16px 0;
        }
        .ar-button {
            display: inline-block;
            font-family: var(--font-family, Avenir, Helvetica, Arial, sans-serif);
        }
        
        .ar-button > .ar-link {
            background-color: var(--background-color, #074e68);
            color: var(--color, #ffffff);
            text-decoration: var(--text-decoration, none);
            border: var(--border, none);
            border-radius: var(--border-radius, 8px);
            padding: var(--padding, 8px 16px);
            display: inline-flex;
            align-items: center;
        }
        
        .ar-button .ar-icon {
            width: var(--ar-icon-height, 30px);
            height: var(--ar-icon-height, 30px);
            margin-right: 4px;
        }
        
        .ar-button .ar-icon-path {
            fill: var(--color, #ffffff);
        }
        
        .qr-canvas {
            display: block;
        }
        
        .qr-element {
            display: flex;
            justify-content: center;
            align-content: center;
            padding: 12px;
            background: var(--qr-code-border-color, #074e68);
        }
        
        .qr-element img {
            display: block;
        }
        
        .ar-modal-header h2 {
            margin: 0;
            padding: 15px 10px 10px 10px;
        }
        
        .ar-modal-content {
            color: #000000;
            text-align: left;
        }
        
        h2.ar-modal-content {
            font-family: var(--font-family, Avenir, Helvetica, Arial, sans-serif);
            font-size: 24px;
            margin: 0;
            padding: 20px 0;
        }
        
        p.ar-modal-content {
            font-family: var(--font-family, Avenir, Helvetica, Arial, sans-serif);
            font-size: 16px;
            margin: 0;
            padding: 0 0 16px 0;
        }
    `;

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

            <a
                rel="ar"
                href="${this.modelLink}"
                @click=${this.startAr}
                class="ar-link external">
                    <!-- image tag as first child is required for iOS -->
                    <img />
                    <svg
                        class="ar-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 24 24"
                        version="1.1"
                        x="0px"
                        y="0px"
                    >
                        <title>icon/augmented-reality</title>
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <path
                                class="ar-icon-path"
                                fill="#ffffff"
                                fill-rule="nonzero"
                                d="M19.7190894,6.05052769 C19.814566,6.09698073 19.8960604,6.17408691 19.9472136,6.2763932 C19.9496524,6.28127083 19.952004,6.28616925 19.954269,6.29108671 C19.9592282,6.3018659 19.9638087,6.31283194 19.9679984,6.32396506 C19.9910663,6.3852123 20.0012988,6.44811502 20,6.51005871 L20,10 C20,10.2761424 19.7761424,10.5 19.5,10.5 C19.2238576,10.5 19,10.2761424 19,10 L19,7.30901699 L16.7236068,8.4472136 C16.4766175,8.57070822 16.176281,8.47059605 16.0527864,8.2236068 C15.9292918,7.97661755 16.029404,7.67628103 16.2763932,7.5527864 L18.381966,6.5 L16.2763932,5.4472136 C16.029404,5.32371897 15.9292918,5.02338245 16.0527864,4.7763932 C16.176281,4.52940395 16.4766175,4.42929178 16.7236068,4.5527864 L19.7190894,6.05052769 Z M20,16.4899413 C20.0015392,16.5633494 19.9868837,16.6381045 19.954269,16.7089133 C19.9297792,16.7621441 19.8960558,16.8108178 19.8545725,16.8525503 C19.8124725,16.8943746 19.7675846,16.9258776 19.7190894,16.9494723 L16.7236068,18.4472136 C16.4766175,18.5707082 16.176281,18.470596 16.0527864,18.2236068 C15.9292918,17.9766175 16.029404,17.676281 16.2763932,17.5527864 L18.381966,16.5 L16.2763932,15.4472136 C16.029404,15.323719 15.9292918,15.0233825 16.0527864,14.7763932 C16.176281,14.529404 16.4766175,14.4292918 16.7236068,14.5527864 L19,15.690983 L19,13 C19,12.7238576 19.2238576,12.5 19.5,12.5 C19.7761424,12.5 20,12.7238576 20,13 L20,16.4899413 Z M4.61803399,16.5 L6.7236068,17.5527864 C6.97059605,17.676281 7.07070822,17.9766175 6.9472136,18.2236068 C6.82371897,18.470596 6.52338245,18.5707082 6.2763932,18.4472136 L3.28091063,16.9494723 C3.18543397,16.9030193 3.10393955,16.8259131 3.0527864,16.7236068 C3.05034759,16.7187292 3.04799599,16.7138307 3.045731,16.7089133 C3.04077183,16.6981341 3.0361913,16.6871681 3.03200163,16.6760349 C3.0089337,16.6147877 2.99870119,16.551885 3,16.4899413 L3,13 C3,12.7238576 3.22385763,12.5 3.5,12.5 C3.77614237,12.5 4,12.7238576 4,13 L4,15.690983 L6.2763932,14.5527864 C6.52338245,14.4292918 6.82371897,14.529404 6.9472136,14.7763932 C7.07070822,15.0233825 6.97059605,15.323719 6.7236068,15.4472136 L4.61803399,16.5 Z M4,7.30901699 L4,10 C4,10.2761424 3.77614237,10.5 3.5,10.5 C3.22385763,10.5 3,10.2761424 3,10 L3,6.51005871 C2.99846081,6.43665055 3.01311634,6.3618955 3.045731,6.29108671 C3.07022081,6.23785594 3.10394418,6.18918216 3.14542751,6.14744967 C3.18752755,6.10562541 3.23241545,6.07412245 3.28091063,6.05052769 L6.2763932,4.5527864 C6.52338245,4.42929178 6.82371897,4.52940395 6.9472136,4.7763932 C7.07070822,5.02338245 6.97059605,5.32371897 6.7236068,5.4472136 L4.61803399,6.5 L6.7236068,7.5527864 C6.97059605,7.67628103 7.07070822,7.97661755 6.9472136,8.2236068 C6.82371897,8.47059605 6.52338245,8.57070822 6.2763932,8.4472136 L4,7.30901699 Z M11.2673964,2.0572848 C11.3368783,2.02070348 11.4160214,2 11.5,2 C11.5839786,2 11.6631217,2.02070348 11.7326036,2.0572848 L14.7236068,3.5527864 C14.970596,3.67628103 15.0707082,3.97661755 14.9472136,4.2236068 C14.823719,4.47059605 14.5233825,4.57070822 14.2763932,4.4472136 L12,3.30901699 L12,6 C12,6.27614237 11.7761424,6.5 11.5,6.5 C11.2238576,6.5 11,6.27614237 11,6 L11,3.30901699 L8.7236068,4.4472136 C8.47661755,4.57070822 8.17628103,4.47059605 8.0527864,4.2236068 C7.92929178,3.97661755 8.02940395,3.67628103 8.2763932,3.5527864 L11.2673964,2.0572848 Z M11.7326036,20.9427152 C11.6631217,20.9792965 11.5839786,21 11.5,21 C11.4160214,21 11.3368783,20.9792965 11.2673964,20.9427152 L8.2763932,19.4472136 C8.02940395,19.323719 7.92929178,19.0233825 8.0527864,18.7763932 C8.17628103,18.529404 8.47661755,18.4292918 8.7236068,18.5527864 L11,19.690983 L11,17 C11,16.7238576 11.2238576,16.5 11.5,16.5 C11.7761424,16.5 12,16.7238576 12,17 L12,19.690983 L14.2763932,18.5527864 C14.5233825,18.4292918 14.823719,18.529404 14.9472136,18.7763932 C15.0707082,19.0233825 14.970596,19.323719 14.7236068,19.4472136 L11.7326036,20.9427152 Z M12,10.809017 L12,13.5 C12,13.7761424 11.7761424,14 11.5,14 C11.2238576,14 11,13.7761424 11,13.5 L11,10.809017 L8.2763932,9.4472136 C8.02940395,9.32371897 7.92929178,9.02338245 8.0527864,8.7763932 C8.17628103,8.52940395 8.47661755,8.42929178 8.7236068,8.5527864 L11.5,9.94098301 L14.2763932,8.5527864 C14.5233825,8.42929178 14.823719,8.52940395 14.9472136,8.7763932 C15.0707082,9.02338245 14.970596,9.32371897 14.7236068,9.4472136 L12,10.809017 Z"
                            ></path>
                        </g>
                    </svg>
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

    async connectedCallback() {
        super.connectedCallback();
        
        // Fetch config from yago server and update when ready
        this.config = await this.getConfig();
        console.log(this.config)

        this.showButton = true;
    }

    startAr(e: Event) {
        console.log('showing qr code?');

        
        e.preventDefault();

        console.log('showing qr code?');
        
        this.showQrCode = true;
    }
    
    closeModalWindow() {
        this.showQrCode = false;
    }
    
    async getConfig() {
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
      
    get elementId() {
    return 'ar-button-' + this.model; 
    }
}
