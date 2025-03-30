import { PropsWithChildren } from 'react';
import { FieldSchemas, SchemaForm, SchemaFormProvider } from '@basestacks/schema-form';
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
    readonly receiveNewsletter: boolean;
    readonly email: string;
}

const fields: FieldSchemas<FormValues, FormRenderContext> = {
    receiveNewsletter: {
        type: 'checkbox',
        title: 'Receive newsletter'
    },
    email: {
        type: 'text',
        title: 'Email',
        placeholder: 'Enter your email',
        visible: {
            when: 'receiveNewsletter',
            equal: true,
        },
        required: 'Email is required',
        pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email address',
        },
    },
};

function ExampleForm({ onSubmit }: ExampleFormProps) {
    return (
        <SchemaForm
            fields={fields}
            onSubmit={onSubmit}
        />
    );
}

const Example = withExample(FormProvider, ExampleForm);

export default Example;
