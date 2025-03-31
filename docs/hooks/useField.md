# useField

A custom hook that provides a controller for managing form fields with schema-based validation.

## Import

```tsx
import { useField } from '@basestacks/schema-form';
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `baseSchema` | `RegisterOptions<TFormValue>` | | Optional base schema to override or extend the context schema |

## Returns

`UseFieldReturn` object containing:

| Property | Type | Description |
|----------|------|-------------|
| `field` | `ControllerRenderProps` | The field's input props and methods for managing its state |
| `fieldState` | `ControllerFieldState` | The state of the field, including validation errors |
| `formState` | `UseFormStateReturn` | The state of the entire form |
| `schema` | `RegisterOptions` | The merged schema |
| `name` | `string` | The field name |
| `title` | `string \| undefined` | The field title |
| `description` | `string \| undefined` | The field description |
| `placeholder` | `string \| undefined` | The field placeholder |
| `renderContext` | `TRenderContext` | The render context |
| `error` | `FieldError \| undefined` | Any validation error |
| `required` | `boolean` | Whether the field is required |
| `min` | `number \| undefined` | Minimum numeric value |
| `max` | `number \| undefined` | Maximum numeric value |
| `minLength` | `number \| undefined` | Minimum string length |
| `maxLength` | `number \| undefined` | Maximum string length |
| `pattern` | `RegExp \| undefined` | Validation pattern |

## Example

```tsx
function RadioGroup({ options }: { options: Array<{value: string, label: string}> }) {
  const { field, name, title, error, required } = useField();
  
  return (
    <div className="radio-group">
      <label>{title} {required && <span className="required">*</span>}</label>
      <div className="options">
        {options.map((option) => (
          <label key={option.value} className="radio-option">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              value={option.value}
              checked={field.value === option.value}
              onChange={() => field.onChange(option.value)}
              onBlur={field.onBlur}
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

## Notes

- `useField` is designed for controlled components
- It uses react-hook-form's `useController` under the hood
- The schema from the field context is automatically merged with any provided `baseSchema`
- If you need to work with uncontrolled components for performance, consider using `useUncontrolledField` instead
