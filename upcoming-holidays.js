import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { countries } from './countries.js'; // list of supported countries

class PublicHolidaysWidget extends LitElement {
  static get properties() {
    return {
      countryCode: { type: String },
      holidays: { type: Array },
    };
  }

  static styles = css`
  ul {
    list-style: none;
    padding: 15px;
  }
  li {
    text-align: left;
  }
    div {
      background-color: #6ad2d4ad;
      width: 300px;
      border-radius: 15px;
    }
  `

  constructor() {
    super();
    this.countryCode = 'AU'; // default to Australia
    this.holidays = [];

  }

  fetchHolidays() {
    fetch(`https://date.nager.at/api/v3/PublicHolidays/${new Date().getFullYear()}/${this.countryCode}`)
    .then(r => r.json())
    .then(data => {
        let holiday = [];
        for(let i = 0; i < data.length; i++){
            if (new Date(data[i].date) >= new Date()){
                holiday.push(data[i]);
            }
        }
        this.holidays = holiday;
    })
    .catch(err => {
        this.holidays = [];
    })
  }

  handleCountryChange(event) {
    this.countryCode = event.target.value;
    this.fetchHolidays();
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchHolidays();
  }

  render() {
    console.log(this.holidays);
    if (this.holidays.length <= 0){
        return html`
        <div>
          <h3>Public Holidays</h3>
          <label for="country-select">Select a country:</label>
          <select id="country-select" @change="${this.handleCountryChange}">
            ${countries.map(country => html`
              <option value="${country.code}" ?selected="${country.code === this.countryCode}">${country.name}</option>
            `)}
          </select>
          <ul>
            <li>Not support for this country</li>
          </ul>
        </div>
      `;
    }
    return html`
    <div>
      <h3>Public Holidays</h3>
      <label for="country-select">Select a country:</label>
      <select id="country-select" @change="${this.handleCountryChange}">
        ${countries.map(country => html`
          <option value="${country.code}" ?selected="${country.code === this.countryCode}">${country.name}</option>
        `)}
      </select>
      <ul>
        ${this.holidays.map(holiday => html`
          <li>${holiday.date}: ${holiday.name}</li>
        `)}
      </ul>
    </div>
  `;

  }
}

customElements.define('public-holidays-widget', PublicHolidaysWidget);
