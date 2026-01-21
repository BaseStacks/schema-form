import { PropsWithChildren } from 'react';

import {
  FormFields,
  SchemaForm,
  SchemaFormProvider,
} from '@basestacks/schema-form';

import {
  CheckboxField,
  FormLayout,
  FormRenderContext,
  InputField,
} from '../components/fields';
import {
  ExampleFormProps,
  withExample,
} from '../components/hoc/withExample';

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
    readonly visibleTrue: string;
    readonly visibleFalse: string;
}

const fields: FormFields<FormValues, FormRenderContext> = {
    visibleTrue: {
        type: 'text',
        title: 'Visible Field',
        placeholder: 'This field is always visible',
        required: 'This field is required',
        visible: true
    },
    visibleFalse: {
        type: 'text',
        title: 'Hidden Field',
        placeholder: 'This field is conditionally visible',
        visible: false,
        required: 'This field is required',
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
