var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
let ArButton = class ArButton extends LitElement {
    constructor() {
        super(...arguments);
        this.name = 'Somebody';
    }
    render() {
        return html `<p>Hello, ${this.name}!</p>`;
    }
};
ArButton.styles = css `p { color: blue }`;
__decorate([
    property()
], ArButton.prototype, "name", void 0);
ArButton = __decorate([
    customElement('ar-button')
], ArButton);
export { ArButton };
//# sourceMappingURL=ar-button.js.map