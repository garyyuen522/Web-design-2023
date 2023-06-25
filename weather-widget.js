import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { WEATHER_URL } from '../config.js';

class Weather extends LitElement{
  static properties = {
    latitude: {type: Number},
    longitude: {type: Number},
    _data: {state: true}
  }

  static styles = css`
    .weather{
      background-color: #6ad2d4ad;
      width: 300px;
      border-radius: 15px;
      position: relative;
      top: -40px;
      left: 30px;
      text-align: left;
    }

    form{
      padding: 10px 5px 1px 20px;
    }

    h3 {
      margin: 0;
    }
    `;

  constructor(){
    super();
    this.latitude = null;
    this.longitude = null;
    this._data = null;
  }
    
  connectedCallback(){
    super.connectedCallback();
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this._fetchWeather();
      })
    }
  }

  _fetchWeather(){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.latitude}&longitude=${this.longitude}&current_weather=true`;
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
      this._data = data.current_weather;
      })
  }

  render(){
    if (this._data){
      const imageUrl = ["http://www.bom.gov.au/images/symbols/large/sunny.png", 
        "http://www.bom.gov.au/images/symbols/large/storm.png", 
        "http://www.bom.gov.au/images/symbols/large/clear.png",
        "http://www.bom.gov.au/images/symbols/large/cloudy.png",
        "http://www.bom.gov.au/images/symbols/large/showers.png",
        "http://www.bom.gov.au/images/symbols/large/partly-cloudy.png",
        "http://www.bom.gov.au/images/symbols/large/rain.png"]; //array for different image to load on refresh
      return html`
        <div class="weather">
          <form>
            <img src="${imageUrl[Math.floor(Math.random() * imageUrl.length)]}" width="60" height="60"/>
            <h3>Temperature: ${this._data.temperature} \u00B0C</h3>
            <p>Wind Speed: ${this._data.windspeed} mph</p>
            <p>Wind Direction: ${this._data.winddirection}\u00B0</p>
            <p>Time: ${this._data.time}</p>
          </form>
        </div>
      `;
    }
  }
}

customElements.define('weather-f', Weather);