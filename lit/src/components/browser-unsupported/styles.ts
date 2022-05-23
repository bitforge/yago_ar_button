import { css } from 'lit';

export const styles = [
  css`
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

    .hidden {
        display: none !important;
    }
  `,
];
