import { css } from 'lit';

export const styles = [
  css`
  .ar-icon {
        width: var(--ar-icon-height, 30px);
        height: var(--ar-icon-height, 30px);
        margin-right: 4px;
    }

    .ar-icon-path {
        fill: var(--color, #ffffff);
    }

    .hidden {
      display: none !important;
    }
  `,
];
