import { useFieldRegister } from '../../hooks/useFieldRegister';
import { CustomFieldSchema, FieldWrapperProps } from '../../types';
import { FieldValues } from 'react-hook-form';

interface CustomFieldWrapperProps<TFormValues extends FieldValues, TContext> extends FieldWrapperProps<TFormValues, TContext> {
    readonly field: CustomFieldSchema<TContext, TFormValues>;
}

export function CustomFieldWrapper<TFormValues extends FieldValues, TContext>({
    form,
    field,
    name,
    readOnly,
    disabled,
    error,
    context
}: CustomFieldWrapperProps<TFormValues, TContext>) {

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
            context={context}
            // Error
            error={error}
        />
    );
}
