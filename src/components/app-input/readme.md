# app-input



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                    | Type                                                                               | Default     |
| ------------- | ------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------- | ----------- |
| `error`       | --            | Error messages matching the validity state     | `{ pattern?: string; required?: string; minLength?: string; maxLength?: string; }` | `undefined` |
| `label`       | `label`       | The label of the input                         | `string`                                                                           | `''`        |
| `name`        | `name`        | The name of the input                          | `string`                                                                           | `undefined` |
| `placeholder` | `placeholder` | The placeholder of the input                   | `string`                                                                           | `''`        |
| `showLabel`   | `show-label`  | Show label                                     | `boolean`                                                                          | `true`      |
| `validators`  | --            | Validators for the element, validated by order | `Partial<Record<ValidationType, string \| number \| boolean \| RegExp>>[]`         | `undefined` |
| `value`       | `value`       | The initial value of the input                 | `string`                                                                           | `''`        |


## Events

| Event         | Description      | Type                  |
| ------------- | ---------------- | --------------------- |
| `valueChange` | The emited value | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
