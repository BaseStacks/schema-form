import { SchemaFormRenderProps, WithArrayProps, WithObjectProps, WithRegisterProps } from '@basestacks/schema-form';

export interface FormRenderContext {
    readonly inputType: string;
}

export function FormLayout({ form, onSubmit, children }: SchemaFormRenderProps<FormRenderContext>) {
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            {children}
            <input type="submit" />
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
                data-error={error?.message}
                {...register}
            />
        </div>
    );
}

export function CheckboxField({
    name,
    title,
    register,
}: WithRegisterProps<FormRenderContext>) {
    return (
        <div className="field">
            <div>
                <input type="checkbox" id={name} {...register} />{' '}
                <label htmlFor={name}>{title}</label>
            </div>
        </div>
    );
}

export function SelectField({
    schema,
    register,
    name,
    title,
    placeholder,
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
        </div>
    );
}

export function ObjectField({ children }: WithObjectProps) {
    return <div className="field-object">{children}</div>;
}

export function ArrayField({ title, array, renderItem }: WithArrayProps) {
    return (
        <div className="field-array">
            <label>{title}</label>
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

