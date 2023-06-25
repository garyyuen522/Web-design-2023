import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { getUser, storeUser, deleteUser} from '../auth.js';
import { BASE_URL } from '../config.js';

class LoginWidget extends LitElement {
  static properties = {
    loginUrl: { type: String },
    user: {type: String, state: true }
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
      top: 20px;
    }

    button, .login {
      background-color: #6ad3d4;
      font-weight: bold;
      width: 100px;
      height: 50px;
      border-style: solid;
      border-color: #6ac1d4;
      border-radius: 15px;
    }

    button:hover, .login:hover {
      background-color: white;
    }`;

  constructor() {
    super();
    this.loginUrl = `${BASE_URL}users/login`;
    this.user = getUser();
  }

  submitForm(event) { 
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    fetch(this.loginUrl, {
        method: 'post',
        body: JSON.stringify({username, password}),
        headers: {'Content-Type': 'application/json'}
    }).then(result => result.json()).then(response => {
      if(response.error){
        console.log("1", response.error);
      }else{
        this.user = response;
        storeUser(response);
        console.log(response);
        location.reload();
      }

    })
  }

  logout() {
    deleteUser();
    this.user = null;
    location.reload();
  }

  render() {
    if (this.user) {
        return html`<p>Logged in as ${this.user.name}</p><button @click=${this.logout}>Logout</button>`
    } 
    return html`
      <form @submit=${this.submitForm}>
          Username: <input name="username"><br>
          Password: <input type="password" name="password"><br>
          <input class="login" type='submit' value='Login'>
      </form>`;
    
  }
}

customElements.define('login-widget',  LoginWidget);