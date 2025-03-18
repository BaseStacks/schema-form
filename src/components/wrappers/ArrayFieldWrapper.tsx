import React, { useCallback } from 'react';
import { ArrayPath, FieldError, FieldPath, FieldValues, useFieldArray, UseFormReturn } from 'react-hook-form';
import { ArrayFieldProps, ArrayFieldSchema, RenderProps } from '../../types';
import { useFieldComponent } from '../../hooks/useFieldComponent';
import { JsonFormFieldProps } from '../JsonFormField';

export interface ArrayFieldWrapperProps<
    TFieldValue extends FieldValues,
    TFormValues extends FieldValues,
    TContext
> {
    form: UseFormReturn<TFormValues>;
    name: ArrayPath<TFormValues>;
    field: ArrayFieldSchema<TFieldValue, TContext, TFormValues>;
    disabled?: boolean;
    readOnly?: boolean;
    context?: TContext;
    error?: FieldError;
    renderChild: (props: JsonFormFieldProps<TFormValues, TContext>) => React.ReactNode;
}

export function ArrayFieldWrapper<
    TFieldValue extends FieldValues,
    TFormValues extends FieldValues,
    TContext = RenderProps
>({
    form,
    name,
    field,
    disabled,
    readOnly,
    context,
    error,
    renderChild
}: ArrayFieldWrapperProps<TFieldValue, TFormValues, TContext>) {
    const FieldComponent = useFieldComponent<ArrayFieldProps<TContext, TFieldValue, TFormValues>>('array');

    // Use fieldArray from react-hook-form to manage the array items
    const array = useFieldArray({
        control: form.control, name, rules: {
            minLength: field.minLength,
            maxLength: field.maxLength,
            required: field.required,
            validate: field.validate
        }
    });

    const { fields } = array;

    // Get min/max items constraints from field
    const minItems = typeof field.minLength === 'number' ? field.minLength : field.minLength?.value;
    const maxItems = typeof field.maxLength === 'number' ? field.maxLength : isNaN(field.maxLength?.value) ? Infinity : field.maxLength.value;

    // Check if we can add more items
    const canAddItem = !field.readOnly && (!maxItems || fields.length < (maxItems));
    // Check if we can remove items
    const canRemoveItem = !field.readOnly && fields.length > minItems;

    const renderItem = useCallback((index: number) => {
        return renderChild({
            name: `${name}[${index}]` as FieldPath<TFormValues>,
            context: context
        });
    }, [name, renderChild, context]); // Add fields as dependency

    return (
        <FieldComponent
            key={name}
            field={field}
            disabled={disabled}
            context={context}
            array={array}
            error={error}
            name={name}
            title={field.title}
            description={field.description}
            placeholder={field.placeholder}
            canAddItem={canAddItem}
            canRemoveItem={canRemoveItem}
            required={!!field.required}
            readOnly={readOnly}
            renderItem={renderItem}
        />
    );
}
