# Schema Form

A small React library for building dynamic forms.

## Features

- Simplifies form creation with [react-hook-form](https://react-hook-form.com/)
- Reduces boilerplate code for validation.
- Easy integration with existing React projects.
- Extensible and customizable.

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
    minLength: 6,
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

## Customization UI

```tsx
import { PropsWithChildren } from 'react';
import { WithRegisterProps, SchemaFormProvider, SchemaFormRenderProps, withRegister } from '@basestacks/schema-form';
import React from 'react';

interface RenderContext {
  readonly secureTextEntry?: boolean;
}

function FormProvider({ children }: PropsWithChildren) {
    return (
        <SchemaFormProvider
            components={{
                Form: FormLayout,
                fields: {
                    text: withRegister(TextField),
                    checkbox: withRegister(CheckboxField),
                },
            }}
        >
            {children}
        </SchemaFormProvider>
    );
};

function FormLayout({ form, onSubmit, children }: SchemaFormRenderProps<RenderContext>) {
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            {children}
            <input type="submit">Submit</input>
        </form>
    );
};

function TextField({ name, label, register, renderContext }: WithRegisterProps<RenderContext>) {
    return (
      <div className="field">
        <label htmlFor={name}>{label}</label>
        <input
          type={renderContext.secureTextEntry ? 'password' : 'text'}
          {...register}
        />
      </div>
    );
};

function CheckboxField({ label, register }: WithRegisterProps<RenderContext>) {
    return (
      <div className="field">
        <input type="checkbox" {...register} /> <label htmlFor={name}>{label}</label>
      </div>
    );
};
```

Check out the [example](https://codesandbox.io/p/sandbox/55msn7) for a complete implementation.

## License

MIT
