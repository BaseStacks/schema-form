# useSubmit

A custom hook that provides programmatic access to submit a form remotely by its ID. This hook allows you to trigger form submission from outside the form component, making it ideal for scenarios where the submit button is located separately from the form.

## Import

```tsx
import { useSubmit } from '@basestacks/schema-form';
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `formId` | `string` | ✓ | The unique identifier of the form to submit |

## Returns

`() => void` - A submit function that triggers the form submission with validation

## Example

### Basic Usage

```tsx
import { SchemaForm, useSubmit } from '@basestacks/schema-form';

function MyForm() {
  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <SchemaForm
      id="loginForm"
      fields={{
        username: {
          type: "text",
          title: "Username",
          required: true,
        },
        password: {
          type: "text",
          title: "Password",
          required: true,
        },
      }}
      onSubmit={handleSubmit}
    />
  );
}

function RemoteSubmitButton() {
  const submitLoginForm = useSubmit('loginForm');

  return (
    <button onClick={submitLoginForm}>
      Submit Login Form
    </button>
  );
}

function App() {
  return (
    <SchemaFormProvider>
      <MyForm />
      <RemoteSubmitButton />
    </SchemaFormProvider>
  );
}
```

### Multi-Step Form with External Navigation

```tsx
import { useState } from 'react';
import { SchemaForm, useSubmit, SchemaFormProvider } from '@basestacks/schema-form';

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const submitStep1 = useSubmit('step1Form');
  const submitStep2 = useSubmit('step2Form');

  const handleStep1Submit = (data) => {
    console.log('Step 1 data:', data);
    setStep(2);
  };

  const handleStep2Submit = (data) => {
    console.log('Step 2 data:', data);
    console.log('Form completed!');
  };

  return (
    <div>
      {step === 1 && (
        <SchemaForm
          id="step1Form"
          fields={{
            firstName: { type: "text", title: "First Name", required: true },
            lastName: { type: "text", title: "Last Name", required: true },
          }}
          onSubmit={handleStep1Submit}
        />
      )}

      {step === 2 && (
        <SchemaForm
          id="step2Form"
          fields={{
            email: { type: "text", title: "Email", required: true },
            phone: { type: "text", title: "Phone", required: true },
          }}
          onSubmit={handleStep2Submit}
        />
      )}

      <div className="navigation">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)}>Previous</button>
        )}
        {step === 1 && (
          <button onClick={submitStep1}>Next</button>
        )}
        {step === 2 && (
          <button onClick={submitStep2}>Complete</button>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <SchemaFormProvider>
      <MultiStepForm />
    </SchemaFormProvider>
  );
}
```

### Modal Form with External Actions

```tsx
import { SchemaForm, useSubmit, SchemaFormProvider } from '@basestacks/schema-form';

function FormModal({ isOpen, onClose }) {
  const submitForm = useSubmit('modalForm');

  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>User Information</h2>
        <SchemaForm
          id="modalForm"
          fields={{
            name: { type: "text", title: "Name", required: true },
            email: { type: "text", title: "Email", required: true },
          }}
          onSubmit={handleSubmit}
        />
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={submitForm}>Save</button>
        </div>
      </div>
    </div>
  );
}
```

## Requirements

- The form must have an `id` prop set on the `SchemaForm` component
- The form must be registered within a `SchemaFormProvider` context
- The hook must be called within a component that is a child of `SchemaFormProvider`

## Error Handling

The hook will throw an error if:
- The specified `formId` is not registered in the form map
- The hook is used outside of a `SchemaFormProvider` context

## Notes

- The submit function triggers form validation before calling the `onSubmit` handler
- Invalid forms will not call the `onSubmit` handler
- This hook is particularly useful for:
  - Forms in modals where actions are in the modal footer
  - Multi-step forms with external navigation
  - Forms with submit buttons in a different part of the UI
  - Programmatic form submission based on external events
