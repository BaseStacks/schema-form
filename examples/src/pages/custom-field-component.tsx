import { PropsWithChildren } from 'react';
import { FormSchema, SchemaForm, SchemaFormProvider, useField } from '@basestacks/schema-form';
import { ExampleFormProps, withExample } from '../components/hoc/withExample';
import { FormLayout, FormRenderContext, InputField } from '../components/fields';

function FormProvider({ children }: PropsWithChildren) {
    return (
        <SchemaFormProvider
            components={{
                Form: FormLayout,
                fields: {
                    text: InputField,
                },
            }}
        >
            {children}
        </SchemaFormProvider>
    );
};

interface FormValues {
    readonly username: string;
    readonly password: string;
    readonly repeatPassword: string;
    readonly agreeTermAndConditions: boolean;
}

const fields: FormSchema<FormValues, FormRenderContext> = {
    username: {
        type: 'text',
        title: 'Username',
        placeholder: 'Enter username',
        required: 'Username is required'
    },
    password: {
        type: 'text',
        title: 'Password',
        placeholder: '••••••••',
        required: 'Password is required',
        renderContext: {
            inputType: 'password',
        },
    },
    repeatPassword: {
        type: 'text',
        title: 'Repeat password',
        placeholder: '••••••••',
        renderContext: {
            inputType: 'password',
        },
        validate: (value, formValue) => {
            if(!formValue.password) {
                return;
            }
            return formValue.password === value || 'Passwords do not match';
        },
    },
    agreeTermAndConditions: {
        validate: (value) => value || 'You must agree to terms and conditions',
        Component: function CustomCheckboxField() {
            const { field, name, error } = useField();
            
            return (
                <div className="flex items-center col-span-12">
                    <div>
                        <input
                            {...field}
                            type="checkbox"
                            name={name}
                            id={name}
                            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                        <label
                            htmlFor={name}
                            className="ml-2 block text-sm font-medium text-gray-900"
                        >
                            Agree to <a href="https://example.com">terms</a> and{' '} <a href="https://example.com">conditions</a>
                        </label>
                    </div>
                    {error?.message && <div className="field-error">{error?.message}</div>}
                </div>
            );
        },
    },
};

function ExampleForm({ onSubmit }: ExampleFormProps) {
    return (
        <SchemaForm
            fields={fields}
            onSubmit={onSubmit}
            shouldUseNativeValidation={false}
        />
    );
}

const Example = withExample(FormProvider, ExampleForm);

export default Example;
