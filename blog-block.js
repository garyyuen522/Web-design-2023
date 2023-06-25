/**
 * A Blog widget that displays blog posts pulled from 
 * an API
 * 
 * <blog-block></blog-block>
 */

import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { BASE_URL } from '../config.js';
import { getUser } from '../auth.js';

class BlockBlock extends LitElement {
  static properties = {
    _posts: { state: true },
    title: { type: String },
    content: { type: String },
    errorMessage: { type: String },
    switch: {type: Boolean},
    user: {state: true}
  }

  static styles = css`
  :host {
    margin: 1em;
  }

  .blog-header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }

  .blogpost {
    text-align: left;
    background-color: #6ad2d4a5;
    box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    padding-left: 15px;
    padding-right: 20px;
    width: 95%;
    word-break: break-all;
  }
  .blogpost h2, form h2 {
    text-transform: capitalize;
    text-decoration: underline;
  }
  form {
    margin-top: 2em;
    text-align: left;
  }
  .inTitle {
    width: 50%;
  }

  .inContent {
    width: 70%;
    height: 200%;
  }

  .buttons {
    background-color: none;
    list-style: none;
    display: grid;
    grid-template-columns: 100px 100px;
    gap: 10px;
    padding: 0;
    width: 200px;
    margin: auto;
  }

  .buttons button, .create-post {
    background-color: #6ad3d4;
    font-weight: bold;
    width: 100px;
    height: 50px;
    border-style: solid;
    border-color: #6ac1d4;
    border-radius: 15px;
  }

  .buttons button:hover, .create-post:hover {
    background-color: white;
  }

  p {
    text-align: left;
  }

  #
  `;

  constructor() {
    super();

    this.title = '';
    this.content = '';
    this.errorMessage = '';

    const url = `${BASE_URL}blog`;
    this.user = getUser();
    
    if(!this.user || this.user.error){
      this.fetchPosts();
      this.switch = false;
    }else{
      this.fetchUserPost();
      this.switch = true;
    }
  }

  // A simple formatter that just splits text into paragraphs and 
  // wraps each in a <p> tag
  // a fancier version could use markdown and a third party markdown
  // formatting library
  static formatBody(text) {
    if(text){
      const paragraphs = text.split('\r\n');
      return paragraphs.map(paragraph => html`<p>${paragraph}</p>`);
    }
  }

  fetchPosts(){
    const url = `${BASE_URL}blog`;
    let posts = 
    fetch(url+'?count=5')
    .then(response => response.json())
    .then(posts => {
        this._posts = posts.posts; 
    });
  }

  fetchUserPost() {
    const url = `${BASE_URL}blog`;
    fetch(url+'?count=200')
    .then(response => response.json())
    .then(posts => {
      let count = 0;
      let post = [];
      for (let i = 0; i < posts.posts.length; i++){
        if (count < 5 && posts.posts[i].creator == this.user.username){
          post.push(posts.posts[i]);
          count++;
        }
      }
      this._posts = post; 
    });
  }

  submitForm(event) {
    event.preventDefault();
    const url = `${BASE_URL}blog`;
    const user = getUser();
    const token = getUser().token;
    if (!user) {
      this.errorMessage = 'You must be logged in to create a post.';
      return;
    }

    fetch(url, {
      method: 'post',
      body: JSON.stringify({ title: this.title, content: this.content}),
      headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${token}`}
    })
      .then(response => {
        if (response.ok) {
          this.title = '';
          this.content = '';
          this.errorMessage = '';
          this.dispatchEvent(new CustomEvent('post-created'));
          location.reload();
        } else {
          this.errorMessage = 'There was an error creating the post. Please try again later.';
        }
      })
      .catch(() => {
        this.errorMessage = 'There was an error creating the post. Please try again later.';
      });
  }

  updateTitle(event) {
    this.title = event.target.value;
  }

  updateContent(event) {
    this.content = event.target.value;
  }

  mainPage(){
    if (this.switch === true){
      this.fetchPosts();
      this.switch = !this.switch;
    }
  }

  personPage(){
    if (!this.switch){
      this.fetchUserPost();
      this.switch = !this.switch;
    }
  }

  
  render() {
    if (!this._posts)
      return html`Loading...`;
    
    else if (this.user && this.switch){
      return html`
      <div class="blog-header">
        <h1>Personal Page</h1>
        <ul class="buttons">
          <li><button class="main-page" @click="${this.mainPage}">Main Page</button></li>
          <li><button class="ppage" @click="${this.personPage}">Personal Page</button></li>
        </ul>
      </div>
      ${this._posts.map(post => html`<div class="blogpost">
        <h2>${post.title}</h2>
        <h3>By ${post.name}</h3>
        ${BlockBlock.formatBody(post.content)}
      </div>`)}
      <form @submit=${this.submitForm}>
        <h2>Create a New Blog Post</h2>
        ${this.errorMessage && html`<p style="color: red">${this.errorMessage}</p>`}
        <label for="title">Title:</label>
        <input class="inTitle" type="text" name="title" .value=${this.title} @input=${this.updateTitle} required>
        <br><br>
        <label for="content">Content:</label><br>
        <textarea class="inContent" name="content" .value=${this.content} @input=${this.updateContent} required></textarea>
        <br><br>
        <input class="create-post" type="submit" value="Create Post">
      </form>
      `;
    }

    else if(this.user) {
      return html`
      <div class="blog-header">
        <h1>Main Page</h1>
        <ul class="buttons">
            <li><button class="main-page" @click="${this.mainPage}">Main Page</button></li>
            <li><button class="ppage" @click="${this.personPage}">Personal Page</button></li>
        </ul>
      </div>
      ${this._posts.map(post => html`<div class="blogpost">
        <h2>${post.title}</h2>
        <h3>By ${post.name}</h3>
        ${BlockBlock.formatBody(post.content)}
      </div>`)}
      `;
    }

    return html`
      <div class="blog-header">
        <h1>Main Page</h1>
      </div>
      ${this._posts.map(post => html`<div class="blogpost">
        <h2>${post.title}</h2>
        <h3>By ${post.name}</h3>
        ${BlockBlock.formatBody(post.content)}
      </div>`)}
      `;
    
  }
}

customElements.define('blog-block', BlockBlock);


