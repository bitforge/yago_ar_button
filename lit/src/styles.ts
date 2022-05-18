import { css } from 'lit';

export const styles = [
  css`
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

    .hidden {
        display: none !important;
    }

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
  `,
];