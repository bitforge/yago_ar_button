import { LitElement } from 'lit';
export declare class ArButton extends LitElement {
    static styles: import("lit").CSSResult;
    model: string;
    qrTitle: string;
    qrText: string;
    buttonText: string;
    baseUrl: string;
    modelLink: string;
    config: {
        site_url: null;
        quicklook_link: null;
        qr_config: null;
        ar_button_config: null;
    };
    showQrCode: boolean;
    showButton: boolean;
    modalHtml: import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
    connectedCallback(): Promise<void>;
    startAr(e: Event): void;
    closeModalWindow(): void;
    getConfig(): Promise<any>;
    get elementId(): string;
}
//# sourceMappingURL=ar-button.d.ts.map