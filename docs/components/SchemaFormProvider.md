# SchemaFormProvider

Global configuration provider for schema forms.

## Import

```tsx
import { SchemaFormProvider } from '@basestacks/schema-form';
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `components` | `SchemaFormComponents` | Component overrides for form and fields |
| `renderContext` | `object` | Global render context |
| `getDefaultMessages` | `(stats: ValidationStats, options: RegisterOptions) => DefaultMessages` | Function for default validation messages |

## Example

```tsx
import { SchemaFormProvider } from '@basestacks/schema-form';

function App() {
  return (
    <SchemaFormProvider {...schemaFormConfig}>
      <LoginForm />
    </SchemaFormProvider>
  );
}
```

## Component Overrides

The `components` prop allows you to provide custom implementations for different field types:

```tsx
components={{
  // Override the default form wrapper
  Form: CustomFormLayout,
  
  // Override specific field types
  fields: {
    text: CustomTextField,
    select: CustomSelectField,
    checkbox: CustomCheckboxField,
    number: CustomNumberField,
    array: CustomArrayField,
    object: CustomObjectField,
    // Add any other custom field types
    radio: CustomRadioField,
    dateTime: CustomDateTimeField,
  }
}}
```

## Global Render Context

You can provide a global render context that will be available to all forms and fields:

```tsx
renderContext={{
  // UI configuration
  theme: 'dark',
  size: 'compact',
  labelPosition: 'side',
  
  // Custom properties
  translations: {
    submit: 'Save',
    cancel: 'Discard',
  },
}}
```

## Default Messages
The `getDefaultMessages` function allows you to customize the default validation messages for your forms:

```tsx
getDefaultMessages={(stats, schema) => {
  // Default messages based on schema type
  if(schema.type === 'array') {
    return {
      required: 'This field is required',
      minItems: `Must have at least ${schema.minItems} items`,
      maxItems: `Must not exceed ${schema.maxItems} items`,
    };
  }

  // Default messages for other types
  return {
    required: 'This field is required',
    minLength: `Must be at least ${schema.minLength} characters`,
    maxLength: `Must not exceed ${schema.maxLength} characters`,
    pattern: 'Invalid format',
    validate: 'Validation failed',
  };
}}
```

## Notes

- `SchemaFormProvider` should wrap your entire app or the parts that use schema forms
- Component overrides take precedence over built-in components
- The global render context is merged with form-level and field-level contexts, with field-level having the highest priority
- You can nest multiple providers with different configurations if needed
