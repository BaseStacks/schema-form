# useObjectField

A custom hook that provides utilities for working with object fields in a form.

## Import

```tsx
import { useObjectField } from '@basestacks/schema-form';
```

## Parameters

None

## Returns

`UseObjectFieldReturn` object containing:

| Property | Type | Description |
|----------|------|-------------|
| `schema` | `ObjectFieldSchema` | The object field schema |
| `name` | `string` | The name of the field |
| `title` | `string \| undefined` | The title of the object field |
| `description` | `string \| undefined` | The description of the object field |
| `placeholder` | `string \| undefined` | The placeholder for the object field |
| `renderContext` | `TRenderContext` | The render context for the field |
| `fields` | `string[]` | An array of field paths for the object's properties |
| `error` | `FieldError \| undefined` | Any validation error |

## Basic Example

```tsx
function AddressField() {
  const { title, fields } = useObjectField();
  
  return (
    <fieldset className="object-field">
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

## Example with Custom Layout

```tsx
function PersonInfoField() {
  const { title, fields, name, renderContext } = useObjectField();

  // Find specific field names
  const firstNameField = fields.find(f => f.endsWith('.firstName'));
  const lastNameField = fields.find(f => f.endsWith('.lastName'));
  const emailField = fields.find(f => f.endsWith('.email'));
  const phoneField = fields.find(f => f.endsWith('.phone'));
  
  // Other fields that don't have specific placement
  const otherFields = fields.filter(f => 
    ![firstNameField, lastNameField, emailField, phoneField].includes(f)
  );
  
  return (
    <div className={`person-info ${renderContext.variant || 'default'}`}>
      <h3>{title}</h3>
      
      <div className="name-row">
        {firstNameField && <SchemaFormField name={firstNameField} />}
        {lastNameField && <SchemaFormField name={lastNameField} />}
      </div>
      
      <div className="contact-row">
        {emailField && <SchemaFormField name={emailField} />}
        {phoneField && <SchemaFormField name={phoneField} />}
      </div>
      
      {otherFields.length > 0 && (
        <div className="other-fields">
          {otherFields.map(fieldName => (
            <SchemaFormField key={fieldName} name={fieldName} />
          ))}
        </div>
      )}
    </div>
  );
}
```

## Notes

- `useObjectField` is designed for working with nested object structures in forms
- The `fields` array contains the full paths to all child fields in the object
- Use this hook when you need to customize how object fields are rendered
