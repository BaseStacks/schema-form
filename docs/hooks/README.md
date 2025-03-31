# Schema Form Hooks

This section covers the custom hooks provided by `@basestacks/schema-form` for working with form fields:

- [useUncontrolledField](./useUncontrolledField.md) - Hook for uncontrolled form fields
- [useField](./useField.md) - Hook for controlled form fields
- [useArrayField](./useArrayField.md) - Hook for managing array fields
- [useObjectField](./useObjectField.md) - Hook for working with object fields

These hooks are designed to be used within custom field components to access field properties, validation rules, and form state.

## Usage Pattern

Schema Form hooks follow a consistent pattern:

1. They must be used within a Schema Form context
2. They extract field metadata from the context
3. They provide access to the field's value, validation state, and metadata
4. They can be used to build custom field components

## When to Use Each Hook

| Hook | When to Use |
|------|-------------|
| `useUncontrolledField` | For simple input elements (text, checkbox, etc.) that don't need controlled state |
| `useField` | For complex components that need controlled state management |
| `useArrayField` | For repeatable field groups or dynamic lists |
| `useObjectField` | For nested object structures with multiple fields |

## Example: Creating a Custom Field Component

```tsx
import { useField } from '@basestacks/schema-form';

function CustomRatingField() {
  const { 
    field, 
    name, 
    title, 
    error, 
    required,
    min,
    max
  } = useField();
  
  // Default min/max if not specified in schema
  const minRating = min ?? 1;
  const maxRating = max ?? 5;
  const ratings = Array.from({ length: maxRating - minRating + 1 }, 
    (_, i) => i + minRating);
  
  return (
    <div className="rating-field">
      <label htmlFor={name}>
        {title} {required && <span className="required">*</span>}
      </label>
      
      <div className="stars">
        {ratings.map(rating => (
          <button
            key={rating}
            type="button"
            className={rating <= field.value ? 'star active' : 'star'}
            onClick={() => field.onChange(rating)}
          >
            ★
          </button>
        ))}
      </div>
      
      {error && <div className="error">{error.message}</div>}
    </div>
  );
}
```
