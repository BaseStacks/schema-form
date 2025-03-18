# React JSON Form

A small React library for building dynamic forms using JSON schemas.

## Key points

- Build on top of [react-hook-form](https://react-hook-form.com/) and its ecosystem
- Low learning curve, easy to get started
- Headless design to integrate with any UI library and framework
- Extensible and customizable

## UI Templates and demos
- Shadcn/ui

## Installation

```bash
npm install @workbench-js/json-form
# or
yarn add @workbench-js/json-form
# or
bun add @workbench-js/json-form
```

## Usage

Example with a simple login form:

```tsx
import { JsonForm } from '@workbench-js/json-form';

// Define your form schema with detailed configuration
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
    <JsonForm 
    fields={fields}
    onSubmit={handleSubmit}
    />
  );
}
```

### Custom components

```tsx
import { JsonFormProvider } from '@workbench-js/json-form';

const jsonFormConfig = {
  components: {
    form: ({children, handleSubmit}) => (
    <form obSubmit={handleSubmit}>
      <div>{props.children}</div>
      <button type="submit">Submit</button>
    </form>
    ),
    fields: {
      text: ({input}) => <input type="text" {...input} />,
      password: ({input}) => <input type="password" {...input} />,
      checkbox: ({input}) => <input type="checkbox" {...input} />,
    },
  }
};

function App() {
  return (
    <JsonFormProvider jsonFormConfig={jsonFormConfig}>
    <MyForm />
    </JsonFormProvider>
  );
}
```

## License

MIT
