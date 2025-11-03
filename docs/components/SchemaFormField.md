# SchemaFormField

The `SchemaFormField` is a versatile component that renders form fields based on schema definitions.

## Import

```tsx
import { SchemaFormField } from '@basestacks/schema-form';
```

## Props

| Prop | Type | Required | Description |
|------|------|:--------:|-------------|
| `name` | `string` | ✓ | Field name/path |
| `renderContext` | `object` | | Context data for this field |

## Basic Example

The `SchemaFormField` component renders form fields based on your schema configuration. This example demonstrates how to use individual form fields within a `SchemaForm`:

```tsx
import { SchemaForm, SchemaFormField } from '@basestacks/schema-form';

interface SimpleForm {
    username: string;
    password: string;
}

const fields: FormFields<SimpleForm> = {
    username: {
        type: 'text',
        title: 'Username',
        required: true,
    },
    password: {
        type: 'text',
        title: 'Password',
        required: true,
        renderContext: {
            type: 'password',
        },
    }
};

function LoginForm() {
    const onSubmit = (data: SimpleForm) => {
        console.log('Form submitted:', data);
    };

    return (
        <SchemaForm fields={fields} onSubmit={onSubmit}>
            {({ form, onSubmit }) => (
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <SchemaFormField name="username" />
                    <SchemaFormField name="password" />
                    <button type="submit">Log in</button>
                </form>
            )}
        </SchemaForm>
    );
}
```

## Usage with Array Fields

The `SchemaFormField` component can be used with array fields to render dynamic lists of items. When working with arrays, it's recommended to use the `useArrayField` hook which provides utilities for managing array operations like adding, removing, and accessing array items. The following example demonstrates how to create a dynamic list of contacts:

```tsx
import { SchemaFormField, useArrayField } from '@basestacks/schema-form';

function ContactsField() {
  const { 
    array, 
    title, 
    getItemName 
  } = useArrayField();
  
  return (
    <div className="array-field">
      <h3>{title}</h3>
      
      {array.fields.map((field, index) => (
        <div key={field.id} className="array-item">
          {/* Renders the nested object or field at this array index */}
          <SchemaFormField name={getItemName(index)} />
          <button type="button" onClick={() => array.remove(index)}>
            Remove
          </button>
        </div>
      ))}
      
      <button type="button" onClick={() => array.append({})}>
        Add Contact
      </button>
    </div>
  );
}
```

## Usage with Object Fields

The `SchemaFormField` component can be used with nested object structures to represent complex data. When working with object fields, you can use dot notation in the `name` prop to access nested properties. This allows you to create custom layouts for object fields while maintaining the schema validation and form context. The example below shows how to create a custom address form with nested object properties:

```tsx
import { SchemaFormField } from '@basestacks/schema-form';

function AddressField() {
  return (
    <div className="address-container">
      <div className="row">
        <SchemaFormField name="address.street" />
      </div>
      <div className="row">
        <SchemaFormField name="address.city" />
        <SchemaFormField name="address.state" />
        <SchemaFormField name="address.zipCode" />
      </div>
    </div>
  );
}
```

## Notes

- `SchemaFormField` automatically finds the field schema from the form context
- It renders the appropriate UI component based on the field's type
- The component respects the field's visibility rules
- Render context passed to `SchemaFormField` is merged with any existing context for the field
