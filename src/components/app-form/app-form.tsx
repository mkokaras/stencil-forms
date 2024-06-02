import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'app-form',
  styleUrl: 'app-form.css',
  shadow: true,
})
export class AppForm {
  render() {
    return (
      <Host>
        <h2>Enter your details:</h2>
        <form>
          <app-input label="Username *" name="username" required type="text"></app-input>
          <app-input label="Password *" name="password" required type="password"></app-input>
          <app-input label="Email" name="email" type="email"></app-input>
          <app-button text="Submit" type="submit"></app-button>
        </form>
      </Host>
    );
  }
}
