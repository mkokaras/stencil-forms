# Form Associated Components

## Introduction

Form associated components in not a Stencil thing its native Javascript, Stencil just utilises this API to bring form associated components.

A few useful resources regarding how those work, together with its available API can be found at:

- Stencil Docs: [https://stenciljs.com/docs/form-associated](https://stenciljs.com/docs/form-associated)
- MDN Docs: [https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals)
- [Web.dev](http://Web.dev) docs: [https://web.dev/articles/more-capable-form-controls](https://web.dev/articles/more-capable-form-controls)

The thought process behind those, is that you are limited by the input element and what it can offer, when building forms. E.g. if you wanted to create a custom element, like e.g. a custom toggle on/off (slider), you need to somehow relate it to an input. Now with the available API provided, this is solved and you can “connect” this with the form element.

## How to use in Stencil

You can see the code for an working example, but in here I will provide the core things that I usually ended up to use & the common gotchas. This is a brief explanation of the code.

### In the input

The usual setup for a form associated component is :

1. You need to specify it as form associated using `formAssociated:true`
2. You need to provide a name prop with reflect:true so Stencil knows the name of it inside the form (like the name of the input on a classic form)
3. Add `@AttachInternals() internals: ElementInternals` to have access to the API, so you can set value, set validity, get validity etc (see [Docs](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals))

```tsx
@Component({
  tag: 'app-input',
  styleUrl: 'app-input.css',
  shadow: true,
  formAssociated: true,
})
export class AppInput {
  @AttachInternals() internals: ElementInternals;

  @Prop({ reflect: true }) name: string;
}
```

With this flag, the component is “connected” with the nearest `<form>` parent.

**Common Usage**

The below implementation, is to demonstrate the common Element Internals functionality. For more details & a working example, see `app-input.tsx`

Consider this dummy form associated input. The key details of this are:

1. The setup to a formAssociated component.
2. We use `this.internals.setFormValue(this.initialValue)` to setup the initial value and also `onInput`. Form-associated components have nothing to do with the `<input>` so if we set `<input value={this.initialValue}>` will have NO impact in the form. Each time we want to set a new value, we must use `setFormValue()`
3. We use `this.internals.setValidity({ valueMissing }, this.errorMessage)` to set up an form control as valid or not. The keys that it can take are the same as [Validity State](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState). This means, that we are in control of how what is valid or not. E.g. `<input type=number>` cannot take patterns as validations. We can set up a custom regex, validate it, and provide `patternMismatch:true | false` on the `setValidity()`
4. We use `this.internals.validationMessage` which returns empty if the input is valid or the error message (which was provided in our case in `setValidity()`). Note, in the actual code you will see I use `forceUpdate(this)` to trigger a re-render. This is important because Stencil **cannot** know if the validity changed so if you do not do that, then the view will not be updated.

```tsx
@Component({
  tag: 'app-input',
  styleUrl: 'app-input.css',
  shadow: true,
  formAssociated: true,
})
export class AppInput {
  private el: HTMLInputElement;

  @AttachInternals() internals: ElementInternals;

  @Prop({ reflect: true }) name: string;
  @Prop() initialValue: string = '';
  @Prop() required: boolean = false;
  @Prop() errorMessage: string = '';

  componentWillLoad() {
		 this.internals.setFormValue(this.initialValue);

		 const valueMissing = this.required && !this.initialValue;

     this.internals.setValidity({ valueMissing }, this.errorMessage);
  }

  render() {
    return (
      <Host>
        <label htmlFor={this.name}>Label</label>
          <input
            ref={el => (this.el = el)}
            type={this.type}
            value={this.initialValue}
            name={this.name}
            id={this.name}
            onInput={(e) => {
	             this.internals.setFormValue(e.value);

		           const valueMissing = this.required && !this.el.value;

			         this.internals.setValidity({ valueMissing }, this.errorMessage);

			         forceUpdate(thi
            }
          />
          {this.internals.validationMessage && <span class="error">{this.internals.validationMessage}</span>}
      </Host>
    );
  }
}

```

### In the form

A form does not have to do a lot to handle a form associated component. A form does **NOT** have access to the ElementInternals (I mean directly).

When submitting you just need to get your data results and convert it (see `getFormObject()` method in `app-form.tsx`)

Also, you can use the classic [HTMLFormElement API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement) to do stuff like getting the validity of the whole form, which might be useful as we see in the below snippet.

**Common Usage**

- `onSubmit()` we have access to the form element (or we can use `ref` property to get it). As a result, we get the form object where key is the name (prop name we pass in the input), and value is the form value (the value we set for each element using `setFormValue()`).
- We use `this.getFormEl().checkValidity()` to get the validity of the whole form in order to enable/disable the submit button.
- `onInput()` we have to force a re-render in order to re-evaluate the validity so the view is updated with the appropriate state of the button (valid or not).

```tsx
import { Component, Host, forceUpdate, h } from '@stencil/core';

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
        <form
          onSubmit={e => {
            e.preventDefault();

            console.log(this.getFormObject(e.target));
          }}
          onInput={() => {
            forceUpdate(this);
          }}
        >
          <app-input label="Username *" name="username" required type="text" errorMessage="Username is required"></app-input>
          <app-input label="Password *" name="password" required type="password" errorMessage="Password is required"></app-input>
          <app-input label="Email" name="email" type="email" required errorMessage="Invalid email"></app-input>
          <app-button text="Submit" type="submit" disabled={!this.getFormEl().checkValidity()}></app-button>
        </form>
      </Host>
    );
  }
}
```
