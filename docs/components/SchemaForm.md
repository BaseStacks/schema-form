# SchemaForm

The main component for creating dynamic forms from a schema.

## Import

```tsx
import { SchemaForm } from '@basestacks/schema-form';
```

## Props

| Prop | Type | Required | Description |
|------|------|:--------:|-------------|
| `fields` | `FormFields` | ✓ | Schema definitions for form fields |
| `onSubmit` | `(data, event) => any` | | Form submission handler |
| `renderContext` | `object` | | Context data passed to field renderers |
| `children` | `(props: SchemaFormRenderProps) => ReactNode` | | Custom render function |
| `...reactHookFormProps` | `UseFormProps` | | Props passed directly to react-hook-form |

## Basic Example

This example shows how to create a simple login form with username, password, and checkbox fields. The form uses default rendering and handles submission with a basic callback.

```tsx
interface LoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

const fields: FormFields<LoginForm> = {
  username: {
    type: "text",
    title: "Username",
    required: true,
  },
  password: {
    type: "text",
    title: "Password",
    required: true,
    renderContext: {
      secureTextEntry: true,
    },
  },
  rememberMe: {
    type: "checkbox",
    title: "Remember me",
  },
};

function LoginForm() {
  const handleSubmit = (data: LoginForm) => {
    console.log("Form data:", data);
  };

  return (
    <SchemaForm
      fields={fields}
      onSubmit={handleSubmit}
      defaultValues={{
        username: "",
        password: "",
        rememberMe: false,
      }}
    />
  );
}
```

## Advanced Example with Custom Rendering

This example demonstrates how to use the render props pattern for complete control over form layout. It includes custom buttons for form reset and submission with validation state handling.

```tsx
<SchemaForm
  fields={fields}
  onSubmit={handleSubmit}
  renderContext={{ layout: "horizontal" }}
  mode="onChange"
>
  {({ form, children }) => (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="form-fields">
        {children}
      </div>
      <div className="form-actions">
        <button type="button" onClick={() => form.reset()}>
          Reset
        </button>
        <button type="submit" disabled={!form.formState.isValid}>
          Submit
        </button>
      </div>
    </form>
  )}
</SchemaForm>
```

## Notes

- All props from react-hook-form's `useForm` hook can be passed directly to `SchemaForm`
- The `fields` prop defines the structure and validation rules for your form
- Use `renderContext` to pass additional information to your field components
