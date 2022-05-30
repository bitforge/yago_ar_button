import { css } from 'lit';

export const styles = [
  css`
   header {
        padding: 0 15px;
    }

   section {
        margin: 0;
    }

   .notsupported-modal-header {
        position: relative;
    }

   .copy-container {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-bottom: 16px;
        padding: 0 24px 24px 24px;
    }

   .content {
        padding: 0 24px;
        text-align: center;
    }

   .model-url {
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

   .copy-to-clipboard {
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

   .copy-to-clipboard.copied {
        background-color: #4caf50;
    }

   .ar-modal-header h2 {
        margin: 0;
        padding: 45px 10px 20px 15px;
        text-align: center;
    }

   .clipboard-tooltip {
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

   .clipboard-tooltip ::after {
        content: '';
        position: absolute;
        top: -10px;
        right: 20px;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent #555 transparent;
    }

   .copy-container:hover .clipboard-tooltip {
        visibility: hidden;
        opacity: 0;
    }

    .hidden {
        display: none !important;
    }
  `,
];
