import { Component, Prop, h, AttachInternals } from '@stencil/core';

@Component({
  tag: 'app-button',
  styleUrl: 'app-button.css',
  shadow: true,
  formAssociated: true,
})
export class AppButton {
  /**
   * Needed in case the button is a type=submit button, in order to submit the form
   */
  @AttachInternals() internals: ElementInternals;
  /**
   * The type of the button
   */
  @Prop() type: string = 'button';
  /**
   * The text of the button
   */
  @Prop() text: string = '';
  /**
   * Button is disabled
   */
  @Prop() disabled = false;

  render() {
    return (
      <button
        class="btn"
        onClick={() => {
          this.type === 'submit' && this.internals.form?.requestSubmit();
        }}
        type={this.type}
        disabled={this.disabled}
      >
        {this.text}
      </button>
    );
  }
}
