import { useFieldComponent } from '../../hooks/useFieldComponent';
import { useFieldRegister } from '../../hooks/useFieldRegister';
import { GenericFieldProps, FieldWrapperProps, GenericFieldSchema } from '../../types';
import { FieldValues } from 'react-hook-form';

interface GenericFieldWrapperProps<TFormValues extends FieldValues, TRenderContext> extends FieldWrapperProps<TFormValues, TRenderContext> {
    readonly field: GenericFieldSchema<TRenderContext, TFormValues>;
}

export function GenericFieldWrapper<TFormValues extends FieldValues, TRenderContext>({
    form,
    field,
    name,
    readOnly,
    disabled,
    error,
    renderContext
}: GenericFieldWrapperProps<TFormValues, TRenderContext>) {
    const FieldComponent = useFieldComponent<GenericFieldProps<TRenderContext, TFormValues>>(field.type);

    if (!FieldComponent) {
        throw new Error(`Field component not found for type: ${field.type}`);
    }

    const { title, description, placeholder } = field;

    // Get only the necessary props from register
    const { onBlur, onChange, ref } = useFieldRegister(form, name, field);

    return (
        <FieldComponent
            key={name}
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
            renderContext={renderContext}
            // Error
            error={error}
        />
    );
}
