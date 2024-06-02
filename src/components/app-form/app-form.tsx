import { Component, Host, forceUpdate, h } from '@stencil/core';

@Component({
  tag: 'app-form',
  styleUrl: 'app-form.css',
  shadow: true,
})
export class AppForm {
  private el: HTMLFormElement;
  render() {
    return (
      <Host>
        <h2>Enter your details:</h2>
        <form
          ref={el => (this.el = el)}
          onSubmit={e => {
            e.preventDefault();

            console.log('**** Form Submitted ****');

            /**
             * We get:
             * {
             *  username: 'username',
             *  password: 'password',
             *  email: 'email'
             * }
             */
            console.log(this.getFormObject(this.el));
          }}
          onInput={() => {
            /**
             * Requires a re-render to re-evaluate 'disabled={!this.el?.checkValidity()}'
             */
            forceUpdate(this);
          }}
        >
          <app-input label="Username *" name="username" required type="text" errorMessage="Username is required"></app-input>
          <app-input label="Password *" name="password" required type="password" errorMessage="Password is required"></app-input>
          <app-input label="Email" name="email" type="email" required errorMessage="Invalid email"></app-input>
          <app-button text="Submit" type="submit" disabled={!this.el?.checkValidity()}></app-button>
        </form>
      </Host>
    );
  }

  /**
   *
   * Utilizes FormData to get the form in an object
   *
   */
  private getFormObject(form: HTMLFormElement): { [key: string]: string } {
    const formData = new FormData(form);

    const formObj = {};

    for (const entry of formData) {
      formObj[entry[0]] = entry[1];
    }

    return formObj;
  }
}
