<template>
    <modal-window modalClass="ar-button-browser-unsupported">
        <template v-slot:header>
            <div class="notsupported-modal-header">
                <h2>{{ _('browser_unsupported_title') }}</h2>
                <button type="button" class="button-close" @click="close">✕</button>
            </div>
        </template>

        <template v-slot:default>
            <p class="content">
                {{ _('browser_unsupported_body') }}
            </p>
            <div class="copy-container">
                <input type="text" class="model-url" :value="modelLink" onclick="this.select();" readonly />
                <div class="clipboard-tooltip">
                    <span>{{ _('clipboard_tooltip') }}</span>
                </div>
                <button class="copy-to-clipboard" @click="copyUrl" :class="{ copied: urlCopied }">
                    <svg
                        id="copy-to-clipboard"
                        v-if="!urlCopied"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#000000"
                    >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path
                            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                        />
                    </svg>
                    <svg
                        id="success"
                        v-if="urlCopied"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#ffffff"
                    >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"
                        />
                    </svg>
                </button>
            </div>
        </template>
    </modal-window>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import modal from './modal-window.vue';

interface Messages {
    [key: string]: {
        [key: string]: string;
    };
}

const messages: Messages = {
    en: {
        browser_unsupported_title: 'Oops! Looks like your browser doesn’t support AR content.',
        browser_unsupported_body: 'Please open this link in Safari, Chrome or Firefox.',
        clipboard_tooltip: 'Click to copy link.',
    },
    de: {
        browser_unsupported_title: 'Ohje! Sieht aus, als würde dein Browser keine AR-Inhalte unterstützen.',
        browser_unsupported_body: 'Bitte öffne diesen Link in Safari, Chrome oder Firefox.',
        clipboard_tooltip: 'Klicke um den Link zu kopieren.',
    },
};

@Component({
    name: 'browser-unsupported',
    components: {
        'modal-window': modal,
    },
})
export default class BrowserUnsupported extends Vue {
    @Prop()
    public modelLink!: string;

    public urlCopied = false;
    public locale = 'en';

    public mounted(): void {
        this.initLocale();
    }

    public close() {
        this.$emit('close');
    }

    public initLocale() {
        const browserLang = navigator.language.substring(0, 2);
        const supportedLanguages = Object.keys(messages);
        if (supportedLanguages.includes(browserLang)) {
            this.locale = browserLang;
        }
    }

    public _(key: string): string {
        return messages[this.locale][key] || key;
    }

    public async copyUrl() {
        try {
            this.urlCopied = true;
            await navigator.clipboard.writeText(this.modelLink.toString());
            setTimeout(() => (this.urlCopied = false), 1000);
        } catch (error) {
            console.error(error);
        }
    }
}
</script>

<style>
.ar-button-browser-unsupported .button-close {
    display: none;
}

.ar-button-browser-unsupported header {
    padding: 0 15px;
}

.ar-button-browser-unsupported section {
    margin: 0;
}

.ar-button-browser-unsupported .notsupported-modal-header {
    position: relative;
}

.ar-button-browser-unsupported .copy-container {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 24px 24px 24px;
}

.ar-button-browser-unsupported .content {
    padding: 0 24px;
    text-align: center;
}

.ar-button-browser-unsupported .model-url {
    padding: 4px 8px;
    background: transparent;
    border-radius: 4px 0 0 4px;
    border: 1px solid #999;
    font-size: 18px;
    text-align: center;
    height: 24px;
    flex-grow: 1;
    margin: 0;
}

.ar-button-browser-unsupported .copy-to-clipboard {
    border-radius: 0 4px 4px 0;
    border: 1px solid #999;
    border-left: 0;
    background-color: #ffffff;
    box-shadow: none;
    height: 34px;
    padding: 0 8px;
    margin: 0;
    transition: background-color 0.2s ease-in;
}

.ar-button-browser-unsupported .copy-to-clipboard.copied {
    background-color: #4caf50;
}

.ar-button-browser-unsupported .ar-modal-header h2 {
    margin: 0;
    padding: 45px 10px 20px 15px;
    text-align: center;
}

.ar-button-browser-unsupported .button-close {
    border: none;
    background: none;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 18px;
}

.ar-button-browser-unsupported .clipboard-tooltip {
    visibility: visible;
    width: 120px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: -10px;
    right: 20px;
    margin-left: -60px;
    opacity: 1;
    transition: opacity 0.3s;
    font-size: 12px;
}

.ar-button-browser-unsupported .clipboard-tooltip ::after {
    content: '';
    position: absolute;
    top: -10px;
    right: 20px;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #555 transparent;
}

.ar-button-browser-unsupported .copy-container:hover .clipboard-tooltip {
    visibility: hidden;
    opacity: 0;
}
</style>
