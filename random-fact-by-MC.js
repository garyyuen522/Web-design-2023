import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { RANDOM_URL } from '../config.js';

class RandomFact extends LitElement {
  static properties = {
    _date: {state: true},
    _month: {state: true},
    content: {type: String}
  }

  static styles = css`
    .random_fact {
      background-color: #6ad2d4ad;
      width: 300px;
      border-radius: 15px;
    }

    p {
      color: black;
      font-size: 20px;
      padding-left: 15px;
      padding-right: 15px;
      padding-bottom: 15px;
      text-align: center;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._date = new Date(Date.now()).getDate();
    this._month = new Date(Date.now()).getMonth() + 1;
    this.BASE_URL = RANDOM_URL + this._month + '/' + this._date + '/date';
    this._fetch();
  }

  _fetch(){
    fetch(this.BASE_URL)
    .then(response => response.text())
    .then(data => {
      this.content = data;
    });
  }

  render() {
    if(this.content){
      return html`
        <div class="random_fact">
          <h3>Random Fact</h3>
          <p>${this.content}</p>
        </div>
      `;
    }else{
      return html`<p>No fact available</p>`;
    }
  }
}

customElements.define('random-fact', RandomFact);
