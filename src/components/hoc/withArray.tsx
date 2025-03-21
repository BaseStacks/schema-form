import { ArrayPath, FieldPath, FieldValues, useFieldArray } from 'react-hook-form';
import { FieldWithArrayProps, FieldHocProps, RenderContext, ArrayFieldSchema } from '../../types';
import { SchemaFormField } from '../SchemaFormField';
import { useCallback } from 'react';

export interface FieldWithArrayWrapperProps<
    TRenderContext extends RenderContext,
    TFormValue extends FieldValues,
    TFieldValue extends FieldValues
> extends Omit<FieldHocProps<TRenderContext, TFormValue, TFieldValue>, 'name'> {
    readonly name: ArrayPath<TFormValue>;
}

export function withArray<TRenderContext extends RenderContext = RenderContext>(
    Component: React.ComponentType<FieldWithArrayProps<TRenderContext, any, any>>
) {
    return function FieldWithArray<TFieldValue extends FieldValues, TFormValue extends FieldValues>({
        form,
        schema,
        name,
        disabled,
        readOnly,
        renderContext,
        error
    }: FieldWithArrayWrapperProps<TRenderContext, TFormValue, TFieldValue>) {

        const arraySchema = schema as ArrayFieldSchema<TRenderContext, TFormValue, TFieldValue[]>;

        // Use fieldArray from react-hook-form to manage the array items
        const array = useFieldArray({
            control: form.control, name, rules: {
                minLength: arraySchema.minLength,
                maxLength: arraySchema.maxLength,
                required: arraySchema.required,
                validate: arraySchema.validate
            }
        });

        const { fields } = array;

        // Get min/max items constraints from field
        const minItems = typeof arraySchema.minLength === 'number' ? arraySchema.minLength : arraySchema.minLength?.value;
        const maxItems = typeof arraySchema.maxLength === 'number' ? arraySchema.maxLength : isNaN(arraySchema.maxLength?.value) ? Infinity : arraySchema.maxLength.value;

        // Check if we can add more items
        const canAddItem = !maxItems || fields.length < maxItems;
        // Check if we can remove items
        const canRemoveItem = fields.length > minItems;

        const renderItem = useCallback((index: number) => {
            const key = `${name}[${index}]` as FieldPath<TFormValue>;
            return <SchemaFormField key={key} name={key} renderContext={renderContext} />;
        }, [name, renderContext]); // Add fields as dependency

        return (
            <Component
                array={array}
                schema={arraySchema}
                name={name}
                title={arraySchema.title}
                description={arraySchema.description}
                placeholder={arraySchema.placeholder}
                canAddItem={canAddItem}
                canRemoveItem={canRemoveItem}
                required={!!arraySchema.required}
                readOnly={readOnly}
                renderItem={renderItem}
                disabled={disabled}
                renderContext={renderContext}
                error={error}
            />
        );
    };
};

