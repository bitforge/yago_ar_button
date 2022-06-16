import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import Config from './interfaces/config';
import { styles } from './styles';
import './components/ar-icon/ar-icon';
import './components/ar-modal/ar-modal';
import './components/browser-unsupported/browser-unsupported';
import { createRef, ref } from 'lit/directives/ref.js';
import QRCodeStyling, { DrawType } from 'qr-code-styling';
import ArButtonConfig from './interfaces/ar-button-config';

@customElement('ar-button')
export class ArButton extends LitElement {
    static styles = styles;

    DEFAULT_TEXT = 'Place in your space';
    DEFAULT_QRTITLE = 'Here we go!';
    DEFAULT_QRTEXT = 'Scan the QR Code to place the model in your space.';
    DEFAULT_QRSIZE = 300;
    DEFAULT_DRAWMODE = 'svg';
    DEFAULT_PROJECTCOLOR = '#074e68';

    @property()
    model = process.env.YAGO_MODEL;

    @property()
    buttonText = this.DEFAULT_TEXT;
    templateButtonText = '';

    @property()
    qrTitle = this.DEFAULT_QRTITLE;
    templateQrTitle = '';

    @property()
    qrText = this.DEFAULT_QRTEXT;
    templateQrText = '';

    @property()
    projectColor = '';
    templateProjectColor: string = this.DEFAULT_PROJECTCOLOR;

    @property()
    qrSize = this.DEFAULT_QRSIZE
    templateQrSize: number | null = null;

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

    @state()
    showBrowserHint = false;

    qrCode: QRCodeStyling | null = null;

    qrCodeRef = createRef();
    arButtonRef = createRef();

    isArSupported = false;
    isBrowserSupported = true;

    qrOptions = {
        width: this.qrSize - 24,
        height: this.qrSize - 24,
        type: 'svg' as DrawType,
        data: '',
        margin: 10,
        errorCorrectionLevel: 'Q',
        image: undefined,
    };

    qrCodeAppended = false;

    static get observedAttributes() {return [ 'text', 'qr-size', 'qr-title', 'qr-text', 'project-color' ]}

    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
        if (name == 'text')
            this.buttonText = newValue;

        if (name == 'qr-size') {
            if (isNaN(newValue)) {
                console.error('Yago Ar Button: Error: The QR Size must be a Number.');
                this.qrSize = 300;
            } else {
                this.qrSize = Number(newValue);
            }
        }

        if (name == 'qr-title')
            this.qrTitle = newValue;

        if (name == 'qr-text')
            this.qrText = newValue;

