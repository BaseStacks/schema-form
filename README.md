# Schema Form

A small React library for building dynamic forms using JSON schemas.

## Key points

- Build on top of [react-hook-form](https://react-hook-form.com/)
- Headless design to integrate with any UI library and framework
- Low learning curve, easy to get started
- Extensible and customizable

## UI Templates and demos
- Shadcn/ui

## Installation

```bash
npm install schema-form
# or
yarn add schema-form
# or
bun add schema-form
```

## Usage

Example with a simple login form:

```tsx
import { SchemaForm } from 'schema-form';

const fields = {
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
    type: 'password',
    label: 'Password',
    placeholder: '••••••••',
    required: true,
    minLength: 6
  },
  rememberMe: {
    type: 'checkbox',
    label: 'Remember me'
  }
};

function LoginForm() {
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
