# USE-FORM-INPUT

> Simple hook to provide form validation in react

### Features

- Small size and no dependencies
- Fully customizable form handling and validations
- Easy to use

### Install

Install with npm:

```sh
npm i use-form-input
```

### Quickstart

```jsx
import { useFormInput } from 'use-form-input';

export default function App() {
  const [data, { onChange, validator, isValid, errors, setErrors }] =
    useFormInput({
      name: 'John Doe',
    });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cachedErrors = {};
    const validate = validator(cachedErrors);

    const { name } = data;

    validate('name', {
      condition: name.length === 0,
      message: 'Empty name',
      onMatch: function (message) {
        if (message) {
          console.error(message);
        }
      },
    });

    setErrors(cachedErrors);

    if (!isValid(cachedErrors)) {
      return;
    }

    console.log('FINAL DATA', data);
  };

  return (
    <>
      <form onSubmit={onSubmit} style={{ marginLeft: 10 }}>
        <input
          type="text"
          placeholder="name"
          value={data.name}
          onChange={onChange('name')}
        />
        <p style={{ color: 'red' }}>
          {errors.name &&
            errors.name.messages.length > 0 &&
            errors.name.messages[0]}
        </p>
        <input value="Submit" type="submit" />
      </form>
    </>
  );
}
```

## License

MIT
