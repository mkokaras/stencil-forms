import { AttachInternals, Component, Host, Prop, forceUpdate, h } from '@stencil/core';
@Component({
  tag: 'app-input',
  styleUrl: 'app-input.css',
  shadow: true,
  formAssociated: true,
})
export class AppInput {
  private el: HTMLInputElement;

  @AttachInternals() internals: ElementInternals;

  /**
   * This is needed for form associated components. The name of the input will be the name in the form object.
   */
  @Prop({ reflect: true }) name: string;
  /**
   * The initial value of the input
   */
  @Prop() initialValue: string = '';
  /**
   * The label of the input
   */
  @Prop() label: string = '';
  /**
   * Required validator
   */
  @Prop() required: boolean = false;
  /**
   * The error message
   */
  @Prop() errorMessage: string = '';

  /**
   * Type of input e.g. text,email,password etc
   */
  @Prop() type: string = 'text';

  componentWillLoad() {
    /**
     * Sets form value to initial value. Needs to happen in order to associate the value with the internals.
     */
    this.internals.setFormValue(this.initialValue);
  }

  /**
   * We do this in componentDidLoad() because we need the input element to be rendered first
   */
  componentDidLoad() {
    /**
     * We can programmatically check if an input is valid or not
     * This goes beyond "old" form validation HTML because we can pass down complex validators
     * E.g. if we had a pattern validation for an type="number" we can test against the validator and see if input is valid
     *
     */
    const valueMissing = this.required && !this.initialValue;

    /**
     * Sets validity of the input and error
     * Error does not appear when input is valid
     * */
    this.internals.setValidity({ ...this.getNativeValidity(), valueMissing }, this.errorMessage);

    forceUpdate(this);
  }

  render() {
    return (
      <Host>
        <label htmlFor={this.name}>{this.label}</label>
        <div class="container">
          <input
            ref={el => (this.el = el)}
            type={this.type}
            value={this.initialValue}
            name={this.name}
            id={this.name}
            onInput={() => {
              /**
               * You need to set the value to sync with the element internals
               */

              this.internals.setFormValue(this.el.value);

              const valueMissing = this.required && !this.el.value;

              this.internals.setValidity({ ...this.getNativeValidity(), valueMissing }, this.errorMessage);

              /**
               * You need this here because a re-render is not triggered each type we type something
               */

              forceUpdate(this);
            }}
          />
          {this.internals.validationMessage && <span class="error">{this.internals.validationMessage}</span>}
        </div>
      </Host>
    );
  }

  /**
   *
   * Form-assosciated elements are NOT related to the <input> element (it can be anything even a div)
   * So e.g. if you have type=email on an input, the attach internals does not know if its valid or not
   * So we need to get the native validity and combine it with our custom validity
   *
   */
  private getNativeValidity() {
    const validityState = {};

    for (const key in this.el.validity) {
      validityState[key] = this.el.validity[key];
    }

    return validityState;
  }
}
