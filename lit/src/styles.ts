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
  `,
];
