# FormSchema

The root schema definition type for form fields.

## Description

`FormSchema` is a mapped type that defines the schema for a form based on the structure of the form values. It maps each key in the form values type to a corresponding field schema.

## Example

```tsx
interface LoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

const fields: FormSchema<LoginForm> = {
  username: {
    type: "text",
    title: "Username",
    required: true
  },
  password: {
    type: "text",
    title: "Password",
    required: true,
    renderContext: {
      secureTextEntry: true
    }
  },
  rememberMe: {
    type: "checkbox",
    title: "Remember me"
  }
};
```

## Nested Objects Example

```tsx
interface ProfileForm {
  name: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
}

const fields: FormSchema<ProfileForm> = {
  name: {
    type: "text",
    title: "Full Name",
    required: true
  },
  address: {
    type: "object",
    title: "Address",
    properties: {
      street: { 
        type: "text", 
        title: "Street Address" 
      },
      city: { 
        type: "text", 
        title: "City" 
      },
      zipCode: { 
        type: "text", 
        title: "Zip Code", 
        pattern: /^\d{5}(-\d{4})?$/ 
      }
    }
  }
};
```

## Array Fields Example

```tsx
interface ContactsForm {
  contacts: Array<{
    name: string;
    email: string;
    phone?: string;
  }>;
}

const fields: FormSchema<ContactsForm> = {
  contacts: {
    type: "array",
    title: "Contacts",
    minLength: 1,
    maxLength: 5,
    items: {
      type: "object",
      properties: {
        name: { 
          type: "text", 
          title: "Name", 
          required: true 
        },
        email: { 
          type: "text", 
          title: "Email", 
          required: true,
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
          }
        },
        phone: { 
          type: "text", 
          title: "Phone Number",
          pattern: {
            value: /^\d{10}$/,
            message: "Phone number must be 10 digits"
          }
        }
      }
    }
  }
};
```

## Dynamic Fields Rendering Example

```tsx
interface SurveyForm {
  surveyType: "personal" | "business";
  age?: number;
  companySize?: number;
}

const fields: FormSchema<SurveyForm> = {
  surveyType: {
    type: "select",
    title: "Survey Type",
    options: [
      { value: "personal", label: "Personal" },
      { value: "business", label: "Business" }
    ],
    required: true
  },
  age: {
    type: "number",
    title: "Your Age",
    min: 18,
    max: 120,
    visible: {
      when: "surveyType",
      equal: "personal"
    }
  },
  companySize: {
    type: "number",
    title: "Company Size (# of employees)",
    min: 1,
    visible: {
      when: "surveyType",
      equal: "business"
    }
  }
};
```

## Custom Field Example

```tsx
interface CustomFieldForm {
  customField: string;
}
const fields: FormSchema<CustomFieldForm> = {
  customField: {
    Component: CustomFieldComponent,
  }
};
```

## Notes

- Each key in `FormSchema` corresponds to a field in your form
- The field schema determines how the field is validated and rendered
- TypeScript helps ensure that your schema matches your form structure
- Use `type` to specify what kind of field to render
- Common field types are: 'text', 'number', 'checkbox', 'select', 'array', and 'object'
- You can extend this with custom field types through the Schema Form Provider
