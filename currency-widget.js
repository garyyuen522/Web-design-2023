import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { CURRENCY_URL } from '../config.js';

class CurrencyWidget extends LitElement {
  static properties = {
    fromCurr: { type: String },
    toCurr: { type: String },
    amount: { type: String },
    _currencies: { type: String },
    _result: { state: true },
  }

  static styles = css`
    :host {
      display: block;
      background-color: #6ad2d4ad;
      width: 300px;
      border-radius: 15px;
      padding-bottom: 5px;
    }

    #curr-input {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    #from-input {
      grid-column: 1;
    }

    #to-input {
      grid-column: 2;
    }
  `;
  
  constructor() {
    super();
    this._currencies = ["AUD", "USD", "NZD", "EUR"];
    this.fromCurr = "AUD";
    this.toCurr = "USD";
    this.amount = "1";
    this._fetch();
  }

  _fetch() {
    let SEARCH_URL = CURRENCY_URL + "from=" + this.fromCurr + "&to=" + this.toCurr + "&amount=" + this.amount;
    fetch(SEARCH_URL)
    .then(response => response.json())
    .then(dataFetched => {
      this._result = dataFetched.result;
    })
  }

  _updateFromCurr(e) {
    this.fromCurr = e.target.value;
    this._result = undefined;
    this._fetch();
  }

  _updateToCurr(e) {
    this.toCurr = e.target.value;
    this._result = undefined;
    this._fetch();
  }

  _updateAmount(e) {
    this.amount = e.target.value;
    this._result = undefined;
    this._fetch();
  }

  render() {
    return html`
      <h3>Currency converter</h3>
        <form>
          <label id="amount_label for="amount">Amount:<br>
          <input type="text" id="amount" name="amount" @input=${this._updateAmount}><br>

          <div id="curr-input">
            <div id="from-input>
              <label id="fromCurr_label for="fromCurr">From:<br>
              <select id="fromCurr" name="fromCurr" @change=${this._updateFromCurr}>
                ${this._currencies.map(fromCurr => {
                  let selected = fromCurr == this.fromCurr;
                  return html`<option name=${fromCurr} ?selected=${selected}>${fromCurr}</option>`
                })}
              </select>
            </div>

            <div id="to-input>
              <label id="toCurr_label for="toCurr">To:<br>
              <select id="toCurr" name="toCurr" @change=${this._updateToCurr}>
                ${this._currencies.map(toCurr => {
                  let selected = toCurr == this.toCurr;
                  return html`<option name=${toCurr} ?selected=${selected}>${toCurr}</option>`
                })}
              </select>
            </div>
          </div>

          <p>${this.amount} ${this.fromCurr} in ${this.toCurr} is ${this._result}</p>
        </form> 
    `;
  }
}

customElements.define('currency-widget', CurrencyWidget);
