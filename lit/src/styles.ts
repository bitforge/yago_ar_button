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

    .hidden {
      display: none !important;
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

    ar-modal {
        display: flex;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.3);
        padding: 10px;

        transition: .3s opacity ease;
        opacity: 1;
    }
  `,
];
