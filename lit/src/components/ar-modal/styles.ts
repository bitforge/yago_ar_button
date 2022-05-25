import { css } from 'lit';

export const styles = [
  css`
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

    .popup-hidden {
        display: none !important;
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
  `,
];
