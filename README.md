# Schema Form

A small React library for building dynamic forms.

## Key points

- Build on top of [react-hook-form](https://react-hook-form.com/)
- Headless design to integrate with any UI library and framework
- Low learning curve, easy to get started
- Extensible and customizable

## Installation

```bash
npm install @basestacks/schema-form
```

## Usage

Example with a simple login form:

```tsx
import { SchemaForm, FieldSchemas } from '@basestacks/schema-form';

interface FormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

const fields: FieldSchemas<FormValues> = {
  username: {
    type: 'text',
    label: 'Username',
    placeholder: 'Enter your username',
    required: true,
    minLength: 6,
    maxLength: 32,
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
      message: 'Username can only contain letters, numbers and underscores'
    }
  },
  password: {
    type: 'text',
    label: 'Password',
    placeholder: '••••••••',
    required: true,
    minLength: 6
    renderContext: {
      secureTextEntry: true
    }
  },
  rememberMe: {
    type: 'checkbox',
    label: 'Remember me'
  }
};

export function LoginForm() {
  const handleSubmit = (data) => {
    console.log('Form data:', data);
  };

  return (
    <SchemaForm 
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
}
```

## License

MIT
