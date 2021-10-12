<template>
    <div :id="elementId" class="ar-button">
        <a ref="ar" rel="ar" :href="modelLink" @click="startAR">
            <!-- image tag as first child is required for iOS -->
            <img />
            <ar-icon />
            {{ text }}
        </a>
        <modal-window
            v-show="showQrCode"
            @close="showQrCode = false">
            <div class="qr-element" ref="qrcode"></div>
            <h2 class="modal-content">{{ qrTitle }}</h2>
            <p class="modal-content" :style="{ 'width': qrSize + 'px' }">
                {{ qrText }}
            </p>
        </modal-window>
        <browser-unsupported
            :modelLink="modelLink"
            v-show="showBrowserHint"
            @close="showBrowserHint = false" />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARIcon from './ar-icon.vue';
import modal from './modal-window.vue';
import BrowserUnsupported from './browser-unsupported.vue';
import QRCodeStyling, {DrawType} from 'qr-code-styling';

interface Config {
    scaleable: boolean;
    qrConfig: object | null | undefined;
}

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

    @Prop({ default: 'Place in your space' })
    private text!: string;

    @Prop({ default: 'Here we go!' })
    private qrTitle!: string;

    @Prop({ default: 'Scan the QR Code to place the model in your space.' })
    private qrText!: string;

    @Prop({ default: 200 })
    private qrSize!: number;

    private baseUrl = process.env.VUE_APP_GENIE_BASE_URL;
    private modelLink: URL;

    private isArSupported = false;
    private isBrowserSupported = true;

    private showQrCode = false;
    private showBrowserHint = false;

    private qrCode: QRCodeStyling | null = null;
    private qrOptions = {
        width: this.qrSize - 24,
        height: this.qrSize - 24,
        type: 'svg' as DrawType,
        data: '',
        margin: 10,
        errorCorrectionLevel: 'Q',
        image: undefined,
    }

    private config: Config = {
        scaleable: false,
        qrConfig: null,
    }

    public get elementId() {
        return 'ar-button-' + this.model;
    }

    public constructor() {
        super();
        this.modelLink = new URL(`/v/${this.model}`, this.baseUrl);
    }

    public async mounted() {


        // On iOS: Change model link to open USDZ with AR Quicklook directly (Genie Redirect to USDZ model)
        if (this.isIos() && this.isQuicklookSupported()) {
            this.isArSupported = true;
            this.isBrowserSupported = this.checkIosBrowserSupport();
            if (this.isBrowserSupported) {
                this.modelLink = await this.buildQuicklookLink();
            }
        }

        // On Android: Change link to open SceneViewer directly. Assume AR is supported, if not, a fallback page will be shown
        if (this.isAndroid()) {
            this.isArSupported = true;
            this.modelLink = this.buildSceneviewerLink();
        }

        // If the model id is part of the fragment, make sure AR button is visible by scrolling it into view
        if (this.modelIdInFragment()) {
            this.ensureButtonIsVisible();
        }

        // Fetch config from genie server and update when ready
        this.config = await this.getConfig();

        if ('qrConfig' in this.config) {
            Object.assign(this.qrOptions, this.config.qrConfig)
            // Use higher error correction level when QR Code has image
            if ('image' in this.qrOptions && this.qrOptions['image']) {
                this.qrOptions['errorCorrectionLevel'] = 'H';
            }
        }
        this.qrCode = new QRCodeStyling(this.qrOptions);
        this.qrCode.append(this.$refs.qrcode as HTMLElement);
    }

    private async buildQuicklookLink(): Promise<URL> {
        const scaleable = this.config.scaleable;

        return new URL(
            `/v/${this.model}/quicklook#allowsContentScaling=${scaleable}`,
            this.baseUrl
        );
    }

    private buildSceneviewerLink(): URL {
        // Pass current location as backlink. Will be shown as 'Visit' Link in SceneViewer
        const pageUrl = new URL(window.location.toString());
        if (!pageUrl.hash || pageUrl.hash.startsWith('#ar-button')) {
            pageUrl.hash = '#' + this.elementId;
        }
        const encodedUrl = encodeURIComponent(pageUrl.toString());

        return new URL(
            `/v/${this.model}/sceneviewer?page_url=${encodedUrl}`,
            this.baseUrl
        );
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
        // https://webkit.org/blog/8421/viewing-augmented-reality-assets-in-safari-for-ios/
        const link = this.$refs.ar as HTMLAnchorElement;
        if (link) return link.relList.supports('ar');
        return false;
    }

    private isWKWebView(): boolean {
        // https://stackoverflow.com/questions/28795476/detect-if-page-is-loaded-inside-wkwebview-in-javascript
        const _window = window as any;
        return _window.webkit && _window.webkit.messageHandlers;
    }

    private checkIosBrowserSupport(): boolean {
        // On iOS, some WKWebView based browsers like Chrome and Firefox do support Quicklook links,
        // while others like Brave, Opera or DuckDuckGo do not. They either offer to download the
        // USDZ File or worse, show it's plain content. It's hard to detect unsupported browsers
        // since it can also be an embedded WebView in an App (e.g. LinkedIn In-App Browser).
        // Therefore, if WKWebView is detected, we only allow browsers known to work.

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

        // Allow other browsers are explictly not checked!
        return true;
    }

    private startAR(e: Event) {
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
        // Nice idea, but fails to load chunks
        //const qrcode = await import('qrcode'/* webpackChunkName: "qrcode" */);
        this.qrOptions['data'] = url.toString();
        this.qrCode?.update(this.qrOptions);
    }

    private async getConfig(): Promise<Config> {
        try {
            const infoResponse = await fetch(`${this.baseUrl}/v/${this.model}/config`);
            if (!infoResponse.ok) throw infoResponse;
            return await infoResponse.json();
        } catch (e) {
            // Fallback to fixed scaling
            return this.config;
        }
    }

    private modelIdInFragment(): boolean {
        if (window.location.hash && window.location.hash.startsWith('#')) {
            const fragment = window.location.hash.substr(1);
            return fragment === this.elementId || fragment.includes('ar-button=' + this.elementId);
        }
        return false;
    }

    private ensureButtonIsVisible() {
        // Keep model id in scope of closure. `this.` won't work in load event handler
        const modelId = this.model;
        window.addEventListener('load', () => {
            const arButton = document.querySelector('ar-button[model="' + modelId + '"]');
            arButton?.scrollIntoView({ block: 'center' });
        });
    }
}
</script>

<style>
.ar-button {
    display: inline-block;
    font-family: var(--font-family, Avenir, Helvetica, Arial, sans-serif);
}

.ar-button > a {
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
    background: var(
        --qr-code-border-color,
        linear-gradient(
            90deg,
            rgba(245, 135, 85, 1) 0%,
            rgba(255, 193, 160, 1) 43%,
            rgba(195, 218, 224, 1) 68%
        )
    );
}

.qr-element img {
    display: block
}

.modal-header h2 {
    margin: 0;
    padding: 15px 10px 10px 10px;
}

.modal-content {
    text-align: left;
}
</style>