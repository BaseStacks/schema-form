import './i18n';

import { JsonFormProvider } from '../../../src/components/JsonFormProvider';
import { useTranslation } from 'react-i18next';
import { ArrayFieldProps, GenericFieldProps, JsonFormInnerProps, ObjectFieldProps } from '../../../src/types';
import { useState } from 'react';

export interface FormContext {
    readonly secureText?: boolean;
    readonly submitLabel?: string;
}

export function AdvanceFormProvider({ children }: React.PropsWithChildren<{}>) {
    const { t } = useTranslation();
    return (
        <JsonFormProvider
            components={{
                Form: FormLayout,
                fields: {
                    array: ArrayField,
                    object: ObjectField,
                    text: TextField,
                    textarea: TextArea,
                    checkbox: CheckboxField,
                    select: SelectField,
                    number: NumberField,
                }
            }}
            getDefaultMessages={(validation) => {
                return {
                    required: t('validation.required'),
                    minLength: t('validation.minLength', { minLength: validation.minLength }),
                    maxLength: t('validation.maxLength', { maxLength: validation.maxLength }),
                    pattern: t('validation.pattern'),
                    min: t('validation.min', { min: validation.min }),
                    max: t('validation.max', { max: validation.max }),
                };
            }}
        >
            {children}
        </JsonFormProvider>
    );
};

export function FormLayout({ form, children, onSubmit, context }: JsonFormInnerProps<FormContext, any>) {
    const { t } = useTranslation();
    return (
        <form onSubmit={onSubmit && form.handleSubmit(onSubmit)} className="w-[350px]" >
            <div className="gap-4 grid grid-cols-12">
                {children}
            </div>
            <div className="mt-4">
                <FormSubmitBtn>
                    {t(context.submitLabel ?? 'Submit')}
                </FormSubmitBtn>
            </div>
        </form>
    );
};

export function FormSubmitBtn({ children }: React.PropsWithChildren<{}>) {
    return (
        <button
            type="submit"
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs disabled:bg-gray-300 hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            {children}
        </button>
    );
}

export function FieldWrapper({ children, name, title, required }: Pick<GenericFieldProps<FormContext>, 'name' | 'title' | 'required' | 'error'> & { children: React.ReactNode; }) {
    const { t } = useTranslation();
    return (
        <div className="col-span-12">
            {title && <label htmlFor={name} className="block text-sm font-medium mb-2 text-gray-900">{t(title)} {required && '*'}</label>}
            {children}
        </div>
    );
};

export function TextField({ ref, name, title, placeholder, required, readOnly, disabled, onChange, onBlur, error, context }: GenericFieldProps<FormContext>) {
    const { t } = useTranslation();

    return (
        <FieldWrapper name={name} title={title} required={required} error={error}>
            <input
                ref={ref}
                type={context.secureText ? 'password' : 'text'}
                name={name}
                id={name}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={t(placeholder)}
                readOnly={readOnly}
                disabled={disabled}
                className="block w-full rounded-md bg-white px-3 h-9 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6 invalid:!outline-red-500 invalid:text-red-500"
            />

        </FieldWrapper>
    );
};

export function TextArea({ ref, name, title, placeholder, required, readOnly, disabled, onChange, onBlur, error }: GenericFieldProps<FormContext>) {
    const { t } = useTranslation();

    return (
        <FieldWrapper name={name} title={title} required={required} error={error}>
            <textarea
                ref={ref}
                name={name}
                id={name}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={t(placeholder)}
                readOnly={readOnly}
                disabled={disabled}
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6 invalid:!outline-red-500 invalid:text-red-500"
            />

        </FieldWrapper>
    );
};

export function NumberField({ ref, name, title, placeholder, required, readOnly, disabled, onChange, onBlur, error }: GenericFieldProps<FormContext>) {
    const { t } = useTranslation();

    return (
        <FieldWrapper name={name} title={title} required={required} error={error}>
            <input
                ref={ref}
                type="number"
                name={name}
                id={name}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={t(placeholder)}
                readOnly={readOnly}
                disabled={disabled}
                className="block w-full rounded-md bg-white px-3 h-9 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6 invalid:!outline-red-500 invalid:text-red-500"
            />
        </FieldWrapper>
    );
};

export function CheckboxField({ ref, name, title, required, onChange, onBlur }: GenericFieldProps<FormContext>) {
    const { t } = useTranslation();

    return (
        <FieldWrapper name={name}>
            <div className="flex items-center">
                <input
                    ref={ref}
                    type="checkbox"
                    name={name}
                    id={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    required={required}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <label htmlFor={name} className="ml-2 block text-sm font-medium text-gray-900">{t(title)} {required && '*'}</label>
            </div>
        </FieldWrapper>
    );
}

export function SelectField({ ref, name, title, placeholder, required, options, onChange, onBlur, error }: GenericFieldProps<FormContext> & { options: { value: string; label: string; }[]; }) {
    const { t } = useTranslation();

    return (
        <FieldWrapper name={name} title={title} required={required} error={error}>
            <div className="grid">
                <svg className="pointer-events-none relative right-1 z-10 col-start-1 row-start-1 h-4 w-4 self-center justify-self-end forced-colors:hidden" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path></svg>
                <select
                    ref={ref}
                    name={name}
                    id={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    required={required}
                    className="col-start-1 row-start-1 block w-full rounded-md bg-white px-3 h-9 text-base text-gray-900 appearance-none outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6 invalid:!outline-red-500 invalid:text-red-500"
                >
                    <option value="" disabled selected>{t(placeholder)}</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{t(option.label)}</option>
                    ))}
                </select>
            </div>
        </FieldWrapper>
    );
}

export function ObjectField({ children }: ObjectFieldProps<FormContext>) {
    return (
        <div className="gap-2 grid grid-cols-12 col-span-12">
            {children}
        </div>
    );
}

export function ArrayField({ name, title, placeholder, array, required, canAddItem, renderItem, error }: ArrayFieldProps<FormContext>) {
    const { t } = useTranslation();

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
                        >
                            {t('form.array.remove')}
                        </button>
                    </div>
                ))}
                <ArrayAddField
                    onItemAdd={(value) => {
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
    const { t } = useTranslation();

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
                    placeholder={t(placeholder)}
                    disabled={disabled}
                    className="block w-full rounded-md bg-white px-3 h-9 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 disabled:opacity-50 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6 invalid:!outline-red-500 invalid:text-red-500"
                />
            </div>
            <button
                disabled={!value || disabled}
                onClick={submit}
                className="col-span-3 rounded-md border px-3 h-9 py-2 text-sm font-semibold shadow-xs disabled:opacity-50 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
                {t('form.array.add')}
            </button>
        </div>
    );
};
