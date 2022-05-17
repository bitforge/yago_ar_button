import { LitElement } from 'lit';
import Config from './interfaces/config';
export declare class ArButton extends LitElement {
    static styles: import("lit").CSSResult;
    model: string;
    qrTitle: string;
    qrText: string;
    buttonText: string;
    baseUrl: string;
    modelLink: string;
    config: Config;
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