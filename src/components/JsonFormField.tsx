import { ArrayPath, FieldError, FieldPath, FieldValues } from 'react-hook-form';
import { ArrayFieldWrapper } from './wrappers/ArrayFieldWrapper';
import { ObjectFieldWrapper } from './wrappers/ObjectFieldWrapper';
import { ArrayFieldSchema, ObjectFieldSchema, BaseFieldSchema, GenericFieldSchema, CustomFieldSchema } from '../types';
import { useFieldStatus } from '../hooks/useFieldStatus';
import { GenericFieldWrapper } from './wrappers/GenericFieldWrapper';
import { CustomFieldWrapper } from './wrappers/CustomFieldWrapper';
import { useFieldSchema } from '../hooks/useFieldSchema';
import { useSchemaForm } from '../hooks/useSchemaForm';
import { useMemo } from 'react';

export interface JsonFormFieldProps<TFormValues extends FieldValues = FieldValues, TContext = unknown> {
    readonly name: FieldPath<TFormValues>;
    readonly context?: TContext;
}

export function JsonFormField<TFormValues extends FieldValues = FieldValues, TContext = unknown>({ name, context }: JsonFormFieldProps<TFormValues, TContext>) {
    const { form, context: formContext } = useSchemaForm<TFormValues>();
    const formValues = form.getValues();

    const field = useFieldSchema(name);
    const fieldStatus = useFieldStatus(field as BaseFieldSchema, formValues);
    const fieldContext = useMemo(() => Object.assign({}, formContext, field.context, context), [context, field.context, formContext]);

    if (!fieldStatus.isVisible) {
        return null;
    }

    const error = form.formState.errors[name] as FieldError | undefined;

    const commonProps = {
        form,
        name,
        field,
        error,
        context: fieldContext,
        readOnly: fieldStatus.isReadOnly,
        disabled: fieldStatus.isDisabled
    };

    if (!field.type) {
        return (
            <CustomFieldWrapper
                {...commonProps}
                field={field as CustomFieldSchema<unknown, TFormValues>}
            />
        );
    }

    if (field.type === 'array') {
        return (
            <ArrayFieldWrapper
                {...commonProps}
                field={field as ArrayFieldSchema<any, unknown, TFormValues>}
                name={name as ArrayPath<TFormValues>}
                renderChild={(props) => <JsonFormField key={props.name} {...props} />}
            />
        );
    }

    if (field.type === 'object') {
        return (
            <ObjectFieldWrapper
                {...commonProps}
                field={field as ObjectFieldSchema<any, unknown, TFormValues>}
                renderChild={(props) => <JsonFormField key={props.name} {...props} />}
            />
        );
    }

    return (
        <GenericFieldWrapper
            {...commonProps}
            field={field as GenericFieldSchema<unknown, TFormValues>}
        />
    );
}
