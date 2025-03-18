import { useFieldRegister } from '../../hooks/useFieldRegister';
import { CustomFieldSchema, FieldWrapperProps } from '../../types';
import { FieldValues } from 'react-hook-form';

interface CustomFieldWrapperProps<TFormValues extends FieldValues, TRenderContext> extends FieldWrapperProps<TFormValues, TRenderContext> {
    readonly field: CustomFieldSchema<TRenderContext, TFormValues>;
}

export function CustomFieldWrapper<TFormValues extends FieldValues, TRenderContext>({
    form,
    field,
    name,
    readOnly,
    disabled,
    error,
    renderContext: context
}: CustomFieldWrapperProps<TFormValues, TRenderContext>) {

    const { title, description, placeholder } = field;

    // Get only the necessary props from register
    const { onBlur, onChange, ref } = useFieldRegister(form, name, field);

    const Component = field.Component;

    return (
        <Component
            ref={ref}
            onBlur={onBlur}
            onChange={onChange}
            // Field information
            name={name}
            title={title}
            description={description}
            placeholder={placeholder}
            readOnly={readOnly}
            disabled={disabled}
            // For select
            options={field.options}
            // Context
            renderContext={context}
            // Error
            error={error}
        />
    );
}
