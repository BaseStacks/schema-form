import { ArrayPath, FieldPath, FieldValues, useFieldArray } from 'react-hook-form';
import { ArrayFieldSchema, FieldWithArrayProps, FieldWrapperProps, RenderContext } from '../../types';
import { SchemaFormField } from '../SchemaFormField';
import { useCallback } from 'react';

export interface FieldWithArrayWrapperProps<
    TFieldValue extends FieldValues,
    TFormValue extends FieldValues,
    TRenderContext
> extends Omit<FieldWrapperProps<TFormValue, TRenderContext>, 'name'> {
    readonly name: ArrayPath<TFormValue>;
    readonly schema: ArrayFieldSchema<TFieldValue, TRenderContext, TFormValue>;
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
    }: FieldWithArrayWrapperProps<TFieldValue, TFormValue, TRenderContext>) {

        // Use fieldArray from react-hook-form to manage the array items
        const array = useFieldArray({
            control: form.control, name, rules: {
                minLength: schema.minLength,
                maxLength: schema.maxLength,
                required: schema.required,
                validate: schema.validate
            }
        });

        const { fields } = array;

        // Get min/max items constraints from field
        const minItems = typeof schema.minLength === 'number' ? schema.minLength : schema.minLength?.value;
        const maxItems = typeof schema.maxLength === 'number' ? schema.maxLength : isNaN(schema.maxLength?.value) ? Infinity : schema.maxLength.value;

        // Check if we can add more items
        const canAddItem = !schema.readOnly && (!maxItems || fields.length < (maxItems));
        // Check if we can remove items
        const canRemoveItem = !schema.readOnly && fields.length > minItems;

        const renderItem = useCallback((index: number) => {
            const key = `${name}[${index}]` as FieldPath<TFormValue>;
            return <SchemaFormField key={key} name={key} renderContext={renderContext} />;
        }, [name, renderContext]); // Add fields as dependency

        return (
            <Component
                array={array}
                schema={schema}
                name={name}
                title={schema.title}
                description={schema.description}
                placeholder={schema.placeholder}
                canAddItem={canAddItem}
                canRemoveItem={canRemoveItem}
                required={!!schema.required}
                readOnly={readOnly}
                renderItem={renderItem}
                disabled={disabled}
                renderContext={renderContext}
                error={error}
            />
        );
    };
};

