# useUncontrolledField

A hook that registers a field with the form, allowing it to be used in uncontrolled mode. This is useful for simple input elements that guarantee better performance by avoiding unnecessary re-renders.

## Import

```tsx
import { useUncontrolledField } from '@basestacks/schema-form';
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `baseSchema` | `RegisterOptions` | | Optional base schema to override or extend the context schema |

## Returns

`WithRegisterReturn` object containing:

| Property | Type | Description |
|----------|------|-------------|
| `field` | `UseFormRegisterReturn` | The register result for the field |
| `schema` | `RegisterOptions<TFormValue>` | The merged schema |
| `name` | `string` | The field name |
| `title` | `string \| undefined` | The field title |
| `description` | `string \| undefined` | The field description |
| `placeholder` | `string \| undefined` | The field placeholder |
| `renderContext` | `TRenderContext` | The render context |
| `required` | `boolean` | Whether the field is required |
| `min` | `number \| undefined` | Minimum numeric value |
| `max` | `number \| undefined` | Maximum numeric value |
| `minLength` | `number \| undefined` | Minimum string length |
| `maxLength` | `number \| undefined` | Maximum string length |
| `pattern` | `RegExp \| undefined` | Validation pattern |

## Basic Example

```tsx
function TextField() {
  const { 
    field, 
    name, 
    title, 
    placeholder, 
    required 
  } = useUncontrolledField();
  
  return (
    <div className="field">
      <label htmlFor={name}>
        {title} {required && <span className="required">*</span>}
      </label>
      <input
        type="text"
        id={name}
        placeholder={placeholder}
        {...field}
      />
    </div>
  );
}
```

## Example with Custom Validation

```tsx
function PasswordField() {
  const { 
    field, 
    name, 
    title, 
    required 
  } = useUncontrolledField({
    // Additional validation rules
    validate: {
      hasUppercase: (value) => 
        /[A-Z]/.test(value) || "Password must contain an uppercase letter",
      hasNumber: (value) => 
        /[0-9]/.test(value) || "Password must contain a number"
    }
  });
  
  return (
    <div className="field">
      <label htmlFor={name}>
        {title} {required && <span className="required">*</span>}
      </label>
      <input
        type="password"
        id={name}
        {...field}
      />
    </div>
  );
}
```

## Example with Custom Render Context

```tsx
interface CustomRenderContext extends RenderContext {
  variant?: 'outlined' | 'filled';
  helperText?: string;
}

function EnhancedTextField() {
  const { 
    field, 
    name, 
    title, 
    placeholder,
    required, 
    renderContext 
  } = useUncontrolledField<CustomRenderContext>();
  
  const variant = renderContext.variant || 'outlined';
  const helperText = renderContext.helperText;
  
  return (
    <div className={`field field-${variant}`}>
      <label htmlFor={name}>
        {title} {required && <span className="required">*</span>}
      </label>
      <input
        type="text"
        id={name}
        placeholder={placeholder}
        className={variant}
        {...field}
      />
      {helperText && <div className="helper-text">{helperText}</div>}
    </div>
  );
}
```

## Notes

- `useUncontrolledField` is designed for uncontrolled components using react-hook-form's `register` function
- Use this hook for simple input elements (text, checkbox, etc.) to avoid unnecessary re-renders.
- For complex components that need controlled state management, use `useField` instead
- The schema from the field context is automatically merged with any provided `baseSchema`
