# Schema Form

[![npm version](https://img.shields.io/npm/v/@basestacks/schema-form.svg)](https://www.npmjs.com/package/@basestacks/schema-form)
[![Test](https://github.com/BaseStacks/schema-form/actions/workflows/test.yml/badge.svg)](https://github.com/BaseStacks/schema-form/actions/workflows/test.yml)
[![Coverage Status](https://img.shields.io/codecov/c/github/basestacks/schema-form)](https://codecov.io/gh/basestacks/schema-form)
[![License](https://img.shields.io/npm/l/@basestacks/schema-form)](https://github.com/basestacks/schema-form/blob/main/LICENSE)

A React library built on top of [**react-hook-form**](https://github.com/react-hook-form/react-hook-form) that turns schema definitions into dynamic forms, reducing boilerplate and simplifying validation while maintaining full customizability.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Defining Form Schema](#defining-form-schema)
  - [Customization UI](#customization-ui)
  - [Using the Form](#using-the-form)
- [API Reference](#api-reference)
  - [Core Components](#core-components)
    - [SchemaForm](#schemaform)
    - [SchemaFormProvider](#schemaformprovider)
    - [SchemaFormField](#schemaformfield)
  - [Higher-Order Components (HOCs)](#higher-order-components-hocs)
    - [withRegister](#withregister)
    - [withController](#withcontroller)
    - [withArray](#witharray)
    - [withObject](#withobject)
  - [Schema Types](#schema-types)
  - [Validation](#validation)
  - [RenderContext](#rendercontext)
  - [Hooks](#hooks)
- [Contributing](#contributing)

## Features

- **Schema-Driven Forms**: Define forms using TypeScript schemas with built-in type safety
- **Streamlined Validation**: Apply validation rules directly in your schema or use external validation libraries
- **Complex Data Support**: Handle nested objects and dynamic arrays with dedicated field components
- **Conditional Logic**: Show/hide fields based on form values with simple conditions
- **UI Flexibility**: Fully customize rendering with component overrides and context system
- **React Hook Form Integration**: Built on proven form handling with optimized re-renders

## Installation

```bash
npm install @basestacks/schema-form
```

## Usage

Get up and running with schema-form in minutes:

### Defining Form Schema

```tsx
import { SchemaForm, FieldSchemas } from "@basestacks/schema-form";

interface FormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

const fields: FieldSchemas<FormValues> = {
  username: {
    type: "text",
    title: "Username",
    placeholder: "Enter your username",
    required: true,
    minLength: 6,
    maxLength: 32,
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
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
import { PropsWithChildren } from "react";
import {
  WithRegisterProps,
  SchemaFormProvider,
  SchemaFormRenderProps,
  withRegister,
  WithArrayProps,
  withArray,
  WithObjectProps,
  withObject,
} from "@basestacks/schema-form";

export interface RenderContext {
  readonly secureTextEntry?: boolean;
  readonly submitLabel?: string;
}

export function FormProvider({ children }: PropsWithChildren) {
  return (
    <SchemaFormProvider
      components={{
        Form: FormLayout,
        fields: {
          array: withArray(ArrayField),
          object: withObject(ObjectField),
          text: withRegister(TextField),
          checkbox: withRegister(CheckboxField),
          select: withRegister(SelectField),
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

function TextField({
  name,
  placeholder,
  title,
  register,
  renderContext,
}: WithRegisterProps<RenderContext>) {
  return (
    <div className="field">
      <label htmlFor={name}>{title}</label>
      <input
        type={renderContext.secureTextEntry ? "password" : "text"}
        placeholder={placeholder}
        {...register}
      />
    </div>
  );
}

function CheckboxField({
  name,
  title,
  register,
}: WithRegisterProps<RenderContext>) {
  return (
    <div className="field">
      <div>
        <input type="checkbox" {...register} />{" "}
        <label htmlFor={name}>{title}</label>
      </div>
    </div>
  );
}

function SelectField({
  schema,
  register,
  name,
  title,
  placeholder,
}: WithRegisterProps<RenderContext>) {
  return (
    <div className="field">
      <label htmlFor={name}>{title}</label>
      <select {...register}>
        <option selected value="">
          {placeholder}
        </option>
        {schema?.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ObjectField({ children }: WithObjectProps) {
  return <div className="field-object">{children}</div>;
}

function ArrayField({ title, array, renderItem }: WithArrayProps) {
  return (
    <div className="field-array">
      <label>{title}</label>
      <div className="field-array-items">
        {array.fields.map((field, index) => (
          <div key={field.id} className="field-array-item">
            {renderItem(index)}
            <button onClick={() => array.remove(index)}>x</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => array.append({})}>
        Add
      </button>
    </div>
  );
}
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

### Core Components

#### SchemaForm

The main component for creating dynamic forms from a schema.

```tsx
import { SchemaForm } from '@basestacks/schema-form';

<SchemaForm
  fields={fields}
  onSubmit={handleSubmit}
  renderContext={{ layout: 'vertical' }}
  {...reactHookFormProps}
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|:--------:|-------------|
| `fields` | `FieldSchemas<TFormValue>` | ✓ | Schema definitions for form fields |
| `onSubmit` | `SubmitHandler<TFormValue>` | | Form submission handler |
| `renderContext` | `TRenderContext` | | Context data passed to field renderers |
| `children` | `(props: SchemaFormRenderProps) => ReactNode` | | Custom render function |
schema |

#### SchemaFormProvider

Global configuration provider for schema forms.

```tsx
import { SchemaFormProvider } from '@basestacks/schema-form';

<SchemaFormProvider
  components={{
    Form: CustomFormLayout,
    fields: {
      text: withRegister(CustomTextField),
      checkbox: withRegister(CustomCheckboxField),
    }
  }}
  renderContext={{ theme: 'light' }}
>
  {children}
</SchemaFormProvider>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `components` | `SchemaFormComponents` | Component overrides for form and fields |
| `renderContext` | `RenderContext` | Global render context |
| `validationResolver` | `ResolverType<any>` | Custom validation resolver |
| `getDefaultMessages` | `(stats: ValidationStats, options: RegisterOptions) => DefaultMessages` | Function for default validation messages |

#### SchemaFormField

Component for rendering individual fields based on schema.

```tsx
import { SchemaFormField } from '@basestacks/schema-form';

<SchemaFormField 
  name="fieldName" 
  renderContext={{ customStyling: true }} 
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|:--------:|-------------|
| `name` | `FieldPath<TFormValue>` | ✓ | Field name/path |
| `renderContext` | `TRenderContext` | | Context data for this field |

### Higher-Order Components (HOCs)

#### withRegister

HOC for field components that use react-hook-form's `register` method.

```tsx
import { withRegister } from '@basestacks/schema-form';

const TextField = ({ name, title, register, error }) => (
  <div>
    <label htmlFor={name}>{title}</label>
    <input {...register} />
    {error && <span>{error.message}</span>}
  </div>
);

const RegisteredTextField = withRegister(TextField);
```

**Function Signature:**

```tsx
withRegister<TRenderContext>(
  Component: React.ComponentType<WithRegisterProps<TRenderContext>>,
  baseRenderContext?: Partial<TRenderContext>,
  baseSchema?: RegisterOptions<any>
)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `Component` | `React.ComponentType<WithRegisterProps<TRenderContext>>` | Component to wrap |
| `baseRenderContext` | `Partial<TRenderContext>` | Default render context to apply to all instances |
| `baseSchema` | `RegisterOptions<any>` | Default schema options to apply to all instances |

**Props passed to wrapped component:**

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Field name |
| `title` | `string` | Field label |
| `description` | `string` | Field description |
| `placeholder` | `string` | Input placeholder |
| `register` | `UseFormRegisterReturn` | Register object from react-hook-form |
| `error` | `FieldError` | Field error if validation fails |
| `required` | `boolean` | Whether field is required |
| `minLength` | `number` | Minimum length constraint |
| `maxLength` | `number` | Maximum length constraint |
| `min` | `number` | Minimum value constraint |
| `max` | `number` | Maximum value constraint |
| `pattern` | `string` | Regex pattern constraint |
| `schema` | `GenericFieldSchema` | Complete field schema |
| `renderContext` | `any` | Custom render context |

#### withController

HOC for field components that need access to field state and controller.

```tsx
import { withController } from '@basestacks/schema-form';

const SelectField = ({ field, fieldState, title }) => (
  <div>
    <label>{title}</label>
    <select
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {fieldState.error && <span>{fieldState.error.message}</span>}
  </div>
);

const ControlledSelectField = withController(SelectField);
```

**Function Signature:**

```tsx
withController<TRenderContext>(
  Component: React.ComponentType<WithControllerProps<TRenderContext>>,
  baseRenderContext?: Partial<TRenderContext>,
  baseSchema?: RegisterOptions<any>
)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `Component` | `React.ComponentType<WithControllerProps<TRenderContext>>` | Component to wrap |
| `baseRenderContext` | `Partial<TRenderContext>` | Default render context to apply to all instances |
| `baseSchema` | `RegisterOptions<any>` | Default schema options to apply to all instances |

**Props passed to wrapped component:**

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Field name |
| `title` | `string` | Field label |
| `description` | `string` | Field description |
| `placeholder` | `string` | Field placeholder |
| `field` | `ControllerRenderProps` | Field controller object |
| `fieldState` | `ControllerFieldState` | Field state including errors |
| `formState` | `UseFormStateReturn` | Form state |
| `error` | `FieldError` | Field error if validation fails |
| `required` | `boolean` | Whether field is required |
| `minLength` | `number` | Minimum length constraint |
| `maxLength` | `number` | Maximum length constraint |
| `min` | `number` | Minimum value constraint |
| `max` | `number` | Maximum value constraint |
| `pattern` | `string` | Regex pattern constraint |
| `schema` | `GenericFieldSchema` | Complete field schema |
| `renderContext` | `any` | Custom render context |

#### withArray

HOC for handling array field types with add/remove functionality.

```tsx
import { withArray } from '@basestacks/schema-form';

const ArrayField = ({ title, array, renderItem, canAddItem, canRemoveItem }) => (
  <div>
    <label>{title}</label>
    {array.fields.map((field, index) => (
      <div key={field.id}>
        {renderItem(index)}
        {canRemoveItem && (
          <button onClick={() => array.remove(index)}>Remove</button>
        )}
      </div>
    ))}
    {canAddItem && (
      <button onClick={() => array.append({})}>Add Item</button>
    )}
  </div>
);

const ArrayFieldComponent = withArray(ArrayField);
```

**Function Signature:**

```tsx
withArray<TRenderContext>(
  Component: React.ComponentType<WithArrayProps<TRenderContext, any, any>>,
  baseRenderContext?: Partial<TRenderContext>,
  baseSchema?: UseFieldArrayProps<any>['rules']
)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `Component` | `React.ComponentType<WithArrayProps<TRenderContext, any, any>>` | Component to wrap |
| `baseRenderContext` | `Partial<TRenderContext>` | Default render context to apply to all instances |
| `baseSchema` | `UseFieldArrayProps<any>['rules']` | Default validation rules to apply to all array instances |

**Props passed to wrapped component:**

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Field name |
| `title` | `string` | Field label |
| `description` | `string` | Field description |
| `array` | `UseFieldArrayReturn` | Field array methods and state |
| `renderItem` | `(index: number) => ReactNode` | Function to render each array item |
| `canAddItem` | `boolean` | Whether more items can be added |
| `canRemoveItem` | `boolean` | Whether items can be removed |
| `minLength` | `number` | Minimum array length |
| `maxLength` | `number` | Maximum array length |
| `schema` | `ArrayFieldSchema` | Complete field schema |
| `renderContext` | `any` | Custom render context |

#### withObject

HOC for handling nested object fields.

```tsx
import { withObject } from '@basestacks/schema-form';

const ObjectField = ({ title, children }) => (
  <fieldset>
    <legend>{title}</legend>
    {children}
  </fieldset>
);

const ObjectFieldComponent = withObject(ObjectField);
```

**Function Signature:**

```tsx
withObject<TRenderContext>(
  Component: React.ComponentType<WithObjectProps<TRenderContext, any, any>>,
  baseRenderContext?: TRenderContext
)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `Component` | `React.ComponentType<WithObjectProps<TRenderContext, any, any>>` | Component to wrap |
| `baseRenderContext` | `TRenderContext` | Default render context to apply to all instances |

**Props passed to wrapped component:**

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Field name |
| `title` | `string` | Field label |
| `description` | `string` | Field description |
| `placeholder` | `string` | Field placeholder |
| `children` | `ReactNode` | Child field components |
| `schema` | `ObjectFieldSchema` | Complete field schema |
| `renderContext` | `any` | Custom render context |

### Schema Types

#### FieldSchemas

Definition of all form fields:

```tsx
interface FormValues {
  username: string;
  address: {
    city: string;
    zipCode: string;
  };
  hobbies: string[];
}

const fields: FieldSchemas<FormValues> = {
  username: {
    type: 'text',
    title: 'Username',
    required: true
  },
  address: {
    type: 'object',
    title: 'Address',
    properties: {
      city: { type: 'text', title: 'City' },
      zipCode: { type: 'text', title: 'Zip Code' }
    }
  },
  hobbies: {
    type: 'array',
    title: 'Hobbies',
    items: {
      type: 'text',
      title: 'Hobby'
    }
  }
}
```

#### Field Schema Properties

Common properties for all field types:

| Property | Type | Description |
|----------|------|-------------|
| `type` | `string` | Field type (e.g., 'text', 'select', 'checkbox') |
| `title` | `string` | Field label |
| `description` | `string` | Description or help text |
| `placeholder` | `string` | Input placeholder |
| `visible` | `boolean \| (values) => boolean` | Condition for field visibility |
| `renderContext` | `any` | Custom render context for this field |
| `required` | `boolean` | Whether the field is required |

Field type-specific properties:

| Field Type | Properties |
|------------|------------|
| `text` | `minLength`, `maxLength`, `pattern` |
| `number` | `min`, `max`, `step` |
| `select` | `options: SelectOption[]` |
| `object` | `properties: ObjectFieldProperties` |
| `array` | `items: ObjectFieldSchema`, `minLength`, `maxLength` |

#### SchemaFormRenderProps

The `SchemaFormRenderProps` type provides the structure for the props passed to the `SchemaForm` component's children or custom form layouts.

**Properties:**

| Property       | Type                          | Description                                                                 |
|----------------|-------------------------------|-----------------------------------------------------------------------------|
| `form`         | `UseFormReturn<TFormValue>`   | The form instance from `react-hook-form`.                                  |
| `fields`       | `FieldSchemas<TFormValue>`    | The schema definitions for all form fields.                                |
| `onSubmit`     | `SubmitHandler<TFormValue>`   | The function to handle form submission.                                    |
| `renderContext`| `TRenderContext`              | The merged render context for the form.                                    |
| `children`     | `React.ReactNode`             | The rendered child components of the form.                                 |

This type is useful for creating custom form layouts or accessing form-level properties in a structured way.

#### Validation

Schema-form supports validation through:

1. **React Hook Form's native validation**:
   - Specify rules directly in field schema (required, min, max, etc.)

2. **Custom validation resolvers**:
   - Supports integration with validation libraries
   - Can be specified globally or per-form

```tsx
<SchemaForm
  fields={fields}
  schema={yupSchema}  // Your validation schema
  resolverOptions={{ abortEarly: false }}
/>
```

#### RenderContext

RenderContext allows passing custom data to field components:

1. **Global context**: Set at the provider level
2. **Form context**: Set at the form level
3. **Field context**: Set at individual field level

Later contexts override earlier ones when merged.

```tsx
<SchemaFormProvider renderContext={{ theme: 'dark' }}>
  <SchemaForm
    fields={fields}
    renderContext={{ size: 'large' }}
    // Field with renderContext={{ variant: 'outlined' }}
  />
</SchemaFormProvider>
```

### Hooks

#### useSchemaForm

Access the current form context.

```tsx
import { useSchemaForm } from '@basestacks/schema-form';

function CustomField() {
  const { form, fields, renderContext } = useSchemaForm();
  // ...
}
```

#### useFieldSchema

Get the schema for a specific field.

```tsx
import { useFieldSchema } from '@basestacks/schema-form';

function FieldWrapper({ name }) {
  const schema = useFieldSchema(name);
  // ...
}
```

#### useFieldStatus

Check if a field should be visible based on conditions.

```tsx
import { useFieldStatus } from '@basestacks/schema-form';

function ConditionalField({ schema }) {
  const { isVisible } = useFieldStatus(schema, formValues);
  if (!isVisible) return null;
  // ...
}
```

## Contributing

We welcome contributions to make `@basestacks/schema-form` even better! Whether you're fixing bugs, improving documentation, or adding new features, your help is appreciated.

### Development Requirements

- Node.js 20
- pnpm v9

For detailed contribution guidelines, please read our [CONTRIBUTING.md](./CONTRIBUTING.md) document.
