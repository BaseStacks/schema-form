import React, { useCallback } from 'react';
import { ArrayPath, FieldPath, FieldValues, useFieldArray } from 'react-hook-form';
import { ArrayFieldProps, ArrayFieldSchema, FieldWrapperProps, RenderContext } from '../../types';
import { useFieldComponent } from '../../hooks/useFieldComponent';
import { SchemaFormFieldProps } from '../SchemaFormField';

export interface ArrayFieldWrapperProps<
    TFieldValue extends FieldValues,
    TFormValues extends FieldValues,
    TRenderContext
> extends Omit<FieldWrapperProps<TFormValues, TRenderContext>, 'name'> {
    readonly name: ArrayPath<TFormValues>;
    readonly field: ArrayFieldSchema<TFieldValue, TRenderContext, TFormValues>;
    readonly renderChild: (props: SchemaFormFieldProps<TFormValues, TRenderContext>) => React.ReactNode;
}

export function ArrayFieldWrapper<
    TFieldValue extends FieldValues,
    TFormValues extends FieldValues,
    TRenderContext = RenderContext
>({
    form,
    name,
    field,
    disabled,
    readOnly,
    renderContext,
    error,
    renderChild
}: ArrayFieldWrapperProps<TFieldValue, TFormValues, TRenderContext>) {
    const FieldComponent = useFieldComponent<ArrayFieldProps<TRenderContext, TFieldValue, TFormValues>>('array');

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
            renderContext
        });
    }, [name, renderChild, renderContext]); // Add fields as dependency

    return (
        <FieldComponent
            key={name}
            field={field}
            disabled={disabled}
            renderContext={renderContext}
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
