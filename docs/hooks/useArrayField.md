# useArrayField

A custom hook for managing array fields in a form.

## Import

```tsx
import { useArrayField } from '@basestacks/schema-form';
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `baseSchema` | `UseFieldArrayProps<TFormValue>['rules']` | | Optional base schema for the array field |

## Returns

`UseArrayFieldReturn` object containing:

| Property | Type | Description |
|----------|------|-------------|
| `array` | `UseFieldArrayReturn` | The `useFieldArray` instance for managing array items |
| `schema` | `ArrayFieldSchema` | The merged schema for the array field |
| `name` | `string` | The name of the array field |
| `title` | `string \| undefined` | The title of the array field |
| `description` | `string \| undefined` | The description of the array field |
| `placeholder` | `string \| undefined` | The placeholder for the array field |
| `canAddItem` | `boolean` | Whether more items can be added to the array |
| `canRemoveItem` | `boolean` | Whether items can be removed from the array |
| `getItemName` | `(index: number) => string` | Function to get field name for an array item |
| `renderContext` | `TRenderContext` | The render context for the field |
| `error` | `FieldError \| undefined` | Any validation error |
| `required` | `boolean` | Whether the field is required |
| `minLength` | `number \| undefined` | Minimum array length |
| `maxLength` | `number \| undefined` | Maximum array length |

## Basic Example

```tsx
function ContactsArrayField() {
  const { 
    array, 
    title, 
    canAddItem, 
    canRemoveItem, 
    getItemName 
  } = useArrayField();
  
  return (
    <div className="array-field">
      <h3>{title}</h3>
      
      {array.fields.map((field, index) => (
        <div key={field.id} className="array-item">
          <SchemaFormField name={getItemName(index)} renderContext={{className: 'form-item'}}/>
          {canRemoveItem && (
            <button onClick={() => array.remove(index)}className="remove-btn">
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

## Notes

- `useArrayField` is built on top of react-hook-form's `useFieldArray`
- The `canAddItem` and `canRemoveItem` properties take into account the `minLength` and `maxLength` constraints
- Use `getItemName(index)` to get the full field path for a specific array item
- Every time an array item is removed or reordered, React re-renders the component with the updated fields
