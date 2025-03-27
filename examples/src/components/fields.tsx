import { SchemaFormRenderProps, WithArrayProps, WithObjectProps, WithRegisterProps } from '@basestacks/schema-form';

export interface FormRenderContext {
    readonly inputType: string;
}

export function FormLayout({ form, onSubmit, children }: SchemaFormRenderProps<FormRenderContext>) {
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            {children}
            <button type="submit">Submit</button>
        </form>
    );
};

export function InputField({
    name,
    placeholder,
    title,
    register,
    renderContext,
    error
}: WithRegisterProps<FormRenderContext>) {
    return (
        <div className="field">
            <label htmlFor={name}>{title}</label>
            <input
                id={name}
                type={renderContext.inputType ?? 'text'}
                placeholder={placeholder}
                {...register}
            />
            {error?.message && <div className="field-error">{error?.message}</div>}
        </div>
    );
}

export function CheckboxField({
    name,
    title,
    register,
    error
}: WithRegisterProps<FormRenderContext>) {
    return (
        <div className="field">
            <div>
                <input type="checkbox" id={name} {...register} />{' '}
                <label htmlFor={name}>{title}</label>
            </div>
            {error?.message && <div className="field-error">{error?.message}</div>}
        </div>
    );
}

export function SelectField({
    schema,
    register,
    name,
    title,
    placeholder,
    error,
}: WithRegisterProps<FormRenderContext>) {
    return (
        <div className="field">
            <label htmlFor={name}>{title}</label>
            <select {...register}>
                <option selected value="">
                    {placeholder}
                </option>
                {schema?.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            {error?.message && <div className="field-error">{error?.message}</div>}
        </div>
    );
}

export function ObjectField({ children }: WithObjectProps) {
    return <div className="field-object">{children}</div>;
}

export function ArrayField({ title, array, error, renderItem }: WithArrayProps) {
    return (
        <div className="field-array">
            <div>
                <label>{title}</label>
                {error?.root?.message && <div className="field-error">{error?.root?.message}</div>}
            </div>
            <div className="field-array-items">
                {array.fields.map((field, index) => (
                    <div key={field.id} className="field-array-item">
                        {renderItem(index)}
                        <button onClick={() => array.remove(index)}>x</button>
                    </div>
                ))}
            </div>
            <button type="button" onClick={() => array.append({})}>
                Add
            </button>
        </div>
    );
}
