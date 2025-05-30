import { SchemaFormField, SchemaFormRenderProps, useArrayField, useField, useObjectField } from '@basestacks/schema-form';
export interface FormRenderContext {
    readonly inputType?: string;
}

export function FormLayout({ form, onSubmit, children }: SchemaFormRenderProps<FormRenderContext>) {
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            {children}
            <button type="submit">Submit</button>
        </form>
    );
};

export function InputField() {
    const {
        field,
        name,
        placeholder,
        title,
        renderContext,
        error,
    } = useField<FormRenderContext>();

    return (
        <div className="field">
            <label htmlFor={name}>{title}</label>
            <input
                id={name}
                type={renderContext.inputType ?? 'text'}
                placeholder={placeholder}
                {...field}
            />
            {error?.message && <div className="field-error">{error?.message}</div>}
        </div>
    );
}

export function CheckboxField() {
    const {
        field,
        name,
        title,
        error
    } = useField<FormRenderContext>();

    return (
        <div className="field">
            <div>
                <input type="checkbox" id={name} {...field} />{' '}
                <label htmlFor={name}>{title}</label>
            </div>
            {error?.message && <div className="field-error">{error?.message}</div>}
        </div>
    );
}

export function SelectField() {
    const {
        field,
        schema,
        name,
        placeholder,
        title,
        error
    } = useField<FormRenderContext>();

    return (
        <div className="field">
            <label htmlFor={name}>{title}</label>
            <select {...field} id={name}>
                <option value="">
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

export function ObjectField() {
    const { fields } = useObjectField<FormRenderContext>();
    return (
        <div className="field-object">
            {fields.map((field) => (
                <div key={field} className="field-object-item">
                    <SchemaFormField name={field} />
                </div>
            ))}
        </div>
    );
}

export function ArrayField() {
    const { title, error, array, getItemName } = useArrayField<FormRenderContext>();
    return (
        <div className="field-array">
            <div>
                <label>{title}</label>
                {error?.root?.message && <div className="field-error">{error?.root?.message}</div>}
            </div>
            <div className="field-array-items">
                {array.fields.map((field, index) => (
                    <div key={field.id} className="field-array-item">
                        <SchemaFormField name={getItemName(index)} />
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
