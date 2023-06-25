import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

class WidgetColumn extends LitElement {

  static styles = css`
  :host {
    text-align: center;
  }
  div { display: block; } /* divs are a bit nicer */

  `;

  constructor() {
    super();
    this.header = 'Widgets';
  }

  render() {
    return html`
      <div>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('widget-column', WidgetColumn);