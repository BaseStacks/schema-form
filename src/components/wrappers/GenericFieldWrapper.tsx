import { useFieldComponent } from '../../hooks/useFieldComponent';
import { useFieldRegister } from '../../hooks/useFieldRegister';
import { GenericFieldProps, FieldWrapperProps, GenericFieldSchema } from '../../types';
import { FieldValues } from 'react-hook-form';

interface GenericFieldWrapperProps<TFormValues extends FieldValues, TContext> extends FieldWrapperProps<TFormValues, TContext> {
    readonly field: GenericFieldSchema<TContext, TFormValues>;
}

export function GenericFieldWrapper<TFormValues extends FieldValues, TContext>({
    form,
    field,
    name,
    readOnly,
    disabled,
    error,
    context
}: GenericFieldWrapperProps<TFormValues, TContext>) {
    const FieldComponent = useFieldComponent<GenericFieldProps<TContext, TFormValues>>(field.type);

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
            context={context}
            // Error
            error={error}
        />
    );
}