        if (name == 'project-color')
            this.projectColor = newValue;
      }

    render() { 
        return html`
        <div
            id="${this.elementId}" 
            class="ar-button ${!this.showButton ? 'hidden' : ''}">

            <a
                rel="ar"
                href="${this.modelLink}"
                @click=${this.startAr}
                ${ref(this.arButtonRef)}
                style="background-color: ${this.templateProjectColor};"
                class="ar-link external">
                    <!-- image tag as first child is required for iOS -->
                    <img />
                    <ar-icon></ar-icon>
                    ${this.templateButtonText}
            </a>
            
            <ar-modal
                @modal-close=${this.closeModalWindow}
                class="${!this.showQrCode ? 'hidden' : ''}">
                <div slot="default" style="width: ${this.qrSize}px">
                    <div ${ref(this.qrCodeRef)} class="qr-element" style="background: ${this.templateProjectColor};" ></div>
                    <p class="ar-modal-content">
                        <h2>${this.templateQrTitle}</h2> 
                        ${this.templateQrText}
                    </p>
                </div>
            </ar-modal>

            <browser-unsupported
                @modal-close=${this.closeBrowserUnsupported}
                class="${this.showBrowserHint ? '' : 'hidden'}"
                modelLink="${this.modelLink}"
                @modal-close="${this.showBrowserHint = false}">
            </browser-unsupported>
        </div>
        `;
    }

    protected async firstUpdated(): Promise<void> {
        this.modelLink = new URL(`/v/${this.model}`, this.baseUrl);

        if (!this.qrCodeRef.value) {
            console.error('QR Element is emtpy.');
            return;
        }

        this.config = await this.getConfig();

        this.checkDefaultVars();

        // On iOS: Change model link to open USDZ with AR Quicklook directly (Yago Redirect to USDZ model)
        if (this.isIos() && this.isQuicklookSupported() && this.config.quicklook_link) {
            this.isArSupported = true;
            this.isBrowserSupported = this.checkIosBrowserSupport();
            if (this.isBrowserSupported) {
                this.modelLink = new URL(this.config.quicklook_link);
            }
            const link = this.arButtonRef.value as HTMLAnchorElement;
            link.addEventListener('message', this.onCallToActionButtonTapped);
        }

        if (this.isAndroid()) {
            this.isArSupported = true;
            this.modelLink = this.buildSceneviewerLink();
        }

         // Initialize QR code drawing style
         if ('qr_config' in this.config) {
            Object.assign(this.qrOptions, this.config.qr_config);

            // Use higher error correction level when QR Code has image
            if ('image' in this.qrOptions && this.qrOptions['image']) {
                this.qrOptions['errorCorrectionLevel'] = 'H';
            }
        }

        this.qrCode = new QRCodeStyling(this.qrOptions);
        this.qrCode.append(this.qrCodeRef.value as HTMLElement);

        this.showButton = true;
    }

    checkDefaultVars(): void {
        if (this.config && this.config.ar_button_config) {
            const arButtonConfig: ArButtonConfig = this.config.ar_button_config as ArButtonConfig;

            let userLang = navigator.language;
            userLang = userLang.split('-')[0];

            const validLangs = ['en', 'de', 'fr', 'it'];
            const chosenLang = validLangs.includes(userLang) ? userLang : 'en';

            if (this.buttonText == this.DEFAULT_TEXT) {
                this.templateButtonText = arButtonConfig.arButtonText[chosenLang];
            } else {
                this.templateButtonText = this.buttonText;
            }

            if (this.qrTitle == this.DEFAULT_QRTITLE) {
                this.templateQrTitle = arButtonConfig.buttonTitle[chosenLang];
            } else {
                this.templateQrTitle = this.qrTitle;
            }

            if (this.qrText == this.DEFAULT_QRTEXT) {
                this.templateQrText = arButtonConfig.popupText[chosenLang];
            } else {
                this.templateQrText = this.qrText;
            }

            if (this.arButtonRef && this.arButtonRef.value) {
                const arButtonElement: Element = this.arButtonRef.value;

                const bgColor = getComputedStyle(arButtonElement).getPropertyValue('--background-color');
                const qrBorderColor = getComputedStyle(arButtonElement).getPropertyValue('--qr-code-border-color');

                if (bgColor || qrBorderColor) {
                    this.templateProjectColor = bgColor;
                } else {
                    if (this.projectColor != this.DEFAULT_PROJECTCOLOR) {
                        this.templateProjectColor = this.projectColor;
                    } else {
                        this.templateProjectColor = (arButtonConfig as any).projectColor;
                    }
                }
            } else {
                console.warn('AR Button Element is Null');
            }
        }
    }

    onCallToActionButtonTapped(event: Event): void {
        if ((event as any).data == '_apple_ar_quicklook_button_tapped') {
            if (this.config.site_url) {
                window.location.assign('');
            } else {
                console.error('Model site_url must be defined when using callToAction.');
            }
        }
    } 

    isIos(): boolean {
        return (
            (/iPad|iPod|iPhone/.test(navigator.platform) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
            !(window as any).MSStream
        );
    }

    isAndroid(): boolean {
        return /android/i.test(navigator.userAgent);
    }

    isQuicklookSupported(): boolean {
        const link = this.arButtonRef.value as HTMLAnchorElement;
        if (link) return link.relList.supports('ar');
        return false;
    }

    checkIosBrowserSupport(): boolean {
        // On iOS, some WKWebView based browsers like Chrome and Firefox do support Quicklook links,
        // while others like Brave, Opera or DuckDuckGo do not. They either offer to download the
        // USDZ File or, worse, show it's plain content. It's hard to detect unsupported browsers
        // since it can also be an embedded WebView in an App (e.g. LinkedIn In-App Browser).
        // Therefore, if WKWebView is detected, we only allow browsers with known Quicklook support.

        if (this.isWKWebView()) {
            // https://chromium.googlesource.com/chromium/src/+/HEAD/docs/ios/user_agent.md
            const isChrome = navigator.userAgent.includes('CriOS/');

            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent/Firefox#firefox_for_ios
            const isFirefox = navigator.userAgent.includes('FxiOS/');

            // https://blogs.windows.com/msedgedev/2017/10/05/microsoft-edge-ios-android-developer/
            const isEdge = navigator.userAgent.includes('EdgiOS/');

            // Only allow whitelisted browsers
            return isChrome || isFirefox || isEdge;
        }

        // All other browsers like Safari, SFSafariViewController and others are feature detected
        return true;
    }

    isWKWebView(): boolean {
        const _window = window as any;
        return _window.webkit && _window.webkit.messageHandlers;
    }

    startAr(e: Event): void {
        const arClickEventPayload = {
            modelId: this.model,
            arButtonId: this.elementId,
        };
        
        const arClickEvent = new CustomEvent('ar-button-click', { detail: arClickEventPayload });
        document.dispatchEvent(arClickEvent);

        if (!this.isBrowserSupported) {
            e.preventDefault();
            this.showBrowserHint = true;
            return;
        }

        if (!this.modelLink) {
            e.preventDefault();
            console.error('ArButton: StartAr: ModelLink is empty.')
            return;
        }

        // Show QR Code on devices without AR Support
        if (!this.isArSupported) {
            e.preventDefault();

            // Pass current document url in QR code as page_url parameter
            // This ensures correct return urls in single page apps
            const encodedUrl = encodeURIComponent(window.location.toString());
            const qrUrl = new URL('?page_url=' + encodedUrl, this.modelLink);

            this.renderQrCode(qrUrl);
            this.showQrCode = true;
        }

        // On AR supported devices just follow the link
    }

    renderQrCode(url: URL) {
        this.qrOptions['data'] = url.toString();
        this.qrCode?.update(this.qrOptions);
    }
    
    closeModalWindow(): void {
        this.showQrCode = false;
    }

    closeBrowserUnsupported(): void {
        this.showBrowserHint = false;
    }

    private buildSceneviewerLink(): URL {
        // Pass current location as backlink. Will be shown as 'Visit' Link in SceneViewer
        const pageUrl = new URL(window.location.toString());
        if (!pageUrl.hash || pageUrl.hash.startsWith('#ar-button')) {
            pageUrl.hash = '#' + this.elementId;
        }
        const encodedUrl = encodeURIComponent(pageUrl.toString());

        return new URL(`/v/${this.model}/sceneviewer?page_url=${encodedUrl}`, this.baseUrl);
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
