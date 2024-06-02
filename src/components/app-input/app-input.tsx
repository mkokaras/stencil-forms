import { AttachInternals, Component, Host, Prop, h } from '@stencil/core';
@Component({
  tag: 'app-input',
  styleUrl: 'app-input.css',
  shadow: true,
  formAssociated: true,
})
export class AppInput {
  @AttachInternals() internals: ElementInternals;

  /**
   * This is needed for form associated components. The name of the input will be the name in the form object.
   */
  @Prop({ reflect: true }) name: string;
  /**
   * The initial value of the input
   */
  @Prop() value: string = '';
  /**
   * The label of the input
   */
  @Prop() label: string = '';
  /**
   * Required validator
   */
  @Prop() required: boolean = false;
  /**
   * Error messages matching the validity state
   */
  @Prop() errorMessage: string = '';

  /**
   * Type of input e.g. text,email,password etc
   */
  @Prop() type: string = 'text';

  componentWillLoad() {
    // Sets the value of the field NOT the form!
    this.internals.setFormValue(this.value);
  }

  componentDidLoad() {
    const valueMissing = !(this.required && this.value !== '');

    /**
     * We can programmatically check if an input is valid or not
     * This goes beyond "old" form validation HTML because we can pass down complex validators
     * E.g. if we had a pattern validation for an type="number" we can test against the validator and see if input is valid
     *
     */

    /**
     * Sets validity of the input and error
     * Error does not appear when input is valid
     * */
    this.internals.setValidity(
      {
        valueMissing,
      },
      this.errorMessage,
    );
  }

  render() {
    return (
      <Host>
        <label htmlFor={this.name}>{this.label}</label>
        <div class="container">
          <input type={this.type} value={this.value} name={this.name} id={this.name} />
          {this.internals.validationMessage && <span>{this.internals.validationMessage}</span>}
        </div>
      </Host>
    );
  }
}
