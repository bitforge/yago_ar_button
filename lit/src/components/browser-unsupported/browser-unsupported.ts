import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styles } from './styles';
import '../ar-modal/ar-modal';

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

@customElement('browser-unsupported')
export class BrowserUnsupported extends LitElement {
    static styles = styles;

    @property()
    modelLink!: string;

    @state()
    urlCopied = false;

    @state()
    browserUnsupportedTitle = '';

    @state()
    browserUnsupportedBody = '';

    locale = 'en';

    close() {
        const event = new CustomEvent('modal-close', { bubbles: true, });
        this.dispatchEvent(event);
    }

    initLocale() {
        const browserLang = navigator.language.substring(0, 2);
        const supportedLanguages = Object.keys(messages);
        if (supportedLanguages.includes(browserLang)) {
            this.locale = browserLang;
        }
    }

    _(key: string): string {
        return messages[this.locale][key] || key;
    }

    async copyUrl() {
        try {
            this.urlCopied = true;
            await navigator.clipboard.writeText(this.modelLink.toString());
            setTimeout(() => (this.urlCopied = false), 1000);
        } catch (error) {
            console.error(error);
        }
    }
    
    updated(): void {
        this.initLocale();

        this.browserUnsupportedTitle = this._('browser_unsupported_title');
        this.browserUnsupportedBody = this._('browser_unsupported_body');
    }


    render() {
        return html`
        <ar-modal modalClass="ar-button-browser-unsupported">
            <template slot=header>
                <div class="notsupported-modal-header">
                    <h2>${this.browserUnsupportedTitle}</h2>
                    <button type="button" class="button-close" @click=${this.close}>✕</button>
                </div>
            </template>

            <template slot=default>
                <p class="content">
                    ${this.browserUnsupportedBody}
                </p>
                <div class="copy-container">
                    <input type="text" class="model-url" value="${this.modelLink }" onclick="this.select();" readonly />
                    <div class="clipboard-tooltip">
                        <span>${this._('clipboard_tooltip')}</span>
                    </div>
                    <button class="copy-to-clipboard" @click=${this.copyUrl} class="${this.urlCopied ? 'copied' : ''}">
                        <svg
                            id="copy-to-clipboard"
                            class="${this.urlCopied ? 'hidden' : ''}"
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 0 24 24"
                            width="24px"
                            fill="#000000">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path
                                d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                            />
                        </svg>
                        <svg
                            id="success"
                            class="${this.urlCopied ? 'hidden' : ''}"
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 0 24 24"
                            width="24px"
                            fill="#ffffff">
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"
                            />
                        </svg>
                    </button>
                </div>
            </template>
        </ar-modal>
        `;
    }
}