import { PropsWithChildren } from 'react';
import { FieldSchemas, WithRegisterProps, SchemaForm, SchemaFormProvider, SchemaFormRenderProps, withRegister } from '@basestacks/schema-form';
import React from 'react';

function FormProvider({ children }: PropsWithChildren) {
    return (
        <SchemaFormProvider
            components={{
                Form: FormLayout,
                fields: {
                    text: withRegister(TextField),
                },
            }}
        >
            {children}
        </SchemaFormProvider>
    );
};

function FormLayout({ form, onSubmit, children }: SchemaFormRenderProps) {
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            {children}
            <input type="submit" />
        </form>
    );
};

function TextField({ register, placeholder, renderContext }: WithRegisterProps) {
    return (
        <input
            type={renderContext.inputType ?? 'text'}
            placeholder={placeholder}
            {...register}
        />
    );
};

interface FormValues {
    text: string;
}

function ExampleForm() {
    const fields: FieldSchemas<FormValues> = {
        text: {
            type: 'text',
            placeholder: 'Enter text',
        }
    };

    const [formValues, setFormValues] = React.useState<FormValues | null>(null);

    return (
        <div>
            <SchemaForm fields={fields} onSubmit={setFormValues} />
            {
                formValues && (
                    <div>
                        <pre data-testid="form-values">
                            {JSON.stringify(formValues, null, 2)}
                        </pre>
                    </div>
                )
            }
        </div>
    );
}

export default function WithRegister() {
    return (
        <FormProvider>
            <ExampleForm />
        </FormProvider>
    );
};
