import React from 'react';
import { withArray, SchemaFormProvider, SchemaFormRenderProps, GenericFieldProps, WithArrayProps, WithRegisterProps, withRegister, WithObjectProps, withObject } from '@basestacks/schema-form';
import { useState } from 'react';

export interface RenderContext {
    readonly secureText?: boolean;
    readonly submitLabel?: string;
    readonly options?: { value: string; label: string }[];
}

export function FormProvider({ children }: React.PropsWithChildren<{}>) {
    return (
        <SchemaFormProvider
            components={{
                Form: FormLayout,
                fields: {
                    array: withArray(ArrayField),
                    object: withObject(ObjectField),
                    text: withRegister(TextField),
                    password: withRegister(TextField),
                    checkbox: withRegister(CheckboxField),
                    select: withRegister(SelectField),
                    number: withRegister(NumberField),
                }
            }}
            getDefaultMessages={(validation) => {
                return {
                    required: 'this field is required',
                    minLength: `Must be at least ${validation.minLength} characters long`,
                    maxLength: `Must be at most ${validation.maxLength} characters long`,
                    pattern: 'Invalid format',
                    min: `Must be at least ${validation.min}`,
                    max: `Must be at most ${validation.max}`,
                };
            }}
        >
            {children}
        </SchemaFormProvider>
    );
};

export function FormLayout({ form, children, onSubmit, renderContext }: SchemaFormRenderProps<RenderContext, any>) {
    return (
        <form onSubmit={onSubmit && form.handleSubmit(onSubmit)} className="w-[350px]" >
            <div className="gap-4 grid grid-cols-12">
                {children}
            </div>
            <div className="mt-4">
                <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs disabled:bg-gray-300 hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    {renderContext.submitLabel ?? 'Submit'}
                </button>
            </div>
        </form>
    );
};

export function FieldWrapper({ children, name, title, required }: Pick<GenericFieldProps<RenderContext>, 'name' | 'title' | 'required' | 'error'> & { children: React.ReactNode; }) {
    return (
        <div className="col-span-12">
            {title && <label htmlFor={name} className="block text-sm font-medium mb-2 text-gray-900">{title} {required && '*'}</label>}
            {children}
        </div>
    );
};

export function TextField({ name, title, placeholder, required, readOnly, disabled, error, register, renderContext }: WithRegisterProps<RenderContext>) {
    return (
        <FieldWrapper name={name} title={title} required={required} error={error}>
            <input
                {...register}
                type={renderContext.secureText ? 'password' : 'text'}
                name={name}
                id={name}
                placeholder={placeholder}
                readOnly={readOnly}
                disabled={disabled}
                className="block w-full rounded-md bg-white px-3 h-9 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6 invalid:!outline-red-500 invalid:text-red-500"
            />

        </FieldWrapper>
    );
};

export function NumberField({ register, name, title, placeholder, required, readOnly, disabled, error }: WithRegisterProps<RenderContext>) {
    return (
        <FieldWrapper name={name} title={title} required={required} error={error}>
            <input
                {...register}
                type="number"
                name={name}
                id={name}
                placeholder={placeholder}
                readOnly={readOnly}
                disabled={disabled}
                className="block w-full rounded-md bg-white px-3 h-9 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6 invalid:!outline-red-500 invalid:text-red-500"
            />
        </FieldWrapper>
    );
};

export function CheckboxField({ register, name, title, required, }: WithRegisterProps<RenderContext>) {
    return (
        <FieldWrapper name={name}>
            <div className="flex items-center">
                <input
                    {...register}
                    type="checkbox"
                    name={name}
                    id={name}
                    required={required}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <label htmlFor={name} className="ml-2 block text-sm font-medium text-gray-900">{title} {required && '*'}</label>
            </div>
        </FieldWrapper>
    );
}

export function SelectField({ register, name, title, placeholder, required, error, renderContext }: WithRegisterProps<RenderContext>) {
    return (
        <FieldWrapper name={name} title={title} required={required} error={error}>
            <div className="grid">
                <svg className="pointer-events-none relative right-1 z-10 col-start-1 row-start-1 h-4 w-4 self-center justify-self-end forced-colors:hidden" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path></svg>
                <select
                    {...register}
                    name={name}
                    id={name}
                    required={required}
                    className="col-start-1 row-start-1 block w-full rounded-md bg-white px-3 h-9 text-base text-gray-900 appearance-none outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6 invalid:!outline-red-500 invalid:text-red-500"
                >
                    <option value="">{placeholder}</option>
                    {renderContext.options?.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
        </FieldWrapper>
    );
}

export function ObjectField({ children }: WithObjectProps<RenderContext>) {
    return (
        <div className="gap-2 grid grid-cols-12 col-span-12">
            {children}
        </div>
    );
}

export function ArrayField({ name, title, placeholder, array, required, canAddItem, renderItem, error }: WithArrayProps<RenderContext>) {
    return (
        <FieldWrapper name={name} required={required} title={title}>
            {error?.root && <div className="text-red-500 text-sm mb-2">{error.root.message}</div>}
            <div className="gap-2 grid grid-cols-12 mb-2">
                {array.fields?.map((field, index) => (
                    <div className="grid col-span-12 grid-cols-12 gap-2">
                        <div className="col-span-9">
                            {renderItem(index)}
                        </div>
                        <button
                            onClick={() => array.remove(index)}
                            className="col-span-3 rounded-md border px-3 h-9 py-2 text-sm font-semibold shadow-xs disabled:bg-gray-300 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            data-testid={`array-remove-button-${index}`}
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <ArrayAddField
                    onItemAdd={(value) => {
                        console.log('Adding', value);
                        array.append({
                            value,
                        });
                    }}
                    placeholder={placeholder}
                    disabled={!canAddItem}
                />
            </div>
        </FieldWrapper>
    );
}


interface ArrayAddFieldProps {
    placeholder?: string;
    disabled?: boolean;
    onItemAdd: (values: string) => void;
}

function ArrayAddField({ placeholder, disabled, onItemAdd }: ArrayAddFieldProps) {
    const [value, setValue] = useState('');

    const submit = () => {
        onItemAdd(value);
        setValue('');
    };

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            submit();
            e.preventDefault();
        }
    };

    return (
        <div className="grid col-span-12 grid-cols-12 gap-2 mt-2">
            <div className="col-span-9">
                <input
                    value={value}
                    onKeyDown={onInputKeyDown}
                    onChange={e => setValue(e.target.value)}
                    type="text"
                    placeholder={placeholder}
                    disabled={disabled}
                    className="block w-full rounded-md bg-white px-3 h-9 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 disabled:opacity-50 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6 invalid:!outline-red-500 invalid:text-red-500"
                    data-testid="array-add-input"
                />
            </div>
            <button
                disabled={!value || disabled}
                onClick={submit}
                className="col-span-3 rounded-md border px-3 h-9 py-2 text-sm font-semibold shadow-xs disabled:opacity-50 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                data-testid="array-add-button"
            >
                Add
            </button>
        </div>
    );
};
