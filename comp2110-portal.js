import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import './components/widget-block.js';
import './components/blog-block.js';
import './components/widget-column.js';
import './components/ad-widget.js';
import './components/login-widget.js';
import './components/currency-widget.js';
import './components/random-fact-by-MC.js';
import './components/upcoming-holidays.js';
import './components/weather-widget.js'

class Comp2110Portal extends LitElement {
  static properties = {
    header: { type: String },
  }

  static styles = css`
    :host {
      min-height: 100vh;   
      font-size: 14pt;
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
    }

    header {
      display: grid;
      grid-template-columns: 1fr 3fr 1fr;
      margin-bottom: 20px;
    }

    header h1 {
      grid-column: 2;
    }

    login-widget {
      grid-column: 3;
    }

    main {
      display: grid;
      grid-template-columns: 1fr 3fr 1fr;
      column-gap: 10px;
      margin: 0 15px 0 15px;
    }

    .left{
      grid-column: 1;
      width: auto;
    }

    blog-block {
      grid-column: 2;
    }

    .right {
      grid-column: 3;
      padding-left: 0;
      pading-right: 10%;
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
      position: relative;
      bottom: 0;
    }

    .app-footer a {
      margin-left: 5px;
      padding-top: 30px;
    }
    
    img {
      position: relative;
      left: 180%;

      width: 30%;
    }
  `;

  constructor() {
    super();
    this.header = 'COMP2110 Portal';
  }

  render() {
    return html`
      <header>
        <img src="https://www.logosc.cn/oss/icons/2022/06/29/oBokBiK0IcdBeiH.png">
        <h1>${this.header}</h1>
        <login-widget></login-widget>
      </header>

      <main> 
        <widget-column header="Left" class="left">
          <random-fact></random-fact>
          <currency-widget></currency-widget>
          <public-holidays-widget></public-holidays-widget>
          
        </widget-column>
        <blog-block></blog-block>    
        <widget-column header="Right" class="right">
          <ad-widget></ad-widget>
          <weather-f></weather-f>
        </widget-column>
      </main>
      <p class="app-footer">
        A product of the COMP2110 Web Development Collective &copy; 2023
      </p>
    `;
  }
}

customElements.define('comp2110-portal', Comp2110Portal);