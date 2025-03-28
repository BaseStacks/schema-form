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
- [API Reference](#api-reference)
  - [Core Components](#core-components)
    - [SchemaForm](#schemaform)
    - [SchemaFormProvider](#schemaformprovider)
    - [SchemaFormField](#schemaformfield)
  - [Hooks](#hooks)
    - [useRegister](#useregister)
    - [useController](#usecontroller)
    - [useArray](#usearray)
    - [useObject](#useobject)
  - [Schema Types](#schema-types)
  - [Validation](#validation)
  - [RenderContext](#rendercontext)
- [Contributing](#contributing)

## Installation

```bash
npm install @basestacks/schema-form
```

## Usage

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
import { PropsWithChildren } from "react";
import {
  useRegister,
  useController,
  SchemaFormProvider,
  SchemaFormRenderProps,
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
  const { register, name, placeholder, title, renderContext } = useRegister();
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

function CheckboxField() {
  const { register, name, title } = useRegister();
  return (
    <div className="field">
      <div>
        <input type="checkbox" {...register} />{" "}
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
      text: CustomTextField,
      checkbox: CustomCheckboxField,
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

### Hooks

#### useRegister

A hook that registers a field with the form and provides access to field properties and validation rules.

**Type Parameters:**
- `TRenderContext` - The render context type, extends RenderContext
- `TFormValue` - The form values type, extends FieldValues

**Parameters:**
- `baseSchema?: RegisterOptions<TFormValue>` - Optional base schema to override or extend the context schema

**Returns:** `WithRegisterReturn<TRenderContext, TFormValue>` object containing:
- `register` - The React Hook Form register function result
- `schema` - The combined field schema
- `name` - The field name
- `title` - The field title
- `description` - The field description
- `placeholder` - The field placeholder
- `renderContext` - The render context
- `error` - Any validation error
- `required` - Whether the field is required
- `min`/`max` - Minimum and maximum numeric values
- `minLength`/`maxLength` - Minimum and maximum string lengths
- `pattern` - Validation pattern

**Example Usage:**
```tsx
function TextField({ name, title, placeholder }: FieldProps) {
  const { register, error, required } = useRegister();
  
  return (
    <div className="field">
      <label htmlFor={name}>{title} {required && <span className="required">*</span>}</label>
      <input type="text" placeholder={placeholder} {...register} />
      {error && <div className="error">{error.message}</div>}
    </div>
  );
}
```

#### useController

A custom hook that provides a controller for managing form fields with schema-based validation.

**Type Parameters:**
- `TRenderContext` - The type of the render context, extending `RenderContext`
- `TFormValue` - The type of the form values, extending `FieldValues`

**Parameters:**
- `baseSchema?: RegisterOptions<TFormValue>` - Optional base schema for the field, which can include validation rules and other properties

**Returns:** `UseControllerReturn<TRenderContext, TFormValue>` object containing:
- `field` - The field's input props and methods for managing its state
- `fieldState` - The state of the field, including validation errors
- `formState` - The state of the entire form
- `schema` - The merged schema
- `name` - The field name
- `title` - The field title
- `description` - The field description
- `placeholder` - The field placeholder
- `renderContext` - The render context
- `error` - Any validation error
- `required` - Whether the field is required
- `min`/`max` - Minimum and maximum numeric values
- `minLength`/`maxLength` - Minimum and maximum string lengths
- `pattern` - Validation pattern

**Example Usage:**
```tsx
function RadioGroup({ options, title }: RadioGroupProps) {
  const { field, error, required } = useController();
  
  return (
    <div className="radio-group">
      <label>{title} {required && <span className="required">*</span>}</label>
      <div className="options">
        {options.map((option) => (
          <label key={option.value} className="radio-option">
            <input
              type="radio"
              value={option.value}
              checked={field.value === option.value}
              onChange={() => field.onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && <div className="error">{error.message}</div>}
    </div>
  );
}
```

#### useArray

A custom hook for managing array fields in a form using `react-hook-form`.

**Type Parameters:**
- `TRenderContext` - The type of the render context
- `TFormValue` - The type of the form values
- `TFieldValue` - The type of the field values within the array

**Parameters:**
- `baseSchema?: UseFieldArrayProps<any>['rules']` - Optional base schema for the array field, which will be merged with the schema from the field context

**Returns:** `UseArrayReturn<TRenderContext, TFormValue, TFieldValue>` object containing:
- `array` - The `useFieldArray` instance for managing array items
- `schema` - The merged schema for the array field
- `name` - The name of the array field
- `title` - The title of the array field from the schema
- `description` - The description of the array field from the schema
- `placeholder` - The placeholder for the array field from the schema
- `canAddItem` - A boolean indicating if more items can be added to the array
- `canRemoveItem` - A boolean indicating if items can be removed from the array
- `getItemName` - A function to get the name of an item in the array by index
- `renderContext` - The render context for the field
- `error` - The error state of the field
- `required` - A boolean indicating if the field is required
- `minLength` - The minimum number of items allowed in the array
- `maxLength` - The maximum number of items allowed in the array

**Example Usage:**
```tsx
function ContactsArray() {
  const { 
    array, 
    title, 
    canAddItem, 
    canRemoveItem, 
    getItemName 
  } = useArray();
  
  return (
    <div className="array-field">
      <h3>{title}</h3>
      
      {array.fields.map((field, index) => (
        <div key={field.id} className="array-item">
          <SchemaFormField name={getItemName(index)} />
          {canRemoveItem && (
            <button 
              type="button" 
              onClick={() => array.remove(index)}
              className="remove-btn"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      
      {canAddItem && (
        <button 
          type="button" 
          onClick={() => array.append({})} 
          className="add-btn"
        >
          Add Contact
        </button>
      )}
    </div>
  );
}
```

#### useObject

A custom hook that provides utilities for working with an object field schema in a form context.

**Type Parameters:**
- `TRenderContext` - The type of the render context, extending `RenderContext`
- `TFormValue` - The type of the form values, extending `FieldValues`
- `TFieldValue` - The type of the field values, extending `FieldValues`

**Parameters:**
- None

**Returns:** `UseObjectReturn<TRenderContext, TFormValue, TFieldValue>` object containing:
- `schema` - The object field schema
- `name` - The name of the field
- `title` - The title of the object field
- `description` - The description of the object field
- `placeholder` - The placeholder for the object field
- `renderContext` - The render context for the field
- `fields` - An array of field paths for the properties of the object field

**Example Usage:**
```tsx
function AddressField() {
  const { title, fields, renderContext } = useObject();
  
  return (
    <fieldset className={`object-field ${renderContext.variant || 'default'}`}>
      <legend>{title}</legend>
      
      <div className="object-fields-container">
        {fields.map(fieldName => (
          <SchemaFormField key={fieldName} name={fieldName} />
        ))}
      </div>
    </fieldset>
  );
}
```

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

## Contributing

We welcome contributions to make `@basestacks/schema-form` even better! Whether you're fixing bugs, improving documentation, or adding new features, your help is appreciated.

### Development Requirements

- Node.js 20
- pnpm v9

For detailed contribution guidelines, please read our [CONTRIBUTING.md](./CONTRIBUTING.md) document.
