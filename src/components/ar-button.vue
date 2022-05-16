<template>
    <div :id="elementId" class="ar-button" :ref="elementId" v-show="showButton">
        <a
            ref="ar"
            rel="ar"
            :href="modelLink"
            @click="startAR"
            class="ar-link external"
            :style="{ 'background-color': templateProjectColor }"
        >
            <!-- image tag as first child is required for iOS -->
            <img />
            <ar-icon />
            {{ templateText }}
        </a>
        <modal-window v-show="showQrCode" @close="showQrCode = false">
            <div class="qr-element" :ref="qrId" :style="{ background: templateProjectColor }"></div>
            <h2 class="ar-modal-content">{{ templateQrTitle }}</h2>
            <p class="ar-modal-content" :style="{ width: qrSize + 'px' }">
                {{ templateQrText }}
            </p>
        </modal-window>
        <browser-unsupported :modelLink="modelLink" v-show="showBrowserHint" @close="showBrowserHint = false" />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARIcon from './ar-icon.vue';
import modal from './modal-window.vue';
import BrowserUnsupported from './browser-unsupported.vue';
import QRCodeStyling, { DrawType } from 'qr-code-styling';
import { ArButtonConfig } from '../interfaces/ar-button-config';

declare global {
    interface Window {
        MSStream: any;
    }
}

interface Config {
    site_url: string | null | undefined;
    quicklook_link: string | null | undefined;
    qr_config: object | null | undefined;
    ar_button_config: object | null | undefined;
}

const DEFAULT_TEXT = 'Place in your space';
const DEFAULT_QRTITLE = 'Here we go!';
const DEFAULT_QRTEXT = 'Scan the QR Code to place the model in your space.';
const DEFAULT_QRSIZE = 300;
const DEFAULT_DRAWMODE = 'svg';
const DEFAULT_PROJECTCOLOR = '#074e68';
const AR_CLICK_EVENT = new Event('ar-button-click');

@Component({
    name: 'ar-button',
    components: {
        'ar-icon': ARIcon,
        'modal-window': modal,
        'browser-unsupported': BrowserUnsupported,
    },
})
export default class ARButton extends Vue {
    @Prop()
    private model!: string;

    @Prop({ default: DEFAULT_TEXT })
    private text!: string;
    private templateText = '';

    @Prop({ default: DEFAULT_QRTITLE })
    private qrTitle!: string;
    private templateQrTitle = '';

    @Prop({ default: DEFAULT_QRTEXT })
    private qrText!: string;
    private templateQrText = '';

    @Prop({ default: DEFAULT_QRSIZE })
    private qrSize!: number;

    @Prop({ default: DEFAULT_DRAWMODE })
    private qrDrawMode!: string;

    @Prop({ default: DEFAULT_PROJECTCOLOR })
    private projectColor!: string;
    private templateProjectColor: string = DEFAULT_PROJECTCOLOR;

    public baseUrl = process.env.VUE_APP_YAGO_BASE_URL;
    public modelLink: URL;

    public isArSupported = false;
    public isBrowserSupported = true;

    public showQrCode = false;
    public showBrowserHint = false;

    private showButton = false;

    public qrCode: QRCodeStyling | null = null;
    public qrOptions = {
        width: this.qrSize - 24,
        height: this.qrSize - 24,
        type: (this.qrDrawMode ? this.qrDrawMode : 'svg') as DrawType,
        data: '',
        margin: 10,
        errorCorrectionLevel: 'Q',
        image: undefined,
    };

    public config: Config = {
        site_url: null,
        quicklook_link: null,
        qr_config: null,
        ar_button_config: null,
    };

    public get elementId() {
        return 'ar-button-' + this.model;
    }

    public get qrId() {
        return 'qrcode-' + this.model;
    }

    public constructor() {
        super();
        this.modelLink = new URL(`/v/${this.model}`, this.baseUrl);
    }

    public async mounted() {
        // Fetch config from yago server and update when ready
        this.config = await this.getConfig();

        this.checkDefaultVars();

        // On iOS: Change model link to open USDZ with AR Quicklook directly (Yago Redirect to USDZ model)
        if (this.isIos() && this.isQuicklookSupported() && this.config.quicklook_link) {
            this.isArSupported = true;
            this.isBrowserSupported = this.checkIosBrowserSupport();
            if (this.isBrowserSupported) {
                this.modelLink = new URL(this.config.quicklook_link);
            }
            const link = this.$refs.ar as HTMLAnchorElement;
            link.addEventListener('message', this.onCallToActionButtonTapped);
        }

        // On Android: Change link to open SceneViewer directly. Assume AR is supported, if not, a fallback page will be shown
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
        this.qrCode.append(this.$refs[this.qrId] as HTMLElement);

        this.showButton = true;
    }

