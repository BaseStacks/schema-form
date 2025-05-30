import { PropsWithChildren } from 'react';
import { FormSchema, SchemaForm, SchemaFormProvider } from '@basestacks/schema-form';
import { ExampleFormProps, withExample } from '../components/hoc/withExample';
import { CheckboxField, FormLayout, FormRenderContext, InputField } from '../components/fields';

function FormProvider({ children }: PropsWithChildren) {
    return (
        <SchemaFormProvider
            components={{
                Form: FormLayout,
                fields: {
                    text: InputField,
                    checkbox: CheckboxField,
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
    readonly rememberMe: boolean;
}

const fields: FormSchema<FormValues, FormRenderContext> = {
    username: {
        type: 'text',
        title: 'Username',
        placeholder: 'Enter your username',
        required: 'Username is required',
        minLength: {
            value: 3,
            message: 'Username must be at least 3 characters',
        },
        maxLength: {
            value: 20,
            message: 'Username must be at most 20 characters',
        },
        pattern: {
            value: /^\w+$/,
            message: 'Username can only contain letters, numbers and underscores',
        },
    },
    password: {
        type: 'text',
        title: 'Password',
        placeholder: '••••••••',
        required: 'Password is required',
        minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
        },
        renderContext: {
            inputType: 'password',
        },
    },
    rememberMe: {
        type: 'checkbox',
        title: 'Remember me',
    },
};

function ExampleForm({ onSubmit }: ExampleFormProps) {
    return (
        <SchemaForm
            fields={fields}
            onSubmit={onSubmit}
            shouldUseNativeValidation={true}
        />
    );
}

const Example = withExample(FormProvider, ExampleForm);

export default Example;
