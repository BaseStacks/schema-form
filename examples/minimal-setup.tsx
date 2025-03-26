import { PropsWithChildren } from 'react';
import { FieldSchemas, WithArrayProps, WithControllerProps, WithObjectProps, WithRegisterProps, SchemaForm, SchemaFormProvider, SchemaFormRenderProps, withArray, withController, withObject, withRegister } from '../src';
import React from 'react';

interface FormRenderContext {
    readonly fieldLayout: 'horizontal' | 'vertical';
}

function FormProvider({ children }: PropsWithChildren<{}>) {
    return (
        <SchemaFormProvider
            components={{
                Form: FormLayout,
                fields: {
                    text: withRegister(TextField),
                    controlled: withController(ControlledField),
                    array: withArray(ArrayField),
                    object: withObject(ObjectField),
                },
            }}
            renderContext={{
                fieldLayout: 'horizontal'
            }}
        >
            {children}
        </SchemaFormProvider>
    );
};

function FormLayout({ form, onSubmit, children }: SchemaFormRenderProps<FormRenderContext>) {
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            {children}
            <input type="reset">Reset</input>
            <input type="submit">Submit</input>
        </form>
    );
};

function TextField({ register }: WithRegisterProps) {
    return (
        <input {...register} />
    );
};

function ControlledField({ field }: WithControllerProps) {
    return (
        <input
            name={field.name}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
        />
    );
}

function ArrayField({ array, renderItem }: WithArrayProps) {
    return (
        <div>
            {array.fields.map((_field, index) => renderItem(index))}
            <button onClick={() => array.append({})}>
                Add
            </button>
        </div>
    );
}

function ObjectField({ children }: WithObjectProps) {
    return (
        <div>
            {children}
        </div>
    );
}

interface FormValues {
    text: string;
    controlled: string;
    array: { valueX: string, valueY: number }[];
    object: {
        nestedOne: string;
        nestedTwo: string;
    };
}

function ExampleForm() {
    const fields: FieldSchemas<FormValues> = {
        text: {
            type: 'text',
        },
        controlled: {
            type: 'controlled',
        },
        array: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    valueX: {
                        type: 'text',
                    },
                    valueY: {
                        type: 'text',
                    },
                },
            },
        },
        object: {
            type: 'object',
            properties: {
                nestedOne: {
                    type: 'text',
                },
                nestedTwo: {
                    type: 'text',
                }
            },
        },
    };

    const onSubmit = (values: any) => {
        console.log(values);
    };

    return (
        <SchemaForm fields={fields} onSubmit={onSubmit} />
    );
}

export function App() {
    return (
        <FormProvider>
            <ExampleForm />
        </FormProvider>
    );
};
