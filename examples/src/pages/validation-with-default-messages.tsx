import { PropsWithChildren } from 'react';
import { FieldSchemas, SchemaForm, SchemaFormProvider, withArray, withObject, withRegister } from '@basestacks/schema-form';
import { ExampleFormProps, withExample } from '../components/hoc/withExample';
import { ArrayField, CheckboxField, FormLayout, FormRenderContext, InputField, ObjectField, SelectField } from '../components/fields';

function FormProvider({ children }: PropsWithChildren) {
    return (
        <SchemaFormProvider
            components={{
                Form: FormLayout,
                fields: {
                    text: withRegister(InputField),
                    checkbox: withRegister(CheckboxField),
                    select: withRegister(SelectField),
                    array: withArray(ArrayField),
                    object: withObject(ObjectField)
                },
            }}
            getDefaultMessages={(validations, schema) => {
                if (schema.type === 'array') {
                    return {
                        required: 'default.messages.array.required',
                        minLength: `default.messages.array.minLength: ${validations.minLength}`,
                        maxLength: `default.messages.array.maxLength: ${validations.maxLength}`,
                    };
                }

                return {
                    required: 'default.messages.common.required',
                    minLength: `default.messages.common.minLength: ${validations.minLength}`,
                    maxLength: `default.messages.common.maxLength: ${validations.maxLength}`,
                    min: `default.messages.common.min: ${validations.min}`,
                    max: `default.messages.common.max: ${validations.max}`,
                    pattern: 'default.messages.common.pattern',
                };
            }}
        >
            {children}
        </SchemaFormProvider>
    );
};

interface FormValues {
    fullName: string;
    gender: string;
    socialLinks: { value: string }[];
}

const fields: FieldSchemas<FormValues, FormRenderContext> = {
    fullName: {
        type: 'text',
        title: 'FullName',
        placeholder: 'Enter your fullName',
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    gender: {
        type: 'select',
        title: 'Gender',
        placeholder: 'Select your gender',
        required: true,
        options: [
            {
                value: 'male',
                label: 'Male',
            },
            {
                value: 'female',
                label: 'Female',
            },
            {
                value: 'other',
                label: 'Other',
            },
        ],
    },
    socialLinks: {
        type: 'array',
        title: 'Social links',
        required: true,
        minLength: 2,
        maxLength: 3,
        items: {
            type: 'object',
            properties: {
                value: {
                    type: 'text',
                    placeholder: 'Link',
                    required: true,
                },
            },
        },
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
