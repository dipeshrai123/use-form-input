# USE-FORM-INPUT

> Simple hook to provide form validation in react

### Features

- Small size and no dependencies
- Easy to use APIs
- Fully customizable form handling and validations

### Installation

Install:

```sh
npm i use-form-input
```

### Quickstart

#### 1. Basic form handling

Form handling can be done with `useFormInput`.

Example:

```jsx
// Basic form handling
import { useFormInput } from 'use-form-input';

export default function BasicFormHandling() {
  const [data, { onChange, onSubmit }] = useFormInput(
    {
      firstName: '',
      lastName: '',
    },
    (data) => {
      console.log('FINAL DATA', data);
    }
  );

  return (
    <>
      <form onSubmit={onSubmit} style={{ marginLeft: 10 }}>
        <input
          type="text"
          name="firstName"
          value={data.firstName}
          onChange={onChange}
        />
        <br />

        <input
          type="text"
          name="lastName"
          value={data.lastName}
          onChange={onChange}
        />
        <br />

        <input value="Submit" type="submit" />
      </form>
    </>
  );
}
```

Note: The form element must have `name` prop available to use `onChange`.

#### 2. Form Validation

Form validation can be done by passing third parameter ( function ) which should return an error object.
The function is called with the data.

Example:

```jsx
import { useFormInput } from 'use-form-input';

export default function FormValidation() {
  const [data, { onChange, onSubmit, errors, modified }] = useFormInput(
    {
      firstName: '',
      lastName: '',
    },
    (data) => {
      console.log('FINAL DATA', data);
    },
    (data) => {
      const errors = {};

      if (data.firstName.length === 0) {
        errors.firstName = 'Empty first name';
      }

      if (data.lastName.length === 0) {
        errors.lastName = 'Empty last name';
      }

      return errors;
    }
  );

  return (
    <>
      <form onSubmit={onSubmit} style={{ marginLeft: 10 }}>
        <input
          type="text"
          name="firstName"
          value={data.firstName}
          onChange={onChange}
        />
        {modified.firstName && errors.firstName && (
          <span style={{ color: 'red' }}>{errors.firstName}</span>
        )}
        <br />

        <input
          type="text"
          name="lastName"
          value={data.lastName}
          onChange={onChange}
        />
        {modified.lastName && errors.lastName && (
          <span style={{ color: 'red' }}>{errors.lastName}</span>
        )}
        <br />

        <input value="Submit" type="submit" />
      </form>
    </>
  );
}
```

Note: `modified` object is used so that, the error is not shown by default. The form should either be submitted or certain fields must change before it should show error. `modified` object has the property same as fields passed to `useFormInput` hook.

#### 3. Manual Validation

Form can be manually validated by using `validator`, `setErrors` and `isValid` methods.

Example:

```jsx
import { useFormInput } from 'use-form-input';

export default function ManualValidation() {
  const [data, { onChange, errors, setErrors, isValid, validator }] =
    useFormInput({
      firstName: '',
      lastName: '',
    });

  const onSubmit = (e) => {
    e.preventDefault();

    const catchedErrors = {};
    const validate = validator(catchedErrors);

    validate('firstName', {
      condition: data.firstName.length === 0,
      message: 'Empty first name',
    });

    validate('lastName', {
      condition: data.lastName.length === 0,
      message: 'Emptry last name',
    });

    setErrors(catchedErrors);

    if (!isValid(catchedErrors)) {
      return;
    }

    console.log('FINAL DATA', data);
  };

  return (
    <>
      <form onSubmit={onSubmit} style={{ marginLeft: 10 }}>
        <input
          type="text"
          name="firstName"
          value={data.firstName}
          onChange={onChange}
        />
        {errors.firstName && (
          <span style={{ color: 'red' }}>{errors.firstName}</span>
        )}
        <br />

        <input
          type="text"
          name="lastName"
          value={data.lastName}
          onChange={onChange}
        />
        {errors.lastName && (
          <span style={{ color: 'red' }}>{errors.lastName}</span>
        )}
        <br />

        <input value="Submit" type="submit" />
      </form>
    </>
  );
}
```

#### 4. Manually Setting Values

We need a method to manually set the values of certain fields. We can do it by using `setValue` method.

Example:

```jsx
const [data, { setValue }] = useFormInput({ firstName: '' });

...

<input
  type="text"
  name="firstName"
  value={data.firstName}
  onChange={e => setValue('firstName', e.target.value)}
/>
```

`setValue` accepts two parameters:

1. Field Name
2. Value

#### 5. Modifiying previous values

We can modify the previous values using `setValue` method. For example, we can use it in checkbox.

Example:

```jsx
const [data, { setValue }] = useFormInput({ married: false });

...

<input
  type="text"
  name="married"
  checked={data.married}
  onChange={e => setValue('married', (previousValue) => !previousValue)}
/>
```

It works like a `setState` function, getting previous value and returning modified one.

#### 6. Clearing form

We can clear the from by using `clear` method which sets all the modified fields to its initial one.

Example:

```jsx
const [data, { clear }] = useFormInput({ firstName: '', lastName: '' });

...

<button onClick={() => clear()}>Clear</button>
```

## License

MIT
