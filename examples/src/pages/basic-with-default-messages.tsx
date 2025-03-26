import { PropsWithChildren } from 'react';
import { FieldSchemas, SchemaForm, SchemaFormProvider, withRegister } from '@basestacks/schema-form';
import { ExampleFormProps, withExample } from '../components/hoc/withExample';
import { CheckboxField, FormLayout, FormRenderContext, InputField } from '../components/fields';

function FormProvider({ children }: PropsWithChildren) {
    return (
        <SchemaFormProvider
            components={{
                Form: FormLayout,
                fields: {
                    text: withRegister(InputField),
                    checkbox: withRegister(CheckboxField),
                },
            }}
            getDefaultMessages={(validations, schema) => {
                if (schema.type === 'array') {
                    return {
                        required: 'This field is required',
                        minLength: `This field must have at least ${validations.minLength} items`,
                        maxLength: `This field must have at most ${validations.maxLength} items`
                    };
                }

                return {
                    required: 'This field is required',
                    minLength: `This field must be at least ${validations.minLength} characters`,
                    maxLength: `This field must be at most ${validations.maxLength} characters`,
                    min: `This field must be greater than or equal to ${validations.min}`,
                    max: `This field must be less than or equal to ${validations.max}`,
                    pattern: 'This field does not match the expected pattern'
                };
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

const fields: FieldSchemas<FormValues, FormRenderContext> = {
    username: {
        type: 'text',
        title: 'Username',
        placeholder: 'Enter your username',
        required: 'Username is required',
        minLength: 3,
        maxLength: 32,
        pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message: 'Username can only contain letters, numbers and underscores',
        },
    },
    password: {
        type: 'text',
        title: 'Password',
        placeholder: '••••••••',
        required: 'Password is required',
        minLength: 3,
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
