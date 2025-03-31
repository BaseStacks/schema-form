# Schema Form

[![npm version](https://img.shields.io/npm/v/@basestacks/schema-form.svg)](https://www.npmjs.com/package/@basestacks/schema-form)
[![Coverage Status](https://img.shields.io/codecov/c/github/basestacks/schema-form)](https://codecov.io/gh/basestacks/schema-form)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=BaseStacks_schema-form&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=BaseStacks_schema-form)
[![License](https://img.shields.io/npm/l/@basestacks/schema-form)](https://github.com/basestacks/schema-form/blob/main/LICENSE)

A React library built on top of [**react-hook-form**](https://github.com/react-hook-form/react-hook-form) that turns schema definitions into dynamic forms, reducing boilerplate and simplifying validation while maintaining full customizability.

> **⚠️ CAUTION: This project is under active development. The API may change without notice.**

## Introduction

While **React Hook Form** provides an excellent foundation for handling forms in React applications with uncontrolled components and high performance, it comes with certain limitations:
- Requires repetitive code for defining fields and validation rules
- Complex forms with nested structures become verbose and harder to maintain
- Form structure is tightly coupled with UI components
- No standardized way to define form schemas separate from UI

**Schema Form** addresses these limitations by:

1. **Separating Concerns** - Define your form structure and validation rules in one place as a schema, keeping them separate from UI components
2. **Reducing Boilerplate** - Convert concise schema definitions into fully functional forms without repetitive code
3. **Enhancing Type Safety** - Leverage TypeScript to ensure your form data structure matches your schema definition
4. **Maintaining Flexibility** - Access all the power of React Hook Form while adding schema-driven development
5. **Simplifying Complex Forms** - Handle nested objects, arrays, and conditional fields with structured schemas rather than imperative code

**Schema Form** doesn't replace React Hook Form - it enhances it with a declarative, schema-driven approach while preserving all its performance benefits.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Defining Form Schema](#defining-form-schema)
  - [Customization UI](#customization-ui)
  - [Using the Form](#using-the-form)
- [API Reference](https://github.com/basestacks/schema-form/tree/master/docs)
- [Contributing](#contributing)

## Installation

```bash
npm install @basestacks/schema-form
```

## Usage

### Defining Form Schema

```tsx
import { SchemaForm, FormSchema } from "@basestacks/schema-form";

interface FormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

const fields: FormSchema<FormValues> = {
  username: {
    type: "text",
    title: "Username",
    placeholder: "Enter your username",
    required: true,
    minLength: 6,
    maxLength: 32,
    pattern: {
      value: /^\w+$/,
      message: "Username can only contain letters, numbers and underscores",
    },
  },
  password: {
    type: "text",
    title: "Password",
    placeholder: "••••••••",
    required: true,
    minLength: 6,
    renderContext: {
      secureTextEntry: true,
    },
  },
  rememberMe: {
    type: "checkbox",
    title: "Remember me",
  },
};

export function LoginForm() {
  const handleSubmit = (data: FormValues) => {
    console.log("Form data:", data);
  };

  return (
    <SchemaForm
      fields={fields}
      onSubmit={handleSubmit}
      {/** Additional props for react-hook-form */}
      shouldUseNativeValidation={true}
    />
  );
}
```

That's it! The form will render with proper validation. For UI components, see the detailed section below.

### Customization UI

Create custom field components and a form layout to override the default UI:

```tsx
import * as React from "react";
import {
  useField,
  SchemaFormProvider,
  SchemaFormRenderProps,
} from "@basestacks/schema-form";

export interface RenderContext {
  readonly secureTextEntry?: boolean;
  readonly submitLabel?: string;
}

export function FormProvider({ children }: React.PropsWithChildren) {
  return (
    <SchemaFormProvider
      components={{
        Form: FormLayout,
        fields: {
          text: TextField,
          checkbox: CheckboxField
        },
      }}
    >
      {children}
    </SchemaFormProvider>
  );
}

function FormLayout({
  form,
  onSubmit,
  children,
  renderContext,
}: SchemaFormRenderProps<RenderContext>) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {children}
      <button type="submit">{renderContext?.submitLabel ?? "Submit"}</button>
    </form>
  );
}

function TextField() {
  const { field, name, placeholder, title, renderContext } = useField();
  return (
    <div className="field">
      <label htmlFor={name}>{title}</label>
      <input
        type={renderContext.secureTextEntry ? "password" : "text"}
        placeholder={placeholder}
        {...field}
      />
    </div>
  );
}

function CheckboxField() {
  const { field, name, title } = useField();
  return (
    <div className="field">
      <div>
        <input type="checkbox" {...field} />{" "}
        <label htmlFor={name}>{title}</label>
      </div>
    </div>
  );

```

### Using the Form

Wrap your form with the `FormProvider` to apply custom UI components and context data:

```tsx
<FormProvider>
    <LoginForm />
</FormProvider>
```

Check out the [example](https://codesandbox.io/p/sandbox/55msn7) for a complete implementation.

## API Reference

## Contributing

We welcome contributions to make `@basestacks/schema-form` even better! Whether you're fixing bugs, improving documentation, or adding new features, your help is appreciated.

### Development Requirements

- Node.js 20
- pnpm v9

For detailed contribution guidelines, please read our [CONTRIBUTING.md](./CONTRIBUTING.md) document.