    private checkDefaultVars(): void {
        if (this.config && this.config.ar_button_config) {
            const arButtonConfig: ArButtonConfig = this.config.ar_button_config as ArButtonConfig;

            let userLang = navigator.language;
            userLang = userLang.split('-')[0];

            const validLangs = ['en', 'de', 'fr', 'it'];
            const chosenLang = validLangs.includes(userLang) ? userLang : 'en';

            if (this.text == DEFAULT_TEXT) {
                this.templateText = arButtonConfig.arButtonText[chosenLang];
            } else {
                this.templateText = this.text;
            }

            if (this.qrTitle == DEFAULT_QRTITLE) {
                this.templateQrTitle = arButtonConfig.buttonTitle[chosenLang];
            } else {
                this.templateQrTitle = this.qrTitle;
            }

            if (this.qrText == DEFAULT_QRTEXT) {
                this.templateQrText = arButtonConfig.popupText[chosenLang];
            } else {
                this.templateQrText = this.qrText;
            }

            const arButtonElement: HTMLElement = this.$refs[this.elementId] as HTMLElement;

            if (arButtonElement) {
                const bgColor = getComputedStyle(arButtonElement).getPropertyValue('--background-color');
                const qrBorderColor = getComputedStyle(arButtonElement).getPropertyValue('--qr-code-border-color');

                if (bgColor || qrBorderColor) {
                    this.templateProjectColor = bgColor;
                } else {
                    if (this.projectColor != DEFAULT_PROJECTCOLOR) {
                        this.templateProjectColor = this.projectColor;
                    } else {
                        this.templateProjectColor = (arButtonConfig as any).projectColor;
                    }
                }
            } else {
                console.warn('Ar Button element is null.');
            }
        }
    }

    public onCallToActionButtonTapped(event: Event): void {
        if ((event as any).data == '_apple_ar_quicklook_button_tapped') {
            if (this.config.site_url) {
                window.location.assign('');
            } else {
                console.error('Model site_url must be defined when using callToAction.');
            }
        }
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

    private isIos(): boolean {
        return (
            (/iPad|iPod|iPhone/.test(navigator.platform) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
            !window.MSStream
        );
    }

    private isAndroid(): boolean {
        return /android/i.test(navigator.userAgent);
    }

    private isQuicklookSupported(): boolean {
        const link = this.$refs.ar as HTMLAnchorElement;
        if (link) return link.relList.supports('ar');
        return false;
    }

    private isWKWebView(): boolean {
        const _window = window as any;
        return _window.webkit && _window.webkit.messageHandlers;
    }

    private checkIosBrowserSupport(): boolean {
        // On iOS, some WKWebView based browsers like Chrome and Firefox do support Quicklook links,
        // while others like Brave, Opera or DuckDuckGo do not. They either offer to download the
        // USDZ File or, worse, show it's plain content. It's hard to detect unsupported browsers
        // since it can also be an embedded WebView in an App (e.g. LinkedIn In-App Browser).
        // Therefore, if WKWebView is detected, we only allow browsers with known Quicklook support.

        // TODO: Since iOS 15.4.1, ALL WKWebView based browsers are broken
        // Reenable this, when the bug in Chrome, Firefox etc is fixed
        if (this.isWKWebView()) {
            return false;
            /*
            // https://chromium.googlesource.com/chromium/src/+/HEAD/docs/ios/user_agent.md
            const isChrome = navigator.userAgent.includes('CriOS/');

            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent/Firefox#firefox_for_ios
            const isFirefox = navigator.userAgent.includes('FxiOS/');

            // https://blogs.windows.com/msedgedev/2017/10/05/microsoft-edge-ios-android-developer/
            const isEdge = navigator.userAgent.includes('EdgiOS/');

            // Only allow whitelisted browsers
            return isChrome || isFirefox || isEdge;
            */
        }

        // All other browsers like Safari, SFSafariViewController and others are feature detected
        return true;
    }

    public startAR(e: Event) {
        document.dispatchEvent(AR_CLICK_EVENT);

        // Show error on unsupported browsers (iOS WKWebView based third party browsers)
        if (!this.isBrowserSupported) {
            e.preventDefault();
            this.showBrowserHint = true;
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

    private async renderQrCode(url: URL) {
        this.qrOptions['data'] = url.toString();
        this.qrCode?.update(this.qrOptions);
    }

    private async getConfig(): Promise<Config> {
        try {
            const configResponse = await fetch(`${this.baseUrl}/api/models/${this.model}/embed/options/`);
            if (!configResponse.ok) throw configResponse;
            return await configResponse.json();
        } catch (e) {
            // Fallback to fixed scaling
            return this.config;
        }
    }
}
</script>

<style>
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
</style>
